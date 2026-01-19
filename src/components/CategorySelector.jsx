import { categories, categoryList } from '../data/units';

export default function CategorySelector({ selected, onSelect }) {
  return (
    <div className="category-selector">
      {categoryList.map((categoryKey) => {
        const category = categories[categoryKey];
        return (
          <button
            key={categoryKey}
            className={`category-btn ${selected === categoryKey ? 'active' : ''}`}
            onClick={() => onSelect(categoryKey)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
