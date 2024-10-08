import { useEffect } from 'react';

interface Props {
  ref: any;
  callback: () => void;
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
export default function useOutsideAlerter({ ref, callback }: Props) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}
