import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EntryScreen from "./pages/EntryScreen";
import CustomerOnboarding from "./pages/CustomerOnboarding";
import IntentSelection from "./pages/IntentSelection";
import NearbyInstitutions from "./pages/NearbyInstitutions";
import CertaintySelection from "./pages/CertaintySelection";
import InstitutionDashboard from "./pages/InstitutionDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EntryScreen />} />
          <Route path="/customer" element={<CustomerOnboarding />} />
          <Route path="/customer/intent" element={<IntentSelection />} />
          <Route path="/customer/nearby" element={<NearbyInstitutions />} />
          <Route path="/customer/certainty" element={<CertaintySelection />} />
          <Route path="/institution" element={<InstitutionDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
