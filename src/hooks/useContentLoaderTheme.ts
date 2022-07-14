import useTheme from '../hooks/useTheme';

const useContentLoaderTheme = () => {
  const {theme, COLOR_SCHEMES} = useTheme();

  return {
    contentLoaderBackground:
      theme === COLOR_SCHEMES.light ? '#f3f3f3' : '#323438',
    contentLoaderForeground:
      theme === COLOR_SCHEMES.light ? '#ecebeb' : '#3e4044',
  };
};

export default useContentLoaderTheme;
