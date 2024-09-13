import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as PlayAudioIcon } from '../../assets/icons/play-audio.svg';
import { ReactComponent as StopAudioIcon } from '../../assets/icons/stop-audio.svg';
// @ts-ignore
import WaveSurfer from 'wavesurfer.js';

type NativeAudioPlayerProps = {
  audio: string;
};

const NativeAudioPlayer = ({ audio }: NativeAudioPlayerProps) => {
  //animation per seconds
  const ANIMATION_MULTIPLIER_PER_SECOND = 20;

  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [waveSurfer, setWaveSurfer] = useState<any>();

  // references
  const audioPlayer = useRef<any>(); // reference our audio component
  const progressBar = useRef<any>(); // reference our progress bar
  const animationRef = useRef<any>(); // reference the animation
  const waveformRef = useRef<any>(null);

  useEffect(() => {
    setWaveSurfer(
      WaveSurfer.create({
        barWidth: 3,
        barRadius: 3,
        barGap: 2,
        barMinHeight: 1,
        cursorWidth: 1,
        container: waveformRef.current,
        backend: 'WebAudio',
        height: 50,
        progressColor: '#D3E4E8',
        responsive: true,
        waveColor: '#CBCFD5',
        cursorColor: 'transparent',
      }),
    );
  }, []);

  useEffect(() => {
    if (waveSurfer) {
      waveSurfer.load(audio);
      waveSurfer.setMute(true);
      waveSurfer.toggleInteraction();
    }
  }, [waveSurfer]);

  useEffect(() => {
    audioPlayer.current.onloadedmetadata = () => {
      const seconds = audioPlayer?.current?.duration;
      setDuration(seconds);
      progressBar.current.max = seconds * ANIMATION_MULTIPLIER_PER_SECOND;

      setIsPlaying(false);
      setCurrentTime(0);

      waveSurfer.pause();
      waveSurfer.seekTo(0);

      audioPlayer.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        progressBar.current.value = 0;

        waveSurfer.pause();
        waveSurfer.seekTo(0);

        cancelAnimationFrame(animationRef.current);
      };

      return () => {
        cancelAnimationFrame(animationRef.current);
        waveSurfer.destroy();
      };
    };
  }, [waveSurfer, audioPlayer]);

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      waveSurfer.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      waveSurfer.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime * ANIMATION_MULTIPLIER_PER_SECOND;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value / ANIMATION_MULTIPLIER_PER_SECOND;
    changePlayerCurrentTime();
    waveSurfer.seekTo(currentTime / duration);
  };

  const changePlayerCurrentTime = () => {
    setCurrentTime(progressBar.current.value / ANIMATION_MULTIPLIER_PER_SECOND);
  };

  //stop all audio files except the current one
  useEffect(() => {
    let players = document.querySelectorAll('audio');
    players.forEach((player) => {
      player.addEventListener('play', playHandler);
    });
    function playHandler(e: any) {
      players.forEach((player) => {
        if (e.target !== player) {
          player.load();
        }
      });
    }
  }, []);

  return (
    <div>
      <audio ref={audioPlayer} src={audio} preload="metadata"></audio>
      <div className="flex items-center pt-[10px] pb-[10px]">
        <div className="mr-[11px]">
          <div onClick={togglePlayPause} className="cursor-pointer">
            {isPlaying ? <StopAudioIcon /> : <PlayAudioIcon />}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: '18px',
            flexGrow: 3,
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 2,
            }}
          >
            <input
              type="range"
              defaultValue="0"
              ref={progressBar}
              onChange={changeRange}
              onClick={changeRange}
              className="my2-slider"
            />
          </div>

          <div
            style={{
              position: 'relative',
              height: '100px',
              top: '-40px',
              //top: '-24px',
              zIndex: 1,
            }}
          >
            <div ref={waveformRef}></div>
          </div>
        </div>
      </div>
      <span className="text-[11px] text-int-grey-60 text-center font-BeVietnamRegular">
        {calculateTime(Math.round(duration - currentTime))}
      </span>
    </div>
  );
};

export default NativeAudioPlayer;
