import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Blog from "./Blog";

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
            // if (idx === data.step && isOn) {
            //   data.playSound();
            //   console.log(`sound playing, idx`, idx);
            // }
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
  const [loading, setLoading] = useState(true);
  const [inBlog, setInBlog] = useState(false);
  const [sourceBuffers, setSourceBuffers] = useState<Array<AudioBuffer>>([]);
  const [soundNames, setSoundNames] = useState<Array<string>>([]);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    console.log(`soundNames`, soundNames);
    setLoading(false);
  }, [soundNames]);
  useEffect(() => {
    if (sourceBuffers.length < 4) {
      const loadFiles = async (fileNames: string[]) => {
        fileNames.map(async (fileName: string) => {
          const audioBuff = await fetch(`./${fileName}.wav`)
            .then((response) => response.arrayBuffer())
            .then((buffer) => audioContext.decodeAudioData(buffer));
          if (!sourceBuffers.find((e) => e.length === audioBuff.length)) {
            sourceBuffers.push(audioBuff);
            soundNames.push(fileName);
          }
        });
        setSourceBuffers(sourceBuffers);
        setSoundNames(soundNames);
      };
      loadFiles(["hhclosed", "kick", "snare", "clap"]);
    }
  });

  const [state, setState] = useState<Array<Array<boolean>>>([
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ]);

  const [bpm, setBpm] = useState(180);
  const [tmpBpm, setTmpBpm] = useState(0);

  const playSound = (idx: number) => {
    // if (buffer === undefined) return;
    const buffer = sourceBuffers[idx];
    var sourceSound = audioContext.createBufferSource(); // creates a sound source
    sourceSound.buffer = buffer; // tell the source which sound to play
    sourceSound.connect(audioContext.destination); // connect the source to the context's destination (the speakers)
    sourceSound.start(); // play the source now
    sourceSound.loop = false;
    // sourceSound.stop(audioContext.currentTime + 0.5);
  };
  const [step, setStep] = useState<Array<number>>([0, 0, 0, 0]);

  const reset = useRef<() => void>();

  const stepInterval = () => {
    setPlaying(true);
    audioContext.resume();
    console.log(`source buf`, sourceBuffers);
    console.log(`soudn names`, soundNames);

    const sI = setInterval(() => {
      // playSound(sourceBuffers.at(1), 0);
      setStep((t) =>
        t.map((stepN, idx) => {
          const maxIdx = idx >= state.length ? 1 : state[idx].length;
          const nextVal = stepN + 1 >= maxIdx ? 0 : stepN + 1;
          if (state[idx][nextVal]) {
            // console.log(`play sound`, state);
            playSound(idx);
          }
          return nextVal;
        })
      );
    }, (1 / (bpm / 60)) * 1000);
    reset.current = () => {
      setStep((t) => t.map((e) => 0));
      setPlaying(false);
      audioContext.suspend();
      clearInterval(sI);
    };
  };

  // useEffect(() => {
  //   const stepInterval = setInterval(() => {
  //     // playSound(sourceBuffers.at(1), 0);
  //     setStep((t) =>
  //       t.map((stepN, idx) => {
  //         const maxIdx = idx >= state.length ? 1 : state[idx].length;
  //         const nextVal = stepN + 1 >= maxIdx ? 0 : stepN + 1;
  //         if (state[idx][nextVal]) {
  //           // console.log(`play sound`, state);
  //           playSound();
  //         }
  //         return nextVal;
  //       })
  //     );
  //   }, (1 / (bpm / 60)) * 1000);
  //   reset.current = () => clearInterval(stepInterval);
  //   return () => {
  //     clearInterval(stepInterval);
  //   };
  // }, [bpm, state]);

  const handleOnChange = (event: any) => {
    const value = event.target.value;
    setTmpBpm(value);
  };

  return inBlog ? (
    <Blog setInBlog={setInBlog} />
  ) : loading ? (
    <div>LOADING</div>
  ) : (
    <div className="w-screen h-screen bg-blue-200 flex justify-center">
      {/* <div
        className="w-4 h-4 bg-blue-500"
        onClick={() => {
          stepInterval();
        }}
      ></div>
      <div
        className="w-4 h-4 bg-red-500"
        onClick={() => {
          reset.current && reset.current();
        }}
      ></div> */}
      <div className="w-[525px] flex flex-col shrink-0 grow-0 items-center justify-center">
        <div className="text-2xl font-family-sans my-4">
          POLYPHONIC DRUM MACHINE
        </div>
        <div className="w-full flex flex-row gap-4 items-center justify-items-stretch">
          <div className="pr-16">BPM: {bpm}</div>
          <input
            name="bpm_tmp"
            type="number"
            onChange={handleOnChange}
          ></input>{" "}
          <button
            onClick={() => setBpm(tmpBpm)}
            className="w-16 h-6 bg-white border border-1 border-black text-sm"
          >
            SET
          </button>
        </div>
        <button
          className={`w-28 h-16 ${
            playing ? "bg-gray-500" : "bg-green-500"
          } justify-center items-center flex my-4`}
          onClick={() => {
            stepInterval();
          }}
          disabled={playing}
        >
          play!
        </button>
        {state.map((e, idx) => {
          return (
            <DrumRow
              key={idx}
              data={{
                idx: idx,
                title: soundNames[idx],
                sound: "hello",
                currentState: state,
                setCurrentState: (arg0: boolean[][]) => {
                  reset.current && reset.current();
                  setState(arg0);
                },
                step: step[idx],
                playSound: () => playSound(1),
              }}
            />
          );
        })}
        <button
          className="my-8 w-36 h-8 bg-blue-400"
          onClick={() => setInBlog(true)}
        >
          See Blog
        </button>
        {/* <div
          className="w-20 h-8 bg-white m-2"
          onClick={() => {
            state.push([false]);
            setState(state);
            step.push(0);
            setStep(step);
          }}
        >
          add sound
        </div> */}
      </div>
    </div>
  );
}

export default App;
