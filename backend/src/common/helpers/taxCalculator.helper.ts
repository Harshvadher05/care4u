export const calculateTax = (fees: number, taxRate: number): number => {
  if (typeof fees !== "number" || typeof taxRate !== "number" || isNaN(fees) || isNaN(taxRate)) {
    return 0;
  }
  const tax = (Math.max(0, fees) * Math.max(0, taxRate)) / 100;
  return Math.round(tax * 100) / 100;
};
