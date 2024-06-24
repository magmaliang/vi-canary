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
    const  _outerHandler = this[key] || this._getActionByName(key) // 大写暂时没有处理
    // 没有传入onXxx，不做更改
    if(!_outerHandler) {
      return _originVal.apply(this, args)
    }

    // 否则，将原始函数参数直接绑定成新函数以next的方式传入后续函数
    _outerHandler.apply(this, [_originVal.bind(this, ...args), ...args])

    // 事件的触发在props上的调度完成之后
    if (this.props?.dispatchEvent) {
      this.props.dispatchEvent(key, ...args)
    } 
  }

  return descriptor
}

/**
 * 后事件注解
 * @param target 
 * @param key 
 * @param descriptor 
 * @returns 
 */
export function neoEventBefore(target, key, descriptor) {
  let _originVal = target[key]

  descriptor.value = function (...args) {
    const  _outerHandler = this._getActionByName(key) // 大写暂时没有处理
    // 没有传入onXxx，不做更改
    if(!_outerHandler) {
      return _originVal.apply(this, args)
    }
    // 先执行前事件
    _outerHandler.apply(this, args)
    _originVal.apply(this, args)
  }

  return descriptor
}


// 一个组件的定义
class Component {
  _actions = {}
  _getActionByName = (name) => {
    name = ("on" + name).toLowerCase();
    let actionName = Object.keys(this._actions||{}).find(x => x.toLowerCase() === name) 
    return this._actions[actionName]
  }

  constructor(options) {
    this._actions = options.actions
    this.reload("x","y", "z")
  }

  // 让 reload 函数支持事件扩展
  @neoOnionEvent
  reload(a, b, c) {
    console.log("reload", a, b, c)
  }

  // 隐藏next，让 sayHello 支持前事件
  @neoEventBefore
  sayHello(name) {
    console.log("hello: ", name)
  }
}

var cmp = new Component({
  // actions强制以onXxx起名，Xxx对应着组件内部的同名方法
  actions: {
    onReload(next, ...rest) {
      console.log("onReload 被调用 ", ...rest)
      console.log('before')
      next()
      console.log('after')
    },
    onSayHello(...rest) {
      console.log('before onSayHello: ', rest)
    }
  }
})

cmp.reload(1,2,3)

cmp.sayHello("john")