import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Users } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { registerUser, loginUser } from "@/api/authApi";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");

  const [username, setUsername] = useState("");   // ⬅️ UPDATED
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"owner" | "worker" | null>(
    roleParam === "owner" || roleParam === "worker" ? roleParam : null
  );

  // ---------------------------------------------------
  // SIGN UP
  // ---------------------------------------------------
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error("Please select your role");
      return;
    }

    try {
      const payload = {
        username,    // ⬅️ UPDATED
        email,
        phone,
        password,
        role: selectedRole.toUpperCase() as "OWNER" | "WORKER" | "ADMIN",
      };

      const res = await registerUser(payload);

      toast.success("Account created successfully!");

      if (res?.token) localStorage.setItem("token", res.token);

      navigate(selectedRole === "owner" ? "/owner-dashboard" : "/worker-dashboard");

    } catch (error: any) {
      toast.error(error.message || "Registration failed!");
    }
  };

  // ---------------------------------------------------
  // SIGN IN
  // ---------------------------------------------------
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error("Please select your role");
      return;
    }

    try {
      const payload = {
        email,
        password,
        role: selectedRole.toUpperCase() as "OWNER" | "WORKER" | "ADMIN",
      };

      const res = await loginUser(payload);

      toast.success("Signed in successfully!");

      if (res?.token) localStorage.setItem("token", res.token);

      navigate(selectedRole === "owner" ? "/owner-dashboard" : "/worker-dashboard");

    } catch (error: any) {
      toast.error(error.message || "Invalid email or password!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">HireHub</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account or create a new one</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Choose your role to continue</CardDescription>
          </CardHeader>

          <CardContent>

            {/* ROLE SELECTION */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                type="button"
                variant={selectedRole === "owner" ? "default" : "outline"}
                className="h-20 flex-col"
                onClick={() => setSelectedRole("owner")}
              >
                <Briefcase className="h-6 w-6 mb-2" />
                <span className="font-semibold">I'm an Owner</span>
                <span className="text-xs text-muted-foreground">Hire workers</span>
              </Button>

              <Button
                type="button"
                variant={selectedRole === "worker" ? "default" : "outline"}
                className="h-20 flex-col"
                onClick={() => setSelectedRole("worker")}
              >
                <Users className="h-6 w-6 mb-2" />
                <span className="font-semibold">I'm a Worker</span>
                <span className="text-xs text-muted-foreground">Find work</span>
              </Button>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* SIGN IN FORM */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* SIGN UP FORM */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Username</Label>       {/* UPDATED LABEL */}
                    <Input
                      placeholder="John Doe"
                      value={username}             // UPDATED
                      onChange={(e) => setUsername(e.target.value)} // UPDATED
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      placeholder="+1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button variant="link" onClick={() => navigate("/")}>
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
