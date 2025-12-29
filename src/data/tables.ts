export interface Table {
  id: string;
  number: string;
  qrUrl?: string; // url usada para gerar o QR (ex: /menu/sabor-do-para?mesa=12)
  qrDataUrl?: string; // data URL base64 do QR (opcional, pode ser gerada no front)
}

const TABLES_KEY = "sabor-do-para-tables";

export const getTables = (): Table[] => {
  const stored = localStorage.getItem(TABLES_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as Table[];
  } catch (e) {
    console.error("Failed to parse tables", e);
    return [];
  }
};

export const saveTables = (tables: Table[]) => {
  localStorage.setItem(TABLES_KEY, JSON.stringify(tables));
};

export const addTable = (number: string): Table => {
  const tables = getTables();
  const newTable: Table = { id: crypto.randomUUID(), number };
  saveTables([newTable, ...tables]);
  return newTable;
};

export const updateTable = (updatedTable: Table) => {
  const tables = getTables();
  const updated = tables.map((t) => (t.id === updatedTable.id ? updatedTable : t));
  saveTables(updated);
};

export const setTableQr = (id: string, qrUrl: string, qrDataUrl?: string) => {
  const tables = getTables();
  const updated = tables.map(t => t.id === id ? { ...t, qrUrl, qrDataUrl } : t);
  saveTables(updated);
};

export const getTableById = (id: string): Table | undefined => {
  return getTables().find(t => t.id === id);
};

export const removeTable = (id: string) => {
  const tables = getTables();
  const updated = tables.filter((t) => t.id !== id);
  saveTables(updated);
};

export const clearTables = () => {
  saveTables([]);
};
