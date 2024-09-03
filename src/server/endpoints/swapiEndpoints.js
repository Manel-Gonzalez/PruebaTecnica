const express = require("express");
const Planet = require("../../app/Planet/Planet"); // Adjust the path as necessary
const {peopleFactory} = require("../../app/People/index");

const server = express();

const _isWookieeFormat = (req) => {
  if (req.query.format && req.query.format == "wookiee") {
    return true;
  }
  return false;
};

const applySwapiEndpoints = (server, app) => {
  server.get("/hfswapi/test", async (req, res) => {
    const data = await app.swapiFunctions.genericRequest(
      "https://swapi.py4e.com/api/",
      "GET",
      null,
      true
    );
    res.send(data);
  });

  server.get("/hfswapi/getPeople/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const format = _isWookieeFormat(req) ? "wookiee" : "common";
      const person = await peopleFactory(id, format);

      const response = {
        id: person.getId(),
        name: person.getName(),
        mass: person.getMass(),
        height: person.getHeight(),
        homeworldName: person.getHomeworldName(),
        homeworlId: person.getHomeworlId(),
      };

      res.json(response);
    } catch (error) {
      res.sendStatus(501).json({error: "Failed to fetch planet data"});
    }
  });

  server.get("/hfswapi/getPlanet/:id", async (req, res) => {
    const planetId = req.params.id;
    const planet = new Planet(planetId);

    try {
      await planet.init();
      res.json({
        id: planet.id,
        name: planet.getName(),
        gravity: planet.getGravity(),
      });
    } catch (error) {
      res.status(501).json({error: "Failed to fetch planet data"});
    }
  });

  server.get("/hfswapi/getWeightOnPlanetRandom", async (req, res) => {
    res.sendStatus(501);
  });

  server.get("/hfswapi/getLogs", async (req, res) => {
    const data = await app.db.logging.findAll();
    res.send(data);
  });
};

module.exports = applySwapiEndpoints;
