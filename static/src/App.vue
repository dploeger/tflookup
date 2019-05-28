<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>tflookup</span>
        <span class="font-weight-light"> - Terraform Documentation Lookup</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat href="https://github.com/dploeger/tflookup">GitHub</v-btn>
        <v-btn flat href="https://terraform.io">Terraform</v-btn>
        <v-btn flat href="https://hashicorp.com">Hashicorp</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid grid-list-sm>
        <v-layout column>
          <v-flex>
            <v-card>
              <v-card-title>
                <span>Terraform Documentation Lookup</span>
              </v-card-title>
              <v-card-text>
                Welcome to tflookup. With this small helper, you can effectively search through the
                <a href="https://terraform.io">Terraform</a> provider documentation for keywords. When you hit Enter, you'll be redirected
                to the specific documentation.
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex>
            <Lookup ref="lookup"></Lookup>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer height="auto">
      <v-layout justify-center>
        <span>tflookup is not affiliated with <a href="https://hashicorp.com">Hashicorp</a> in any way. Check out the sourcecode at <a href="https://github.com/dploeger/tflookup">GitHub</a></span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import Lookup from './components/Lookup'

export default {
  name: 'App',
  components: {
    Lookup
  },
  data: () => {
    return {
      //
    }
  }
}
</script>
