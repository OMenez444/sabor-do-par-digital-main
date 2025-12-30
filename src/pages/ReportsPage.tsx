import React, { useEffect, useState } from "react";
import { Order, getArchivedOrders } from "@/data/orders";
import { ArrowLeft, DollarSign, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { format, startOfDay, endOfDay, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const ReportsPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // YYYY-MM-DD


    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // If date selected, filter by that day. 
                // We construct start/end range from the selected string string YYYY-MM-DD
                let start: Date | undefined;
                let end: Date | undefined;

                if (selectedDate) {
                    const [year, month, day] = selectedDate.split('-').map(Number);
                    // Create date handling timezone offset issues by simple construction
                    const d = new Date(year, month - 1, day);
                    start = startOfDay(d);
                    end = endOfDay(d);
                }

                const data = await getArchivedOrders(start, end);
                setOrders(data);
            } catch (error) {
                console.error("Failed to load reports", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [selectedDate]);

    const totalSales = orders.reduce((acc, order) => acc + order.total, 0);

    // Group by date (simple version, assuming mostly today)
    // Or just list them all. User asked for "Finalizar Expediente" -> "Relatorios".

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-card border-b border-border p-4">
                <div className="container flex items-center gap-4">
                    <Link to="/admin/cozinha" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">Relatório de Fechamento</h1>
                        <p className="text-sm text-muted-foreground">
                            {selectedDate ? format(parseISO(selectedDate), "EEEE, d 'de' MMMM", { locale: ptBR }) : "Todos os pedidos"}
                        </p>
                    </div>
                </div>
                <div className="container mt-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="p-2 rounded-lg border border-border bg-background text-foreground"
                        />
                        <button
                            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                            className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 whitespace-nowrap"
                        >
                            Hoje
                        </button>
                    </div>
                </div>
            </header>

            <main className="container py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between shadow-brand-sm">
                        <div className="flex items-center gap-3 text-muted-foreground mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <span className="font-medium">Vendas Totais</span>
                        </div>
                        <div className="text-3xl font-bold ml-1">
                            R$ {totalSales.toFixed(2)}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between shadow-brand-sm">
                        <div className="flex items-center gap-3 text-muted-foreground mb-4">
                            <div className="p-2 rounded-lg bg-info/10 text-info">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <span className="font-medium">Total de Pedidos</span>
                        </div>
                        <div className="text-3xl font-bold ml-1">
                            {orders.length}
                        </div>
                    </div>
                </div>

                <h2 className="text-lg font-bold mb-4">Histórico de Pedidos</h2>

                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">Carregando...</div>
                    ) : orders.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            Nenhum pedido encontrado para {selectedDate ? format(parseISO(selectedDate), "dd/MM/yyyy") : "este período"}.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/50 border-b border-border">
                                    <tr>
                                        <th className="p-4 font-medium text-muted-foreground whitespace-nowrap">Hora</th>
                                        <th className="p-4 font-medium text-muted-foreground whitespace-nowrap">Cliente / Mesa</th>
                                        <th className="p-4 font-medium text-muted-foreground min-w-[200px]">Itens</th>
                                        <th className="p-4 font-medium text-muted-foreground whitespace-nowrap">Pagamento</th>
                                        <th className="p-4 font-medium text-muted-foreground text-right whitespace-nowrap">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {orders.map((order) => {
                                        const paymentLabel = {
                                            "credit_card": "Crédito",
                                            "debit_card": "Débito",
                                            "cash": "Dinheiro",
                                            "pix": "Pix"
                                        }[order.payment_method || ""] || order.payment_method || "-";

                                        return (
                                            <tr key={order.id} className="hover:bg-muted/20">
                                                <td className="p-4 whitespace-nowrap">
                                                    {order.created_at ? new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-foreground">
                                                        {order.table_number ? `Mesa ${order.table_number}` : (order.customer_name || "Delivery")}
                                                    </div>
                                                    {!order.table_number && order.customer_name && (
                                                        <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
                                                    )}
                                                </td>
                                                <td className="p-4 text-sm">
                                                    {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(", ")}
                                                </td>
                                                <td className="p-4 text-sm whitespace-nowrap">
                                                    {paymentLabel}
                                                </td>
                                                <td className="p-4 font-medium text-right whitespace-nowrap">
                                                    R$ {order.total.toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ReportsPage;
