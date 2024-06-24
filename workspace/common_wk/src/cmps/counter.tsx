import React from "react";
import { observable, makeObservable, action } from "mobx"; 
import { observer } from "mobx-react";

class CounterData {
  @observable count: number = 0
  
  @action
  increase(){
    this.count++;
  }

  @action
  decrease(){
    this.count--;
  }

  constructor() {
    makeObservable(this)
  }
}

var counter = new CounterData()

@observer
export class Counter extends React.Component {
  render() {
    return <div className="counter">
      <input type="text" value={counter.count} onChange={(e) => {
        console.log(e)
      }}/>
      <button type="button" onClick={() => {counter.increase()}}>increase</button>
      <button type="button" onClick={() => {counter.decrease()}}>decrease</button>
    </div>
  }
}