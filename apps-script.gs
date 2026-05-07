// ═══════════════════════════════════════════════════════════════════════════
// Clair de Lune — Google Apps Script Web App
// Deploy: Extensions → Apps Script → Deploy → New Deployment → Web App
//         Execute as: Me  |  Who has access: Anyone
// Copy the Web App URL and paste it in:
//   js/review.js         → REVIEW_SCRIPT_URL
//   js/testimonials.js   → TESTIMONIALS_SCRIPT_URL
//   js/leads.js          → LEADS_SCRIPT_URL
// ═══════════════════════════════════════════════════════════════════════════

function doGet(e) {
  const action   = e.parameter.action   || '';
  const callback = e.parameter.callback || '';

  let result;
  try {
    if      (action === 'testimonial') result = handleTestimonial(e.parameter);
    else if (action === 'lead')        result = handleLead(e.parameter);
    else                               result = { status: 'error', message: 'unknown action' };
  } catch (err) {
    result = { status: 'error', message: err.toString() };
  }

  const body = callback
    ? `${callback}(${JSON.stringify(result)})`
    : JSON.stringify(result);

  return ContentService
    .createTextOutput(body)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

// ── Testimonial / Review ────────────────────────────────────────────────────
// Sheet tab: "Testimonials"
// Columns:   Name | City | Feedback | Approved | Timestamp
// To show a review on the website: set the Approved cell to TRUE
function handleTestimonial(p) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName('Testimonials');

  if (!sheet) {
    sheet = ss.insertSheet('Testimonials');
    sheet.appendRow(['Name', 'City', 'Feedback', 'Approved', 'Timestamp']);
    sheet.getRange('1:1').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    (p.name || '').trim(),
    (p.city || '').trim(),
    (p.text || '').trim(),
    'FALSE',                        // ← change to TRUE to show on website
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  ]);

  return { status: 'ok' };
}

// ── Lead Capture ─────────────────────────────────────────────────────────────
// Sheet tab: "Leads"
// Columns:   Name | Email | Phone | Timestamp
function handleLead(p) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName('Leads');

  if (!sheet) {
    sheet = ss.insertSheet('Leads');
    sheet.appendRow(['Name', 'Email', 'Phone', 'Timestamp']);
    sheet.getRange('1:1').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    (p.name  || '').trim(),
    (p.email || '').trim(),
    (p.phone || '').trim(),
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  ]);

  return { status: 'ok' };
}
