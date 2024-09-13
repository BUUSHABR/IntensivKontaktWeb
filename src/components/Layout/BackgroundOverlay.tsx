import { WithChildren } from 'components/util/types';

type BackgroundOverlayProps = WithChildren;

export function BackgroundOverlay({ children }: BackgroundOverlayProps) {
  return <div className="z-30 fixed top-0 left-0 right-0 bottom-0 bg-black/60">{children}</div>;
}
