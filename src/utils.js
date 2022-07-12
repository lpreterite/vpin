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
  const _stage = window
       ,_screens={
          target: { x:0, y:0, width:0, height:0 },
          container: { x:0, y:0, width:0, height:0 },
       }
       ,_events = {
          resize: undefined,
          scroll: undefined
      }
  let _targetParent;

  let {
    container,
    target,
    fixed=false,
    throttleOn=false,
    throttleWait=250,
    originPoint={x:0,y:0},
    offsetOn=false,
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
    _render()
  }

  function _onResize(event){
    _locate(_target)
    _render()
  }

  function _render(){
    if(fixed) return

    const _offset = _offsetFormula(_screens.target, _screens.container, offset)
    // console.log("_render", _offset)
    // const offsetX = _reference.scrollLeft > _screens.container.x ? _reference.scrollLeft + _offset.x : _screens.target.x
    // const offsetY = _reference.scrollTop > _screens.container.y ? _reference.scrollTop + _offset.y : _screens.target.y
    const offsetX = _reference.scrollLeft + _offset.x
    const offsetY = _reference.scrollTop + _offset.y

    const movementX = Math.max(_screens.container.x, Math.min(_screens.container.x+_screens.container.width, offsetX))
    const movementY = Math.max(_screens.container.y, Math.min(_screens.container.y+_screens.container.height, offsetY))

    _target.style.position = "absolute"
    // if(_reference.scrollLeft >= _screens.container.x){
      _target.style.left = `${movementX}px`
    // }
    // if(_reference.scrollTop >= _screens.container.y){
      _target.style.top = `${movementY}px`
    // }
    _target.style.bottom = "auto"
    _target.style.right = "auto"
  }

  function _locateContainer(el){// 获得位置信息
    const rect = el.getBoundingClientRect()

    // 登记基于参照物的位置信息
    _screens.container.x = _reference.scrollLeft + rect.x
    _screens.container.y = _reference.scrollTop + rect.y
    _screens.container.height = rect.height
    _screens.container.width = rect.width
  }

  /**
   * 根据范围元素计算偏移量
   *
   * @param {*} target
   * @param {*} container
   * @param {*} offset
   * @returns
   */
  function _offsetFormula(target, container, offset){
    const xFormula = [
      container.x + offset.left, //按Left偏移计算
      container.x + container.width - offset.right,  //按Right偏移计算
      target.x //按元素当前位置计算
    ][
      [
        Number.isNaN(offset.left) && Number.isNaN(offset.right) ? 2 : false,
        Number.isNaN(offset.left) ? false : 0,
        Number.isNaN(offset.right) ? false : 1,
      ].filter(val=>val!=false).reduce((prev,next)=>prev+next,0)
    ]
    const yFormula = [
      container.y + offset.top, //按Top偏移计算
      container.y + container.height - offset.bottom,  //按Bottom偏移计算
      target.y //按元素当前位置计算
    ][
      [
        Number.isNaN(offset.top) && Number.isNaN(offset.bottom) ? 2 : false,
        Number.isNaN(offset.top) ? false : 0,
        Number.isNaN(offset.bottom) ? false : 1,
      ].filter(val=>val!=false).reduce((prev,next)=>prev+next,0)
    ]

    return {
      x: xFormula,
      y: yFormula
    }
  }

  /**
   * 度量位置大小
   *
   * @param {*} el
   * @param {number} [zIndex=999]
   * @returns
   */
  function _locate(el, zIndex=999){
    // 清空定位样式，使其按默认样式进行布局
    el.style.position = ""
    el.style.top = ""
    el.style.left = ""
    el.style.bottom = ""
    el.style.right = ""
    el.style.height = ""
    el.style.width = ""

    // 获得位置信息
    const rect = el.getBoundingClientRect()

    if(offsetOn){
      const _offset = _offsetFormula(rect, _screens.container,offset)

      // 登记基于参照物的位置信息
      _screens.target.x = _reference.scrollLeft + _offset.x
      _screens.target.y = _reference.scrollTop + _offset.y
      _screens.target.height = rect.height
      _screens.target.width = rect.width
    }else{
      // 登记基于参照物的位置信息
      _screens.target.x = _reference.scrollLeft + rect.x
      _screens.target.y = _reference.scrollTop + rect.y
      _screens.target.height = rect.height
      _screens.target.width = rect.width
    }

    // 重新给与定位样式设置
    if(fixed){
      el.style.position = "fixed"
      el.style.top = rect.y+"px"
      el.style.left = rect.x+"px"
      el.style.bottom = "auto"
      el.style.right = "auto"
    }else{
      el.style.position = "absolute"
      el.style.top = `${_screens.target.y}px`
      el.style.left = `${_screens.target.x}px`
      el.style.bottom = "auto"
      el.style.right = "auto"
      el.style.height = `${_screens.target.height}px`
      el.style.width = `${_screens.target.width}px`
    }
    el.style.zIndex = zIndex

    return el
  }

  function destroy(){
    // const nodeIterator = document.createNodeIterator(
    //     _reference,
    //     NodeFilter.SHOW_COMMENT
    // );
    // while (nodeIterator.nextNode()) {
    //   const commentNode = nodeIterator.referenceNode
    //   console.log(commentNode,commentNode.parentNode,_targetParent)
    //   if(commentNode.textContent!=`vpin::${_target.dataset['pkey']}`) continue;
    //   // commentNode.parentNode.replaceChild(_targetParent, commentNode);
    //   _targetParent.replaceChild(_target, commentNode)
    // }
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
    _locateContainer(val)
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
    _unBindEvent()
    _bindEvent()
    return ctx
  }

  let _target;
  function pinUp(el, options={}){
    if(typeof el == 'undefined') throw new Error('el 是必须的!')
    if((el||{}).nodeType != 1) throw new Error('el 并不是元素节点对象!')

    _target = el

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

    _target = _locate(el)

    const parent = el.parentNode
    if(parent && parent != document.body){
      _targetParent = parent
      // const comment = document.createComment(`vpin::${el.dataset['pkey']}`);
      // parent.replaceChild(comment, el)
      const placeholder = document.createElement("div")
      placeholder.style.display = "none"
      placeholder.classList.add("vpin-placeholder")
      placeholder.classList.add(`vpin-placeholder--${el.dataset['pkey']}`)
      parent.replaceChild(placeholder, el)
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
    // target: {
    //   get:()=>target,
    //   set:val=>{
    //     target=val
    //     _updateScreen('target', val)
    //     // console.log(screenOpts.target, val.getBoundingClientRect())
    //   }
    // },
    offsetOn: {
      get:()=>offsetOn,
      set:val=>{
        if(typeof val == 'undefined') return
        offsetOn=val
      }
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
    fixed: {
      get:()=>fixed,
      set:val=>{
        if(typeof val == 'undefined') return
        fixed=val
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
    // originPointX: {
    //   get:()=>originPoint.x,
    //   set:val=>originPoint.x=val
    // },
    // originPointY: {
    //   get:()=>originPoint.y,
    //   set:val=>originPoint.y=val
    // },
  })
  return ctx
}
