export const GAME_CONFIG = {
  initialCash: 500,
  salary: 325,
  maxLoan: 6900,
  borrowStep: 100,
  interestPercentage: 10,
  savingsInterestPercentage: 10,
  /** Fine charged per borrowStep withdrawn from savings. 0 = free (no fine shown). */
  earlySavingWithdrawFine: 0,
} as const;
