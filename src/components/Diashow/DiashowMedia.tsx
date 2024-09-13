import { TailSpin } from 'react-loader-spinner';
import { ReactComponent as MediaIcon } from 'assets/icons/media.svg';
import { ReactComponent as MicrophoneIcon } from 'assets/icons/microphone.svg';
import { IoVideocamOutline } from 'react-icons/io5';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import http from '../util/http';
import Preloader from '../Preloader';
import { createShortcut } from '../util/createshortCut';
import DiashowLoadingMediaConsumer from './diashowLoadingMediaProvider';
import { LoadingAsset } from './DiashowList';

export type AssetType = 'image' | 'video' | 'other' | 'audio';

type DiashowMediaProps = {
  id: number;
  link?: string;
  name: string;
  status?: 'uploading' | 'success' | 'error';
  onDeleteClick?: (id: number) => void;
  onTap?: (id: number) => void;
  assetType: AssetType;
  setOpenedId?: Dispatch<SetStateAction<number | undefined>>;
  isActive?: boolean;
  isEditMode?: boolean;
  isDeleteChosenAssets?: boolean;
  refetchDiashowList?: () => void;
};

export type AssetProps = {
  link?: string;
  assetType: AssetType;
};

export function AssetRepresentation({ link, assetType }: AssetProps) {
  if (assetType === 'image' && link) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center w-[50px] h-[50px] absolute -z-1">
          <Preloader small={true} />
        </div>

        <div
          className="w-[50px] h-[50px] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${link})`, borderRadius: '8px' }}
        ></div>
      </div>
    );
  } else if (assetType === 'audio') {
    return <MicrophoneIcon className="text-int-grey-40 w-[50px] h-[50px] rounded-[8px]" />;
  } else if (assetType === 'video') {
    return (
      <IoVideocamOutline className="text-int-grey-40 w-[50px] h-[50px] rounded-[8px]" size={50} />
    );
  }
  return <MediaIcon className="fill-int-grey-40 w-[50px] h-[50px] rounded-[8px]" />;
}

export function DiashowMedia({
  id,
  link,
  name,
  status,
  assetType,
  setOpenedId,
  isActive,
  isEditMode,
  isDeleteChosenAssets,
  refetchDiashowList,
}: DiashowMediaProps) {
  const [checkPointValue, setCheckPointValue] = useState(false);
  const { setLoadedMedia } = DiashowLoadingMediaConsumer();

  const onMediaSelect = () => {
    setOpenedId!(id);
  };

  const deleteAsset = () => {
    http.delete(`/contacts/assets/${id}/`, {}).then((res) => {
      refetchDiashowList && refetchDiashowList();
    });
  };

  useEffect(() => {
    if (checkPointValue && isDeleteChosenAssets) {
      deleteAsset();
      setLoadedMedia((prev: LoadingAsset[]) => {
        return prev.filter((el) => {
          if (id !== el.id) {
            return el;
          }
        });
      });
    }
  }, [checkPointValue, isDeleteChosenAssets]);

  useEffect(() => {
    if (!isEditMode) {
      setCheckPointValue(false);
    }
  }, [isEditMode]);

  return (
    <div
      className={`flex border-b border-int-light-blue py-4 items-center ${
        isActive && 'bg-int-dark-blue'
      } rounded-[5px] pl-[10px] cursor-pointer`}
      onClick={setOpenedId && !isEditMode ? onMediaSelect : undefined}
    >
      {isEditMode && (
        <div className="mr-[13px] ">
          <label className="checkbox-field w-6 h-6">
            <input
              type="checkbox"
              checked={checkPointValue}
              onChange={() => setCheckPointValue((prev) => !prev)}
            />
            <span className="checkmark"></span>
          </label>
        </div>
      )}
      <div className="mr-4 flex justify-center items-center shrink-0 ">
        <AssetRepresentation link={link} assetType={assetType} />
      </div>
      <div className={`flex-grow ${isActive ? 'text-[#D3E8E6]' : 'text-black'}`}>
        {createShortcut(name, 30)}
      </div>
      <div className="mr-4 shrink-0">
        {status === 'uploading' && <TailSpin width={24} height={24} color="#689EB8" />}
      </div>
    </div>
  );
}
