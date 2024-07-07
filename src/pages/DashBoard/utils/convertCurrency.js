export const convertCurrency = (amount, rates, baseCurrency, targetCurrency) => {
    if (baseCurrency === targetCurrency) {
      return amount;
    }
    const rate = rates[targetCurrency];
    return rate ? amount * rate : amount;
  };
  