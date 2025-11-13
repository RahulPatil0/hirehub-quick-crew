import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Briefcase, Users, MapPin, Clock, CheckCircle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-hiring.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        
        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="text-sm font-semibold px-4 py-2 rounded-full bg-accent text-accent-foreground border border-border">
                  🚀 Connect Workers & Employers Instantly
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Find Your Perfect
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Work Match
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl">
                HireHub connects skilled workers with opportunities and employers with reliable talent. Post jobs, hire daily labour, or find your next gig—all in one platform.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  size="xl"
                  variant="hero"
                  onClick={() => navigate("/auth?role=owner")}
                >
                  <Briefcase className="mr-2" />
                  I'm Hiring
                </Button>
                <Button
                  size="xl"
                  variant="secondary"
                  onClick={() => navigate("/auth?role=worker")}
                >
                  <Users className="mr-2" />
                  I'm Looking for Work
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Workers</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold text-secondary">5K+</div>
                  <div className="text-sm text-muted-foreground">Jobs Posted</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold text-success">98%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl rounded-full" />
              <img
                src={heroImage}
                alt="HireHub connecting workers and employers"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose HireHub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The fastest, most reliable way to connect talent with opportunity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Location-Based Matching</h3>
                <p className="text-muted-foreground">
                  Find workers near you instantly with GPS-powered matching and real-time availability.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Daily Labour Hiring</h3>
                <p className="text-muted-foreground">
                  Need help today? Hire verified daily labourers for short-term tasks instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-success transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
                <p className="text-muted-foreground">
                  All workers are ID-verified and skill-certified for your peace of mind.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiple Categories</h3>
                <p className="text-muted-foreground">
                  Construction, painting, cleaning, shifting—find workers for any type of work.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">
                  Safe, transparent payment system ensures everyone gets paid fairly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-success transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Job Management</h3>
                <p className="text-muted-foreground">
                  Track applications, manage hires, and communicate—all from one dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            <CardContent className="py-16 text-center relative">
              <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of workers and employers finding success on HireHub
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="xl"
                  variant="hero"
                  onClick={() => navigate("/auth")}
                >
                  Sign Up Now
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  onClick={() => navigate("/auth")}
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">HireHub</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 HireHub. Connecting talent with opportunity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
