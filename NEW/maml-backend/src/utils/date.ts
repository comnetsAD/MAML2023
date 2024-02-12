export const toLocalISOString = (date: Date) => {
    const offset = date.getTimezoneOffset();
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes() - offset,
      date.getSeconds(),
      date.getMilliseconds()
    ).toISOString();
  };
  