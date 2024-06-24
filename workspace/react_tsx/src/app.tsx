//@ts-nocheck
import React from 'react';
import Button from "./components/Button";
import { queryString2Data } from "@utils/index";

import {observer, inject} from 'mobx-react'

import { observable } from 'mobx';

import {store, storex} from './store'

@observer
export default class App extends React.Component {

  @observable xx = 0

  state = {
    a:1
  }

  render(): React.ReactNode {
    console.log(storex.count)
    return<>
      <Button
        label={`button ${this.xx}`}
        onClick={this.onClick}
      ></Button>
      <p>{store.count}</p>
      <p>{this.xx}</p>
    </> 
  }

  onClick = () => {
    store.plus()
    this.xx++;
    console.log(store.count)
  }

  constructor(props){
    super(props)


    setTimeout(() => {
      store.plus()
    }, 5000)
  }
}




