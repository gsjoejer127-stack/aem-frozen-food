# -*- coding: utf-8 -*-
"""Render a Jotform period record as a static, searchable HTML page.

Usage: python3 tools/jotform_record_page.py month.json out.html

Same JSON schema as jotform_weekly_report.py. Keeps every entry and names the
submitter: this is the archive of what was recorded, not the weekly digest.
"""
import html, json, os, sys
from collections import OrderedDict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from jotform_weekly_report import (MATERIAL, PRODUCT, PURPOSE, canon, n, fmt,
                                   flag_intake, flag_issue, flag_pack)

D = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "month.json", encoding="utf-8"))
IN = sorted(D["intake"], key=lambda r: r["time"])
IS = sorted(D["issue"], key=lambda r: r["time"])
PK = sorted(D["packing"], key=lambda r: r["time"])
for r in IN: r["_f"] = flag_intake(r)
for r in IS: r["_f"] = flag_issue(r)
for r in PK: r["_f"] = flag_pack(r)
ok = lambda r: "异常" not in r["_f"]

in_t = sum(n(r["kg"]) for r in IN)
is_t = sum(n(r["kg"]) for r in IS if ok(r))
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
    d = OrderedDict()
    for r in rows:
        raw = str(r.get(key, "")).strip() or "—"
        k = " ".join(raw.split()).casefold()
        d.setdefault(k, [0, 0.0, raw]); d[k][0] += 1
        if ok(r): d[k][1] += n(r.get(qk))
    return sorted(((v[2], v) for v in d.values()), key=lambda kv: -kv[1][1])

in_mat, is_mat = roll(IN, "material", MATERIAL, "kg", guard=False), roll(IS, "material", MATERIAL, "kg")
is_pur, pk_prod = roll(IS, "purpose", PURPOSE, "kg"), roll(PK, "product", PRODUCT, "packs")
sup = plain(IN, "supplier", "kg")
e = html.escape
num = lambda v: f"{v:,.2f}".rstrip("0").rstrip(".") if v % 1 else f"{int(v):,}"
pct = lambda v, t: f"{v / t * 100:.0f}%" if t else "—"

def sumtable(head, rows, total):
    h = "".join(f'<th{" class=n" if i else ""}>{e(c)}</th>' for i, c in enumerate(head))
    b = "".join("<tr>" + "".join(f'<td{" class=n" if i else ""}>{e(str(c))}</td>'
                for i, c in enumerate(r)) + "</tr>" for r in rows)
    t = "<tr class=tot>" + "".join(f'<td{" class=n" if i else ""}>{e(str(c))}</td>'
        for i, c in enumerate(total)) + "</tr>"
    return f'<div class=scroll><table><thead><tr>{h}</tr></thead><tbody>{b}{t}</tbody></table></div>'

def listtable(tid, head, rows, numcols, flags):
    h = "".join(f'<th{" class=n" if i in numcols else ""}>{e(c)}</th>' for i, c in enumerate(head))
    b = ""
    for i, r in enumerate(rows):
        cls = " class=warn" if flags[i] else ""
        b += f"<tr{cls}>" + "".join(
            f'<td{" class=n" if j in numcols else ""}>{e(str(c))}</td>' for j, c in enumerate(r)) + "</tr>"
    return (f'<div class=tbar><input type=search id="q{tid}" class=q placeholder="筛选 {len(rows)} 笔记录…" '
            f'aria-label="筛选记录"><span class=count id="c{tid}">{len(rows)} 笔</span></div>'
            f'<div class=scroll><table id="t{tid}" class=list><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table></div>')

flagged = ([("入库", r["time"], r["material"], f"{fmt(r['kg'])} kg", r["receiver"], r["_f"]) for r in IN if r["_f"]] +
           [("出库", r["time"], r["material"], f"{fmt(r['kg'])} kg", r["requester"], r["_f"]) for r in IS if r["_f"]] +
           [("生产", r["time"], r["product"], f"{fmt(r['packs'])} packs", r["operator"], r["_f"]) for r in PK if r["_f"]])

