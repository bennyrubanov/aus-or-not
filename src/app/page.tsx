'use client'

import { useEffect, useState } from 'react';
import { Button } from '@radix-ui/themes';

const LocationChecker = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [isInAustralia, setIsInAustralia] = useState(false);
    const [checkingLocation, setCheckingLocation] = useState(false);

    useEffect(() => {
        if (location) {
            checkIfInAustralia(location.latitude, location.longitude);
        }
    }, [location]); // Re-run this effect if location changes

    const getLocation = () => {
        if (navigator.geolocation) {
            setCheckingLocation(true);
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const showPosition = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
    };

    const showError = (error: GeolocationPositionError) => {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            default:
                alert("An unknown error occurred.");
                break;
        }
        setCheckingLocation(false);
    };

    const checkIfInAustralia = async (lat: number, lon: number) => {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'aus-or-not'
                }
            });
            const data = await response.json();
            const country = data.address?.country;
            setIsInAustralia(country === "Australia");
        } finally {
            setCheckingLocation(false);
        }
    };

    return (
      <div className="flex justify-center items-center h-screen">
          <div>
              <h2>Do you know if you're in Australia? <Button onClick={getLocation} className="cursor-pointer">Find out!</Button></h2>
              {checkingLocation ? (
                  <p>Fetching location...</p>
              ) : location ? (
                  <p>Your location: <a href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`} target="_blank" className='underline'>Latitude: {location.latitude}, Longitude: {location.longitude}</a></p>
              ) : (
                  <p>Click the button to fetch location.</p>
              )}
              {location && !checkingLocation && (isInAustralia ? <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '24px' }}>You are in Australia!</p> : <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '24px' }}>You are not in Australia.</p>)}
          </div>
      </div>
  );
};
export default LocationChecker;