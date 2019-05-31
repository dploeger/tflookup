import { AbstractDocumentationIndex } from './api/AbstractDocumentationIndex'
import { Application, NextFunction, Request, Response } from 'express'
import { ApiController } from './controllers/ApiController'
import { IndexController } from './controllers/IndexController'
import { SearchController } from './controllers/SearchController'
import { ExpressError } from './ExpressError'
import log = require('loglevel')
import express = require('express')
import * as http from 'http'
import Bluebird = require('bluebird')
import { AddressInfo } from 'net'

export class Server {
  private readonly _port: number
  private _documentationIndex: AbstractDocumentationIndex
  private _app: Application
  private _server: http.Server

  constructor (port: number, documentationIndex: AbstractDocumentationIndex) {
    this._port = port
    this._documentationIndex = documentationIndex
  }

  public serve(): Bluebird<void> {
    if (process.env.TFLOOKUP_START_SERVER === 'false') {
      log.info('Not starting the server as requested')
      return
    }

    this._app = express()

    if (process.env.NODE_ENV !== 'production') {
      log.warn('Enabling ALL CORS Requests')
      this._app.use(require('cors')())
    }

    log.info('Registering UI')
    this._app.use('/', express.static('static/dist'))
    log.info('Registering api base')
    this._app.use('/api', new ApiController().getRouter())
    log.info('Registering index api')
    this._app.use('/api/index', new IndexController(this._documentationIndex).getRouter())
    log.info('Registering search api')
    this._app.use('/api/search', new SearchController(this._documentationIndex).getRouter())

    this._app.use((error: ExpressError, req: Request, res: Response, next: NextFunction) => {
      if (error) {
        error.sendError(res)
      }
    })

    log.info(`Starting service on port ${this._port}`)
    this._server = this._app.listen(this._port)
    return Bluebird.fromCallback(this._server.addListener.bind(this._server, 'listening'))
  }

  public getPort(): number {
    return (this._server.address() as AddressInfo).port
  }

  public stop(): Bluebird<void> {
    return Bluebird.fromCallback(this._server.close.bind(this._server))
  }
}
