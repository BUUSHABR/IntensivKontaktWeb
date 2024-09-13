import React, { useState } from 'react';
import CurrentPatientConsumer from '../../Mehr/CurrentPatient';
import { useChatId } from '../useChat';
import useMediaChatList, { MediaItem } from './useMediaChatList';
import Preloader from '../../Preloader';
import ChatOpenedMedia from './ChatOpenedMedia';
import { getDataFromInfinitiveQuery } from '../../util/InfinitiveQueryTools';
import { BackgroundOverlay } from '../../Layout/BackgroundOverlay';
import { ChatMediaItem } from './ChatMediaItem';

const ChatMediaList = () => {
  const { currentPatientId } = CurrentPatientConsumer();
  const { data: chatId } = useChatId(currentPatientId!);
  const {
    data: mediaData,
    isLoading,
    isFetchingNextPage,
  } = useMediaChatList(chatId!);
  const [isOpenedMedia, setIsOpenedMedia] = useState(false);
  const [chosenMediaId, setChosenMediaId] = useState('');

  const media = getDataFromInfinitiveQuery(mediaData) as MediaItem[];

  const showChosenMedia = (mediaId: string) => {
    setIsOpenedMedia(true);
    setChosenMediaId(mediaId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Preloader small={true} />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1 overflow-y-auto mb-1">
        {media?.map((m) => {
          return (
            <div className="h-[120px]" key={m.id}>
              <ChatMediaItem showChosenMedia={showChosenMedia} mediaItem={m} />
            </div>
          );
        })}
        <div className="flex justify-center">
          {isFetchingNextPage && <Preloader small={true} />}
        </div>
      </div>
      {isOpenedMedia && (
        <BackgroundOverlay>
          <ChatOpenedMedia
            mediaId={chosenMediaId}
            close={() => setIsOpenedMedia(false)}
            chatId={chatId || ''}
          />
        </BackgroundOverlay>
      )}
    </>
  );
};

export default ChatMediaList;
