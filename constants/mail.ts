import type { MailCard } from "@/types/game";

export const ALL_MAIL: MailCard[] = [
  // Lottery tickets (4 cards)
  { id: 1, type: "lottery", title: "Lottery Ticket", description: "Good for one month only.\nIf you land on Lottery Result.", amount: 100 },
  { id: 2, type: "lottery", title: "Lottery Ticket", description: "Good for one month only.\nIf you land on Lottery Result.", amount: 100 },
  { id: 3, type: "lottery", title: "Lottery Ticket", description: "Good for one month only.\nIf you land on Lottery Result.", amount: 50 },
  { id: 4, type: "lottery", title: "Lottery Ticket", description: "Good for one month only.\nIf you land on Lottery Result.", amount: 50 },

  // Advertisements (12 cards)
  { id: 5, type: "ad", title: "Set of Steak Knives", description: "Get what you pay for.\nSharp deals at your local store!", amount: 0 },
  { id: 6, type: "ad", title: "Encyclopedia Set", description: "Knowledge is power.\nAvailable at fine bookstores.", amount: 0 },
  { id: 7, type: "ad", title: "Lawn Mower", description: "Cut above the rest.\nNow available at hardware stores.", amount: 0 },
  { id: 8, type: "ad", title: "Garden Tools", description: "Dig in and save.\nEverything for the green thumb.", amount: 0 },
  { id: 9, type: "ad", title: "Vacuum Cleaner", description: "It really picks up.\nAt your appliance dealer now.", amount: 0 },
  { id: 10, type: "ad", title: "Kitchen Mixer", description: "Get what you pay for.\nA real whip of a deal!", amount: 0 },
  { id: 11, type: "ad", title: "Magazine Subscription", description: "Stay informed.\nSubscribe today and save!", amount: 0 },
  { id: 12, type: "ad", title: "Book Club Membership", description: "Read all about it.\nJoin now for great savings.", amount: 0 },
  { id: 13, type: "ad", title: "Camera Film Pack", description: "Picture this deal.\nAt your photo shop now.", amount: 0 },
  { id: 14, type: "ad", title: "Weight Loss Program", description: "Lose pounds, not dollars.\nResults guaranteed!", amount: 0 },
  { id: 15, type: "ad", title: "Hair Growth Formula", description: "Growing strong.\nAvailable at your pharmacy.", amount: 0 },
  { id: 16, type: "ad", title: "Better Lawn Fertilizer", description: "Get what you pay for.\nAt your grocers now.", amount: 0 },

  // Bills — Auto Repair (6 cards)
  { id: 17, type: "bill", title: "Computer Auto Repair", description: "Last nut-bolt replacement required", amount: 75, billCategory: "auto" },
  { id: 18, type: "bill", title: "Dent & Scratch Auto", description: "Parking lot mementos", amount: 100, billCategory: "auto" },
  { id: 19, type: "bill", title: "Dent & Scratch Auto", description: "New Seat Cushions", amount: 50, billCategory: "auto" },
  { id: 20, type: "bill", title: "Dent & Scratch Auto", description: "Parking lot mementos", amount: 100, billCategory: "auto" },
  { id: 21, type: "bill", title: "Push & Pull Auto", description: "Remove car from pothole", amount: 150, billCategory: "auto" },
  { id: 22, type: "bill", title: "Crumples Auto Repair", description: "New Bumper Sticker", amount: 25, billCategory: "auto" },

  // Bills — Doctor (4 cards)
  { id: 23, type: "bill", title: "Dr. Goodbody, M.D.", description: "All better!", amount: 85, billCategory: "doctor" },
  { id: 24, type: "bill", title: "Dr. U.R. Fine, M.D.", description: "Sugar Pills", amount: 50, billCategory: "doctor" },
  { id: 25, type: "bill", title: "Dr. I.M. Blurd, M.D.", description: "You can read the eye chart again", amount: 15, billCategory: "doctor" },
  { id: 26, type: "bill", title: "Dr. M. Broidar, M.D.", description: "A stitch in time saves nine", amount: 150, billCategory: "doctor" },

  // Bills — Dentist (4 cards)
  { id: 27, type: "bill", title: "Dr. Ima Driller, D.M.D.", description: "Three teeth excavated", amount: 25, billCategory: "dentist" },
  { id: 28, type: "bill", title: "Dr. Pearl E. White, D.M.D.", description: "Cleaning and Polishing", amount: 20, billCategory: "dentist" },
  { id: 29, type: "bill", title: "Dr. Bridges, D.M.D.", description: "One new toothy grin", amount: 75, billCategory: "dentist" },
  { id: 30, type: "bill", title: "Dr. Smiley, D.M.D.", description: "Bright new toothy smile", amount: 75, billCategory: "dentist" },

  // Bills — Other (22 cards)
  { id: 31, type: "bill", title: "Camp Sun Burn", description: "Anniversary gift", amount: 60, billCategory: "other" },
  { id: 32, type: "bill", title: "Camp Sun Burn", description: "Sorry it rained", amount: 50, billCategory: "other" },
  { id: 33, type: "bill", title: "Hometown Dept. Store", description: "Property Tax", amount: 250, billCategory: "other" },
  { id: 34, type: "bill", title: "Hometown Dept. Store", description: "School Tax", amount: 80, billCategory: "other" },
  { id: 35, type: "bill", title: "Hometown Dept. Store", description: "January White Sale", amount: 30, billCategory: "other" },
  { id: 36, type: "bill", title: "I-Beam Construction Co.", description: "Second story addition", amount: 500, billCategory: "other" },
  { id: 37, type: "bill", title: "Trailer Park Pitz", description: "Be our guest weekend", amount: 25, billCategory: "other" },
  { id: 38, type: "bill", title: "Discord Music School", description: "Introduction to the flugelhorn", amount: 100, billCategory: "other" },
  { id: 39, type: "bill", title: "ZAP Electric Co.", description: "1000 KWH @ 2.5¢ Each", amount: 25, billCategory: "other" },
  { id: 40, type: "bill", title: "ZAP Electric Co.", description: "1000 KWH @ 2.5¢ Each", amount: 25, billCategory: "other" },
  { id: 41, type: "bill", title: "Windfall", description: "Computer Error Found", amount: 50, billCategory: "other" },
  { id: 42, type: "bill", title: "Windfall", description: "Win the World Series Pool", amount: 20, billCategory: "other" },
  { id: 43, type: "bill", title: "Snow Job TV", description: "Repeat service", amount: 35, billCategory: "other" },
  { id: 44, type: "bill", title: "Snow Job TV", description: "Sharpen picture", amount: 50, billCategory: "other" },
  { id: 45, type: "bill", title: "Charge It & Owe It", description: "Ski Rental", amount: 15, billCategory: "other" },
  { id: 46, type: "bill", title: "Charge It & Owe It", description: "New Dishwasher", amount: 300, billCategory: "other" },
  { id: 47, type: "bill", title: "Lead Foot Dancing Academy", description: "Fox Trot Course", amount: 50, billCategory: "other" },
  { id: 48, type: "bill", title: "Drip Water Dept.", description: "2000 gallons @ .10 each", amount: 20, billCategory: "other" },
  { id: 49, type: "bill", title: "Middle Age Health Club", description: "We did the best we could", amount: 90, billCategory: "other" },
  { id: 50, type: "bill", title: "Plunger Plumbing Co.", description: "Stopped all drips", amount: 25, billCategory: "other" },
  { id: 51, type: "bill", title: "Chill Heating Co.", description: "Adjust thermostat", amount: 15, billCategory: "other" },
  { id: 52, type: "bill", title: "Hi Rise Construction Co.", description: "New TV Antenna Installed", amount: 20, billCategory: "other" },

  // Insurance (6 cards)
  { id: 53, type: "insurance", title: "CARR Insurance Co.", description: "Cancels all Auto Repair Bills.\nCoverage good for entire game.", amount: 200, cancelsCategories: ["auto"] },
  { id: 54, type: "insurance", title: "CARR Insurance Co.", description: "Cancels all Auto Repair Bills.\nCoverage good for entire game.", amount: 200, cancelsCategories: ["auto"] },
  { id: 55, type: "insurance", title: "CARR Insurance Co.", description: "Cancels all Auto Repair Bills.\nCoverage good for entire game.", amount: 200, cancelsCategories: ["auto"] },
  { id: 56, type: "insurance", title: "Aches & Pains Ins. Co.", description: "Cancels all Doctor and Dentist Bills.\nCoverage good for entire game.", amount: 150, cancelsCategories: ["doctor", "dentist"] },
  { id: 57, type: "insurance", title: "Aches & Pains Ins. Co.", description: "Cancels all Doctor and Dentist Bills.\nCoverage good for entire game.", amount: 150, cancelsCategories: ["doctor", "dentist"] },
  { id: 58, type: "insurance", title: "Aches & Pains Ins. Co.", description: "Cancels all Doctor and Dentist Bills.\nCoverage good for entire game.", amount: 150, cancelsCategories: ["doctor", "dentist"] },

  // Swellfare (2 cards)
  { id: 59, type: "swellfare", title: "Swellfare", description: "If you are in DEBT, bet any amount up to $100. Roll a 5 or 6 and collect 10 times the amount bet. Roll a 1, 2, 3 or 4 and the money goes into the Pot.", amount: 0 },
  { id: 60, type: "swellfare", title: "Swellfare", description: "If you are in DEBT, bet any amount up to $100. Roll a 5 or 6 and collect 10 times the amount bet. Roll a 1, 2, 3 or 4 and the money goes into the Pot.", amount: 0 },
];

export function shuffleMailDeck(cards: MailCard[]): MailCard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
