import { useInfiniteQuery } from 'react-query';
import http from '../util/http';
import { getOffsetForQuery } from '../util/InfinitiveQueryTools';

export type AudioItem = {
  creation_time: string;
  duration: string;
  audio_file: string;
  id: string;
};

type audioChatListResponseType = {
  count: number;
  next: string;
  previous: string;
  results: AudioItem[];
};

export const useAudioChatList = (chatId: string) => {
  return useInfiniteQuery<audioChatListResponseType, Error>(
    ['audioChatList', chatId],
    async () => {
      return await http.get(
        `/patient_chat/patient_chats/${chatId}/get_audio/`,
      );
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.next) {
          return getOffsetForQuery(lastPage.next);
        }
      },
      enabled: !!chatId,
      keepPreviousData: true,
    },
  );
};

export default useAudioChatList;
