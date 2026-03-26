import { useRef } from 'react';
import { ItemRow } from './ItemRow.jsx';
import { SavePresetModal } from './SavePresetModal.jsx';
import { styles } from '../styles/groceryAppStyles.js';

export function GroceryListPanel({
  items,
  neededItems,
  haveItems,
  boughtCount,
  newItemName,
  onNewItemNameChange,
  onAddItem,
  showSavePreset,
  onOpenSavePreset,
  onCloseSavePreset,
  newPresetName,
  onNewPresetNameChange,
  onSaveAsPreset,
  onClearBought,
  onClearAll,
  editingId,
  editingName,
  setEditingName,
  onStartEdit,
  onCommitEdit,
  onEditKey,
  onToggleNeeded,
  onToggleBought,
  onDeleteItem,
  dragState,
  dragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const inputRef = useRef(null);

  const addItem = () => {
    onAddItem();
    inputRef.current?.focus();
  };

  return (
    <>
      <div style={styles.addRow}>
        <input
          ref={inputRef}
          style={styles.addInput}
          placeholder='Tétel hozzáadása…'
          value={newItemName}
          onChange={(e) => onNewItemNameChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button style={styles.addBtn} onClick={addItem}>
          +
        </button>
      </div>

      {items.length > 0 && (
        <div style={styles.actionsRow}>
          <button style={styles.ghostBtn} onClick={onOpenSavePreset}>
            💾 Mentés listaként
          </button>
          {boughtCount > 0 && (
            <button style={styles.ghostBtn} onClick={onClearBought}>
              🧹 Megvett törlése
            </button>
          )}
          <button
            style={{ ...styles.ghostBtn, ...styles.dangerBtn }}
            onClick={onClearAll}
          >
            🗑 Mind törlése
          </button>
        </div>
      )}

      {showSavePreset && (
        <SavePresetModal
          newPresetName={newPresetName}
          onNewPresetNameChange={onNewPresetNameChange}
          onSave={onSaveAsPreset}
          onClose={onCloseSavePreset}
        />
      )}

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
                  onStartEdit={onStartEdit}
                  onCommitEdit={onCommitEdit}
                  onEditKey={onEditKey}
                  onToggleNeeded={onToggleNeeded}
                  onToggleBought={onToggleBought}
                  onDelete={onDeleteItem}
                  isDragging={dragState === item.id}
                  isDragOver={dragOver === item.id}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
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
                  onStartEdit={onStartEdit}
                  onCommitEdit={onCommitEdit}
                  onEditKey={onEditKey}
                  onToggleNeeded={onToggleNeeded}
                  onToggleBought={onToggleBought}
                  onDelete={onDeleteItem}
                  isDragging={dragState === item.id}
                  isDragOver={dragOver === item.id}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
                />
              ))}
            </section>
          )}
        </>
      )}
    </>
  );
}
