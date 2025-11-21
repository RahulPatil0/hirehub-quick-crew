import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, Users, Briefcase, UserCheck, LogOut, Eye, Loader2 } from "lucide-react";

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

    // Redirect to pending verifications if there are any
    checkPendingVerifications();
    fetchDashboardData();
  }, [navigate]);

  const checkPendingVerifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8080/api/admin/pending-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          // Optionally redirect to pending verifications on first login
          // navigate("/admin/pending-verifications");
        }
      }
    } catch (error) {
      // Silent fail
    }
  };

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch owners
      const ownersRes = await fetch("http://localhost:8080/api/admin/owners", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (ownersRes.ok) {
        const ownersData = await ownersRes.json();
        setOwners(ownersData);
      }

      // Fetch workers
      const workersRes = await fetch("http://localhost:8080/api/admin/workers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (workersRes.ok) {
        const workersData = await workersRes.json();
        setWorkers(workersData);
      }

      // Update stats
      setStats({
        totalWorkers: workers.length,
        totalOwners: owners.length,
        totalJobs: 0, // Will be updated when backend provides this
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">HireHub Management Panel</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{workers.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Owners</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{owners.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalJobs}</div>
            </CardContent>
          </Card>
          <Card 
            className="shadow-elegant cursor-pointer hover:shadow-lg transition-shadow border-2 border-primary/20"
            onClick={() => navigate("/admin/pending-verifications")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <UserCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">View</div>
              <p className="text-xs text-muted-foreground mt-1">Review documents</p>
            </CardContent>
          </Card>
        </div>

        {/* Owners Section */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Owners</CardTitle>
            <CardDescription>Manage all registered owners</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No owners found
                    </TableCell>
                  </TableRow>
                ) : (
                  owners.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell className="font-medium">{owner.username}</TableCell>
                      <TableCell>{owner.email}</TableCell>
                      <TableCell>{owner.phone}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          owner.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {owner.status || "ACTIVE"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewJobs(owner)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Jobs
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleActivate("owners", owner.id)}
                          >
                            Activate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeactivate("owners", owner.id)}
                          >
                            Deactivate
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete("owners", owner.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Workers Section */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Workers</CardTitle>
            <CardDescription>Manage all registered workers</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No workers found
                    </TableCell>
                  </TableRow>
                ) : (
                  workers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-medium">{worker.username}</TableCell>
                      <TableCell>{worker.email}</TableCell>
                      <TableCell>{worker.phone}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          worker.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {worker.status || "ACTIVE"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleActivate("workers", worker.id)}
                          >
                            Activate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeactivate("workers", worker.id)}
                          >
                            Deactivate
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete("workers", worker.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
                        <h3 className="font-semibold text-lg text-foreground">{job.skillType}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>Workers: {job.requiredWorkers}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Budget:</span>
                            <span>₹{job.budgetPerWorker}/worker</span>
                          </div>
                          {job.date && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Date:</span>
                              <span>{job.date}</span>
                            </div>
                          )}
                          {job.duration && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Duration:</span>
                              <span>{job.duration}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          job.status === "OPEN"
                            ? "default"
                            : job.status === "PENDING"
                            ? "secondary"
                            : "outline"
                        }
                        className={`ml-4 ${
                          job.status === "OPEN"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : job.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
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
