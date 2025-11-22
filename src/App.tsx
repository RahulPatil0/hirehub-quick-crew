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
import AdminAnalytics from "./pages/AdminAnalytics";
import PendingVerifications from "./pages/PendingVerifications";
import WorkerProfile from "./pages/WorkerProfile";
import OwnerProfile from "./pages/OwnerProfile";
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
          
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/profile" element={<OwnerProfile />} />
          <Route path="/owner/post-job" element={<PostJob />} />
          <Route path="/owner/jobs/:jobId/applications" element={<ViewApplications />} />
          
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/worker/profile" element={<WorkerProfile />} />
          <Route path="/hire-labour" element={<HireLabour />} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/pending-verifications" element={<PendingVerifications />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
