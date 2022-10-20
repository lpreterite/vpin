# vpin

[![npm version](https://img.shields.io/npm/v/vpin.svg)](https://www.npmjs.com/package/vpin)
[![vue2](https://img.shields.io/badge/vue-2.6+-brightgreen.svg)](https://vuejs.org/)
[![NPM downloads](http://img.shields.io/npm/dm/vpin.svg)](https://www.npmjs.com/package/vpin)

## 介绍

基于 vue 的钉子组件，帮助你把内容固定到屏幕中 📌。

## 具体效果与功能

- 核心功能就是把块固定于屏幕，滚动时不会随着内容滚动。
- 支持动态计算定位，参照物默认为窗口。
- 支持粘性定位，会根据范围对象开启固定效果。[^1]
- 可选择基于css实现效果，性能消耗低和效果更好。

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
        <div class="inner">
            <nav>
              <!-- 根据容器范围开启定位，定位后需要保留原位置空位 -->
              <div class="nav" v-pin.sticky.cssEffect="{ container:'.inner>nav', top:0, left:0 }">
                <ul>
                  <li><a href="#学而篇">学而篇</a></li>
                  <li><a href="#为政篇">为政篇</a></li>
                  <li><a href="#里仁篇">里仁篇</a></li>
                </ul>
              </div>
            </nav>
            <div class="main">内容</div>
        </div>
        <!-- 页脚基于样式的定位作为参考，来进行后续滚动跟随。 -->
        <footer class="footer" v-pin.cssEffect="{bottom:0}">
          &copy; 2022 PackyTang
        </footer>
    </section>
</template>
```

### 包含属性(Props)

| 名称                                             | 限制              | 描述                                                                                                                                   |
|--------------------------------------------------|-------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `v-pin.sticky`                                   | [Boolean]         | 默认值为`false`,是否开启粘性定位效果，设置后开启。                                                                                       |
| `v-pin.cssEffect`                                | [Boolean]         | 默认值为`false`,是否使用CSS效果代替动态计算，设置后开启。<br> 开启后，默认搬运定位对象至body的行为会取消，定位对象的DOM结构不变。             |
| `v-pin="{ container:document.documentElement }"` | [String, Element] | 范围对象，默认值为`HTML DOM对象`，范围对象用于计算生效范围，一般与粘性定位效果共同使用 。                                                  |
| `v-pin="{ reference:document.documentElement }"` | [String, Element] | 参照对象，默认值为`HTML DOM对象`，参照对象用于监听滚动事件，通过动态实现定位。滚动视窗不是浏览器窗口本身时，指定此对象可实现元素内滚动定位。 |
| `v-pin="{ top:0,left:0,right:0,bottom:0 }"`      | [Number]          | 偏移量，默认值为`Number.NaN`。                                                                                                           |

## 例子1

使用CSS实现的使用粘性定位。✨推荐！

```html
<template>
    <section class="container">
        <header>
            <div class="brand"></div>
            <div class="account"></div>
        </header>
        <div class="inner">
            <nav>
              <!-- 根据容器范围开启定位，定位后需要保留原位置空位 -->
              <div class="nav" v-pin.sticky.cssEffect="{ container:'.inner>nav', top:0, left:0 }">
                <ul>
                  <li><a href="#学而篇">学而篇</a></li>
                  <li><a href="#为政篇">为政篇</a></li>
                  <li><a href="#里仁篇">里仁篇</a></li>
                </ul>
              </div>
            </nav>
            <div class="main">内容</div>
        </div>
    </section>
</template>
```

## 例子2

使用CSS实现的固定至底部效果。

```html
<template>
    <section class="container">
        <header>
            <div class="brand"></div>
            <div class="account"></div>
        </header>
        <div class="inner">
            <nav>
              <!-- 根据容器范围开启定位，定位后需要保留原位置空位 -->
              <div class="nav" v-pin.sticky="{ container:'.inner>nav', top:0, left:0 }">
                <ul>
                  <li><a href="#学而篇">学而篇</a></li>
                  <li><a href="#为政篇">为政篇</a></li>
                  <li><a href="#里仁篇">里仁篇</a></li>
                </ul>
              </div>
            </nav>
            <div class="main">内容</div>
        </div>
        <!-- 页脚基于样式的定位作为参考，来进行后续滚动跟随。 -->
        <footer class="footer" v-pin.cssEffect="{bottom:0}">
          &copy; 2022 PackyTang
        </footer>
    </section>
</template>
```


## Develop

本地调试

```sh
$ npm run serve
# or
$ yarn serve
```


[^1]: 粘性定位见[`position: sticky;`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)
