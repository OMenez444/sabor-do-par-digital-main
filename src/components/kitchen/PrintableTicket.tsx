import React from 'react';
import { Order } from '@/data/orders';

interface PrintableTicketProps {
    order: Order | null;
}

export const PrintableTicket = React.forwardRef<HTMLDivElement, PrintableTicketProps>(({ order }, ref) => {
    if (!order) return null;

    return (
        <div ref={ref} id="printable-ticket" className="hidden print:block p-0 m-0 w-full font-mono text-xs text-black bg-white">
            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-ticket, #printable-ticket * {
            visibility: visible;
          }
          #printable-ticket {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: auto;
            margin: 0mm;
          }
        }
      `}</style>

            <div className="text-center border-b border-black pb-2 mb-2">
                <h1 className="text-lg font-bold">SABOR DO PARÁ</h1>
                <p>{new Date().toLocaleString('pt-BR')}</p>
                <p className="font-bold text-lg mt-2">
                    {order.table_number ? `MESA ${order.table_number}` : 'DELIVERY / BALCÃO'}
                </p>
                {order.customer_name && <p>Cliente: {order.customer_name}</p>}
            </div>

            <div className="mb-4">
                {order.items.map((item, index) => (
                    <div key={index} className="mb-2">
                        <div className="flex justify-between font-bold">
                            <span>{item.quantity}x {item.product.name}</span>
                            <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                        {item.observation && (
                            <p className="text-[10px] ml-4 font-bold uppercase">** OBS: {item.observation}</p>
                        )}
                        {item.extras && item.extras.length > 0 && (
                            <ul className="ml-4 text-[10px] list-disc">
                                {item.extras.map((extra, i) => (
                                    <li key={i}>+ {extra}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            <div className="border-t border-black pt-2 flex justify-between font-bold text-lg">
                <span>TOTAL</span>
                <span>R$ {order.total.toFixed(2)}</span>
            </div>

            {order.payment_method && (
                <p className="mt-2 text-center">
                    Pagamento: {
                        {
                            "credit_card": "Crédito",
                            "debit_card": "Débito",
                            "cash": "Dinheiro",
                            "pix": "Pix"
                        }[order.payment_method] || order.payment_method
                    }
                </p>
            )}

            <div className="mt-8 text-center text-xs border-t border-dashed border-black pt-2">
                <p>*** FIM DO PEDIDO ***</p>
            </div>
        </div>
    );
});

PrintableTicket.displayName = 'PrintableTicket';
