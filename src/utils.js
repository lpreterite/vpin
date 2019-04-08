export const offset = (el, container) => {
    const offset = { x:0, y:0 }
    let _el = el;
    while (_el && _el != container) {
        offset.x += _el.offsetLeft
        offset.y += _el.offsetTop
        _el = _el.offsetParent
    }
    return offset
}
export const getContainer = (el='body') =>{
    return document.querySelector(el)
}