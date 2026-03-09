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
];

export function shuffleMailDeck(cards: MailCard[]): MailCard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
