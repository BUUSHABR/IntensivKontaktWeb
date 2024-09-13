import { useQuery } from 'react-query';
import http from '../util/http';

export const useChatId = (patientId: number) => {
  return useQuery<string, Error>(
    ['chatId', patientId],
    async () => {
      const chatIdResponse = await http.get(
        `/patient_chat/patient_chats/${patientId}/get_by_patient_id/`,
      );
      return chatIdResponse.id;
    },
    { enabled: !!patientId },
  );
};
