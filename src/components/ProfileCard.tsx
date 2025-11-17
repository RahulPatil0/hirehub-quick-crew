import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Briefcase, Award } from "lucide-react";

interface ProfileCardProps {
  profile: {
    name: string;
    email: string;
    phone?: string;
    skills?: string[] | string;
    experience?: string;
    location?: string;
    city?: string;
    state?: string;
    status?: string;
    businessType?: string;
  };
  type: "worker" | "owner";
}

export const ProfileCard = ({ profile, type }: ProfileCardProps) => {
  const displaySkills = Array.isArray(profile.skills) 
    ? profile.skills 
    : profile.skills 
    ? [profile.skills] 
    : [];

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {type === "worker" ? "Worker Profile" : "Business Profile"}
          </CardTitle>
          {profile.status && (
            <Badge
              variant={profile.status.toLowerCase() === "active" ? "default" : "secondary"}
            >
              {profile.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{profile.name}</h3>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 text-primary" />
            <span>{profile.email}</span>
          </div>

          {profile.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" />
              <span>{profile.phone}</span>
            </div>
          )}

          {(profile.location || profile.city) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>
                {profile.location || `${profile.city}${profile.state ? `, ${profile.state}` : ""}`}
              </span>
            </div>
          )}

          {profile.businessType && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4 text-primary" />
              <span>{profile.businessType}</span>
            </div>
          )}

          {profile.experience && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4 text-primary" />
              <span>{profile.experience} experience</span>
            </div>
          )}
        </div>

        {displaySkills.length > 0 && (
          <div className="pt-2">
            <p className="text-sm font-medium mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {displaySkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
