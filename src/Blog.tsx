export default function Blog({
  setInBlog,
}: {
  setInBlog: (arg0: boolean) => void;
}) {
  return (
    <div className="bg-blue-200 w-full h-full flex flex-col items-center shrink-0">
      <div className="text-2xl pt-8">Blog Writeup</div>
      <div className="text-md w-[800px] py-8">
        This is a Polyphonic drum machine. I knew, when I started this project,
        that I wanted to do something with percussion, as the rhythmic aspect of
        music appeals a lot to me. I have some music production experience, and
        one critical tool that is used is the drum machine, where different
        switches can be selected, and a timer will push the currently playing
        column forward on a specific bpm. I started implementing this, with the
        Polyphony as an afterthought. Working through it, I realized that the
        polyphony would be the most interesting part of this, as drum machines
        exist (and better), and adding different cycle lengths would allow the
        drum machine to become a different tool, one that creates interesting
        common multiples and patterns as different cycle lengths interacted.
        <br></br>
        <br></br>To start, I tried to use the WebAudio sound scheduling feature
        to place every beat at the time given, but I quickly found that
        difficult to do dynamically. Additionally, I found it made more sense to
        play each sound from an AudioBuffer when the state variable called for
        it. Thus, my code runs as follows: A 2D boolean array controls the state
        of the board, with the selected options marked as true and unselected as
        false. Each sound/row has its own independent step variable, which keeps
        track of the step that each row is on. It is done independently to allow
        the polyphonics to occur, with each sound playing on its own cycle.
        <br></br>
        <br></br>
        When the step of each row lands on something the 2D state variable says
        is "true", a helper function is called, that creates the AudioBuffer,
        connects it to the audioContext destination, and plays the sound. Thus,
        we are able to scheudle sounds without doing several calculations ahead
        of time.
        <br></br>
        <br></br>
        When each row has a different cycle length, and those cycle lengths have
        greatest common factors of 1, it creates interesting mixes, as it takes
        x*y steps until the pattern repeats.
        <br></br>
        <br></br>
        The code was written in ReactJS and Typescript, with Webaudio
        implemented within the Typescript framework. Tailwind CSS was used for
        styling, and the project was hosted on AWS. Github was used to track
        changes. You can see the code base at{" "}
        <a
          className="underline font-blue"
          href="https://github.com/andyjwang19/PolyphonicDrumMachine"
        >
          this link
        </a>
        .
      </div>
      <button
        className="w-48 h-16 bg-blue-400 mb-16"
        onClick={() => setInBlog(false)}
      >
        Return to Machine
      </button>
    </div>
  );
}
