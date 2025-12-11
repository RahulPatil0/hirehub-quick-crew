import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  Briefcase,
  Activity,
  CheckCircle,
  Clock,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkers: 0,
    totalOwners: 0,
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });

  const [chartData, setChartData] = useState({
    userGrowth: [] as any[],
    jobsByCategory: [] as any[],
    applicationTrends: [] as any[],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const statsResponse = await fetch("http://localhost:8080/api/admin/analytics/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      const chartsResponse = await fetch("http://localhost:8080/api/admin/analytics/charts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (chartsResponse.ok) {
        const chartsData = await chartsResponse.json();
        setChartData(chartsData);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Use mock data for development
      setStats({
        totalUsers: 1250,
        totalWorkers: 850,
        totalOwners: 400,
        totalJobs: 320,
        activeJobs: 145,
        completedJobs: 175,
        totalApplications: 2840,
        pendingApplications: 420,
      });

      setChartData({
        userGrowth: [
          { month: "Jan", workers: 120, owners: 45 },
          { month: "Feb", workers: 180, owners: 65 },
          { month: "Mar", workers: 240, owners: 85 },
          { month: "Apr", workers: 310, owners: 110 },
          { month: "May", workers: 420, owners: 145 },
          { month: "Jun", workers: 550, owners: 190 },
          { month: "Jul", workers: 680, owners: 240 },
          { month: "Aug", workers: 850, owners: 400 },
        ],
        jobsByCategory: [
          { name: "Construction", value: 85 },
          { name: "Manufacturing", value: 62 },
          { name: "Agriculture", value: 48 },
          { name: "Logistics", value: 55 },
          { name: "Others", value: 70 },
        ],
        applicationTrends: [
          { week: "Week 1", applications: 245 },
          { week: "Week 2", applications: 312 },
          { week: "Week 3", applications: 385 },
          { week: "Week 4", applications: 428 },
        ],
      });
    }
  };

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--success))", "hsl(var(--destructive))", "hsl(var(--accent))"];

  const StatCard = ({ icon: Icon, title, value, trend, color }: any) => (
    <Card className="shadow-soft hover:shadow-medium transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
            {trend && (
              <p className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-4 rounded-xl bg-${color}/10`}>
            <Icon className={`h-8 w-8 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <PageHeader title="Analytics Dashboard" showBack backTo="/admin/dashboard" />

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">Platform insights and performance metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="animate-fade-in">
            <StatCard icon={Users} title="Total Users" value={stats.totalUsers} trend="+12.5% this month" color="primary" />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <StatCard icon={Briefcase} title="Total Jobs" value={stats.totalJobs} trend="+8.2% this month" color="secondary" />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <StatCard icon={CheckCircle} title="Completed Jobs" value={stats.completedJobs} trend="+15.3% this month" color="success" />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <StatCard icon={Clock} title="Pending Apps" value={stats.pendingApplications} trend="-3.1% this month" color="destructive" />
          </div>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="users" className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Growth</TabsTrigger>
            <TabsTrigger value="jobs">Job Distribution</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="workers" stroke="hsl(var(--primary))" strokeWidth={2} name="Workers" />
                    <Line type="monotone" dataKey="owners" stroke="hsl(var(--secondary))" strokeWidth={2} name="Owners" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Jobs by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={chartData.jobsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.jobsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Job Status Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Active Jobs</p>
                        <p className="text-sm text-muted-foreground">Currently hiring</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-primary">{stats.activeJobs}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-success/10">
                        <CheckCircle className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="font-semibold">Completed Jobs</p>
                        <p className="text-sm text-muted-foreground">Successfully filled</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-success">{stats.completedJobs}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary/10">
                        <Briefcase className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">Total Jobs</p>
                        <p className="text-sm text-muted-foreground">All time</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{stats.totalJobs}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData.applicationTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="applications" fill="hsl(var(--primary))" name="Applications" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <Card className="shadow-soft animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="text-lg">User Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Workers</span>
                <span className="font-semibold">{stats.totalWorkers}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all"
                  style={{ width: `${(stats.totalWorkers / stats.totalUsers) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Owners</span>
                <span className="font-semibold">{stats.totalOwners}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-secondary h-2.5 rounded-full transition-all"
                  style={{ width: `${(stats.totalOwners / stats.totalUsers) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="text-lg">Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Applications</span>
                <span className="font-semibold">{stats.totalApplications}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Review</span>
                <span className="font-semibold text-destructive">{stats.pendingApplications}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Processed</span>
                <span className="font-semibold text-success">
                  {stats.totalApplications - stats.pendingApplications}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <CardHeader>
              <CardTitle className="text-lg">Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="font-semibold text-success">94.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Response Time</span>
                <span className="font-semibold">2.4 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">User Satisfaction</span>
                <span className="font-semibold text-primary">4.7/5.0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
