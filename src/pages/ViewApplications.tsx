import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Briefcase, ArrowLeft, Loader2, Phone, Mail, Award } from "lucide-react";
import { toast } from "sonner";

interface Application {
  id: string;
  workerName: string;
  workerEmail: string;
  workerPhone?: string;
  skills?: string;
  experience?: string;
  status: string;
  appliedDate: string;
}

interface Job {
  id: string;
  title: string;
  skillType: string;
  requiredWorkers: number;
}

const ViewApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/auth");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/jobs/${jobId}/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || data);
        setJob(data.job);
      } else {
        toast.error("Failed to load applications");
      }
    } catch (error) {
      toast.error("Error fetching applications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicationAction = async (
    applicationId: string,
    action: "accept" | "reject"
  ) => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/jobs/applications/${applicationId}/${action}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        toast.success(`Application ${action}ed successfully`);
        fetchApplications();
      } else {
        toast.error(`Failed to ${action} application`);
      }
    } catch (error) {
      toast.error(`Error ${action}ing application`);
    }
  };

  const getStatusColor = (status: string) => {
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
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/owner-dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">HireHub</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Job Applications</h1>
          {job && (
            <p className="text-muted-foreground">
              {job.title} • {job.skillType} • {applications.length} applications
            </p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Applications Received</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No applications yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.workerName}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {app.workerEmail && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">{app.workerEmail}</span>
                            </div>
                          )}
                          {app.workerPhone && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{app.workerPhone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {app.skills ? (
                          <Badge variant="secondary" className="text-xs">
                            {app.skills}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {app.experience ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Award className="h-3 w-3 text-primary" />
                            <span>{app.experience}</span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(app.status)} border text-xs`}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {app.status.toUpperCase() === "PENDING" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApplicationAction(app.id, "accept")}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleApplicationAction(app.id, "reject")}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewApplications;
