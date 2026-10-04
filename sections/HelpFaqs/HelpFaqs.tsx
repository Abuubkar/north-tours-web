'use client';

import { useMemo } from 'react';
import { CategoryNav } from '@/components/help/CategoryNav/CategoryNav';
import { FaqCategory } from '@/components/help/FaqCategory/FaqCategory';
import { useAnswerHash } from '@/hooks/useAnswerHash';
import { categoryLinks } from '@/lib/utils/helpAnswers';
import type { HelpFaqsProps } from './HelpFaqs.types';
import styles from './HelpFaqs.module.css';

/** Every answer opens one at a time, across all the categories. */
const GROUP = 'help-faqs';

/**
 * Help's questions (light): the categories beside them from 820px (chips above them on phones),
 * then each category's questions. Answers open natively, with or without JavaScript; with it,
 * the address follows the open answer (/help#refunds), and a link to one opens it.
 */
export function HelpFaqs({ copy, categories }: HelpFaqsProps) {
  const ids = useMemo(() => categories.flatMap(({ questions }) => questions.map((q) => q.id)), [categories]);
  const { openId, toggled, linkTo } = useAnswerHash(ids);
  const openIds = useMemo(() => new Set(openId === null ? [] : [openId]), [openId]);
  return (
    <section data-surface="light" className={styles.body}>
      <div className={styles.layout}>
        <CategoryNav label={copy.categories.label} links={categoryLinks(categories, copy.categories.count)} />
        <div className={styles.main}>
          {categories.map((category) => (
            <FaqCategory
              key={category.id}
              {...category}
              linkLabel={copy.linkToAnswer}
              group={GROUP}
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
