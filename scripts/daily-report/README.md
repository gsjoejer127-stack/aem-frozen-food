# 每日报告：Biztory → WhatsApp（免费）

每天马来西亚时间傍晚 6 点左右，GitHub Actions 从 Biztory 拉取数据，把汇总发到你的 WhatsApp：
今日/本月销售、今日/本月收款、未收款（含逾期 30 天+ 和欠款最多的 3 个客户）、退货 CN。

费用：RM 0。GitHub Actions 对公开仓库免费；CallMeBot 免费，只能发给自己的号码。

## 一次性设置

1. **作废旧 token**：之前那个 Biztory token 在聊天里出现过。到 Biztory → My Profile → Security → API Key，作废它，再生成一个新的。
2. **开通 CallMeBot**：在手机通讯录加上 CallMeBot 的 WhatsApp 号码（号码见 https://www.callmebot.com/blog/free-api-whatsapp-messages/ ），
   给它发 `I allow callmebot to send me messages`，它会回复你的 apikey。
3. **GitHub → Settings → Secrets and variables → Actions → New repository secret**，添加：
   - `BIZTORY_TOKEN`：新的 Biztory token
   - `WHATSAPP_PHONE`：你的号码，带国家码，例如 `+60123456789`
   - `CALLMEBOT_APIKEY`：CallMeBot 给你的 apikey
4. **验证 API**：Actions → Daily Report (WhatsApp) → Run workflow → mode 选 `probe`。
   日志只显示每个地址的状态码和字段结构（不显示金额和客户名）。
   如果默认地址不对，在 **Variables** 里设置 `BIZTORY_BASE_URL` / `BIZTORY_PATH_INVOICES` / `BIZTORY_PATH_PAYMENTS` / `BIZTORY_PATH_CREDIT_NOTES`。
5. **试发一次**：Run workflow → mode 选 `send`，看手机有没有收到。

定时任务只在 `main` 分支生效，所以这个分支要先合并到 main。

## 注意

- 仓库是公开的，所以 Actions 日志里不打印金额和客户名。要在本地预览报告内容：
  `BIZTORY_TOKEN=... DRY_RUN=1 node scripts/daily-report/index.mjs`
- 拉取数据失败时，会给你发一条 WhatsApp 失败提醒，不会悄悄停掉。
- 公开仓库连续 60 天没有新提交的话，GitHub 会自动停用定时任务（会发邮件通知），到 Actions 页面点 Enable 就能恢复。
- 测试：`node --test scripts/daily-report/test/*.test.mjs`
