import React, { useEffect, useState } from 'react';
import { OpenMediaContent } from './OpenMediaContent';

type ChatOpenedChatMediaPropsType = {
  mediaId: string;
  close?: () => void;
  chatId?: string;
};

const ChatOpenedMedia = ({ mediaId, close, chatId }: ChatOpenedChatMediaPropsType) => {
  const [currentMediaId, setCurrentMediaId] = useState('');
  const [loaded, setIsLoaded] = useState(false);

  const chooseMediaId = (id: string) => {
    if (loaded) {
      setCurrentMediaId(id);
    }
  };

  useEffect(() => {
    setCurrentMediaId(mediaId);
  }, []);

  useEffect(() => {
    setIsLoaded(false);
  }, [currentMediaId]);

  return (
    <OpenMediaContent
      mediaId={currentMediaId}
      chooseMediaId={chooseMediaId}
      loaded={loaded}
      setIsLoaded={setIsLoaded}
      close={close!}
      chatId={chatId!}
    />
  );
};

export default ChatOpenedMedia;
