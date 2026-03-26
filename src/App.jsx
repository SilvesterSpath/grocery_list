import { useEffect, useState } from 'react';
import { AppHeader } from './components/AppHeader.jsx';
import { GroceryListPanel } from './components/GroceryListPanel.jsx';
import { PresetsPanel } from './components/PresetsPanel.jsx';
import { defaultLists } from './data/data.js';
import { globalCSS, styles } from './styles/groceryAppStyles.js';
import {
  loadState,
  loadTheme,
  makeItem,
  saveState,
  saveTheme,
  translateKnownItemsInList,
  translateKnownPresets,
} from './utils/groceryHelpers.js';

export default function GroceryApp() {
  const [theme, setTheme] = useState(loadTheme);
  const [items, setItems] = useState(() => {
    const saved = loadState();
    return translateKnownItemsInList(saved?.items ?? []);
  });
  const [presets, setPresets] = useState(() => {
    const saved = loadState();
    return translateKnownPresets(saved?.presets ?? defaultLists);
  });
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [dragState, setDragState] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveState({ items, presets });
  }, [items, presets]);

  const addItem = () => {
    const name = newItemName.trim();
    if (!name) return;
    setItems((prev) => [...prev, makeItem(name)]);
    setNewItemName('');
  };

  const deleteItem = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const toggleNeeded = (id) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, needed: !i.needed } : i)),
    );

  const toggleBought = (id) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, bought: !i.bought } : i)),
    );

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const commitEdit = (id) => {
    const name = editingName.trim();
    if (name)
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, name } : i)));
    setEditingId(null);
  };

  const handleEditKey = (e, id) => {
    if (e.key === 'Enter') commitEdit(id);
    if (e.key === 'Escape') setEditingId(null);
  };

  const addFromPreset = (presetName) => {
    const presetItems = presets[presetName] || [];
    const newItems = presetItems.map(makeItem);
    setItems((prev) => [...prev, ...newItems]);
    setActiveTab('list');
  };

  const saveAsPreset = () => {
    const name = newPresetName.trim();
    if (!name) return;
    const names = items.map((i) => i.name);
    setPresets((prev) => ({ ...prev, [name]: names }));
    setNewPresetName('');
    setShowSavePreset(false);
  };

  const deletePreset = (name) => {
    setPresets((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const clearBought = () => setItems((prev) => prev.filter((i) => !i.bought));
  const clearAll = () => setItems([]);

  const handleDragStart = (e, id) => {
    setDragState(id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(id);
  };
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!dragState || dragState === targetId) return;
    setItems((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((i) => i.id === dragState);
      const toIdx = next.findIndex((i) => i.id === targetId);
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    setDragState(null);
    setDragOver(null);
  };
  const handleDragEnd = () => {
    setDragState(null);
    setDragOver(null);
  };

  const neededItems = items.filter((i) => i.needed);
  const haveItems = items.filter((i) => !i.needed);
  const boughtCount = items.filter((i) => i.bought).length;

  return (
    <div style={styles.root}>
      <style>{globalCSS}</style>

      <AppHeader
        theme={theme}
        onToggleTheme={() =>
          setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
        }
        boughtCount={boughtCount}
        itemCount={items.length}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main style={styles.main}>
        {activeTab === 'list' && (
          <GroceryListPanel
            items={items}
            neededItems={neededItems}
            haveItems={haveItems}
            boughtCount={boughtCount}
            newItemName={newItemName}
            onNewItemNameChange={setNewItemName}
            onAddItem={addItem}
            showSavePreset={showSavePreset}
            onOpenSavePreset={() => setShowSavePreset(true)}
            onCloseSavePreset={() => setShowSavePreset(false)}
            newPresetName={newPresetName}
            onNewPresetNameChange={setNewPresetName}
            onSaveAsPreset={saveAsPreset}
            onClearBought={clearBought}
            onClearAll={clearAll}
            editingId={editingId}
            editingName={editingName}
            setEditingName={setEditingName}
            onStartEdit={startEdit}
            onCommitEdit={commitEdit}
            onEditKey={handleEditKey}
            onToggleNeeded={toggleNeeded}
            onToggleBought={toggleBought}
            onDeleteItem={deleteItem}
            dragState={dragState}
            dragOver={dragOver}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        )}

        {activeTab === 'presets' && (
          <PresetsPanel
            presets={presets}
            onAddFromPreset={addFromPreset}
            onDeletePreset={deletePreset}
          />
        )}
      </main>
    </div>
  );
}
