import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  ArrowLeft,
  TrendingUp,
  Users,
  Briefcase,
  Activity,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

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

      // Fetch overall statistics
      const statsResponse = await fetch("http://localhost:8080/api/admin/analytics/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch chart data
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

  const COLORS = ["#0EA5E9", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"];

  const StatCard = ({ icon: Icon, title, value, trend, color }: any) => (
    <Card className="border-primary/20 shadow-soft hover:shadow-medium transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-4 rounded-full bg-${color}/10`}>
            <Icon className={`h-8 w-8 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold">Analytics Dashboard</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            trend="+12.5% this month"
            color="primary"
          />
          <StatCard
            icon={Briefcase}
            title="Total Jobs"
            value={stats.totalJobs}
            trend="+8.2% this month"
            color="secondary"
          />
          <StatCard
            icon={CheckCircle}
            title="Completed Jobs"
            value={stats.completedJobs}
            trend="+15.3% this month"
            color="success"
          />
          <StatCard
            icon={Clock}
            title="Pending Applications"
            value={stats.pendingApplications}
            trend="-3.1% this month"
            color="destructive"
          />
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Growth</TabsTrigger>
            <TabsTrigger value="jobs">Job Distribution</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-primary/20 shadow-soft">
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="workers"
                      stroke="#0EA5E9"
                      strokeWidth={2}
                      name="Workers"
                    />
                    <Line
                      type="monotone"
                      dataKey="owners"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      name="Owners"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-primary/20 shadow-soft">
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
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
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

              <Card className="border-primary/20 shadow-soft">
                <CardHeader>
                  <CardTitle>Job Status Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Active Jobs</p>
                        <p className="text-sm text-muted-foreground">Currently hiring</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-primary">{stats.activeJobs}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-success/10">
                        <CheckCircle className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="font-semibold">Completed Jobs</p>
                        <p className="text-sm text-muted-foreground">Successfully filled</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-success">{stats.completedJobs}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-secondary/10">
                        <Briefcase className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold">Total Jobs</p>
                        <p className="text-sm text-muted-foreground">All time</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-secondary">{stats.totalJobs}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="border-primary/20 shadow-soft">
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData.applicationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="applications" fill="#0EA5E9" name="Applications" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <Card className="border-primary/20 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">User Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Workers</span>
                <span className="font-semibold">{stats.totalWorkers}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(stats.totalWorkers / stats.totalUsers) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Owners</span>
                <span className="font-semibold">{stats.totalOwners}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full"
                  style={{ width: `${(stats.totalOwners / stats.totalUsers) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-soft">
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
                <span className="font-semibold text-destructive">
                  {stats.pendingApplications}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Processed</span>
                <span className="font-semibold text-success">
                  {stats.totalApplications - stats.pendingApplications}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-soft">
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
