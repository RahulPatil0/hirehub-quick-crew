import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Briefcase, Plus, Users, Clock, FileText, CheckCircle, Loader2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProfileCard } from "@/components/ProfileCard";
import { toast } from "sonner";

interface OwnerProfile {
  name: string;
  email: string;
  phone?: string;
  businessType?: string;
  city?: string;
  state?: string;
}

interface Job {
  id: string;
  title: string;
  skillType: string;
  createdDate: string;
  status: string;
  applicationsCount: number;
}

interface Stats {
  totalJobs: number;
  activeJobs: number;
  applicationsReceived: number;
  jobsCompleted: number;
}

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    activeJobs: 0,
    applicationsReceived: 0,
    jobsCompleted: 0,
  });

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/auth");
      return;
    }

    try {
      // Fetch owner profile
      const profileRes = await fetch("http://localhost:8080/api/owner/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      // Fetch owner jobs
      const ownerId = localStorage.getItem("userId");
      if (ownerId) {
        const jobsRes = await fetch(
          `http://localhost:8080/api/jobs/owner/${ownerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(jobsData);

          // Calculate stats
          const activeJobs = jobsData.filter(
            (job: Job) => job.status.toUpperCase() === "OPEN"
          ).length;
          const totalApplications = jobsData.reduce(
            (sum: number, job: Job) => sum + (job.applicationsCount || 0),
            0
          );
          const completedJobs = jobsData.filter(
            (job: Job) => job.status.toUpperCase() === "CLOSED"
          ).length;

          setStats({
            totalJobs: jobsData.length,
            activeJobs,
            applicationsReceived: totalApplications,
            jobsCompleted: completedJobs,
          });
        }
      }
    } catch (error: any) {
      const errorMsg = error.message || "Failed to load dashboard data";
      
      if (errorMsg.includes("403") || errorMsg.includes("unauthorized")) {
        toast.error("Session expired. Please login again.");
        navigate("/auth");
      } else if (errorMsg.includes("network") || errorMsg.includes("fetch")) {
        toast.error("Cannot connect to server. Please check your connection.");
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseJob = async (jobId: string) => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/jobs/${jobId}/close`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        toast.success("Job closed successfully");
        fetchOwnerData();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to close job");
      }
    } catch (error: any) {
      toast.error(error.message || "Error closing job. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "OPEN":
        return "bg-success/10 text-success border-success/20";
      case "PENDING":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20";
      case "CLOSED":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">HireHub</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("userId");
                toast.success("Logged out successfully");
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your job postings and hires</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analytics Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Jobs</p>
                      <p className="text-2xl font-bold">{stats.totalJobs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <Briefcase className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Jobs</p>
                      <p className="text-2xl font-bold">{stats.activeJobs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Users className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Applications</p>
                      <p className="text-2xl font-bold">{stats.applicationsReceived}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent">
                      <CheckCircle className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{stats.jobsCompleted}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card
                className="border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer"
                onClick={() => navigate("/owner/post-job")}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Post a Job</h3>
                      <p className="text-sm text-muted-foreground">Create new listing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-2 border-secondary/20 hover:border-secondary transition-colors cursor-pointer"
                onClick={() => navigate("/hire-labour")}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-secondary/10">
                      <Users className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Hire Daily Labour</h3>
                      <p className="text-sm text-muted-foreground">Find workers nearby</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-2 border-success/20 hover:border-success transition-colors cursor-pointer"
                onClick={() => navigate("/owner/jobs")}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-success/10">
                      <Clock className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold">My Jobs</h3>
                      <p className="text-sm text-muted-foreground">View all postings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Job Postings</CardTitle>
                <CardDescription>Your latest job listings</CardDescription>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No jobs posted yet</p>
                    <Button onClick={() => navigate("/owner/post-job")} size="lg">
                      Post Your First Job
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.slice(0, 5).map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <Briefcase className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{job.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <span>{job.skillType}</span>
                              <span>•</span>
                              <span>{job.applicationsCount || 0} applications</span>
                              <span>•</span>
                              <span>{new Date(job.createdDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                          <div className="flex items-center gap-3">
                          <StatusBadge status={job.status} />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/owner/jobs/${job.id}/applications`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {job.status.toUpperCase() === "OPEN" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCloseJob(job.id)}
                            >
                              Close
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            {profile && <ProfileCard profile={profile} type="owner" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
