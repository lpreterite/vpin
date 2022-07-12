import { Pin } from "./utils"

export default function({debug=false}=opts) {

    let els = [] //保留querySelector搜索的唯一键，比如：[data-pkey="141433"]
    const pin = new Pin()
    if(debug) window.pin = pin

    function setting(binding){
      const { fixed, offset:offsetOn } = binding.modifiers || {}
      const { throttleOn, throttleWait, offsetTop, offsetBottom, offsetLeft, offsetRight } = binding.value || {}
      pin.fixed = fixed
      pin.throttleOn = throttleOn
      pin.throttleWait = throttleWait
      pin.offsetOn = offsetOn
      pin.offsetTop = offsetTop
      pin.offsetBottom = offsetBottom
      pin.offsetLeft = offsetLeft
      pin.offsetRight = offsetRight
    }

    function bind(el, binding){
      console.log("bind")
      const pkey = `${el.nodeName}${el.className?'.'+el.className:''}`
      el.dataset['pkey'] = pkey
      els.push(pkey)

      setting(binding)
    }

    function inserted(el,binding){
      console.log("inserted")
      const { container } = binding.value || {}
      pin.containsIn(container)
      pin.transfer(el)
      pin.referTo()
      pin.pinUp(el, {zIndex:999+els.indexOf(el.dataset['pkey'])})
    }

    function update(el, binding){
      console.log("update")

      setting(binding)

      const { container } = binding.value || {}
      pin.containsIn(container)
      pin.pinUp(el, {zIndex:999+els.indexOf(el.dataset['pkey'])})
    }

    function unbind(el){
      console.log("unbind")
      // el.remove()
      els.splice(els.indexOf(el.dataset['pkey']), 1)

      pin.destroy()
    }

    return {
        bind,
        inserted,
        update,
        unbind
    }
}
