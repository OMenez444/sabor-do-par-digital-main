import React, { useEffect, useState } from "react";
import { Product, Category, categories, getProducts, addProduct, updateProduct, removeProduct, adminResetMenu } from "@/data/products";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const emptyForm = (catId?: string) => ({
  name: "",
  description: "",
  price: 0,
  category: catId || categories[0]?.id || "",
  available: true,
  image: undefined as string | undefined,
});

const MenuManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(() => emptyForm());

  const reload = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => { reload(); }, []);

  const onChangeFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((s) => ({ ...s, image: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = async () => {
    if (!form.name.trim()) return toast.error("Nome obrigatório");
    const res = await addProduct({ name: form.name, description: form.description, price: form.price, category: form.category, available: form.available, image: form.image });
    if (res) {
      setForm(emptyForm());
      reload();
      toast.success("Produto adicionado");
    }
  };

  const handleStartEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, available: p.available, image: p.image });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const res = await updateProduct(editingId, { name: form.name, description: form.description, price: form.price, category: form.category, available: form.available, image: form.image });
    if (res) {
      setEditingId(null);
      setForm(emptyForm());
      reload();
      toast.success("Produto atualizado");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir produto?")) return;
    await removeProduct(id);
    reload();
    toast.success("Produto removido");
  };

  const handleReset = async () => {
    if (!confirm("Isso apagará TODOS os produtos atuais e restaurará o cardápio padrão. Deseja continuar?")) return;
    await adminResetMenu();
    reload();
    toast.success("Cardápio restaurado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <div className="container flex items-center justify-between">
          <h1 className="text-xl font-bold">Gerenciar Cardápio</h1>
          <div className="flex items-center gap-4">
            <button onClick={handleReset} className="text-sm px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
              Restaurar Padrão
            </button>
            <a href="/admin/cozinha" className="text-sm text-muted-foreground">Voltar</a>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="rounded-2xl border border-border bg-card p-4 mb-6">
          <h2 className="font-bold mb-2">{editingId ? "Editar Produto" : "Novo Produto"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <input className="w-full px-4 py-3 rounded-xl border border-border" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <textarea className="w-full px-4 py-3 rounded-xl border border-border" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="flex gap-2">
                <input type="number" className="px-4 py-3 rounded-xl border border-border w-36" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                <select className="px-4 py-3 rounded-xl border border-border" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /> Disponível
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="rounded-xl border border-border p-3 flex items-center justify-center bg-muted/20 h-40">
                {form.image ? <img src={form.image} alt="preview" className="max-h-full max-w-full object-contain" /> : (
                  <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <ImageIcon />
                    <span className="text-sm">Sem imagem</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={(e) => onChangeFile(e.target.files?.[0])} />
              <div className="flex gap-2">
                {editingId ? (
                  <>
                    <button onClick={handleSaveEdit} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground">Salvar</button>
                    <button onClick={() => { setEditingId(null); setForm(emptyForm()); }} className="px-4 py-2 rounded-xl bg-muted">Cancelar</button>
                  </>
                ) : (
                  <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground">Adicionar Produto</button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.map(p => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-4 flex gap-3 items-start">
              <div className="w-20 h-20 rounded-lg bg-muted/10 flex items-center justify-center overflow-hidden">
                {p.image ? <img src={p.image} alt={p.name} className="object-contain h-full w-full" /> : <ImageIcon />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-muted-foreground">{p.category} • {p.available ? 'Disponível' : 'Indisponível'}</div>
                  </div>
                  <div className="font-bold">R$ {p.price.toFixed(2)}</div>
                </div>
                <p className="text-sm mt-2">{p.description}</p>

                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleStartEdit(p)} className="px-3 py-2 rounded-xl bg-primary/10 text-primary">Editar</button>
                  <button onClick={() => handleDelete(p.id)} className="px-3 py-2 rounded-xl text-destructive hover:bg-destructive/10">Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MenuManager;
