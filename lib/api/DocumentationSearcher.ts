import { AbstractDocumentationIndex } from './AbstractDocumentationIndex'
import { AbstractResult } from './AbstractResult'
import { ResultType } from './ResultType'
import { AbstractObjectDocumentation } from './AbstractObjectDocumentation'
import log = require('loglevel')
import * as _ from 'lodash'

export class DocumentationSearcher {
  private readonly _documentationIndex: AbstractDocumentationIndex
  private readonly _searchIndex: {
    [key: string]: Array<AbstractResult>
  }

  constructor(documentationIndex: AbstractDocumentationIndex) {
    this._documentationIndex = documentationIndex
    this._searchIndex = {}
  }

  private _getStringWeight(s1, s2): number {
    let ix = s1.indexOf(s2)
    if (ix === 0 && s1.length === s2.length) {
      return 10
    } else if (ix === 0) {
      return 5
    } else if (ix > 0) {
      return 3
    }
    ix = s2.indexOf(s1)
    if (ix === 0) {
      return 5
    } else if (ix > 0) {
      return 3
    }
    return 0
  }

  public search(query: string): Array<AbstractResult> {
    if (this._searchIndex.hasOwnProperty(query)) {
      log.debug(`Search for ${query} already processed. Returning cached results`)
      return this._searchIndex[query]
    }
    let results: Array<AbstractResult> = []

    const searchStringResults: { [key: string]: Array<AbstractResult> } = {}

    for (const searchString of query.split(/ /)) {

      log.debug(`Searching for ${searchString}`)
      for (const vendor in this._documentationIndex) {
        if (this._documentationIndex.hasOwnProperty(vendor)) {
          let vendorScore: number = 0

          const weight = this._getStringWeight(vendor, searchString)
          if (weight !== 0) {
            log.trace(`Found vendor for ${searchString}`)
            results.push({
              resultType: ResultType.vendor,
              weight: weight,
              result: vendor
            })
            vendorScore += 10
          }
          for (const objectType in this._documentationIndex[vendor]) {
            if (this._documentationIndex[vendor].hasOwnProperty(objectType)) {
              for (const objectName in this._documentationIndex[vendor][objectType]) {
                if (this._documentationIndex[vendor][objectType].hasOwnProperty(objectName)) {
                  const objectData: AbstractObjectDocumentation = this._documentationIndex[vendor][objectType][objectName]

                  let descriptionScore = 0

                  const descriptionWeight =
                    this._getStringWeight(objectData.description, searchString) * (objectType === 'datasources' ? 3 : 6)

                  if (descriptionWeight !== 0) {
                    log.trace(`Found object description of object "${objectData.title}" for ${searchString}`)
                    results.push({
                      resultType: ResultType.object,
                      weight: descriptionWeight + vendorScore,
                      result: this._documentationIndex[vendor][objectType][objectName]
                    })

                    descriptionScore = vendorScore + 50

                  }

                  const objectWeight = this._getStringWeight(objectName, searchString) * (objectType === 'datasources' ? 10 : 20)

                  if (objectWeight !== 0) {
                    log.trace(`Found object "${objectData.title}" for ${searchString}`)
                    results.push({
                      resultType: ResultType.object,
                      weight: objectWeight + descriptionScore,
                      result: objectData
                    })
                  }

                }
              }
            }
          }
        }
      }
      searchStringResults[searchString] = results
      results = []
    }

    log.debug(`Merging queries`)

    for (const searchString in searchStringResults) {
      if (searchStringResults.hasOwnProperty(searchString)) {
        results = this._mergeResults(results, searchStringResults[searchString])
      }
    }

    this._searchIndex[query] = results

    return results
  }

  private _mergeResults(target: Array<AbstractResult>, source: Array<AbstractResult>): Array<AbstractResult> {
    for (const entry of source) {
      let found = false
      for (const targetEntry of target) {
        if (_.eq(entry.result, targetEntry.result)) {
          found = true
          targetEntry.weight = targetEntry.weight + entry.weight
        }
      }
      if (!found) {
        target.push(entry)
      }
    }
    return target
  }
}
