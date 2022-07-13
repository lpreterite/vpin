// 获取元素基于页面的定位
export const offset = (el) => {
    const rect = el.getBoundingClientRect()
    const win = el.ownerDocument.defaultView
    return {
        x: rect.left + win.pageXOffset,
        y: rect.top + win.pageYOffset
    }
}

export const position = (el, container) => {
    const { x:ex, y:ey } = offset(el)
    const { x:cx, y:cy } = offset(container)
    return {
        x: ex-cx,
        y: ey-cy
    }
}

export const screen = (el, container)=>{
    const win = el.ownerDocument.defaultView
    const { x:cx,y:cy } = offset(container)
    return {
        x: win.pageXOffset - cx,
        y: win.pageYOffset - cy,
    }
}

export const rect = el => {
    const rect = el.getBoundingClientRect()
    return {
        x: rect.x || rect.left,
        y: rect.y || rect.top,
        width: rect.width,
        height: rect.height
    }
}

export const matchRange = (target, range, offset={x:0,y:0}) => {
    const x = target.offsetX - offset.x
    const y = target.offsetY - offset.y
    const xLimit = range.offsetX + range.width - offset.x - target.width
    const yLimit = range.offsetY + range.height - offset.y - target.height
    return {
        x,
        y,
        xLimit,
        yLimit,
        effective: ( window.pageXOffset > x && window.pageXOffset < xLimit ) || ( window.pageYOffset > y && window.pageYOffset < yLimit )
    }
}

export const getNodeLocation = el => {
    const {x:offsetX, y:offsetY} = offset(el)
    return {...rect(el), offsetX, offsetY}
}

import throttle from 'lodash.throttle'
export { throttle }

/**
 * 定位计算对象
 *
 * @param {*} [options={}]
 * @class
 */
