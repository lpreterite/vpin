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
        x: rect.x,
        y: rect.y,
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