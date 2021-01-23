import React, { useState } from "react";
import { SvgLib } from "components/components";
import { useInterval } from "utils/utils";

const Metronome = () => {
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(90);
  const [bpmInput, setBpmInput] = useState(90);
  const [count, setCount] = useState(1);

  const handleChange = (event) => {
    setBpmInput(event.target.value);
    setBpm(
      event.target.value < 20
        ? 20
        : event.target.value > 300
        ? 300
        : event.target.value
    );
  };

  const playStop = () => {
    setCount(1);
    setPlaying(!playing);
  };

  const playNote = (beat) => {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // create an oscillator
    const osc = audioContext.createOscillator();
    const envelope = audioContext.createGain();

    osc.frequency.value = beat === 4 ? 1000 : 800;
    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(1, 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.001, 0.02);

    osc.connect(envelope);
    envelope.connect(audioContext.destination);

    osc.start(0);
    osc.stop(0.03);
    console.log(beat);
  };

  useInterval(
    () => {
      setCount(count === 4 ? 1 : count + 1);

      playNote(count);
    },
    playing ? (60 / bpm) * 1000 : null
  );

  return (
    <div className={`Metronome`}>
      <div className="Metronome__btn" onClick={(e) => playStop()}>
        <SvgLib svg={playing ? "pause" : "play"} />
      </div>
      <div className={`Metronome__bpm ${bpmInput !== bpm ? "--error" : ""}`}>
        <input
          type="number"
          min="20"
          max="300"
          step="1"
          value={bpmInput}
          onChange={handleChange}
        />
        <span>BPM</span>
      </div>
    </div>
  );
};

export default Metronome;
