'use client';

import { CategoryNav } from '@/components/help/CategoryNav/CategoryNav';
import { FaqCategory } from '@/components/help/FaqCategory/FaqCategory';
import { Button } from '@/components/ui/Button/Button';
import { useHelp } from '@/hooks/useHelp';
import { categoryLinks } from '@/lib/utils/helpAnswers';
import { EmptyState } from '../EmptyState/EmptyState';
import type { HelpFaqsProps } from './HelpFaqs.types';
import styles from './HelpFaqs.module.css';

/** Outside a search, answers open one at a time, across all the categories. */
const GROUP = 'help-faqs';

/**
 * Help's questions (light): the categories beside them from 820px (chips above them on phones),
 * then each category's questions. Answers open natively, with or without JavaScript; with it, the
 * address follows the open answer (/help#refunds), and a link to one opens it. During a search
 * only the matching answers and their categories show, open and marked, and the counts follow;
 * with none, the empty state offers WhatsApp and a way back.
 */
export function HelpFaqs({ copy, askHref }: HelpFaqsProps) {
  const { categories, searching, terms, matching, openIds, toggled, linkTo, clear } = useHelp();
  const shown = categories
    .map((category) => ({ ...category, questions: searching ? category.questions.filter((q) => matching.has(q.id)) : category.questions }))
    .filter((category) => category.questions.length > 0);

  return (
    <section data-surface="light" className={styles.body}>
      <div className={styles.layout}>
        <CategoryNav label={copy.categories.label} links={categoryLinks(categories, copy.categories.count, searching ? matching : null)} />
        <div className={styles.main}>
          {shown.length === 0 && (
            <EmptyState
              headline={copy.empty.headline}
              lead={copy.empty.lead}
              actions={
                <>
                  <Button href={askHref} icon="whatsapp">
                    {copy.empty.askLabel}
                  </Button>
                  <Button variant="secondary" onClick={clear}>
                    {copy.empty.clearLabel}
                  </Button>
                </>
              }
            />
          )}
          {shown.map((category) => (
            <FaqCategory
              key={category.id}
              {...category}
              linkLabel={copy.linkToAnswer}
              group={searching ? undefined : GROUP}
              terms={terms}
              openIds={openIds}
              onToggle={toggled}
              onAnswerLink={linkTo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
