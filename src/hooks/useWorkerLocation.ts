import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface LocationState {
  isTracking: boolean;
  error: string | null;
  latitude: number | null;
  longitude: number | null;
}

export const useWorkerLocation = (enabled: boolean) => {
  const [locationState, setLocationState] = useState<LocationState>({
    isTracking: false,
    error: null,
    latitude: null,
    longitude: null,
  });
  
  const watchIdRef = useRef<number | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendLocationToBackend = async (latitude: number, longitude: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8080/api/worker/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (!response.ok) {
        console.error('Failed to update location');
      }
    } catch (error) {
      console.error('Error sending location:', error);
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      const error = 'Geolocation is not supported by your browser';
      setLocationState(prev => ({ ...prev, error, isTracking: false }));
      toast.error(error);
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        setLocationState({
          isTracking: true,
          error: null,
          latitude,
          longitude,
        });

        sendLocationToBackend(latitude, longitude);
        
        // Clear any pending retry
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location access required for receiving job requests nearby.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information unavailable';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timed out';
        }

        setLocationState(prev => ({
          ...prev,
          error: errorMessage,
          isTracking: false,
        }));

        toast.error(errorMessage);

        // Retry after 10 seconds
        retryTimeoutRef.current = setTimeout(() => {
          console.log('Retrying location tracking...');
          startTracking();
        }, 10000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    setLocationState({
      isTracking: false,
      error: null,
      latitude: null,
      longitude: null,
    });
  };

  useEffect(() => {
    if (enabled) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [enabled]);

  return locationState;
};
