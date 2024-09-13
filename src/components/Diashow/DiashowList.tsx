import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { ReactComponent as UploadPlus } from '../../assets/icons/upload-plus.svg';
import { ReactComponent as InfoIcon } from '../../assets/icons/info.svg';
import { Modal } from '../Layout/Modal';
import DiashowHelpInfo from './DiashowHelpInfo';
import AddDiashowOptions from './AddDiashowOptions';
import { AssetType, DiashowMedia } from './DiashowMedia';
import UploadResultModalContent from './UploadResultModalContent';
import { useMedia } from './useAssets';
import UploadContent from './UploadContent';
import RecordAudio from '../AudioRecord/RecordAudio';
import LoadingDiashowMedia from './LoadingDiashowMedia';
import DiashowLoadingMediaConsumer from './diashowLoadingMediaProvider';
import sortByOrder from '../util/sortByOrder';
import { ReactComponent as InfoNotificationIcon } from '../../assets/icons/InfoNotificationIcon.svg';

export type LoadingAsset = {
  id?: number;
  patient?: number;
  asset?: string;
  asset_type: AssetType;
  asset_optimized?: string;
  uploaded_by?: number;
  not_added?: boolean;
  name?: string;
  index?: number;
};

type DiashowListPropsType = {
  name: string;
  openedId?: number;
  setOpenedId: Dispatch<SetStateAction<number | undefined>>;
  patientId?: number;
  diashowId: number;
  cameraUploadStatus?: 'success' | 'failed';
};

