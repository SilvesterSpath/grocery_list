import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'grocery_app_v1';
const THEME_KEY = 'grocery_app_theme_v1';

const KNOWN_TRANSLATIONS = {
  presetNames: {
    'Weekly Essentials': 'Heti alapok',
    'Fruits & Veggies': 'Gyümölcsök és zöldségek',
    'Baking Essentials': 'Sütési alapanyagok',
    'Cleaning Supplies': 'Takarítószerek',
  },
  items: {
    Milk: 'Tej',
    Eggs: 'Tojás',
    Bread: 'Kenyér',
    Butter: 'Vaj',
    Yogurt: 'Joghurt',
    Cheese: 'Sajt',
    'Chicken breast': 'Csirkemell',
    Pasta: 'Tészta',
    Rice: 'Rizs',
    'Olive oil': 'Olívaolaj',
    Apples: 'Alma',
    Bananas: 'Banán',
    Tomatoes: 'Paradicsom',
    Spinach: 'Spenót',
    Carrots: 'Répa',
    Onions: 'Hagyma',
    Garlic: 'Fokhagyma',
    Lemons: 'Citrom',
    Broccoli: 'Brokkoli',
    Avocados: 'Avokádó',
    Flour: 'Liszt',
    Sugar: 'Cukor',
    'Baking powder': 'Sütőpor',
    'Vanilla extract': 'Vaníliakivonat',
    'Cocoa powder': 'Kakaópor',
    Honey: 'Méz',
    Oats: 'Zabpehely',
    Almonds: 'Mandula',
    'Dish soap': 'Mosogatószer',
    'Laundry detergent': 'Mosószer',
    Sponges: 'Szivacs',
    'Trash bags': 'Szemeteszsák',
    'Paper towels': 'Papírtörlő',
    'Bleach spray': 'Fertőtlenítő spray',
  },
};

function translateKnown(text) {
  return KNOWN_TRANSLATIONS.items[text] ?? text;
}

function translateKnownPresetName(name) {
  return KNOWN_TRANSLATIONS.presetNames[name] ?? name;
}

function translateKnownItemsInList(items) {
  if (!Array.isArray(items) || items.length === 0) return items ?? [];
  let changed = false;
  const next = items.map((i) => {
    const translated = translateKnown(i.name);
    if (translated !== i.name) changed = true;
    return translated === i.name ? i : { ...i, name: translated };
  });
  return changed ? next : items;
}

function translateKnownPresets(presets) {
  if (!presets || typeof presets !== 'object') return presets ?? {};
  let changed = false;
  const entries = Object.entries(presets);
  const next = {};
  for (const [name, itemNames] of entries) {
    const translatedName = translateKnownPresetName(name);
    const translatedItems = Array.isArray(itemNames)
      ? itemNames.map(translateKnown)
      : itemNames;
    if (translatedName !== name) changed = true;
    if (
      Array.isArray(itemNames) &&
      translatedItems.some((v, idx) => v !== itemNames[idx])
    ) {
      changed = true;
    }
    next[translatedName] = translatedItems;
  }
  return changed ? next : presets;
}

