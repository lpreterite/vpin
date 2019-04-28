<template>
    <div class="pin" :style="wrapperStyle">
        <div ref="board" class="pin__inner" :style="pinStyle"><slot></slot></div>
    </div>
</template>
<script>
import { offset, matchRange, getNodeLocation } from "./utils"
const getContainer = (el='body') =>{
    return document.querySelector(el)
}
const rangeSchema = ()=>({ x: 0, y: 0, height: 0, width: 0, offsetX: 0, offsetY: 0 })
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
            default: true
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
            default: "vertical" //horizontal 水平滚动， vertical 垂直滚动，不设置将使用offset的值
        }
    },
    data(){
        return {
            is_init: true,
            effective: false,
            offset: {x:parseInt(this.offsetX)||0, y:parseInt(this.offsetY)||0},
            effectiveArea: rangeSchema(),
            wrapper: rangeSchema(),
            board: rangeSchema(),
            origin: {x:0,y:0},
            style: {
                wrapper: {
                    height: ""
                },
                inner: {
                    position: "static",
                    top: 0,
                    left: 0,
                    height: "auto",
                    width: "auto"
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

            const { effective, x, y, xLimit, yLimit } = matchRange(this.wrapper, this.effectiveArea, this.offset) //基于页面坐标计算位置，并反馈是否在特定范围内
            this.effective = effective

            this.style.inner.position = ['fixed', 'absolute'][this.effective && this.fixed ? 0:1]
            const movement = {
                x: Math.min(Math.max(this.origin.x, window.pageXOffset - this.effectiveArea.offsetX + this.offset.x), xLimit),
                y: Math.min(Math.max(this.origin.y, window.pageYOffset - this.effectiveArea.offsetY + this.offset.y), yLimit)
            }

            if(this.style.inner.position === 'fixed'){
                this.style.inner.left = this.scrollWith == 'vertical' ? this.wrapper.offsetX : this.offset.x
                this.style.inner.top = this.scrollWith == 'horizontal' ? this.wrapper.offsetY : this.offset.y
            }else if(effective){ //生效才基于滚动计算位置
                this.style.inner.left = movement.x
                this.style.inner.top = movement.y
            }else{ //失效时进入，这里有两种情况：1未曾生效; 2曾生效又出去范围后失效
                this.style.inner.left = window.pageXOffset > x ? Math.min(movement.x, xLimit) : this.origin.x
                this.style.inner.top = window.pageYOffset > y ? Math.min(movement.y, yLimit) : this.origin.y
            }
        },
        update(){
            const $container = this.$parent.$options.name == 'PinContainer' ? this.$parent.$el : getContainer(this.container)

            // update all target location
            this.board = getNodeLocation(this.$refs.board)
            this.wrapper = getNodeLocation(this.$el)
            this.effectiveArea = getNodeLocation($container)
            this.origin = {x:this.wrapper.x-this.effectiveArea.x,y:this.wrapper.y-this.effectiveArea.y}
            // update default style set
            this.style.wrapper.height = this.board.height
            this.style.inner.height =  this.board.height
            this.style.inner.width =  this.board.width
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
            const position = this.style.inner.position
            const top = `${this.style.inner.top}px`
            const left = `${this.style.inner.left}px`
            const height = `${this.style.inner.height}px`
            const width = `${this.style.inner.width}px`
            return {
                position,
                top,
                left,
                width,
                height,
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
