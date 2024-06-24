import React from 'react';
import { render } from "react-dom";
import { configure } from "mobx";
configure({isolateGlobalState: true})
import { Counter } from './cmps/counter'
import "./app.scss";

export default class App extends React.Component {
  render() {
    return <div>
      <Counter></Counter>
    </div>
  }
}

const container = document.querySelector("#container")

render(<App></App>, container)