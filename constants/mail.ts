import type { MailCard } from "@/types/game";

export const ALL_MAIL: MailCard[] = [
  { id: 1, type: "lottery", title: "Lottery Ticket", description: "Good for one month only.\nIf you land on Lottery Result.", amount: 100 },
  { id: 2, type: "lottery", title: "Lottery Ticket", description: "Good for one month only.\nIf you land on Lottery Result.", amount: 100 },
  { id: 3, type: "lottery", title: "Lottery Ticket", description: "Good for one month only.\nIf you land on Lottery Result.", amount: 50 },
  { id: 4, type: "lottery", title: "Lottery Ticket", description: "Good for one month only.\nIf you land on Lottery Result.", amount: 50 },
];

export function shuffleMailDeck(cards: MailCard[]): MailCard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
