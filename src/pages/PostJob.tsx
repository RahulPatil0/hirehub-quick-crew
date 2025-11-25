import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationPicker } from "@/components/LocationPicker";
import { Briefcase, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

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

  // 🔥 Submit
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

          // 🔥 Correct backend mapping
          address: formData.location.address,
          city: formData.location.city,
          state: formData.location.state,
          pincode: formData.location.pincode,
          latitude: formData.location.latitude,
          longitude: formData.location.longitude,

          notes: formData.description, // reusing description as notes
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
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/owner-dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">HireHub</span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-3">Post a Job</h1>
        <p className="text-muted-foreground mb-8">Fill in all job details below</p>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Title */}
              <div>
                <Label>Job Title *</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. House Painting Needed"
                />
              </div>

              {/* Description */}
              <div>
                <Label>Description *</Label>
                <Textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain the job details..."
                />
              </div>

              {/* Skill + Workers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Skill Type *</Label>
                  <Select
                    value={formData.skillType}
                    onValueChange={(value) => setFormData({ ...formData, skillType: value })}
                  >
                    <SelectTrigger>
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
                  <Label>Required Workers *</Label>
                  <Input
                    type="number"
                    min={1}
                    required
                    value={formData.requiredWorkers}
                    onChange={(e) => setFormData({ ...formData, requiredWorkers: e.target.value })}
                  />
                </div>
              </div>

              {/* Job Type + Urgency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Job Type *</Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value) => setFormData({ ...formData, jobType: value })}
                  >
                    <SelectTrigger>
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
                  <Label>Urgency *</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                  >
                    <SelectTrigger>
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

              {/* Duration + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration *</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 2 days"
                  />
                </div>

                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* 🌍 LOCATION PICKER SECTION */}
          <LocationPicker
            location={formData.location}
            onChange={(location) => setFormData({ ...formData, location })}
          />

          {/* Buttons */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Publishing..." : "Publish Job"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="flex-1"
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
