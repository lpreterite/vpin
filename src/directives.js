import { Pin } from "./utils"

export default function({debug=false}=opts) {

    let els = []
    // const pin = new Pin()
    if(debug) window.pins = els

    function setting(pin,binding){
      const { sticky,cssEffect } = binding.modifiers || {}
      const { throttleOn, throttleWait, top, bottom, left, right, container, reference, limit } = binding.value || {}
      pin.throttleOn = throttleOn
      pin.throttleWait = throttleWait
      pin.sticky = sticky
      pin.cssEffect = cssEffect
      pin.top = top
      pin.bottom = bottom
      pin.left = left
      pin.right = right
      pin.limit = limit
      if(typeof container != 'undefined') pin.container = container
      if(typeof reference != 'undefined') pin.reference = reference
    }

    function _transfer(pin){
      return el =>{
        if(pin.cssEffect) pin.untransfer(el)
        else pin.transfer(el)
      }
    }

    function bind(el, binding){
      const pkey = `${el.nodeName.toLowerCase()}${el.className?'.'+el.className:''}`
      el.dataset['pkey'] = pkey
      els.push([pkey, new Pin({target:el})])
    }

    function inserted(el,binding){
      const index = els.findIndex(([key])=>key==el.dataset['pkey'])
      const [_,pin] = els[index]
      setting(pin, binding)

      _transfer(pin)(el)
      pin.pinUp(el, {zIndex:999+index})
    }

    function update(el, binding){
      const index = els.findIndex(([key])=>key==el.dataset['pkey'])
      const [_,pin] = els[index]
      setting(pin, binding)

      _transfer(pin)(el)
      pin.pinUp(el, {zIndex:999+index})
    }

    function unbind(el){
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
