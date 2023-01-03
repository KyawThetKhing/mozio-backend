function haversine(point1, point2) {
  // distance between latitudes
  // and longitudes
  let dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180.0;
  let dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180.0;

  // convert to radiansa
  let p1Latitude = (point1.latitude * Math.PI) / 180.0;
  let p2Latitude = (point2.latitude * Math.PI) / 180.0;

  // apply formulae
  let a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLon / 2), 2) *
      Math.cos(p1Latitude) *
      Math.cos(p2Latitude);
  let rad = 6371;
  let c = 2 * Math.asin(Math.sqrt(a));
  return rad * c;
}
module.exports = haversine;
