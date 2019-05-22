import { Router } from 'express'

export abstract class AbstractController {
  public abstract getRouter(): Router
}
