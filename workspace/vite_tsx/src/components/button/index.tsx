import React,{ Component } from "react";
import "./index.scss"

interface IButton {
  /**
   * button's name
   */
  name: string
  /**
   * when button clicked
   */
  onClick: (params: any) => void
}

export class Button extends Component<IButton> {
  render() {
    let {name, onClick} = this.props;
    return <div className="my-button" onClick={onClick}>{name}</div>
  }
}