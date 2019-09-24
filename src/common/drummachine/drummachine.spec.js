import Drummachine from "./";

describe("drummachine class", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should return it's current status", () => {
    const testDrums = new Drummachine();
    const drumStatus = testDrums.getStatus();
    expect(drumStatus).toEqual({
      bpm: 60,
      interval: null,
      iterations: 0,
      numberOfTracks: 3,
      started: false,
      stopped: false
    });
  });

  it("execute the loop() at 1 seconds intervals by default", () => {
    const mockLoop = jest.fn();
    const testDrums = new Drummachine({ base: 1, loop: mockLoop });
    testDrums.start();

    jest.advanceTimersByTime(900);
    expect(mockLoop).toBeCalledTimes(0);
    jest.advanceTimersByTime(200);
    expect(mockLoop).toBeCalledTimes(1);
  });

  it("control the playback with the controls", () => {
    const mockLoop = jest.fn();
    const testDrums = new Drummachine({ base: 1, loop: mockLoop });
    testDrums.start();

    jest.advanceTimersByTime(900);
    expect(mockLoop).toBeCalledTimes(0);
    jest.advanceTimersByTime(200);
    expect(mockLoop).toBeCalledTimes(1);

    testDrums.stop();
    jest.advanceTimersByTime(1000);
    expect(mockLoop).toBeCalledTimes(1);

    testDrums.start();
    jest.advanceTimersByTime(1000);
    expect(mockLoop).toBeCalledTimes(2);
  });

  it("should be able to control the bpm", () => {
    const mockLoop = jest.fn();
    const testDrums = new Drummachine({ bpm: 120, base: 1, loop: mockLoop });
    testDrums.start();

    jest.advanceTimersByTime(500);
    expect(mockLoop).toBeCalledTimes(1);

    testDrums.setBPM(1);
    jest.advanceTimersByTime(1000);
    expect(mockLoop).toBeCalledTimes(1);
    jest.advanceTimersByTime(59000);
    expect(mockLoop).toBeCalledTimes(2);

    testDrums.setBPM(180);
    jest.advanceTimersByTime(1000);
    expect(mockLoop).toBeCalledTimes(4);
  });

  it("should return a trackmatrix", () => {
    const testDrums = new Drummachine();

    expect(testDrums.getTrackMatrix()).toEqual(null);
    testDrums.start();
    expect(testDrums.getTrackMatrix().length).toEqual(3);
    expect(testDrums.getTrackMatrix()[0].length).toEqual(4);

    testDrums.setBase(2);
    expect(testDrums.getTrackMatrix()[0].length).toEqual(2);

    testDrums.setBase();
    expect(testDrums.getTrackMatrix()[0].length).toEqual(8);
  });

  it("should be able to add and remove tracks", () => {
    const testDrums = new Drummachine();

    testDrums.start();
    expect(testDrums.getTrackMatrix().length).toEqual(3);

    testDrums.setTracks(4);
    expect(testDrums.getTrackMatrix().length).toEqual(4);

    testDrums.setTracks(2);
    expect(testDrums.getTrackMatrix().length).toEqual(2);
  });

  it("should be able to add items to correct place in the matrix", () => {
    const testDrums = new Drummachine();

    testDrums.start();
    testDrums.addToTrackMatrix(0, 0, { thing: "0,0" });
    expect(testDrums.getTrackMatrix()[0][0].thing).toEqual("0,0");
    expect(testDrums.getTrackMatrix()[1][0].thing).toBeUndefined();
    expect(testDrums.getTrackMatrix()[0][1].thing).toBeUndefined();

    testDrums.addToTrackMatrix(1, 1, { thing: "1,1" });
    expect(testDrums.getTrackMatrix()[1][1].thing).toEqual("1,1");

    const notChangedMatrix = testDrums.getTrackMatrix();
    testDrums.addToTrackMatrix(10, 10, { thing: "10,10" });
    expect(testDrums.getTrackMatrix()).toEqual(notChangedMatrix);
    testDrums.addToTrackMatrix();
    expect(testDrums.getTrackMatrix()).toEqual(notChangedMatrix);
    testDrums.addToTrackMatrix(0);
    expect(testDrums.getTrackMatrix()).toEqual(notChangedMatrix);
  });

  it("should return all of the beats", () => {
    const mockLoop = jest.fn();
    const testDrums = new Drummachine({ bpm: 60, base: 4, loop: mockLoop });

    expect(testDrums.getCurrentBeat()).toBeUndefined();

    testDrums.start();

    const interval = testDrums.getBPMInterval();
    expect(interval).toEqual(250);

    expect(testDrums.getCurrentBeat()).toEqual([
      { track: 0, index: 0 },
      { track: 1, index: 0 },
      { track: 2, index: 0 }
    ]);

    jest.advanceTimersByTime(interval);

    expect(testDrums.getCurrentBeat()).toEqual([
      { track: 0, index: 1 },
      { track: 1, index: 1 },
      { track: 2, index: 1 }
    ]);

    jest.advanceTimersByTime(interval * 3);

    expect(testDrums.getCurrentBeat()).toEqual([
      { track: 0, index: 0 },
      { track: 1, index: 0 },
      { track: 2, index: 0 }
    ]);
  });
});
