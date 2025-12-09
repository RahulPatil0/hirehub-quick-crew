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
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Owner Protected Routes */}
          <Route path="/owner-dashboard" element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/owner/profile" element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerProfile />
            </ProtectedRoute>
          } />
          <Route path="/owner/post-job" element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <PostJob />
            </ProtectedRoute>
          } />
          <Route path="/owner/jobs/:jobId/applications" element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <ViewApplications />
            </ProtectedRoute>
          } />
          <Route path="/hire-labour" element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <HireLabour />
            </ProtectedRoute>
          } />
          
          {/* Worker Protected Routes */}
          <Route path="/worker-dashboard" element={
            <ProtectedRoute allowedRoles={["WORKER"]}>
              <WorkerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/worker/profile" element={
            <ProtectedRoute allowedRoles={["WORKER"]}>
              <WorkerProfile />
            </ProtectedRoute>
          } />
          
          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/admin/pending-verifications" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <PendingVerifications />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
