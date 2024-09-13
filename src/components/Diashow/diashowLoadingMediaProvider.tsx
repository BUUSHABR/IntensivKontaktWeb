import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { LoadingAsset } from './DiashowList';

const diashowLoadingMediaContext = createContext<{
  loadedMedia: LoadingAsset[];
  setLoadedMedia: Dispatch<SetStateAction<LoadingAsset[]>>;
}>({
  loadedMedia: [],
  setLoadedMedia: () => {},
});

function useDiashowLoadingMedia() {
  const [loadedMedia, setLoadedMedia] = useState<LoadingAsset[]>([]);

  return {
    loadedMedia,
    setLoadedMedia,
  };
}

export function DiashowLoadingMediaProvider({ children }: { children: ReactNode }) {
  const diashowLoadingMedia = useDiashowLoadingMedia();

  return (
    <diashowLoadingMediaContext.Provider value={diashowLoadingMedia}>
      {children}
    </diashowLoadingMediaContext.Provider>
  );
}

export default function DiashowLoadingMediaConsumer() {
  return useContext(diashowLoadingMediaContext);
}
