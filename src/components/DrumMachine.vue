<template>
  <div class="drum-machine">
    <fieldset v-if="matrix" class="matrix" :key="matrixKey">
      <div
        class="track"
        :key="trackIndex"
        v-for="(track, trackIndex) in matrix"
      >
        <button
          class="beat"
          :class="{ active: beat.index === currentBeatIndex, on: beat.active }"
          :key="beatIndex"
          v-for="(beat, beatIndex) in track"
          @click="toggleBeat(beat)"
        >
          {{ beat }}
        </button>
      </div>
      <div class="track">
        <span
          v-for="i in beatsBase"
          :key="i"
          class="beat beat-stepper"
          :class="{ active: i - 1 === currentBeatIndex }"
          >{{ i }}</span
        >
      </div>
    </fieldset>
    <div class="current-beat">{{ currentBeat }}</div>
    <button @click="start" v-if="!isRunning">Start</button>
    <button @click="stop" v-if="isRunning">Stop</button>

    <select v-model="selectedBPM" @change="changeBPM">
      <option
        :value="bpm"
        :key="bpm"
        v-for="bpm in [180, 140, 120, 80, 60, 40, 30, 20]"
        >{{ bpm }}</option
      >
    </select>
  </div>
</template>
<script>
import Drummachine from "../common/drummachine";

export default {
  name: "DrumMachine",
  data() {
    return {
      matrix: null,
      currentBeat: null,
      machine: null,
      isRunning: false,
      interval: null,
      selectedBPM: 30,
      beatsBase: 8,
      matrixKey: 0
    };
  },
  mounted() {
    this.machine = new Drummachine({
      bpm: this.selectedBPM,
      base: this.beatsBase,
      loop: () => this.playBeat()
    });
    this.matrix = this.machine.getTrackMatrix();
  },
  computed: {
    currentBeatIndex() {
      return this.currentBeat ? this.currentBeat[0].index : -1;
    },
    currentMatrix() {
      return this.machine.getTrackMatrix();
    }
  },
  methods: {
    start() {
      this.machine.start(() => {
        this.isRunning = true;
      });
    },
    stop() {
      this.isRunning = false;
      this.machine.stop();
    },
    toggleBeat(beat = {}) {
      const newBeat = beat.active
        ? { ...beat, active: false }
        : { ...beat, active: true };

      this.machine.addToTrackMatrix(beat.track, beat.index, newBeat);
      this.matrix = this.machine.getTrackMatrix();
      this.forceRerender();
    },
    playBeat() {
      this.currentBeat = this.machine.getCurrentBeat();
    },
    changeBPM() {
      if (this.isRunning) {
        this.stop();
        this.machine.setBPM(this.selectedBPM);
        this.start();
      } else {
        this.machine.setBPM(this.selectedBPM);
      }
    },
    forceRerender() {
      this.matrixKey += 1;
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style lang="scss" scoped>
.matrix {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  .track {
    display: inline-flex;
    flex: 0 0 25%;
    border: 1px solid #333;
    padding: 1em 0;
    justify-content: space-between;

    .beat {
      flex: 1 0 0;
      margin: 0 4px;
      display: block;
      border: 1px solid #111;
      &.active {
        border-color: red;
      }
      &.on {
        border-color: blue;
      }
    }

    .beat-stepper {
      &.active {
        background-color: red;
      }
    }
  }
}
</style>
