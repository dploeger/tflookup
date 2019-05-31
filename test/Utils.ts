import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')
import { AbstractObjectDocumentation } from '../lib/api/AbstractObjectDocumentation'
chai.use(chaiAsPromised)

export function checkDatasource(index): void {
  chai.expect(index).to.haveOwnProperty('objectType')
  chai.expect(index).to.haveOwnProperty('title')
  chai.expect(index).to.haveOwnProperty('description')
  chai.expect(index).to.haveOwnProperty('url')
  chai.expect(index.objectType).to.eq('d')
  chai.expect(index.title).to.eq('TEST: testdatasource')
  chai.expect(index.description).to.eq('Just a test datasource')
  chai.expect(index.url).to.eq('https://www.terraform.io/docs/providers/test/d/testdatasource.html')
}

export function checkDatasources(index): void {
  chai.expect(index).to.haveOwnProperty('testdatasource')

  checkDatasource(index.testdatasource)
}

export function checkResource(index): void {
  chai.expect(index).to.haveOwnProperty('objectType')
  chai.expect(index).to.haveOwnProperty('title')
  chai.expect(index).to.haveOwnProperty('description')
  chai.expect(index).to.haveOwnProperty('url')
  chai.expect(index.objectType).to.eq('r')
  chai.expect(index.title).to.eq('TEST: testresource')
  chai.expect(index.description).to.eq('Just a test resource')
  chai.expect(index.url).to.eq('https://www.terraform.io/docs/providers/test/r/testresource.html')
}

export function checkResources(index): void {
  chai.expect(index).to.haveOwnProperty('testresource')

  checkResource(index.testresource)
}
export function checkVendor(index): void {
  chai.expect(index).to.haveOwnProperty('datasources')
  chai.expect(index).to.haveOwnProperty('resources')

  checkDatasources(index.datasources)
  checkResources(index.resources)
}

export function checkIndex(index): void {
  chai.expect(index).to.haveOwnProperty('test')
  checkVendor(index.test)
}

export function checkSearchResults(results): void {
  chai.expect(results).to.be.an('array')
  chai.expect(results).to.have.lengthOf(3)
  for (const result of results) {
    chai.expect(result).to.haveOwnProperty('resultType')
    chai.expect(result).to.haveOwnProperty('weight')
    chai.expect(result).to.haveOwnProperty('result')
  }
  chai.expect(results[0].resultType).to.eq(1)
  chai.expect(results[0].weight).to.eq(188)
  chai.expect(results[0].result).to.haveOwnProperty('objectType')
  chai.expect(results[0].result).to.haveOwnProperty('title')
  chai.expect(results[0].result).to.haveOwnProperty('description')
  chai.expect(results[0].result).to.haveOwnProperty('url')
  chai.expect((results[0].result as AbstractObjectDocumentation).objectType).to.eq('r')
  chai.expect((results[0].result as AbstractObjectDocumentation).title).to.eq('TEST: testresource')
  chai.expect((results[0].result as AbstractObjectDocumentation).description).to.eq('Just a test resource')
  chai
    .expect((results[0].result as AbstractObjectDocumentation).url)
    .to.eq('https://www.terraform.io/docs/providers/test/r/testresource.html')

  chai.expect(results[1].resultType).to.eq(1)
  chai.expect(results[1].weight).to.eq(129)
  chai.expect(results[1].result).to.haveOwnProperty('objectType')
  chai.expect(results[1].result).to.haveOwnProperty('title')
  chai.expect(results[1].result).to.haveOwnProperty('description')
  chai.expect(results[1].result).to.haveOwnProperty('url')
  chai.expect((results[1].result as AbstractObjectDocumentation).objectType).to.eq('d')
  chai.expect((results[1].result as AbstractObjectDocumentation).title).to.eq('TEST: testdatasource')
  chai.expect((results[1].result as AbstractObjectDocumentation).description).to.eq('Just a test datasource')
  chai
    .expect((results[1].result as AbstractObjectDocumentation).url)
    .to.eq('https://www.terraform.io/docs/providers/test/d/testdatasource.html')

  chai.expect(results[2].resultType).to.eq(0)
  chai.expect(results[2].result).to.eq('test')
  chai.expect(results[2].weight).to.eq(10)
}
