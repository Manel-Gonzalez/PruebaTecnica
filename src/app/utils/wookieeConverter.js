const convertToWookieeLang = (response) => {
  return {
    whrascwo: response.personName, // name
    rhahrcaoac_roworarc: response.personId, // id
    acwoahrracao: response.mass, // mass
    scracc: response.height, // height
    acooscwoohoorcanwa: response.homeworldName, // homeworldName
    oaanahscraaowo: response.homeworlId, // homeworlId
    whrascwo_akwoooakanwo: response.planetName, // planetName
    rhahrcaoac_roworarc_akwoooakanwo: response.planetId, // planetId
    oarcwooh: response.weightOnPlanet, // weightOnPlanet
    akwoooakanwo: response.gravity, // gravity
  };
};

module.exports = convertToWookieeLang;
