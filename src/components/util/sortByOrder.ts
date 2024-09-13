function sortByOrder(x: any, y: any) {
  if (x.id < y.id) {
    return -1;
  }
  if (x.id > y.id) {
    return 1;
  }
  return 0;
}

export default sortByOrder;
