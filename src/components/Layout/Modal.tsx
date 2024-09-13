import { WithChildren } from 'components/util/types';
import { BackgroundOverlay } from './BackgroundOverlay';
import { ReactComponent as CloseIcon } from 'assets/icons/close-modal.svg';
import { ReactComponent as Arrow } from 'assets/icons/chevron.left.svg';
import { ReactNode, useEffect, useRef } from 'react';
import { useLockedBody } from 'usehooks-ts';
import useOutsideAlerter from '../util/useOutside';

type ModalProps = WithChildren<{
  closeModal?: () => void;
  width?: number;
  children: ReactNode;
  roundedStyle?: string;
  backPath?: () => void;
  backgroundColor?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
}>;

export function Modal({
  children,
  closeModal,
  width,
  roundedStyle,
  backPath,
  backgroundColor,
  title,
  subtitle
}: ModalProps) {
  const container = useRef(null);
  useOutsideAlerter({ ref: container, callback: () => closeModal!() });
  const [, setLocked] = useLockedBody();

  useEffect(() => {
    setLocked(true);
    return () => setLocked(false);
  }, []);

  return (
    <BackgroundOverlay>
      <div className="flex items-center justify-center fixed top-0 left-0 right-0 bottom-0 z-20 ">
        <div
          className={`${
            backgroundColor ? backgroundColor : 'bg-white'
          }   flex flex-col items-stretch ${roundedStyle ? roundedStyle : 'rounded-2xl'}`}
          ref={container}
          style={{ width: width || '450px' }}
        >
          <div className="text-h2 text-black">
          <div className="border-b border-[rgba(60, 60, 67, 0.36)] flex flex-col items-center p-4">
            <div className=" w-full flex items-center justify-center">
              <div className="grow flex items-center gap-2">
                {title}
              </div>
              <div className="flex-none">
                {closeModal && backPath && (
                  <div className="flex justify-between">
                    (
                    <div className="cursor-pointer" onClick={backPath}>
                      <Arrow />
                    </div>
                    (
                    <button className="cursor-pointer" onClick={closeModal}>
                      <CloseIcon />
                    </button>
                  </div>
                )}
                {closeModal && !backPath && (
                  <button className="self-end cursor-pointer" onClick={closeModal}>
                    <CloseIcon />
                  </button>
                )}
              </div>
            </div>
            <div className="w-full flex items-center gap-2 ml-5">
              {subtitle}
            </div>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
        </div>
      </div>
    </BackgroundOverlay>
  );
}
