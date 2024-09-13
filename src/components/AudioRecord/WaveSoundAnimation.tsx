import React, { useEffect, useRef, useState } from 'react';
import styles from './WaveSoundAnimation.module.css';

const WaveSoundAnimation = () => {
  const averageVolumeRef = useRef<any>();
  const [volumeArray, setVolumeArray] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [renderAnimation, setRenderAnimation] = useState(false);
  let stream: MediaStream | null = null;
  let averageVolume = 0;
  const delayTimeout = 50;

  const getAudioStream = async () => {
    if (navigator.mediaDevices.getUserMedia !== null) {
      const options = {
        video: false,
        audio: true,
      };

      try {
        stream = await navigator.mediaDevices.getUserMedia(options);
        const audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        const audioSrc = audioCtx.createMediaStreamSource(stream);
        audioSrc.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        const getAverageVolume = () => {
          averageVolumeRef.current = setInterval(() => {
            analyser.getByteFrequencyData(data);
            const arraySum = data.reduce((a, value) => a + value, 0);
            averageVolume = arraySum / data.length;
          }, delayTimeout);
        };

        getAverageVolume();
      } catch (err) {
        // error handling
      }
    }
  };

  useEffect(() => {
    getAudioStream();
    setRenderAnimation(true);
    const addArraay = setInterval(() => {
      setVolumeArray((t) => [...t.slice(1, volumeArray.length - 1), Math.round(averageVolume)]);
    }, delayTimeout);

    return () => {
      clearInterval(addArraay);
      clearInterval(averageVolumeRef.current);
      stream?.getAudioTracks().map((track) => {
        track.stop();
      });
    };
  }, []);

  return (
    <div className={styles.waveWrapper}>
      <div className={`${styles.waveContainer} ${renderAnimation && styles.animation}`}>
        {volumeArray.map((item, index) => {
          return (
            <div
              style={{
                width: '3px',
                backgroundColor: '#EB5757',
                height: `${item > 45 ? 45 : 3 + item * 1.3}px`,
                marginRight: '3px',
                borderRadius: '50px',
                color: 'transparent',
              }}
              key={index}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WaveSoundAnimation;
