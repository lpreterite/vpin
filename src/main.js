import Pin from "./components/Pin.vue"
import PinContainer from "./components/PinContainer.vue"
export * from "./utils"
export const components = { Pin, PinContainer }

import directive from "./directives"

export default function({prefix="",debug}={}){
  return {
    install(Vue){
      const components = {
          Pin,
          PinContainer
      }
      Object.keys(components).forEach(key => {
          const component = components[key];
          Vue.component(prefix+component.name, component);
      });

      Vue.directive("pin", directive({debug}))
    }
  }
}
