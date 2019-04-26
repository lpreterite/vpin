# 设计笔记

## 目的

1.元素B在元素A内部
2.屏幕滚动到元素A的位置后，让元素B跟随屏幕滚动
3.屏幕滚动出元素A的位置后，让元素B停止跟随屏幕滚动

## 解析

首先的说几个点：

1. 基于屏幕定位，元素B使用`position:fixed`定位就能满足，基本不用计算。
2. 基于父级实现屏幕定位，元素B使用`position:absolute`定位，定位基于父级计算给样式的值需要减去元素A基于页面的坐标量
3. 计算加入偏移量，偏移量是基于屏幕给出的，满足固定在屏幕位置需求。没用偏移量只会固定到屏幕原点：`{top:0,left:0}`

参数来源和定义：

- 屏幕滚动坐标使用`window.pageXOffset`和`window.pageYOffset`较为安全（出于兼容性考虑）
- 元素A的位置=触发位置，触发位置加上元素A高宽=有效范围；屏幕滚动到这个平面内元素B才会跟随才会触发计算
- 随屏幕滚动有**基于父级计算**和**基于屏幕计算**两种实现方式
- 基于页面的变量使用`page`前序
- 基于父级的原坐标位置使用`origin`命名
- 偏移量使用`offset`来命名

### 触发位置的计算

其实就是单纯地判断是否在元素A内部，这里需要得出四个点：

- x：元素A基于页面的横坐标
- y：元素A基于页面的纵坐标
- xLimit：元素A横坐标边界：元素A基于页面的X坐标 + 元素A的宽
- yLimit：元素A纵坐标边界：元素A基于页面的Y坐标 + 元素A的高

页面滚动到这四个点的构成的平面内将判断为触发定位

```js
const effective = ( window.pageXOffset > x && window.pageXOffset < xLimit ) || ( window.pageYOffset > y && window.pageYOffset < yLimit )
```

### 屏幕定位

这个用css就能实现

```js
const styleB = {
    top: 0,
    left: 0,
    position: "fixed"
}
```

具体定位在屏幕哪里，给上偏移量就好：

```js
const offset = { x: 50, y: 50 }
const styleB = {
    top: `${offset.y}px`,
    left: `${offset.x}px`,
    position: "fixed"
}
```

### 基于父级实现屏幕定位

元素A、元素B、滚动坐标，首先得搞清楚这三者的关系。

元素A必须是元素B的父级

```js
const styleA = {
    position: "relative"
}
const styleB = {
    position: "absolute"
}
```

由于元素B的定位是基于元素A的，那么计算公式大概是：

```js
const pageA = pageOffset(elA)
const position = {
    x: window.pageXOffset - pageA.x
    y: window.pageYOffset - pageA.y
}
```

加上偏移量：

```js
const offset = { x: 50, y: 50 }
const pageA = pageOffset(elA)
const position = {
    x: window.pageXOffset - pageA.x + offset.x
    y: window.pageYOffset - pageA.y + offset.y
}
```

获取元素B在元素A内部的原始定位：

```js
const pageA = pageOffset(elA)
const pageB = pageOffset(elB)

const originB = { x:pageB.x-pageA.x, y:pageB.y-pageA.y }
```

滚动坐标未曾进入触发位置时，使用默认坐标，进入后使用计算后坐标：

```js
const effective = ( window.pageXOffset > x && window.pageXOffset < xLimit ) || ( window.pageYOffset > y && window.pageYOffset < yLimit )

const styleB = {
    left: window.pageXOffset > x ? position.x : originB.x,
    top: window.pageYOffset > y ? position.y : originB.y
}
```

### 更好的实现

只用屏幕定位并不能满足大多数情况，比如页面滚动至页脚时**侧栏**压在页脚上了。为满足这类情况，需要做到在**有效范围**内才使用屏幕定位(`fiexd`)，在范围外的将退为基于父级定位(`absolute`)，就有比较理想的显示效果。

首先根据是否在有效范围内得出定位方式：

```js
const effective = ( window.pageXOffset > x && window.pageXOffset < xLimit ) || ( window.pageYOffset > y && window.pageYOffset < yLimit )

const styleB = {
    position: effective ? 'fixed':'absolute'
}
```

> 在有效范围时，坐标用偏移值；
> 在未进入有效范围时，坐标使用基于父级的原坐标值；
> 在进入有效范围并离开后，坐标使用基于父级的计算坐标值

```js
const effective = ( window.pageXOffset > x && window.pageXOffset < xLimit ) || ( window.pageYOffset > y && window.pageYOffset < yLimit )

const styleB = {
    position: effective ? 'fixed':'absolute'
    left: effective ? offset.x : (window.pageXOffset > x ? position.x : originB.x),
    top: effective ? offset.y : (window.pageYOffset > y ? position.y : originB.y)
}
```