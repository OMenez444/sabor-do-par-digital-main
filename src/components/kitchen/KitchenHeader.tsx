import React from "react";
import logo from "@/assets/logo.png";
import { ChefHat, RefreshCw, CheckSquare } from "lucide-react";

interface KitchenHeaderProps {
  onRefresh: () => void;
  onManageTables?: () => void;
}

const KitchenHeader: React.FC<KitchenHeaderProps> = ({ onRefresh, onManageTables }) => {
  const currentTime = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return (
    <header className="bg-card border-b border-border shadow-brand-sm">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Lanchonete Sabor do Pará"
              className="h-12 w-12 object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold text-foreground">
                  Painel da Cozinha
                </h1>
              </div>
              <p className="text-sm text-muted-foreground capitalize">
                {currentTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => (onManageTables ? onManageTables() : window.open('/admin/mesas','_blank'))}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Gerenciar Mesas</span>
            </button>

            <button
              onClick={() => window.open('/admin/cardapio','_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="hidden sm:inline">Gerenciar Cardápio</span>
            </button>

            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default KitchenHeader;
