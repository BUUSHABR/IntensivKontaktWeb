export function FButton({ children, dark, light, disabled = false, ...props }: any) {
  return (
    <button
      className={`px-8 py-3 rounded-lg uppercase text-white text-center w-full text-button font-BeVietnamBold  ${
        dark ? 'bg-int-dark-blue' : 'bg-int-light-blue text-int-dark-blue'
      } ${disabled ? 'bg-int-grey-30' : ''} ${
        light && 'bg-int-light-blue text-int-dark-blue border border-int-dark-blue'
      }`}
      disabled={disabled}
      {...props}
      style={{ border: `${!dark && '1px solid #56A0BB'}` }}
    >
      {children}
    </button>
  );
}

export const FSecondaryButton = ({ children, disabled, ...props }: any) => {
  return (
    <button
      disabled={disabled}
      className={`px-8 py-3 rounded-lg uppercase  ${
        disabled ? 'text-[#9BA6B5] border-[#9BA6B5]' : 'border-int-dark-blue text-int-dark-blue'
      } text-center w-full border font-BeVietnamBold text-button `}
      {...props}
    >
      {children}
    </button>
  );
};

export const FRedButton = ({ children, disabled = false, ...props }: any) => {
  return (
    <button
      className={`px-8 py-3 rounded-lg uppercase  text-center w-full border  font-BeVietnamBold text-button ${
        disabled ? 'text-int-grey-60' : 'text-int-red'
      } ${disabled ? 'border-int-grey-60' : 'border-int-red'}  `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
