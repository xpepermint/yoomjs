# YoomJS - MVC Framework for NodeJS

![Build Status](https://travis-ci.org/xpepermint/yoom.svg?branch=master)


## Installation

Install the NPM package.

```
npm install -g yoom
```

Create a new YoomJS project.

```
yoom new {myproject}
```

Start the application server.

```
cd {myproject}
yoom start
```


## TO-DO

Settings at middleware level
app.use(function *(){
  this; // is the Context
  this.request; // is a koa Request
  this.response; // is a koa Response
  this.settings; // is a yoom Settings
});


Multiple HTTP instances: http://koajs.com/#app-listen-
Cookies & session: http://koajs.com/#app-keys-
Logging: http://koajs.com/#error-handling
Content Negotiation: http://koajs.com/#content-negotiation
HowTo KoaJS: https://github.com/koajs/examples, https://github.com/koajs/workshop

<!--
## Features
* on top of express
* middlewares
* MVC
* models
* controllers
* routes
* multiple connectors
* settings
* mongodb with mongoose
* per-model database connection support
* command-line generators
-->
