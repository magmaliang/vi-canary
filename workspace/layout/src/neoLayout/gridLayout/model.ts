/**
 * 布局类型：css grid 布局
 * @author lianglf@neocrm.com
 * 在 amis grid-2d基础上初步封装，原因见readme, 内部模型很复杂，如有BUG修改，请提交code-review给lianglf
 * 
 * 以类产生json的方式适用于状态变化较频繁的场景，如果是拿到数据直接渲染，则没有使用类这种方式的必要。
 * 目前放在一起，只是因为工作量的原因。
 */
import { observable, action, computed } from 'mobx'
import {Renderer, RendererProps, Schema, utils, BaseSchema, SchemaObject} from 'amis';
import $pick from 'lodash/pick'


import { ICell, IMoveType, ILayout, ModelType, uuid } from '../driver'

/**
 * css GridCell 布局的基本Cell 
 */
export interface IGridCell extends ICell {
  /**
   * 起始横坐标位置，以 1 为起点
   */
  x: number;

  /**
  * 起始纵坐标位置，以 1 为起点
  */
  y: number;

  /**
  * 宽度，跨几列
  */
  w: number;

  /**
  * 高度，跨几行
  */
  h: number;

  /**
  * 宽度，会影响起始位置对应那一列的宽度
  */
  width?: number | string;

  /**
  * 高度，会影响起始位置那一行的高度，设置为 auto 就会自适应
  */
  height?: number | string;


  /**
  * 水平展示方式，用于内容宽度比 grid 小的情况，默认是 auto 自动撑满
  */
  align?: 'left' | 'right' | 'center' | 'auto';

  /**
  * 垂直展示方式，用于内容高度比 grid 小的情况，默认是 auto 自动撑满
  */
  valign?: 'top' | 'bottom' | 'middle' | 'auto';

  // #region 内部属性，经常变动，禁止在外层使用

  /**
   * 【禁止外部使用】
   *  布局单元内组件原始schema
  */
  _cmp_origin: object

  // #endregion


  /**
   * 获取cell容器的样式
   * @returns 支持react style的样式
   */
  getCellStyle: () => object
  
  focus: () => any
  unFocus: () => any

  /**
   * 应用布局变更，慎用，目前无数据响应，强行调用的父组件的方法
   */
  applyLayout: () => any,
  /**
   * 移动grid
   */
  move : (moveType: IMoveType, vector: number) => any,

  /**
   * shift + 方向箭头变更cell的大小
   * @param moveType 
   * @param vector 
   * @returns 
   */
  growth : (moveType: IMoveType, vector: number) => any,

  setProps: (props: any) => any

  /**
   * 更新 x y h w
   */
  setBoundary: ({ x, y, h, w }: any) => any
}

/**
 * NlGrid schema object
 */
export interface NlGridSchema extends Omit<BaseSchema, 'type'>  {
  /**
   * 指定为 NlGrid展示类型
   */
  type: 'NlGrid';

  /**
   * 当cell超出容器的边界时，布局行列是否会自动适配，默认为true
   * tip： grid只可以向右和向下增长
   */
  gridsAdaptable: boolean;

  /**
   * 列数量，默认是 12
   * 也可以设置为直接的css-grid 数组： ["100px", "1fr", "100px"] —— 三栏布局
   * 
   */
  cols?: number | Array<any>;
  /**
   * - number: ${rows} 个 ${rowHeight}组成行
   * - []: 外层传入强行指定
   */
  rows?: number| Array<any>;

  /**
   * grid 2d 容器宽度，默认是 auto
   */
  width?: number | string | 'auto';

  /**
   * 格子间距，默认 0，包含行和列
   */
  gap?: number | string;

  /**
   * 格子行级别的间距，如果不设置就和 gap 一样
   */
  rowGap?: number | string;

  /**
   * 单位行高度，默认 50 px
   */
  rowHeight?: number | string;

  /**
   * 每个格子的配置
   */
  cells: Array<IGridCell>;
}

/**
 * NlGrid props
 */
export interface NlGridProps extends RendererProps, Omit<NlGridSchema, 'type' | 'className'> {
  itemRender?: (
    item: any,
    key: number,
    length: number,
    props: any
  ) => JSX.Element;
  
}

// Grid 布局默认的这个命名方式和其它 CSS 差异太大，所以我们使用更类似其它 CSS 的命名
const justifySelfMap = {
  left: 'start',
  right: 'end',
  center: 'center',
  auto: 'stretch'
};

const alignSelfMap = {
  top: 'start',
  bottom: 'end',
  middle: 'center',
  auto: 'stretch'
};

/**
 * css grid 中的操作单元
 */
