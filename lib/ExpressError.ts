import { Response } from 'express'

export class ExpressError extends Error {
  private _code: number = 500
  private _errorType: string

  constructor (message: string, errorType: string = "SystemError", code: number = 500) {
    super(message)
    this._code = code
  }

  public sendError(res: Response): void {
    res.status(this._code).json({
      error: true,
      message: this.message,
      type: this._errorType
    })
  }
}
