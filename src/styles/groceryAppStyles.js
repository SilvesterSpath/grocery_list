export const globalCSS = `
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

export const styles = {
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
