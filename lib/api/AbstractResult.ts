import { ResultType } from './ResultType'
import { AbstractObjectDocumentation } from './AbstractObjectDocumentation'

export abstract class AbstractResult {
  public resultType: ResultType
  public weight: number
  public result: string | AbstractObjectDocumentation
}
