//@ts-ignore
import ST from "super-trace";
//@ts-ignore
window.SLog = ST;

import React from 'react';
import { render } from "react-dom";


import "./style.scss";

export default class App extends React.Component {
  state = {
    a:0
  }

  render(): React.ReactNode {
    return <button onClick={this.singleSetState}>{this.state.a}</button>
  }

  singleSetState = () => {
    console.log('-------- single SetState--------------------')
    this.setState({a: ++this.state.a})
  }

  multiSetState = () => {
    console.log('-------- multi SetState--------------------')
    let counter = this.state.a
    this.setState({a: ++counter})
    this.setState({a: ++counter})
  }

  // componentDidMount(): void {
  //   setTimeout(() => {
  //     this.setState({a: ++this.state.a})
  //   })
  // }
}

const container = document.querySelector("#container")

//@ts-ignore
window.jsxRenderTree = render(<App></App>, container)


const isNodeSimple =(node: any)=> {
	return (typeof node.type === "string") || node.type === null;
}

const traverse = (node: any) => {
	if (node.child) {
  	if (!isNodeSimple(node) && typeof node.child.type === "string") {
      node.child.stateNode.addEventListener('click', (ev:any) => {
        console.log('Clicked inside component: ',  node.updateQueue);
        ev.stopPropagation();
      });
      /* console.log('Set event listener for '+ node.type.name) */;
    }
    traverse(node.child);
  }
  node.sibling && traverse(node.sibling);
};

const findComponent = (node:any, name:any) => {
  	if (!isNodeSimple(node) && node.type.name === name) {
      console.log(':::===> Found node with name '+ node.type.name, node);
      
      if (node.child) {
      	let innerNode = node.child;
        console.log('Highlighting its inner nodes in yellow');
        
        highlightNode(node, true);
      }
    }
  node.child && findComponent(node.child, name);
  node.sibling && findComponent(node.sibling, name);
};

const highlightNode =(node: any, ignoreSibling=false) => {
	if (isNodeSimple(node)) {
  	node.stateNode.style.backgroundColor="yellow";
  } else {
  	node.child && highlightNode(node.child);
  }
  !ignoreSibling && node.sibling && highlightNode(node.sibling);
}

//@ts-ignore
// traverse(jsxRenderTree._reactInternalFiber);
//@ts-ignore
// findComponent(jsxRenderTree._reactInternalFiber, 'CompB');