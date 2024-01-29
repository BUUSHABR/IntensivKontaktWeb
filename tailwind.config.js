module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
    },
    screens: {
      '2xl': { max: '1535px' },
      // => @media (max-width: 1535px) { ... }

      xl: { max: '1279px' },
      // => @media (max-width: 1279px) { ... }

      lg: { max: '1023px' },
      // => @media (max-width: 1023px) { ... }

      md: { max: '767px' },
      // => @media (max-width: 767px) { ... }

      sm: { max: '639px' },
      // => @media (max-width: 639px) { ... }

      mm: { max: '350px' },
    },
    extend: {
      colors: {
        'int-black': '#000000',
        'int-light-blue': '#ECEFF0',
        'int-grey-90': '#454950',
        'int-grey-60': '#6F7782',
        'int-grey-40': '#9BA6B5',
        'int-grey-30': '#B2BAC6',
        'int-mid-blue': '#D3E4E8',
        'int-dark-blue': '#56A0BB',
        'int-very-dark-blue': '#498EA8',
        'int-green': '#B2DAA4',
        'int-dark-green': '#97D382',
        'int-dark': '#333333',
        'int-red': '#EB5757',
        'int-very-light-grey': '#FAFAFA',
        'int-green-alert': '#97D382',
      },
      fontSize: {
        button: ['14px', '22.4px'],
        link: ['16px', '25.6px'],
        'body-small': ['14px', '22.4px'],
        'chat-date': ['14px', '19.6px'],
        body: ['16px', '24px'],
        h3: ['16px', '21px'],
        h2: ['18px', '26.3px'],
        h1: ['24px', '31.2px'],
        small: ['11px', '15.4px'],
        header: ['30px', '39px'],
      },
      fontFamily: {
        BeVietnamBold: ['BeVietnamBold'],
        BeVietnamRegular: ['BeVietnamRegular'],
      },
      boxShadow: {
        card: '0px 20px 44px #C9D3D7, 0px 1px 2px rgba(0, 0, 0, 0.15)',
        reactions: '0px 13px 14px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.15)',
        button: '0px 16px 26px -10px rgba(0, 0, 0, 0.25)',
        authCard: '0px 4px 84px rgba(0, 0, 0, 0.35)',
        resultCard: '0px 6px 14px rgba(0, 0, 0, 0.05), 0px 0.5px 0px #ECEFF0',
      },
      dropShadow: {
        image: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
