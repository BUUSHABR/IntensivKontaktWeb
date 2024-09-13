import { useEffect, useState } from 'react';

export default function useAudioRecorder() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | undefined>(undefined);
  const [stream, setStream] = useState<MediaStream>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const temp = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(stream);
        setMediaRecorder(new MediaRecorder(stream));
      } catch (e) {
        console.log(e);
        setError(true);
      }
    };
    temp();
  }, [setMediaRecorder, setError]);

  return { mediaRecorder, error, stream };
}
