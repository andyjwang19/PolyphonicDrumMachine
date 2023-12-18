import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import SoundEngine from "./SoundEngine";

interface stateSetup {
  hh: Array<boolean>;
  kd: Array<boolean>;
  sn: Array<boolean>;
  hho: Array<boolean>;
  tom: Array<boolean>;
}

interface drumButtonProps {
  isOn: boolean;
  isStep: boolean;
  onClick: () => void;
}

const DrumButton = ({ data }: { data: drumButtonProps }) => {
  const bgColor = data.isOn
    ? data.isStep
      ? "bg-red-500"
      : "bg-black"
    : data.isStep
    ? "bg-gray-300"
    : "bg-white";
  return (
    <div
      className={`w-12 h-16 border border-2 ${bgColor}`}
      onClick={data.onClick}
    ></div>
  );
};

interface drumRowProps {
  idx: number;
  title: string;
  sound: string;
  currentState: Array<Array<boolean>>;
  setCurrentState: (arg0: Array<Array<boolean>>) => void;
  step: number;
  playSound: () => void;
}

const DrumRow = ({ data }: { data: drumRowProps }) => {
  const rowState = data.currentState[data.idx];
  const setRowState = (row: Array<boolean>) => {
    data.setCurrentState(
      data.currentState.map((iterateRow, iedx) => {
        console.log(`map idx`, iedx);
        if (iedx === data.idx) {
          return row;
        } else return iterateRow;
      })
    );
  };

  const reduceRow = () => {
    if (rowState.length > 1) {
      rowState.pop();
      setRowState(rowState);
    }
  };
  const increaseRow = () => {
    rowState.push(false);
    setRowState(rowState);
  };

  return (
    <div>
      {data.title}
      <div className="flex flex-row gap-5 items-center">
        <div
          className="w-8 h-10 bg-white text-3xl text-center"
          onClick={reduceRow}
        >
          -
        </div>
        <div className="flex flex-row gap-5 items-center">
          {rowState.map((isOn, idx) => {
            if (idx === data.step && isOn) {
              data.playSound();
              console.log(`playsoudn`, data.playSound);
            }
            const toggled = rowState
              .slice(0, idx)
              .concat(!isOn)
              .concat(rowState.slice(idx + 1));

            return (
              <DrumButton
                key={idx}
                data={{
                  isOn,
                  isStep: idx === data.step,
                  onClick: () => setRowState(toggled),
                }}
              />
            );
          })}
        </div>
        <div
          className="w-8 h-10 bg-white text-3xl text-center"
          onClick={increaseRow}
        >
          +
        </div>
      </div>
    </div>
  );
};

function App() {
  const audioContext = new AudioContext();
  const [sourceBuffers, setSourceBuffers] = useState<Array<AudioBuffer>>([]);
  useEffect(() => {
    const loadFiles = async (fileName: string) => {
      const audioBuff = await fetch(`./${fileName}.wav`)
        .then((response) => response.arrayBuffer())
        .then((buffer) => audioContext.decodeAudioData(buffer));
      sourceBuffers.push(audioBuff);
      setSourceBuffers(sourceBuffers);
    };
    loadFiles("hhclosed");
    loadFiles("kick");
    // loadFiles("clap");
    // loadFiles("snare");
  });

  const [state, setState] = useState<Array<Array<boolean>>>([
    [false, false, false],
  ]);

  const soundIndexes = [""];
  const [bpm, setBpm] = useState(100);
  const [tmpBpm, setTmpBpm] = useState(0);

  const [step, setStep] = useState<Array<number>>([0]);
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep((t) =>
        t.map((stepN, idx) => {
          const maxIdx = idx >= state.length ? 1 : state[idx].length;
          return stepN + 1 >= maxIdx ? 0 : stepN + 1;
        })
      );
    }, (1 / (bpm / 60)) * 1000);
    return () => {
      clearInterval(stepInterval);
    };
  }, [bpm, state]);

  const handleOnChange = (event: any) => {
    const value = event.target.value;
    setTmpBpm(value);
  };

  const sounds = [
    "closed high hat",
    "kick drum",
    "snare drum",
    "tom",
    "open high hat",
  ];
  const playSound = (bufferIdx: number, time: number) => {
    const buffer = sourceBuffers[bufferIdx];
    var sourceSound = audioContext.createBufferSource(); // creates a sound source
    sourceSound.buffer = buffer; // tell the source which sound to play
    sourceSound.connect(audioContext.destination); // connect the source to the context's destination (the speakers)
    console.log(`source soudn`, sourceSound);
    sourceSound.start(); // play the source now
    sourceSound.loop = false;
    // sourceSound.stop(audioContext.currentTime + 0.5);
  };

  return (
    <div className="w-screen h-screen bg-blue-200 flex justify-center">
      {/* <div
        className="w-4 h-4 bg-red-500"
        onClick={() => {
          playSound(sourceBuffers[0], 0);
        }}
      ></div> */}
      <div className="w-[525px] flex flex-col grow-0 items-center justify-center">
        <div className="text-2xl font-family-sans">POLYPHONIC DRUM MACHINE</div>
        <div className="w-full flex flex-row gap-4 items-center justify-items-stretch">
          <div className="pr-16">BPM: {bpm}</div>
          <input
            name="bpm_tmp"
            type="number"
            onChange={handleOnChange}
          ></input>{" "}
          <button
            onClick={() => setBpm(tmpBpm)}
            className="w-4 h-4 bg-black"
          ></button>
        </div>
        {state.map((e, idx) => {
          return (
            <DrumRow
              key={idx}
              data={{
                idx: idx,
                title: sounds[idx],
                sound: "hello",
                currentState: state,
                setCurrentState: setState,
                step: step[idx],
                playSound: () => playSound(idx, 0),
              }}
            />
          );
        })}
        <div
          className="w-20 h-8 bg-white m-2"
          onClick={() => {
            state.push([false]);
            setState(state);
            step.push(0);
            setStep(step);
          }}
        >
          add sound
        </div>
      </div>
    </div>
  );
}

export default App;
