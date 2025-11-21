import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Briefcase, Bell, Loader2, MapPin, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { JobCard } from "@/components/JobCard";
import { ProfileCard } from "@/components/ProfileCard";
import { Badge } from "@/components/ui/badge";
import { useWorkerLocation } from "@/hooks/useWorkerLocation";
import { useJobNotifications } from "@/hooks/useJobNotifications";

interface WorkerProfile {
  name: string;
  email: string;
  phone?: string;
  skills?: string;
  experience?: string;
  status?: string;
  city?: string;
  state?: string;
}

interface Job {
  id: string | number;
  title?: string;
  skillType: string;
  description?: string;
  budgetPerWorker?: number;
  requiredWorkers: number;
  location?: string;
  city?: string;
  date?: string;
  duration?: string;
  status: string;
}

interface Application {
  id: string;
  jobTitle: string;
  ownerName: string;
  status: string;
  appliedDate: string;
}

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [notifications] = useState([
    "New job posted: House Painting in your area",
    "Application accepted for Construction Work",
  ]);

  // Live location tracking and real-time notifications
  const locationState = useWorkerLocation(isAvailable);
  const notificationState = useJobNotifications(isAvailable);

  useEffect(() => {
    fetchWorkerData();
  }, []);

  const fetchWorkerData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/auth");
      return;
    }

    try {
      // Fetch worker profile
      const profileRes = await fetch("http://localhost:8080/api/worker/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      // Fetch available jobs
      const jobsRes = await fetch("http://localhost:8080/api/jobs/open", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setAvailableJobs(jobsData);
      }

      // Fetch worker applications
      const workerId = localStorage.getItem("userId");
      if (workerId) {
        const appsRes = await fetch(
          `http://localhost:8080/api/worker/applications/${workerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (appsRes.ok) {
          const appsData = await appsRes.json();
          setMyApplications(appsData);
        }
      }
    } catch (error) {
      toast.error("Error loading dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvailabilityToggle = (checked: boolean) => {
    setIsAvailable(checked);
    toast.success(
      checked
        ? "You're now visible to employers"
        : "You're now hidden from employers"
    );
  };

  const handleApplyToJob = async (jobId: string | number) => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/jobs/${jobId}/apply`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        toast.success("Application submitted successfully");
        fetchWorkerData();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to apply");
      }
    } catch (error) {
      toast.error("Error submitting application");
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACCEPTED":
        return "bg-success/10 text-success border-success/20";
      case "PENDING":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20";
      case "REJECTED":
        return "bg-destructive/10 text-destructive border-destructive/20";
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
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">HireHub</span>
            </div>
            <Button variant="ghost" onClick={() => navigate("/")}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Worker Dashboard</h1>
          <p className="text-muted-foreground">Find and apply for jobs</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Availability Card */}
            <Card className="border-2 border-success/20">
              <CardHeader>
                <CardTitle>Daily Labour Availability</CardTitle>
                <CardDescription>
                  Toggle your availability to receive instant hire requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isAvailable ? "bg-success animate-pulse" : "bg-muted-foreground"
                      }`}
                    />
                    <Label htmlFor="availability" className="text-base cursor-pointer">
                      {isAvailable ? "Available for Hire" : "Not Available"}
                    </Label>
                  </div>
                  <Switch
                    id="availability"
                    checked={isAvailable}
                    onCheckedChange={handleAvailabilityToggle}
                  />
                </div>

                {isAvailable && (
                  <>
                    <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                      <p className="text-sm text-success-foreground">
                        ✓ You're now visible to employers looking for daily labour in your area
                      </p>
                    </div>

                    {/* Location Status */}
                    <div className="p-4 bg-card rounded-lg border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Location Tracking</span>
                        </div>
                        <Badge variant={locationState.isTracking ? "default" : "secondary"}>
                          {locationState.isTracking ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      {locationState.isTracking && locationState.latitude && locationState.longitude && (
                        <p className="text-xs text-muted-foreground">
                          📍 {locationState.latitude.toFixed(6)}, {locationState.longitude.toFixed(6)}
                        </p>
                      )}
                      
                      {locationState.error && (
                        <p className="text-xs text-destructive">
                          {locationState.error}
                        </p>
                      )}
                    </div>

                    {/* Notification Status */}
                    <div className="p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Radio className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Real-time Alerts</span>
                        </div>
                        <Badge variant={notificationState.isConnected ? "default" : "secondary"}>
                          {notificationState.isConnected ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>
                      
                      {notificationState.error && (
                        <p className="text-xs text-destructive mt-2">
                          {notificationState.error}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Available Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Available Jobs Near You</CardTitle>
                <CardDescription>Browse and apply for suitable opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                {availableJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No jobs available at the moment</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {availableJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onApply={handleApplyToJob}
                        showApplyButton={true}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Applications */}
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track your job applications</CardDescription>
              </CardHeader>
              <CardContent>
                {myApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">You haven't applied to any jobs yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.jobTitle}</TableCell>
                          <TableCell>{app.ownerName}</TableCell>
                          <TableCell>
                            <Badge
                              className={`${getApplicationStatusColor(app.status)} border`}
                            >
                              {app.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            {profile && (
              <ProfileCard profile={profile} type="worker" />
            )}

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No new notifications</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="p-3 bg-accent/50 rounded-lg text-sm border border-border"
                      >
                        {notification}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
