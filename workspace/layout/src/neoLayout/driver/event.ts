/**
 * 实验中，请勿使用！！！
 * 事件系统，暂时实现在这里
 * 需要和amis体系结合，在数据统一模型的层面实现事件的定义、注册、执行、调度 与 扩展。
 */

/**
 * 洋葱模型全能事件注解
 * @param target 
 * @param key 
 * @param descriptor 
 * @returns 
 */
function neoOnionEvent(target, key, descriptor) {
  let _originVal = target[key]

  descriptor.value = function (...args) {
    const  _outerHandler = this._getActionByName(key) // 大写暂时没有处理
    // 没有传入onXxx，不做更改
    if(!_outerHandler) {
      return _originVal.apply(this, args)
    }

    // 否则，将原始函数参数直接绑定成新函数以next的方式传入后续函数
    _outerHandler.apply(this, [_originVal.bind(this, ...args), ...args])
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
function neoEventBefore(target, key, descriptor) {
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

export {neoEventBefore, neoOnionEvent}