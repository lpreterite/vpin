# 设计笔记

再次修改设计！

这次设计关注点是“基于屏幕定位”、“基于父级实现屏幕定位”，以及这两种不同定位下的计算方式。

最终vpin只能满足于滚动时基于屏幕固定元素。以及在某元素中生效，固定元素移动至范围元素边缘时，固定效果失效，最后会随着页面滚动。

由于当时设计思路比较混乱，未做好各个要素的定义，比如上面提及到的：

- 屏幕，即window。
- 固定元素，滚动时以屏幕作为参照物，现不动的效果。
- 范围元素，固定效果的生效范围，默认为Document。可设置为其他元素，固定元素移动至范围边界外时固定效果失效。

上一份笔记更多的记录是计算的转换思路，比如看似固定的元素，实则是移动的，需要根据滚动不断更新其位置，坐标参数是基于范围元素的绝对坐标来计算的，也记录了基于屏幕进行计算时需要考虑的思路。

此次笔记将按照上述内容，按参照元素、固定元素、范围元素等定义下进行思路上的整理。

## 场景

固定元素的场景有以下两种：

1. 顶栏导航。滚动页面时，顶栏一直在屏幕的上方。
2. 固定的文章边栏。滚动浏览正文内容时，右侧内容位置固定不变。
3. 内容介绍页面中的二级栏目。位置在介绍内容下方，且随着滚动会自动高亮对应栏目。页面向上滚动时，栏目接近屏幕顶部时将会固定。当页面向下滚动回到栏目原来位置时，栏目将变回随着页面移动。

总结下来就是：参照物固定是屏幕。下面是不同场景下的要素及边界。

- 场景1：固定元素是顶栏导航。生效范围是整个Document。
- 场景2：固定元素是文章边栏。生效范围是除页头、页脚后的区域。
- 场景3：固定元素是二级栏目。生效范围是二级栏目至栏目下内容的区域。

## 计算

视觉效果中固定元素参考物是屏幕，实际计算时固定元素实际基于文档(Document)来移动，不动的却是文档（Document）。由此逻辑来推理各个计算要素的性质：

- 屏幕宽高：常量，在定位计算过程中是不变的。
- 屏幕滚动位置：变量，在滚动时就会有变化。
- 文档宽高：常量，在定位计算过程中一般是不变的，除非有元素撑高导致变化。
- 固定元素宽高：常量，在定位计算过程中一般是不变的。
- 固定元素位置：变量，通过[Element.getBoundingClientRect()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)方法获得相对于屏幕的位置。

计算后的固定元素位置：根据元素`position`样式不同影响其值的计算是不同的。具体看下面 固定元素位置定位计算情况。

### 固定元素位置定位计算情况

元素样式定位决定了它坐标值对应于那个参照物进行计算，具体有以下状况：

- `position: absolute`，以Document为准的绝对定位。
  - 有效范围：
    - start：`(0,0)`
    - end：`(document.body.clientWidth,document.body.clientHeight)`
  - 定位坐标：
    - start：`(window.pageXOffset + rect.x, window.pageYOffset + rect.y)`
    - end：：`(window.pageXOffset + rect.x + rect.width, window.pageYOffset + rect.y + rect.height)`
- `position: absolute`，以父级元素为准的绝对定位。
  - 有效范围：
    - start：`(window.pageXOffset + parentRect.x, window.pageYOffset + parentRect.y)`
    - end：：`(window.pageXOffset + parentRect.x + parentRect.width, window.pageYOffset + parentRect.y + parentRect.height)`
  - 定位坐标：
    - start：`(window.pageXOffset + parentRect.x - window.pageXOffset - rect.x, window.pageYOffset + parentRect.y - window.pageYOffset - rect.y)`
    - end：：`(window.pageXOffset + parentRect.x + parentRect.width - window.pageXOffset - rect.x - rect.width, window.pageYOffset + parentRect.y + parentRect.height - window.pageYOffset - rect.y - rect.height)`
- `position: fixed`，以屏幕为准的绝对定位。
  - 有效范围：屏幕本身
  - 定位坐标：
    - start：`(rect.x, rect.y)`
    - end：`(rect.x+rect.width, rect.y+rect.height)`
