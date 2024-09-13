export const createShortcut = (text: string, limit: number) => {
  if (text.length > limit) {
    const part = text.slice(0, limit - 3);
    return part + '...';
  }
  return text;
};