OUT = []
w = OUT.append
w('<meta name="claude:viewport-fit-sides" content="cover">')
w("<title>九月出入库台账</title>")
w('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Source+Sans+3:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap">')
w("""<style>
/* Cold-store ledger: one column, summary above detail, every figure on a tabular grid. */
:root{
  --ground:#f2f5f7; --panel:#ffffff; --ink:#15303f; --ink-soft:#5a7183;
  --rule:#d3dde3; --accent:#0f6d7a; --flag:#fff4de; --flag-rule:#e4b86a;
  --display:"Archivo","Helvetica Neue",Arial,sans-serif;
  --body:"Source Sans 3","Helvetica Neue",Arial,sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --ground:#0e1a21; --panel:#152530; --ink:#e4edf2; --ink-soft:#93a9b6;
  --rule:#273c49; --accent:#49b4bf; --flag:#2e2616; --flag-rule:#8a6c33;
  color-scheme:dark}}
:root[data-theme="dark"]{
  --ground:#0e1a21; --panel:#152530; --ink:#e4edf2; --ink-soft:#93a9b6;
  --rule:#273c49; --accent:#49b4bf; --flag:#2e2616; --flag-rule:#8a6c33;
  color-scheme:dark}
body{background:var(--ground);color:var(--ink);font-family:var(--body);line-height:1.5}
.wrap{max-width:1180px;margin:0 auto;padding-block:32px 56px;
  padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
h1{font-family:var(--display);font-weight:700;font-size:clamp(1.6rem,4vw,2.3rem);line-height:1.15;
  margin:0 0 6px;letter-spacing:-.01em;text-wrap:balance}
.lede{color:var(--ink-soft);margin:0 0 28px;font-size:.95rem}
h2{font-family:var(--display);font-weight:600;font-size:1.05rem;margin:40px 0 12px;
  padding-bottom:7px;border-bottom:2px solid var(--ink);letter-spacing:.01em}
h3{font-family:var(--display);font-weight:600;font-size:.85rem;color:var(--ink-soft);
  margin:22px 0 8px;letter-spacing:.06em;text-transform:uppercase}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:1px;
  background:var(--rule);border:1px solid var(--rule);border-radius:3px;overflow:hidden}
.kpi{background:var(--panel);padding:14px 16px;min-width:0}
.kpi .k{font-size:.72rem;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-soft)}
.kpi .v{font-family:var(--mono);font-weight:500;font-size:1.45rem;margin-top:3px;
  font-variant-numeric:tabular-nums;word-break:break-word}
.kpi .u{font-size:.85rem;color:var(--ink-soft);margin-left:2px}
.scroll{overflow-x:auto;border:1px solid var(--rule);border-radius:3px;background:var(--panel)}
table{border-collapse:collapse;width:100%;font-size:.84rem}
thead th{background:var(--ink);color:var(--ground);font-family:var(--display);font-weight:600;
  font-size:.74rem;letter-spacing:.03em;text-align:left;padding:7px 10px;white-space:nowrap;position:sticky;top:0}
td{padding:6px 10px;border-top:1px solid var(--rule);vertical-align:top}
.n{text-align:right;font-family:var(--mono);font-variant-numeric:tabular-nums;white-space:nowrap}
tbody tr:nth-child(even):not(.tot):not(.warn){background:color-mix(in srgb,var(--rule) 24%,transparent)}
tr.tot td{font-weight:600;border-top:2px solid var(--ink);
  background:color-mix(in srgb,var(--accent) 10%,transparent)}
tr.warn td{background:var(--flag);box-shadow:inset 3px 0 0 var(--flag-rule)}
.list td:first-child{color:var(--ink-soft);font-family:var(--mono);font-size:.78rem}
.tbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:0 0 8px}
.q{flex:1 1 220px;min-width:0;padding:7px 11px;border:1px solid var(--rule);border-radius:3px;
  background:var(--panel);color:var(--ink);font:inherit;font-size:.85rem}
.q:focus-visible{outline:2px solid var(--accent);outline-offset:1px;border-color:var(--accent)}
.count{font-family:var(--mono);font-size:.78rem;color:var(--ink-soft);font-variant-numeric:tabular-nums}
.note{color:var(--ink-soft);font-size:.8rem;margin:10px 0 0}
.note a{color:var(--accent)}
.src{margin-top:44px;padding-top:14px;border-top:1px solid var(--rule);
  color:var(--ink-soft);font-size:.78rem;display:flex;flex-wrap:wrap;gap:4px 18px}
@media (max-width:420px){thead th{position:static}}
</style>""")
w('<div class=wrap>')
w('<h1>九月出入库台账</h1>')
w(f'<p class=lede>AEM Frozen Food · 2026-09-01 至 2026-09-30 · 原材料入库、原材料领用、生产入库三张 Jotform 表的全量记录，共 {len(IN)+len(IS)+len(PK)} 笔。</p>')
w('<div class=kpis>')
for k, v, u in [("原材料入库", num(in_t), "kg"), ("原材料出库", num(is_t), "kg"),
                ("生产产出", num(pk_t), "packs"), ("投入原料", num(pk_kg), "kg"),
                ("需核对", str(len(flagged)), "项")]:
    w(f'<div class=kpi><div class=k>{k}</div><div class=v>{v}<span class=u>{u}</span></div></div>')
w('</div>')

w('<h2>一、三表总览</h2>')
w(sumtable(["表单", "笔数", "数量合计", "提交人数"],
   [("原材料入库 Raw Material Intake", f"{len(IN)}", f"{num(in_t)} kg", f"{len({str(r['receiver']).strip().casefold() for r in IN})}"),
    ("原材料领用 Raw Material Issue", f"{len(IS)}", f"{num(is_t)} kg", f"{len({str(r['requester']).strip().casefold() for r in IS})}"),
    ("生产入库 Production Packing", f"{len(PK)}", f"{num(pk_t)} packs / {num(pk_kg)} kg", f"{len({str(r['operator']).strip().casefold() for r in PK})}")],
   ("合计", f"{len(IN)+len(IS)+len(PK)}", "", "")))

