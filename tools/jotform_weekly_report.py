#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the weekly "Summary of Jotform" PDF + email body from a JSON data file.

Usage:
    python3 tools/jotform_weekly_report.py data.json out.pdf [summary.txt]

data.json schema (all quantities are numbers, times are "YYYY-MM-DD HH:MM"):
{
  "period":  {"start": "2026-09-07", "end": "2026-09-13", "generated": "2026-09-14"},
  "intake":  [{"time","material","kg","supplier","receiver","remark"}, ...],
  "issue":   [{"time","material","kg","batch","purpose","requester","remark"}, ...],
  "packing": [{"time","prod_date","batch","product","packs","kg","spec","operator","remark"}, ...]
}
Requires: reportlab (pip install reportlab). Chinese text uses the built-in STSong-Light CID
font (not embedded) so the PDF stays small enough to attach to an email.
"""
import json, re, sys
from collections import OrderedDict
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

# ---------------------------------------------------------------- normalisation
NAME_ALIASES = {"weina": "weina", "wei": "weina", "wei na": "weina", "sada": "Saad", "saad": "Saad", "saacl": "Saad",
                "jenn": "Jenn", "shuhada": "Shuhada", "jhon": "John", "john": "John", "ling he le": "Ling He Le",
                "ling": "Ling He Le", "balqis": "balqis", "nur balqis arni bt md adni": "balqis", "meme": "Meme"}
MATERIAL_ALIASES = [  # (regex on lowercased name, canonical label)
    (r"^67\s*beef|67号?\s*牛肉|beef\s*67|cube\s*roll", "Beef 67 牛肉67"),
    (r"^45\s*beef|4\.5\s*beef|beef\s*45|rump", "Beef 45 牛肉45"),
    (r"^ayam\s*bl|无骨鸡腿|^ayam$", "Ayam 鸡腿肉"),
    (r"chicken\s*wing|鸡翅|kepak|mid\s*joint", "Chicken Wing 鸡翅"),
    (r"gizard|gizzard|鸡胗", "Ayam Gizzard 鸡胗"),
    (r"minced\s*chicken|chicken\s*fillet|鸡碎", "Minced Chicken 鸡碎肉"),
    (r"kab[ai]?m?[bg]|kambing|mutton|羊肉", "Kambing 羊肉"),
    (r"tepung\s*pulut|糯米粉", "Tepung Pulut 糯米粉"),
    (r"minyak|食用油|soya\s*bean\s*oil", "Minyak Masak 食用油"),
    (r"^gula|白糖|^sugar", "Gula 糖"),
    (r"sichuan|mala\s*soup|麻辣汤", "Sup Sichuan Mala 麻辣汤底"),
    (r"sesame", "Sesame Oil 麻油"),
    (r"木薯|tepung\s*ubi", "Tepung Ubi 木薯粉"),
    (r"sayur|telur|veg", "Sayur & Telur 蔬菜鸡蛋"),
]
PRODUCT_ALIASES = [
    (r"kepak", "Sate Ayam Kepak 鸡翅串"),
    (r"pedal", "Pedal Ayam 鸡胗串"),
    (r"sate\s*ayam|鸡肉串", "Sate Ayam 鸡肉串"),
    (r"sate\s*daging\s*mala|麻辣牛肉串", "Sate Daging Mala 麻辣牛肉串"),
    (r"sate\s*daging|牛肉串", "Sate Daging 牛肉串"),
    (r"sate\s*kambing\s*mala|麻辣羊肉串", "Sate Kambing Mala 麻辣羊肉串"),
    (r"sate\s*kambing|羊肉串", "Sate Kambing 羊肉串"),
    (r"bbq\s*marinated|bmb", "BBQ Marinated Beef 腌制烧烤牛肉"),
    (r"marinated\s*beef|daging\s*di\s*perap|腌制牛肉", "Marinated Beef 腌制牛肉"),
    (r"masak\s*merah|红烧牛肉", "Daging Masak Merah 红烧牛肉"),
    (r"mala\s*bbq", "Mala BBQ 麻辣烧烤"),
    (r"^bbq$", "BBQ 烧烤"),
    (r"gula\s*merah|kpg", "Kuih Pulut Gula Merah 椰糖糯米糕"),
    (r"pulut\s*goreng", "Kuih Pulut Goreng 炸糯米糕"),
    (r"claypot|clay\s*pot", "Claypot Ayam 砂锅鸡"),
    (r"chicken\s*wing", "Chicken Wing 鸡翅"),
    (r"cincang", "Ayam Cincang Dengan Terung 茄子鸡碎"),
]
def norm_name(x):
    return NAME_ALIASES.get(str(x).strip().lower(), str(x).strip())
def canon(x, table):
    s = str(x).strip().lower()
    for pat, label in table:
        if re.search(pat, s):
            return label
    return str(x).strip()
CJK = re.compile(r"([⺀-鿿＀-￯　-〿]+)")
def t(s):
    return CJK.sub(r'<font name="STSong-Light">\1</font>', str(s))
def fmt(x):
    return "" if x in (None, "") else f"{float(x):g}"
def n(x):
    try: return float(x)
    except (TypeError, ValueError): return 0.0
def weekday(d):
    return ["Mon 一", "Tue 二", "Wed 三", "Thu 四", "Fri 五", "Sat 六", "Sun 日"][datetime.strptime(d, "%Y-%m-%d").weekday()]

# ---------------------------------------------------------------- flags
def flag_issue(r):
    f = []
    if not str(r.get("batch", "")).strip(): f.append("缺批次号")
    if n(r.get("kg")) >= 500: f.append(f"[!] {fmt(r['kg'])} kg 数量异常, 请核对")
    if len(str(r.get("material", ""))) <= 1: f.append("[!] 物料名不完整")
    if re.search(r"\d{8,}", str(r.get("material", ""))): f.append("[!] 物料名混入条码")
    return "; ".join(f)
def flag_pack(r):
    kg, packs = r.get("kg"), n(r.get("packs"))
    if kg in (None, ""): return "[!] 未填原料 kg"
    spec = str(r.get("spec", "")).lower()
    w = 0.4 if "400" in spec else 2.0 if "2kg" in spec else 1.0 if "1kg" in spec else 0.2 if "200" in spec else 0.35 if "350" in spec else None
    if w and n(kg) > 0 and packs * w > n(kg) * 2.5: return "[!] 原料 kg 相对产量偏少"
    if w and n(kg) > 0 and packs * w < n(kg) * 0.25: return "[!] 产量相对原料偏少"
    if not w and n(kg) > 0 and packs / n(kg) > 15: return "[!] 原料 kg 相对产量偏少"
    return ""
def flag_intake(r):
    rem = str(r.get("remark", "")).lower()
    return "" if re.search(r"exp|luput|到期|\d{1,2}/\d{1,2}/\d{2,4}", rem) else "[!] 无到期日"

# ---------------------------------------------------------------- main
def build(data, out_pdf, out_txt=None):
    P0 = data["period"]; start, end = P0["start"], P0["end"]; gen = P0.get("generated", datetime.now().strftime("%Y-%m-%d"))
    IN = sorted(data.get("intake", []), key=lambda r: r["time"]); IS = sorted(data.get("issue", []), key=lambda r: r["time"]); PK = sorted(data.get("packing", []), key=lambda r: r["time"])
    for r in IN: r["_flag"] = flag_intake(r)
    for r in IS: r["_flag"] = flag_issue(r)
    for r in PK: r["_flag"] = flag_pack(r)
    def agg(rows, key, table, qk):
        d = OrderedDict()
        for r in rows:
            k = canon(r[key], table); d.setdefault(k, [0, 0.0]); d[k][0] += 1
            if not str(r.get("_flag", "")).startswith("[!] ") or "异常" not in r["_flag"]: d[k][1] += n(r.get(qk))
        return OrderedDict(sorted(d.items(), key=lambda kv: -kv[1][1]))
    def cnt(rows, key, f=lambda x: x):
        d = OrderedDict()
        for r in rows: k = f(r[key]); d[k] = d.get(k, 0) + 1
        return OrderedDict(sorted(d.items(), key=lambda kv: -kv[1]))
    IN_A, IS_A, PK_A = agg(IN, "material", MATERIAL_ALIASES, "kg"), agg(IS, "material", MATERIAL_ALIASES, "kg"), agg(PK, "product", PRODUCT_ALIASES, "packs")
    in_tot, is_tot, pk_tot = sum(n(r["kg"]) for r in IN), sum(n(r["kg"]) for r in IS if "异常" not in r["_flag"]), sum(n(r["packs"]) for r in PK)
    short = lambda name: CJK.split(name)[0].strip(" (") or name
    top = lambda A, k=5: ", ".join(f"{short(name)} {fmt(v[1])}" for name, v in list(A.items())[:k])
    subs = lambda rows, key: ", ".join(f"{k} {v}" for k, v in cnt(rows, key, norm_name).items())

    pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
    BLUE, GRID, WARN, ALT, MISS, TOT = (colors.HexColor(c) for c in ("#1f5f8b", "#d0d5db", "#fff4e5", "#f5f5f5", "#fdecec", "#eef2f6"))
    base = ParagraphStyle("b", fontName="Helvetica", fontSize=8.2, leading=10.5); small = ParagraphStyle("s", parent=base, fontSize=7.3, leading=9.1)
    note = ParagraphStyle("n", parent=base, fontSize=7.5, leading=9.5, textColor=colors.HexColor("#555555"))
    h1 = ParagraphStyle("h1", parent=base, fontName="Helvetica-Bold", fontSize=20, leading=24)
    h2 = ParagraphStyle("h2", parent=base, fontName="Helvetica-Bold", fontSize=12, leading=15, spaceBefore=12, spaceAfter=5, textColor=BLUE)
    h3 = ParagraphStyle("h3", parent=base, fontName="Helvetica-Bold", fontSize=9.5, leading=12, spaceBefore=8, spaceAfter=3, keepWithNext=1)
    th = ParagraphStyle("th", parent=base, textColor=colors.white, fontSize=7.8, leading=9.5); thr = ParagraphStyle("thr", parent=th, alignment=2)
    br = ParagraphStyle("br", parent=base, alignment=2); sr = ParagraphStyle("sr", parent=small, alignment=2); bul = ParagraphStyle("bul", parent=base, leftIndent=10, spaceAfter=3)
    def P(s, st=base): return Paragraph(t(s), st)
    def ts(extra=()):
        return TableStyle([("GRID", (0, 0), (-1, -1), 0.4, GRID), ("BACKGROUND", (0, 0), (-1, 0), BLUE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                           ("TOPPADDING", (0, 0), (-1, -1), 2), ("BOTTOMPADDING", (0, 0), (-1, -1), 2), ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4)] + list(extra))
    def simple(head, rows, widths, total=None):
        d = [[P(h, thr if i else th) for i, h in enumerate(head)]] + [[P(r[0])] + [P(x, br) for x in r[1:]] for r in rows]; ex = []
        if total: d.append([P(f"<b>{total[0]}</b>")] + [P(f"<b>{x}</b>", br) for x in total[1:]]); ex = [("BACKGROUND", (0, -1), (-1, -1), TOT)]
        tb = Table(d, colWidths=widths); tb.setStyle(ts(ex)); return tb
    def side(tables, widths):
        w = Table([tables], colWidths=widths); w.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0)])); return w
    def listtable(head, rows, widths, numcols):
        d = [[P(h, thr if i in numcols else th) for i, h in enumerate(head)]]; ws, ms = [], []
        for i, r in enumerate(rows):
            d.append([P(i + 1, small)] + [P(fmt(x) if j + 1 in numcols else (x if x not in (None, "") else ""), sr if j + 1 in numcols else small) for j, x in enumerate(r)])
            fl = str(r[-1])
            if "[!]" in fl: ws.append(i + 1)
            elif "缺批次号" in fl: ms.append(i + 1)
        tb = Table(d, colWidths=[w * mm for w in widths], repeatRows=1)
        tb.setStyle(ts([("BACKGROUND", (0, i), (-1, i), ALT) for i in range(1, len(rows) + 1, 2)] + [("BACKGROUND", (0, i), (-1, i), MISS) for i in ms] + [("BACKGROUND", (0, i), (-1, i), WARN) for i in ws])); return tb

    S = [P("Summary of Jotform", h1),
         P(f"期间 / Period: <b>{start} ({weekday(start).split()[0]}) – {end} ({weekday(end).split()[0]})</b> &nbsp;·&nbsp; 三张表 / 3 forms: 原材料入库 Raw Material Intake · 原材料领用 Raw Material Issue · 生产入库 Production Packing Log &nbsp;·&nbsp; 生成 / Generated: {gen} &nbsp;·&nbsp; 数据来源 / Source: Jotform", note), Spacer(1, 8)]
    ov = [[P("表单 / Form", th), P("笔数 / Entries", thr), P("提交人 (笔数) / Submitters", th), P("主要数量 / Key totals", th)],
          [P("原材料入库 Raw Material Intake"), P(len(IN), br), P(subs(IN, "receiver") or "-"), P(f"入库合计 {fmt(in_tot)} kg; {top(IN_A)}")],
          [P("原材料领用 Raw Material Issue"), P(len(IS), br), P(subs(IS, "requester") or "-"), P(f"领用合计 {fmt(is_tot)} kg; {top(IS_A)}")],
          [P("生产入库 Production Packing Log"), P(len(PK), br), P(subs(PK, "operator") or "-"), P(f"入库合计 {int(pk_tot):,} packs; {top(PK_A)}")]]
    people = sorted(set(norm_name(r["receiver"]) for r in IN) | set(norm_name(r["requester"]) for r in IS) | set(norm_name(r["operator"]) for r in PK))
    ov.append([P("<b>合计 / Total</b>"), P(f"<b>{len(IN) + len(IS) + len(PK)}</b>", br), P(f"<b>{len(people)} 人 / people: {', '.join(people)}</b>"), P("")])
    ovt = Table(ov, colWidths=[52 * mm, 20 * mm, 80 * mm, 110 * mm]); ovt.setStyle(ts([("BACKGROUND", (0, -1), (-1, -1), TOT)])); S += [ovt, P("提交人已归并大小写/拼写变体; 明细表中保留原始写法。物料/产品名按常见变体归并 (如 67Beef / 67牛肉 / Beef Cube Roll)。", note)]
    days = sorted(set(r["time"][:10] for r in IN + IS + PK)) or [start]
    dd = [[P("日期 / Date", th)] + [P(f"{d[5:]}<br/>{weekday(d)}", thr) for d in days] + [P("合计", thr)]]
    for name, rows in (("入库 Intake", IN), ("领用 Issue", IS), ("生产 Packing", PK)):
        c = {d: 0 for d in days}
        for r in rows: c[r["time"][:10]] += 1
        dd.append([P(name)] + [P(str(c[d]) if c[d] else "-", br) for d in days] + [P(len(rows), br)])
    dt = Table(dd, colWidths=[30 * mm] + [min(20, 150 // max(len(days), 1)) * mm] * len(days) + [18 * mm]); dt.setStyle(ts()); S += [P("每日提交笔数 / Entries per day", h3), dt]

    S += [PageBreak(), P(f"1. 原材料入库 / Raw Material Intake — {len(IN)} 笔", h2)]
    if IN:
        S.append(listtable(["#", "提交时间", "物料 (原文)", "数量 kg", "供应商 / Supplier", "收货人 / Receiver", "备注 / Remarks", "标记"],
                           [(r["time"], r["material"], r["kg"], r["supplier"], r["receiver"], r["remark"], r["_flag"]) for r in IN], [7, 26, 40, 16, 44, 24, 70, 26], {3}))
        sup = OrderedDict()
        for r in IN: sup.setdefault(r["supplier"], [0, 0.0]); sup[r["supplier"]][0] += 1; sup[r["supplier"]][1] += n(r["kg"])
        S += [P("汇总 / Totals", h3), side([simple(["物料 / Material", "笔数", "kg"], [(k, v[0], fmt(v[1])) for k, v in IN_A.items()], [70 * mm, 14 * mm, 20 * mm], ("合计", len(IN), fmt(in_tot))),
                                          simple(["供应商 / Supplier", "笔数", "kg"], [(k, v[0], fmt(v[1])) for k, v in sorted(sup.items(), key=lambda kv: -kv[1][1])], [52 * mm, 14 * mm, 20 * mm]),
                                          simple(["收货人 / Receiver", "笔数"], list(cnt(IN, "receiver", norm_name).items()), [36 * mm, 14 * mm])], [108 * mm, 90 * mm, 54 * mm])]
    else: S.append(P("本周无入库记录 / No intake entries this week.", note))

    S += [PageBreak(), P(f"2. 原材料领用 / Raw Material Issue — {len(IS)} 笔", h2)]
    if IS:
        S.append(listtable(["#", "提交时间", "物料 (原文)", "数量 kg", "批次号 / Batch", "用途 / Purpose", "领用人 / Requester", "备注 / 标记"],
                           [(r["time"], r["material"], r["kg"], r["batch"], r["purpose"], r["requester"], "; ".join(x for x in (r["remark"], r["_flag"]) if x)) for r in IS], [7, 26, 42, 16, 42, 44, 24, 52], {3}))
        pu = OrderedDict()
        for r in IS: k = str(r["purpose"]).strip() or "-"; pu.setdefault(k, [0, 0.0]); pu[k][0] += 1; pu[k][1] += n(r["kg"]) if "异常" not in r["_flag"] else 0
        S += [P("橙色行 = 数据需核对; 红色行 = 缺批次号。", note), P("汇总 / Totals", h3),
              side([simple(["物料 (已归并) / Material", "笔数", "kg"], [(k, v[0], fmt(v[1])) for k, v in IS_A.items()], [80 * mm, 14 * mm, 20 * mm], ("合计 (不含异常笔)", len(IS), fmt(is_tot))),
                    simple(["用途 (原文) / Purpose", "笔数", "kg"], [(k, v[0], fmt(v[1])) for k, v in sorted(pu.items(), key=lambda kv: -kv[1][1])], [50 * mm, 14 * mm, 20 * mm]),
                    simple(["领用人 / Requester", "笔数"], list(cnt(IS, "requester", norm_name).items()), [36 * mm, 14 * mm])], [118 * mm, 88 * mm, 54 * mm])]
    else: S.append(P("本周无领用记录 / No issue entries this week.", note))

    S += [PageBreak(), P(f"3. 生产入库 / Production Packing Log — {len(PK)} 笔", h2)]
    if PK:
        S.append(listtable(["#", "提交时间", "生产日期", "批次号", "产品 (原文) / Product", "packs", "原料 kg", "规格", "操作员 / Operator", "备注 / 标记"],
                           [(r["time"], r["prod_date"], r["batch"], r["product"], r["packs"], r["kg"], r["spec"], r["operator"], "; ".join(x for x in (r["remark"], r["_flag"]) if x)) for r in PK], [7, 26, 20, 22, 46, 13, 15, 17, 22, 65], {5, 6}))
        byday = OrderedDict()
        for r in PK: d = r["time"][:10]; byday.setdefault(d, [0, 0]); byday[d][0] += 1; byday[d][1] += int(n(r["packs"]))
        kgof = lambda label: fmt(sum(n(r["kg"]) for r in PK if canon(r["product"], PRODUCT_ALIASES) == label))
        S += [P("橙色行 = 数据需核对 (原料与产量比例异常或缺原料)。", note), P("汇总 / Totals", h3),
              side([simple(["产品 (已归并) / Product", "笔数", "packs", "原料 kg"], [(k, v[0], int(v[1]), kgof(k)) for k, v in PK_A.items()], [72 * mm, 14 * mm, 18 * mm, 20 * mm], ("合计", len(PK), int(pk_tot), fmt(sum(n(r["kg"]) for r in PK)))),
                    simple(["操作员 / Operator", "笔数", "packs"], [(k, v, int(sum(n(r["packs"]) for r in PK if norm_name(r["operator"]) == k))) for k, v in cnt(PK, "operator", norm_name).items()], [36 * mm, 14 * mm, 18 * mm]),
                    simple(["生产提交日 / Date", "笔数", "packs"], [(k, v[0], v[1]) for k, v in byday.items()], [34 * mm, 14 * mm, 18 * mm])], [128 * mm, 72 * mm, 70 * mm])]
    else: S.append(P("本周无生产记录 / No packing entries this week.", note))

    S += [PageBreak(), P("4. 三表对账 / Cross-check: 入库 → 领用 → 生产", h2)]
    cx = [[P("物料 (归并) / Material", th), P("入库 kg", thr), P("领用 kg", thr), P("判断 / Note", th)]]
    for k in sorted(set(IN_A) | set(IS_A), key=lambda k: -(IN_A.get(k, [0, 0])[1] + IS_A.get(k, [0, 0])[1])):
        i, o = IN_A.get(k, [0, 0.0])[1], IS_A.get(k, [0, 0.0])[1]
        nt = "只入库未领用" if o == 0 else "只领用未入库 (用库存)" if i == 0 else "领用 > 入库 (用库存)" if o > i * 1.1 else "正常"
        cx.append([P(k), P(fmt(i), br), P(fmt(o), br), P(nt)])
    ct = Table(cx, colWidths=[90 * mm, 24 * mm, 24 * mm, 120 * mm]); ct.setStyle(ts()); S.append(ct)
    S += [P("5. 需要核对 / Items to check", h2)]
    issues = [f"入库 {r['time']} {r['material']} {fmt(r['kg'])} kg ({r['receiver']}): {r['_flag']}" for r in IN if r["_flag"]] + \
             [f"领用 {r['time']} {r['material']} {fmt(r['kg'])} kg ({r['requester']}): {r['_flag']}" for r in IS if r["_flag"]] + \
             [f"生产 {r['time']} {r['product']} {fmt(r['packs'])} packs / {fmt(r['kg'])} kg ({r['operator']}): {r['_flag']}" for r in PK if r["_flag"]]
    for x in (issues or ["本周没有发现缺失字段或异常数量。/ No missing fields or anomalies found."]): S.append(Paragraph(t(x), bul, bulletText="•"))
    def footer(c, d):
        c.saveState(); c.setFont("Helvetica", 7); c.setFillColor(colors.HexColor("#777777"))
        c.drawRightString(landscape(A4)[0] - 12 * mm, 8 * mm, f"AEM Frozen Food · Summary of Jotform · {start} to {end} · page {d.page}"); c.restoreState()
    doc = SimpleDocTemplate(out_pdf, pagesize=landscape(A4), leftMargin=12 * mm, rightMargin=12 * mm, topMargin=12 * mm, bottomMargin=13 * mm, title=f"Summary of Jotform {start} to {end}", author="AEM Frozen Food")
    doc.build(S, onFirstPage=footer, onLaterPages=footer)

    body = [f"Summary of the week — {start} to {end}", "", "三张 Jotform 表上周汇总 / Weekly summary of the 3 Jotform forms:", "",
            f"- 原材料入库 Raw Material Intake: {len(IN)} 笔, {fmt(in_tot)} kg ({subs(IN, 'receiver') or '-'}); {top(IN_A)}",
            f"- 原材料领用 Raw Material Issue: {len(IS)} 笔, {fmt(is_tot)} kg ({subs(IS, 'requester') or '-'}); {top(IS_A)}",
            f"- 生产入库 Production Packing: {len(PK)} 笔, {int(pk_tot):,} packs ({subs(PK, 'operator') or '-'}); {top(PK_A)}", "",
            "需要核对 / Items to check:"] + [f"{i + 1}. {x}" for i, x in enumerate(issues)] + (["(无 / none)"] if not issues else []) + \
           ["", "完整明细 (每笔含提交人)、按物料/人员汇总和三表对账见附件 PDF。/ Full lists with submitter, totals and cross-check are in the attached PDF.", "", "AEM Frozen Food"]
    if out_txt: open(out_txt, "w", encoding="utf-8").write("\n".join(body))
    return "\n".join(body)

if __name__ == "__main__":
    if len(sys.argv) < 3: sys.exit(__doc__)
    print(build(json.load(open(sys.argv[1], encoding="utf-8")), sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None))
