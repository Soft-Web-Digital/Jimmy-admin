export default () => {
  const formatCurrency = (
    value: number,
    country: string = "en-NG",
    currency: string = "NGN",
    fraction: number = 0
  ) =>
    new Intl.NumberFormat(country, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: fraction
    }).format(value);
  const formatNumber = (value: number) => new Intl.NumberFormat().format(value);
  const sortItems = (item: []) => {
    return item.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }

      return 0;
    });
  }
  return { formatCurrency, formatNumber, sortItems };
};
