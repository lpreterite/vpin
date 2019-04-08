const offset = (el, container) => {
    const offset = { x:0, y:0 };
    let _el = el;
    while (_el && _el != container) {
        offset.x += _el.offsetLeft;
        offset.y += _el.offsetTop;
        _el = _el.offsetParent;
    }
    return offset
};
const getContainer = (el='body') =>{
    return document.querySelector(el)
};

//
var script = {
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        dynamic: {
            type: Boolean,
            default: false
        },
        effectiveHeight: {
            type: [Number, String],
            default: 0
        },
        effectiveWidth: {
            type: [Number, String],
            default: 0
        },
        container: {
            type: String,
            default: ()=> 'body'
        },
        fixed: {
            type: Boolean,
            default: false
        },
        innerStyle: {
            type: Object,
            default: ()=>({})
        }
    },
    data(){
        return {
            followed: false, // 当屏幕滚动至组件当前位置时跟随屏幕滚动（效果类似挂在页面上不动了）
            suspend: false, // 当屏幕滚动出组件的父级（PinContainer）时，不再随着屏幕滚动（效果类似挂在页面上的效果失效了一样）
            location: {
                x: 0,
                y: 0,
                height: 0,
                width: 0
            },
            containerArea: {
                x: 0,
                y: 0,
                height: 0,
                width: 0
            },
            style: {
                wrapper: {
                    height: ""
                },
                inner: {
                    top: 0,
                    height: ""
                }
            }
        }
    },
    mounted () {
        this.update();
        this.compute();
        this.registerEvent();
    },
    beforeDestroy () {
        this.destroyEvent();
    },
    methods: {
        onScroll(){
            if(this.disabled) return
            this.compute();
        },
        compute(){
            if(this.dynamic) this.update();
            this.followed = window.scrollY - this.containerArea.y - this.location.y + parseInt(this.effectiveHeight) > 0;
            this.suspend = window.scrollY + parseInt(this.effectiveHeight) + this.location.height > this.containerArea.y + this.containerArea.height;
            if(this.followed && !this.suspend) this.style.inner.top = window.scrollY - this.containerArea.y + parseInt(this.effectiveHeight);
        },
        update(){
            const $container = this.$parent.$options.name == 'PinContainer' ? this.$parent.$el : getContainer(this.container);

            const location = offset(this.$el, $container);
            this.location.x = location.x;
            this.location.y = location.y;
            this.location.height = this.$el.clientHeight;
            this.location.width = this.$el.clientWidth;

            const containerOffset = offset($container, document.body);
            this.containerArea.x = containerOffset.x;
            this.containerArea.y = containerOffset.y;
            this.containerArea.height = $container.clientHeight;
            this.containerArea.width = $container.clientWidth;

            this.style.wrapper.height = this.$el.clientHeight;
        },
        registerEvent(){
            window.addEventListener("scroll", this.onScroll);
        },
        destroyEvent(){
            window.removeEventListener("scroll", this.onScroll);
        }
    },
    computed: {
        pinStyle(){
            return {
                "position": this.followed ? (this.fixed ? "fixed" : "absolute") : "static",
                // "position": this.fixed ? "fixed" : "absolute",
                "top": this.fixed ? `${this.effectiveHeight}px` : `${this.style.inner.top}px`,
                "left": this.effectiveWidth+'px',
                "z-index": 99,
                ...this.innerStyle
            }
        },
        wrapperStyle(){
            return {
                "height": this.style.wrapper.height + "px"
            }
        }
    }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"pin",style:(_vm.wrapperStyle)},[_c('div',{staticClass:"pin__inner",style:(_vm.pinStyle)},[_vm._t("default")],2)])};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var pin = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

export default pin;
export { getContainer, offset };
