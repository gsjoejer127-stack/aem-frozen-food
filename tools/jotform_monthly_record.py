#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the monthly Jotform record: summary tables plus the full entry list.

Usage: python3 tools/jotform_monthly_record.py month.json out.pdf [body.txt]

Same JSON schema as jotform_weekly_report.py, with period.start/end spanning
the month. Unlike the weekly summary this one keeps every entry and names the
submitter, because its job is to be the archive of what was recorded.
"""
import json, sys
from collections import OrderedDict
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import (CondPageBreak, PageBreak, Paragraph,
                                SimpleDocTemplate, Spacer, Table, TableStyle)

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from jotform_weekly_report import (MATERIAL, PRODUCT, PURPOSE, canon, t, n, fmt,
                                   flag_intake, flag_issue, flag_pack,
                                   INK, LINE, HEAD, ZEBRA, TOTROW, WARNBG)

PAGE = landscape(A4)
PW = PAGE[0]


def build(data, out_pdf, out_txt=None):
    P0 = data["period"]
    start, end = P0["start"], P0["end"]
    gen = P0.get("generated", datetime.now().strftime("%Y-%m-%d"))
    IN = sorted(data.get("intake", []), key=lambda r: r["time"])
    IS = sorted(data.get("issue", []), key=lambda r: r["time"])
    PK = sorted(data.get("packing", []), key=lambda r: r["time"])
    for r in IN: r["_f"] = flag_intake(r)
    for r in IS: r["_f"] = flag_issue(r)
    for r in PK: r["_f"] = flag_pack(r)

    ok = lambda r: "异常" not in r["_f"]
    in_t = sum(n(r["kg"]) for r in IN)
    is_t = sum(n(r["kg"]) for r in IS if ok(r))
    is_raw = sum(n(r["kg"]) for r in IS)
    pk_t = sum(n(r["packs"]) for r in PK)
    pk_kg = sum(n(r["kg"]) for r in PK)

    def roll(rows, key, tbl, qk, guard=True):
        d = OrderedDict()
        for r in rows:
            k = canon(r[key], tbl)
            d.setdefault(k, [0, 0.0]); d[k][0] += 1
            if not guard or ok(r): d[k][1] += n(r.get(qk))
        return sorted(d.items(), key=lambda kv: -kv[1][1])

    def plain(rows, key, qk):
        """Group by a free-text field, folding case/spacing variants together."""
        d = OrderedDict()
        for r in rows:
            raw = str(r.get(key, "")).strip() or "—"
            k = " ".join(raw.split()).casefold()
            d.setdefault(k, [0, 0.0, raw]); d[k][0] += 1
            if ok(r): d[k][1] += n(r.get(qk))
        return sorted(((v[2], v) for v in d.values()), key=lambda kv: -kv[1][1])

    in_mat = roll(IN, "material", MATERIAL, "kg", guard=False)
    is_mat = roll(IS, "material", MATERIAL, "kg")
    is_pur = roll(IS, "purpose", PURPOSE, "kg")
    pk_prod = roll(PK, "product", PRODUCT, "packs")
    sup = plain(IN, "supplier", "kg")

    pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
    base = ParagraphStyle("b", fontName="Helvetica", fontSize=7.4, leading=9.4)
    st = dict(
        b=base,
        r=ParagraphStyle("r", parent=base, alignment=2),
        h1=ParagraphStyle("h1", parent=base, fontName="Helvetica-Bold", fontSize=19, leading=23, textColor=INK),
        sub=ParagraphStyle("sub", parent=base, fontSize=8.5, leading=12, textColor=colors.HexColor("#5b6b7a")),
        h2=ParagraphStyle("h2", parent=base, fontName="Helvetica-Bold", fontSize=11, leading=14,
                          spaceBefore=14, spaceAfter=6, textColor=INK, keepWithNext=1),
        h3=ParagraphStyle("h3", parent=base, fontName="Helvetica-Bold", fontSize=8.6, leading=11,
                          spaceBefore=9, spaceAfter=4, textColor=INK, keepWithNext=1),
        th=ParagraphStyle("th", parent=base, fontSize=7.2, leading=9, textColor=colors.white),
        thr=ParagraphStyle("thr", parent=base, fontSize=7.2, leading=9, textColor=colors.white, alignment=2),
        kl=ParagraphStyle("kl", parent=base, fontSize=8, leading=10, textColor=colors.HexColor("#5b6b7a")),
        kv=ParagraphStyle("kv", parent=base, fontName="Helvetica-Bold", fontSize=16, leading=20, textColor=INK),
        note=ParagraphStyle("note", parent=base, fontSize=7.2, leading=9.6, textColor=colors.HexColor("#6b7a88")),
    )
    P = lambda s, k="b": Paragraph(t(s), st[k])

    def table(head, rows, widths, numcols, total=None, warn=()):
        d = [[P(h, "thr" if i in numcols else "th") for i, h in enumerate(head)]]
        d += [[P(c, "r" if i in numcols else "b") for i, c in enumerate(row)] for row in rows]
        extra = [("BACKGROUND", (0, i), (-1, i), ZEBRA) for i in range(2, len(rows) + 1, 2)]
        if total:
            d.append([P(f"<b>{c}</b>", "r" if i in numcols else "b") for i, c in enumerate(total)])
            extra += [("BACKGROUND", (0, -1), (-1, -1), TOTROW), ("LINEABOVE", (0, -1), (-1, -1), 0.7, INK)]
        extra += [("BACKGROUND", (0, i + 1), (-1, i + 1), WARNBG) for i in warn]
        tb = Table(d, colWidths=[w * mm for w in widths], repeatRows=1, hAlign="LEFT")
        tb.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), HEAD),
            ("LINEBELOW", (0, 0), (-1, -1), 0.3, LINE),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 2.6), ("BOTTOMPADDING", (0, 0), (-1, -1), 2.6),
            ("LEFTPADDING", (0, 0), (-1, -1), 4.5), ("RIGHTPADDING", (0, 0), (-1, -1), 4.5),
        ] + extra))
        return tb

    def kpis(cells):
        w = (PW - 28 * mm) / len(cells)
        tb = Table([[Table([[P(l, "kl")], [P(v, "kv")]], colWidths=[w - 6 * mm]) for l, v in cells]],
                   colWidths=[w] * len(cells), hAlign="LEFT")
        tb.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"), ("BACKGROUND", (0, 0), (-1, -1), ZEBRA),
            ("LINEAFTER", (0, 0), (-2, -1), 0.6, colors.white),
            ("TOPPADDING", (0, 0), (-1, -1), 7), ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ("LEFTPADDING", (0, 0), (-1, -1), 9), ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ]))
        return tb

    pct = lambda v, tot: f"{v / tot * 100:.0f}%" if tot else "—"
    S = [P("Jotform 月度完整记录", "h1"),
         P(f"{start} 至 {end} · 生成日期 {gen} · 原材料入库 / 原材料领用 / 生产入库 三表全量", "sub"),
         Spacer(1, 9),
         kpis([("原材料入库", f"{fmt(in_t)} kg"), ("原材料出库", f"{fmt(is_t)} kg"),
               ("生产产出", f"{int(pk_t):,} packs"), ("记录总笔数", f"{len(IN) + len(IS) + len(PK)}")])]

    S += [P("一、总览", "h2"),
          table(["表单", "笔数", "数量合计", "提交人数"],
                [("原材料入库 Raw Material Intake", str(len(IN)), f"{fmt(in_t)} kg",
                  str(len({str(r['receiver']).strip().lower() for r in IN}))),
                 ("原材料领用 Raw Material Issue", str(len(IS)), f"{fmt(is_t)} kg",
                  str(len({str(r['requester']).strip().lower() for r in IS}))),
                 ("生产入库 Production Packing", str(len(PK)), f"{int(pk_t):,} packs / {fmt(pk_kg)} kg",
                  str(len({str(r['operator']).strip().lower() for r in PK})))],
                [78, 20, 48, 24], {1, 3},
                total=("合计", str(len(IN) + len(IS) + len(PK)), "", ""))]

    S += [P("二、原材料入库汇总", "h2"),
          table(["物料", "笔数", "数量 kg", "占比"],
                [(k, str(v[0]), fmt(v[1]), pct(v[1], in_t)) for k, v in in_mat],
                [72, 20, 30, 22], {1, 2, 3}, total=("合计", str(len(IN)), fmt(in_t), "100%")),
          P("按供应商", "h3"),
          table(["供应商", "笔数", "数量 kg", "占比"],
                [(k, str(v[0]), fmt(v[1]), pct(v[1], in_t)) for k, v in sup],
                [72, 20, 30, 22], {1, 2, 3}, total=("合计", str(len(IN)), fmt(in_t), "100%"))]

    S += [P("三、原材料出库汇总", "h2"),
          table(["物料", "笔数", "数量 kg", "占比"],
                [(k, str(v[0]), fmt(v[1]), pct(v[1], is_t)) for k, v in is_mat],
                [72, 20, 30, 22], {1, 2, 3}, total=("合计", str(len(IS)), fmt(is_t), "100%")),
          P("按用途", "h3"),
          table(["用途", "笔数", "数量 kg", "占比"],
                [(k, str(v[0]), fmt(v[1]), pct(v[1], is_t)) for k, v in is_pur],
                [72, 20, 30, 22], {1, 2, 3}, total=("合计", str(len(IS)), fmt(is_t), "100%"))]

    S += [P("四、生产产出汇总", "h2"),
          table(["产品", "批次", "产出 packs", "投入原料 kg", "占比"],
                [(k, str(v[0]), f"{int(v[1]):,}", fmt(sum(n(r['kg']) for r in PK if canon(r['product'], PRODUCT) == k)),
                  pct(v[1], pk_t)) for k, v in pk_prod],
                [72, 20, 30, 30, 22], {1, 2, 3, 4},
                total=("合计", str(len(PK)), f"{int(pk_t):,}", fmt(pk_kg), "100%"))]

    flagged = ([("入库", r["time"], r["material"], f"{fmt(r['kg'])} kg", r["receiver"], r["_f"]) for r in IN if r["_f"]] +
               [("出库", r["time"], r["material"], f"{fmt(r['kg'])} kg", r["requester"], r["_f"]) for r in IS if r["_f"]] +
               [("生产", r["time"], r["product"], f"{fmt(r['packs'])} packs", r["operator"], r["_f"]) for r in PK if r["_f"]])
    S += [P(f"五、需核对（{len(flagged)} 项）", "h2")]
    S += [table(["来源", "时间", "物料 / 产品", "数量", "提交人", "问题"],
                [(a, b[5:], c, d, e, f) for a, b, c, d, e, f in flagged],
                [16, 28, 72, 26, 26, 60], {3},
                warn=range(len(flagged)))] if flagged else [P("本月没有发现缺失字段或异常数量。", "note")]

    S += [PageBreak(), P(f"六、原材料入库明细（{len(IN)} 笔）", "h2"),
          table(["#", "提交时间", "物料", "数量 kg", "供应商", "收货人", "备注"],
                [(str(i + 1), r["time"][5:], r["material"], fmt(r["kg"]), r["supplier"], r["receiver"], r["remark"])
                 for i, r in enumerate(IN)],
                [9, 26, 46, 20, 44, 22, 94], {0, 3},
                warn=[i for i, r in enumerate(IN) if r["_f"]])] if IN else []

    S += [PageBreak(), P(f"七、原材料出库明细（{len(IS)} 笔）", "h2"),
          table(["#", "提交时间", "物料", "数量 kg", "批次号", "用途", "领用人", "备注 / 标记"],
                [(str(i + 1), r["time"][5:], r["material"], fmt(r["kg"]), r["batch"], r["purpose"], r["requester"],
                  "；".join(x for x in (r["remark"], r["_f"]) if x)) for i, r in enumerate(IS)],
                [9, 26, 42, 20, 40, 48, 20, 56], {0, 3},
                warn=[i for i, r in enumerate(IS) if r["_f"]])] if IS else []

    S += [PageBreak(), P(f"八、生产入库明细（{len(PK)} 笔）", "h2"),
          table(["#", "提交时间", "生产日期", "批次号", "产品", "packs", "原料 kg", "规格", "操作员", "备注 / 标记"],
                [(str(i + 1), r["time"][5:], r["prod_date"], r["batch"], r["product"], fmt(r["packs"]), fmt(r["kg"]),
                  r["spec"], r["operator"], "；".join(x for x in (r["remark"], r["_f"]) if x))
                 for i, r in enumerate(PK)],
                [9, 26, 22, 28, 48, 16, 18, 18, 22, 54], {0, 5, 6},
                warn=[i for i, r in enumerate(PK) if r["_f"]])] if PK else []

    def footer(c, d):
        c.saveState(); c.setFont("Helvetica", 7)
        c.setFillColor(colors.HexColor("#93a2b0"))
        c.drawString(14 * mm, 8.5 * mm, "AEM Frozen Food")
        c.drawRightString(PW - 14 * mm, 8.5 * mm, f"{start} – {end}  ·  {d.page}")
        c.restoreState()

    SimpleDocTemplate(out_pdf, pagesize=PAGE, leftMargin=14 * mm, rightMargin=14 * mm,
                      topMargin=14 * mm, bottomMargin=14 * mm,
                      title=f"Jotform 月度完整记录 {start} 至 {end}",
                      author="AEM Frozen Food").build(S, onFirstPage=footer, onLaterPages=footer)

    top = lambda rows, k=5: "\n".join(f"  {a}  {fmt(b[1])}" for a, b in rows[:k])
    lines = [f"Jotform 月度完整记录  {start} 至 {end}", "",
             f"原材料入库   {fmt(in_t)} kg（{len(IN)} 笔）",
             f"原材料出库   {fmt(is_t)} kg（{len(IS)} 笔）",
             f"生产产出     {int(pk_t):,} packs（投入原料 {fmt(pk_kg)} kg，{len(PK)} 笔）",
             f"记录总笔数   {len(IN) + len(IS) + len(PK)}", "",
             "入库物料前五：", top(in_mat), "", "出库物料前五：", top(is_mat), "",
             "生产产出前五（packs）：",
             "\n".join(f"  {a}  {int(b[1]):,}" for a, b in pk_prod[:5]), "",
             f"需核对 {len(flagged)} 项：" if flagged else "需核对：无"]
    lines += [f"  {a} {b[5:]}  {c}  {d}  — {f}" for a, b, c, d, e, f in flagged]
    lines += ["", "三张表的逐笔明细（含提交人）见附件 PDF。", "", "AEM Frozen Food"]
    body = "\n".join(lines)
    if out_txt: open(out_txt, "w", encoding="utf-8").write(body)
    return body


if __name__ == "__main__":
    if len(sys.argv) < 3: sys.exit(__doc__)
    print(build(json.load(open(sys.argv[1], encoding="utf-8")), sys.argv[2],
                sys.argv[3] if len(sys.argv) > 3 else None))
