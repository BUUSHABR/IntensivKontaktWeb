import React, { useMemo } from 'react';
import useChosenMedia from './useAssets';
import Preloader from '../Preloader';
import MediaAudioPlayer from '../AudioRecord/MediaAudioPlayer';
import { dateToDMY } from '../util/dateToDMY';

type DiashowPreviewPropsType = {
  openedId?: number;
};

const DiashowPreview = ({ openedId }: DiashowPreviewPropsType) => {
  const { data, isFetching } = useChosenMedia(openedId);

  const childNode = useMemo(() => {
    if (data?.asset_type === 'image') {
      return (
        <>
          <img src={data.asset_optimized || data.asset} className={`max-h-[80vh] `} alt="#" />
        </>
      );
    }

    if (data?.asset_type === 'audio') {
      return (
        <div className="w-[70%]">
          <MediaAudioPlayer audio={data.asset} date={dateToDMY(data.uploaded_at || '')} />
        </div>
      );
    }

    if (data?.asset_type === 'video') {
      return <video src={data.asset_optimized || data.asset} controls={true} />;
    }
  }, [data?.asset_type, data?.id]);

  return (
    <div className="h-[100%]">
      <div className="text-h3 text-black font-bold text-center mt-[20px]">Vorschau</div>

      {isFetching && (
        <div className="flex justify-center items-center">
          <Preloader />
        </div>
      )}

      {data?.asset && !isFetching && (
        <div className={`flex justify-center items-center h-[100%]`}>{childNode}</div>
      )}

      {!data?.asset && !isFetching && (
        <div className="text-body text-int-grey-60 mt-[52px] m-auto w-[560px]">
          Es sind noch keine Medien hochgeladen.
          <br />
          Laden Sie jetzt Medien hoch, um Ihre:n Angehörige:n zu unterstützen.
        </div>
      )}
    </div>
  );
};

export default DiashowPreview;
