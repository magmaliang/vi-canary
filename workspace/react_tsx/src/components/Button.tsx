import React, { MouseEventHandler } from "react";

interface IButton {
  label: string,
  onClick: MouseEventHandler
}

export default class Button extends React.Component<IButton> {
  render() {
    return <div className="button" onClick={this.props.onClick}>
      {this.props.label}
    </div>
  }
}