import { styles } from '../styles/groceryAppStyles.js';

export function SavePresetModal({
  newPresetName,
  onNewPresetNameChange,
  onSave,
  onClose,
}) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalTitle}>Aktuális lista mentése</div>
        <input
          style={styles.modalInput}
          autoFocus
          placeholder='Lista neve…'
          value={newPresetName}
          onChange={(e) => onNewPresetNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onClose();
          }}
        />
        <div style={styles.modalBtns}>
          <button style={styles.modalCancel} onClick={onClose}>
            Mégse
          </button>
          <button style={styles.modalSave} onClick={onSave}>
            Mentés
          </button>
        </div>
      </div>
    </div>
  );
}
