import React, { useState } from 'react';
import { MediaItem } from './useMediaChatList';
import Preloader from '../../Preloader';
import { ReactComponent as VideoIcon } from './../../../assets/icons/videoChooseIcon.svg';

export const ChatMediaItem = ({
  mediaItem,
  showChosenMedia,
}: {
  mediaItem: MediaItem;
  showChosenMedia: (id: string) => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      {!isLoaded && (
        <div className="flex items-center justify-center">
          <Preloader small={true} />
        </div>
      )}

      {mediaItem.duration && !mediaItem?.thumbnail && (
        <div className={`${isLoaded ? 'opacity-1' : 'opacity-0'} cursor-pointer h-[120px]`}>
          <video
            src={mediaItem.file}
            controls
            muted
            id="videoPreview"
            onLoadedData={() => {
              setIsLoaded(true);
            }}
            className="h-[100px]"
          />
          <div
            className="border border-int-light-blue cursor-pointer text-center text-body-small h-[20px]"
            onClick={() => showChosenMedia(mediaItem.id)}
          >
            Anzeigen
          </div>
        </div>
      )}

      {mediaItem.duration && mediaItem?.thumbnail && (
        <div className="relative">
          <img
            src={mediaItem?.thumbnail}
            alt=""
            className={`${isLoaded ? 'opacity-1' : 'opacity-0'} cursor-pointer h-[120px]`}
            onLoad={() => {
              setIsLoaded(true);
            }}
            onClick={() => showChosenMedia(mediaItem.id)}
          />
          <div className="absolute bottom-[5px] right-[5px]">
            <VideoIcon />
          </div>
        </div>
      )}

      {!mediaItem.duration && (
        <>
          <img
            src={mediaItem.file}
            alt=""
            className={`${isLoaded ? 'opacity-1' : 'opacity-0'} cursor-pointer h-[120px]`}
            onLoad={() => {
              setIsLoaded(true);
            }}
            onClick={() => showChosenMedia(mediaItem.id)}
          />
        </>
      )}
    </div>
  );
};
