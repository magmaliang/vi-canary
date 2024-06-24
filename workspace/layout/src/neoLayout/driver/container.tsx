/**
 * 装载布局对象的抽象容器，提供的能用能力有：
 *    1.组件检索
 *    2.布局Cell检索
 *    3.通用合并
 * 其他实体布局能力由布局对象提供
 */
import {ICell, ModelType, IMoveType} from './cell'

import $pick from 'lodash/pick'

import {observable} from 'mobx' 


class ILayout {
  type: string
  className?: string
  style?: any
  width?: any

  @observable status: ModelType
  cells: Array<ICell>
  /**
   * 注册的actions，可以使用指令方式调用
   * 外部调用时使用，内部尽量不要使用
   */
  actions: Array<Function>

  getCell = ({id}) => {
    return this.cells.find(c => c.id === id)
  }

  /**
   * 获取amis渲染使用的 json schema
   * @param status 'render' or 'design'
   */
  getSchema = (status?: ModelType) => {
    if (status === undefined) {
      status = ModelType.render
    }

    return {
      ...$pick(this, ['type', 'status', 'className']),
      cells: this.cells.map(c => c.getSchema(status))
    }
  }
}


export { ILayout }


