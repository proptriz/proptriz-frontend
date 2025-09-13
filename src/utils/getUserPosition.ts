const getUserPosition = (): Promise<[number, number]> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      // Running on server or geolocation not supported → fallback to Nigeria
      resolve([9.0820, 8.6753]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve([latitude, longitude]);
      },
      () => {
        // Error (e.g., denied permission) → fallback to Nigeria
        resolve([9.0820, 8.6753]);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

export default getUserPosition;
