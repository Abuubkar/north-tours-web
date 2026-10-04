import { CategoryNav } from '@/components/help/CategoryNav/CategoryNav';
import { FaqCategory } from '@/components/help/FaqCategory/FaqCategory';
import { optionName } from '@/lib/utils/resultsText';
import type { HelpFaqsProps } from './HelpFaqs.types';
import styles from './HelpFaqs.module.css';

/** Every answer opens one at a time, across all the categories. */
const GROUP = 'help-faqs';

/**
 * Help's questions (light): the categories beside them from 820px (chips above them on phones),
 * then each category's questions. Answers open natively, with or without JavaScript.
 */
export function HelpFaqs({ copy, categories }: HelpFaqsProps) {
  const links = categories.map(({ id, title, questions }) => ({
    id,
    title,
    count: questions.length,
    name: optionName(title, questions.length, copy.categories.count),
  }));
  return (
    <section data-surface="light" className={styles.body}>
      <div className={styles.layout}>
        <CategoryNav label={copy.categories.label} links={links} />
        <div className={styles.main}>
          {categories.map((category) => (
            <FaqCategory key={category.id} {...category} linkLabel={copy.linkToAnswer} group={GROUP} />
          ))}
        </div>
      </div>
    </section>
  );
}
