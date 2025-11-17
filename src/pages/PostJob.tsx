import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocationPicker } from "@/components/LocationPicker";
import { Briefcase, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface LocationData {
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  address?: string;
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
    jobType: "",
    duration: "",
    startDate: "",
    urgency: "",
  location: {
    latitude: undefined,
    longitude: undefined,
    city: "",
    state: "",
    address: "",
    pincode: "",
  } as LocationData,
  });

  const skillTypes = [
    "Plumbing",
    "Electrician",
    "Carpenter",
    "Painting",
    "Cleaning",
    "Tile Work",
    "Cooking",
    "Delivery",
    "Labour",
    "Construction",
    "Gardening",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/auth");
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
          ...formData,
          requiredWorkers: parseInt(formData.requiredWorkers),
          budgetPerWorker: parseFloat(formData.budgetPerWorker),
          status: isDraft ? "DRAFT" : "PENDING",
        }),
      });

      if (response.ok) {
        toast.success(isDraft ? "Job saved as draft" : "Job posted successfully");
        navigate("/owner-dashboard");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to post job");
      }
    } catch (error) {
      toast.error("Error posting job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/owner-dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">HireHub</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
          <p className="text-muted-foreground">Fill in the details to hire workers</p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., House Painting Work"
                />
              </div>

              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the work to be done..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="skillType">Skill Type Required *</Label>
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
                  <Label htmlFor="requiredWorkers">Required Workers *</Label>
                  <Input
                    id="requiredWorkers"
                    type="number"
                    min="1"
                    required
                    value={formData.requiredWorkers}
                    onChange={(e) => setFormData({ ...formData, requiredWorkers: e.target.value })}
                    placeholder="Number of workers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budgetPerWorker">Budget Per Worker (₹) *</Label>
                  <Input
                    id="budgetPerWorker"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.budgetPerWorker}
                    onChange={(e) => setFormData({ ...formData, budgetPerWorker: e.target.value })}
                    placeholder="Amount in rupees"
                  />
                </div>

                <div>
                  <Label htmlFor="jobType">Job Type *</Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value) => setFormData({ ...formData, jobType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="One-Time">One-Time</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Work Duration *</Label>
                  <Input
                    id="duration"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 2 days, 8 hours"
                  />
                </div>

                <div>
                  <Label htmlFor="startDate">Work Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select
                  value={formData.urgency}
                  onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <LocationPicker
            location={formData.location}
            onChange={(location) => setFormData({ ...formData, location })}
          />

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Publishing..." : "Publish Job"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={(e: any) => handleSubmit(e, true)}
              disabled={isSubmitting}
              className="flex-1"
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
