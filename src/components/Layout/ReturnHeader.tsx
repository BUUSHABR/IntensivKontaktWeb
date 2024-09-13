import { ReactComponent as LeftArrowIcon } from 'assets/icons/left_arrow.svg';
import { ReactComponent as QuestionIcon } from 'assets/icons/question.svg';
import { useNavigate } from 'react-router-dom';

export function ReturnHeader() {
  const navigate = useNavigate();

  return (
    <header className="py-10 px-6 flex justify-between items-center">
      <LeftArrowIcon onClick={() => navigate(-1)} className="cursor-pointer text-int-dark-blue" />
      <QuestionIcon />
    </header>
  );
}
