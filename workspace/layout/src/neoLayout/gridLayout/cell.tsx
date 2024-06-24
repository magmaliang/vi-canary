/**
 * 以容器包裹grid中的组件，容器作为拖动和属性设置时的proxy
 * 实际渲染时不会渲染
 */

import React, { Profiler } from 'react'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import { Renderer, ScopedContext, RendererProps, IScopedContext } from 'amis'
import { IMoveType } from '../driver'
import { GridCell } from './model'
import cloneDeep from 'lodash/cloneDeep'

interface ICellProxy {
  /**
   * 当前组件是否处于聚焦选中状态
   */
  focused: boolean
  /**
   * 是否展示渲染耗时
   */
  performance?: boolean
}

/**
 * NlGrid props
 */
interface NlGridProps extends RendererProps {
  getCell: any,
  boundary: {
    x: number,
    y: number,
    [prop: string]: any
  }
}

/**
 * 用于标记背景的单元格,同时会记录拖拽的轨迹
 */
@Renderer({
  name: 'BgCell',
  test: /(?:^|\/)BgCell$/i
})
class BackgroundCell extends React.Component<NlGridProps> {
  state = {
    dragEntered: false,
    droppedData: ''
  }
  render() {
    let cls = classnames([{ 'grid-place-holder': true, 'drag-overed': this.state.dragEntered }])
    return (
      <div
        className={cls}
        onDragEnter={this.dragEnter}
        onDragLeave={this.dragLeave}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
      >
        {this.state.droppedData}
      </div>
    )
  }

  dragEnter = (e) => {
    this.setState({ dragEntered: true })
    e.stopPropagation()
    e.preventDefault()
  }

  onDragOver = (event) => {
    event.preventDefault()
  }

  dragLeave = (e) => {
    this.setState({ dragEntered: false })
    e.stopPropagation()
    e.preventDefault()
  }

  onDrop = (e) => {
    let data = e.dataTransfer.getData('text/plain')
    this.setState({dragEntered: false })
    let target = this.props.getCell({id: data})
    let {x, y} = this.props.boundary
    // 移动target
    target.setBoundary({x, y})
  }
}

@observer
class ProxyContainer<T> extends React.Component<ICellProxy & RendererProps & T> {
  static defaultProps = {
    focused: false,
    performance: true
  }
  
  render() {
    let { focused, render, body, editable, $path } = this.props
    return (
      <div
        className={classnames('neo-proxy-wrapper', { focused: focused }, {uneditable: !editable})}
        style={{height: '100%'}}
        onClick={this.onFocus}
        onFocus={this.onFocus}
        tabIndex={this.props.model.tabIndex}
        draggable={true}
        onDragStart={this.dragStart}
        onDragEnd={this.dragEnd}
      >
        <Profiler id={$path} onRender={this.onRenderCallback}>
          {render('neo-proxy-wrapper', body)}
        </Profiler>
      </div>
    )
  }

  dragStart = (e) => {
    // console.log(cloneDeep(e))
    e.dataTransfer.setData('text/plain', this.props.id)
  }

  dragEnd = (e) => {
    console.log(cloneDeep(e))
    // 移动target
  }

  onFocus = () => {
    this.props.model.focus()
  }


  onRenderCallback = (
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions // the Set of interactions belonging to this update
  ) => {
    debugger
    if (this.props.performance) {
      console.log(id, actualDuration)
    }
  }
}

@Renderer({
  name: 'GridCellProxy',
  test: /(?:^|\/)GridCellProxy$/i
})
export default class ComponentRenderer extends ProxyContainer<RendererProps> {
  static contextType = ScopedContext

  componentWillMount() {
    const scoped = this.context as IScopedContext
    scoped.registerComponent(this)
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext
    scoped.unRegisterComponent(this)
  }
}
