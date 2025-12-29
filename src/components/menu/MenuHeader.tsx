import React from "react";
import logo from "@/assets/logo.png";
import { MapPin } from "lucide-react";

interface MenuHeaderProps {
  tableNumber: string | null;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ tableNumber }) => {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-brand-sm">
      <div className="container py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Lanchonete Sabor do Pará"
              className="h-12 w-12 object-contain drop-shadow-lg"
            />
            <h1 className="text-lg font-bold text-brand-brown">
              Sabor do Pará
            </h1>
          </div>
          {tableNumber && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground shadow-glow">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-bold">
                Mesa {tableNumber}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default MenuHeader;
