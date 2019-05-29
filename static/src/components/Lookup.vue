<template>
  <div>
    <v-card>
      <v-card-text>
        <v-autocomplete
          v-model="selectedItem"
          :loading="isLoading"
          :items="items"
          :search-input.sync="query"
          placeholder="Start typing to Search"
          prepend-icon="search"
          item-text="title"
          item-value="result"
          @change="visit"
          ref="search"
          no-filter
        >
          <template v-slot:no-data>
            <v-list-tile>
              <v-list-tile-title>
                Quickly lookup a Terraform resource or data source. Hit enter to jump to the Terraform documentation.
              </v-list-tile-title>
            </v-list-tile>
          </template>
          <template v-slot:item="data">
            <v-list-tile-avatar>
              <v-icon v-if="data.item.result.resultType === 0">
                cloud
              </v-icon>
              <v-icon v-if="data.item.result.resultType === 1 && data.item.result.result.objectType === 'd'">
                assessment
              </v-icon>
              <v-icon v-if="data.item.result.resultType === 1 && data.item.result.result.objectType === 'r'">
                build
              </v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>
              {{ data.item.title }}
            </v-list-tile-title>
            <v-list-tile-sub-title v-if="data.item.result.resultType === 1">
              {{ data.item.result.result.description }}
            </v-list-tile-sub-title>
          </template>
        </v-autocomplete>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { ResultType } from '@/api/ResultType'
import Bluebird from 'bluebird'
import { AbstractResult } from '@/api/AbstractResult'

Bluebird.config({
  cancellation: true
})

@Component
export default class Lookup extends Vue {
  public query: string = ''
  public results: Array<any> = []
  public error: string = ''
  private _searchPromise: Bluebird<void> = Bluebird.resolve()
  public isLoading: boolean = false
  public selectedItem: any = null

  @Watch('query')
  public lookup(query: string): Bluebird<void> {
    if (this._searchPromise) {
      this._searchPromise.cancel()
    }
    if (!query || query === '') {
      return Bluebird.resolve()
    }
    this._searchPromise = Bluebird.delay(500)
      .then(() => {
        this.isLoading = true
        const apiServer = process.env.VUE_APP_TFLOG_API_SERVER || ''
        return fetch(`${apiServer}/api/search?q=${query}&max=10`)
      })
      .then(response => {
        return response.json()
      })
      .then(responseJson => {
        this.results = responseJson
      })
      .catch(error => {
        this.error = error.message
      })
      .finally(() => {
        this.isLoading = false
      })
    return this._searchPromise
  }

  get items(): Array<any> {
    let items = []
    for (const result of this.results) {
      let text: string
      if (result.resultType == ResultType.vendor) {
        text = result.result
      } else {
        text = result.result.title
      }
      items.push({
        title: text,
        result: result
      })
    }
    return items
  }

  public visit(): void {
    window.open(this.selectedItem.result.url)
  }

  public mounted(): void {
    (this.$refs.search as any).$refs.input.focus()
  }

}
</script>

<style scoped>
  iframe {
    border: 0
  }
</style>
