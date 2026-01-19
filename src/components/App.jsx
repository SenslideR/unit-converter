import { useState, useEffect, useCallback } from 'react';
import CategorySelector from './CategorySelector';
import Converter from './Converter';
import History from './History';
import { categoryList } from '../data/units';
import '../styles/App.css';

const HISTORY_KEY = 'unit-converter-history';
const MAX_HISTORY = 20;

export default function App() {
  const [category, setCategory] = useState('length');
  const [showShortcuts, setShowShortcuts] = useState(false);
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

  // Горячие клавиши для переключения категорий (1-8)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Игнорируем если фокус в input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        return;
      }

      // Цифры 1-8 для категорий
      const num = parseInt(e.key);
      if (num >= 1 && num <= categoryList.length) {
        setCategory(categoryList[num - 1]);
        return;
      }

      // H для показа горячих клавиш
      if (e.key === 'h' || e.key === 'H') {
        setShowShortcuts(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        <button className="help-btn" onClick={() => setShowShortcuts(true)} title="Горячие клавиши (H)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>Горячие клавиши</span>
          <kbd>H</kbd>
        </button>
        <span className="app-version">v1.0.0</span>
      </footer>

      {showShortcuts && (
        <div className="shortcuts-overlay" onClick={() => setShowShortcuts(false)}>
          <div className="shortcuts-modal" onClick={e => e.stopPropagation()}>
            <h3>Горячие клавиши</h3>
            <button className="shortcuts-close" onClick={() => setShowShortcuts(false)}>×</button>
            <div className="shortcuts-list">
              <div className="shortcut-group">
                <h4>Категории</h4>
                <div className="shortcut"><kbd>1</kbd>-<kbd>8</kbd> <span>Переключить категорию</span></div>
              </div>
              <div className="shortcut-group">
                <h4>Конвертер</h4>
                <div className="shortcut"><kbd>Tab</kbd> <span>Следующее поле</span></div>
                <div className="shortcut"><kbd>Enter</kbd> <span>Сохранить в историю</span></div>
                <div className="shortcut"><kbd>Esc</kbd> <span>Очистить ввод</span></div>
              </div>
              <div className="shortcut-group">
                <h4>Общие</h4>
                <div className="shortcut"><kbd>H</kbd> <span>Показать/скрыть подсказки</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
