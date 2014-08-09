'use strict';

//
// ASSETS
//
// This module integrates **assets pipe line** into the application. Scripts,
// styles, fonts, images and views should be places under `app/assets` folter.
//

let app = require('..');

// Every response constains a response time header.
app.use(require('koa-response-time')());

// Public directory represents applications root folder. Everything that's iside
// will automatically be publicly available from a browser.
app.use(require('koa-static')('public'));
app.use(require('koa-static')('.cache/public'));
