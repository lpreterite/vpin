# vpin

[![npm version](https://img.shields.io/npm/v/vpin.svg)](https://www.npmjs.com/package/vpin)
[![vue2](https://img.shields.io/badge/vue-2.6+-brightgreen.svg)](https://vuejs.org/)
[![NPM downloads](http://img.shields.io/npm/dm/vpin.svg)](https://www.npmjs.com/package/vpin)

## 介绍

基于 vue 的钉子组件，帮助你把内容固定到屏幕中。

## 具体功能

- 当屏幕滚动过组件位置，组件会根据设置固定在屏幕的相对位置上
- 当屏幕滚动过pin组件的父级组件，pin组件不会再固定于屏幕的相对位置上，固定功能将会失效

## 如何安装

```sh
npm install -S vpin
```

## 引入项目

```js
import Vue from "vue"
import vpin from "vpin"

Vue.use(vpin)
```

## 使用

```html
<template>
    <section class="container">
        <header>
            <div class="brand"></div>
            <div class="account"></div>
        </header>
        <PinContainer class="inner">
            <nav class="nav">
                <Pin>
                    <ul>
                        <li><a href="#">仪表盘</a></li>
                        <li><a href="#">图片管理</a></li>
                        <li><a href="#">文章管理</a></li>
                        <li><a href="#">用户管理</a></li>
                    </ul>
                </Pin>
            </nav>
            <div class="main">内容</div>
        </PinContainer>
    </section>
</template>
```

### 包含属性(Props)

| 名称            | 限制             | 描述                                                                                                |
| --------------- | ---------------- | --------------------------------------------------------------------------------------------------- |
| disabled        | [Boolean]        | default: false； 盯在屏幕功能是否失效                                                               |
| dynamic         | [Boolean]        | default: false；是否动态计算；开启后会在 window.onscroll 事件中触发 container 和 pin 组件位置到计算 |
| effectiveHeight | [String] [Number] | default: 0；相对于屏幕的 Y 轴定位(top)                                                              |
| effectiveWidth  | [String] [Number] | default: 0；相对于屏幕的 X 轴定位(left)                                                             |
| container       | [String]         | default: 'body';计算定位的父级元素标签，如果父级有使用`PinContainer`包裹，则会默认使用其为父级      |
| fixed           | [Boolean]        | default: false; 是否开启基于屏幕定位计算                                                            |
| innerStyle      | [Object]         | default: {}; 盯在屏幕的元素的额外样式                                                               |
