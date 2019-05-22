import { AbstractController } from './AbstractController'
import { Router } from 'express'

export class ApiController extends AbstractController {
  public getRouter(): Router {
    const router = Router()
    router.get('/', (req, res) => {
      res.status(200).json('tflookup API')
    })
    return router
  }
}
