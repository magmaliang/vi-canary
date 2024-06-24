/**
 * 布局下渲染单元
 * 如无必须，勿增字段
 */

import {Renderer, RendererProps, Schema, utils, BaseSchema, SchemaObject} from 'amis';

export enum ModelType  {
  /**
   * 设计态
   */
  "design" = "design",
  /**
   * 渲染态
   */
  "render" = "render"
}

/**
 * 移动类型：上下左右
 */
export enum IMoveType  {
  "left" = "left",
  "right" = "right",
  "top" = "top",
  "bottom" = "bottom"
}

/**
 * 布局基本单元，可以存放组件
 */
export interface ICell {
  /**
   * 单元格id
   * 不用设置，单元格生成时自动生成
   */
  id: string

  /**
   * 容器渲染时的类名
   */
  className?: string

  /**
   * 容器渲染时的样式
   */
  style?: any

  /**
   * 是否可以设置：宽高、位置、删除
   */
  editable: boolean

  /**
   * 是否可见
   */
  visible?: boolean

  /**
   * 是否选中(获取焦点)
   */
  focused: boolean

  /**
   * 当前所处状态
   */
  status: ModelType

  /**
   * 容器中的组件
   */
  cmp: Schema

  /**
   * 更新组件，仅调用组件设计状态的更新方法，更新能力由各组件自己实现
   * @param cmp 
   * @returns 
   */
  updateCmp: (Schema) => void

  /**
   * 获取当前布局Cell用于渲染的json schema
   * 用于设计态和渲染态的Schema会不一样
   * TODO：
   *    拆分两种状态，提升渲染时的性能
   */
  getSchema: (modelType?: ModelType) => Schema
}



