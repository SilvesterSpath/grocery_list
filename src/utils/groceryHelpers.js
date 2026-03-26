export const STORAGE_KEY = 'grocery_app_v1';
export const THEME_KEY = 'grocery_app_theme_v1';

const KNOWN_TRANSLATIONS = {
  presetNames: {
    'Weekly Essentials': 'Heti',
    'Weekend essentials': 'Hétvégi',
    'Cleaning Supplies': 'Háztartási',
    Health: 'Egészség',
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
    Coconuts: 'Kókusz',
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

export function translateKnownItemsInList(items) {
  if (!Array.isArray(items) || items.length === 0) return items ?? [];
  let changed = false;
  const next = items.map((i) => {
    const translated = translateKnown(i.name);
    if (translated !== i.name) changed = true;
    return translated === i.name ? i : { ...i, name: translated };
  });
  return changed ? next : items;
}

export function translateKnownPresets(presets) {
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

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupted storage */
  }
  return null;
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore storage write failures */
  }
}

export function loadTheme() {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return raw === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore storage write failures */
  }
}

let idCounter = Date.now();
export function newId() {
  return `item_${idCounter++}`;
}

export function makeItem(name) {
  return { id: newId(), name, needed: true, bought: false };
}
