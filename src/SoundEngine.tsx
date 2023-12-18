import { useEffect, useRef, useState } from "react";

const SoundEngine = () => {
  //   const [file, setFile] = useState<File>();
  //   const canvasRef = useRef(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement>();
  //   const source = useRef<MediaElementAudioSourceNode>();
  //   const trigger = useRef<AudioScheduledSourceNode>();
  //   let analyzer = useRef();
  // if (audioRef) {
  // load files useeff
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
    // loadFiles("kick");
    // loadFiles("clap");
    // loadFiles("snare");
  });
  const playSound = (buffer: AudioBuffer, time: number) => {
    var sourceSound = audioContext.createBufferSource(); // creates a sound source
    sourceSound.buffer = buffer; // tell the source which sound to play
    sourceSound.connect(audioContext.destination); // connect the source to the context's destination (the speakers)
    sourceSound.start(); // play the source now
    sourceSound.stop(audioContext.currentTime + 0.2);
  };
  return playSound(sourceBuffers[0], 0);

  //   return (
  //     <div classname="app">
  //       {/* <div className="w-16 h-16 bg-black"></div> */}
  //       {/* <input
  //         type="file"
  //         onChange={({ target: { files } }) => {
  //           if (files && files[0]) setFile(files[0]);
  //         }}
  //       /> */}
  //       {/* <audio
  //         onPlay={handleAudioPlay}
  //         ref={(input) => {
  //           input && setAudioRef(input);
  //         }}
  //         src="./hhclosed.wav"
  //         controls
  //       /> */}
  //       <div
  //         className="w-4 h-4 bg-red-500"
  //         onClick={() => {
  //           sourceBuffers.map((buf, idx) => playSound(buf, idx));
  //         }}
  //       ></div>
  //       {/* {file && (
  //         <audio
  //           onPlay={handleAudioPlay}
  //           src={window.URL.createObjectURL(file)}
  //           controls
  //         />
  //       )}
  //       <canvas ref={canvasRef} width={500} height={200} /> */}
  //     </div>
  //   );
};

export default SoundEngine;
