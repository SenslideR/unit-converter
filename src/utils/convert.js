import { categories } from '../data/units';

const temperatureConversions = {
  cToF: (c) => (c * 9) / 5 + 32,
  cToK: (c) => c + 273.15,
  fToC: (f) => ((f - 32) * 5) / 9,
  fToK: (f) => ((f - 32) * 5) / 9 + 273.15,
  kToC: (k) => k - 273.15,
  kToF: (k) => ((k - 273.15) * 9) / 5 + 32,
};

function convertTemperature(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;

  // Нормализуем ключ: первая буква fromUnit в нижнем регистре, toUnit - в верхнем
  const from = fromUnit.toLowerCase();
  const to = toUnit.toUpperCase();
  const key = `${from}To${to}`;
  const converter = temperatureConversions[key];

  if (converter) {
    return converter(value);
  }

  return value;
}

export function convert(value, fromUnit, toUnit, category) {
  if (value === '' || isNaN(value)) return '';

  const numValue = parseFloat(value);

  if (category === 'temperature') {
    return convertTemperature(numValue, fromUnit, toUnit);
  }

  const categoryData = categories[category];
  if (!categoryData) return '';

  const fromUnitData = categoryData.units[fromUnit];
  const toUnitData = categoryData.units[toUnit];

  if (!fromUnitData || !toUnitData) return '';

  // Защита от деления на ноль
  if (toUnitData.toBase === 0) return '';

  const baseValue = numValue * fromUnitData.toBase;
  const result = baseValue / toUnitData.toBase;

  return result;
}

export function formatResult(value) {
  if (value === '' || value === null || value === undefined) return '';

  const num = parseFloat(value);
  if (isNaN(num)) return '';

  const formatted = num.toFixed(2);

  return parseFloat(formatted).toString();
}
