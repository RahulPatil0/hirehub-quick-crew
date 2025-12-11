import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PageHeaderProps {
  title?: string;
  showBack?: boolean;
  backTo?: string;
  showLogout?: boolean;
  showLogo?: boolean;
}

export const PageHeader = ({
  title,
  showBack = false,
  backTo,
  showLogout = false,
  showLogo = true,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {showBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="hover:bg-primary/10 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            {showLogo && (
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  HireHub
                </span>
              </div>
            )}
            {title && !showLogo && (
              <h1 className="text-xl font-bold text-foreground">{title}</h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            {title && showLogo && (
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                {title}
              </span>
            )}
            {showLogout && (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
