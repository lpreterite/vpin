import Pin from "./components/Pin.vue"
import PinContainer from "./components/PinContainer.vue"
export * from "./utils"
export { Pin, PinContainer }

export default function({prefix=""}={}){
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
    }
  }
}
