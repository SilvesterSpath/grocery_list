import { useEffect, useRef } from 'react';
import { styles } from '../styles/groceryAppStyles.js';

export function ItemRow({
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
      <span style={styles.dragHandle} title='Húzd az átrendezéshez'>
        ⠿
      </span>

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

      {!isEditing && (
        <button
          style={styles.iconBtn}
          onClick={() => onStartEdit(item)}
          title='Név szerkesztése'
        >
          ✎
        </button>
      )}

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
