import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as PlayAudioIcon } from '../../assets/icons/play-audio.svg';
import { ReactComponent as StopAudioIcon } from '../../assets/icons/stop-audio.svg';
import { ReactComponent as MicrophoneIcon } from 'assets/icons/microphone.svg';
import { ReactComponent as MoveForwardIcon } from 'assets/icons/move-forward.svg';
import { ReactComponent as MoveBackIcon } from 'assets/icons/move-back.svg';
// @ts-ignore
import WaveSurfer from 'wavesurfer.js';

type NativeAudioPlayerProps = {
  audio: string;
  date: string;
};

const MediaAudioPlayer = ({ audio, date }: NativeAudioPlayerProps) => {
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
  }, [waveSurfer, audio]);

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
    if (audioPlayer && audioPlayer.current) {
      progressBar.current.value = audioPlayer.current.currentTime * ANIMATION_MULTIPLIER_PER_SECOND;
      changePlayerCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value / ANIMATION_MULTIPLIER_PER_SECOND;
    changePlayerCurrentTime();
    waveSurfer.seekTo(currentTime / duration);
  };

  const changePlayerCurrentTime = () => {
    setCurrentTime(progressBar.current.value / ANIMATION_MULTIPLIER_PER_SECOND);
  };

  const moveForward = () => {
    audioPlayer.current.currentTime = audioPlayer.current.currentTime + 15;
    progressBar.current.value = audioPlayer.current.currentTime * ANIMATION_MULTIPLIER_PER_SECOND;
    changePlayerCurrentTime();
  };

  const moveBack = () => {
    audioPlayer.current.currentTime = audioPlayer.current.currentTime - 15;
    progressBar.current.value = audioPlayer.current.currentTime * ANIMATION_MULTIPLIER_PER_SECOND;
    changePlayerCurrentTime();
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
    <div className="bg-[#D3E8E6] rounded-[10px] mb-[10px] px-[26px] pt-[16px] pb-[40px]">
      <audio ref={audioPlayer} src={audio} preload="metadata"></audio>
      <div className="flex flex-row mb-[40px]">
        <div className="pr-[40px] pt-[5px]">
          <MicrophoneIcon className="text-int-dark-blue" />
        </div>
        <div className="flex flex-col">
          <span className="text-base text-left text-int-grey-60 ">Sprachnachricht</span>
          <span className="text-[11px] text-int-grey-60 text-left font-BeVietnamRegular">
            {date}
          </span>
        </div>
      </div>

      <div className="flex items-center">
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
              height: '10px',
              top: '-18px',
              //top: '-24px',
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: `${!isNaN(currentTime / duration) ? (currentTime / duration) * 100 : 0}%`,
                height: '5px',
                backgroundColor: '#6F7782',
                position: 'absolute',
                borderRadius: '16px',
                zIndex: 2,
              }}
            ></div>
            <div
              style={{
                width: '100%',
                height: '5px',
                backgroundColor: '#6F7782',
                position: 'absolute',
                borderRadius: '16px',
                zIndex: 1,
              }}
            ></div>
            <div ref={waveformRef} className="hidden"></div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-[11px] text-int-grey-60 text-center font-BeVietnamRegular">
          {calculateTime(Math.round(currentTime))}
        </span>
        <span className="text-[11px] text-int-grey-60 text-center font-BeVietnamRegular">
          -{calculateTime(Math.round(duration - currentTime))}
        </span>
      </div>
      <div className="mt-[6px] flex flex-row justify-center">
        <div className="mr-[30px] cursor-pointer" onClick={() => moveBack()}>
          <MoveBackIcon />
        </div>
        <div onClick={togglePlayPause} className="cursor-pointer flex items-center">
          {isPlaying ? <StopAudioIcon /> : <PlayAudioIcon />}
        </div>
        <div className="ml-[30px] cursor-pointer" onClick={() => moveForward()}>
          <MoveForwardIcon />
        </div>
      </div>
    </div>
  );
};

export default MediaAudioPlayer;
