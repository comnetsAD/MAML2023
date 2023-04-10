export const successMsg = (msg: string) => {
  return {
    success: true,
    message: msg,
  };
};

export const errorMsg = (msg: string) => {
  return {
    success: false,
    message: msg,
  };
};
