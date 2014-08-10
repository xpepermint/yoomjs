![YoomJS](https://raw.githubusercontent.com/xpepermint/yoomjs/master/logo.png)

# YoomJS - MVC Framework for NodeJS

![Build Status](https://travis-ci.org/xpepermint/yoomjs.svg?branch=master)
[![NPM version](https://badge.fury.io/js/yoom.svg)](http://badge.fury.io/js/yoom)
[![Dependency Status](https://gemnasium.com/xpepermint/yoomjs.svg)](https://gemnasium.com/xpepermint/yoomjs)

YoomJS is a next generation web framework for [NodeJS](http://nodejs.org/) built on top of [KoaJS](http://koajs.com/). YoomJS mimics the MVC pattern of frameworks like [Ruby on Rails](http://rubyonrails.org/) which makes writing custom, enterprise-grade [NodeJS](http://nodejs.org/) applications fast and enjoyable.

## Installation

### Dependencies

Make sure that [NodeJS](http://nodejs.org/) version `0.11.13` or later is installed. You can easily installing a fresh version of [NodeJS](http://nodejs.org/) using the [Node Version Manager](https://github.com/creationix/nvm).

You also need [Bower](http://www.bowserjs.org/) and [Gulp](http://gulpjs.com/) commands available from the command-line.

### Yoom

Install the package.

```
npm install -g yoom
```

After the installation the `yoom` command-line script will be available. Run `yoom --help` to see the list of available commands.

### Create New Project

Use the `yoom` command to create a new application directory structure.

```
yoom new {project-path}
```

From `{project-path}` start the application server.

```
yoom start
```

You can also run open the application in your default browser.

```
yoom open
```

The project is ready and you can start building your next generation web application, API, or website.


# License

(MIT License)

Copyright © 2014 Kristijan Sedlak.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



<!--

## TO-DO / NOTES

* upgrade mongoose to use utils.inflactors
* emit events .on()
* I18n, add functions for date, string, arrays manipulation to ctx
* global yoom command-line re-run local ./node_modules/bin/yoom command (versions)

* Logging: http://koajs.com/#error-handling (winston)
* caching views (in memory)
* memory as default db

* HowTo KoaJS: https://github.com/koajs/examples, https://github.com/koajs/workshop
* Nginx as proxy
* doc: https://readthedocs.org/
* deployment: https://www.npmjs.org/package/forever
* deploy to heroku
* video doc like https://github.com/floatdrop/gulp-watch
* funding https://pledgie.com/
* add in a docs that you can do `alias node='node --harmony'`
* Run Multiple HTTP instances: http://koajs.com/#app-listen-
* Node cluster
* mongoose PR: https://github.com/LearnBoost/mongoose/issues/2231
* socket.io

## Features
* on top of koa
* middlewares
* MVC
* models
* controllers
* routes
* multiple connectors
* settings
* mongodb with mongoose
* we don't want to be limited to the style of database request (different modules, not trying to imitate like waterline because you loos flexability and db features)
* per-model database connection support
* command-line generators
* customize boot
* extend gulp task
* gulp: gulp {task}
* npm: npm install {package} --save
* bower: bower install {package} --save
* livereload: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
* streams, gulp
* default assets coffee, less, lesshat
* extendable assets pipeline
* renderers
* tasks are streams so you can pipe them all
* API response codes
- GET, found = 200
- GET, notfound = 204
- GET, route not found = 404
- POST, ok, 201
- /PUT/DELETE, ok, 200
- POST/PUT/DELETE, not found, 505
-->
