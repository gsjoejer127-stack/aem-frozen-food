// Sends a WhatsApp message to your own number via CallMeBot (free, personal use).
export async function sendWhatsApp(text, { phone, apiKey }, fetchImpl = fetch) {
  const url = new URL('https://api.callmebot.com/whatsapp.php');
  url.searchParams.set('phone', phone);
  url.searchParams.set('text', text);
  url.searchParams.set('apikey', apiKey);
  const res = await fetchImpl(url);
  const body = await res.text();
  if (!res.ok || /error|invalid|not\s+allowed/i.test(body)) {
    throw new Error(`CallMeBot HTTP ${res.status}`);
  }
}
