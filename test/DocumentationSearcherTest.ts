import 'mocha'
import chai = require('chai')
import Bluebird = require('bluebird')
import chaiAsPromised = require('chai-as-promised')
import { DocumentationIndexer } from '../lib/api/DocumentationIndexer'
import * as path from 'path'
import { DocumentationSearcher } from '../lib/api/DocumentationSearcher'
import { AbstractObjectDocumentation } from '../lib/api/AbstractObjectDocumentation'
import { checkSearchResults } from './Utils'
chai.use(chaiAsPromised)

describe('DocumentationSearcher', () => {
  describe('#search', () => {
    it('should return a valid result list', () => {
      process.env.TFLOOKUP_INDEXFILE = 'testIndex.json'
      const documentationIndexer = new DocumentationIndexer(path.join('test', 'assets', 'indexer'))
      return documentationIndexer
        .getIndex()
        .then(index => {
          const documentationSearcher = new DocumentationSearcher(index)
          return documentationSearcher.search('test', 20)
        })
        .then(results => {
          checkSearchResults(results)
        })
    })
  })
})
