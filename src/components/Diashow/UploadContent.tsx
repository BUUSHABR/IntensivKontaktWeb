import React, { useState } from 'react';
import { ReactComponent as DiashowIcon } from '../../assets/icons/diashow-menu.svg';
import http from '../util/http';
import { FButton } from '../../styles/form';
import { AssetType } from './DiashowMedia';
import { LoadingAsset } from './DiashowList';
import DiashowLoadingMediaConsumer from './diashowLoadingMediaProvider';

function getAssetType(type: string): AssetType {
  if (type.includes('image')) {
    return 'image';
  } else if (type.includes('video')) {
    return 'video';
  } else if (type.includes('audio')) {
    return 'audio';
  }
  return 'other';
}

type UploadPhotoPropsType = {
  close: () => void;
  patientId?: number;
  diashowId: number;
  showUploadResult: (status: 'success' | 'failed' | 'big', err_text?: string) => void;
};

const UploadContent = ({ close, patientId, diashowId, showUploadResult }: UploadPhotoPropsType) => {
  const [files, setFiles] = useState<FileList>();
  const { loadedMedia, setLoadedMedia } = DiashowLoadingMediaConsumer();

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };

  const sendMedia = () => {
    if (files) {
      const readyCountArr: string[] = [];

      for (let i = 0; i < files?.length; i++) {
        if (
          // 5MB
          (getAssetType(files[i].type) === 'image' && files[i].size > 5242880) ||
          // 500MB
          ((getAssetType(files[i].type) === 'video' || getAssetType(files[i].type) === 'audio')  && files[i].size > 524288000)
        ) {
          showUploadResult('big');
        } else {
          const formData: any = new FormData();
          formData.append('asset', files[i]);
          formData.append('asset_type', getAssetType(files[i].type));
          formData.append('name', files[i].name || '');
          formData.append('patient', patientId);
          formData.append('dia_show', diashowId);

          setLoadedMedia((prev: LoadingAsset[]) => {
            return [
              ...prev,
              { asset_type: getAssetType(files[i].type), name: files[i].name || '', index: i },
            ];
          });
          http
            .post(`/contacts/assets/?patient=${patientId}`, formData)
            .then((res) => {
              setLoadedMedia((prev: LoadingAsset[]) => {
                return prev.map((el) => {
                  if (i === el.index) {
                    return { ...res, index: i };
                  } else {
                    return el;
                  }
                });
              });

              readyCountArr.push(files[i].name || '');
              if (files?.length === readyCountArr.length) {
                showUploadResult('success');
              }
            })
            .catch((err) => {
              setLoadedMedia(loadedMedia.filter(media => media.index !== i));
              showUploadResult('failed', err['non_field_errors'][0]);
            });
        }
      }
      close();
    }
  };

  return (
    <div>
      <div className=" mb-[30px] border border-int-light-blue">
        <input multiple type="file" onChange={onSelectFile} className="w-[100%]" />
      </div>
      <div className="cursor-pointer" onClick={sendMedia}>
        <FButton dark={true} disabled={files === undefined}>
          Senden
        </FButton>
      </div>
    </div>
  );
};

export default UploadContent;
