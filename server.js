const jsonServer = require("json-server");
const cors = require("cors"); // add this line

const server = jsonServer.create();
const haversine = require("./haversine-formula");
const cityObject = require("./db.json");
const listOfCities = cityObject.cities;

server.use(cors());

// Middleware to calculate the distance between multiple cities
const distanceBetweenMultiCitiesMiddleware = (req, res, next) => {
  const cities = req.query.cities;
  const cityArray = cities.split(",");
  let distance = 0;
  let resultObj = [];
  let totalDistance = 0;
  let errorCity = "Dijon";

  const isDijonContained = cityArray.some((c) => {
    return c.toLowerCase() === errorCity.toLowerCase();
  });
  if (!isDijonContained) {
    for (let i = 0; i < cityArray.length - 1; i++) {
      let tempCity1 = listOfCities.find((city) => {
        return city.name.toLowerCase() === cityArray[i].toLowerCase();
      });
      let tempCity2 = listOfCities.find((city) => {
        return city.name.toLowerCase() === cityArray[i + 1].toLowerCase();
      });
      distance = haversine(tempCity1, tempCity2);
      resultObj.push({
        originCity: tempCity1.name,
        destinationCity: tempCity2.name,
        distance: distance,
      });
    }
    const totalDistance = resultObj.reduce(
      (accumulator, currentCity) => accumulator + currentCity.distance,
      0
    );

    res.status(200).json({
      distances: resultObj,
      totalDistance: totalDistance,
    });
  } else {
    // manually return 500 error when Dijon city is included in calculate list
    res.status(500).json({
      error: "Dijon city is included",
    });
  }

  next();
};

// Middleware to calculate the distance between multiple cities
const getCitiesBySearch = (req, res, next) => {
  const name = req.query.name;

  if (name.toLowerCase() === "fail") {
    res.status(500).json({ message: "Invalid search keyword" });
  } else {
    if (name === undefined || name === "") {
      res.json({ cities: listOfCities });
    } else {
      const cities = listOfCities.filter((city) =>
        city.name.toLowerCase().includes(name.toLowerCase())
      );
      res.json({ cities });
    }
  }
};

server.get("/calculate-distances", distanceBetweenMultiCitiesMiddleware);

server.get("/cities", getCitiesBySearch);
const PORT = process.env.port || 3000;
server.listen(PORT, () => {
  console.log("JSON Server is running " + PORT);
});
