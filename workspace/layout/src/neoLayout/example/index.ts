let headerBar = {
  "type": "NlGrid",
  "name": "neoLayoutDemoHeader",
  "status": "render",
  "gridClassName": "neo-layout-container",
  "gap": "3px",
  "cells": [
    {
      "x": 1,
      "y": 1,
      "w": 1,
      "h": 1,
      "align": "center",
      "valign": "middle",
      "cmp": {
        "actionType": "reload",
        "target": "neoGridLayoutX?cmd=setStatus&data=render",
        "type": "button",
        "label": "渲染态"
      }
    }, {
      "x": 2,
      "y": 1,
      "w": 1,
      "h": 1,
      "align": "center",
      "valign": "middle",
      "cmp": {
        "type": "button",
        "actionType": "reload",
        "target": "neoGridLayoutX?cmd=setStatus&data=design",
        "label": "设计态"
      }
    }, {
      "x": 3,
      "y": 1,
      "w": 1,
      "h": 1,
      "align": "center",
      "valign": "middle",
      "cmp": {
        "type": "button",
        "actionType": "reload",
        "target": "neoGridLayoutX?cmd=addNeWContainer",
        "label": "创建新的容器"
      }
    }, {
      "x": 4,
      "y": 1,
      "w": 2,
      "h": 1,
      "align": "center",
      "valign": "middle",
      "cmp": {
        "type": "button",
        "actionType": "reload",
        "target": "neoGridLayoutX?cmd=displaySchema",
        "label": "显示当前json schema"
      }
    },{
      "x": 9,
      "y": 1,
      "w": 2,
      "h": 1,
      "align": "center",
      "valign": "middle",
      "cmp": {
        "type": "button",
        "actionType": "reload",
        "target": "neoGridLayoutX?cmd=saveJsonToFocused",
        "label": "同步json到选中组件"
      }
    }
  ]
}

let content = {
  "name": "neoGridLayoutX",
  "type": "NlGrid",
  "status": "design",
  "cols": 12,
  "rows": 10,
  "gap": "1px",
  // 替换、增量和删除的规则
  "cells": [
    {
      "x": 1,
      "y": 1,
      "w": 1,
      "h": 1,
      "editable": false,
      "style": {
        "overflow": "scroll",
        "zIndex": 100,
      },
      // "disabled": true,
      "tpl": 'a',
      // 组件schema
      "cmp": {
        "gridClassName": "neo-layout-grid-item",
        "name": "b",
        "type": "button",
        // "height": "50vh",
        "withOrder": true,
        "rowData": [
          {},
          {},
          {}
        ],
        "columns": [
          {
            "label": "ab",
            "name": "a",
            "type": "TextInput",
            "disableDefaultValue": true
          },
          {
            "label": "b",
            "name": "b",
            "type": "TextInput",
            "disableDefaultValue": true
          }
        ]
      }
    },
    {
      "x": 6,
      "y": 2,
      "w": 1,
      "h": 1,
      "cmp": {
        "name": 'b', 
        "type": 'tpl',
        "tpl": 'b'
      }
    }
  ]
}

let schema = {
  "type": "page",
  "data" : {
    xxx: 123
  },
  // 直接使用布局
  "body": [headerBar, {
    "type": "html",
    "html": "<br/>"
  }, content]
}

export {schema as commonSchema}