import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'grocery_app_v1';

const defaultLists = {
  'Weekly Essentials': [
    'Milk',
    'Eggs',
    'Bread',
    'Butter',
    'Yogurt',
    'Cheese',
    'Chicken breast',
    'Pasta',
    'Rice',
    'Olive oil',
  ],
  'Fruits & Veggies': [
    'Apples',
    'Bananas',
    'Tomatoes',
    'Spinach',
    'Carrots',
    'Onions',
    'Garlic',
    'Lemons',
    'Broccoli',
    'Avocados',
  ],
  'Baking Essentials': [
    'Flour',
    'Sugar',
    'Baking powder',
    'Vanilla extract',
    'Cocoa powder',
    'Honey',
    'Oats',
    'Almonds',
  ],
  'Cleaning Supplies': [
    'Dish soap',
    'Laundry detergent',
    'Sponges',
    'Trash bags',
    'Paper towels',
    'Bleach spray',
  ],
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupted storage */
  }
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore storage write failures */
  }
}

let idCounter = Date.now();
function newId() {
  return `item_${idCounter++}`;
}

function makeItem(name) {
  return { id: newId(), name, needed: true, bought: false };
}

export default function GroceryApp() {
  const [items, setItems] = useState(() => {
    const saved = loadState();
    return saved?.items ?? [];
  });
  const [presets, setPresets] = useState(() => {
    const saved = loadState();
    return saved?.presets ?? defaultLists;
  });
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [dragState, setDragState] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [activeTab, setActiveTab] = useState('list'); // list | presets
  const inputRef = useRef(null);

  useEffect(() => {
    saveState({ items, presets });
  }, [items, presets]);

  const addItem = () => {
    const name = newItemName.trim();
    if (!name) return;
    setItems((prev) => [...prev, makeItem(name)]);
    setNewItemName('');
    inputRef.current?.focus();
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

  // Drag and drop
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

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🛒</span>
            <span style={styles.logoText}>Pantry</span>
          </div>
          <div style={styles.headerStats}>
            {boughtCount > 0 && (
              <span style={styles.badge}>{boughtCount} in cart</span>
            )}
            <span style={styles.totalBadge}>{items.length} items</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'list' ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab('list')}
          >
            My List
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'presets' ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab('presets')}
          >
            Saved Lists
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={styles.main}>
        {activeTab === 'list' && (
          <>
            {/* Add input */}
            <div style={styles.addRow}>
              <input
                ref={inputRef}
                style={styles.addInput}
                placeholder='Add item…'
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem()}
              />
              <button style={styles.addBtn} onClick={addItem}>
                +
              </button>
            </div>

            {/* Actions row */}
            {items.length > 0 && (
              <div style={styles.actionsRow}>
                <button
                  style={styles.ghostBtn}
                  onClick={() => setShowSavePreset(true)}
                >
                  💾 Save as list
                </button>
                {boughtCount > 0 && (
                  <button style={styles.ghostBtn} onClick={clearBought}>
                    🧹 Clear bought
                  </button>
                )}
                <button
                  style={{ ...styles.ghostBtn, ...styles.dangerBtn }}
                  onClick={clearAll}
                >
                  🗑 Clear all
                </button>
              </div>
            )}

            {/* Save preset modal */}
            {showSavePreset && (
              <div
                style={styles.modalOverlay}
                onClick={() => setShowSavePreset(false)}
              >
                <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.modalTitle}>Save current list</div>
                  <input
                    style={styles.modalInput}
                    autoFocus
                    placeholder='List name…'
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveAsPreset();
                      if (e.key === 'Escape') setShowSavePreset(false);
                    }}
                  />
                  <div style={styles.modalBtns}>
                    <button
                      style={styles.modalCancel}
                      onClick={() => setShowSavePreset(false)}
                    >
                      Cancel
                    </button>
                    <button style={styles.modalSave} onClick={saveAsPreset}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            {items.length > 0 && (
              <div style={styles.legend}>
                <span style={styles.legendItem}>
                  <span style={styles.legendDot({ color: '#22c55e' })} />
                  Need to buy
                </span>
                <span style={styles.legendItem}>
                  <span style={styles.legendDot({ color: '#94a3b8' })} />
                  Already have
                </span>
                <span style={styles.legendItem}>
                  <span style={{ ...styles.legendCheck }} />
                  Bought in store
                </span>
              </div>
            )}

            {/* Items */}
            {items.length === 0 ? (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>🥕</div>
                <div style={styles.emptyText}>Your list is empty</div>
                <div style={styles.emptyHint}>
                  Add items above or load a saved list
                </div>
              </div>
            ) : (
              <>
                {neededItems.length > 0 && (
                  <section style={styles.section}>
                    <div style={styles.sectionLabel}>
                      <span style={styles.sectionDot({ color: '#22c55e' })} />
                      To buy ({neededItems.length})
                    </div>
                    {neededItems.map((item) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        editingId={editingId}
                        editingName={editingName}
                        setEditingName={setEditingName}
                        onStartEdit={startEdit}
                        onCommitEdit={commitEdit}
                        onEditKey={handleEditKey}
                        onToggleNeeded={toggleNeeded}
                        onToggleBought={toggleBought}
                        onDelete={deleteItem}
                        isDragging={dragState === item.id}
                        isDragOver={dragOver === item.id}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                      />
                    ))}
                  </section>
                )}

                {haveItems.length > 0 && (
                  <section style={styles.section}>
                    <div style={styles.sectionLabel}>
                      <span style={styles.sectionDot({ color: '#94a3b8' })} />
                      Already have ({haveItems.length})
                    </div>
                    {haveItems.map((item) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        editingId={editingId}
                        editingName={editingName}
                        setEditingName={setEditingName}
                        onStartEdit={startEdit}
                        onCommitEdit={commitEdit}
                        onEditKey={handleEditKey}
                        onToggleNeeded={toggleNeeded}
                        onToggleBought={toggleBought}
                        onDelete={deleteItem}
                        isDragging={dragState === item.id}
                        isDragOver={dragOver === item.id}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                      />
                    ))}
                  </section>
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'presets' && (
          <div>
            <div style={styles.presetsHeader}>
              <p style={styles.presetsHint}>
                Pick a saved list to load all its items into your current list.
              </p>
            </div>
            {Object.keys(presets).length === 0 ? (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>📋</div>
                <div style={styles.emptyText}>No saved lists yet</div>
                <div style={styles.emptyHint}>
                  Build a list and save it for later
                </div>
              </div>
            ) : (
              Object.entries(presets).map(([name, itemNames]) => (
                <div key={name} style={styles.presetCard}>
                  <div style={styles.presetCardTop}>
                    <div>
                      <div style={styles.presetCardName}>{name}</div>
                      <div style={styles.presetCardCount}>
                        {itemNames.length} items
                      </div>
                    </div>
                    <div style={styles.presetCardActions}>
                      <button
                        style={styles.presetLoadBtn}
                        onClick={() => addFromPreset(name)}
                      >
                        Load into list
                      </button>
                      <button
                        style={styles.presetDeleteBtn}
                        onClick={() => deletePreset(name)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div style={styles.presetTags}>
                    {itemNames.slice(0, 8).map((n, i) => (
                      <span key={i} style={styles.tag}>
                        {n}
                      </span>
                    ))}
                    {itemNames.length > 8 && (
                      <span style={styles.tagMore}>
                        +{itemNames.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function ItemRow({
  item,
  editingId,
  editingName,
  setEditingName,
  onStartEdit,
  onCommitEdit,
  onEditKey,
  onToggleNeeded,
  onToggleBought,
  onDelete,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const isEditing = editingId === item.id;
  const editRef = useRef(null);

  useEffect(() => {
    if (isEditing) editRef.current?.focus();
  }, [isEditing]);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragOver={(e) => onDragOver(e, item.id)}
      onDrop={(e) => onDrop(e, item.id)}
      onDragEnd={onDragEnd}
      style={{
        ...styles.itemRow,
        ...(isDragging ? styles.itemDragging : {}),
        ...(isDragOver ? styles.itemDragOver : {}),
        ...(item.bought ? styles.itemBought : {}),
      }}
    >
      {/* Drag handle */}
      <span style={styles.dragHandle} title='Drag to reorder'>
        ⠿
      </span>

      {/* Checkbox - bought in store */}
      <label style={styles.checkboxLabel}>
        <input
          type='checkbox'
          checked={item.bought}
          onChange={() => onToggleBought(item.id)}
          style={styles.checkboxInput}
        />
        <span
          style={{
            ...styles.customCheck,
            ...(item.bought ? styles.customCheckChecked : {}),
          }}
        >
          {item.bought && <span style={styles.checkMark}>✓</span>}
        </span>
      </label>

      {/* Name - inline edit */}
      {isEditing ? (
        <input
          ref={editRef}
          style={styles.editInput}
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          onBlur={() => onCommitEdit(item.id)}
          onKeyDown={(e) => onEditKey(e, item.id)}
        />
      ) : (
        <span
          style={{
            ...styles.itemName,
            ...(item.bought ? styles.itemNameBought : {}),
            ...(!item.needed ? styles.itemNameHave : {}),
          }}
          onDoubleClick={() => onStartEdit(item)}
          title='Double-click to edit'
        >
          {item.name}
        </span>
      )}

      {/* Needed/Have toggle */}
      <label
        style={styles.toggleLabel}
        title={item.needed ? 'Mark as already have' : 'Mark as needed'}
      >
        <input
          type='checkbox'
          checked={item.needed}
          onChange={() => onToggleNeeded(item.id)}
          style={{ display: 'none' }}
        />
        <span
          style={{
            ...styles.toggle,
            ...(item.needed ? styles.toggleOn : styles.toggleOff),
          }}
        >
          <span
            style={{
              ...styles.toggleKnob,
              ...(item.needed ? styles.toggleKnobOn : {}),
            }}
          />
        </span>
      </label>

      {/* Edit button */}
      {!isEditing && (
        <button
          style={styles.iconBtn}
          onClick={() => onStartEdit(item)}
          title='Edit name'
        >
          ✎
        </button>
      )}

      {/* Delete */}
      <button
        style={{ ...styles.iconBtn, ...styles.deleteBtn }}
        onClick={() => onDelete(item.id)}
        title='Delete'
      >
        ✕
      </button>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #faf7f2; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d4c9b5; border-radius: 4px; }

  .item-row-enter { opacity: 0; transform: translateY(-6px); }
  .item-row-enter-active { opacity: 1; transform: none; transition: all 0.2s; }
`;

const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: '100vh',
    background: '#faf7f2',
    color: '#2c2416',
    maxWidth: 540,
    margin: '0 auto',
    paddingBottom: 60,
  },

  header: {
    background: '#fff',
    borderBottom: '2px solid #ede8df',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 12px rgba(44,36,22,0.06)',
  },

  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px 10px',
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },

  logoIcon: {
    fontSize: 26,
  },

  logoText: {
    fontFamily: "'Fraunces', serif",
    fontSize: 24,
    fontWeight: 700,
    color: '#2c2416',
    letterSpacing: '-0.5px',
  },

  headerStats: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },

  badge: {
    background: '#dcfce7',
    color: '#15803d',
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 20,
    border: '1px solid #bbf7d0',
  },

  totalBadge: {
    background: '#f1ede6',
    color: '#7c6a52',
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 20,
  },

  tabs: {
    display: 'flex',
    padding: '0 20px',
    gap: 4,
  },

  tab: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    padding: '8px 14px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: '#9a8870',
    borderBottom: '2px solid transparent',
    transition: 'all 0.15s',
    marginBottom: -2,
  },

  tabActive: {
    color: '#2c2416',
    borderBottomColor: '#e8783a',
    fontWeight: 600,
  },

  main: {
    padding: '16px 16px 0',
  },

  addRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 10,
  },

  addInput: {
    flex: 1,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    padding: '10px 14px',
    border: '2px solid #ede8df',
    borderRadius: 10,
    background: '#fff',
    color: '#2c2416',
    outline: 'none',
    transition: 'border-color 0.15s',
  },

  addBtn: {
    width: 44,
    height: 44,
    background: '#e8783a',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 22,
    fontWeight: 300,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.15s, transform 0.1s',
  },

  actionsRow: {
    display: 'flex',
    gap: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
  },

  ghostBtn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    fontWeight: 500,
    padding: '5px 10px',
    border: '1.5px solid #ede8df',
    borderRadius: 8,
    background: '#fff',
    color: '#7c6a52',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  dangerBtn: {
    color: '#dc2626',
    borderColor: '#fecaca',
  },

  legend: {
    display: 'flex',
    gap: 14,
    marginBottom: 12,
    fontSize: 11,
    color: '#9a8870',
    flexWrap: 'wrap',
  },

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },

  legendDot: ({ color }) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
  }),

  legendCheck: {
    width: 14,
    height: 14,
    border: '1.5px solid #6b7280',
    borderRadius: 4,
    display: 'inline-block',
    background: '#fff',
  },

  section: {
    marginBottom: 16,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#9a8870',
    marginBottom: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

  sectionDot: ({ color }) => ({
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
    flexShrink: 0,
  }),

  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#fff',
    border: '1.5px solid #ede8df',
    borderRadius: 10,
    padding: '9px 10px',
    marginBottom: 6,
    transition: 'all 0.15s',
    cursor: 'default',
    userSelect: 'none',
  },

  itemDragging: {
    opacity: 0.4,
    transform: 'scale(0.98)',
  },

  itemDragOver: {
    borderColor: '#e8783a',
    boxShadow: '0 0 0 2px rgba(232,120,58,0.2)',
  },

  itemBought: {
    background: '#f9fafb',
    borderColor: '#f1f5f9',
  },

  dragHandle: {
    fontSize: 16,
    color: '#c8bfb2',
    cursor: 'grab',
    flexShrink: 0,
    lineHeight: 1,
  },

  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },

  checkboxInput: {
    display: 'none',
  },

  customCheck: {
    width: 18,
    height: 18,
    border: '1.5px solid #d1d5db',
    borderRadius: 5,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
    flexShrink: 0,
  },

  customCheckChecked: {
    background: '#22c55e',
    borderColor: '#22c55e',
  },

  checkMark: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    lineHeight: 1,
  },

  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: 500,
    color: '#2c2416',
    cursor: 'pointer',
    wordBreak: 'break-word',
    lineHeight: 1.3,
  },

  itemNameBought: {
    textDecoration: 'line-through',
    color: '#a0a0a0',
  },

  itemNameHave: {
    color: '#9a8870',
  },

  editInput: {
    flex: 1,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 500,
    padding: '2px 6px',
    border: '1.5px solid #e8783a',
    borderRadius: 6,
    background: '#fff',
    color: '#2c2416',
    outline: 'none',
  },

  toggleLabel: {
    cursor: 'pointer',
    flexShrink: 0,
  },

  toggle: {
    display: 'flex',
    alignItems: 'center',
    width: 34,
    height: 18,
    borderRadius: 9,
    padding: '2px',
    transition: 'background 0.2s',
    flexShrink: 0,
  },

  toggleOn: {
    background: '#22c55e',
    justifyContent: 'flex-end',
  },

  toggleOff: {
    background: '#cbd5e1',
    justifyContent: 'flex-start',
  },

  toggleKnob: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    transition: 'all 0.2s',
    flexShrink: 0,
  },

  toggleKnobOn: {},

  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#c8bfb2',
    fontSize: 14,
    padding: '2px 4px',
    borderRadius: 4,
    lineHeight: 1,
    transition: 'color 0.15s',
    flexShrink: 0,
  },

  deleteBtn: {
    fontSize: 11,
  },

  empty: {
    textAlign: 'center',
    padding: '60px 20px',
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyText: {
    fontFamily: "'Fraunces', serif",
    fontSize: 20,
    fontWeight: 600,
    color: '#7c6a52',
    marginBottom: 6,
  },

  emptyHint: {
    fontSize: 13,
    color: '#b5a898',
  },

  // Presets tab
  presetsHeader: {
    marginBottom: 14,
  },

  presetsHint: {
    fontSize: 13,
    color: '#9a8870',
    lineHeight: 1.5,
  },

  presetCard: {
    background: '#fff',
    border: '1.5px solid #ede8df',
    borderRadius: 12,
    padding: '14px 14px 10px',
    marginBottom: 10,
  },

  presetCardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },

  presetCardName: {
    fontFamily: "'Fraunces', serif",
    fontSize: 16,
    fontWeight: 600,
    color: '#2c2416',
    marginBottom: 2,
  },

  presetCardCount: {
    fontSize: 12,
    color: '#9a8870',
  },

  presetCardActions: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    flexShrink: 0,
  },

  presetLoadBtn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    padding: '6px 12px',
    border: 'none',
    borderRadius: 8,
    background: '#e8783a',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },

  presetDeleteBtn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    padding: '6px 8px',
    border: '1.5px solid #fecaca',
    borderRadius: 8,
    background: '#fff',
    color: '#dc2626',
    cursor: 'pointer',
  },

  presetTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
  },

  tag: {
    fontSize: 11,
    fontWeight: 500,
    padding: '3px 8px',
    borderRadius: 20,
    background: '#f1ede6',
    color: '#7c6a52',
  },

  tagMore: {
    fontSize: 11,
    fontWeight: 500,
    padding: '3px 8px',
    borderRadius: 20,
    background: '#ede8df',
    color: '#9a8870',
  },

  // Modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(44,36,22,0.4)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  modal: {
    background: '#fff',
    borderRadius: 14,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    boxShadow: '0 20px 60px rgba(44,36,22,0.2)',
  },

  modalTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 14,
    color: '#2c2416',
  },

  modalInput: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    padding: '10px 14px',
    border: '2px solid #ede8df',
    borderRadius: 10,
    width: '100%',
    marginBottom: 14,
    color: '#2c2416',
    outline: 'none',
  },

  modalBtns: {
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
  },

  modalCancel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    padding: '8px 16px',
    border: '1.5px solid #ede8df',
    borderRadius: 8,
    background: '#fff',
    color: '#7c6a52',
    cursor: 'pointer',
  },

  modalSave: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    padding: '8px 16px',
    border: 'none',
    borderRadius: 8,
    background: '#e8783a',
    color: '#fff',
    cursor: 'pointer',
  },
};
