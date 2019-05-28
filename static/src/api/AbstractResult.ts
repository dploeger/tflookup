import { ResultType } from './ResultType'
import { AbstractObjectDocumentation } from './AbstractObjectDocumentation'

export abstract class AbstractResult {
  public resultType: ResultType = ResultType.object
  public weight: number = 0
  public result: string | AbstractObjectDocumentation = ''
}
