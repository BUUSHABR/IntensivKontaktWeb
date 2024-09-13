import { useState } from 'react';
import ChatMediaList from './Photo-Video Chat Media/ChatMediaList';
import ChatAudioList from './ChatAudioList';

const MediaInfo = () => {
  const [menuItem, setMenuItem] = useState<string>('photo_video');

  return (
    <>
      <div className="flex p-[2px] bg-int-light-blue rounded-[9px] text-base text-int-black mb-[20px]">
        <div
          className={`flex justify-center items-center h-[40px] w-1/2  rounded-[7px] cursor-pointer ${
            menuItem === 'photo_video' ? 'shadow-md bg-[#ffffff] ' : 'bg-int-light-blue'
          } `}
          onClick={() => setMenuItem('photo_video')}
        >
          Fotos & Videos
        </div>
        <div
          className={`flex justify-center items-center h-[40px] w-1/2  rounded-[7px] cursor-pointer ${
            menuItem === 'audio' ? 'shadow-md bg-[#ffffff] ' : 'bg-int-light-blue'
          } `}
          onClick={() => setMenuItem('audio')}
        >
          Sprachnachrichten
        </div>
      </div>

      {menuItem === 'photo_video' && <ChatMediaList />}
      {menuItem === 'audio' && <ChatAudioList />}
    </>
  );
};

export default MediaInfo;