export class GridCell implements IGridCell {
  [x: string]: any;
  x: number;
  y: number;
  w: number;
  h: number;
  tabIndex: number;
  width?: string | number;
  height?: string | number;
  id: string;
  /**
   * 当前使用name作为cell的唯一标识，当cell不传name时会取cmp.type作为name
   * 所以暂时不允许拖入相同的组件，除非指定cell的name
   * 元数据贯穿后，会使用cmpInstanceId作为唯一标识
   */
  name: string;
  className?: string;
  style: any  = {};
  editable: boolean = true;
  visible: boolean = true;
  @observable focused: boolean = false;
  status: ModelType;
  cmp: Schema;

  align?: 'center' | 'left' | 'right' | 'auto' = 'auto';
  valign?: 'auto' | 'top' | 'bottom' | 'middle' = 'auto';
  _cmp_origin: object;

  constructor(options) {
    Object.assign(this, options)
    this._cmp_origin = {...(options.cmp||{})}
    if (!this.name) {
      this.name = this.cmp.type
    }
    this.id = uuid()
  }

  getCellStyle = () => {
    return {
      gridColumnStart: this.x,
      gridColumnEnd: this.x + this.w,
      gridRowStart: this.y,
      gridRowEnd: this.y + this.h,
      justifySelf: justifySelfMap[this.align],
      alignSelf: alignSelfMap[this.valign],
      // 保证序号小的cell在上层
      zIndex: 100 - this.tabIndex, //100 的话，单选下拉选项被盖住了，先还原
      ...this.style
    }
  };

  getBoundary() {
    let { x, y, h, w } = this
    return { x, y, h, w }
  }

  focus = () => {
    this.focusCell(this)
  }

  unFocus = () => {
    this.focused = false
    this.applyLayout()
  }

  applyLayout: () => any;

  @action
  move(moveType: IMoveType, vector: number){
    switch(moveType) {
      case IMoveType.top:
        this.setBoundary({y: this.y - vector});break;
      case IMoveType.bottom:
        this.setBoundary({y: this.y + vector});break;
      case IMoveType.right:
        this.setBoundary({x: this.x + vector});break;
      case IMoveType.left:
        this.setBoundary({x: this.x - vector});break;
      default:
        console.warn(`error moveType: ${moveType}`)
    }
  }

  @action 
  growth(moveType: IMoveType, vector: number){
    switch(moveType) {
      case IMoveType.bottom:
        let height = this.h + vector
        if (height <= 0) {
          height = 1
        }
        this.setBoundary({h: height});break;
      case IMoveType.right:
        let width = this.w + vector
        if (width <= 0) {
          width = 1
        }
        this.setBoundary({w: width});break;
      default:
        console.warn(`error moveType: ${moveType}`)
    }
  }

  /**
   * 仅 x, y, w, h, cmp可以设置
   * @param props
   */
  @action setProps = ({x, y, w, h, cmp}: IGridCell) => {
    this.updateCmp(cmp);
    this.setBoundary({x, y, w, h});
  }


  /**
   * 更新 x y h w
   * @param x
   * @param y
   * @param h
   * @param w
   */
  @action setBoundary = ({ x, y, h, w }: any) => {
    if (!this.editable) {
      console.warn("cell is not editable!")
      return
    }

    x && (this.x = x)
    y && (this.y = y)
    h && (this.h = h)
    w && (this.w = w)
    this.applyLayout()
  }

  /**
   * 更新cell内部的组件
   * @param schema 
   */
  @action updateCmp = (schema: Schema) => {
    this.cmp = Object.assign({}, this.cmp, schema)
  }

  /**
   * 获取cell壳子的schema
   * @returns 
   */
  getContainerSchema = () => {
    return {
      ...$pick(this, ['id' ,'x', 'y', 'w', 'h', 'focused', 'gridClassName', 'editable']),
    }
  }


  getSchema: any = (modelType: ModelType) => {
    let schema = {
      // 计算属性无法被解构
      ...this,
      ...$pick(this, ['id' ,'x', 'y', 'w', 'h', 'focused', 'gridClassName', 'editable']),
      model: this
    }

    if (this.disabled || this.status === ModelType.render) {
      return schema
    }

    // 设计态下可设计时，使用GridCellProxy包裹， 处于布局设计状态中
    return {
      ...$pick(this, ['x', 'y', 'w', 'h', 'focused', 'gridClassName']),
      cmp: {
        ...schema,
        type: "GridCellProxy",
        body: this.cmp
      }
    }
  }
  
}


/**
 * css grid 数据对象
 * 此类可被继承，以实现实际的布局模板
 */
export class NlGridModel extends ILayout {
  cells: Array<IGridCell>
  /**
   * 模式
   */
  @observable status: ModelType
  @computed get focusGridSchema() {
    return this.getFocusedCell()?.getPureSchema() || ""
  }

