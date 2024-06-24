import React from "react";
import { observable, makeObservable, action } from "mobx"; 
import { observer } from "mobx-react";
import './counter.scss'

class CounterData {
  @observable accessor count = 0
  
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
  onChange = (e) => {
    console.log(e.target.value)
  }
  render() {
    return <div className="counter">
      <input type="text" value={counter.count} onChange={this.onChange}/>
      <button type="button" onClick={() => {counter.increase()}}>increase</button>
      <button type="button" onClick={() => {counter.decrease()}}>decrease</button>
    </div>
  }
}