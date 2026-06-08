// js/tracking.js — card pull usage tracking → Google Sheets "TarotUsage" tab
// Uses the same Apps Script endpoint as leads + testimonials.
// Fire-and-forget: never blocks or errors for the user.

const TRACKING_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw9FiVGTH7RmZYNvrRjQp8wi4bRN2Av84fhkVErKU4jgDB7Mpo4Y5SUhTqeKaTwYOit/exec';

function getOrCreateSessionId() {
  let id = localStorage.getItem('cdl_session_id');
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    localStorage.setItem('cdl_session_id', id);
  }
  return id;
}

function trackCardPull({ readingFocus, card, planet, rising, birthYear, aiSuccess }) {
  try {
    const params = new URLSearchParams({
      action:       'track_pull',
      sessionId:    getOrCreateSessionId(),
      readingFocus: readingFocus || 'general',
      card:         card || '',
      planet:       planet || '',
      risingKnown:  rising ? 'yes' : 'no',
      birthYear:    birthYear || '',
      aiSuccess:    aiSuccess ? 'yes' : 'no',
      ts:           new Date().toISOString()
    });
    fetch(`${TRACKING_SCRIPT_URL}?${params}`, { mode: 'no-cors' });
  } catch (e) {
    // silently ignore — tracking must never break the reading experience
  }
}
