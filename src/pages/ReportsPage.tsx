import React, { useEffect, useState } from "react";
import { Order, getArchivedOrders } from "@/data/orders";
import { ArrowLeft, DollarSign, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const ReportsPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await getArchivedOrders();
            setOrders(data);
            setLoading(false);
        };
        load();
    }, []);

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
                    <h1 className="text-xl font-bold">Relatório de Fechamento</h1>
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
                        <div className="p-8 text-center text-muted-foreground">Nenhum pedido arquivado.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="p-4 font-medium text-muted-foreground">Hora</th>
                                    <th className="p-4 font-medium text-muted-foreground">Mesa</th>
                                    <th className="p-4 font-medium text-muted-foreground">Itens</th>
                                    <th className="p-4 font-medium text-muted-foreground text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-muted/20">
                                        <td className="p-4">
                                            {order.created_at ? new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td className="p-4">
                                            {order.table_number || "Balcão"}
                                        </td>
                                        <td className="p-4 text-sm max-w-[200px] truncate" title={order.items.map(i => `${i.quantity}x ${i.product.name}`).join(", ")}>
                                            {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(", ")}
                                        </td>
                                        <td className="p-4 font-medium text-right">
                                            R$ {order.total.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ReportsPage;
