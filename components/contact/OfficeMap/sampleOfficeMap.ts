import type { OfficeMapData } from '@/lib/utils/contact';

/**
 * The office map for stories: a small page of its own in place of Google's embed, so stories and
 * tests never load google.com (ADR-0029). Its title and link are the sample real settings' office.
 */
export const officeMapStandIn: OfficeMapData = {
  src: `data:text/html,${encodeURIComponent('<!doctype html><title>Map stand-in</title><body style="margin:0;display:grid;place-items:center;height:100vh;font:14px sans-serif">Map of the office (stand-in)</body>')}`,
  title: 'Map of our office in Gulberg, Lahore',
  href: 'https://www.google.com/maps/search/?api=1&query=12%20Main%20Boulevard%2C%20Gulberg%2C%20Lahore',
  linkLabel: 'Open in Google Maps',
};
