import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Users, Mail, Lock, User, Phone, Upload, ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { loginUser } from "@/api/authApi";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const [selectedRole, setSelectedRole] = useState<"owner" | "worker" | null>(
    roleParam === "owner" || roleParam === "worker" ? roleParam : null
  );

  /* ------------------------------- SIGN UP ------------------------------- */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) return toast.error("Please select your role first");
    if (!aadhaarFile || !panFile || !profilePhoto)
      return toast.error("Please upload Aadhaar, PAN & Profile photo");

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("role", selectedRole.toUpperCase());
      formData.append("aadhaar", aadhaarFile);
      formData.append("pan", panFile);
      formData.append("profilePhoto", profilePhoto);

      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success("Registration submitted! Your documents are pending admin verification.");

      setUsername("");
      setEmail("");
      setPhone("");
      setPassword("");
      setAadhaarFile(null);
      setPanFile(null);
      setProfilePhoto(null);
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    }
  };

  /* ------------------------------- SIGN IN ------------------------------- */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const lockedRole = localStorage.getItem("selectedLoginRole");
    if (!lockedRole) return toast.error("Please select your role (Owner or Worker)");

    try {
      const payload = {
        email,
        password,
        role: lockedRole as "OWNER" | "WORKER",
      };

      const res = await loginUser(payload);

      const returnedRole = res?.role?.toUpperCase();
      const expectedRole = lockedRole.toUpperCase();

      if (returnedRole && returnedRole !== expectedRole) {
        toast.error(`This account is registered as ${returnedRole}. Please select the correct role.`);
        return;
      }

      if (res?.token) localStorage.setItem("token", res.token);
      if (res?.role) localStorage.setItem("role", res.role.toUpperCase());
      if (res?.userId) localStorage.setItem("userId", res.userId.toString());

      toast.success("Signed in successfully!");

      navigate(expectedRole === "OWNER" ? "/owner-dashboard" : "/worker-dashboard");
    } catch (error: any) {
      const errorMsg = (error.message || "").toLowerCase();

      if (errorMsg.includes("pending") || errorMsg.includes("verification")) {
        toast.error("Your documents are pending admin verification. Please wait for approval.");
      } else if (errorMsg.includes("disabled") || errorMsg.includes("inactive")) {
        toast.error("Your account has been disabled by admin. Please contact support.");
      } else if (errorMsg.includes("role") || errorMsg.includes("mismatch")) {
        toast.error(`Invalid credentials for ${lockedRole}. Check your role selection.`);
      } else if (errorMsg.includes("not found") || errorMsg.includes("invalid")) {
        toast.error("Invalid email, password, or role. Please check your credentials.");
      } else {
        toast.error("Login failed. Please verify your email, password, and selected role.");
      }
    }
  };

  /* -------------------------------- UI -------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-page relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float animation-delay-300" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-success/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6 -ml-2" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold">HireHub</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in or create your account</p>
        </div>

        <Card className="border-border/50 backdrop-blur-xl bg-card/80 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Get Started
            </CardTitle>
            <CardDescription>Choose your role to continue</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* OWNER */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole("owner");
                  localStorage.setItem("selectedLoginRole", "OWNER");
                }}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group
                  ${
                    selectedRole === "owner"
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border hover:border-primary/50 hover:bg-accent/50"
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center transition-colors ${
                  selectedRole === "owner" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  <Briefcase className="h-6 w-6" />
                </div>
                <p className="font-semibold mb-1">I'm an Owner</p>
                <p className="text-xs text-muted-foreground">Hire workers for jobs</p>
                {selectedRole === "owner" && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-foreground" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>

              {/* WORKER */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole("worker");
                  localStorage.setItem("selectedLoginRole", "WORKER");
                }}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group
                  ${
                    selectedRole === "worker"
                      ? "border-secondary bg-secondary/10 shadow-lg shadow-secondary/20"
                      : "border-border hover:border-secondary/50 hover:bg-accent/50"
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center transition-colors ${
                  selectedRole === "worker" ? "bg-secondary text-secondary-foreground" : "bg-muted"
                }`}>
                  <Users className="h-6 w-6" />
                </div>
                <p className="font-semibold mb-1">I'm a Worker</p>
                <p className="text-xs text-muted-foreground">Find work opportunities</p>
                {selectedRole === "worker" && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                    <svg className="w-4 h-4 text-secondary-foreground" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            </div>

            {/* TABS */}
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/50">
                <TabsTrigger value="signin" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* SIGN IN FORM */}
              <TabsContent value="signin" className="space-y-4 animate-fade-in">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 rounded-xl" size="lg">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* SIGN UP FORM */}
              <TabsContent value="signup" className="space-y-4 animate-fade-in">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="John Doe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  {/* DOCUMENT UPLOADS */}
                  <div className="space-y-3 pt-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Required Documents
                    </Label>

                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-border bg-muted/30">
                        <div className="flex-1">
                          <p className="text-sm font-medium">Profile Photo</p>
                          <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                          className="w-auto text-xs h-9"
                          required
                        />
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-border bg-muted/30">
                        <div className="flex-1">
                          <p className="text-sm font-medium">Aadhaar Card</p>
                          <p className="text-xs text-muted-foreground">Image or PDF</p>
                        </div>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => setAadhaarFile(e.target.files?.[0] || null)}
                          className="w-auto text-xs h-9"
                          required
                        />
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-border bg-muted/30">
                        <div className="flex-1">
                          <p className="text-sm font-medium">PAN Card</p>
                          <p className="text-xs text-muted-foreground">Image or PDF</p>
                        </div>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => setPanFile(e.target.files?.[0] || null)}
                          className="w-auto text-xs h-9"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground bg-accent/50 p-3 rounded-xl">
                    📋 Documents will be verified by admin before account activation
                  </p>

                  <Button type="submit" className="w-full h-12 rounded-xl" size="lg">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
