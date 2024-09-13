import React from 'react';
import preloader from './../assets/img/spinner.svg';

type PreloaderPropsType = {
  small?: boolean;
  error?: string;
};

const Preloader = ({ small, error }: PreloaderPropsType) => {
  if (small) {
    return (
      <div className="m-auto">
        <img className="w-[30px] h-[30px] " src={preloader} alt="loading..." />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: '40%',
        width: '100%',
      }}
    >
      <div className="flex flex-col items-center">
        {!error && <img src={preloader} alt="loading..." />}
        {error && <h3 className="block text-int-red w-3/5 text-center">{error}</h3>}
      </div>
    </div>
  );
};

export default Preloader;
