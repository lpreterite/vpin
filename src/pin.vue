<template>
    <div class="pin" :style="wrapperStyle">
        <div ref="board" class="pin__inner" :style="pinStyle"><slot></slot></div>
    </div>
</template>
<script>
import { offset, rect, effectiveRange, getNodeLocation } from "./utils"
const getContainer = (el='body') =>{
    return document.querySelector(el)
}
export default {
    name: "Pin",
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        dynamic: {
            type: Boolean,
            default: false
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
        },
        offsetX: {
            type: [Number, String],
            default: 0
        },
        offsetY: {
            type: [Number, String],
            default: 0
        },
        scrollWith: {
            type: String,
            default: "" //默认不设置，horizontal 水平滚动， vertical 垂直滚动
        }
    },
    data(){
        const offset = {x:parseInt(this.offsetX)||0, y:parseInt(this.offsetY)||0}
        return {
            is_init: true,
            effective: false,
            offset,
            effectiveArea: {
                x: 0,
                y: 0,
                height: 0,
                width: 0,
                offsetX: 0,
                offsetY: 0
            },
            wrapper: {
                x: 0,
                y: 0,
                height: 0,
                width: 0,
                offsetX: 0,
                offsetY: 0
            },
            board: {
                rect: {
                    x: 0,
                    y: 0,
                    height: 0,
                    width: 0
                },
            },
            style: {
                wrapper: {
                    height: ""
                },
                inner: {
                    top: 0,
                    left: 0,
                    height: ""
                }
            }
        }
    },
    mounted () {
        this.is_init = false
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

            const { effective, insideX, insideY } = effectiveRange(this.wrapper, this.effectiveArea, this.offset)
            this.effective = effective

            if(this.effective){
                this.style.inner.left = window.pageXOffset - this.effectiveArea.offsetX + this.offset.x
                this.style.inner.top = window.pageYOffset - this.effectiveArea.offsetY + this.offset.y
            }else{
                if(!insideX) this.style.inner.left = this.wrapper.offsetX - this.effectiveArea.offsetX
                if(!insideY) this.style.inner.top = this.wrapper.offsetY - this.effectiveArea.offsetY
            }
        },
        update(){
            const $container = this.$parent.$options.name == 'PinContainer' ? this.$parent.$el : getContainer(this.container)

            // update all target location
            this.board.rect = rect(this.$refs.board)
            this.wrapper = getNodeLocation(this.$el)
            this.effectiveArea = getNodeLocation($container)
            // update default style set
            this.style.wrapper.height = this.wrapper.height
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
            const position = ['static','fixed', 'absolute'][!this.is_init ? (this.effective ? (this.fixed ? 1:2) : 2) : 0]
            const top = this.scrollWith == 'vertical' ? (this.fixed ? `${this.effectiveHeight}px` : `${this.style.inner.top}px`) : undefined
            const left = this.scrollWith == 'horizontal' ? (this.fixed ? `${this.effectiveWidth}px` : `${this.style.inner.left}px`) : undefined
            return {
                position,
                top,
                left,
                "z-index": 99,
                ...this.innerStyle
            }
        },
        wrapperStyle(){
            return {
                "height": this.style.wrapper.height + "px"
            }
        }
    },
    watch: {
        offsetX(val){
            this.offset = {...this.offset, x:parseInt(val)}
        },
        offsetY(val){
            this.offset = {...this.offset, y:parseInt(val)}
        }
    }
}
</script>
