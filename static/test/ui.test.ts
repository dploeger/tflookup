import { RequestMock, Selector } from 'testcafe'
import { AbstractResult } from '../src/api/AbstractResult'
import { AbstractObjectDocumentation } from '../src/api/AbstractObjectDocumentation'
import { ResultType } from '../src/api/ResultType'

const mockSearchResults: Array<AbstractResult> = [
  {
    resultType: 1,
    weight: 188,
    result: {
      objectType: 'r',
      title: 'TEST: testresource',
      description: 'Just a test resource',
      url: 'https://www.terraform.io/docs/providers/test/r/testresource.html'
    }
  },
  {
    resultType: 1,
    weight: 129,
    result: {
      objectType: 'd',
      title: 'TEST: testdatasource',
      description: 'Just a test datasource',
      url: 'https://www.terraform.io/docs/providers/test/d/testdatasource.html'
    }
  },
  {
    resultType: 0,
    weight: 10,
    result: 'test'
  }
]

const requestMocker = RequestMock()
  .onRequestTo(new RegExp('.*api/search.*'))
  .respond(mockSearchResults)

fixture`UI`.page`http://localhost:8080`.requestHooks(requestMocker)

test('should contain all required elements', async t => {
  const header = await Selector('.headline')
  await t.expect(Selector('.headline').innerText).eql('TFLOOKUP - TERRAFORM DOCUMENTATION LOOKUP')
})

test('should display results to the search', async t => {
  await t
    .typeText('.v-autocomplete input', 'test')
    .expect(Selector('div[role=listitem]').count)
    .eql(3)

  for (const resultIndex in mockSearchResults) {
    if (mockSearchResults.hasOwnProperty(resultIndex)) {
      if (mockSearchResults[resultIndex].resultType === ResultType.vendor) {
        await t
          .expect(Selector('div[role=listitem]').nth(Number(resultIndex)).textContent)
          .contains(mockSearchResults[resultIndex].result as string)
      } else {
        await t
          .expect(Selector('div[role=listitem]').nth(Number(resultIndex)).textContent)
          .contains((mockSearchResults[resultIndex].result as AbstractObjectDocumentation).title)
          .expect(Selector('div[role=listitem]').nth(Number(resultIndex)).textContent)
          .contains((mockSearchResults[resultIndex].result as AbstractObjectDocumentation).description)
      }
    }
  }
})
