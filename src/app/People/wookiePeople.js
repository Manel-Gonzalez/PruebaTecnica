const AbstractPeople = require("./abstractPeople");

class WookieePeople extends AbstractPeople {
  constructor(id) {
    super(id);
    this.id = id;
  }

  async init() {
    await super.init();
  }
}

module.exports = WookieePeople;
