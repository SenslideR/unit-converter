import { categories } from '../data/units';
import '../styles/History.css';

export default function History({ items, onClear, onSelect }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="history">
      <div className="history-header">
        <h3>История конвертаций</h3>
        <button className="history-clear" onClick={onClear}>
          Очистить
        </button>
      </div>

      <div className="history-list">
        {items.map((item) => {
          const categoryData = categories[item.category];
          if (!categoryData) return null;

          const fromUnitData = categoryData.units[item.fromUnit];
          const toUnitData = categoryData.units[item.toUnit];
          if (!fromUnitData || !toUnitData) return null;

          return (
            <button
              key={item.id}
              className="history-item"
              onClick={() => onSelect(item)}
            >
              <span className="history-icon">{categoryData.icon}</span>
              <span className="history-conversion">
                {item.fromValue} {fromUnitData.symbol} = {item.toValue} {toUnitData.symbol}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
