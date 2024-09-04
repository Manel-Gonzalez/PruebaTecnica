const fetch = require("node-fetch");

class AbstractPeople {
  constructor(id) {
    if (this.constructor == AbstractPeople) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.id = id;
  }

  async init() {
    try {
      const data = await this.fetchPeopleData(this.id);
      this.name = data.name;
      this.mass = data.mass;
      this.height = data.height;
      this.homeworldName = data.homeworldName;
      this.homeworlId = data.homeworlId;
    } catch (error) {
      console.error("Failed to initialize person:", error);
    }
  }

  async fetchPeopleData(id) {
    const url = `https://swapi.py4e.com/api/people/${id}/`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const homeworldResponse = await fetch(data.homeworld);
      const homeworldData = await homeworldResponse.json();
      return {
        name: data.name,
        mass: data.mass,
        height: data.height,
        homeworldName: homeworldData.name,
        homeworlId: this.extractIdFromUrl(data.homeworld),
      };
    } catch (error) {
      console.error("Failed to fetch people data:", error);
      throw error;
    }
  }

  extractIdFromUrl(url) {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? matches[1] : null;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getMass() {
    return this.mass;
  }

  getHeight() {
    return this.height;
  }

  getHomeworldName() {
    return this.homeworldName;
  }

  getHomeworlId() {
    return this.homeworlId;
  }

  getWeightOnPlanet(mass, gravity) {
    const weight = parseFloat(mass);
    const g = parseFloat(gravity.split(" ")[0]);
    return weight * g;
  }
}

module.exports = AbstractPeople;