const DiashowList = ({
  name,
  openedId,
  setOpenedId,
  patientId,
  diashowId,
  cameraUploadStatus,
}: DiashowListPropsType) => {
  const [isOpenHelpInfo, setIsOpenHelpInfo] = useState(false);
  const [isOpenAddOptions, setIsOpenAddOptions] = useState(false);
  const [isUploadResult, setIsUploadResult] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUploadPhoto, setIsUploadFile] = useState(false);
  const [isDeleteChosenAssets, setIsDeleteChosenAssets] = useState(false);
  const [isOpenAudioModal, setIsOpenAudioModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'success' | 'failed' | 'big'>('failed');
  const [failedUploadText, setFailedUploadText] = useState<string>();

  const { data: patientMediaData, refetch: refetchDiashowList } = useMedia(patientId!);
  const patientMedia = useMemo(() => {
    return patientMediaData?.sort(sortByOrder).reverse();
  }, [patientMediaData]);

  const { loadedMedia } = DiashowLoadingMediaConsumer();

  const uniqueLoadedMedia = useMemo(() => {
    const MediaArray = [...loadedMedia, ...(patientMedia || [])];
    const arrayWithId = MediaArray.filter((m) => {
      if (m.id) {
        return m;
      }
    });
    const idArray = arrayWithId.map((m) => {
      return m.id;
    });
    const uniqueIdArray = idArray.filter((x) => {
      return idArray.filter((y) => x === y).length === 1 || x === undefined;
    });
    return loadedMedia.filter((m) => {
      if (m.id === undefined || uniqueIdArray.includes(m.id)) {
        return m;
      }
    });
  }, [loadedMedia, patientMedia]);

  const onActivateEditMode = () => {
    setIsEditMode(true);
    setOpenedId(undefined);
    setIsDeleteChosenAssets(false);
  };

  const onDeactivateEditMode = () => {
    setIsEditMode(false);
    setIsDeleteChosenAssets(false);
  };

  const deleteAssets = () => {
    setIsDeleteChosenAssets(true);
    setIsEditMode(false);
  };

  const showUploadResult = (status: 'success' | 'failed' | 'big', err_text?: string) => {
    setUploadStatus(status);
    setIsUploadResult(true);
    setFailedUploadText(err_text);
  };

  useEffect(() => {
    if (cameraUploadStatus) {
      setIsUploadResult(true);
    }
  }, [cameraUploadStatus]);

  return (
    <div>
      <div className="text-h3 text-black font-bold text-center mt-[20px]">Diashow</div>
      <div className="text-h2 font-bold text-[#25272B] mt-[20px]">{name}</div>
      <div className="text-body text-int-grey-60 mt-[10px]">
        Laden Sie jetzt Medien hoch und lassen Sie diese von den Pflegekräften vor Ort abspielen.
      </div>
      <div className="flex justify-between items-center relative">
        <button
          className="text-int-dark-blue py-4 flex items-center"
          onClick={() => setIsOpenAddOptions(true)}
        >
          <UploadPlus className="mr-4" />
          Medien hinzufügen
        </button>
        <div className="absolute left-0 top-[42px]">
          {isOpenAddOptions && (
            <AddDiashowOptions
              open={isOpenAddOptions}
              setOpen={setIsOpenAddOptions}
              uploadPicture={() => setIsUploadFile(true)}
              recordAudio={() => setIsOpenAudioModal(true)}
            />
          )}
        </div>
        <div className="flex items-center cursor-pointer" onClick={() => setIsOpenHelpInfo(true)}>
          <div className="mr-[8px] text-int-grey-30">Hilfe</div>
          <InfoIcon />
        </div>
      </div>

      {isEditMode &&
        ((patientMedia?.length && patientMedia?.length > 0) || uniqueLoadedMedia.length > 0) && (
          <div className="flex justify-between text-int-dark-blue text-body items-center mt-[10px]">
            <div className="cursor-pointer" onClick={deleteAssets}>
              Löschen
            </div>
            <div className="font-bold cursor-pointer" onClick={onDeactivateEditMode}>
              Abbrechen
            </div>
          </div>
        )}

      {!isEditMode &&
        ((patientMedia?.length && patientMedia?.length > 0) || uniqueLoadedMedia.length > 0) && (
          <div className="text-int-dark-blue text-body text-end mt-[10px]">
            <span className="cursor-pointer" onClick={onActivateEditMode}>
              Bearbeiten
            </span>
          </div>
        )}

      <div className="mt-[10px]">
        {uniqueLoadedMedia?.map((m: any, index: number) => {
          if (!(m?.asset || m?.asset_optimized)) {
            return (
              <div key={m?.index}>
                <LoadingDiashowMedia
                  link={m?.asset_optimized || m?.asset || ''}
                  name={m?.name || ''}
                  asset_type={m?.asset_type}
                />
              </div>
            );
          } else {
            return (
              <div key={m.id}>
                <DiashowMedia
                  id={m.id}
                  link={m.asset}
                  name={m.name || ''}
                  assetType={m.asset_type}
                  key={index}
                  setOpenedId={setOpenedId}
                  isActive={openedId === m.id}
                  isEditMode={isEditMode}
                  isDeleteChosenAssets={isDeleteChosenAssets}
                  refetchDiashowList={refetchDiashowList}
                />
              </div>
            );
          }
        })}

        {patientMedia?.map(({ asset, id, uploaded_by, asset_type, name }, index) => (
          <div key={id}>
            <DiashowMedia
              id={id}
              link={asset}
              name={name}
              assetType={asset_type}
              key={index}
              setOpenedId={setOpenedId}
              isActive={openedId === id}
              isEditMode={isEditMode}
              isDeleteChosenAssets={isDeleteChosenAssets}
              refetchDiashowList={refetchDiashowList}
            />
          </div>
        ))}
      </div>
      {isOpenHelpInfo && (
        <Modal
          closeModal={() => setIsOpenHelpInfo(false)}
          title={(
            <>
              <InfoNotificationIcon />
              <b>Hilfe</b>
            </>
          )}
        >
          <DiashowHelpInfo />
        </Modal>
      )}

      {isUploadResult && (
        <Modal>
          <UploadResultModalContent
            close={() => setIsUploadResult(false)}
            status={cameraUploadStatus ? cameraUploadStatus : uploadStatus}
            err_text={failedUploadText}
          />
        </Modal>
      )}

      {isUploadPhoto && (
        <Modal
          closeModal={() => setIsUploadFile(false)}
          title={(
            <b>Foto- & Videomediathek hochladen</b>
          )}
        >
          <UploadContent
            close={() => setIsUploadFile(false)}
            patientId={patientId}
            diashowId={diashowId}
            showUploadResult={showUploadResult}
          />
        </Modal>
      )}

      {isOpenAudioModal && (
        <Modal
          closeModal={() => setIsOpenAudioModal(false)}
          title={(
            <b>Sprachnachrichten</b>
          )}
        >
          <RecordAudio
            patientId={patientId!}
            refetchDiashowList={refetchDiashowList}
            closeModal={() => setIsOpenAudioModal(false)}
            showUploadResult={showUploadResult}
          />
        </Modal>
      )}
    </div>
  );
};

export default DiashowList;
