import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Briefcase, MapPin, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(false);
  const [availableJobs] = useState([
    {
      id: 1,
      title: "House Painting",
      location: "Downtown",
      budget: "$50/hour",
      duration: "Full Day",
      category: "Painting",
    },
    {
      id: 2,
      title: "Construction Helper",
      location: "North Side",
      budget: "$45/hour",
      duration: "3 Days",
      category: "Construction",
    },
  ]);

  const handleAvailabilityToggle = (checked: boolean) => {
    setIsAvailable(checked);
    toast.success(
      checked
        ? "You're now visible to employers"
        : "You're now hidden from employers"
    );
  };

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Worker Dashboard</h1>
          <p className="text-muted-foreground">Find and apply for jobs</p>
        </div>

        {/* Availability Card */}
        <Card className="mb-8 border-2 border-success/20">
          <CardHeader>
            <CardTitle>Daily Labour Availability</CardTitle>
            <CardDescription>
              Toggle your availability to receive instant hire requests
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20">
                <p className="text-sm text-success-foreground">
                  ✓ You're now visible to employers looking for daily labour in your area
                </p>
              </div>
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
            <div className="space-y-4">
              {availableJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 border-2 border-border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <Badge className="mb-2">{job.category}</Badge>
                    </div>
                    <Button variant="default">Apply Now</Button>
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{job.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-success font-semibold">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.budget}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkerDashboard;
