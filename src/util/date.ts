const getUnixTimeStamp = () => {
  const date = new Date();
  const unixTimeStamp = Math.floor(date.getTime() / 1000);

  return unixTimeStamp;
}

const getTimeStamp= () => {
  return new Date();
}

const unixTimeStampToDate = (timeStamp: number) => {
  return new Date(timeStamp * 1000);
}

export {
  getUnixTimeStamp,
  unixTimeStampToDate,
  getTimeStamp,
}