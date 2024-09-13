import React from 'react';
import { FButton } from '../../styles/form';

const UploadResultModalContent = ({
  close,
  status,
  err_text
}: {
  close: () => void;
  status: 'success' | 'failed' | 'big';
  err_text?: string;
}) => {
  return (
    <div>
      <div className="text-h2 font-bold text-center mt-[6px] mb-[10px] text-black">
        {status === 'success' ? 'Medien hochgeladen' : 'Hochladen fehlgeschlagen'}
      </div>
      <div className="text-body w-[266px] text-center m-auto mb-[22px] text-int-grey-90">
        {status === 'success' &&
          'Ihre Fotos, Sprachnachrichten und Videos sind nun in der Diashow verfügbar.'}
        {status === 'failed' &&
          (err_text || 'Das Hochladen Ihrer Medien ist fehlgeschlagen. Bitte kontrollieren Sie Ihre Netzwerkverbindung.')}
        {status === 'big' &&
          'Das Hochladen Ihrer Medien ist fehlgeschlagen. Bitte versuchen Sie das mit leichtere Dateien. Maximale Dateigröße für hochgeladene Videos und Audios beträgt 500 MB und für Bilder - 5 MB.'}
      </div>
      <div className="w-[207px] m-auto cursor-pointer mb-[8px]" onClick={close}>
        <FButton dark={true}>Fertig</FButton>
      </div>
    </div>
  );
};

export default UploadResultModalContent;
