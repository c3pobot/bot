'use strict'
const log = require('logger')
const mongo = require('mongoclient')
let msgOpts = { private: new Set([]), vip: new Set([]) }

module.exports = { msgOpts }
