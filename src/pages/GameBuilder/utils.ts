export const urlToObject = async (url: string, fileName: string) => {
  const response = await fetch(url, {
    mode: "no-cors",
  });
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};

export const getAssetName = (gameId: string, path: string[]) => {
  return `gameId=${gameId}|path=${path.join(",")}`;
};
