// Shared Google Apps Script web app (same one used by oriental-food-wholesale.com)
// that logs every submission to a Sheet and emails the owner immediately.
// Independent of WhatsApp - fires the moment the form is submitted, with no
// extra tap needed, so a lead is never silently lost even if WhatsApp never
// opens or the customer never taps Send.
const NOTIFY_URL =
  'https://script.google.com/macros/s/AKfycbw8csah4zmddhWYkTv231NjDOHXMabW8unvksM5FKy5g2vqPvrOYl2u0hV8pf6bWaM/exec';

export interface AemLeadPayload {
  companyName: string;
  contactName: string;
  phone: string;
  businessType: string;
  interest: string;
  message: string;
  lang: string;
}

export const notifyAemLead = (lead: AemLeadPayload): void => {
  try {
    fetch(NOTIFY_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        source: 'aem_b2b',
        createdAt: new Date().toLocaleString(),
        ...lead,
      }),
    }).catch(() => {
      // Silently ignore - best-effort side channel alongside WhatsApp,
      // must never block or break the form submission.
    });
  } catch (e) {
    // Same reasoning - never let this break the form.
  }
};
