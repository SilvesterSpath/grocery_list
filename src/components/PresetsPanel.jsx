import { styles } from '../styles/groceryAppStyles.js';

export function PresetsPanel({ presets, onAddFromPreset, onDeletePreset }) {
  return (
    <div>
      <div style={styles.presetsHeader}>
        <p style={styles.presetsHint}>
          Válassz egy mentett listát, és töltsd be a tételeit a jelenlegi
          listádba.
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
                  onClick={() => onAddFromPreset(name)}
                >
                  Betöltés a listába
                </button>
                <button
                  style={styles.presetDeleteBtn}
                  onClick={() => onDeletePreset(name)}
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
  );
}
