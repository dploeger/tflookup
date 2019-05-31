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

describe('/api/index', () => {
  describe('/', () => {
    it('should return the index', () => {
      return startServer()
        .then(testServer => {
          let port = testServer.getPort()
          chai.expect(port).greaterThan(0)
          return requestPromise
            .defaults({ resolveWithFullResponse: true })
            .get(`http://localhost:${port}/api/index`)
            .finally(() => {
              return testServer.stop()
            })
        })
        .then((response: Response) => {
          chai.expect(response.statusCode).to.eq(200)
          chai.expect(response.headers).haveOwnProperty('content-type')
          chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8')
          const returnedIndex = JSON.parse(response.body)
          checkIndex(returnedIndex)
        })
    })
  })
  describe('/vendors', () => {
    it('should return available vendorr', () => {
      return startServer()
        .then(testServer => {
          let port = testServer.getPort()
          chai.expect(port).greaterThan(0)
          return requestPromise
            .defaults({ resolveWithFullResponse: true })
            .get(`http://localhost:${port}/api/index/vendors`)
            .finally(() => {
              return testServer.stop()
            })
        })
        .then((response: Response) => {
          chai.expect(response.statusCode).to.eq(200)
          chai.expect(response.headers).haveOwnProperty('content-type')
          chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8')
          const returnedIndex = JSON.parse(response.body)
          chai.expect(returnedIndex).to.be.an('array')
          chai.expect(returnedIndex).to.have.lengthOf(1)
          chai.expect(returnedIndex[0]).to.equal('test')
        })
    })
  })
  describe('/vendors/:vendor', () => {
    it('should return available object types for vendor :vendor', () => {
      return startServer()
        .then(testServer => {
          let port = testServer.getPort()
          chai.expect(port).greaterThan(0)
          return requestPromise
            .defaults({ resolveWithFullResponse: true })
            .get(`http://localhost:${port}/api/index/vendors/test`)
            .finally(() => {
              return testServer.stop()
            })
        })
        .then((response: Response) => {
          chai.expect(response.statusCode).to.eq(200)
          chai.expect(response.headers).haveOwnProperty('content-type')
          chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8')
          const returnedIndex = JSON.parse(response.body)
          chai.expect(returnedIndex).to.be.an('array')
          chai.expect(returnedIndex).to.have.lengthOf(2)
          chai.expect(returnedIndex[0]).to.equal('datasources')
          chai.expect(returnedIndex[1]).to.equal('resources')
        })
    })
  })
  describe('/vendors/:vendor/:objecttype', () => {
    it('should return available datasources for /datasources', () => {
      return startServer()
        .then(testServer => {
          let port = testServer.getPort()
          chai.expect(port).greaterThan(0)
          return requestPromise
            .defaults({ resolveWithFullResponse: true })
            .get(`http://localhost:${port}/api/index/vendors/test/datasources`)
            .finally(() => {
              return testServer.stop()
            })
        })
        .then((response: Response) => {
          chai.expect(response.statusCode).to.eq(200)
          chai.expect(response.headers).haveOwnProperty('content-type')
          chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8')
          const returnedIndex = JSON.parse(response.body)
          checkDatasources(returnedIndex)
        })
    })
    it('should return available datasources for /resources', () => {
      return startServer()
        .then(testServer => {
          let port = testServer.getPort()
          chai.expect(port).greaterThan(0)
          return requestPromise
            .defaults({ resolveWithFullResponse: true })
            .get(`http://localhost:${port}/api/index/vendors/test/resources`)
            .finally(() => {
              return testServer.stop()
            })
        })
        .then((response: Response) => {
          chai.expect(response.statusCode).to.eq(200)
          chai.expect(response.headers).haveOwnProperty('content-type')
          chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8')
          const returnedIndex = JSON.parse(response.body)
          checkResources(returnedIndex)
        })
    })
  })
  describe('/vendors/:vendor/:objecttype/:object', () => {
    it('should return a datasource', () => {
      return startServer()
        .then(testServer => {
          let port = testServer.getPort()
          chai.expect(port).greaterThan(0)
          return requestPromise
            .defaults({ resolveWithFullResponse: true })
            .get(`http://localhost:${port}/api/index/vendors/test/datasources/testdatasource`)
            .finally(() => {
              return testServer.stop()
            })
        })
        .then((response: Response) => {
          chai.expect(response.statusCode).to.eq(200)
          chai.expect(response.headers).haveOwnProperty('content-type')
          chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8')
          const returnedIndex = JSON.parse(response.body)
          checkDatasource(returnedIndex)
        })
    })
    it('should return a resource', () => {
      return startServer()
        .then(testServer => {
          let port = testServer.getPort()
          chai.expect(port).greaterThan(0)
          return requestPromise
            .defaults({ resolveWithFullResponse: true })
            .get(`http://localhost:${port}/api/index/vendors/test/resources/testresource`)
            .finally(() => {
              return testServer.stop()
            })
        })
        .then((response: Response) => {
          chai.expect(response.statusCode).to.eq(200)
          chai.expect(response.headers).haveOwnProperty('content-type')
          chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8')
          const returnedIndex = JSON.parse(response.body)
          checkResource(returnedIndex)
        })
    })
  })
})
