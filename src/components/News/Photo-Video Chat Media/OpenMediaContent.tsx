import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { MediaItem } from './useMediaChatList';
import getFormattedDate from '../../util/getFormattedDate';
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-modal.svg';
import { ReactComponent as RightArrow } from '../../../assets/icons/swip-right.svg';
import { ReactComponent as LeftArrow } from '../../../assets/icons/swip-left.svg';
import Preloader from '../../Preloader';
import Footer from '../../Footer';
import { useOpenedChatMedia } from './useOpenedChatMedia';
import GalleryChooseMediaListItem from './GalleryChooseMediaListItem';
import http from '../../util/http';

type OpenMediaContentPropsType = {
  mediaId: string;
  chooseMediaId: (id: string) => void;
  loaded: boolean;
  setIsLoaded: Dispatch<SetStateAction<boolean>>;
  close: () => void;
  chatId: string;
};

export const OpenMediaContent = ({
  mediaId,
  chooseMediaId,
  loaded,
  setIsLoaded,
  close,
}: OpenMediaContentPropsType) => {
  const { data, isLoading } = useOpenedChatMedia(mediaId);

  const currentMedia = useMemo(() => {
    return {
      duration: data?.current_media_file.video?.duration || null,
      file:
        data?.current_media_file.image?.image_file || data?.current_media_file.video?.video_file,
      thumbnail: data?.current_media_file.video?.thumbnail || data?.current_media_file.image?.thumbnail || '',
      id: data?.current_media_file.video?.id || data?.current_media_file.image?.id,
    };
  }, [
    data?.current_media_file.image?.id,
    data?.current_media_file.video?.id,
    data?.current_media_file.id,
    mediaId,
  ]);

  const scrollDivRef = useRef<any>(null);

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isCurrentMediaAdded, setIsCurrentMediaAdded] = useState(false);
  const [isStartScrollPosition, setIsStartScrollPosition] = useState(false);

  const [noMoreNextMedia, setNoMoreNextMedia] = useState(false);
  const [isNextFetching, setIsNextFetching] = useState(true);

  const [noMorePrevMedia, setNoMorePrevMedia] = useState(false);
  const [isPrevFetching, setIsPrevFetching] = useState(true);

  const createdTime = useMemo(() => {
    if (data?.current_media_file.image?.creation_time) {
      return getFormattedDate(
        new Date(data?.current_media_file.image?.creation_time as string),
        'gallery',
      );
    } else if (data?.current_media_file.video?.creation_time) {
      return getFormattedDate(
        new Date(data?.current_media_file.video?.creation_time as string),
        'gallery',
      );
    } else {
      return '';
    }
  }, [data]);

  const scrollHandler = async (e: any) => {
    if (e.target.scrollLeft < 3) {
      e.target.scrollLeft = 3;
    }

    if (e.target.scrollLeft - (e.target.scrollWidth - e.target.offsetWidth - 3) > 0) {
      e.target.scrollLeft = e.target.scrollWidth - e.target.offsetWidth - 3;
    }

    if (
      e.target.scrollLeft - (e.target.scrollWidth - e.target.offsetWidth - 80) > 0 &&
      !isNextFetching
    ) {
      setIsNextFetching(true);
    }

    if (e.target.scrollLeft < 80 && !isPrevFetching) {
      setIsPrevFetching(true);
    }
  };

  useEffect(() => {
    if (
      scrollDivRef.current?.scrollWidth > scrollDivRef.current?.clientWidth &&
      !isStartScrollPosition
    ) {
      scrollDivRef.current.scrollLeft = 100;
      setIsStartScrollPosition(true);
    }

    if (
      !(scrollDivRef.current?.scrollWidth > scrollDivRef.current?.clientWidth) &&
      !isNextFetching &&
      !noMoreNextMedia
    ) {
      setIsNextFetching(true);
    }

    if (
      !(scrollDivRef.current?.scrollWidth > scrollDivRef.current?.clientWidth) &&
      !isPrevFetching &&
      noMoreNextMedia &&
      !noMorePrevMedia
    ) {
      setIsPrevFetching(true);
    }
  }, [
    scrollDivRef?.current,
    isNextFetching,
    isPrevFetching,
    noMoreNextMedia,
    noMorePrevMedia,
    isStartScrollPosition,
  ]);

  useEffect(() => {
    if (isNextFetching && mediaId && !noMoreNextMedia && currentMedia.id) {
      http
        .get(
          `/patient_chat/chat_messages/${
            mediaList[mediaList.length - 1]?.id || mediaId
          }/get_next_media_batch/`,
        )
        .then((res: MediaItem[]) => {
          if (res.length === 0) {
            setNoMoreNextMedia(true);
          }
          if (!isCurrentMediaAdded) {
            setMediaList([...mediaList, currentMedia as MediaItem, ...res]);
          } else {
            setMediaList([...mediaList, ...res]);
          }
        })
        .finally(() => {
          setIsCurrentMediaAdded(true);
          setIsNextFetching(false);
        });
    }
  }, [isNextFetching, mediaId, noMoreNextMedia, currentMedia.id, isCurrentMediaAdded]);

  useEffect(() => {
    if (isPrevFetching && mediaId && !noMorePrevMedia && currentMedia.id) {
      http
        .get(`/patient_chat/chat_messages/${mediaList[0]?.id || mediaId}/get_previous_media_batch/`)
        .then((res: MediaItem[]) => {
          if (res.length === 0) {
            setNoMorePrevMedia(true);
          }
          if (!isCurrentMediaAdded) {
            setMediaList([...res.reverse(), currentMedia as MediaItem, ...mediaList]);
          } else {
            setMediaList([...res.reverse(), ...mediaList]);
          }
        })
        .finally(() => {
          if (scrollDivRef.current?.scrollWidth > scrollDivRef.current?.clientWidth) {
            scrollDivRef.current.scrollLeft = 100;
          }
          setIsCurrentMediaAdded(true);
          setIsPrevFetching(false);
        });
    }
  }, [isPrevFetching, mediaId, noMorePrevMedia, currentMedia.id, scrollDivRef.current]);

  const chooseNextMedia = () => {
    chooseMediaId((data?.next_media_file.image?.id || data?.next_media_file.video?.id) as string);
  };

  const choosePrevMedia = () => {
    chooseMediaId(
      (data?.previous_media_file.image?.id || data?.previous_media_file.video?.id) as string,
    );
  };

  return (
    <div className="h-screen">
      <div className="bg-white h-[80px] flex justify-between items-center px-16">
        <div>{createdTime}</div>
        <div onClick={close} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>

      <div className="p-6 h-[calc(100vh-280px)]">
        <div className="flex justify-center items-center relative h-[100%]">
          <div
            className="absolute right-12 top-[45%] cursor-pointer z-10"
            onClick={data?.next_media_file && loaded ? chooseNextMedia : () => null}
          >
            <RightArrow fill={data?.next_media_file && loaded ? '#56A0BB' : 'gray'} />
          </div>
          <div
            className="absolute left-12 top-[45%] cursor-pointer z-10"
            onClick={data?.previous_media_file && loaded ? choosePrevMedia : () => null}
          >
            <LeftArrow fill={data?.previous_media_file && loaded ? '#56A0BB' : 'gray'} />
          </div>
          {data?.current_media_file.image?.image_file && (
            <img
              src={data.current_media_file.image.image_file}
              className="max-h-[calc(100vh-320px)] max-w-[100vw]"
              onLoad={() => setIsLoaded(true)}
            />
          )}
          {data?.current_media_file.video?.video_file && (
            <video
              id='videoPreview'
              src={data.current_media_file.video.video_file}
              loop
              controls
              className="max-h-[calc(100vh-320px)] max-w-[100vw]"
              onLoadedData={() => setIsLoaded(true)}
            />
          )}
          {isLoading && <Preloader />}
        </div>
      </div>

      <div
        className="h-[150px] bg-[#b1b1b1] opacity-90 border-t border-white flex items-center overflow-x-scroll overflow-y-hidden"
        onScroll={scrollHandler}
        ref={scrollDivRef}
      >
        {mediaList?.map((m, index) => {
          return (
            <div key={m.id} className="gallery-preview mr-[20px] min-w-[120px] min-h-[120px]">
              <GalleryChooseMediaListItem
                media={m}
                chooseMediaId={chooseMediaId}
                mediaId={mediaId}
              />
            </div>
          );
        })}

        <div className="absolute right-0">
          {isNextFetching && !noMoreNextMedia && <Preloader small={true} />}
        </div>
        <div className="absolute left-0">
          {isPrevFetching && !noMorePrevMedia && <Preloader small={true} />}
        </div>
      </div>

      <Footer />
    </div>
  );
};
