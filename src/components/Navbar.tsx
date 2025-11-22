import { Button } from "@/components/ui/button";
import { Briefcase, BarChart3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AIAssistant } from "@/components/AIAssistant";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <>
      <AIAssistant />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                HireHub
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {role ? (
                <>
                  {role === "ADMIN" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/admin/analytics")}
                      className="gap-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Analytics
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => navigate("/")}>
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/auth")}>
                    Sign In
                  </Button>
                  <Button variant="default" onClick={() => navigate("/auth")}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
