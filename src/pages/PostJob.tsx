import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationPicker } from "@/components/LocationPicker";
import { FileText, Users, Clock, DollarSign, Zap } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

interface LocationData {
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

const PostJob = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillType: "",
    requiredWorkers: "",
    budgetPerWorker: "",
    duration: "",
    startDate: "",
    jobType: "",
    urgency: "",
    location: {
      latitude: undefined,
      longitude: undefined,
      address: "",
      city: "",
      state: "",
      pincode: "",
    } as LocationData,
  });

  const skillTypes = [
    "Plumbing",
    "Electrician",
    "Carpenter",
    "Painting",
    "Cleaning",
    "Construction",
    "Gardening",
    "Delivery",
    "Labour",
    "Other",
  ];

  const jobTypes = ["One-Time", "Daily", "Monthly"];
  const urgencyLevels = ["Low", "Medium", "High"];

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to post a job");
      navigate("/auth");
      return;
    }

    if (!formData.location.latitude || !formData.location.longitude) {
      toast.error("Please select a location on the map.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          skillType: formData.skillType,
          jobType: formData.jobType,
          urgency: formData.urgency,
          requiredWorkers: Number(formData.requiredWorkers),
          duration: formData.duration,
          startDate: formData.startDate,
          budgetPerWorker: Number(formData.budgetPerWorker),
          address: formData.location.address,
          city: formData.location.city,
          state: formData.location.state,
          pincode: formData.location.pincode,
          latitude: formData.location.latitude,
          longitude: formData.location.longitude,
          notes: formData.description,
          status: isDraft ? "DRAFT" : "OPEN",
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast.error(err.message || "Failed to post job");
        return;
      }

      toast.success(isDraft ? "Job saved as Draft!" : "Job posted successfully!");
      navigate("/owner-dashboard");
    } catch {
      toast.error("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <PageHeader title="Post a Job" showBack backTo="/owner-dashboard" />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Post a New Job
          </h1>
          <p className="text-muted-foreground">Fill in all job details to find the perfect workers</p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          {/* Job Details Card */}
          <Card className="shadow-soft animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                Job Details
              </CardTitle>
              <CardDescription>Basic information about the job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Job Title *</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. House Painting Needed"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain the job details, requirements, and expectations..."
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Skill Type *</Label>
                  <Select
                    value={formData.skillType}
                    onValueChange={(value) => setFormData({ ...formData, skillType: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillTypes.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Required Workers *
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    required
                    value={formData.requiredWorkers}
                    onChange={(e) => setFormData({ ...formData, requiredWorkers: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Job Type *</Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value) => setFormData({ ...formData, jobType: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    Urgency *
                  </Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Duration *
                  </Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 2 days"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Budget per Worker (₹) *
                </Label>
                <Input
                  type="number"
                  min={0}
                  required
                  value={formData.budgetPerWorker}
                  onChange={(e) => setFormData({ ...formData, budgetPerWorker: e.target.value })}
                  placeholder="Enter budget per worker"
                  className="mt-1.5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Picker */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <LocationPicker
              location={formData.location}
              onChange={(location) => setFormData({ ...formData, location })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 text-base font-medium"
              size="lg"
            >
              {isSubmitting ? "Publishing..." : "Publish Job"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="flex-1 h-12 text-base"
              size="lg"
              onClick={(e) => handleSubmit(e, true)}
            >
              Save as Draft
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
