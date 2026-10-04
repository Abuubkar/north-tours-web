import { CategoryNav } from '@/components/help/CategoryNav/CategoryNav';
import { FaqCategory } from '@/components/help/FaqCategory/FaqCategory';
import { categoryLinks } from '@/lib/utils/helpAnswers';
import type { HelpFaqsProps } from './HelpFaqs.types';
import styles from './HelpFaqs.module.css';

/** Every answer opens one at a time, across all the categories. */
const GROUP = 'help-faqs';

/**
 * Help's questions (light): the categories beside them from 820px (chips above them on phones),
 * then each category's questions. Answers open natively, with or without JavaScript.
 */
export function HelpFaqs({ copy, categories }: HelpFaqsProps) {
  return (
    <section data-surface="light" className={styles.body}>
      <div className={styles.layout}>
        <CategoryNav label={copy.categories.label} links={categoryLinks(categories, copy.categories.count)} />
        <div className={styles.main}>
          {categories.map((category) => (
            <FaqCategory key={category.id} {...category} linkLabel={copy.linkToAnswer} group={GROUP} />
          ))}
        </div>
      </div>
    </section>
  );
}
