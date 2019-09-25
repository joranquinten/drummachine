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
html {
  background: linear-gradient(
      to bottom,
      rgba(100, 100, 100, 0.15) 0%,
      rgba(0, 0, 0, 0.15) 100%
    ),
    radial-gradient(
        at top center,
        rgba(50, 50, 50, 0.4) 0%,
        rgba(0, 0, 0, 0.4) 120%
      )
      #333;
  background-blend-mode: multiply, multiply;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
