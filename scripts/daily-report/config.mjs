// Biztory API mapping. Paths and field names are NOT yet verified against the
// live API (the build sandbox could not reach Biztory). Run the "probe" mode of
// the Daily Report workflow once, then adjust this file if needed.
export const BIZTORY = {
  baseUrl: process.env.BIZTORY_BASE_URL || 'https://api.biztoryapp.com/api',
  paths: {
    invoices: process.env.BIZTORY_PATH_INVOICES || '/invoices',
    payments: process.env.BIZTORY_PATH_PAYMENTS || '/payments',
    creditNotes: process.env.BIZTORY_PATH_CREDIT_NOTES || '/credit-notes',
  },
  // First field present on a record wins.
  fields: {
    date: ['date', 'doc_date', 'invoice_date', 'payment_date', 'issue_date', 'created_at'],
    dueDate: ['due_date', 'payment_due_date'],
    total: ['grand_total', 'total_amount', 'total', 'amount'],
    outstanding: ['balance_due', 'outstanding', 'outstanding_amount', 'amount_due', 'balance'],
    customer: ['customer_name', 'contact_name', 'customer.name', 'contact.name', 'customer', 'name'],
    status: ['status', 'payment_status'],
    number: ['number', 'doc_no', 'invoice_no', 'reference', 'id'],
  },
  voidStatuses: ['void', 'voided', 'cancelled', 'canceled', 'draft', 'deleted'],
  pageSize: 100,
  maxPages: 50,
};

export const TIMEZONE = 'Asia/Kuala_Lumpur';
