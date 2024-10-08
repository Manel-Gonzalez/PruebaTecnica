const AbstractPeople = require("./abstractPeople");

class CommonPeople extends AbstractPeople {
  constructor(id) {
    super(id);
    this.id = id;
  }

  async init() {
    await super.init();
  }
}

module.exports = CommonPeople;
