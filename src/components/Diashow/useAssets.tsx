import { useQuery } from 'react-query';
import http from '../util/http';
import { AssetType } from './DiashowMedia';

export type Asset = {
  id: number;
  patient: number;
  asset: string;
  asset_type: AssetType;
  asset_optimized?: string;
  uploaded_by: number;
  not_added?: boolean;
  uploaded_at?: string;
  name: string;
};

export default function useChosenMedia(assetId?: number) {
  return useQuery<Asset, Error>(
    ['chooseMedia', assetId],
    async () => {
      return await http.get(`/contacts/assets/${assetId}/`);
    },
    {
      enabled: !!assetId,
    },
  );
}

export const useMedia = (patientId: number) => {
  return useQuery<Array<Asset>, Error>(
    ['patientUploadMedia', patientId],
    async () => {
      const response = await http.get(`/contacts/assets/?patient=${patientId}`);
      return response.results;
    },
    { enabled: !!patientId },
  );
};
