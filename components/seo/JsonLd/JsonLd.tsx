import { jsonLdText } from '@/lib/utils/structuredData';
import type { JsonLdProps } from './JsonLd.types';

/** Structured data for search engines: one `<script type="application/ld+json">`, rendered on the server. */
export function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(data) }} />;
}
