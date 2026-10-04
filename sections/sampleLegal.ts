import type { LegalSectionProps } from '@/components/legal/LegalSection/LegalSection.types';

/* Sample legal text for the legal stories, which can't read content files: the Terms' nine sections, filled. */

const terms: [string, string, string[]][] = [
  ['bookings', 'Bookings and payment', ['Your seats are confirmed once we have received a 30% advance.', 'We accept cash or bank transfer, and nothing else. The balance is due 7 days before departure.']],
  ['cancellations', 'Cancellations and refunds', ['Cancel 14 or more days before departure for a full refund of your advance. Between 7 and 13 days, 50% is refunded. Within 7 days the advance is non-refundable.', 'Refunds are paid back the same way you paid, within 7 days of cancelling.']],
  ['changes-by-us', 'Changes by us', ['We may change a route, a hotel or the order of the days when roads, weather or safety require it.', 'If we cancel a departure, you choose between a full refund and a free move to another date.']],
  ['your-responsibilities', 'Your responsibilities', ['Bring a valid CNIC for every adult, and any document a hotel or checkpoint asks for.', 'Respect local customs and the places we visit.']],
  ['health', 'Health and safety', ['Mountain roads are long, and some stops are high. If you have a heart or breathing condition, check with your doctor before you book.']],
  ['liability', 'Liability', ['We arrange the trip you booked with reasonable care. We aren’t responsible for delays caused by weather, landslides or road closures, but we always help you find the safest way on.']],
  ['complaints', 'Complaints', ['If something isn’t right during the trip, tell your guide straight away.', 'After the trip, message us on WhatsApp or email us. We reply within 2 hours.']],
  ['law', 'Governing law', ['These terms are governed by the laws of Pakistan, and any dispute is heard by the courts of Lahore.']],
  ['contact', 'Contact', ['For any question about these terms, email [hello@brand.pk] or visit our office at [Office address], Lahore, Punjab.']],
];

export const sampleLegalSections: LegalSectionProps[] = terms.map(([id, heading, paragraphs], i) => ({ id, number: i + 1, heading, paragraphs }));

export const sampleLegalLabels = { label: 'Contents', countLabel: 'Contents (9)' };
