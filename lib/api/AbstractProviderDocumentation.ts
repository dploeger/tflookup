import { AbstractObjectDocumentation } from './AbstractObjectDocumentation'
import { AbstractObjectTypeDocumentation } from './AbstractObjectTypeDocumentation'

export abstract class AbstractProviderDocumentation {
  public datasources?: AbstractObjectTypeDocumentation
  public resources?: AbstractObjectTypeDocumentation
}
