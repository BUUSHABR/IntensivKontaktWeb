export const getOffsetForQuery = (str: string) => {
  const index = str.indexOf('offset=');
  if (index !== -1) {
    return str.slice(index + 7);
  }
};

export const getDataFromInfinitiveQuery = (data: any) => {
  const tempArr: any = [];
  data?.pages.map((page: any) => {
    return page.results.map((item: any) => {
      tempArr.push(item);
    });
  });
  return tempArr;
};
