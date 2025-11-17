import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LocationData {
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  address?: string;
  pincode?: string;
}

interface LocationPickerProps {
  location: LocationData;
  onChange: (location: LocationData) => void;
}

export const LocationPicker = ({ location, onChange }: LocationPickerProps) => {
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = () => {
    setIsDetecting(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding API (example with OpenStreetMap Nominatim)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          onChange({
            latitude,
            longitude,
            city: data.address?.city || data.address?.town || data.address?.village || "",
            state: data.address?.state || "",
            address: data.display_name || "",
            pincode: data.address?.postcode || "",
          });
          
          toast.success("Location detected successfully");
        } catch (error) {
          toast.error("Failed to fetch location details");
          onChange({ latitude, longitude });
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        toast.error("Failed to detect location: " + error.message);
        setIsDetecting(false);
      }
    );
  };

  return (
    <Card className="border-border">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Location</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={detectLocation}
            disabled={isDetecting}
          >
            {isDetecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Detecting...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Auto Detect
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={location.city || ""}
              onChange={(e) => onChange({ ...location, city: e.target.value })}
              placeholder="Enter city"
            />
          </div>
          
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={location.state || ""}
              onChange={(e) => onChange({ ...location, state: e.target.value })}
              placeholder="Enter state"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Full Address</Label>
          <Input
            id="address"
            value={location.address || ""}
            onChange={(e) => onChange({ ...location, address: e.target.value })}
            placeholder="Enter full address"
          />
        </div>

        <div>
          <Label htmlFor="pincode">Pincode</Label>
          <Input
            id="pincode"
            value={location.pincode || ""}
            onChange={(e) => onChange({ ...location, pincode: e.target.value })}
            placeholder="Enter pincode"
          />
        </div>

        {location.latitude && location.longitude && (
          <div className="text-xs text-muted-foreground">
            Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
