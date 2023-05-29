<template>
  <div id="app">
    <CadastroPessoas msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import CadastroPessoas from './components/CadastroPessoas.vue'

export default {
  name: 'App',
  components: {
    CadastroPessoas
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  width: auto;
  padding: 0;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
