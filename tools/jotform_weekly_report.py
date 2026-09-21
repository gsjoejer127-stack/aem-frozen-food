#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""周报生成器：读 JSON，输出「上周出库总结」PDF 和邮件正文。

用法：python3 tools/jotform_weekly_report.py data.json out.pdf [body.txt]

JSON 结构（数量为数字，时间 "YYYY-MM-DD HH:MM"）：
{
  "period":  {"start":"2026-09-14","end":"2026-09-20","generated":"2026-09-21"},
  "intake":  [{"time","material","kg","supplier","receiver","remark"}, ...],
  "issue":   [{"time","material","kg","batch","purpose","requester","remark"}, ...],
  "packing": [{"time","prod_date","batch","product","packs","kg","spec","operator","remark"}, ...]
}
依赖 reportlab。中文用内置 STSong-Light（不嵌入），体积小，便于邮件附件。
"""
import json, re, sys
from collections import OrderedDict
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

# ---------------------------------------------------------------- 名称归并
MATERIAL = [
    (r"^67\s*beef|67号?\s*牛肉|beef\s*67|cube\s*roll", "牛肉 67"),
    (r"^45\s*beef|4\.5\s*beef|beef\s*45|rump", "牛肉 45"),
    (r"^ayam\s*bl|无骨鸡腿|^ayam$", "鸡腿肉"),
    (r"gizard|gizzard|鸡胗", "鸡胗"),
    (r"chicken\s*wing|鸡翅|kepak|mid\s*joint", "鸡翅"),
    (r"minced\s*chicken|chicken\s*fillet|鸡碎", "鸡碎肉"),
    (r"kab[ai]?m?[bg]|kambing|mutton|羊肉", "羊肉"),
    (r"tepung\s*pulut|糯米粉", "糯米粉"),
    (r"minyak|miyak|食用油|soya\s*bean\s*oil", "食用油"),
    (r"^gula|白糖|^sugar", "糖"),
    (r"sichuan|mala\s*soup|麻辣汤", "麻辣汤底"),
    (r"sesame", "麻油"),
    (r"木薯|tepung\s*ubi", "木薯粉"),
    (r"sayur|telur|veg", "蔬菜鸡蛋"),
    (r"盐|味精|鸡精|鲜味|胡椒|辣椒|孜然|花椒|芝麻|花生|黄豆|软化剂|撒粉|tepung\s*uli", "调味料"),
]
PRODUCT = [
    (r"kepak", "鸡翅串"), (r"pedal", "鸡胗串"),
    (r"sate\s*ayam|鸡肉串", "鸡肉串"),
    (r"sate\s*daging\s*mala|麻辣牛肉串", "麻辣牛肉串"),
    (r"sate\s*daging\s*nenas", "黄梨牛肉串"),
    (r"sate\s*daging|牛肉串", "牛肉串"),
    (r"sate\s*kambing\s*mala|麻辣羊肉串", "麻辣羊肉串"),
    (r"sate\s*kambing|羊肉串", "羊肉串"),
    (r"bbq\s*marinated|bmb|daging\s*di\s*?perap|marinated\s*beef|腌制", "腌制牛肉"),
    (r"masak\s*merah|红烧牛肉", "红烧牛肉"),
    (r"mala\s*bbq", "麻辣烧烤"), (r"^bbq$", "烧烤"),
    (r"gula\s*merah", "椰糖糯米糕"), (r"pulut\s*goreng|kpg", "炸糯米糕"),
    (r"claypot|clay\s*pot", "砂锅鸡"), (r"chicken\s*wing", "鸡翅"),
    (r"cincang", "茄子鸡碎"),
]
PURPOSE = [
    (r"satay|sate(?!\s*\w)", "沙爹 Satay"),
    (r"bbq|烧烤", "烧烤 BBQ"),
    (r"kuih\s*pulut\s*goreng|pulut\s*goreng|炸糯米", "炸糯米糕"),
    (r"kuih\s*pulut|kpg|糯米|糍粑", "糯米糕"),
    (r"masak", "红烧 Masak"),
    (r"料包|腌料|腌制", "腌料 / 腌制"),
]
def canon(x, table):
    s = str(x).strip().lower()
    for pat, label in table:
        if re.search(pat, s): return label
    return str(x).strip() or "—"
CJK = re.compile(r"([⺀-鿿＀-￯　-〿]+)")
def t(s): return CJK.sub(r'<font name="STSong-Light">\1</font>', str(s))
def n(x):
    try: return float(x)
    except (TypeError, ValueError): return 0.0
def fmt(x):
    return "" if x in (None, "") else f"{float(x):,g}"
WD = ["一", "二", "三", "四", "五", "六", "日"]
def wd(d): return WD[datetime.strptime(d, "%Y-%m-%d").weekday()]

# ---------------------------------------------------------------- 异常标记
def flag_intake(r):
    rem = str(r.get("remark", "")).lower()
    if re.search(r"no\s*exp|tiada\s*tarikh|tanpa\s*exp|无到期|没有到期", rem): return "无到期日"
    return "" if re.search(r"exp|luput|到期|\d{1,2}/\d{1,2}/\d{2,4}", rem) else "无到期日"
def flag_issue(r):
    f = []
    if not str(r.get("batch", "")).strip(): f.append("缺批次号")
    if n(r.get("kg")) >= 500: f.append(f"数量 {fmt(r['kg'])} kg 异常")
    if re.search(r"\d{8,}", str(r.get("material", ""))): f.append("物料名混入条码")
    return "；".join(f)
DMY = re.compile(r"^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$")
def flag_pack(r):
    m = DMY.match(str(r.get("prod_date", "")).strip())
    if m:
        d, mo, y = (int(x) for x in m.groups()); y += 2000 if y < 100 else 0
        try:
            gap = abs((datetime(y, mo, d) - datetime.strptime(r["time"][:10], "%Y-%m-%d")).days)
            if gap > 10: return f"生产日期相差 {gap} 天"
        except ValueError: pass
    kg, packs = r.get("kg"), n(r.get("packs"))
    if kg in (None, ""): return "未填原料 kg"
    spec = str(r.get("spec", "")).lower()
    w = 0.4 if "400" in spec else 2.0 if "2kg" in spec else 1.0 if "1kg" in spec else 0.2 if "200" in spec else 0.35 if "350" in spec else None
    if n(kg) <= 0 or not w: return ""
    if packs * w > n(kg) * 2.5: return "原料偏少"
    if packs * w < n(kg) * 0.25: return "产量偏少"
    return ""

# ---------------------------------------------------------------- 主流程
INK, LINE, HEAD, ZEBRA, TOTROW, WARNBG = (colors.HexColor(c) for c in
    ("#16324a", "#d5dce2", "#16324a", "#f6f8fa", "#e8eef3", "#fff6e5"))

def build(data, out_pdf, out_txt=None):
    P0 = data["period"]
    start, end = P0["start"], P0["end"]
    gen = P0.get("generated", datetime.now().strftime("%Y-%m-%d"))
    IN = data.get("intake", []); IS = data.get("issue", []); PK = data.get("packing", [])
    for r in IN: r["_f"] = flag_intake(r)
    for r in IS: r["_f"] = flag_issue(r)
    for r in PK: r["_f"] = flag_pack(r)

    ok = lambda r: "异常" not in r["_f"]
    in_t = sum(n(r["kg"]) for r in IN)
    is_t = sum(n(r["kg"]) for r in IS if ok(r))
    pk_t = sum(n(r["packs"]) for r in PK)
    pk_kg = sum(n(r["kg"]) for r in PK)

    def roll(rows, key, table, qk, guard=True):
        d = OrderedDict()
        for r in rows:
            k = canon(r[key], table)
            d.setdefault(k, [0, 0.0]); d[k][0] += 1
            if not guard or ok(r): d[k][1] += n(r.get(qk))
        return sorted(d.items(), key=lambda kv: -kv[1][1])
    mat, pur, prod = roll(IS, "material", MATERIAL, "kg"), roll(IS, "purpose", PURPOSE, "kg"), roll(PK, "product", PRODUCT, "packs")

    pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
    base = ParagraphStyle("b", fontName="Helvetica", fontSize=8.5, leading=11)
    st = dict(
        b=base,
        r=ParagraphStyle("r", parent=base, alignment=2),
        h1=ParagraphStyle("h1", parent=base, fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=INK),
        sub=ParagraphStyle("sub", parent=base, fontSize=8.5, leading=12, textColor=colors.HexColor("#5b6b7a")),
        h2=ParagraphStyle("h2", parent=base, fontName="Helvetica-Bold", fontSize=10, leading=13,
                          spaceBefore=13, spaceAfter=5, textColor=INK, keepWithNext=1),
        th=ParagraphStyle("th", parent=base, fontSize=8, leading=10, textColor=colors.white),
        thr=ParagraphStyle("thr", parent=base, fontSize=8, leading=10, textColor=colors.white, alignment=2),
        kl=ParagraphStyle("kl", parent=base, fontSize=8, leading=10, textColor=colors.HexColor("#5b6b7a")),
        kv=ParagraphStyle("kv", parent=base, fontName="Helvetica-Bold", fontSize=16, leading=19, textColor=INK),
        note=ParagraphStyle("note", parent=base, fontSize=7.5, leading=10, textColor=colors.HexColor("#6b7a88")),
    )
    P = lambda s, k="b": Paragraph(t(s), st[k])

    def table(head, rows, widths, numcols, total=None, warn=()):
        data_ = [[P(h, "thr" if i in numcols else "th") for i, h in enumerate(head)]]
        data_ += [[P(c, "r" if i in numcols else "b") for i, c in enumerate(row)] for row in rows]
        extra = [("BACKGROUND", (0, i), (-1, i), ZEBRA) for i in range(2, len(rows) + 1, 2)]
        if total:
            data_.append([P(f"<b>{c}</b>", "r" if i in numcols else "b") for i, c in enumerate(total)])
            extra += [("BACKGROUND", (0, -1), (-1, -1), TOTROW), ("LINEABOVE", (0, -1), (-1, -1), 0.7, INK)]
        extra += [("BACKGROUND", (0, i + 1), (-1, i + 1), WARNBG) for i in warn]
        tb = Table(data_, colWidths=[w * mm for w in widths], repeatRows=1, hAlign="LEFT")
        tb.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), HEAD),
            ("LINEBELOW", (0, 0), (-1, -1), 0.3, LINE),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 3.2), ("BOTTOMPADDING", (0, 0), (-1, -1), 3.2),
            ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ] + extra))
        return tb

    pct = lambda v, tot: f"{v / tot * 100:.0f}%" if tot else "—"
    W = 188  # 可用宽度 mm

    story = [P("上周出库总结", "h1"),
             P(f"{start}（周{wd(start)}） 至 {end}（周{wd(end)}） &nbsp;·&nbsp; 生成日期 {gen}", "sub"),
             Spacer(1, 10)]

    # KPI
    kpi = [[P("原材料出库", "kl"), P("出库笔数", "kl"), P("生产产出", "kl"), P("原材料入库", "kl")],
           [P(f"{fmt(is_t)} kg", "kv"), P(f"{len(IS)}", "kv"), P(f"{int(pk_t):,} packs", "kv"), P(f"{fmt(in_t)} kg", "kv")]]
    k = Table(kpi, colWidths=[W / 4 * mm] * 4, hAlign="LEFT")
    k.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.5, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
                           ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#fbfcfd")),
                           ("TOPPADDING", (0, 0), (-1, 0), 7), ("BOTTOMPADDING", (0, 0), (-1, 0), 0),
                           ("TOPPADDING", (0, 1), (-1, 1), 1), ("BOTTOMPADDING", (0, 1), (-1, 1), 7),
                           ("LEFTPADDING", (0, 0), (-1, -1), 9)]))
    story.append(k)

    # 出库物料
    story.append(P("出库物料", "h2"))
    story.append(table(["物料", "笔数", "数量 kg", "占比"],
                       [[a, str(v[0]), fmt(v[1]), pct(v[1], is_t)] for a, v in mat],
                       [88, 24, 40, 36], {1, 2, 3}, ["合计", str(len(IS)), fmt(is_t), "100%"]))

    # 出库用途
    story.append(P("出库用途", "h2"))
    story.append(table(["用途", "笔数", "数量 kg", "占比"],
                       [[a, str(v[0]), fmt(v[1]), pct(v[1], is_t)] for a, v in pur],
                       [88, 24, 40, 36], {1, 2, 3}, ["合计", str(len(IS)), fmt(is_t), "100%"]))

    # 生产产出
    story.append(P("生产产出", "h2"))
    kgof = lambda lb: sum(n(r["kg"]) for r in PK if canon(r["product"], PRODUCT) == lb)
    story.append(table(["产品", "批次", "产出 packs", "投入原料 kg"],
                       [[a, str(v[0]), f"{int(v[1]):,}", fmt(kgof(a))] for a, v in prod],
                       [88, 24, 40, 36], {1, 2, 3},
                       ["合计", str(len(PK)), f"{int(pk_t):,}", fmt(pk_kg)]))

    # 需核对
    issues = ([("入库", r["time"][5:16], r["material"], f"{fmt(r['kg'])} kg", r["_f"]) for r in IN if r["_f"]]
              + [("出库", r["time"][5:16], r["material"], f"{fmt(r['kg'])} kg", r["_f"]) for r in IS if r["_f"]]
              + [("生产", r["time"][5:16], r["product"], f"{fmt(r['packs'])} packs", r["_f"]) for r in PK if r["_f"]])
    if issues:
        story.append(P(f"需核对（{len(issues)} 项）", "h2"))
        story.append(table(["来源", "时间", "物料 / 产品", "数量", "问题"],
                           [list(x) for x in issues], [18, 30, 62, 32, 46], {3},
                           warn=range(len(issues))))
    story.append(Spacer(1, 8))
    story.append(P("物料、用途与产品名称按常见写法归并统计；异常数量不计入合计。数据来源：Jotform。", "note"))

    def footer(c, d):
        c.saveState(); c.setFont("Helvetica", 7); c.setFillColor(colors.HexColor("#93a1ad"))
        c.drawString(14 * mm, 9 * mm, "AEM Frozen Food")
        c.drawRightString(A4[0] - 14 * mm, 9 * mm, f"{start} – {end}   ·   {d.page}")
        c.restoreState()
    SimpleDocTemplate(out_pdf, pagesize=A4, leftMargin=14 * mm, rightMargin=14 * mm,
                      topMargin=14 * mm, bottomMargin=14 * mm,
                      title=f"上周出库总结 {start} – {end}", author="AEM Frozen Food"
                      ).build(story, onFirstPage=footer, onLaterPages=footer)

    lines = [f"上周出库总结  {start} 至 {end}", "",
             f"原材料出库   {fmt(is_t)} kg（{len(IS)} 笔）",
             f"生产产出     {int(pk_t):,} packs（投入原料 {fmt(pk_kg)} kg）",
             f"原材料入库   {fmt(in_t)} kg（{len(IN)} 笔）", "",
             "出库物料前五："] + [f"  {a}  {fmt(v[1])} kg" for a, v in mat[:5]] + ["", "出库用途："] \
            + [f"  {a}  {fmt(v[1])} kg" for a, v in pur]
    if issues:
        lines += ["", f"需核对 {len(issues)} 项："] + [f"  {a} {b}  {c}  {d}  — {e}" for a, b, c, d, e in issues]
    lines += ["", "明细见附件 PDF。", "", "AEM Frozen Food"]
    body = "\n".join(lines)
    if out_txt: open(out_txt, "w", encoding="utf-8").write(body)
    return body

if __name__ == "__main__":
    if len(sys.argv) < 3: sys.exit(__doc__)
    print(build(json.load(open(sys.argv[1], encoding="utf-8")), sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None))
