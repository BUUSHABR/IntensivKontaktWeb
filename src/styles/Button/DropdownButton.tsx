import { WithChildren } from 'components/util/types';
import { ReactNode, useEffect, useRef, useState } from 'react';

type DropdownButtonItem = {
  key: string;
  title: ReactNode;
};

type DropdownButtonProps = WithChildren<{
  onClick: (key: string) => void;
  items: DropdownButtonItem[];
}>;

export function DropdownButton({ children, items, onClick }: DropdownButtonProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleOnClick = (key: string) => {
    onClick(key);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && menuRef?.current) {
        if (menuRef.current.contains(event.target)) {
          return;
        }
      }

      setMenuOpen(false);
      window.removeEventListener('click', handleOutsideClick);
    };

    if (menuOpen) {
      window.addEventListener('click', handleOutsideClick);
    }
  }, [menuOpen]);

  return (
    <div className="relative">
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute bg-int-very-light-grey border border-black/5 rounded-xl py-3 px-6 right-0 top-6"
        >
          {items.map((item) => (
            <button
              key={item.key}
              onClick={(e) => {
                e.stopPropagation();
                handleOnClick(item.key);
              }}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
      >
        {children}
      </button>
    </div>
  );
}
