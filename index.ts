import { DocumentationIndexer } from './lib/api/DocumentationIndexer'
import * as express from 'express'
import { IndexController } from './lib/controllers/IndexController'
import { ApiController } from './lib/controllers/ApiController'
import { SearchController } from './lib/controllers/SearchController'
import log = require('loglevel')
import { LogLevelDesc } from 'loglevel'
import * as logLevelPrefix from 'loglevel-plugin-prefix'
import { ExpressError } from './lib/ExpressError'
import { NextFunction, Request, Response } from 'express'
import { Server } from './lib/Server'

logLevelPrefix.reg(log)
logLevelPrefix.apply(log)

log.setDefaultLevel((
  process.env.TFLOOKUP_LOGLEVEL as LogLevelDesc
) || 'warn')

new DocumentationIndexer().getIndex().then(documentationIndex => {

  if (process.env.TFLOOKUP_START_SERVER === 'false') {
    log.info('Not starting the server as requested')
    return
  }

  return new Server(Number(process.env.TFLOOKUP_PORT) || 8080, documentationIndex).serve()
})
