import { useQuery } from 'react-query';
import http from '../../util/http';

type MediaFileType = {
  id: string;
  image?: {
    creation_time: string;
    id: string;
    image_file: string;
    thumbnail: string;
  };
  video?: {
    creation_time: string;
    id: string;
    duration: string;
    video_file: string;
    thumbnail: string;
  };
};

type useOpenChatMediaResponseType = {
  current_media_file: MediaFileType;
  next_media_file: MediaFileType;
  previous_media_file: MediaFileType;
};

export const useOpenedChatMedia = (mediaId: string) => {
  return useQuery<useOpenChatMediaResponseType, Error>(
    ['media', mediaId],
    async () => {
      return await http.get(
        `/patient_chat/chat_messages/${mediaId}/get_previous_and_next_chat_media/`,
      );
    },
    { enabled: !!mediaId },
  );
};
