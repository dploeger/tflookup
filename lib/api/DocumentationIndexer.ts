import Bluebird = require('bluebird')
import { AbstractDocumentationIndex } from './AbstractDocumentationIndex'
import * as fs from 'fs'
import * as path from 'path'
import { AbstractObjectDocumentation } from './AbstractObjectDocumentation'
import { AbstractProviderDocumentation } from './AbstractProviderDocumentation'
import { AbstractObjectTypeDocumentation } from './AbstractObjectTypeDocumentation'
import log = require('loglevel')

export class DocumentationIndexer {
  private readonly _websiteBasePath
  private static _indexCache: AbstractDocumentationIndex = null

  constructor(websiteBasePath: string = 'terraform-website') {
    this._websiteBasePath = websiteBasePath
  }

  private _readDirIgnoreMissing(directoryPath: string): Bluebird<Array<string>> {
    return Bluebird.resolve()
      .then(() => {
        return fs.promises.readdir(directoryPath)
      })
      .catch(error => error.code === 'ENOENT', () => Bluebird.resolve([]))
      .filter(
        entry => {
          return entry.endsWith('markdown')
        }
      )
  }

  public getIndex(): Bluebird<AbstractDocumentationIndex> {
    if (DocumentationIndexer._indexCache) {
      log.debug('Index is already built, returning cache.')
      return Bluebird.resolve(DocumentationIndexer._indexCache)
    }
    log.info('Building up documentation index')

    const documentationIndexFile = process.env.TFLOOKUP_INDEXFILE || 'documentationIndex.json'

    return Bluebird.resolve(fs.promises.access(documentationIndexFile, fs.constants.R_OK))
      .then(() => {
        return Bluebird.resolve(true)
      })
      .catch(
        error => error.code === 'ENOENT',
        error => {
          return Bluebird.resolve(false)
        }
      )
      .then(indexExists => {
        if (indexExists) {
          log.info(`Reading documentation index from ${documentationIndexFile}`)
          return fs.promises.readFile(documentationIndexFile, { encoding: 'utf-8' }).then(indexContent => {
            return JSON.parse(indexContent) as AbstractDocumentationIndex
          })
        } else {
          return Bluebird.resolve(fs.promises.readdir(`${this._websiteBasePath}/ext/providers`))
            .filter(entry => {
              return fs.promises.stat(`${this._websiteBasePath}/ext/providers/${entry}`).then(stat => {
                return stat.isDirectory()
              })
            })
            .then(providers => {
              return this._indexProvider(providers)
            })
            .then(documentationIndex => {
              if (process.env.hasOwnProperty('TFLOOKUP_STORE_INDEX')) {
                log.info(`Storing documentation index to ${documentationIndexFile}`)
                return Bluebird.resolve(
                  fs.promises.writeFile(documentationIndexFile, JSON.stringify(documentationIndex), {
                    encoding: 'utf-8'
                  })
                ).return(documentationIndex)
              }

              return documentationIndex
            })
        }
      })
  }

  private _indexObjectType(
    objectType: string,
    typePaths: Object,
    provider: string,
    objects: AbstractObjectTypeDocumentation,
    file: string
  ): Bluebird<AbstractObjectTypeDocumentation> {
    log.debug(`Building documentation index for ${provider}:${objectType}:${file}`)
    const pageName = file.replace(/(.*)\.markdown/, '$1')
    return Bluebird.resolve()
      .then(() => {
        return fs.promises.readFile(path.join(typePaths[objectType], file), 'utf-8')
      })
      .then(markdown => {
        try {
          const pageInfo = require('frontmatter')(markdown)
          log.trace(`Frontmatter for ${file}: ${JSON.stringify(pageInfo)}`)
          const object = pageInfo.data.page_title.split(/: /)[1]
          objects[object] = {
            objectType: objectType,
            title: pageInfo.data.page_title,
            description: pageInfo.data.description,
            url: `https://www.terraform.io/docs/providers/${provider}/${objectType}/${pageName}`
          }
        } catch (error) {
          log.error(`Can't load frontmatter of ${provider}:${objectType}:${file}: ${error}`)
        }

        return objects
      })
  }

  private _indexProvider(providers: Array<string>): Bluebird<AbstractDocumentationIndex> {
    return Bluebird.reduce(
      providers,
      (docs, provider) => {
        log.info(`Building index for provider ${provider}`)

        const typePaths = {
          d: path.join(this._websiteBasePath, 'ext', 'providers', provider, 'website', 'docs', 'd'),
          r: path.join(this._websiteBasePath, 'ext', 'providers', provider, 'website', 'docs', 'r')
        }

        return Bluebird.props({
          datasources: this._readDirIgnoreMissing(typePaths.d),
          resources: this._readDirIgnoreMissing(typePaths.r)
        })
          .then(result => {
            return Bluebird.props({
              datasources: Bluebird.reduce(result.datasources, this._indexObjectType.bind(this, 'd', typePaths, provider), {}),
              resources: Bluebird.reduce(result.resources, this._indexObjectType.bind(this, 'r', typePaths, provider), {})
            })
          })
          .then(result => {
            docs[provider] = result
            return docs
          })
      },
      {}
    )
  }
}
