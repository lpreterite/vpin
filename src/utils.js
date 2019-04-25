export const offset = (el) => {
    const rect = el.getBoundingClientRect()
    const win = el.ownerDocument.defaultView
    return {
        x: rect.left + win.pageXOffset,
        y: rect.top + win.pageYOffset
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

export const effectiveRange = (target, range, offset={x:0,y:0}) => {
    const insideX = window.pageXOffset > target.offsetX - offset.x
    const insideY = window.pageYOffset > target.offsetY - offset.y
    const insideXLimit = window.pageXOffset + target.width < range.offsetX + range.width - offset.x
    const insideYLimit = window.pageYOffset + target.height < range.offsetY + range.height - offset.y 
    return {
        insideX,
        insideY,
        insideXLimit,
        insideYLimit,
        effective: ( insideX && insideXLimit ) || ( insideY && insideYLimit )
    }
}

export const getNodeLocation = el => {
    const {x:offsetX, y:offsetY} = offset(el)
    return {...rect(el), offsetX, offsetY}
}

export const getContainer = (el='body') =>{
    return document.querySelector(el)
}