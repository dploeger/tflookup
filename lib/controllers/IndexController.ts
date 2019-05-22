import { AbstractController } from './AbstractController'
import { AbstractDocumentationIndex } from '../api/AbstractDocumentationIndex'
import { Request, Response, Router } from 'express'
import Bluebird = require('bluebird')
import { ExpressError } from '../ExpressError'

export class IndexController extends AbstractController {
  private _documentationIndex: AbstractDocumentationIndex

  constructor(documentationIndex: AbstractDocumentationIndex) {
    super()
    this._documentationIndex = documentationIndex
  }

  private _getAll(req: Request, res: Response): void {
    res.status(200).json(this._documentationIndex)
  }

  private _getVendors(req: Request, res: Response): void {
    res.status(200).json(Object.keys(this._documentationIndex))
  }

  private _getObjectTypes(req: Request, res: Response): void {
    if (!this._documentationIndex.hasOwnProperty(req.params.vendor)) {
      throw new ExpressError(`Unknown vendor ${req.params.vendor}`, 'UnknownVendor', 404)
    }
    const availableObjectTypes = []
    for (const objectType of ['datasources', 'resources']) {
      if (this._documentationIndex[req.params.vendor].hasOwnProperty(objectType)) {
        availableObjectTypes.push(objectType)
      }
    }
    res.status(200).json(availableObjectTypes)
  }

  private _getObjects(req: Request, res: Response): void {
    if (!this._documentationIndex.hasOwnProperty(req.params.vendor)) {
      throw new ExpressError(`Unknown vendor ${req.params.vendor}`, 'UnknownVendor', 404)
    }
    if (!this._documentationIndex[req.params.vendor].hasOwnProperty(req.params.objectType)) {
      throw new ExpressError(`Vendor ${req.params.vendor} doesn't support ${req.params.objectType}`, 'UnsupportedObjectType', 404)
    }
    res.status(200).json(this._documentationIndex[req.params.vendor][req.params.objectType])
  }

  private _getObject(req: Request, res: Response): void {
    if (!this._documentationIndex.hasOwnProperty(req.params.vendor)) {
      throw new ExpressError(`Unknown vendor ${req.params.vendor}`, 'UnknownVendor', 404)
    }
    if (!this._documentationIndex[req.params.vendor].hasOwnProperty(req.params.objectType)) {
      throw new ExpressError(`Vendor ${req.params.vendor} doesn't support ${req.params.objectType}`, 'UnsupportedObjectType', 404)
    }
    if (!this._documentationIndex[req.params.vendor][req.params.objectType].hasOwnProperty(req.params.object)) {
      throw new ExpressError(
        `Can't find ${req.params.objectType} ${req.params.object} in Vendor ${req.params.vendor}`,
        'UnknownObject',
        404
      )
    }
    res.status(200).json(this._documentationIndex[req.params.vendor][req.params.objectType][req.params.object])
  }

  public getRouter(): Router {
    const router = Router()
    router.get('/', this._getAll.bind(this))
    router.get('/vendors', this._getVendors.bind(this))
    router.get('/vendors/:vendor', this._getObjectTypes.bind(this))
    router.get('/vendors/:vendor/:objectType', this._getObjects.bind(this))
    router.get('/vendors/:vendor/:objectType/:object', this._getObject.bind(this))
    return router
  }
}
