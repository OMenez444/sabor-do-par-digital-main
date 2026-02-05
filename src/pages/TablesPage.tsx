import React, { useEffect, useState } from "react";
import { getTables, addTable, removeTable, setTableQr, Table } from "@/data/tables";
import { getOrders, deleteOrdersForTable, closeOrdersForTable } from "@/data/orders";
import * as QRCode from "qrcode";
import { Plus, Trash2, X, QrCode, Bike, Copy, ExternalLink, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TablesPage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<any[]>([]); // Using any[] temporarily or import Order type
  const [newNumber, setNewNumber] = useState("");
  const [deliveryQrDataUrl, setDeliveryQrDataUrl] = useState<string | null>(null);

  // Força URL de produção para QR Codes impressos (Domínio Personalizado)
  const PRODUCTION_URL = "https://www.sabordopara.shop";



  const deliveryUrl = PRODUCTION_URL + "/menu/sabor-do-para";

  const loadData = async () => {
    setTables(getTables());
    const ordersData = await getOrders();
    setOrders(ordersData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const reload = () => loadData();

  const handleAdd = () => {
    if (!newNumber.trim()) return;
    addTable(newNumber.trim());
    setNewNumber("");
    reload();
    toast.success("Mesa adicionada");
  };

  const handleCopyDeliveryLink = async () => {
    try {
      await navigator.clipboard.writeText(deliveryUrl);
      toast.success("Link Delivery copiado!", { description: deliveryUrl });
    } catch (e) {
      toast.error("Erro ao copiar link");
    }
  };

  const handleGenerateDeliveryQr = async () => {
    try {
      const toDataURL = (QRCode as unknown as { toDataURL: (text: string, options?: Record<string, unknown>) => Promise<string> }).toDataURL;
      const dataUrl = await toDataURL(deliveryUrl, { margin: 4, width: 800, errorCorrectionLevel: 'H' });
      setDeliveryQrDataUrl(dataUrl);
      toast.success("QR Code Delivery gerado");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao gerar QR");
    }
  };

  const handleDownloadDeliveryQr = () => {
    if (!deliveryQrDataUrl) return;
    const a = document.createElement("a");
    a.href = deliveryQrDataUrl;
    a.download = "delivery-qr.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDelete = async (tableId: string, tableNumber: string) => {
    if (!confirm(`Excluir mesa ${tableNumber}? Isto removerá a mesa e todos os pedidos dessa mesa.`)) return;
    await deleteOrdersForTable(tableNumber);
    removeTable(tableId);
    reload();
    toast.success("Mesa excluída");
  };

  const handleOpenComanda = (tableNumber: string) => {
    // cria uma comanda vazia
    // addOrder([], 0, tableNumber); // mantém compatibilidade com o comportamento anterior
    toast.success("Comanda aberta", { description: `Mesa ${tableNumber}` });
  };

  const handleCloseComanda = async (tableNumber: string) => {
    if (!confirm(`Fechar comanda da mesa ${tableNumber}?`)) return;
    await closeOrdersForTable(tableNumber, "delivered");
    reload();
    toast.success("Comanda fechada", { description: `Mesa ${tableNumber}` });
  };

  const handleOpenLink = (t: Table) => {
    if (!t.qrUrl) return toast.error("Nenhum link gerado");
    window.open(t.qrUrl, "_blank");
  };

  const handleCopyLink = async (t: Table) => {
    if (!t.qrUrl) return toast.error("Nenhum link gerado");
    try {
      await navigator.clipboard.writeText(t.qrUrl);
      toast.success("Link copiado para a área de transferência");
    } catch (e) {
      console.error(e);
      toast.error("Falha ao copiar o link");
    }
  };

  const handleDownloadQr = (t: Table) => {
    if (!t.qrDataUrl) return toast.error("Nenhum QR gerado");
    const a = document.createElement("a");
    a.href = t.qrDataUrl;
    a.download = `mesa-${t.number}-qr.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("Download iniciado");
  };

  // tenta detectar o IP local via WebRTC (retorna IP IPv4 ou null)
  const detectLocalIp = async (timeout = 3000): Promise<string | null> => {
    return new Promise((resolve) => {
      try {
        const pc = new RTCPeerConnection({ iceServers: [] });
        let resolved = false;
        // criar canal de dados para forçar coleta de ICE candidates
        pc.createDataChannel("");
        pc.onicecandidate = (ev) => {
          const cand = ev?.candidate?.candidate;
          if (!cand) return;
          const ipMatch = /([0-9]{1,3}(?:\.[0-9]{1,3}){3})/.exec(cand);
          if (ipMatch) {
            const ip = ipMatch[1];
            // ignorar localhost e link-local
            if (ip && ip !== "127.0.0.1" && !ip.startsWith("169.254.")) {
              if (!resolved) {
                resolved = true;
                try { pc.close(); } catch (e) { /* ignore */ }
                resolve(ip);
              }
            }
          }
        };
        pc.createOffer()
          .then((offer) => pc.setLocalDescription(offer))
          .catch(() => { if (!resolved) { resolved = true; try { pc.close(); } catch (e) { /* ignore */ }; resolve(null); } });
        setTimeout(() => {
          if (!resolved) { resolved = true; try { pc.close(); } catch (e) { /* ignore */ }; resolve(null); }
        }, timeout);
      } catch (e) {
        return resolve(null);
      }
    });
  };



  const handleGenerateQr = async (t: Table) => {
    // Usar sempre a URL de produção para garantir que o QR Code seja permanente e imprimível
    const url = `${PRODUCTION_URL}/menu/sabor-do-para?mesa=${t.number}`;

    try {
      const toDataURL = (QRCode as unknown as { toDataURL: (text: string, options?: Record<string, unknown>) => Promise<string> }).toDataURL;
      const dataUrl = await toDataURL(url, { margin: 4, width: 800, errorCorrectionLevel: 'H' });
      setTableQr(t.id, url, dataUrl);
      reload();
      toast.success("QR Code Permanente Gerado", { description: 'Vinculado ao site oficial (Vercel)' });
    } catch (e) {
      console.error(e);
      toast.error("Falha ao gerar QR");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <div className="container flex items-center justify-between">
          <h1 className="text-xl font-bold">Gerenciar Mesas</h1>
          <a href="/" className="text-sm text-muted-foreground">Voltar</a>
        </div>
      </header>

      <main className="container py-6">
        <div className="mb-4 flex gap-2">
          <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} placeholder="Número da mesa" className="flex-1 px-4 py-3 rounded-xl border border-border bg-background" />
          <button onClick={handleAdd} className="px-4 py-3 rounded-xl bg-primary text-primary-foreground">
            <Plus className="w-4 h-4" />
          </button>


        </div>

        {/* DELIVERY / PEDIDOS ONLINE CARD */}
        <div className="mb-8 rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Delivery & Pedidos Online</h2>
                  <p className="text-muted-foreground">Link único para clientes fazerem pedidos sem estar em uma mesa (Entrega/Retirada).</p>
                </div>
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-xl mb-4 font-mono text-sm break-all">
                {deliveryUrl}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopyDeliveryLink}
                  className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Copy className="w-4 h-4" /> Copiar Link
                </button>
                <button
                  onClick={handleGenerateDeliveryQr}
                  className="px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" /> Mostrar QR Code
                </button>
                <a
                  href={deliveryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Testar Link
                </a>
              </div>
            </div>

            {/* QR CODE PREVIEW */}
            {deliveryQrDataUrl && (
              <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-border/50">
                <img src={deliveryQrDataUrl} alt="Delivery QR Code" className="w-48 h-48" />
                <button
                  onClick={handleDownloadDeliveryQr}
                  className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  <Download className="w-4 h-4" /> Baixar Imagem
                </button>
              </div>
            )}
          </div>
        </div>

        <h2 className="text-lg font-bold mb-4">Mesas do Restaurante</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tables.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma mesa cadastrada</p>
          ) : (
            tables.map((t) => {
              const tableOrders = orders.filter(o => o.table_number === t.number);
              return (
                <div key={t.id} className="rounded-2xl border border-border bg-card p-4 flex gap-4 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-lg">{t.number}</div>
                      <div>
                        <div className="font-semibold">Mesa {t.number}</div>
                        <div className="text-sm text-muted-foreground">{tableOrders.length} pedido(s)</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => handleGenerateQr(t)} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground flex items-center gap-2">
                        <QrCode className="w-4 h-4" /> Gerar QR
                      </button>

                      <button onClick={() => handleOpenLink(t)} className="px-3 py-2 rounded-lg bg-primary/20 text-primary flex items-center gap-2">
                        Abrir
                      </button>

                      <button onClick={() => handleCopyLink(t)} className="px-3 py-2 rounded-lg bg-primary/10 text-primary flex items-center gap-2">
                        Copiar link
                      </button>

                      <button onClick={() => handleDownloadQr(t)} className="px-3 py-2 rounded-lg bg-muted/10 text-muted-foreground flex items-center gap-2">
                        Baixar QR
                      </button>

                      <button onClick={() => handleCloseComanda(t.number)} className="px-3 py-2 rounded-lg bg-success text-success-foreground">Fechar</button>

                      <button onClick={() => handleDelete(t.id, t.number)} className="p-2 rounded-lg text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="w-[220px]">
                    {t.qrDataUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        <a href={t.qrDataUrl} target="_blank" rel="noopener noreferrer" className="block">
                          <img src={t.qrDataUrl} alt={`QR Mesa ${t.number}`} className="w-56 h-56 bg-white p-2" />
                        </a>
                        <a href={t.qrUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground break-all">{t.qrUrl}</a>
                        {t.qrUrl && (t.qrUrl.includes("localhost") || t.qrUrl.includes("127.0.0.1")) && (
                          <div className="text-xs text-amber-600">Atenção: o link contém "localhost" e não será acessível por outros aparelhos. Regenerar com o IP local para escanear via celular.</div>
                        )}
                        {t.qrUrl && (t.qrUrl.includes("localhost") || t.qrUrl.includes("127.0.0.1")) && (
                          <button onClick={() => handleGenerateQr(t)} className="mt-1 text-sm text-primary">Regenerar com IP</button>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Nenhum QR gerado</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default TablesPage;
