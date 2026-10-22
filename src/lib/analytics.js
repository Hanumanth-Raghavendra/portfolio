// Simple, privacy-friendly analytics.
//
// 1. Vercel Web Analytics: enable it in Vercel → your project → Analytics.
//    The free (Hobby) plan records page views. Custom events (the track() calls
//    below) are only recorded on Vercel's paid plans; on Hobby they're ignored.
// 2. Optional Umami Cloud (free Hobby plan, records custom events too):
//    create a site at umami.is and set VITE_UMAMI_WEBSITE_ID in Vercel.
//
// Events sent: isekai (from where), wake, pro_scroll (25/50/75/100%),
// resume (side), contact_sent (side), voice (command), boss (result), lofi_on.
import { inject, track as vercelTrack } from '@vercel/analytics';

const UMAMI_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID;

export function initAnalytics() {
  try { inject(); } catch { /* analytics is optional */ }
  if (UMAMI_ID && !document.getElementById('umami')) {
    const s = document.createElement('script');
    s.id = 'umami';
    s.defer = true;
    s.src = 'https://cloud.umami.is/script.js';
    s.dataset.websiteId = UMAMI_ID;
    document.head.appendChild(s);
  }
}

export function track(name, data) {
  try { vercelTrack(name, data); } catch { /* ignore */ }
  try { window.umami?.track?.(name, data); } catch { /* ignore */ }
}
