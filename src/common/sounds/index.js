import Wad from "web-audio-daw";

export default {
  boom: new Wad({
    source: `${process.env.BASE_URL}assets/sounds/boom.wav`
  }),
  clap: new Wad({ source: `${process.env.BASE_URL}assets/sounds/clap.wav` }),
  hihat: new Wad({ source: `${process.env.BASE_URL}assets/sounds/hihat.wav` }),
  kick: new Wad({ source: `${process.env.BASE_URL}assets/sounds/kick.wav` }),
  openhat: new Wad({
    source: `${process.env.BASE_URL}assets/sounds/openhat.wav`
  }),
  ride: new Wad({ source: `${process.env.BASE_URL}assets/sounds/ride.wav` }),
  snare: new Wad({ source: `${process.env.BASE_URL}assets/sounds/snare.wav` }),
  tink: new Wad({ source: `${process.env.BASE_URL}assets/sounds/tink.wav` }),
  tom: new Wad({ source: `${process.env.BASE_URL}assets/sounds/tom.wav` })
};