  type = 'NlGrid'
  // 布局实例id， 对应到元模型的一具体的布局
  layoutId : string
  gridClassName = 'neo-grid-layout-container'
  // 列数
  cols: number | Array<any> = 12
  // 行数
  rows
  gridsAdaptable = true
  gap = 1
  rowGap = undefined
  width = "100%"
  // 默认行高度
  rowHeight = '3.125rem'

  //#region 非传入参数，内部运行时初始化
  // 行，直接用于渲染
  _rows: Array<any> = []
  // 列： 直接用于渲染
  _cols: Array<any> = []
  //#endregion

  options: NlGridProps
  accessProps =['gridClassName', 'gap', 'rowGap', 'cols', 'rowHeight', 'status', 'rows', '_applyLayout']
  /**
   * 接受的参数即布局组件本身接受到的参数全集
   * @param options: NlGridProps
  */
  constructor(options: NlGridProps) {
    super()
    this.options = options
    Object.assign(this, $pick(options, this.accessProps))
    this.status = options.status??ModelType.render
    this.resetCells(options.cells)
  }

  /**
   * 重置cell props
   * @param options 
   */
  @action resetCells(cells) {
    if (cells) {
      this.createCells(cells)
    }
    this.figureGridsByCells()
  }

  /**
   * 根据cells的位置自增减grids: 最小rows.length 和 最小cols.length由初始参数决定，随后由cells的边界撑开
   * ps: 所以要保持初始参数计算出的rows和cols稳定
   */
  @action figureGridsByCells() {
    let {cols, rows} = this.grids;

    const {cells, rowHeight, gridsAdaptable} = this;

    // cells的边界超出时，是否自适应：仅在数组末尾push进增加的行列。
    // 约定：插入的列宽度为"1fr"， 插入的行高度为“rowHeight”
    if (gridsAdaptable) {
      // 根据 cell 中的设置自动更新行列高度
      let rowCountFromCells = 0, colsCountFromCells = 0;
      cells.forEach(c => {
        if (c.x + c.w -1 > colsCountFromCells) {
          colsCountFromCells = c.x + c.w - 1;
        }

        if (c.y + c.h - 1 > rowCountFromCells) {
          rowCountFromCells  = c.y + c.h - 1;
        }
      }); 

      // 列超过
      let tailExpandedCols =  colsCountFromCells - cols.length;
      if (tailExpandedCols > 0) {
        cols = cols.concat(new Array(tailExpandedCols).fill('1fr'))
      }

      // 行超过
      let tailExpandedRows = rowCountFromCells - rows.length;

      if(tailExpandedRows > 0) {
        rows = rows.concat(new Array(tailExpandedRows).fill(rowHeight))
      }
    }

    // 如果cells指定了height, width, 则应用到grids上
    cells.forEach(c => {
      if (c.width) {
        cols[c.x - 1] = Number.isInteger(c.width) ? c.width + 'px' : c.width;
      }
      if (c.height) {
        rows[c.y - 1] = Number.isInteger(c.height) ? c.height + 'px' : c.height;
      }
    });

    this._rows = rows
    this._cols = cols

    return {
      cols,
      rows
    }
  }

  /**
   * 模块内部使用的栅格对象
   * 由初始参数输入计算得到
   */
  @computed get grids() {
    const { cols, rows = 1, rowHeight} = this;

    //1. 列模板计算
    let templateColumns;
    //1.1 数字： 等分
    if (Number.isInteger(cols)) {
      templateColumns = new Array(cols);
      templateColumns.fill('1fr');
    } else {
      // 1.2 数组
      templateColumns = Array.from(cols as Array<any>)
    }

    // 2. 行模板计算
    let templateRows
    // 2.1 数字： 等分
    if (Number.isInteger(rows)) {
      templateRows = new Array(rows);
      templateRows.fill(rowHeight);
    } else {
      // 2.2 数组
      templateRows = Array.from(rows as Array<any>)
    }

    return {
      cols: templateColumns,
      rows: templateRows
    }
  }

  /**
   * 计算容器的行列css 属性
   */
  getContainerStyle() {
    const { gap, rowGap, width} = this;

    const style = {
      display: 'grid',
      columnGap: gap,
      rowGap: typeof rowGap === 'undefined' ? gap : rowGap,
      width,
      gridTemplateColumns: this._cols.join(' '),
      gridTemplateRows: this._rows.join(' '),
      // 隐式自动创建行列时默认宽高，暂时不支持扩展
      gridAutoRows: this.rowHeight,
      gridAutoColumns: "1fr"
    };

    return style
  }

  /**
   * 最终schema
   */
  getFinalSchema = () => {
    let schema = {
      ...$pick(this, ['type', 'gridClassName', 'gap', 'rowGap', 'cols', 'rowHeight']),
      cells: this.cells.map((x) => x.getSchema()),
    }

    // 设计态下，插入背景图
    if (this.status === ModelType.design) {
      schema.cells.push(...this.createPlaceHolder())
    }


    return schema
  }
  
