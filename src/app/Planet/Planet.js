const fetch = require("node-fetch");

class Planet {
  constructor(id) {
    this.id = id;
    this.name = null;
    this.gravity = null;
  }

  async init() {
    try {
      const data = await this.fetchPlanetData(this.id);
      this.name = data.name;
      this.gravity = data.gravity;
    } catch (error) {
      console.error("Failed to initialize planet:", error);
    }
  }

  async fetchPlanetData(id) {
    const url = `https://swapi.py4e.com/api/planets/${id}/`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        name: data.name,
        gravity: data.gravity,
      };
    } catch (error) {
      console.error("Failed to fetch planet data:", error);
      throw error;
    }
  }

  getName() {
    return this.name;
  }

  getGravity() {
    return this.gravity;
  }
}

module.exports = Planet;
