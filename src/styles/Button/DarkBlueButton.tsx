import { WithChildren } from 'components/util/types';

type DarkBlueButtonProps = WithChildren<{
  onClick: () => void;
}>;

export function DarkBlueButton({ children, onClick }: DarkBlueButtonProps) {
  return (
    <button
      onClick={onClick}
      className="py-4 px-2 bg-int-dark-blue uppercase text-white text-sm font-bold rounded-sm tracking-wider"
    >
      {children}
    </button>
  );
}
