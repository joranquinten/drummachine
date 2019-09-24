// Instantiace a drummachine, the track matrix is generated on start
// Provide a function to execute on each step in the matrix (for instance, play sound for every column on that particular index)
// TODO: walk through columns, provide callback for end of column

export default class Drummachine {
  constructor(
    config = {
      bpm: null, // Set the bpm
      loop: null, // The thing you want to execute on the timeline
      numberOfTracks: 3, // Starting number of tracks
      base: 4 // Measurements (so 4 intervals per beat)
    }
  ) {
    this.bpm = config.bpm || 60;
    this.base = config.base || 8;
    this.loop = config.loop || null;
    this.numberOfTracks = config.numberOfTracks || 3;
    this.started = false;
    this.stopped = false;
    this.trackMatrix = this._createTrackMatrix();
    this.interval = null;
    this.iterations = 0;
    this.currentBeat = null;
  }

  getStatus() {
    const {
      bpm,
      interval,
      iterations,
      numberOfTracks,
      started,
      stopped
    } = this;
    return {
      bpm,
      interval,
      iterations,
      numberOfTracks,
      started,
      stopped
    };
  }

  _bpmToInterval() {
    return 60000 / this.getBPM() / this.base;
  }

  _createTrackMatrix() {
    return (this.trackMatrix = Array.from(
      { length: this.numberOfTracks },
      (item, index) => this._createTrack(this.base, index)
    ));
  }

  _createTrack(base = 4, track = 0) {
    return Array.from(new Array(base).fill({})).map(
      (item, index) => (item = { track, index })
    );
  }

  _updateTrackMatrix(oldNumberOfTracks, newNumberOfTracks) {
    const diff = newNumberOfTracks - oldNumberOfTracks;
    if (diff > 0) {
      this.trackMatrix = this.trackMatrix.concat(new Array(diff));
    }
    if (diff < 0) {
      this.trackMatrix = this.trackMatrix.slice(-diff);
    }
  }

  start(cb) {
    this.started = true;
    if (this.interval) this.stop();
    this.currentBeat = 0;
    this.interval = setInterval(() => {
      if (this.currentBeat >= this.trackMatrix[0].length - 1) {
        this.currentBeat = 0;
      } else {
        this.currentBeat = this.currentBeat + 1;
      }
      if (typeof this.loop === "function") this.loop();
    }, this._bpmToInterval());
    if (typeof cb === "function") cb();
  }

  stop() {
    this.started = false;
    clearInterval(this.interval);
  }

  setBPM(bpm) {
    this.bpm = bpm;
  }

  getBPM() {
    return this.bpm;
  }

  getBPMInterval() {
    return this._bpmToInterval();
  }

  setTracks(tracks) {
    this._updateTrackMatrix(this.numberOfTracks, tracks);
    this.numberOfTracks = tracks;
  }

  setBase(base = 8) {
    this.base = base;
    this.trackMatrix = this._createTrackMatrix();
    this.start();
  }

  getTrackMatrix() {
    return this.trackMatrix;
  }

  addToTrackMatrix(track = -1, index = -1, object) {
    if (track >= 0 && track < this.trackMatrix.length) {
      if (index >= 0 && index < this.trackMatrix[track].length) {
        this.trackMatrix[track][index] = object;
      }
    }
  }

  getCurrentBeat() {
    if (this.currentBeat >= 0 && this.getTrackMatrix())
      return this.getTrackMatrix().map(track => track[this.currentBeat]);
    return;
  }
}
