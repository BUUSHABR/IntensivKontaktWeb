import { PropsWithChildren, useRef, useState } from 'react';
import { ReactComponent as QuestionIcon } from 'assets/icons/register_question.svg';
import { ReactComponent as ChevronDown } from 'assets/icons/chevron-down.svg';

interface AccordionChildProps {
  active: boolean;
  title: string;
}

export default function AccordionChild(props: PropsWithChildren<AccordionChildProps>) {
  const [active, setActive] = useState(props.active || false);
  const [rotate, setRotate] = useState(props.active ? 'rotate-180' : '');

  const content = useRef<HTMLDivElement>(null);

  function toggleAccordion() {
    setActive(!active ? true : false);
    setRotate(active ? '' : 'rotate-180');
  }

  return (
    <div className="bg-white border-b border-int-black">
      <button className=" w-full text-left py-4 flex items-center" onClick={toggleAccordion}>
        <QuestionIcon className="w-4 mr-2 shrink-0" />
        <h3 className="font-bold text-int-dark mr-auto">{props.title}</h3>
        <div className={rotate}>
          <ChevronDown />
        </div>
      </button>
      <div
        ref={content}
        className={`transition-all ${active ? 'max-h-full' : 'max-h-0'} overflow-hidden`}
      >
        {props.children}
      </div>
    </div>
  );
}
