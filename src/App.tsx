import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import KitchenPage from "./pages/KitchenPage";
import TablesPage from "./pages/TablesPage";
import MenuManager from "./pages/MenuManager";
import NotFound from "./pages/NotFound";

import ReportsPage from "./pages/ReportsPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<KitchenPage />} />
          <Route path="/menu/:restaurante" element={<MenuPage />} />

          {/* Rotas Admin (Sem Autenticação) */}
          <Route path="/admin/cozinha" element={<KitchenPage />} />
          <Route path="/admin/mesas" element={<TablesPage />} />
          <Route path="/admin/cardapio" element={<MenuManager />} />
          <Route path="/admin/relatorios" element={<ReportsPage />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
