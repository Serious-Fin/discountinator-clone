const formatDate = (date: string) => {
  const dateTime = date.split(".")[0];
  return dateTime;
};

const formatPrice = (price: string) => {
  return price + " €";
};

export { formatDate, formatPrice };
