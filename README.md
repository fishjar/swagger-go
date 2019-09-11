# electron react boilerplate

## 特性

- 集成 [electron](https://electronjs.org/) + [react](https://reactjs.org/)
- 集成常用开发工具（插件）
  - devtron
  - React Developer Tools
  - Redux DevTools

## 文件说明

```sh
├── LICENSE
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── electron.js       # electron 入口文件
│   ├── manifest.json
│   └── preload.js
├── README.md
├── README.react.md
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js          # react 入口文件
│   ├── logo.svg
│   └── serviceWorker.js
└── yarn.lock
```

## 使用指引

```sh
# 安装依赖
yarn

# 开发启动
yarn dev

# 打包
# https://www.electron.build/
yarn dist
```

## 存在问题

```sh
[0] ./node_modules/handlebars/lib/index.js
[0] require.extensions is not supported by webpack. Use a loader instead.
[0] 
[0] ./node_modules/handlebars/lib/index.js
[0] require.extensions is not supported by webpack. Use a loader instead.
[0] 
[0] ./node_modules/handlebars/lib/index.js
[0] require.extensions is not supported by webpack. Use a loader instead.
```

https://github.com/wycats/handlebars.js/issues/953

```js
resolve:  {
   alias: {
       'handlebars' : 'handlebars/dist/handlebars.js'
   }
}
```

https://github.com/facebook/create-react-app/issues/6953
https://github.com/timarney/react-app-rewired
https://github.com/timarney/react-app-rewired/issues/167
