import { useState, useEffect, useRef } from 'react';
import { categories } from '../data/units';
import { convert, formatResult } from '../utils/convert';
import UnitSelector from './UnitSelector';
import '../styles/Converter.css';

export default function Converter({ category, onConvert }) {
  const categoryData = categories[category];
  const unitKeys = Object.keys(categoryData.units);

  const [fromUnit, setFromUnit] = useState(unitKeys[0]);
  const [toUnit, setToUnit] = useState(unitKeys[1] || unitKeys[0]);

  // Проверяем, что текущие единицы существуют в выбранной категории
  const validFromUnit = categoryData.units[fromUnit] ? fromUnit : unitKeys[0];
  const validToUnit = categoryData.units[toUnit] ? toUnit : unitKeys[1] || unitKeys[0];
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const lastSaved = useRef('');

  useEffect(() => {
    const newUnitKeys = Object.keys(categories[category].units);
    setFromUnit(newUnitKeys[0]);
    setToUnit(newUnitKeys[1] || newUnitKeys[0]);
    setInputValue('');
    setResult('');
  }, [category]);

  useEffect(() => {
    if (inputValue === '') {
      setResult('');
      return;
    }

    const converted = convert(inputValue, validFromUnit, validToUnit, category);
    setResult(formatResult(converted));
  }, [inputValue, validFromUnit, validToUnit, category]);

  const handleSwap = () => {
    setFromUnit(validToUnit);
    setToUnit(validFromUnit);
    setInputValue(result);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const saveToHistory = () => {
    if (!inputValue || !result) return;

    const key = `${inputValue}-${validFromUnit}-${validToUnit}-${category}`;
    if (lastSaved.current === key) return;

    lastSaved.current = key;
    onConvert?.({
      category,
      fromUnit: validFromUnit,
      toUnit: validToUnit,
      fromValue: inputValue,
      toValue: result,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveToHistory();
    }
    if (e.key === 'Escape') {
      setInputValue('');
      setResult('');
    }
  };

  return (
    <div className="converter">
      <div className="converter-row">
        <div className="input-group">
          <UnitSelector
            category={category}
            selected={validFromUnit}
            onChange={setFromUnit}
            label="Из"
          />
          <input
            type="text"
            className="converter-input"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={saveToHistory}
            onKeyDown={handleKeyDown}
            placeholder="Введите значение"
            autoFocus
          />
        </div>

        <button className="swap-btn" onClick={handleSwap} title="Поменять местами">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
          </svg>
        </button>

        <div className="input-group">
          <UnitSelector
            category={category}
            selected={validToUnit}
            onChange={setToUnit}
            label="В"
          />
          <div className="result-wrapper">
            <input
              type="text"
              className="converter-input result"
              value={result}
              readOnly
              placeholder="Результат"
            />
            {result && (
              <button
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                title={copied ? 'Скопировано!' : 'Копировать'}
              >
                {copied ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {inputValue && result && (
        <div className="conversion-formula">
          {inputValue} {categoryData.units[validFromUnit].symbol} = {result} {categoryData.units[validToUnit].symbol}
        </div>
      )}
    </div>
  );
}
