import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Briefcase, Loader2, Phone, Mail, Award, Users } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

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
        toast.error(`Error processing application`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} application. Please try again.`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <PageHeader title="Job Applications" showBack backTo="/owner-dashboard" />

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Job Applications
          </h1>
          {job && (
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <span className="font-medium text-foreground">{job.title}</span>
              <span>•</span>
              <Badge variant="secondary">{job.skillType}</Badge>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {applications.length} applications
              </span>
            </div>
          )}
        </div>

        <Card className="shadow-soft animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              Applications Received
            </CardTitle>
            <CardDescription>Review and manage worker applications</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium mb-2">No Applications Yet</p>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Applications will appear here once workers apply to your job posting.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                      <TableRow key={app.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{app.workerName}</TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            {app.workerEmail && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Mail className="h-3.5 w-3.5" />
                                <span className="truncate max-w-[150px]">{app.workerEmail}</span>
                              </div>
                            )}
                            {app.workerPhone && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Phone className="h-3.5 w-3.5" />
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
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {app.experience ? (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Award className="h-3.5 w-3.5 text-primary" />
                              <span>{app.experience}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={app.status} />
                        </TableCell>
                        <TableCell>
                          {app.status.toUpperCase() === "PENDING" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleApplicationAction(app.id, "accept")}
                                className="h-8"
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleApplicationAction(app.id, "reject")}
                                className="h-8"
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewApplications;
