<template>
  <div class="drum-machine">
    <fieldset v-if="matrix && trackSounds" class="matrix" :key="matrixKey">
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
          {{ trackSounds[beat.track] }}
        </button>
      </div>
      <div v-if="false" class="track">
        <span
          v-for="i in beatsBase"
          :key="i"
          class="beat beat-stepper"
          :class="{ active: i - 1 === currentBeatIndex }"
          >&nbsp;</span
        >
      </div>
    </fieldset>

    <div class="controls">
      <a-button-group>
        <a-button @click="start" :disabled="isRunning">
          Play
        </a-button>
        <a-button @click="stop" :disabled="!isRunning">
          Pause
        </a-button>
        <a-button @click="clearAll">
          Clear
        </a-button>
      </a-button-group>

      <a-slider
        v-model="selectedBPM"
        @change="changeBPM"
        :min="30"
        :max="180"
        :step="10"
        :tipFormatter="v => `${v} bpm`"
      />
      <Presets :current="this.matrix" :load="loadBeat" />
    </div>
  </div>
</template>
<script>
import Drummachine from "../common/drummachine";
import effects from "../common/sounds/";

import Presets from "./Presets";

export default {
  name: "DrumMachine",
  components: {
    Presets
  },
  data() {
    return {
      matrix: null,
      currentBeat: null,
      machine: null,
      isRunning: false,
      interval: null,
      selectedBPM: 120,
      numberOfTracks: 9,
      beatsBase: 8,
      matrixKey: 0,
      trackSounds: null
    };
  },
  mounted() {
    this.machine = new Drummachine({
      bpm: this.selectedBPM,
      base: this.beatsBase,
      numberOfTracks: this.numberOfTracks,
      loop: () => this.playBeat()
    });
    this.matrix = this.machine.getTrackMatrix();
    this.trackSounds = Object.keys(effects);
  },
  computed: {
    currentBeatIndex() {
      return this.currentBeat ? this.currentBeat[0].index : -1;
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
      this.currentBeat = null;
      this.machine.stop();
    },
    clearAll() {
      this.matrix.map(track => {
        track.map(beat => {
          beat.active = false;
        });
      });
      this.forceRerender();
      this.stop();
    },
    toggleBeat(beat = {}) {
      const newBeat = beat.active
        ? { ...beat, active: false }
        : { ...beat, active: true };

      this.machine.addToTrackMatrix(beat.track, beat.index, newBeat);
      this.forceRerender();
    },
    playBeat() {
      this.currentBeat = this.machine.getCurrentBeat();

      this.currentBeat.map(beat => {
        if (beat.active) {
          const sound = this.trackSounds[beat.track];
          effects[sound].play();
        }
      });
    },
    loadBeat(preset) {
      const wasRunning = this.isRunning;
      this.clearAll();
      preset.matrix.map(beat => {
        if (this.matrix[beat.track] && this.matrix[beat.track][beat.index]) {
          const newBeat = {
            ...this.matrix[beat.track][beat.index],
            active: true
          };
          this.machine.addToTrackMatrix(newBeat.track, newBeat.index, newBeat);
          this.forceRerender();
        }
      });
      if (wasRunning) this.start();
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
.drum-machine {
  transform: perspective(800px) rotateX(15deg);
  .matrix {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    max-width: 80vw;
    margin: 0 auto;
    box-shadow: none;
    border: none;
    outline: none;

    .track {
      display: inline-flex;
      flex: 0 0 25%;
      padding: 4px 0;
      justify-content: space-between;

      button {
        cursor: pointer;
        border-radius: 2px;
        padding: 1.4em 0;
      }

      .beat {
        flex: 1 0 0;
        margin: 0 4px;
        display: block;
        border: 1px solid #8be9fd;
        box-shadow: 0px 5px 3px 0px rgba(139, 233, 253, 0.75);
        &.active {
          transform: translateY(2px);
          background: #50fa7b;
          box-shadow: 0px 3px 3px 0px rgba(105, 255, 148, 0.75);
          outline: 0px 3px 3px 0px rgba(105, 255, 148, 0.75);
        }
        &.on {
          transform: translateY(2px);
          background: #ff79c6;
          box-shadow: 0px 3px 3px 0px rgba(255, 146, 223, 0.75);
          outline: 0px 3px 3px 0px rgba(255, 146, 223, 0.75);
        }
      }

      .beat-stepper {
        &.active {
          transform: translateY(2px);
          background: #ff79c6;
          box-shadow: 0px 3px 3px 0px rgba(255, 146, 223, 0.75);
          outline: 0px 3px 3px 0px rgba(255, 146, 223, 0.75);
        }
      }
    }
  }

  .controls {
    z-index: 1;
    max-width: 400px;
    margin: 2em auto 0;
    transform: perspective(800px) rotateX(-15deg);
  }
}
</style>
