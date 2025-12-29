import React, { useEffect, useState } from "react";
import { getTables, addTable, removeTable, Table } from "@/data/tables";
import { getOrders, addOrder, closeOrdersForTable, deleteOrdersForTable } from "@/data/orders";
import { X, Plus, Trash2, CheckSquare, Archive } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TablesManager: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [newNumber, setNewNumber] = useState("");

  useEffect(() => {
    setTables(getTables());
  }, [isOpen]);

  const reload = () => setTables(getTables());

  const handleAdd = () => {
    if (!newNumber.trim()) return;
    addTable(newNumber.trim());
    setNewNumber("");
    reload();
    toast.success("Mesa adicionada");
  };

  const handleDelete = (tableId: string, tableNumber: string) => {
    if (!confirm(`Excluir mesa ${tableNumber}? Isto removerá a mesa e todos os pedidos dessa mesa.`)) return;
    // remove orders as well
    deleteOrdersForTable(tableNumber);
    removeTable(tableId);
    reload();
    toast.success("Mesa excluída");
  };

  const handleOpenComanda = (tableNumber: string) => {
    addOrder([], 0, tableNumber);
    toast.success("Comanda aberta", { description: `Mesa ${tableNumber}` });
  };

  const handleCloseComanda = (tableNumber: string) => {
    if (!confirm(`Fechar comanda da mesa ${tableNumber}?`)) return;
    closeOrdersForTable(tableNumber, "delivered");
    toast.success("Comanda fechada", { description: `Mesa ${tableNumber}` });
  };

  const orders = getOrders();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-foreground/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[85vh] rounded-t-3xl bg-card shadow-brand-lg transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">Gerenciar Mesas</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <input
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              placeholder="Número da mesa"
              className="flex-1 px-4 py-3 rounded-xl border border-border bg-background"
            />
            <button onClick={handleAdd} className="px-4 py-3 rounded-xl bg-primary text-primary-foreground">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {tables.length === 0 ? (
              <p className="text-muted-foreground text-center">Nenhuma mesa cadastrada</p>
            ) : (
              tables.map((t) => {
                const tableOrders = orders.filter((o) => o.table === t.number);
                return (
                  <div key={t.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold">{t.number}</div>
                        <div>
                          <div className="font-semibold">Mesa {t.number}</div>
                          <div className="text-sm text-muted-foreground">{tableOrders.length} pedido(s)</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => handleOpenComanda(t.number)} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground">
                        Abrir
                      </button>
                      <button onClick={() => handleCloseComanda(t.number)} className="px-3 py-2 rounded-lg bg-success text-success-foreground">
                        Fechar
                      </button>
                      <button onClick={() => handleDelete(t.id, t.number)} className="p-2 rounded-lg text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TablesManager;
