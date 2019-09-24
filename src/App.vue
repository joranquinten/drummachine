<template>
  <div id="app">
    <DrumMachine />
  </div>
</template>

<script>
import DrumMachine from "./components/DrumMachine";

export default {
  name: "app",
  components: {
    DrumMachine
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