const defaultLists = {
  'Heti alapok': [
    'Tej',
    'Tojás',
    'Kenyér',
    'Vaj',
    'Joghurt',
    'Sajt',
    'Csirkemell',
    'Tészta',
    'Rizs',
    'Olívaolaj',
  ],
  'Gyümölcsök és zöldségek': [
    'Alma',
    'Banán',
    'Paradicsom',
    'Spenót',
    'Répa',
    'Hagyma',
    'Fokhagyma',
    'Citrom',
    'Brokkoli',
    'Avokádó',
  ],
  'Sütési alapanyagok': [
    'Liszt',
    'Cukor',
    'Sütőpor',
    'Vaníliakivonat',
    'Kakaópor',
    'Méz',
    'Zabpehely',
    'Mandula',
  ],
  'Takarítószerek': [
    'Mosogatószer',
    'Mosószer',
    'Szivacs',
    'Szemeteszsák',
    'Papírtörlő',
    'Fertőtlenítő spray',
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

function loadTheme() {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return raw === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
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
  const [activeTab, setActiveTab] = useState('list'); // list | presets
  const inputRef = useRef(null);

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
            <span style={styles.logoText}>Kamra</span>
          </div>
          <div style={styles.headerStats}>
            <button
              type='button'
              style={styles.themeBtn}
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              aria-label={`Váltás ${theme === 'dark' ? 'világos' : 'sötét'} módra`}
              title={`Váltás ${theme === 'dark' ? 'világos' : 'sötét'} módra`}
            >
              {theme === 'dark' ? 'Világos' : 'Sötét'}
              <span aria-hidden='true' style={styles.themeIcon}>
                {theme === 'dark' ? '☀︎' : '☾'}
              </span>
            </button>
            {boughtCount > 0 && (
              <span style={styles.badge}>{boughtCount} a kosárban</span>
            )}
            <span style={styles.totalBadge}>{items.length} tétel</span>
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
            Listám
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'presets' ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab('presets')}
          >
            Mentett listák
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
                placeholder='Tétel hozzáadása…'
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
                  💾 Mentés listaként
                </button>
                {boughtCount > 0 && (
                  <button style={styles.ghostBtn} onClick={clearBought}>
                    🧹 Megvett törlése
                  </button>
                )}
                <button
                  style={{ ...styles.ghostBtn, ...styles.dangerBtn }}
                  onClick={clearAll}
                >
                  🗑 Mind törlése
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
                  <div style={styles.modalTitle}>Aktuális lista mentése</div>
                  <input
                    style={styles.modalInput}
                    autoFocus
                    placeholder='Lista neve…'
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
                      Mégse
                    </button>
                    <button style={styles.modalSave} onClick={saveAsPreset}>
                      Mentés
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
                  Megvenni
                </span>
                <span style={styles.legendItem}>
                  <span style={styles.legendDot({ color: '#94a3b8' })} />
                  Már megvan
                </span>
                <span style={styles.legendItem}>
                  <span style={{ ...styles.legendCheck }} />
                  Megvéve
                </span>
              </div>
            )}

            {/* Items */}
            {items.length === 0 ? (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>🥕</div>
                <div style={styles.emptyText}>A listád üres</div>
                <div style={styles.emptyHint}>
                  Adj hozzá tételeket fent, vagy tölts be egy mentett listát
                </div>
              </div>
            ) : (
              <>
                {neededItems.length > 0 && (
                  <section style={styles.section}>
                    <div style={styles.sectionLabel}>
                      <span style={styles.sectionDot({ color: '#22c55e' })} />
                      Megvenni ({neededItems.length})
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
                      Már megvan ({haveItems.length})
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
                Válassz egy mentett listát, és töltsd be a tételeit a jelenlegi listádba.
              </p>
            </div>
            {Object.keys(presets).length === 0 ? (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>📋</div>
                <div style={styles.emptyText}>Még nincs mentett lista</div>
                <div style={styles.emptyHint}>
                  Állíts össze egy listát, és mentsd el későbbre
                </div>
              </div>
            ) : (
              Object.entries(presets).map(([name, itemNames]) => (
                <div key={name} style={styles.presetCard}>
                  <div style={styles.presetCardTop}>
                    <div>
                      <div style={styles.presetCardName}>{name}</div>
                      <div style={styles.presetCardCount}>
                        {itemNames.length} tétel
                      </div>
                    </div>
                    <div style={styles.presetCardActions}>
                      <button
                        style={styles.presetLoadBtn}
                        onClick={() => addFromPreset(name)}
                      >
                        Betöltés a listába
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
      <span style={styles.dragHandle} title='Húzd az átrendezéshez'>
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
          title='Dupla kattintás a szerkesztéshez'
        >
          {item.name}
        </span>
      )}

      {/* Needed/Have toggle */}
      <label
        style={styles.toggleLabel}
        title={item.needed ? 'Megjelölés: már megvan' : 'Megjelölés: szükséges'}
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
          title='Név szerkesztése'
        >
          ✎
        </button>
      )}

      {/* Delete */}
      <button
        style={{ ...styles.iconBtn, ...styles.deleteBtn }}
        onClick={() => onDelete(item.id)}
        title='Törlés'
      >
        ✕
      </button>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,650;0,750;1,500&family=DM+Sans:wght@400;500;600&display=swap');
  :root{
    --bg: #fbf7f0;
    --surface: #ffffff;
    --surface-2: #f4efe6;
    --text: #241d12;
    --muted: #8c7a63;
    --muted-2: #b6a894;
    --border: #efe7dc;
    --shadow: 0 2px 14px rgba(36, 29, 18, 0.08);
    --shadow-strong: 0 20px 70px rgba(36, 29, 18, 0.22);
    --accent: #e8783a;
    --accent-2: #ffb68b;
    --success: #22c55e;
    --danger: #dc2626;
    --danger-border: #fecaca;
    --ring: rgba(232, 120, 58, 0.28);
  }

  :root[data-theme="dark"]{
    --bg: #0b0f14;
    --surface: #111827;
    --surface-2: #0f172a;
    --text: #e5e7eb;
    --muted: #b3b9c6;
    --muted-2: #7d8698;
    --border: #1f2937;
    --shadow: 0 12px 34px rgba(0, 0, 0, 0.55);
    --shadow-strong: 0 32px 90px rgba(0, 0, 0, 0.75);
    --accent: #ff7a2f;
    --accent-2: #ffd1b6;
    --success: #34d399;
    --danger: #f87171;
    --danger-border: rgba(248, 113, 113, 0.38);
    --ring: rgba(255, 122, 47, 0.35);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { background: var(--bg); color: var(--text); }
  ::selection{ background: var(--ring); }
  a, button, input { color: inherit; }
  button{ -webkit-tap-highlight-color: transparent; }
  input::placeholder{ color: color-mix(in srgb, var(--muted) 70%, transparent); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--muted) 40%, transparent); border-radius: 4px; }

  .item-row-enter { opacity: 0; transform: translateY(-6px); }
  .item-row-enter-active { opacity: 1; transform: none; transition: all 0.2s; }
`;

const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: '100vh',
    background: 'var(--bg)',
    color: 'var(--text)',
    maxWidth: 620,
    margin: '0 auto',
    paddingBottom: 60,
  },

  header: {
    background: 'color-mix(in srgb, var(--surface) 92%, transparent)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: 'var(--shadow)',
    backdropFilter: 'saturate(130%) blur(10px)',
  },

  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px 10px',
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
    fontWeight: 750,
    color: 'var(--text)',
    letterSpacing: '-0.5px',
  },

  headerStats: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },

  themeBtn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid var(--border)',
    background: 'color-mix(in srgb, var(--surface) 75%, var(--surface-2))',
    boxShadow: '0 1px 0 color-mix(in srgb, var(--text) 8%, transparent)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'transform 0.08s, background 0.15s, border-color 0.15s',
  },

  themeIcon: {
    fontSize: 13,
    opacity: 0.9,
  },

  badge: {
    background: 'color-mix(in srgb, var(--success) 20%, var(--surface))',
    color: 'color-mix(in srgb, var(--success) 72%, var(--text))',
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 20,
    border: '1px solid color-mix(in srgb, var(--success) 35%, var(--border))',
  },

  totalBadge: {
    background: 'var(--surface-2)',
    color: 'var(--muted)',
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 20,
  },

  tabs: {
    display: 'flex',
    padding: '0 14px',
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
    color: 'var(--muted)',
    borderBottom: '2px solid transparent',
    transition: 'all 0.15s',
    marginBottom: -2,
  },

  tabActive: {
    color: 'var(--text)',
    borderBottomColor: 'var(--accent)',
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
    border: '1px solid var(--border)',
    borderRadius: 10,
    background: 'var(--surface)',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },

  addBtn: {
    width: 44,
    height: 44,
    background: 'var(--accent)',
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
    border: '1px solid var(--border)',
    borderRadius: 8,
    background: 'var(--surface)',
    color: 'var(--muted)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  dangerBtn: {
    color: 'var(--danger)',
    borderColor: 'var(--danger-border)',
  },

  legend: {
    display: 'flex',
    gap: 14,
    marginBottom: 12,
    fontSize: 11,
    color: 'var(--muted)',
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
    color: 'var(--muted)',
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
    background: 'var(--surface)',
    border: '1px solid var(--border)',
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
    borderColor: 'var(--accent)',
    boxShadow: '0 0 0 3px var(--ring)',
  },

  itemBought: {
    background: 'color-mix(in srgb, var(--surface) 75%, var(--surface-2))',
    borderColor: 'var(--border)',
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
    border: '1px solid color-mix(in srgb, var(--muted) 45%, var(--border))',
    borderRadius: 5,
    background: 'var(--surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
    flexShrink: 0,
  },

  customCheckChecked: {
    background: 'var(--success)',
    borderColor: 'var(--success)',
  },

  checkMark: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    lineHeight: 1,
  },

  itemName: {
    flex: 1,
    fontSize: 21,
    fontWeight: 500,
    color: 'var(--text)',
    cursor: 'pointer',
    wordBreak: 'break-word',
    lineHeight: 1.3,
  },

  itemNameBought: {
    textDecoration: 'line-through',
    color: 'color-mix(in srgb, var(--muted) 65%, var(--text))',
  },

  itemNameHave: {
    color: 'var(--muted)',
  },

  editInput: {
    flex: 1,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 500,
    padding: '2px 6px',
    border: '1px solid var(--accent)',
    borderRadius: 6,
    background: 'var(--surface)',
    color: 'var(--text)',
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
    background: 'color-mix(in srgb, var(--muted) 35%, var(--border))',
    justifyContent: 'flex-start',
  },

  toggleKnob: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: 'var(--surface)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.22)',
    transition: 'all 0.2s',
    flexShrink: 0,
  },

  toggleKnobOn: {},

  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'color-mix(in srgb, var(--muted) 65%, var(--text))',
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
    color: 'var(--muted)',
    marginBottom: 6,
  },

  emptyHint: {
    fontSize: 13,
    color: 'var(--muted-2)',
  },

  // Presets tab
  presetsHeader: {
    marginBottom: 14,
  },

  presetsHint: {
    fontSize: 13,
    color: 'var(--muted)',
    lineHeight: 1.5,
  },

  presetCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
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
    color: 'var(--text)',
    marginBottom: 2,
  },

  presetCardCount: {
    fontSize: 12,
    color: 'var(--muted)',
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
    background: 'var(--accent)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },

  presetDeleteBtn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    padding: '6px 8px',
    border: '1px solid var(--danger-border)',
    borderRadius: 8,
    background: 'var(--surface)',
    color: 'var(--danger)',
    cursor: 'pointer',
  },

  presetTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
  },

  tag: {
    fontSize: 17,
    fontWeight: 500,
    padding: '3px 8px',
    borderRadius: 20,
    background: 'var(--surface-2)',
    color: 'var(--muted)',
  },

  tagMore: {
    fontSize: 17,
    fontWeight: 500,
    padding: '3px 8px',
    borderRadius: 20,
    background: 'color-mix(in srgb, var(--surface-2) 70%, var(--border))',
    color: 'var(--muted)',
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
    background: 'var(--surface)',
    borderRadius: 14,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    boxShadow: 'var(--shadow-strong)',
  },

  modalTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 14,
    color: 'var(--text)',
  },

  modalInput: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    padding: '10px 14px',
    border: '1px solid var(--border)',
    borderRadius: 10,
    width: '100%',
    marginBottom: 14,
    color: 'var(--text)',
    outline: 'none',
    background: 'var(--surface)',
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
    border: '1px solid var(--border)',
    borderRadius: 8,
    background: 'var(--surface)',
    color: 'var(--muted)',
    cursor: 'pointer',
  },

  modalSave: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    padding: '8px 16px',
    border: 'none',
    borderRadius: 8,
    background: 'var(--accent)',
    color: '#fff',
    cursor: 'pointer',
  },
};
