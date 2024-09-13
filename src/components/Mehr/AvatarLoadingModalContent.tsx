import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { AvatarData } from '../User/useAvatar';
import { UseQueryResult } from 'react-query';
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import { ReactComponent as AvatarSaveButton } from '../../assets/icons/avatar-save-button.svg';
import { ReactComponent as ChoiseAvatarFileIcon } from '../../assets/icons/choise-avatar-file-icon.svg';
import { ReactComponent as PlusScaleAvatarIcon } from '../../assets/icons/plus-scale-avatar.svg';
import { ReactComponent as MinusScaleAvatarIcon } from '../../assets/icons/minus-scale-avatar.svg';
import { getImageData } from '../util/getImageData';
import 'react-image-crop/dist/ReactCrop.css';
import http from '../util/http';
import ToastConsumer from '../../hoc/toastProvider';
import Preloader from '../Preloader';

export type AvatarLoadingModalContentPropsTypes = {
  avatar: UseQueryResult<AvatarData, Error>;
  closeAvatarModal: () => void;
  photoAvatar: string | null;
  setPhotoAvatar: Dispatch<SetStateAction<string | null>>;
};

const AvatarLoadingModalContent = ({
  closeAvatarModal,
  avatar,
  photoAvatar,
  setPhotoAvatar,
}: AvatarLoadingModalContentPropsTypes) => {
  const { toast } = ToastConsumer();

  const [imgSrc, setImgSrc] = useState<string | null>(photoAvatar);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState<number>(1);

  const [isLoadAvatar, setIsLoadAvatar] = useState(false);

  function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 50,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    );
  }

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader?.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
    setScale(1);
  }

  const handleSubmitAvatar = async () => {
    const blob = await getImageData(
      imgRef.current as HTMLImageElement,
      completedCrop as PixelCrop,
      scale,
    );
    const userFileAvatar = new File([blob as Blob], 'avatar.jpg', { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('avatar', userFileAvatar);

    setIsLoadAvatar(true);

    if (avatar.isSuccess) {
      http
        .patch('/auth/profile_picture/me/', formData)
        .then((res) => {
          setImgSrc(null);
          setPhotoAvatar(null);
          closeAvatarModal();
          toast.success('Foto erfolgreich hochgeladen');
          avatar.refetch();
        })
        .catch(() => {
          toast.error('error load avatar');
        })
        .finally(() => {
          setIsLoadAvatar(false);
        });
    } else {
      http
        .post('/auth/profile_picture/', formData)
        .then((res) => {
          closeAvatarModal();
          setImgSrc(null);
          setPhotoAvatar(null);
          toast.success('Foto erfolgreich hochgeladen');
          avatar.refetch();
        })
        .catch(() => {
          toast.error('error load avatar');
        })
        .finally(() => {
          setIsLoadAvatar(false);
        });
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className=" flex justify-center mx-[50px]">
          <div className="w-[150px]">
            <label htmlFor="file">
              <div className="flex justify-center cursor-pointer">
                <ChoiseAvatarFileIcon fill="#000" />
              </div>
            </label>
            <input type="file" id="file" onChange={onSelectFile} className="hidden" />
          </div>
        </div>

        {imgSrc !== null && (
          <div className="flex flex-row justify-between mt-6">
            <div className="flex items-center">
              <div className="h-[64px] w-[32px] bg-[#D3E4E8] rounded">
                <div
                  className="h-[32px] w-[32px] flex justify-center items-center cursor-pointer"
                  onClick={() => setScale((prev) => prev + 0.2)}
                >
                  <PlusScaleAvatarIcon />
                </div>
                <div
                  className="h-[32px] w-[32px] flex justify-center items-center cursor-pointer"
                  onClick={() =>
                    setScale((prev) => {
                      if (prev > 1) return prev - 0.2;
                      else return prev;
                    })
                  }
                >
                  <MinusScaleAvatarIcon />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center mx-[20px] ">
              <div className="max-h-[calc(100vh-300px)]">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop={true}
                >
                  <div className="max-h-[600px]">
                    <img
                      ref={imgRef}
                      src={imgSrc}
                      onLoad={onImageLoad}
                      alt={''}
                      style={{ transform: `scale(${scale})` }}
                    />
                  </div>
                </ReactCrop>
              </div>
            </div>
            <div className="flex items-end">
              {!isLoadAvatar ? (
                <div onClick={() => handleSubmitAvatar()} className="cursor-pointer">
                  <AvatarSaveButton />
                </div>
              ) : (
                <div className="flex justify-center items-center w-[30px] h-[30px]">
                  <Preloader small={true} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarLoadingModalContent;
