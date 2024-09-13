import React, { useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { AssetProps, AssetType } from './DiashowMedia';
import { ReactComponent as MicrophoneIcon } from '../../assets/icons/microphone.svg';
import { IoVideocamOutline } from 'react-icons/io5';
import { ReactComponent as MediaIcon } from '../../assets/icons/media.svg';
import Preloader from '../Preloader';
import { createShortcut } from '../util/createshortCut';

function LoadingAssetRepresentation({ assetType, link }: AssetProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (assetType === 'image' && link) {
    return (
      <>
        {!isLoaded && (
          <div className="flex justify-center items-center">
            <Preloader small={true} />
          </div>
        )}
        <img
          src={link}
          alt=""
          className={`rounded-[8px] drop-shadow-image w-[50px] h-[50px] ${
            isLoaded ? 'opacity-1' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      </>
    );
  } else if (assetType === 'image') {
    return (
      <div className="rounded-[8px] drop-shadow-image w-[50px] h-[50px] bg-[#D3D3D3FF] opacity-[0.65]" />
    );
  } else if (assetType === 'audio') {
    return (
      <MicrophoneIcon className="text-int-grey-40 w-[50px] h-[50px] rounded-[8px] opacity-[0.65]" />
    );
  } else if (assetType === 'video') {
    return (
      <IoVideocamOutline
        className="text-int-grey-40 w-[50px] h-[50px] rounded-[8px] opacity-[0.65]"
        size={50}
      />
    );
  }

  return <MediaIcon className="fill-int-grey-40 w-[50px] h-[50px] rounded-[8px] opacity-[0.65]" />;
}

type LoadingDiashowMediaPropsType = {
  asset_type: AssetType;
  link: string;
  name: string;
};

const LoadingDiashowMedia = ({ asset_type, link, name }: LoadingDiashowMediaPropsType) => {
  return (
    <div
      className={`flex border-b border-int-light-blue py-4 items-center rounded-[5px] pl-[10px] cursor-pointer`}
    >
      <div className="mr-4 flex justify-center items-center shrink-0 ">
        <LoadingAssetRepresentation assetType={asset_type} link={link} />
      </div>
      <div className="flex-grow  text-black">{createShortcut(name, 23)}</div>
      {
        <div className="mr-4 shrink-0">
          <TailSpin width={24} height={24} color="#689EB8" />
        </div>
      }
    </div>
  );
};

export default LoadingDiashowMedia;
