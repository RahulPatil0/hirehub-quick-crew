import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "error";
}

export const StatusBadge = ({ status, variant }: StatusBadgeProps) => {
  const getVariantStyles = () => {
    const upperStatus = status.toUpperCase();
    
    // Auto-detect variant if not provided
    if (!variant) {
      if (["ACTIVE", "ACCEPTED", "OPEN", "COMPLETED", "APPROVED"].includes(upperStatus)) {
        variant = "success";
      } else if (["PENDING", "IN_PROGRESS"].includes(upperStatus)) {
        variant = "warning";
      } else if (["REJECTED", "CLOSED", "DISABLED", "INACTIVE"].includes(upperStatus)) {
        variant = "error";
      }
    }
    
    switch (variant) {
      case "success":
        return "bg-success/10 text-success border-success/20";
      case "warning":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20";
      case "error":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Badge className={cn("border font-medium", getVariantStyles())}>
      {status}
    </Badge>
  );
};
