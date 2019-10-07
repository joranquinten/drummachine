<template>
  <div class="presets">
    <fieldset>
      <label for="presets">Presets</label>
      <a-select
        id="presets"
        v-model="selectedPresetIndex"
        placeholder="Choose a beat"
        @change="loadPreset"
      >
        <a-select-option
          v-for="(preset, index) in presets"
          :value="index"
          :key="index"
          >{{ preset.name }}</a-select-option
        >
      </a-select>
    </fieldset>
    <fieldset>
      <a-button @click="addPreset">Save current as preset</a-button>
    </fieldset>
  </div>
</template>
<script>
import presets from "../common/drummachine/presets";

export default {
  name: "DrumMachine",
  props: {
    current: {
      type: Array
    },
    load: {
      type: Function
    }
  },
  data() {
    return {
      presets,
      selectedPresetIndex: null
    };
  },
  methods: {
    addPreset() {
      const preset = this.current.reduce((preset, track) => {
        return preset.concat(
          track.reduce((beats, beat) => {
            if (beat.active) {
              return beats.concat({ track: beat.track, index: beat.index });
            }
            return beats;
          }, [])
        );
      }, []);

      this.presets.push({
        name: `New beat #${this.presets.length + 1}`,
        matrix: preset
      });
      this.selectedPresetIndex = this.presets[this.presets.length - 1].name;
    },
    savePreset() {},
    loadPreset() {
      if (this.selectedPresetIndex > -1) {
        this.load(this.presets[this.selectedPresetIndex]);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.presets {
  #presets {
    width: 300px;
  }
}
</style>
