import type { OfficeMap } from './OfficeMap.types';

/**
 * The office map for stories: a small page of its own in place of Google's embed, so stories and
 * tests never load google.com (ADR-0029). The link still names the real Google Maps search.
 */
export const mapStandIn: OfficeMap = {
  src: `data:text/html,${encodeURIComponent('<!doctype html><title>Map stand-in</title><body style="margin:0;display:grid;place-items:center;height:100vh;font:14px sans-serif;background:#1b252c;color:#b7bfc5">Map of the office (stand-in)</body>')}`,
  title: 'Map of our office in DHA Phase 8, Lahore',
  href: 'https://www.google.com/maps/search/?api=1&query=12%20Main%20Boulevard%2C%20Gulberg%2C%20Lahore',
  linkLabel: 'Open in Google Maps',
};
