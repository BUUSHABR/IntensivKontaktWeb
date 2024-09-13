import CurrentPatientConsumer from '../Mehr/CurrentPatient';
import { useChatId } from './useChat';
import Preloader from '../Preloader';
import AudioMediaItem from './AudioMediaItem';
import useAudioChatList, { AudioItem } from './useAudioChatList';
import React, { useState } from 'react';
import { getDataFromInfinitiveQuery } from '../util/InfinitiveQueryTools';
import { dateToDMY } from '../util/dateToDMY';

const ChatAudioList = () => {
  const { currentPatientId } = CurrentPatientConsumer();
  const { data: chatId } = useChatId(currentPatientId!);
  const {
    data: audioData,
    isLoading,
    isFetchingNextPage,
  } = useAudioChatList(chatId!);
  const [activeAudioId, setActiveAudioId] = useState('');

  const audio = getDataFromInfinitiveQuery(audioData) as AudioItem[];

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Preloader small={true} />
        </div>
      ) : (
        <div className="flex flex-col">
          {audio?.map((item) => (
            <AudioMediaItem
              isActive={item.id === activeAudioId}
              key={item.id}
              duration={item.duration.substring(3)}
              date={dateToDMY(item.creation_time)}
              audio={item.audio_file}
              onClick={() => setActiveAudioId(item.id)}
            />
          ))}
          <div className="flex justify-center">
            {isFetchingNextPage && <Preloader small={true} />}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAudioList;
