<template>
  <div id="app">
    <DrumMachine />
    <footer>
      Built with ❤️ by
      <a
        href="https://joranquinten.nl"
        title="Joran Quinten, freelance webdeveloper"
        >Joran Quinten</a
      >
    </footer>
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

<style lang="scss">
html,
html body {
  background: #111;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    text-align: center;
    color: #cfcfcf;
    padding: 0.4em 0;

    a {
      color: #cfcfcf;
    }
  }
}
</style>
