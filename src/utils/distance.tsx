/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula. This formula accounts for the Earth's curvature. -Haversine formula
 *
 * @param {Object} point1 - The first point with latitude and longitude.
 * @param {number} point1.latitude - Latitude of the first point in degrees.
 * @param {number} point1.longitude - Longitude of the first point in degrees.
 * @param {Object} point2 - The second point with latitude and longitude.
 * @param {number} point2.latitude - Latitude of the second point in degrees.
 * @param {number} point2.longitude - Longitude of the second point in degrees.
 * @returns {number} - The distance between the two points in kilometers.
 */
export function haversineDistance(point1: { latitude: number; longitude: number }, point2: { latitude: number; longitude: number }): number {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const R = 6371; // Earth's radius in kilometers
    const lat1 = toRadians(point1.latitude);
    const lon1 = toRadians(point1.longitude);
    const lat2 = toRadians(point2.latitude);
    const lon2 = toRadians(point2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
}
