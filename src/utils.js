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
  let _targetParent;

  let {
    throttleOn=false,
    throttleWait=250,
    limit=true,
    offset={top:Number.NaN,left:Number.NaN,bottom:Number.NaN,right:Number.NaN},
    sticky=true,
    cssEffect=false,
  } = options

  const ctx = {
    containsIn,
    referTo,
    pinUp,
    transfer,
    untransfer,
    destroy,
  }

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
    let rect;
    if(el.tagName.toLowerCase()=='html'){
      rect = {
        x: 0,
        y: 0,
        height: el.clientHeight,
        width: el.clientWidth,
      }
    }else{
      rect = el.getBoundingClientRect()
    }
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
      top: 0,
      left: 0,
      bottom: "auto",
      right: "auto"
    }
    let position = "absolute"

    if(!cssEffect){

      // 依据受限对象计算偏移量
      const _offset = _offsetFormula(_screens.target, positions.container, offset)
      movement.left = reference.scrollLeft + _offset.x
      movement.top = reference.scrollTop + _offset.y

      // 获得受限位置
      if(limit){
        movement.left = Math.max(positions.container.x, Math.min(positions.container.x+positions.container.width, movement.left))
        movement.top = Math.max(positions.container.y, Math.min(positions.container.y+positions.container.height, movement.top))
      }

    }else{
      position = sticky?"sticky":"fixed"
      movement.top = Number.isNaN(offset.top) || typeof offset.top == 'undefined' ? "auto" : offset.top
      movement.left = Number.isNaN(offset.left) || typeof offset.top == 'undefined' ? "auto" : offset.left
      movement.right = Number.isNaN(offset.right) || typeof offset.top == 'undefined' ? "auto" : offset.right
      movement.bottom = Number.isNaN(offset.bottom) || typeof offset.top == 'undefined' ? "auto" : offset.bottom
    }

    target.style.position = position
    target.style.left = Number.isFinite(movement.left)?`${movement.left}px`:movement.left
    target.style.top = Number.isFinite(movement.top)?`${movement.top}px`:movement.top
    target.style.bottom = Number.isFinite(movement.bottom)?`${movement.bottom}px`:movement.bottom
    target.style.right = Number.isFinite(movement.right)?`${movement.right}px`:movement.right
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
    _unBindEvent()
    untransfer()

    if(_targetParent && !_targetParent.parentChild) _target.remove()
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

    // const parent = el.parentNode
    // if(!sticky){

    //   //移除占位元素
    //   let placeholder = document.querySelector(`.vpin-placeholder[pkey="${el.dataset['pkey']}"]`)
    //   if(!!placeholder) return

    //   //占位元素
    //   placeholder = document.createElement("div")
    //   // placeholder.style.display = "none"
    //   placeholder.classList.add("vpin-placeholder")
    //   placeholder.dataset["pkey"]=el.dataset['pkey']
    //   placeholder.style.height = _screens.target.height+"px"
    //   placeholder.style.width = _screens.target.width+"px"
    //   _targetParent.replaceChild(placeholder, el)
    // }
  }

  /**
   * 转移对象
   *
   * @description 转移对象到参照元素板块
   * @memberof Pin
   * @param {*} [el=_target]
   * @param {*} [reference=_reference]
   */
  function transfer(el=_target, reference=_reference, { placeholderOn=true }={}){
    if(typeof el == 'undefined') throw new Error('el 是必须的!')
    if((el||{}).nodeType != 1) throw new Error('el 并不是元素节点对象!')

    _stage = el.ownerDocument.defaultView
    _target = _locate(el)
    referTo(reference)

    const parent = el.parentNode
    if(parent && parent != document.body){
      _targetParent = parent
      const comment = document.createComment(`vpin::${el.dataset['pkey']}`);
      parent.replaceChild(comment, el)

      //转移对象
      reference.nodeName == 'HTML' ? reference.ownerDocument.body.append(el) : reference.append(el)

      if(!placeholderOn) return
      //占位元素
      const placeholder = document.createElement("div")
      placeholder.classList.add("vpin-placeholder")
      placeholder.classList.add(`vpin-placeholder--${el.dataset['pkey']}`)
      placeholder.style.height = _screens.target.height+"px"
      placeholder.style.width = _screens.target.width+"px"
      comment.after(placeholder)
    }
  }
  /**
   * 取消转移
   *
   * @param {*} [el=_target]
   * @param {*} [reference=_reference]
   */
  function untransfer(el=_target, reference=_reference){
    if(typeof el == 'undefined') throw new Error('el 是必须的!')
    if((el||{}).nodeType != 1) throw new Error('el 并不是元素节点对象!')

    _stage = el.ownerDocument.defaultView
    _target = _locate(el)
    referTo(reference)

    var iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_COMMENT);
    var curNode;
    while (curNode = iterator.nextNode()) {
      console.log(curNode.nodeValue, `vpin::${el.dataset['pkey']}`)
      if(curNode.nodeValue.indexOf(`vpin::${el.dataset['pkey']}`) < 0) continue;
      curNode.parentNode.style.height = ""
      curNode.parentNode.style.width = ""
      curNode.parentNode.replaceChild(el, curNode)
    }

    // //移除占位元素
    const placeholder = document.querySelector(`.vpin-placeholder[pkey="${el.dataset['pkey']}"]`)
    if(placeholder) placeholder.remove()
  }

  /** 初始化 */
  _initEvent()
  referTo()
  /** 初始化 */

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
    target: {
      get:()=>_target
    },
    sticky: {
      get:()=>sticky,
      set:val=>{
        sticky=val
        limit=val
      }
    },
    cssEffect: {
      get:()=>cssEffect,
      set:val=>cssEffect=val
    },
    top:{
      get: ()=>offset.top,
      set: val=>{
        if(typeof val == 'undefined') return
        offset.top = val
      }
    },
    bottom:{
      get: ()=>offset.bottom,
      set: val=>{
        if(typeof val == 'undefined') return
        offset.bottom = val
      }
    },
    left:{
      get: ()=>offset.left,
      set: val=>{
        if(typeof val == 'undefined') return
        offset.left = val
      }
    },
    right:{
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
