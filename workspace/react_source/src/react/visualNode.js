/**
 * create visual canvas node for react fiber node
 * use native js to avoid misunderstanding of react source code
 */

/**
 * a visible avatar for react fiber node
 * defined as a web-component
 */
class FiberNodeElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

}

class FiberPainter {
  rootNode = null;
  constructor(props) {
    this.props = props;
  }

  paintNode(fiberNode) { 
    var block = document.createElement("div", )
  }
}