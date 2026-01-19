import { useState, useEffect } from 'react';
import CategorySelector from './CategorySelector';
import Converter from './Converter';
import History from './History';
import '../styles/App.css';

const HISTORY_KEY = 'unit-converter-history';
const MAX_HISTORY = 20;

export default function App() {
  const [category, setCategory] = useState('length');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = (item) => {
    setHistory((prev) => {
      const isDuplicate = prev.length > 0 &&
        prev[0].fromValue === item.fromValue &&
        prev[0].fromUnit === item.fromUnit &&
        prev[0].toUnit === item.toUnit &&
        prev[0].category === item.category;

      if (isDuplicate) return prev;

      const newHistory = [{ ...item, id: Date.now() }, ...prev];
      return newHistory.slice(0, MAX_HISTORY);
    });
  };

  const clearHistory = () => setHistory([]);

  const applyFromHistory = (item) => {
    setCategory(item.category);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Конвертер единиц</h1>
        <p className="app-subtitle">Быстрая конвертация между различными единицами измерения</p>
      </header>

      <main className="app-main">
        <CategorySelector selected={category} onSelect={setCategory} />
        <Converter category={category} onConvert={addToHistory} />
        <History
          items={history}
          onClear={clearHistory}
          onSelect={applyFromHistory}
        />
      </main>

      <footer className="app-footer">
        <p>Выберите категорию и введите значение для конвертации</p>
      </footer>
    </div>
  );
}
