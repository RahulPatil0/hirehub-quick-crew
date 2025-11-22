import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  Camera,
  Save,
  Calendar,
  Users,
  CheckCircle,
} from "lucide-react";

const OwnerProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    location: "",
    businessType: "",
    description: "",
    website: "",
  });
  const [jobHistory, setJobHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
    fetchJobHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      const response = await fetch(`http://localhost:8080/api/owner/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchJobHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      const response = await fetch(`http://localhost:8080/api/owner/${userId}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setJobHistory(data);
      }
    } catch (error) {
      console.error("Error fetching job history:", error);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await fetch(`http://localhost:8080/api/owner/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const totalJobs = jobHistory.length;
  const activeJobs = jobHistory.filter(job => job.status === "OPEN").length;
  const completedJobs = jobHistory.filter(job => job.status === "CLOSED").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate("/owner-dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold">Business Profile</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-primary/20 shadow-soft">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {profile.companyName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full h-10 w-10"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold">{profile.companyName || "Company Name"}</h2>
                  <p className="text-muted-foreground">{profile.businessType || "Business Type"}</p>
                  <Badge className="mt-2" variant="default">
                    Active Employer
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6 border-primary/20 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Jobs Posted</span>
                  <span className="font-semibold">{totalJobs}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Jobs</span>
                  <span className="font-semibold text-success">{activeJobs}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed Jobs</span>
                  <span className="font-semibold text-primary">{completedJobs}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information */}
            <Card className="border-primary/20 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={profile.companyName}
                      onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                      placeholder="ABC Construction Ltd."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Input
                      id="businessType"
                      value={profile.businessType}
                      onChange={(e) => setProfile({ ...profile, businessType: e.target.value })}
                      placeholder="Construction, Manufacturing, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Contact Person</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="john@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      placeholder="https://www.company.com"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="Mumbai, Maharashtra"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    placeholder="Tell us about your business..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Job Posting History */}
            <Card className="border-primary/20 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Job Posting History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {jobHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No jobs posted yet.</p>
                    <Button onClick={() => navigate("/owner/post-job")}>
                      Post Your First Job
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobHistory.map((job, index) => (
                      <div
                        key={index}
                        className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/owner/jobs/${job.id}/applications`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-lg">{job.title}</h4>
                              <StatusBadge status={job.status} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {job.description}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(job.createdDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {job.applicationsCount || 0} applications
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSaveProfile}
                disabled={isLoading}
                size="lg"
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
