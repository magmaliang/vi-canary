/**
 * 布局类型：css grid 布局
 * @author lianglf@neocrm.com
 * view 层组件
 * 此组件禁止修改，能力全部在store中
 */
import React from 'react';
import {Renderer, RendererProps, Schema, utils, BaseSchema, IScopedContext, ScopedContext} from 'amis';
import {GridCell, NlGridModel, IGridCell, NlGridProps, NlGridSchema} from './model'
import { observer } from 'mobx-react';
import './cell'
import './style.scss'
import { ModelType, IMoveType } from '../driver';

/**
 * 布局类型NlGrid的渲染器
 * 带有内置布局的组件可以直接继承此组件
 */
@observer
export default class NlGridX extends React.Component<NlGridProps, object> {
  static propsList: Array<string> = ['cells'];
  /**
   * 关联的model
   */
  NLayout: Partial<NlGridModel>

  constructor(props: NlGridProps) {
    super(props);
    // 这里使用forceUpdate传递是暂时改造没有完成，逼不得以，其他场景不要使用
    this.NLayout = new NlGridModel({...props, _applyLayout: () => {this.forceUpdate()}});
    //@ts-ignore
    window._NLayout = this.NLayout;
  }

  // TODO:改造未完成，先使用这种方式应用cells中的参数变化
  componentWillReceiveProps(nextProps) {
    this.NLayout.updateCells(nextProps.cells)
  }

  renderChild(region: string, node: Schema) {
    const {render} = this.props;
    return render(region, node);
  }

  // TODO: 目前 stage 上的背景cell是使用一个组件定义实现的，深入挖掘性能时可以使用在此方法中的原生实现
  renderCell(cell: IGridCell, key: number, length: number) {
    const {itemRender, data} = this.props;

    if (!utils.isVisible(cell as IGridCell, data)) {
      return null;
    }

    return (
      <div key={key} style={cell.getCellStyle()} className={cell.className}>
        {itemRender
          ? itemRender(cell, key, length, this.props)
          : this.renderChild(`NLGrid_Cell/${key}`, cell.getSchema().cmp as Schema)}
      </div>
    );
  }

  renderCells() {
    const {cells} = this.NLayout;
    return cells.map((x, key) => this.renderCell(x, key, cells.length));
  }

  renderBgCells() {
    if(this.NLayout.status === ModelType.render) {
      return null;
    }

    let bgCells = this.NLayout.createPlaceHolder()
    
    return bgCells.map((c, key) => {
      let {cmp, x, y, w, h} = c
      cmp.boundary = {x, y, w, h}
      return <div key={key} style={c.style}>
      {this.renderChild(`NLGrid_BgCell/${key}`, cmp as Schema)}
    </div>
    });
  }

  onKeyDown = (e) => {
    // 获取当前聚焦的cell
    let model = this.NLayout.getFocusedCell() as GridCell
    if(!model) {
      return false;
    }
    switch (e.keyCode) {
      // ArrowLeft 37
      case 37: {
        e.shiftKey ? model.growth(IMoveType.right, -1) : model.move(IMoveType.left, 1)
        break
      }

      // ArrowRight 39
      case 39: {
        e.shiftKey ? model.growth(IMoveType.right, 1) : model.move(IMoveType.right, 1)
        break
      }
      // ArrowUp 38
      case 38: {
        e.shiftKey ? model.growth(IMoveType.bottom, -1) : model.move(IMoveType.top, 1)
        break
      }
      // ArrowDown 40
      case 40: {
        e.shiftKey ? model.growth(IMoveType.bottom, 1) : model.move(IMoveType.bottom, 1)
      }
    }

    this.NLayout.figureGridsByCells()
  }

  render() {
    let style = this.NLayout.getContainerStyle()
    let cls = Array.from(new Set([this.NLayout.gridClassName, 'neo-grid-layout-container', this.NLayout.status])) .join(' ')

    return <div 
      className={cls} 
      style={style}
      onKeyDown={this.onKeyDown}
      >
        {this.renderCells()}
        {this.renderBgCells()}
      </div>;
  }
}

// 导出布局model, 用于被组件模板继承
export {NlGridModel}

@Renderer({
  test: /(^|\/)NlGrid$/,
  name: 'NlGrid'
})
export class NlGridExp extends NlGridX {
  static contextType = ScopedContext
  
  componentWillMount() {
    const scoped = this.context as IScopedContext
    scoped.registerComponent(this)
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext
    scoped.unRegisterComponent(this)
  }

  /**
   * Amis组件会调用组件的receive方法
   * @param {*} values
   * @param {*} name
   */
  receive = (values: any, name: any) => {
    const { onChange } = this.props
    onChange && onChange(values)
  }
  reload = (...args) => {
    console.log('reload', args)
  }
}
