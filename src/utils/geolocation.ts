// Get device location, first trying GPS, and then falling back to IP-based geolocation
export const getDeviceLocation = async (): Promise<[number, number] | null> => {
  if (navigator.geolocation) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
      );
      return [position.coords.latitude, position.coords.longitude];
    } catch (error) {
      console.warn('GPS location error:', (error as GeolocationPositionError).message);
      return null
    }
  }
  console.warn('Unable to get device location by GPS');
  return null;
};