import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import OwnerDashboard from "./pages/OwnerDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import HireLabour from "./pages/HireLabour";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PostJob from "./pages/PostJob";
import ViewApplications from "./pages/ViewApplications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Owner Routes */}
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/post-job" element={<PostJob />} />
          <Route path="/owner/jobs" element={<OwnerDashboard />} />
          <Route path="/owner/jobs/:jobId/applications" element={<ViewApplications />} />
          
          {/* Worker Routes */}
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route path="/worker/jobs" element={<WorkerDashboard />} />
          <Route path="/worker/applications" element={<WorkerDashboard />} />
          
          {/* Other Routes */}
          <Route path="/hire-labour" element={<HireLabour />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
