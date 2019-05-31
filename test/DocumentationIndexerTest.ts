import 'mocha'
import chai = require('chai')
import Bluebird = require('bluebird')
import chaiAsPromised = require('chai-as-promised')
import { DocumentationIndexer } from '../lib/api/DocumentationIndexer'
import * as path from 'path'
import { checkIndex } from './Utils'
chai.use(chaiAsPromised)

describe('DocumentationIndexer', () => {
  describe('#getindex', () => {
    it('should index the documentation', () => {
      process.env.TFLOOKUP_INDEXFILE = 'testIndex.json'
      const documentationIndexer = new DocumentationIndexer(path.join('test', 'assets', 'indexer'))
      return documentationIndexer.getIndex().then(index => {
        checkIndex(index)
      })
    })
  })
})
