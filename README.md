# node learn node学习笔记

## js基础
### 类型判断 [ladash](https://github.com/zzzs/lodash)
   * typeof
   * instanceof 判断对象是某个实例
   * constructor 它指向构造该对象的构造函数
   * Object.prototype.toString.call() console.log(bject.prototype.toString.call([])) //[object Array]

### 作用域 `《你不知道的 JavaScript》`
   * 不论var声明的变量处于当前作用域的第几行，都会提升到作用域的头部。 
   * 使用let命令声明变量之前，该变量都是不可用的
   * let不允许在相同作用域内，重复声明同一个变量。
   
### 引用传递
   * 什么类型是传递引用, 什么类型是值传递? 如何将值类型的变量以引用的方式传递?
   * 如何编写一个 json 对象的拷贝函数
   * == 的 === 的区别的了解

### 内存释放 [《如何分析 Node.js 中的内存泄漏》](https://zhuanlan.zhihu.com/p/25736931)
   * 引用类型是在没有引用之后, 通过 v8 的 GC 自动回收, 值类型如果是处于闭包的情况下,要等闭包没有引用才会被 GC 回收, 非闭包的情况下等待 v8的新生代 (new space) 切换的时候回收.
   * v8 的 GC 有多了解
   * 基础的内存释放

### ES6 新特性 [《ECMAScript 6 入门》](http://es6.ruanyifeng.com/)
   * 箭头函数 与 function 的区别
   * `引用`  `const`  `Set` `Map` `symbol`
   * ... 的使用上, 如何实现一个数组的去重 (使用 Set 可以加分)
   * 


## 模块

### 模块机制
   * AMD, CMD, CommonJS 三者的区别
       - （浏览器异步）AMD 提前执行 requireJs
       - （浏览器异步）CMD 按需加载执行 seaJs
           ```javascript
                // CMD
                define(function(require, exports, module) {
                  var a = require('./a')
                  a.doSomething()
                  // 此处略去 100 行
                  var b = require('./b') // 依赖可以就近书写
                  b.doSomething()
                  // ... 
                })

                // AMD 默认推荐的是
                define(['./a', './b'], function(a, b) { // 依赖必须一开始就写好
                  a.doSomething()
                  // 此处略去 100 行
                  b.doSomething()
                  ...
                })
           ```
       - （服务器同步）CommonJs 
   * node 中 require 的实现原理
       - 解析路径原理：先缓存，再按文件，补齐扩展名（js, node, json）, 再目录（package.json, 补齐扩展名）,再index补齐扩展名，再往上一级直到根目录，




