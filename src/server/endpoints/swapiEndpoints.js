const express = require("express");
const fetch = require("node-fetch");
const Planet = require("../../app/Planet/Planet"); // Adjust the path as necessary
const {peopleFactory} = require("../../app/People/index");
const convertToWookieeLang = require("../../app/utils/wookieeConverter");

const server = express();

const _isWookieeLang = (req) => req.query.lang === "wookiee";

const getRandomId = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomPlanetId = async () => {
  const response = await fetch("https://swapi.py4e.com/api/planets/");
  const data = await response.json();
  return getRandomId(1, data.count);
};

const getRandomPersonId = async () => {
  const response = await fetch("https://swapi.py4e.com/api/people/");
  const data = await response.json();
  return getRandomId(1, data.count);
};

const applySwapiEndpoints = (server, app) => {
  server.get("/hfswapi/test", async (req, res) => {
    try {
      const data = await app.swapiFunctions.genericRequest(
        "https://swapi.py4e.com/api/",
        "GET",
        null,
        true
      );
      res.send(data);
    } catch (error) {
      res.status(500).json({error: "Failed to fetch data"});
    }
  });

  server.get("/hfswapi/getPeople/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const person = await peopleFactory(id);

      const response = {
        personId: person.getId(),
        personName: person.getName(),
        mass: person.getMass(),
        height: person.getHeight(),
        homeworldName: person.getHomeworldName(),
        homeworlId: person.getHomeworlId(),
      };

      if (_isWookieeLang(req)) {
        res.json(convertToWookieeLang(response));
      } else {
        res.json(response);
      }
    } catch (error) {
      res.status(501).json({error: "Failed to fetch person data"});
    }
  });

  server.get("/hfswapi/getPlanet/:id", async (req, res) => {
    try {
      const planetId = req.params.id;
      const planet = new Planet(planetId);
      await planet.init();

      const response = {
        planetId: planet.id,
        planetName: planet.getName(),
        gravity: planet.getGravity(),
      };
      if (_isWookieeLang(req)) {
        res.json(convertToWookieeLang(response));
      } else {
        res.json(response);
      }
    } catch (error) {
      res.status(501).json({error: "Failed to fetch planet data"});
    }
  });

  server.get("/hfswapi/getWeightOnPlanetRandom", async (req, res) => {
    try {
      const randomPersonId = await getRandomPersonId();
      const person = await peopleFactory(randomPersonId);
      if (!person || !person.mass) {
        throw new Error("Failed to fetch person data or mass is missing");
      }

      const randomPlanetId = await getRandomPlanetId();
      const planet = new Planet(randomPlanetId);
      await planet.init();
      if (!planet || !planet.getGravity) {
        throw new Error("Failed to fetch planet data or gravity is missing");
      }

      let gravity = planet.getGravity();
      if (!gravity || gravity === "undefined" || gravity === "unknown") {
        gravity = "1 standard";
      }

      let weightOnPlanet;

      if (
        person.getMass() &&
        person.getMass() !== "undefined" &&
        person.getMass() !== "unknown"
      ) {
        weightOnPlanet = person.getWeightOnPlanet(person.getMass(), gravity);
      } else {
        weightOnPlanet = "The person weight is undefined";
      }

      const response = {
        personId: person.getId(),
        personName: person.getName(),
        planetId: planet.id,
        planetName: planet.getName(),
        weightOnPlanet: weightOnPlanet,
      };

      if (_isWookieeLang(req)) {
        res.json(convertToWookieeLang(response));
      } else {
        res.json(response);
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({error: error.message});
    }
  });

  server.get("/hfswapi/getLogs", async (req, res) => {
    const data = await app.db.logging.findAll();
    res.send(data);
  });
};

module.exports = applySwapiEndpoints;