export function Pin(options={}){
  const _screens={
          target: { x:0, y:0, width:0, height:0 },
          container: { x:0, y:0, width:0, height:0 },
       }
       ,_events = {
          resize: undefined,
          scroll: undefined
      }
  let _stage = window
  // let _targetParent;

  let {
    throttleOn=false,
    throttleWait=250,
    limit=true,
    offset={top:Number.NaN,left:Number.NaN,bottom:Number.NaN,right:Number.NaN}
  } = options

  function _initEvent(){
    _events.scroll = throttleOn ? throttle(_onScroll, throttleWait, {}) : _onScroll //移除了更实时了
    _events.resize = _onResize
  }
  function _bindEvent(){
    _scrollEl.addEventListener('scroll', _events.scroll)
    _stage.addEventListener('resize', _events.resize)
  }
  function _unBindEvent(){
    _scrollEl.removeEventListener('scroll', _events.scroll)
    _stage.removeEventListener('resize', _events.resize)
  }

  function _onScroll(event){
    _render(_target, _reference, _container)
  }

  function _onResize(event){
    _target.style.left = ""
    _target.style.top = ""
    _target.style.bottom = ""
    _target.style.right = ""
    _target.style.height = ""
    _target.style.width = ""
    _locate(_target)
    _render(_target, _reference, _container)
  }


  function _getPosition(el, reference=_reference){
    const rect = el.getBoundingClientRect()
    return {
      x: reference.scrollLeft + rect.x,
      y: reference.scrollTop + rect.y,
      height: rect.height,
      width: rect.width
    }
  }


  function _render(target, reference, container){
    if(!target) return
    if(!reference) return
    if(!container) return

    const positions = {
      container: _getPosition(container, reference)
    }
    const movement = {
      x: 0,
      y: 0,
    }

    // 依据受限对象计算偏移量
    const _offset = _offsetFormula(_screens.target, positions.container, offset)
    movement.x = reference.scrollLeft + _offset.x
    movement.y = reference.scrollTop + _offset.y

    // 获得受限位置
    if(limit){
      movement.x = Math.max(positions.container.x, Math.min(positions.container.x+positions.container.width, movement.x))
      movement.y = Math.max(positions.container.y, Math.min(positions.container.y+positions.container.height, movement.y))
    }

    target.style.position = "absolute"
    target.style.left = `${movement.x}px`
    target.style.top = `${movement.y}px`
    target.style.bottom = "auto"
    target.style.right = "auto"
    target.style.width = `${positions.container.width}px` // 按盒模型排版的情况下，宽继承父级
    target.style.height = 'auto' //高根据内容撑开
    // target.style.zIndex = '999'
  }

  function _locate(el){
    _screens.target = _getPosition(el)
    return el
  }

  /**
   * 根据范围元素计算偏移量
   *
   * @description 基于范围元素进行定位计算，坐标数值以范围元素内为准。
   * @param {*} target
   * @param {*} container
   * @param {*} offset
   * @returns
   */
  function _offsetFormula(target, container, offset){
    const xFormula = [
      target.x, //按元素当前位置计算
      offset.left, //按Left偏移计算
      container.width - target.width - offset.right  //按Right偏移计算
    ]
    const yFormula = [
      target.y, //按元素当前位置计算
      offset.top, //按Top偏移计算
      container.height - target.height - offset.bottom,  //按Bottom偏移计算
    ]

    const result = {
      x: xFormula[
        [
          Number.isNaN(offset.left) && Number.isNaN(offset.right),
          !Number.isNaN(offset.left),
          !Number.isNaN(offset.right),
        ].indexOf(true)
      ],
      y: yFormula[
        [
          Number.isNaN(offset.top) && Number.isNaN(offset.bottom),
          !Number.isNaN(offset.top),
          !Number.isNaN(offset.bottom),
        ].indexOf(true)
      ]
    }

    return result
  }

  function destroy(){
    _target.remove()
    _unBindEvent()
  }

  let _container=document.documentElement
  function containsIn(val=document.documentElement){
    if(typeof val == 'string'){
      val = document.documentElement.querySelector(val)
    }
    if((val||{}).nodeType != 1) throw new Error('container 并不是元素节点对象!')
    _container = val
    _render(_target, _reference, _container)
    return ctx
  }

  let _reference = document.documentElement
     ,_scrollEl = _reference.parentNode

  /**
   * 设置参考物
   * @description 设置时同时会绑定scroll事件进行监控
   * @memberof Pin
   * @param {*} [val=document.documentElement]
   * @returns
   */
  function referTo(val=document.documentElement){
    if(typeof val == 'string'){
      val = document.documentElement.querySelector(val)
    }
    if((val||{}).nodeType != 1) throw new Error('reference 并不是元素节点对象!')
    _reference = val
    _scrollEl = _reference.parentNode
    _render(_target, _reference, _container)
    _unBindEvent()
    _bindEvent()
    return ctx
  }

  let _target;
  function pinUp(el, options={}){
    if(typeof el == 'undefined') throw new Error('el 是必须的!')
    if((el||{}).nodeType != 1) throw new Error('el 并不是元素节点对象!')

    _target = el
    _render(_target, _reference, _container)

    Object
      .keys(options)
      .forEach(key=>{
        if(typeof ctx[key] == 'undefined') return
        ctx[key] = options[key]
      })
  }

  /**
   * 转移对象
   *
   * @description 转移对象到参照元素板块
   * @memberof Pin
   * @param {*} [el=_target]
   * @param {*} [reference=_reference]
   */
  function transfer(el=_target, reference=_reference){
    if(typeof el == 'undefined') throw new Error('el 是必须的!')
    if((el||{}).nodeType != 1) throw new Error('el 并不是元素节点对象!')

    _stage = el.ownerDocument.defaultView
    _target = _locate(el)
    referTo(reference)

    const parent = el.parentNode
    if(parent && parent != document.body){
      // _targetParent = parent
      const comment = document.createComment(`vpin::${el.dataset['pkey']}`);
      parent.replaceChild(comment, el)
      // const placeholder = document.createElement("div")
      // placeholder.style.display = "none"
      // placeholder.classList.add("vpin-placeholder")
      // placeholder.classList.add(`vpin-placeholder--${el.dataset['pkey']}`)
      // parent.replaceChild(placeholder, el)
      reference.nodeName == 'HTML' ? reference.ownerDocument.body.append(el) : reference.append(el)
    }
  }

  /** 初始化 */
  _initEvent()
  referTo()
  /** 初始化 */

  const ctx = {
    containsIn,
    referTo,
    pinUp,
    transfer,
    destroy,
  }
  Object.defineProperties(ctx, {
    stage: {
      get:()=>_stage
    },
    screens: {
      get:()=>_screens
    },
    container: {
      get:()=>_container,
      set:containsIn
    },
    reference: {
      get:()=>_reference,
      set:referTo
    },
    offsetTop:{
      get: ()=>offset.top,
      set: val=>{
        if(typeof val == 'undefined') return
        offset.top = val
      }
    },
    offsetBottom:{
      get: ()=>offset.bottom,
      set: val=>{
        if(typeof val == 'undefined') return
        offset.bottom = val
      }
    },
    offsetLeft:{
      get: ()=>offset.left,
      set: val=>{
        if(typeof val == 'undefined') return
        offset.left = val
      }
    },
    offsetRight:{
      get: ()=>offset.right,
      set: val=>{
        if(typeof val == 'undefined') return
        offset.right = val
      }
    },
    limit: {
      get: ()=>limit,
      set: val=>{
        if(typeof val == 'undefined') return
        limit = val
      }
    },
    throttleOn: {
      get:()=>throttleOn,
      set:val=>{
        if(typeof val == 'undefined') return
        throttleOn=val
      }
    },
    throttleWait: {
      get:()=>throttleWait,
      set:val=>{
        if(typeof val == 'undefined') return
        throttleWait=val
      }
    },
    zIndex: {
      get:()=>_target.style.zIndex,
      set:val=>_target.style.zIndex=val
    }
  })
  return ctx
}
