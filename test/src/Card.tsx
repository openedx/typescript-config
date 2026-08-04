import { useCallback, useState, type ReactElement } from 'react';

import styles from './Card.scss';
import { legacyHelper } from './legacy';
import { formatTitle, isPublished, type Unit } from '@test/utils';

export interface CardProps {
  title: string;
  units?: Unit[];
  onSelect?: (unit: Unit) => void;
}

/**
 * Exercises the `react-jsx` transform: JSX with no `React` import in scope,
 * a webpack-style SCSS import, a `paths` alias and an untyped `.js` import.
 */
export function Card({ title, units = [], onSelect }: CardProps): ReactElement {
  const [selected, setSelected] = useState<Unit | null>(null);

  const handleSelect = useCallback((unit: Unit) => {
    setSelected(unit);
    onSelect?.(unit);
  }, [onSelect]);

  return (
    <div className={styles.card}>
      <h2>{formatTitle(title)}</h2>
      <p>{legacyHelper(selected?.id ?? 'none')}</p>
      <ul>
        {units.map((unit) => (
          <li key={unit.id}>
            <button type="button" onClick={() => handleSelect(unit)}>
              {unit.title} — {isPublished(unit) ? 'published' : 'draft'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Card;
