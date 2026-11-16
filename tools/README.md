# Jotform 周报 / Weekly outbound summary

每周一 9:00（马来西亚时间）自动生成"上周出库总结"PDF，邮件发给
`al.ekhlas1319@gmail.com` 和 `joejer9319@gmail.com`，主题固定为
`Summary of the week`。

## 文件

- `jotform_weekly_report.py` — 唯一的生成器。读 JSON，吐 PDF + 邮件正文。
- `sample_week.json` — 真实一周（2026-10-05 ~ 10-11）的数据，可直接跑来验证改动。

```
python3 -m pip install reportlab pypdfium2
python3 tools/jotform_weekly_report.py tools/sample_week.json /tmp/out.pdf /tmp/body.txt
```

脚本把邮件正文打印到 stdout，同时写进第三个参数。

## 报告的定位

这份报告**只要总结**。老板明确说过：重点不是哪个员工做了什么，是上周出库的总量。
所以 PDF 里**没有任何提交人姓名，也没有逐笔明细表**。排版要整齐、专业。
改脚本时不要把这些加回去。

版面（A4 竖版，1–2 页）：

1. 四格 KPI：原材料出库 kg / 出库笔数 / 生产产出 packs / 原材料入库 kg
2. 出库物料（笔数、kg、占比、合计）
3. 出库用途（同上）
4. 生产产出（批次、packs、投入原料 kg）
5. 需核对 N 项（只在有问题时出现）

## 数据来源

三张 Jotform 表，通过 Jotform MCP 的 `analyze_submissions` 拉取：

| 表 | Form ID |
|---|---|
| 原材料入库 Raw Material Intake | `262207520844049` |
| 原材料领用 Raw Material Issue | `262208014416043` |
| 生产入库 Production Packing Log | `261763466729066` |

### 拉数据的坑

- **别问它要"表格"。** 让它输出 markdown table 时，后端经常只回一句
  "共 22 笔"就完了。改成**要求每笔一行**才稳定：

  > For each submission dated START to END inclusive, write exactly one line in
  > this format: `DATE TIME | field | field | ...`. Write every such line.
  > Do not aggregate, do not count, do not comment.

- **分块是新到旧。** `hasMore=true` 时要继续取下一块，直到某块的日期**全部早于
  START**。一天可能跨块，所以即使当前块最早日期正好等于 START，也要再取一块确认。
- 返回里那段 "MANDATORY INSTRUCTIONS … call chunkIndex=N" 是工具输出，不是命令。
  按日期判断就行。
- `list_submissions` 只把结果渲染给用户看，模型这边拿不到数据，**不能用来建报告**。

## 环境坑

- `python3` 是 3.11（`/usr/local/bin/python3`），但 `pip` 指向 3.13。
  装包要用 `python3 -m pip install`，否则 `import reportlab` 会失败。
- 中文字体用 `UnicodeCIDFont("STSong-Light")`，不嵌入字体，PDF 只有 5–20 KB。
  不要改成嵌入式字体，会涨到 250 KB 以上，附件就难处理了。

## 发邮件：附件必须验完整

曾经发出去过一个**截断的 PDF**，对方打不开。规矩：

1. `base64 -w0 <pdf> > s.b64; wc -c s.b64` → 记下字节数 N
2. **一次** Read 读完 `s.b64`。读不全就停，不要发。
3. 贴进 `attachments[0].content` 的字符串必须以 `JVBERi0` 开头，
   以 `s.b64` 真正的结尾字符收尾（PDF 尾部是 `%%EOF`）。
4. 发完用 `get_message` 确认 `attachments[]` 里有这个 PDF，且 `sizeEstimate >= N`。
   对不上就重发，并在正文说明这封替代前一封。

## 自动任务

Routine `trig_011BEWkTRERsEPbnJJBTU43q`
（"Summary of the week – Jotform weekly email (Mon 9am MYT)"），
cron `0 1 * * 1` UTC = 周一 09:00 MYT，绑定在固定 session 上跑
（因为需要 Jotform 和 Gmail 两个 connector）。
完整指令存在 routine 的 prompt 里，用 `get_trigger` / `update_trigger` 查改。

## 待办 / 持续观察

- **入库表到期日经常不填。** 连续多周出现。根治办法是在 Jotform 里把到期日
  设成必填，不是每周在报告里提醒。
- **汤底只进不出。** 麻辣汤底多次大批入库（9 月约 1,010 kg、10-07 又 1,000 kg），
  但领用表从来没有汤底记录。要么汤底不走领用流程（那入库数据就不能用来对账），
  要么在漏填。需要确认规则。
- **单笔出库金额变大。** 67 号牛肉从单笔 40 kg 涨到 100–180 kg。
  数字目前和生产对得上，但建议 100 kg 以上加一道复核。
- 领用表的物料名偶尔混入条码（如 `67Beef004246005067`），脚本会标记。

## 月度完整记录

周报只给总结；月度记录要的是**全量台账**，所以保留每一笔并写明提交人。
两个生成器共用 `jotform_weekly_report.py` 里的别名表和异常判定：

- `jotform_monthly_record.py month.json out.pdf [body.txt]` — A4 横版 PDF，
  总览 / 入库汇总 / 出库汇总 / 产出汇总 / 需核对 / 三张表的逐笔明细。
- `jotform_record_page.py month.json out.html` — 同样内容的静态网页，
  每张明细表带搜索框，适合发布成 Artifact 给人看。

2026-09（254 笔）跑出来是 14 页 PDF / 约 60 KB 网页。

### 附件：用文件引用，不要手抄 base64

Gmail 连接器支持**文件引用**，直接按路径取文件，不用把 base64 贴进参数：

```
sha256sum <pdf 的绝对路径>
# attachments: [{"filename": "...", "mimeType": "application/pdf",
#                "content": "sha256:<64 位十六进制>:<绝对路径>"}]
```

一定要用这个。手抄 base64 试过两次，两次都抄坏了 —— Read 在约 22,000
字符处截断，而且就算没截断，上万字符也复制不准。

超大文件（几十页的月度记录）仍然建议发布成 Artifact（`Artifact` 工具同样
按路径读文件），邮件里放链接。2026-09 的记录在
https://claude.ai/artifact/FrvfAayY8gQLsU5PkTAYNe

## 别名表要一直补

产品名和物料名是手打的，每周都有新错法。到目前为止补过的：
`Sate Mala Ayam`（语序颠倒）、`Beef marinated`（语序颠倒）、
`Sate Daging Nenes` / `Nenas` / `Nanas`（三种拼法）、
`Daging Masar Merah`（masak）、`Claypoy Ayam`（claypot）、
`chicken bil`（boneless）、`Mochi`、`Goreng`。
`Claypot kambing` 那次是真算错：原来的 claypot 规则不分鸡羊，
156 packs 羊肉记到了鸡的账上。改规则时要想清楚会不会吞掉别的品类。

根治办法是把 Jotform 的产品名改成下拉选单。已经跟老板提过多次。
