import React, { useEffect, useMemo, useState } from 'react';
import { ReactComponent as ActiveVideoCallIcon } from '../../assets/icons/activeCallImage.svg';
import { ReactComponent as UnactiveCallMessageIcon } from '../../assets/icons/UnactiveCallMessageIcon.svg';
import { ReactComponent as MessageBottomLeft } from '../../assets/icons/message_bottom_left.svg';
import { ReactComponent as MessageHeart } from '../../assets/icons/message_heart.svg';
import { ReactComponent as MessageHeartFilled } from '../../assets/icons/message_heart_filled.svg';
import logoIcon from '../../assets/logo/logo_small.png';

import http from '../util/http';
import NativeAudioPlayer from '../AudioRecord/NativeAudioPlayer';

export type ChatMessagePropsTypes = {
  id?: string;
  likes?: number;
  liked?: boolean;
  text?: string;
  send_at?: string;
  media: {
    id: string;
    link: string;
    type: string;
  };
  send_by?: number;
  nurse_avatar?: string;
  openDetailMedia: (mediaId: string) => void;
  duration?: string;
  openVideoModal: () => void;
};

export default function ChatMessage(props: ChatMessagePropsTypes) {
  const [isLike, setIsLike] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState(0);

  const isCallGoing = useMemo(() => {
    if (props.send_by === null) {
      return !props.text?.includes('[ended]');
    }
  }, [props.send_by, props.text]);

  useEffect(() => {
    if (props.likes && props.likes !== 0) {
      setLikeCount(props.likes);
    }

    if (props.liked) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [props.likes, props.liked]);

  const changeLikeStatus = () => {
    if (!isLike) {
      http
        .patch(`/patient_chat/chat_messages/${props.id}/like_message/`, { text: props.text })
        .then((res) => {
          setIsLike(true);
          setLikeCount((prev) => prev + 1);
        });
    } else {
      http
        .patch(`/patient_chat/chat_messages/${props.id}/unlike_message/`, { text: props.text })
        .then((res) => {
          setIsLike(false);
          setLikeCount((prev) => prev - 1);
        });
    }
  };

  const sendingMessageDate = new Date(props.send_at as string);
  const sendHour = sendingMessageDate.getHours();
  const sendMinutes = sendingMessageDate.getMinutes();
  const messageTime =
    (sendHour >= 10 ? sendHour : `0${sendHour}`) +
    ':' +
    (sendMinutes >= 10 ? sendMinutes : `0${sendMinutes}`);

  const childNode = useMemo(() => {
    if (props.send_by === null) {
      return (
        <div
          className={`relative w-[239px] flex gap-[15px] items-center pl-[15px] pt-[19px] pr-[35px] pb-[15px] bg-int-light-blue rounded-[18px] ${
            isCallGoing && 'cursor-pointer'
          }`}
          onClick={isCallGoing ? props.openVideoModal : () => null}
        >
          <div className="w-[40px] h-[40px] rounded-[7px] bg-white shrink-[0] flex items-center justify-center">
            {isCallGoing ? <ActiveVideoCallIcon /> : <UnactiveCallMessageIcon />}
          </div>
          <p className={`${isCallGoing ? 'text-black' : 'text-int-grey-30'} text-body`}>
            {isCallGoing ? 'Virtueller Besuch verfügbar.' : 'Virtueller Besuch beendet.'}
          </p>
          <div className="absolute bottom-[10px] right-[10px] text-[11px] int-grey-60">
            {messageTime}
          </div>
        </div>
      );
    }

    if (props.media?.type === 'image') {
      return (
        <div
          className="relative p-2 bg-int-light-blue rounded-[18px] overflow-clip z-10 w-[300px] h-[200px]"
          onClick={() => props.openDetailMedia(props.media.id as string)}
        >
          <img
            className="rounded-[12px] cursor-pointer w-[100%] h-[100%]"
            src={props.media.link}
            alt="#"
          />
          <div className="absolute bottom-[10px] right-[13px] text-[11px] text-white">
            {messageTime}
          </div>
        </div>
      );
    }

    if (props.media?.type === 'audio') {
      return (
        <div className="relative w-[234px] pl-[16px] pt-[16px] pr-[16px] pb-[6px] bg-int-light-blue rounded-[18px]">
          <NativeAudioPlayer audio={props.media.link} />
          <div className="absolute bottom-[7px] right-[16px]">
            <span className="text-[11px] text-int-grey-60 text-center font-BeVietnamRegular">
              {messageTime}
            </span>
          </div>
        </div>
      );
    }

    if (props.media?.type === 'video') {
      return (
        <div
          className="relative p-2 bg-int-light-blue rounded-[18px] z-10 w-[300px] h-[200px] cursor-pointer"
          onClick={() => props.openDetailMedia(props.media.id as string)}
        >
          <video
            className="rounded-[12px] w-[100%] h-[100%]"
            src={props.media.link}
            controls={true}
            muted
            id='videoPreview'
          />
          <div className="absolute bottom-[5px] right-[13px] text-[11px] text-white">
            {messageTime}
          </div>
        </div>
      );
    }

    if (props.text) {
      return (
        <div className="relative pl-[15px] pt-[7px] pr-[40px] pb-[10px] bg-int-light-blue w-[500px]  rounded-[18px]">
          {props.text.replace(/&comma;/ig, ",")}
          <div className="absolute bottom-[8px] right-[10px] text-[11px] int-grey-60">
            {messageTime}
          </div>
        </div>
      );
    }
  }, []);

  if (childNode) {
    return (
      <div className="flex gap-x-[8px] relative">
        {<img className="w-[30px] h-[30px] rounded-full mt-auto" src={props.send_by === null || props.nurse_avatar === null ? logoIcon : props.nurse_avatar} alt="" />}
        {childNode}
        <MessageBottomLeft className="absolute bottom-0 left-[33px]" />
        {props.send_by !== null && (
          <div className="relative">
            <div
              onClick={changeLikeStatus}
              className="border relative -left-7 cursor-pointer -top-3 z-10 border-int-gray-20 bg-white w-[32px] h-[32px] flex shrink-[0] items-center justify-center rounded-full"
            >
              {isLike ? <MessageHeartFilled /> : <MessageHeart />}
            </div>
            <div className="absolute left-[8px] top-[-8px]">{likeCount > 0 ? likeCount : ''}</div>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
}
