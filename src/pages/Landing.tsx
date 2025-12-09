import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Briefcase, Users, MapPin, Clock, CheckCircle, Shield, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-hiring.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float animation-delay-200" />
        
        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                  Connect Workers & Employers Instantly
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Find Your Perfect
                <span className="block mt-2 gradient-text">
                  Work Match
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                HireHub connects skilled workers with opportunities and employers with reliable talent. Post jobs, hire daily labour, or find your next gig—all in one platform.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="xl"
                  variant="premium"
                  onClick={() => navigate("/auth?role=owner")}
                  className="group"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  I'm Hiring
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  onClick={() => navigate("/auth?role=worker")}
                  className="group"
                >
                  <Users className="mr-2 h-5 w-5" />
                  I'm Looking for Work
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-8">
                <div className="animate-fade-in animation-delay-100">
                  <div className="text-4xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground font-medium">Active Workers</div>
                </div>
                <div className="h-14 w-px bg-border" />
                <div className="animate-fade-in animation-delay-200">
                  <div className="text-4xl font-bold text-secondary">5K+</div>
                  <div className="text-sm text-muted-foreground font-medium">Jobs Posted</div>
                </div>
                <div className="h-14 w-px bg-border" />
                <div className="animate-fade-in animation-delay-300">
                  <div className="text-4xl font-bold text-success">98%</div>
                  <div className="text-sm text-muted-foreground font-medium">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in animation-delay-200">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 via-secondary/20 to-success/30 blur-3xl rounded-3xl opacity-60" />
              <div className="relative">
                <img
                  src={heroImage}
                  alt="HireHub connecting workers and employers"
                  className="relative rounded-3xl shadow-xl w-full border border-border/50"
                />
                {/* Floating Cards */}
                <div className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Verified Workers</p>
                      <p className="text-xs text-muted-foreground">ID & Skills Certified</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 p-4 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg animate-float animation-delay-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">GPS Matching</p>
                      <p className="text-xs text-muted-foreground">Find nearby talent</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="container mx-auto relative">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block text-sm font-medium px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              Why HireHub?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The fastest, most reliable way to connect talent with opportunity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: "Location-Based Matching", desc: "Find workers near you instantly with GPS-powered matching and real-time availability.", color: "primary" },
              { icon: Clock, title: "Daily Labour Hiring", desc: "Need help today? Hire verified daily labourers for short-term tasks instantly.", color: "secondary" },
              { icon: CheckCircle, title: "Verified Professionals", desc: "All workers are ID-verified and skill-certified for your peace of mind.", color: "success" },
              { icon: Users, title: "Multiple Categories", desc: "Construction, painting, cleaning, shifting—find workers for any type of work.", color: "primary" },
              { icon: Shield, title: "Secure Payments", desc: "Safe, transparent payment system ensures everyone gets paid fairly.", color: "secondary" },
              { icon: Briefcase, title: "Easy Job Management", desc: "Track applications, manage hires, and communicate—all from one dashboard.", color: "success" },
            ].map((feature, index) => (
              <Card 
                key={index} 
                className={`group border-2 border-transparent hover:border-${feature.color}/30 cursor-pointer animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-8 pb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-7 w-7 text-${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Card className="border-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            <CardContent className="py-20 text-center relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join thousands of workers and employers finding success on HireHub
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="xl"
                  variant="premium"
                  onClick={() => navigate("/auth")}
                  className="group"
                >
                  Sign Up Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="xl"
                  variant="glass"
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
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">HireHub</span>
            </div>
            <p className="text-muted-foreground text-center">
              © 2024 HireHub. Connecting talent with opportunity.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">Privacy</Button>
              <Button variant="ghost" size="sm">Terms</Button>
              <Button variant="ghost" size="sm">Contact</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
