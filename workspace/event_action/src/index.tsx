/**
 * 演示事件体系的全部能力
 */

import React from "react";
import { createRoot } from 'react-dom/client';
 
import {
  RendererAction,
  ListenerContext,
  registerAction,
  Renderer,
  render
} from 'amis';


/**
 * 洋葱模型全能事件注解
 * 会触发同名Event，且执行props上传过来的同名方法
 * @param target 
 * @param key 
 * @param descriptor 
 * @returns 
 */
export function neoOnionEvent(target, key, descriptor) {
  let _originVal = target[key]

  descriptor.value = function (...args) {
    const  _outerHandler = this.props[key]
     // 事件的触发在props上的调度完成之后
     if (this.props?.dispatchEvent) {
      setTimeout(() => {
        this.props.dispatchEvent(key, ...args)
      })
    } 

    // 没有传入onXxx，不做更改
    if(!_outerHandler) {
      return _originVal.apply(this, args)
    }

    // 否则，将原始函数参数直接绑定成新函数以next的方式传入后续函数
    _outerHandler.apply(this, [_originVal.bind(this, ...args), ...args])
  }

  return descriptor
}

 
 
// 自定义一个action
export class ConsoleAction implements RendererAction {
  async run(
    action: any,
    renderer: ListenerContext,
    event: any
  ) {
    console.log('testAction:', action.args)
  }
}
registerAction('testAction', new ConsoleAction());
 

// 组件定义
@Renderer({
  test: /(^|\/)DemoCmp$/,
  name: 'DemoCmp',
})
class DemoCmp extends React.Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  render() {
    return <button onClick={this.onClick}>点我触发自定义事件</button>
  }


  /**
   * 使用注解，让onClick同时支持外层api扩展、amis action扩展，以及控制它们之间的调度关系
   * 但是对于组件内部使用的地方来说，它只会调一个this.onClick
   */
  @neoOnionEvent
  onClick(e) {
    console.log('组件内函数调用', e)
  }
}
 

/**
 * 面向使用者的视角的开发代码
 * 事件的定义在别的地方
 */
var schema = {
  "type": "page",
  "data": {
    "name": "lll"
  },
  "body": [
    {
      "type": "DemoCmp",
      "id": "b_001",
      "label": "自定义事件",
      "level": "primary",
      // 此处仅是为了兼容已有的扩展， 主要是Nxt和业务线的扩展
      "onClick": function(next, ...args){
        console.log('外部传入扩展先执行')
        next()
      },
      // onEvent表达的是，当xxxEvent触发时，使用什么action去响应
      "onEvent": {
        // 事件名
        "onClick": { 
          // 响应的 action,handler,function的数组
          "pipe": "race/line",
          "actions": [ 
            {
              "actionType": "testAction",
              "weight" : 1,
              // 此处是payload, 在[testAction]的响应中可以取到，而在内部dispatch的时候也会携带事件
              "args": {
                "description": "look at me. the following field 'var' get the name from page.data",
                "mark": "这只是一个测试，不用那么认真！",
                "var": "${name}"
              },
            }
          ]
        }
      }
    },
  ]
}
 
const App = ()=>render(schema)

const container = document.getElementById('app-container');
const root = createRoot(container);
root.render(<App></App>);

