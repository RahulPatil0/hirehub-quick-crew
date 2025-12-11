import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, Users, Briefcase, UserCheck, Eye, Loader2, BarChart3, FileCheck } from "lucide-react";
import PageHeader from "@/components/PageHeader";

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  status?: string;
}

interface Stats {
  totalWorkers: number;
  totalOwners: number;
  totalJobs: number;
}

interface Job {
  id: string;
  skillType: string;
  requiredWorkers: number;
  budgetPerWorker: number;
  status: string;
  date?: string;
  duration?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [owners, setOwners] = useState<User[]>([]);
  const [workers, setWorkers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({ totalWorkers: 0, totalOwners: 0, totalJobs: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState<User | null>(null);
  const [ownerJobs, setOwnerJobs] = useState<Job[]>([]);
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/admin/login");
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setIsLoading(true);
      
      const ownersRes = await fetch("http://localhost:8080/api/admin/owners", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (ownersRes.ok) {
        const ownersData = await ownersRes.json();
        setOwners(ownersData);
      }

      const workersRes = await fetch("http://localhost:8080/api/admin/workers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (workersRes.ok) {
        const workersData = await workersRes.json();
        setWorkers(workersData);
      }

      setStats({
        totalWorkers: workers.length,
        totalOwners: owners.length,
        totalJobs: 0,
      });
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate = async (type: "workers" | "owners", id: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/admin/${type}/${id}/activate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("User activated successfully");
        fetchDashboardData();
      } else {
        throw new Error("Activation failed");
      }
    } catch (error) {
      toast.error("Failed to activate user");
    }
  };

  const handleDeactivate = async (type: "workers" | "owners", id: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/admin/${type}/${id}/deactivate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("User deactivated successfully");
        fetchDashboardData();
      } else {
        throw new Error("Deactivation failed");
      }
    } catch (error) {
      toast.error("Failed to deactivate user");
    }
  };

  const handleDelete = async (type: "workers" | "owners", id: string) => {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/admin/${type}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("User deleted successfully");
        fetchDashboardData();
      } else {
        throw new Error("Deletion failed");
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleViewJobs = async (owner: User) => {
    const token = localStorage.getItem("token");
    setSelectedOwner(owner);
    setIsLoadingJobs(true);
    setIsJobsModalOpen(true);
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/owners/${owner.id}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setOwnerJobs(data);
      } else {
        toast.error("Failed to load jobs");
        setOwnerJobs([]);
      }
    } catch (error) {
      toast.error("Error fetching jobs");
      setOwnerJobs([]);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <PageHeader title="Admin Dashboard" showLogout />

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">HireHub Management Panel</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft animate-fade-in hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{workers.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft animate-fade-in hover:shadow-medium transition-shadow" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Owners</CardTitle>
              <div className="p-2 rounded-lg bg-secondary/10">
                <UserCheck className="h-4 w-4 text-secondary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{owners.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft animate-fade-in hover:shadow-medium transition-shadow" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <div className="p-2 rounded-lg bg-success/10">
                <Briefcase className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalJobs}</div>
            </CardContent>
          </Card>

          <Card 
            className="shadow-soft cursor-pointer hover:shadow-medium transition-all border-2 border-primary/20 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
            onClick={() => navigate("/admin/pending-verifications")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <div className="p-2 rounded-lg bg-destructive/10">
                <FileCheck className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">View</div>
              <p className="text-xs text-muted-foreground mt-1">Review documents →</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/pending-verifications")}
                className="gap-2"
              >
                <FileCheck className="h-4 w-4" />
                Pending Verifications
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/analytics")}
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Owners Section */}
        <Card className="shadow-soft mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-secondary/10">
                <UserCheck className="h-5 w-5 text-secondary-foreground" />
              </div>
              Owners
            </CardTitle>
            <CardDescription>Manage all registered owners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Jobs</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {owners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No owners found
                      </TableCell>
                    </TableRow>
                  ) : (
                    owners.map((owner) => (
                      <TableRow key={owner.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{owner.username}</TableCell>
                        <TableCell>{owner.email}</TableCell>
                        <TableCell>{owner.phone}</TableCell>
                        <TableCell>
                          <Badge variant={owner.status === "ACTIVE" ? "default" : "secondary"}>
                            {owner.status || "ACTIVE"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleViewJobs(owner)} className="gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleActivate("owners", owner.id)}>
                              Activate
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeactivate("owners", owner.id)}>
                              Deactivate
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete("owners", owner.id)}>
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Workers Section */}
        <Card className="shadow-soft animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              Workers
            </CardTitle>
            <CardDescription>Manage all registered workers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No workers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    workers.map((worker) => (
                      <TableRow key={worker.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{worker.username}</TableCell>
                        <TableCell>{worker.email}</TableCell>
                        <TableCell>{worker.phone}</TableCell>
                        <TableCell>
                          <Badge variant={worker.status === "ACTIVE" ? "default" : "secondary"}>
                            {worker.status || "ACTIVE"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleActivate("workers", worker.id)}>
                              Activate
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeactivate("workers", worker.id)}>
                              Deactivate
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete("workers", worker.id)}>
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Jobs Modal */}
        <Dialog open={isJobsModalOpen} onOpenChange={setIsJobsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Jobs Posted by {selectedOwner?.username}
              </DialogTitle>
              <DialogDescription>
                View all job postings created by this owner
              </DialogDescription>
            </DialogHeader>

            {isLoadingJobs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : ownerJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No jobs posted by this owner yet.</p>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {ownerJobs.map((job) => (
                  <Card key={job.id} className="p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-lg">{job.skillType}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>Workers: {job.requiredWorkers}</span>
                          </div>
                          <div>Budget: ₹{job.budgetPerWorker}/worker</div>
                        </div>
                      </div>
                      <Badge variant={job.status === "OPEN" ? "default" : "secondary"}>
                        {job.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;
