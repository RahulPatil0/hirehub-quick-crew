import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Users, DollarSign, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const HireLabour = () => {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [numberOfWorkers, setNumberOfWorkers] = useState("1");
  const [duration, setDuration] = useState("4");
  const [skillType, setSkillType] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");

  const [nearbyLabourers] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      skill: "Masonry",
      distance: "1.2 km",
      rating: 4.8,
      verified: true,
      available: true,
    },
    {
      id: 2,
      name: "Mohammed Ali",
      skill: "Painting",
      distance: "2.5 km",
      rating: 4.9,
      verified: true,
      available: true,
    },
    {
      id: 3,
      name: "Suresh Patil",
      skill: "General Labor",
      distance: "3.1 km",
      rating: 4.7,
      verified: true,
      available: true,
    },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skillType || !budget || !location) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Searching for nearby workers...");
    setShowResults(true);
  };

  const handleSendRequest = (labourer: any) => {
    toast.success(`Hire request sent to ${labourer.name}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/owner-dashboard")}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">HireHub</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hire Daily Labour</h1>
          <p className="text-muted-foreground">
            Find verified workers near you for short-term tasks
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Search Form */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Job Requirements</CardTitle>
              <CardDescription>Fill in the details to find suitable workers</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="workers">Number of Labourers Required</Label>
                  <Input
                    id="workers"
                    type="number"
                    min="1"
                    value={numberOfWorkers}
                    onChange={(e) => setNumberOfWorkers(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skill">Skill Type</Label>
                  <Select value={skillType} onValueChange={setSkillType} required>
                    <SelectTrigger id="skill">
                      <SelectValue placeholder="Select skill type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masonry">Masonry</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="loading">Shifting/Loading</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="general">General Labor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="Enter location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                    <Button type="button" variant="outline" size="icon">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget per Worker (₹/hour)</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    placeholder="Enter budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Users className="mr-2" />
                  Find Labour Near Me
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle>
                  {showResults ? "Available Workers Nearby" : "Search to Find Workers"}
                </CardTitle>
                <CardDescription>
                  {showResults
                    ? `${nearbyLabourers.length} verified workers found in your area`
                    : "Fill the form and click search to see available workers"}
                </CardDescription>
              </CardHeader>
            <CardContent>
              {showResults ? (
                <div className="space-y-4">
                  {nearbyLabourers.map((labourer) => (
                    <div
                      key={labourer.id}
                      className="p-4 border-2 border-border rounded-lg hover:border-primary transition-all hover:shadow-md"
                    >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{labourer.name}</h3>
                              {labourer.verified && (
                                <CheckCircle className="h-4 w-4 text-success" />
                              )}
                            </div>
                            <Badge variant="secondary" className="mb-2">
                              {labourer.skill}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary">
                              ⭐ {labourer.rating}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4" />
                          <span>{labourer.distance} away</span>
                        </div>

                        <Button
                          variant="success"
                          size="sm"
                          className="w-full"
                          onClick={() => handleSendRequest(labourer)}
                        >
                          Send Hire Request
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No Workers Found</p>
                    <p className="text-muted-foreground">
                      Fill in the form and click search to find available workers in your area.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HireLabour;
