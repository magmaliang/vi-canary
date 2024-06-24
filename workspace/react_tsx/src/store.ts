import { observable, action } from "mobx";

class Store {
  @observable count = 0

  @action plus(){
    this.count = this.count + 1;
    console.log(this.count);
  }

  test = async () => {
    return 0
  }
}

class Storex extends Store {
  test = async () => {
    return await super.test() + 1;
  }
}

var store = new Store()


var storex = new Storex()

export {store, storex}


