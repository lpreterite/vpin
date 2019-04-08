<template>
    <div class="pin" :style="wrapperStyle">
        <div class="pin__inner" :style="pinStyle"><slot></slot></div>
    </div>
</template>
<script>
import { offset, getContainer } from "./utils"
export default {
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
        this.update()
        this.compute()
        this.registerEvent()
    },
    beforeDestroy () {
        this.destroyEvent()
    },
    methods: {
        onScroll(){
            if(this.disabled) return
            this.compute()
        },
        compute(){
            if(this.dynamic) this.update()
            this.followed = window.scrollY - this.containerArea.y - this.location.y + parseInt(this.effectiveHeight) > 0
            this.suspend = window.scrollY + parseInt(this.effectiveHeight) + this.location.height > this.containerArea.y + this.containerArea.height
            if(this.followed && !this.suspend) this.style.inner.top = window.scrollY - this.containerArea.y + parseInt(this.effectiveHeight)
        },
        update(){
            const $container = this.$parent.$options.name == 'PinContainer' ? this.$parent.$el : getContainer(this.container)

            const location = offset(this.$el, $container)
            this.location.x = location.x
            this.location.y = location.y
            this.location.height = this.$el.clientHeight
            this.location.width = this.$el.clientWidth

            const containerOffset = offset($container, document.body)
            this.containerArea.x = containerOffset.x
            this.containerArea.y = containerOffset.y
            this.containerArea.height = $container.clientHeight
            this.containerArea.width = $container.clientWidth

            this.style.wrapper.height = this.$el.clientHeight
        },
        registerEvent(){
            window.addEventListener("scroll", this.onScroll)
        },
        destroyEvent(){
            window.removeEventListener("scroll", this.onScroll)
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
}
</script>
