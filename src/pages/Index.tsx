import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Utensils, ChefHat, QrCode, ArrowRight } from "lucide-react";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center max-w-md mx-auto animate-fade-in">
          {/* Logo */}
          <div className="mb-6">
            <img
              src={logo}
              alt="Lanchonete Sabor do Pará"
              className="w-32 h-32 mx-auto drop-shadow-lg"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            Lanchonete{" "}
            <span className="text-primary">Sabor do Pará</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Sistema de Comandas Digitais
          </p>

          {/* Action Cards */}
          <div className="space-y-4">
            {/* Menu Link */}
            <Link
              to="/menu/sabor-do-para?mesa=1"
              className="flex items-center gap-4 w-full p-5 rounded-2xl bg-card border border-border shadow-brand-sm hover:shadow-brand hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary">
                <QrCode className="w-7 h-7" />
              </div>
              <div className="flex-1 text-left">
                <h2 className="font-bold text-foreground text-lg">
                  Menu Digital
                </h2>
                <p className="text-sm text-muted-foreground">
                  Área do cliente via QR Code
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Kitchen Link */}
            <Link
              to="/admin/cozinha"
              className="flex items-center gap-4 w-full p-5 rounded-2xl bg-card border border-border shadow-brand-sm hover:shadow-brand hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-accent text-accent-foreground">
                <ChefHat className="w-7 h-7" />
              </div>
              <div className="flex-1 text-left">
                <h2 className="font-bold text-foreground text-lg">
                  Painel da Cozinha
                </h2>
                <p className="text-sm text-muted-foreground">
                  Gestão de pedidos (KDS)
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Info */}
          <div className="mt-10 p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <Utensils className="w-4 h-4" />
              <span>Teste o menu com</span>
              <code className="px-2 py-0.5 rounded bg-background text-foreground font-mono text-xs">
                ?mesa=12
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-sm text-muted-foreground">
          © 2024 Lanchonete Sabor do Pará
        </p>
      </footer>
    </div>
  );
};

export default Index;