w('<h2>二、原材料入库汇总</h2>')
w(sumtable(["物料", "笔数", "数量 kg", "占比"],
   [(k, str(v[0]), num(v[1]), pct(v[1], in_t)) for k, v in in_mat],
   ("合计", str(len(IN)), num(in_t), "100%")))
w('<h3>按供应商</h3>')
w(sumtable(["供应商", "笔数", "数量 kg", "占比"],
   [(k, str(v[0]), num(v[1]), pct(v[1], in_t)) for k, v in sup],
   ("合计", str(len(IN)), num(in_t), "100%")))

w('<h2>三、原材料出库汇总</h2>')
w(sumtable(["物料", "笔数", "数量 kg", "占比"],
   [(k, str(v[0]), num(v[1]), pct(v[1], is_t)) for k, v in is_mat],
   ("合计", str(len(IS)), num(is_t), "100%")))
w('<h3>按用途</h3>')
w(sumtable(["用途", "笔数", "数量 kg", "占比"],
   [(k, str(v[0]), num(v[1]), pct(v[1], is_t)) for k, v in is_pur],
   ("合计", str(len(IS)), num(is_t), "100%")))
w('<p class=note>出库合计不含 09-04 那笔 1,500 kg 食用油（数量异常，见第五节）。</p>')

w('<h2>四、生产产出汇总</h2>')
kgof = lambda label: sum(n(r["kg"]) for r in PK if canon(r["product"], PRODUCT) == label)
w(sumtable(["产品", "批次", "产出 packs", "投入原料 kg", "占比"],
   [(k, str(v[0]), num(v[1]), num(kgof(k)), pct(v[1], pk_t)) for k, v in pk_prod],
   ("合计", str(len(PK)), num(pk_t), num(pk_kg), "100%")))

w(f'<h2>五、需核对（{len(flagged)} 项）</h2>')
w(listtable("f", ["来源", "时间", "物料 / 产品", "数量", "提交人", "问题"],
   [(a, b[5:], c, d, e_, f) for a, b, c, d, e_, f in flagged], {3},
   [True] * len(flagged)))

w(f'<h2>六、原材料入库明细（{len(IN)} 笔）</h2>')
w(listtable("1", ["#", "提交时间", "物料", "数量 kg", "供应商", "收货人", "备注"],
   [(str(i+1), r["time"][5:], r["material"], fmt(r["kg"]), r["supplier"], r["receiver"], r["remark"])
    for i, r in enumerate(IN)], {0, 3}, [bool(r["_f"]) for r in IN]))

w(f'<h2>七、原材料出库明细（{len(IS)} 笔）</h2>')
w(listtable("2", ["#", "提交时间", "物料", "数量 kg", "批次号", "用途", "领用人", "备注 / 标记"],
   [(str(i+1), r["time"][5:], r["material"], fmt(r["kg"]), r["batch"], r["purpose"], r["requester"],
     "；".join(x for x in (r["remark"], r["_f"]) if x)) for i, r in enumerate(IS)],
   {0, 3}, [bool(r["_f"]) for r in IS]))

w(f'<h2>八、生产入库明细（{len(PK)} 笔）</h2>')
w(listtable("3", ["#", "提交时间", "生产日期", "批次号", "产品", "packs", "原料 kg", "规格", "操作员", "备注 / 标记"],
   [(str(i+1), r["time"][5:], r["prod_date"], r["batch"], r["product"], fmt(r["packs"]), fmt(r["kg"]),
     r["spec"], r["operator"], "；".join(x for x in (r["remark"], r["_f"]) if x)) for i, r in enumerate(PK)],
   {0, 5, 6}, [bool(r["_f"]) for r in PK]))

w('<p class=note>同一份内容的 PDF：<a href="2026-09_Jotform_完整记录.pdf">下载 14 页打印版</a>。</p>')
w('<div class=src><span>数据来源：Jotform 三张表单</span><span>物料、用途与产品名称按常见写法归并统计</span>'
  '<span>明细保留提交时原文</span><span>生成日期 2026-10-21</span></div>')
w('</div>')
w("""<script>
for (const id of ["f","1","2","3"]) {
  const q = document.getElementById("q"+id), t = document.getElementById("t"+id),
        c = document.getElementById("c"+id);
  if (!q || !t) continue;
  const rows = [...t.tBodies[0].rows];
  q.addEventListener("input", () => {
    const term = q.value.trim().toLowerCase();
    let shown = 0;
    for (const r of rows) {
      const hit = !term || r.textContent.toLowerCase().includes(term);
      r.hidden = !hit;
      if (hit) shown++;
    }
    c.textContent = shown === rows.length ? rows.length + " 笔" : shown + " / " + rows.length + " 笔";
  });
}
</script>""")
open(sys.argv[2] if len(sys.argv) > 2 else "index.html", "w", encoding="utf-8").write("\n".join(OUT))
print("wrote", len("\n".join(OUT)), "chars")
