import React from 'react';
import MediaAudioPlayer from '../AudioRecord/MediaAudioPlayer';
import { ReactComponent as MicrophoneIcon } from '../../assets/icons/microphone.svg';
import { ReactComponent as PlayGrey } from '../../assets/icons/play-grey.svg';

export interface audioMediaItemProps {
  audio: string;
  date: string;
  duration: string;
  isActive: boolean;
  onClick: () => void;
}

const AudioMediaItem = ({ audio, date, duration, isActive, onClick }: audioMediaItemProps) => {
  return (
    <>
      {isActive ? (
        <MediaAudioPlayer audio={audio} date={date} />
      ) : (
        <div
          className="h-[64px] min-h-[64px] bg-[#ffffff] shadow-md rounded-[10px] mb-[10px] flex items-center cursor-pointer"
          onClick={onClick}
        >
          <div>
            <div className="flex justify-center items-center w-[30px] h-[30px] rounded-[6px] bg-[#D3E8E6] ml-[20px] mr-[30px]">
              <MicrophoneIcon className="text-int-grey-40" />
            </div>
          </div>
          <div className="flex-grow flex flex-col">
            <div className="text-base text-int-grey-40">Sprachnachricht</div>
            <div className="flex justify-between text-[11px]">
              <div className="text-int-grey-40">{date}</div>
              <div className="text-int-grey-40 opacity-40 font-bold">{duration}</div>
            </div>
          </div>
          <div className="ml-[16px] mr-[24px]">
            <PlayGrey />
          </div>
        </div>
      )}
    </>
  );
};

export default AudioMediaItem;
