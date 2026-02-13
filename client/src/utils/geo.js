/**
 * Get user's current geolocation using the browser API.
 * Returns a Promise that resolves to { latitude, longitude }
 * or null if permission denied / not available.
 */
export function getCurrentPosition() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => resolve(null), // silently resolve null on denial
      { timeout: 8000 }
    );
  });
}
