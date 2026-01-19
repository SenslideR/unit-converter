import { categories } from '../data/units';

export default function UnitSelector({ category, selected, onChange, label }) {
  const categoryData = categories[category];

  if (!categoryData) return null;

  const units = Object.entries(categoryData.units);

  return (
    <div className="unit-selector">
      <label className="unit-label">{label}</label>
      <select
        className="unit-select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        {units.map(([key, unit]) => (
          <option key={key} value={key}>
            {unit.name} ({unit.symbol})
          </option>
        ))}
      </select>
    </div>
  );
}
