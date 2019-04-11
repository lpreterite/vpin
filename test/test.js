// 从测试实用工具集中导入 `mount()` 方法
// 同时导入你要测试的组件
import { mount } from '@vue/test-utils'
import pin from '..'

// // 现在挂载组件，你便得到了这个包裹器
// const wrapper = mount(pin)

// // 你可以通过 `wrapper.vm` 访问实际的 Vue 实例
// const vm = wrapper.vm

// // 在控制台将其记录下来即可深度审阅包裹器
// // 我们对 Vue Test Utils 的探索也由此开始
// console.log(wrapper)

describe('Counter', () => {
    // 现在挂载组件，你便得到了这个包裹器
    const wrapper = mount(pin)

    it('renders the correct markup', () => {
        expect(wrapper.html()).toContain('<span class="count">0</span>')
    })

    // 也便于检查已存在的元素
    it('has a button', () => {
        expect(wrapper.contains('button')).toBe(true)
    })
})