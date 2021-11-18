export const timer = () => {
  const startTime = Number(new Date());

  return () => {
    return Number(new Date()) - startTime;
  };
};
