/**
 * 自定义一个九宫格布局
 * 底层使用栅格布局实现： 因此用户开发此布局时仅需要根据外层props的 {top, left, right, content, bottom}构建出栅格的json即可
 * 
 * 栅格本身就提供强大的自由布局系统，完全不需要用户实现其他功能。
 * 
 * 当开发出布局设计器的时候，这个默认布局的json本身都可以通过设计生成
 */
import React, {Component} from "react";
import { Renderer, Schema } from "amis";

let defaultLayoutSchema = {
  "type": "NlGrid",
  "name": "nineGrid",
  "status": "render",
  "gridClassName": "nine-grid",
  "gap": "3px",
  "cols": ["100px", "auto", "100px"],
  "rows": ["50px", "auto", "50px"],
  "cells": [
    {
      "x": 2,
      "y": 1,
      "w": 1,
      "h": 1,
      "name": "top",
      "align": "center",
      "valign": "middle",
      "cmp": {
        "type": "tpl",
        "tpl": "top"
      }
    }, {
      "x": 2,
      "y": 2,
      "w": 1,
      "h": 1,
      "name": "center",
      "align": "stretch",
      "valign": "middle",
      "cmp": {
        "type": "tpl",
        "tpl": "center"
      }
    }, {
      "x": 1,
      "y": 2,
      "w": 1,
      "h": 1,
      "align": "center",
      "valign": "middle",
      "cmp": {
        "type": "tpl",
        "tpl": "left"
      }
    }, {
      "x": 2,
      "y": 3,
      "w": 1,
      "h": 1,
      "name": "bottom",
      "align": "center",
      "valign": "middle",
      // "visible": false
      "cmp": {
        "type": "tpl",
        "tpl": "bottom"
      }
    }, {
      "x": 3,
      "y": 2,
      "w": 1,
      "h": 1,
      "name": "right",
      "align": "center",
      "valign": "middle",
      "cmp": {
        "type": "tpl",
        "tpl": "right"
      }
    }
  ]
}


interface INineGridProps {
  top: Schema,
  left: Schema,
  right: Schema,
  content: Schema,
  bottom: Schema,
  render: any
}


@Renderer({
  test: /(^|\/)nineGrid$/,
  name: 'nineGrid'
})
export class nineGridLayout extends Component<INineGridProps> {
  constructor(props) {
    super(props)
  }
  genNineGridLayout() {
    let {top, left, right, content, bottom} = this.props;
    let {cols, rows} = defaultLayoutSchema;
    let cells = defaultLayoutSchema.cells;
    if (top) {
      let cel = cells.find(x => x.name === 'top')
      cel.cmp = top;
    }
    if (left) {
      let cel = cells.find(x => x.name === 'left')
      cel.cmp = left;
    }
    if (right) {
      let cel = cells.find(x => x.name === 'right')
      cel.cmp = right;
    }
    if (content) {
      let cel = cells.find(x => x.name === 'center')
      cel.cmp = content;
    }
    if (bottom) {
      let cel = cells.find(x => x.name === 'bottom')
      cel.cmp = bottom;
    }

    return {
      ...defaultLayoutSchema,
      cols,
      rows,
      cells
    }
  }

  render() {
    return this.props.render("nineGridLayout", this.genNineGridLayout());
  }
}