import { useState, useEffect } from "react";

const useGeolocation = () => {
  const [location, setLocation] = useState<LocationState>({
    loaded: false,
    coordinates: { lat: "", lng: "" },
    error: null,
  });

  interface Coordinates {
    lat: string | number;
    lng: string | number;
  }

  interface LocationState {
    loaded: boolean;
    coordinates: Coordinates;
    error: GeolocationPositionError | { code: number; message: string } | null;
  }

  const onSuccess = (position: GeolocationPosition) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      error: null,
    });
  };

  interface GeolocationError {
    code: number;
    message: string;
  }

  const onError = (error: GeolocationPositionError | GeolocationError) => {
    setLocation({
      loaded: true,
      coordinates: { lat: "", lng: "" },
      error,
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation((prevState) => ({
        ...prevState,
        loaded: true,
        error: {
          code: 0,
          message: "Geolocation not supported",
        },
      }));
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  }, []);

  return location;
};

export default useGeolocation;
