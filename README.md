# vpin

[![npm version](https://img.shields.io/npm/v/vpin.svg)](https://www.npmjs.com/package/vpin)
[![vue2](https://img.shields.io/badge/vue-2.6+-brightgreen.svg)](https://vuejs.org/)
[![NPM downloads](http://img.shields.io/npm/dm/vpin.svg)](https://www.npmjs.com/package/vpin)

## 介绍

基于 vue 的钉子组件，帮助你把内容固定到屏幕中 📌。

## 具体功能

-   当屏幕滚动过组件位置，组件会根据设置固定在屏幕的相对位置上
-   当屏幕滚动过 pin 组件的父级组件，pin 组件不会再固定于屏幕的相对位置上，固定功能将会失效

[线上例子](https://codepen.io/packy1980/pen/RmrNQm#0)

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

| 名称              | 限制             | 描述                                                                                                                                                         |
| ----------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| disabled          | [Boolean]        | default: false；钉在屏幕功能是否失效                                                                                                                         |
| dynamic           | [Boolean]        | default: false；是否动态计算；开启后会在 window.onscroll 事件中触发 container 和 pin 组件位置到计算                                                          |
| offsetX           | [String][number] | default: 0；相对于屏幕的 Y 轴定位(top)的偏移值                                                                                                               |
| offsetY           | [String][number] | default: 0；相对于屏幕的 X 轴定位(left)的偏移值                                                                                                              |
| container         | [String]         | default: 'body';计算定位的父级元素标签，如果父级有使用`PinContainer`包裹，则会默认使用其为父级                                                               |
| fixed             | [Boolean]        | default: true; 是否开启基于屏幕定位计算                                                                                                                      |
| innerStyle        | [Object]         | default: {}; 钉在屏幕的元素的额外样式                                                                                                                        |
| scrollWith(`new`) | [String]         | default: "vertical", 可选 `horizontal` 水平滚动， `vertical` 垂直滚动; 根据滚动方向进行定位处理，只用于`fixed`为`true`时，不期望做任何优化时，可存入空字符。 |
| overflow(`new`)   | [Boolean]        | default: false, 出范围后是否继续钉在屏幕；设置`true`后当超出范围后将继续钉在屏幕上                                                                           |

### 包含函数

#### offset

获取元素基于页面的定位

| 参数 | 限制                 | 描述         |
| ---- | -------------------- | ------------ |
| el   | 必须；[HTML Element] | 要计算的元素 |

用法

```js
import { offset } from "vpin"
const _offset = offset(document.querySelector(".pin"))
console.log(_offset)
// {x: 0, y: 0}
```

#### getNodeLocation

获取元素位置

| 参数 | 限制                 | 描述         |
| ---- | -------------------- | ------------ |
| el   | 必须，[HTML Element] | 要计算的元素 |

用法

```js
import { getNodeLocation } from "vpin"
const _location = getNodeLocation(document.querySelector(".pin"))
console.log(_location)
// { x: 0, y: 0, height: 0, width: 0, offsetX: 0, offsetY: 0 }
```

#### matchRange

匹配有效范围

| 参数   | 限制           | 描述                                                                                  |
| ------ | -------------- | ------------------------------------------------------------------------------------- |
| target | 必须；[Object] | 要测试对象，包含以下字段`{ x: 0, y: 0, height: 0, width: 0, offsetX: 0, offsetY: 0 }` |
| range  | 必须；[Object] | 有效范围，包含以下字段`{ x: 0, y: 0, height: 0, width: 0, offsetX: 0, offsetY: 0 }`   |
| offset | 可选；[Object] | 偏移量，包含以下字段`{ x: 0, y: 0 }`                                                  |

用法

```js
import { matchRange } from "vpin"
const { effective, x, y, xLimit, yLimit } = matchRange({}, {})
console.log(`是否在有效范围：%s; 范围：%s, %s, %s, %s`, effective ? "是" : "否", x, y, xLimit, yLimit)
```

## Develop

本地调试

```sh
$ npm run serve
# or
$ yarn serve
```