  @computed get gridNames() {
    return this.cells.map((x) => {
      return x.name
    })
  }

  @computed get focusedCell() {
    return this.cells?.find((x) => x.focused)
  }


  /**
   * 根据组件id检索Cell
   * 没有时返回undefined
   * @param param0 
   * @returns 
   */
  getCellById = (id) => {
    return this.cells.find((x) => x.id === id)
  }

  /**
   * 根据cell中的组件类型检索
   * 返回的是一个数组
   * @param type 
   * @returns 
   */
  getCellsByCmpType = (type: string) => {
    return this.cells.filter((x) => x.cmp.type === type)
  }

  /**
   * 根据cell中的组件类型检索
   * 返回的是一个Cell
   * @param type 
   * @returns 
   */
  getCellByCmpType = (type: string) => {
    return this.cells.find((x) => x.name === type)
  }


  getFocusedCell = () => {
    return this.cells.find((x) => x.focused)
  }


  /**
   * 根据初始布局生成内部布局对象
   * @param grids 
   */
  createCells = (cells: any) => {
    this.cells = cells
      .map((grid: any, index: number) => {
        return new GridCell({
          ...grid, 
          status: this.status,
          applyLayout: this._applyLayout,
          focusCell: this.focusCell,
          tabIndex: index
        })
      })
      .filter((x: any) => x.visible)
  }

  /**
   * grids已初始化的情况下，进行增量更新
   * @param grids 
   */
  @action updateCells = (cells: any) => {
    this.cells = cells
      .map((c: ICell) => {
        // 存在，则进行增量合并
        let existCell = this.getCellByCmpType(c.cmp.type)
        if (existCell) {
          existCell.updateCmp(c.cmp)
          return existCell
        }

        // 否则创建新的实例
        let _cell = new GridCell({...c, applyLayout: this._applyLayout})
        return _cell
      })
      .filter((x:any) => x.visible)
  }

  /**
   * 已存在的cell， 仅更新其内部组件
   * @param cells 
   */
  @action updateCellsCmp = (cells: any) => {
    this.cells = cells
      .map((c: any) => {
        let _cell = new GridCell({...c, applyLayout: this._applyLayout})

        // 已存在的cells，仅更新cmp
        let existCell = this.cells.find(x => x.name === _cell.name)
        if (existCell) {
          existCell.updateCmp(c.cmp)
          return existCell
        }

        return _cell
      })
      // .filter((x:any) => x.display)
  }

  /**
   * deep  merge props 到当前对象
   * @param props
   */
  setLayoutProps = (props: any = {}) => {
    if (props.cells) {
      this.updateCells(props.cells)
    }
  }
  
  /**
   * 应用布局变更
   */
  _applyLayout = () => {}

  focusCell = (grid: GridCell) => {
    this.cells.find(x => x.focused)?.unFocus();
    grid.focused = true
  }

  /**
   * 生成背景图
   * @param cols 
   * @param rows 
   * @returns 
   */
  createPlaceHolder = () => {
    let rowCount = this._rows.length, colCount = this._cols.length
    let cells = []
    for (let row = 1; row <= rowCount; row++) {
      for(let col = 1; col <= colCount; col++) {
        cells.push({
          x: col,
          y: row,
          h: 1,
          w: 1,
          style: {
            gridColumnStart: col,
            gridColumnEnd: col + 1,
            gridRowStart: row,
            gridRowEnd: row + 1,
            zIndex: 0
          },
          cmp: {
            type: "BgCell",
            "status": "design",
            "disabled": true, 
            getCell: this.getCell
          }
        })
      }
    }
  
    return cells;
  }

  /**
   * 在左上角创建一个新的布局cell, 仅在design模式下可用
   */
  addNewCell = (cell?: Partial<IGridCell>) => {
    if (this.status === ModelType.render) {
      throw new Error("can not create new container under render model!")
    }

    if(!cell) {
      cell = {
        x:1,y:1,h:1,w:1,
        applyLayout: this._applyLayout,
        focusCell: this.focusCell,
        status: this.status,
        tabIndex: this.cells.length,
        cmp: {
          type: 'tpl',
          tpl: 'new cell component'
        }
      }
    }

    this.cells.push(
      new GridCell({
        ...cell,
        applyLayout: this._applyLayout,
        focusCell: this.focusCell,
        status: this.status,
        tabIndex: this.cells.length
      })
    )

    this._applyLayout()
  }

  @action setStatus = (status: ModelType) => {
    this.status = status
    this.cells.forEach(x => x.status = this.status)
  }

  /**
   * 
   * @param colIndex 
   * @param width css-grid row height: *px, *fr, *rem, *%, etc
   */
  setColumnWith  = (colIndex, width) => {

  }
}
