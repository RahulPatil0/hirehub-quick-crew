import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Briefcase, Plus, Users, Clock, FileText, CheckCircle, Loader2, Eye, LogOut, User, TrendingUp } from "lucide-react";
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
      const profileRes = await fetch("http://localhost:8080/api/owner/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      const ownerId = localStorage.getItem("userId");
      if (ownerId) {
        const jobsRes = await fetch(
          `http://localhost:8080/api/jobs/owner/${ownerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(jobsData);

          const activeJobs = jobsData.filter((job: Job) => job.status.toUpperCase() === "OPEN").length;
          const totalApplications = jobsData.reduce((sum: number, job: Job) => sum + (job.applicationsCount || 0), 0);
          const completedJobs = jobsData.filter((job: Job) => job.status.toUpperCase() === "CLOSED").length;

          setStats({
            totalJobs: jobsData.length,
            activeJobs,
            applicationsReceived: totalApplications,
            jobsCompleted: completedJobs,
          });
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseJob = async (jobId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/jobs/${jobId}/close`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success("Job closed successfully");
        fetchOwnerData();
      } else {
        toast.error("Failed to close job");
      }
    } catch (error: any) {
      toast.error(error.message || "Error closing job");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-page flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-page">
      {/* Header */}
      <header className="page-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">HireHub</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/owner/profile")}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-muted-foreground">Manage your job postings and hires</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Jobs", value: stats.totalJobs, icon: FileText, color: "primary" },
                { label: "Active Jobs", value: stats.activeJobs, icon: Briefcase, color: "success" },
                { label: "Applications", value: stats.applicationsReceived, icon: Users, color: "secondary" },
                { label: "Completed", value: stats.jobsCompleted, icon: CheckCircle, color: "primary" },
              ].map((stat, i) => (
                <Card key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-${stat.color}/10`}>
                        <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Post a Job", desc: "Create new listing", icon: Plus, color: "primary", path: "/owner/post-job" },
                { title: "Hire Labour", desc: "Find workers nearby", icon: Users, color: "secondary", path: "/hire-labour" },
                { title: "My Jobs", desc: "View all postings", icon: Clock, color: "success", path: "/owner/jobs" },
              ].map((action, i) => (
                <Card
                  key={i}
                  className={`cursor-pointer group border-2 border-transparent hover:border-${action.color}/30 animate-fade-in-up`}
                  style={{ animationDelay: `${(i + 4) * 100}ms` }}
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-${action.color}/10 group-hover:scale-110 transition-transform`}>
                        <action.icon className={`h-6 w-6 text-${action.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Jobs */}
            <Card className="animate-fade-in-up" style={{ animationDelay: "700ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Recent Job Postings
                </CardTitle>
                <CardDescription>Your latest job listings</CardDescription>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">No jobs posted yet</p>
                    <Button onClick={() => navigate("/owner/post-job")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Post Your First Job
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {jobs.slice(0, 5).map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors group"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 rounded-xl bg-primary/10 group-hover:scale-105 transition-transform">
                            <Briefcase className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{job.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <span>{job.skillType}</span>
                              <span>•</span>
                              <span>{job.applicationsCount || 0} applications</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={job.status} />
                          <Button variant="outline" size="sm" onClick={() => navigate(`/owner/jobs/${job.id}/applications`)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {job.status.toUpperCase() === "OPEN" && (
                            <Button variant="ghost" size="sm" onClick={() => handleCloseJob(job.id)}>
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
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "800ms" }}>
            {profile && <ProfileCard profile={profile} type="owner" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
