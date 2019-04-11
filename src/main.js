import Pin from "./Pin.vue"
import PinContainer from "./PinContainer.vue"
export * from "./utils"
export { Pin, PinContainer }

class VuePlugin{
    constructor(){
        const { prefix } = { prefix: "" }
        this.prefix = prefix;
    }
    install(Vue, options={}){
        const prefix = options.prefix || this.prefix
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

export default new VuePlugin()