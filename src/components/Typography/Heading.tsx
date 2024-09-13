import { WithChildren } from 'components/util/types';

type HeadingProps = WithChildren<{
  className?: string;
}>;

export function Heading({ children, className }: HeadingProps) {
  return <h1 className={`text-2xl text-gray-700 ${className}`}>{children}</h1>;
}
