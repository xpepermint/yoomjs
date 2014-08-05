# YoomJS - MVC Framework for NodeJS

![Build Status](https://travis-ci.org/xpepermint/yoom.svg?branch=master)
[![NPM version](https://badge.fury.io/js/yoom.svg)](http://badge.fury.io/js/yoom)
[![Dependency Status](https://gemnasium.com/xpepermint/yoom.svg)](https://gemnasium.com/xpepermint/yoom)
[![Flattr this git repo](https://flattr.com/_img/icons/flattr_logo_16.png)](https://flattr.com/submit/auto?user_id=Xpepermint&url=https://github.com/xpepermint/yoom&title=YoomJS&tags=github&category=software)

YoomJS is a next generation web framework for [NodeJS](http://nodejs.org/) built on top of [KoaJS](http://koajs.com/). YoomJS mimics the MVC pattern of frameworks like [Ruby on Rails](http://rubyonrails.org/) which makes writing custom, enterprise-grade [NodeJS](http://nodejs.org/) applications fast and enjoyable.

## Installation

**Before you start:** Make sure that [NodeJS](http://nodejs.org/) version `0.11.13` or later is installed. If not we recommend installing a fresh version of [NodeJS](http://nodejs.org/) using the [Node Version Manager](https://github.com/creationix/nvm).

Install the [NPM](https://www.npmjs.org/package/yoom) package.

```
npm install -g yoom
```

Create a new project.

```
yoom new {myproject}
```

Start the application server.

```
cd {myproject}
yoom start
```

Open your favourite browser and navigate to `http://localhost:3000`. The project is ready and you can start building your next generation web application or API.


<!--

## TO-DO / NOTES

* Run Multiple HTTP instances: http://koajs.com/#app-listen-
* Node cluster
* Cookies & session: http://koajs.com/#app-keys-
* Logging: http://koajs.com/#error-handling
* HowTo KoaJS: https://github.com/koajs/examples, https://github.com/koajs/workshop
* Nginx as proxy


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
