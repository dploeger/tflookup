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

  const app = express()

  if (process.env.NODE_ENV !== 'production') {
    log.warn('Enabling ALL CORS Requests')
    app.use(require('cors')())
  }

  log.info('Registering UI')
  app.use('/', express.static('static/dist'))
  log.info('Registering api base')
  app.use('/api', new ApiController().getRouter())
  log.info('Registering index api')
  app.use('/api/index', new IndexController(documentationIndex).getRouter())
  log.info('Registering search api')
  app.use('/api/search', new SearchController(documentationIndex).getRouter())

  app.use((error: ExpressError, req: Request, res: Response, next: NextFunction) => {
    if (error) {
      error.sendError(res)
    }
  })

  let servicePort = process.env.TFLOOKUP_PORT || 8080
  log.info(`Starting service on port ${servicePort}`)
  app.listen(servicePort)
})
