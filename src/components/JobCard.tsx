import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, DollarSign, Calendar, Clock } from "lucide-react";

interface JobCardProps {
  job: {
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
  };
  onApply?: (jobId: string | number) => void;
  showApplyButton?: boolean;
}

export const JobCard = ({ job, onApply, showApplyButton = true }: JobCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "OPEN":
        return "bg-success/10 text-success border-success/20";
      case "PENDING":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20";
      case "CLOSED":
      case "FILLED":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card className="hover:shadow-md transition-all border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {job.title || job.skillType}
            </CardTitle>
            {job.skillType && job.title && (
              <p className="text-sm text-muted-foreground mt-1">{job.skillType}</p>
            )}
          </div>
          <Badge className={`${getStatusColor(job.status)} border`}>
            {job.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {job.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          {job.budgetPerWorker && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>₹{job.budgetPerWorker}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>{job.requiredWorkers} workers</span>
          </div>
          
          {(job.location || job.city) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="truncate">{job.location || job.city}</span>
            </div>
          )}
          
          {job.duration && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span>{job.duration}</span>
            </div>
          )}
          
          {job.date && (
            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{new Date(job.date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {showApplyButton && onApply && job.status.toUpperCase() === "OPEN" && (
          <Button
            onClick={() => onApply(job.id)}
            className="w-full"
            size="sm"
          >
            Apply Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
