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
           ```
       - （服务器同步）CommonJs 
   * node 中 require 的实现原理
       - 解析路径原理：先缓存，再按文件，补齐扩展名（js, node, jsonx）, 再目录（package.json, 补齐扩展名）,再index补齐扩展名，再往上一级直到根目录，
       - 执行原理，js用fs模块同步读取编译；node用c++扩展, dlopen()加载最后编译生成的文件；json用JSON.parse；其他扩展都按js方式来

### 热更新
   * require 会有一个 cache, 有这个 cache 在, 即使你更新了 .js 文件, 在代码中再次require 还是会拿到之前的编译好缓存在 v8 内存 (code space) 中的的旧代码. 但是如果只是单纯的清除掉 require 中的 cache, 再次 require确实能拿到新的代码, 但是这时候很容易碰到各地维持旧的引用依旧跑的旧的代码的问题.如果还要继续推行这种热更新代码的话, 可能要推翻当前的架构,从头开始从新设计一下目前的框架.
   * 其他方式：让更新的部分动态化，存库，缓存等服务

### 上下文
   * vm模块创建新的上下文沙盒 (sandbox) 可以避免上下文被污染
   * 为什么 Node.js 不给每一个.js文件以独立的上下文来避免作用域被污染?
       - 性能

### 包管理
   * 锁版本
       - npm shrinkwrap：递归锁定依赖
注意: 如果 node_modules 下存在某个模块（如直接通过 npm install xxx 安装的）而 package.json 中没有，运行 npm shrinkwrap 则会报错。另外，npm shrinkwrap 只会生成 dependencies 的依赖，不会生成 devDependencies 的。

## 事件/异步

### promise [迷你书](http://liubin.org/promises-book/) [实现详解](https://zhuanlan.zhihu.com/p/25178630)
   * 如何处理 Callback Hell
     -  Q, async, EventProxy
     -  promise
     -  co generate
     -  async await
   * Promise 的实现
   * js运行机制 & node 运行机制
      ```      
          setTimeout(function() {
            console.log(1)
          }, 0);
          new Promise(function executor(resolve) {
            console.log(2);
            for( var i=0 ; i<10000 ; i++ ) {
              i == 9999 && resolve();
            }
            console.log(3);
          }).then(function() {
            console.log(4);
          });
          console.log(5);

          // 2 3 5 4 1
        
      ```


### Events
   * Node.js 中 Eventemitter 的 emit 是同步的.(确保顺序，避免竞争，逻辑错误...)
   * TCP 的复杂状态机
   * once

### 阻塞/异步
   * 如何实现一个异步的 reduce(接收一个函数作为累加器)

### Timer
   * 事件循环, Timers 以及 nextTick 的关系
   * nextTick, setTimeout 以及 setImmediate
    ```
           ┌───────────────────────┐
        ┌─>│        timers         │
        │  └──────────┬────────────┘
        │  ┌──────────┴────────────┐
        │  │     I/O callbacks     │
        │  └──────────┬────────────┘
        │  ┌──────────┴────────────┐
        │  │     idle, prepare     │
        │  └──────────┬────────────┘      ┌───────────────┐
        │  ┌──────────┴────────────┐      │   incoming:   │
        │  │         poll          │<─────┤  connections, │
        │  └──────────┬────────────┘      │   data, etc.  │
        │  ┌──────────┴────────────┐      └───────────────┘
        │  │        check          │
        │  └──────────┬────────────┘
        │  ┌──────────┴────────────┐
        └──┤    close callbacks    │
           └───────────────────────┘
    ```

### 并行/并发

## 进程

### Process

### Child Process

### Cluster

### 进程间通信   
   * 在 IPC 通道建立之前, 父进程与子进程是怎么通信的? 如果没有通信, 那 IPC 是怎么建立的?
   * 会问什么情况下需要 IPC, 以及使用 IPC 处理过什么业务场景等.

### 守护进程 [实现守护进程](https://cnodejs.org/topic/57adfadf476898b472247eac)

## 存储

### 数据库范式
   * 1-属性不可再分 2-全部依赖唯一主键 3-消除依赖 4-消除多值依赖
   * 减少数据冗余（这是最主要的好处，其他好处都是由此而附带的）
   * 满足高等级的范式的先决条件是满足低等级范式
   * 查询时要连接多个表，增加了查询的复杂度, 降低了数据库查询性能
   * 存储不值钱，具体看场景，二三范式也够

### mysql
   * 你需要全文索引吗？
   * 你经常使用什么样的查询模式？
   * 你的数据有多大？
   * 索引是用空间换时间的一种优化策略
   * （产生脏数据）数据一致性：锁，事务
   * 引擎

### mongodb
   * 数据一致性问题
   * Monogdb 连接问题(超时/断开等)有可能是什么问题导致的?

### redis & memcache

## 安全

### TLS/SSL

### HTTPS

### XSS
   * CSP 策略

### CSRF
   * CSRF token
   * 同源检查: Origin Header & Referer Header

### 中间人攻击
   * wife

### SQL/NoSQL 注入

## util

### util.* 源码

### lodash 源码

## 测试

## 错误处理/调试
### Errors
   * Standard JavaScript errors  标准 JavaScript 错误 由错误代码触发
   * System errors  系统错误  由操作系统触发
   * User-specified errors  用户自定义错误  通过 throw 抛出 
   * Assertion errors 断言错误  由 assert 模块触发

### TODO
   * 怎么处理未预料的出错? 用 try/catch , domains 还是其它什么?
   * 为什么要在 cb 的第一参数传 error? 为什么有的 cb 第一个参数不是 error, 例如 http.createServer?




