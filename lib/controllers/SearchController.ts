import { AbstractController } from './AbstractController'
import { Request, Response, Router } from 'express'
import { AbstractDocumentationIndex } from '../api/AbstractDocumentationIndex'
import { AbstractResult } from '../api/AbstractResult'
import { ResultType } from '../api/ResultType'
import { DocumentationSearcher } from '../api/DocumentationSearcher'
import { ExpressError } from '../ExpressError'

export class SearchController extends AbstractController {
  private _documentationSearcher: DocumentationSearcher

  constructor(documentationIndex: AbstractDocumentationIndex) {
    super()
    this._documentationSearcher = new DocumentationSearcher(documentationIndex)
  }
  private _search(req: Request, res: Response): void {
    if (!req.query.hasOwnProperty('q')) {
      throw new ExpressError('No query string given with ?q=', 'NoQueryString', 400)
    }
    res.status(200).json(this._documentationSearcher.search(req.query.q, req.query.max || 100))
  }

  public getRouter(): Router {
    const router = Router()
    router.get('/', this._search.bind(this))
    return router
  }
}
