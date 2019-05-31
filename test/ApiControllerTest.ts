import 'mocha'
import chai = require('chai')
import Bluebird = require('bluebird')
import chaiAsPromised = require('chai-as-promised')
import { DocumentationIndexer } from '../lib/api/DocumentationIndexer'
import * as path from 'path'
import { AbstractDocumentationIndex } from '../lib/api/AbstractDocumentationIndex'
import { Server } from '../lib/Server'
import * as requestPromise from 'request-promise'
import { Response } from 'request'
import { checkDatasource, checkDatasources, checkIndex, checkResource, checkResources } from './Utils'
chai.use(chaiAsPromised)

const startServer = (): Bluebird<Server> => {
  process.env.TFLOOKUP_INDEXFILE = 'testIndex.json'
  const documentationIndexer = new DocumentationIndexer(path.join('test', 'assets', 'indexer'))
  return documentationIndexer.getIndex().then(index => {
    const testServer = new Server(null, index)
    return testServer.serve().then(() => {
      return testServer
    })
  })
}

describe('/api', () => {
  it('should return the api index', () => {
    return startServer()
      .then(
        testServer => {
          let port = testServer.getPort()
          chai.expect(port).greaterThan(0)
          return requestPromise
            .defaults({ resolveWithFullResponse: true })
            .get(`http://localhost:${port}/api`)
            .finally(() => {
              return testServer.stop()
            })
        }
      )
      .then(
        (response: Response) => {
          chai.expect(response.statusCode).to.eq(200)
          chai.expect(response.headers).haveOwnProperty('content-type')
          chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8')
          const returnedBody = JSON.parse(response.body)
          chai.expect(returnedBody).to.be.a('string')
          chai.expect(returnedBody).to.equal('tflookup API')
        }
      )
  })
})
