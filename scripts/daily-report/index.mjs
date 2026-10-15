// Daily sales report: Biztory -> WhatsApp.
// The repo is public, so this script never logs amounts or customer names:
// GitHub Actions logs are visible to anyone. Use DRY_RUN=1 locally to preview.
import { BIZTORY } from './config.mjs';
import { fetchAll } from './biztory.mjs';
import { buildReport, formatMessage } from './report.mjs';
import { sendWhatsApp } from './whatsapp.mjs';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

async function main() {
  const token = requireEnv('BIZTORY_TOKEN');
  const dryRun = process.env.DRY_RUN === '1';
  const wa = dryRun ? null : { phone: requireEnv('WHATSAPP_PHONE'), apiKey: requireEnv('CALLMEBOT_APIKEY') };

  let message;
  try {
    const [invoices, payments, creditNotes] = await Promise.all([
      fetchAll(BIZTORY.paths.invoices, token),
      fetchAll(BIZTORY.paths.payments, token),
      fetchAll(BIZTORY.paths.creditNotes, token),
    ]);
    message = formatMessage(buildReport({ invoices, payments, creditNotes }));
    console.log(`Fetched ${invoices.length} invoices, ${payments.length} payments, ${creditNotes.length} credit notes`);
  } catch (err) {
    // Tell the owner instead of failing silently, so no message never means "no sales".
    if (wa) await sendWhatsApp(`⚠️ AEM 每日报告生成失败：${err.message}\n请查看 GitHub Actions。`, wa);
    throw err;
  }

  if (dryRun) {
    console.log(message);
    return;
  }
  await sendWhatsApp(message, wa);
  console.log('WhatsApp report sent');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
