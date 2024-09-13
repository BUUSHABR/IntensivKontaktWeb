import React, { useState } from 'react';
import { MediaItem } from './useMediaChatList';
import Preloader from '../../Preloader';
import { ReactComponent as VideoIcon } from './../../../assets/icons/videoChooseIcon.svg';

type GalleryChooseMediaListPropsType = {
  media: MediaItem;
  mediaId: string;
  chooseMediaId: (id: string) => void;
};

const GalleryChooseMediaListItem = ({
  media,
  mediaId,
  chooseMediaId,
}: GalleryChooseMediaListPropsType) => {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  return (
    <div>
      {!isMediaLoaded && (
        <div className="flex items-center justify-center mt-[100px]">
          <Preloader small={true} />
        </div>
      )}

      {!media.duration && (
        <img
          src={media.file}
          className={` ${
            isMediaLoaded ? 'opacity-1' : 'opacity-0'
          } cursor-pointer w-[120px] h-[120px]   ${
            mediaId === media.id && 'border-[3px] border-white rounded-[6px]'
          }`}
          onClick={() => chooseMediaId(media.id)}
          onLoad={() => {
            setIsMediaLoaded(true);
          }}
        />
      )}

      {media.duration && media?.thumbnail && (
        <div className="relative">
          <img
            src={media.thumbnail}
            className={` ${
              isMediaLoaded ? 'opacity-1' : 'opacity-0'
            } cursor-pointer w-[120px] h-[120px]   ${
              mediaId === media.id && 'border-[3px] border-white rounded-[6px]'
            }`}
            onClick={() => chooseMediaId(media.id)}
            onLoad={() => {
              setIsMediaLoaded(true);
            }}
          />
          <div className="absolute bottom-[5px] right-[5px]">
            <VideoIcon/>
          </div>
        </div>
      )}

      {media.duration && !media?.thumbnail && (
        <div
          className={`${
            isMediaLoaded ? 'opacity-1' : 'opacity-0'
          } cursor-pointer w-[120px] h-[120px]`}
        >
          <video
            src={media.file}
            className={` cursor-pointer w-[120px] h-[120px] ${
              mediaId === media.id && 'border-[3px] border-white rounded-[6px]'
            }`}
            onClick={() => chooseMediaId(media.id)}
            onLoadedData={() => {
              setIsMediaLoaded(true);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default GalleryChooseMediaListItem;
