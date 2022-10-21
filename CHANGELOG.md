# 更新日志

本文件将由[release-it](https://github.com/release-it/release-it)工具根据[约定式提交规范](https://www.conventionalcommits.org/zh-hans/v1.0.0/)下自动产出更新日志内容。

> 更详细内容可查看文章[《自动产出changelog-第二节：自动产出》](https://uxfeel.com/2021/04/13/20210413-auto-changelog-section-two-generate-changelog/)

---



## [1.1.0](https://github.com/lpreterite/vpin/compare/1.0.0...1.1.0) (2022-10-21)


### 📝 Documentation | 文档

* 更改安装插件步骤的代码例子 ([52c9592](https://github.com/lpreterite/vpin/commit/52c95925a3d75ab96c5b40bc73733479ab89a718))


### ✨ Features | 新功能

* 动态计算时被转移的元素原来位置增加占位元素保留空白空间 ([310b930](https://github.com/lpreterite/vpin/commit/310b9307f9b2b6c450e82aef4d68756d8c4bc89f))


### 👷‍ Build System | 构建

* 增加pkg-lock ([74b3512](https://github.com/lpreterite/vpin/commit/74b3512b8d8a0a52d6b8a4fad45da4a81fa91426))

## [1.0.0](https://github.com/lpreterite/vpin/compare/0.2.4...1.0.0) (2022-10-20)


### ⚠ BREAKING CHANGES

* 原组件方式保留旧逻辑，新版以指令方式进行使用，设计上大为改动。

### ♻ Code Refactoring | 代码重构

* 重写计算部分和指令的使用 ([4d1af32](https://github.com/lpreterite/vpin/commit/4d1af32437aa8af34e109a80ab06a623d2ec3854))
* 重写计算部分和指令的使用 ([dbee1bf](https://github.com/lpreterite/vpin/commit/dbee1bf2fb2992a52c07ab3a2adcd19129a86958))


### ✨ Features | 新功能

* 增加支持css计算效果的版本 ([2b98cbd](https://github.com/lpreterite/vpin/commit/2b98cbde85e88413656483b071f1704e97834942))
* 完成范围元素限制内的偏移计算 ([6b3eed1](https://github.com/lpreterite/vpin/commit/6b3eed17e80f0eae42e9ed0c14c4d65ec15f01ae))
* 完成非范围元素时的偏移计算 ([b0dd103](https://github.com/lpreterite/vpin/commit/b0dd1030fd643267f3adb744909c408470bddcdd))
* 改版pin设计，改为指令方式使用 ([ec109ed](https://github.com/lpreterite/vpin/commit/ec109eda352fc66c3e33b8f1427649d7170ab908))
* 更新例子 ([4db48c4](https://github.com/lpreterite/vpin/commit/4db48c4ae168eae30a6be1829e81973d909f9126))
* 范围限制对象为HTML时，偏移值改为基于取窗口宽高值计算 ([f09a7db](https://github.com/lpreterite/vpin/commit/f09a7db4b7638c7a5102e1a4411b8a17b0100be9))


### 📝 Documentation | 文档

* 更新设计笔记 ([5fac57a](https://github.com/lpreterite/vpin/commit/5fac57ad609de5c08e45340a4b24350acee95f3c))
* 更新设计笔记 ([97b8ae7](https://github.com/lpreterite/vpin/commit/97b8ae727afa3bd9a6653624fa665384dbebe8b6))
* 更新说明文档 ([6fb33e8](https://github.com/lpreterite/vpin/commit/6fb33e8bb42c8c434c1985f2da832a15c3061eec))


### 👷‍ Build System | 构建

* 增加编辑器解析配置 ([ed6b9af](https://github.com/lpreterite/vpin/commit/ed6b9af60763c2f33b50d472d5076d33be0d3abf))
* 增加防抖函数 ([aca9fa7](https://github.com/lpreterite/vpin/commit/aca9fa7da92498f6988932d0ff14081193d4a390))
* 更改发布原 ([6070e80](https://github.com/lpreterite/vpin/commit/6070e80a64fd51195491146b793b15ca19d03250))
* 更新构建工具 ([ef57d08](https://github.com/lpreterite/vpin/commit/ef57d08e8efb51d9eeb1d963407b3fdbafc259b3))