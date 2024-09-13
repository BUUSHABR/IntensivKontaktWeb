import { useInfiniteQuery } from 'react-query';
import http from '../../util/http';
import { getOffsetForQuery } from '../../util/InfinitiveQueryTools';

export type MediaItem = {
  author: number;
  creation_time: string;
  duration?: string;
  thumbnail?: string;
  file: string;
  id: string;
};

export type mediaChatListResponseType = {
  count: number;
  next: string;
  previous: string;
  results: MediaItem[];
};

export const useMediaChatList = (chatId: string) => {
  return useInfiniteQuery<mediaChatListResponseType, Error>(
    ['mediaChatList', chatId],
    async () => {
      return await http.get(
        `/patient_chat/patient_chats/${chatId}/get_media/`,
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

export default useMediaChatList;
