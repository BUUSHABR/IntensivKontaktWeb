import React, { createRef, useEffect, useMemo, useState } from 'react';
import activeCallImage from '../../assets/icons/activeCallImage.svg';
import callImage from '../../assets/icons/call-icon.svg';
import patientInfosIcon from '../../assets/icons/patient-infos-icon.svg';
import ChatMessage from './ChatMessage';
import { IChatMessageInfo } from '../../models/Patient';
import { CHAT_PAGE_SIZE } from '../util/constants';
import getFormattedDate from '../util/getFormattedDate';
import Preloader from '../Preloader';
import ChatOpenedMedia from './Photo-Video Chat Media/ChatOpenedMedia';
import { ReactComponent as ProtectedIcon } from '../../assets/icons/protected-icon.svg';
import { ReactComponent as CallIconTail } from '../../assets/icons/CallIconTail.svg';
import { BackgroundOverlay } from '../Layout/BackgroundOverlay';
import CurrentPatientConsumer from '../Mehr/CurrentPatient';
import { useChatId } from './useChat';
import logoIcon from '../../assets/logo/logo_small.png';

type ChatPropsType = {
  openVideoModal: () => void;
  messages: Array<IChatMessageInfo>;
  newMessages: Array<IChatMessageInfo>;
  scrollHandler: (e: any) => void;
  isFetching: boolean;
  isCallGoing: boolean;
  name: string;
  setShowPatientInfo: (a: boolean) => void;
};

type TransformedMessageType = IChatMessageInfo & { uniqueData?: string };

const Chat = ({
  openVideoModal,
  messages,
  newMessages,
  scrollHandler,
  isFetching,
  isCallGoing,
  name,
  setShowPatientInfo,
}: ChatPropsType) => {
  const messagesEndRef = createRef<HTMLDivElement>();

  const { currentPatientId } = CurrentPatientConsumer();
  const { data: chatId } = useChatId(currentPatientId!);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const transformedMessages = useMemo(() => {
    const datesBuffer: string[] = [];
    const bufferMessagesArray: Array<IChatMessageInfo | TransformedMessageType> = [];
    if (messages.length) {
      messages.forEach((mess, index) => {
        const isoStr = messages && messages[index].send_at;
        const date = new Date(isoStr as string);
        const formattedDate = getFormattedDate(date, 'chatDate');
        if (!datesBuffer.includes(formattedDate as string)) {
          datesBuffer.push(formattedDate as string);
          bufferMessagesArray.push({ ...mess, uniqueData: formattedDate as string });
        } else {
          bufferMessagesArray.push(mess);
        }
      });
      return bufferMessagesArray;
    }
  }, [messages]);

  useEffect(() => {
    if (transformedMessages && transformedMessages.length === CHAT_PAGE_SIZE) {
      scrollToBottom();
    }
  }, [transformedMessages]);

  const [isMediaOpen, setIsMediaOpen] = useState<boolean>(false);
  const [openedMediaId, setOpenedMediaId] = useState<string>('');

  const openDetailMedia = (mediaId: string) => {
    setOpenedMediaId(mediaId);
    setIsMediaOpen(true);
  };

  return (
    <div>
      <div className="border-b border-r border-[#ECEFF0] bg-[#FAFAFA] py-3 flex items-center justify-between">
        <div className="pl-[40%] flex flex-row items-center">
          <div className="mr-[10px]">
            <ProtectedIcon />
          </div>
          <div className="flex flex-col text-center">
            <span className="text-base font-bold text-int-black">Neugkeiten</span>
            <span className="text-[12px] text-int-grey-90">{name}</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-4 cursor-pointer relative" onClick={openVideoModal}>
            <img src={isCallGoing ? activeCallImage : callImage} alt="#" />
            {isCallGoing && (
              <div className="absolute left-[-15px] top-[23px]">
                <CallIconTail />
              </div>
            )}
          </div>
          <div className="mr-4 cursor-pointer" onClick={() => setShowPatientInfo(true)}>
            <img src={patientInfosIcon} alt="#" />
          </div>
        </div>
      </div>
      <div
        className="pl-[50px] flex flex-col pt-[21px] gap-y-[23px] h-[calc(100vh-156px)] overflow-y-auto relative border-r border-[#ECEFF0]"
        onScroll={scrollHandler}
      >
        {isFetching && <Preloader small={true} />}
        {transformedMessages &&
          transformedMessages.map((message: TransformedMessageType) => {
            return (
              <div key={message.id}>
                {message.uniqueData && (
                  <div className="text-center mb-[24px] text-int-grey-60 text-chat-date font-BeVietnamRegular font-normal">
                    {message.uniqueData}
                  </div>
                )}
                <ChatMessage
                  {...message}
                  openDetailMedia={openDetailMedia}
                  openVideoModal={openVideoModal}
                />
              </div>
            );
          })}

        {newMessages &&
          newMessages.map((message: TransformedMessageType) => {
            return (
              <div key={message.id}>
                <ChatMessage
                  {...message}
                  openDetailMedia={openDetailMedia}
                  openVideoModal={openVideoModal}
                />
              </div>
            );
          })}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[#ECEFF0]"></div>
      {isMediaOpen && (
        <BackgroundOverlay>
          <ChatOpenedMedia
            mediaId={openedMediaId}
            close={() => setIsMediaOpen(false)}
            chatId={chatId}
          />
        </BackgroundOverlay>
      )}
    </div>
  );
};

export default Chat;
