# BPMN 流程编辑器

其它语言: [English](README.md)

本工程是一个流程编辑器的例子。它基于 bpmn-js 开发，并根据我自己的需要定制。它并不是一个完整的项目，仅用于展示和学习。因为我使用 Vue.js 开发，所以你需要知道一些 Vue.js 的知识来阅读和理解源代码。

## 功能

- 编辑: 使用简单的拖动和点击创建一个流程图。![gif](screencast1.gif)
- 保存 & 读取: 保存/读取自定义的 BPMN XML。![gif](screencast2.gif)
- 属性面板: 可扩展的节点属性编辑面板, 绑定属性 JSON 到 XML 模型。![gif](screencast3.gif)
- 动画效果: 为节点展示任意的 CSS 样式动画。![gif](screencast4.gif)

## 开始

```sh
git clone https://github.com/Pingren/BPMNFlowEditor
cd BPMNFlowEditor
yarn & yarn serve
```

## 解释

### 目录结构

- [`components`]
  - [`moudle`]
    - [`xxx.js...`] 自定义 BPMN.js 模块
    - [`index.js`] 自定义模块帮助文件 & 禁用一些默认模块
  - [`BPMNEditor`] 带有主要功能的图编辑器
  - [`DatabasePicker.vue`] 一个节点列表选择器
  - [`OperatorPicker.vue`] 一个节点树形选择器
  - [`PaneLeft.vue`] 左侧面板, 包含 `DatabasePicker` & `OperatorPicker`
  - [`PaneProperty.vue`] 一个可扩展的属性面板
  - [`PaneRight.vue`] 右侧面板, 包含 `PaneProperty`
- [`App.vue`] 主程序, 包含 `PaneLeft` & `BPMNEditor` & `PaneRight`
- [`mock.js`] 模拟后端返回的数据

### 实现

#### 拖拽节点

- 在 `DatabasePicker` & `OperatorPicker` 内允许拖拽。
- 在 `bpmnModeler`的 div 容器监听 `drop` 事件. 请阅读 [HTML 拖放 API](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API)。
- 使用 bpmn-js-cli `create()` 方法在拖放位置（如果画布本身被拖动过，也将计算画布的 offset）创建元素。
- 设置节点标签和 operator/database ID(注意: 这个 `ID` 与图内唯一的节点 `id` 不同)
- 调用 `getTextWidth()` 来计算标签宽度，为元素设置新的宽和高。
- 使用 `interactionEvents` 来选择节点, 因此右侧面盘也会相应地更新。

#### 属性面板

- operators 可能会有可以编辑的属性。请查看 `mock.js` 中的 `operatorList`。
- 当在图中选择一个节点，属性面板的表单会根据 `props` 的配置变化。
- 当属性修改的时候，它会保存 `JSON.stringnify`过的表单数据到 `PROPERTY` 内。
- 双击节点会展示它的信息和处理过的 `PROPERTY`。

#### 动画效果

- 动画通过 bpmn-js 的 `overlays` 实现。它基于节点所以有局限性。
- 添加一些 CSS 样式，并在需要时调用方法添加/删除 overlays。
- 通过 `clearSymbols()` 来删除所有的 overlays.

## 问题

暂时没有，欢迎问题和建议！

## 项目依赖

- [bpmn-js](https://github.com/bpmn-io/bpmn-js) - 本项目的主要依赖。
- [bpmn-js-cli](https://github.com/bpmn-io/bpmn-js-cli) - 使开发调试更容易的帮助库。
- [vue](https://vuejs.org) - 一个搭建用户界面的渐进式框架。
- [element-ui](https://element.eleme.io) - 广泛使用的 UI 库。
