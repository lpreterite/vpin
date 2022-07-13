import { Pin } from "./utils"

export default function({debug=false}=opts) {

    let els = []
    // const pin = new Pin()
    if(debug) window.pins = els

    function setting(pin,binding){
      const { offset:offsetOn } = binding.modifiers || {}
      const { throttleOn, throttleWait, offsetTop, offsetBottom, offsetLeft, offsetRight, container, reference, limit } = binding.value || {}
      pin.throttleOn = throttleOn
      pin.throttleWait = throttleWait
      pin.offsetOn = offsetOn
      pin.offsetTop = offsetTop
      pin.offsetBottom = offsetBottom
      pin.offsetLeft = offsetLeft
      pin.offsetRight = offsetRight
      pin.limit = limit
      if(typeof container != 'undefined') pin.container = container
      if(typeof reference != 'undefined') pin.reference = reference
    }

    function bind(el, binding){
      console.log("bind")
      const pkey = `${el.nodeName}${el.className?'.'+el.className:''}`
      el.dataset['pkey'] = pkey
      els.push([pkey, new Pin({target:el})])
    }

    function inserted(el,binding){
      console.log("inserted")

      const index = els.findIndex(([key])=>key==el.dataset['pkey'])
      const [_,pin] = els[index]
      setting(pin, binding)

      pin.transfer(el)
      pin.pinUp(el, {zIndex:999+index})
    }

    function update(el, binding){
      console.log("update")

      const index = els.findIndex(([key])=>key==el.dataset['pkey'])
      const [_,pin] = els[index]
      setting(pin, binding)

      pin.transfer(el)
      pin.pinUp(el, {zIndex:999+index})
    }

    function unbind(el){
      console.log("unbind")

      const index = els.findIndex(([key])=>key==el.dataset['pkey'])
      const [_,pin] = els[index]
      els.splice(index, 1)

      pin.destroy()
    }

    return {
        bind,
        inserted,
        update,
        unbind
    }
}
