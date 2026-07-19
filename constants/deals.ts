import type { DealCard } from "@/types/game";

export const ALL_DEALS: DealCard[] = [
  // Cheap affordable
  { id: 23, title: "Bicycle", description: "Eco-friendly and wallet-friendly", buyPrice: 30, sellPrice: 60, commission: 10 },
  { id: 8, title: "Video Games", description: "Rare retro collection in mint condition", buyPrice: 60, sellPrice: 200, commission: 20 },
  { id: 22, title: "Camera", description: "Capture moments — or sell it for profit", buyPrice: 80, sellPrice: 180, commission: 20 },
  { id: 19, title: "Stereo System", description: "Blast your tunes and annoy the neighbors", buyPrice: 80, sellPrice: 150, commission: 25 },
  { id: 20, title: "Television", description: "60 inches of pure couch potato bliss", buyPrice: 90, sellPrice: 120, commission: 18 },
  { id: 28, title: "Old Painting", description: "Could be a lost masterpiece — or not", buyPrice: 80, sellPrice: 120, commission: 16 },
  { id: 3, title: "Asad Kamran's Autograph", description: "Autograph of this game's developer — But why do you even need his autograph?", buyPrice: 100, sellPrice: 400, commission: 100 },

  // Medium
  { id: 15, title: "Coin Collection", description: "Pennies from heaven, literally", buyPrice: 650, sellPrice: 1000, commission: 80 },
  { id: 2, title: "Diamond Ring", description: "Sparkles so bright it'll blind the neighbors", buyPrice: 550, sellPrice: 750, commission: 50 },
  { id: 1, title: "Antique Auto", description: "A 1967 beauty that still purrs like a kitten", buyPrice: 550, sellPrice: 750, commission: 80 },
  { id: 234, title: "Stamp Collection", description: "Tiny paper, big money potential", buyPrice: 500, sellPrice: 700, commission: 80 },
  { id: 11, title: "Used Car", description: "Only slightly dented, runs on optimism", buyPrice: 400, sellPrice: 600, commission: 100 },
  { id: 29, title: "Laptop Computer", description: "Slightly used, stickers included for free", buyPrice: 450, sellPrice: 650, commission: 50 },
  // { id: 10, title: "Invention Rights", description: "A gadget that solves a problem nobody has", buyPrice: 200, sellPrice: 500, commission: 40 },
  // { id: 27, title: "Jewelry Set", description: "Bling bling, ka-ching ka-ching", buyPrice: 200, sellPrice: 280, commission: 40 },

  // Luxury
  { id: 12, title: "Motorcycle", description: "Two wheels and a whole lot of attitude", buyPrice: 2000, sellPrice: 2800, commission: 200 },
  { id: 17, title: "Power Boat", description: "Cuts through the waves — and your savings", buyPrice: 2500, sellPrice: 3000, commission: 200 },
  { id: 7, title: "Ski Chalet", description: "Cozy cabin with a million-dollar view", buyPrice: 2500, sellPrice: 3200, commission: 300 },
  { id: 4, title: "Share of a Race Horse", description: "Own a leg of a champion — you just hope it's a fast one", buyPrice: 1000, sellPrice: 1800, commission: 100 },
  { id: 18, title: "Family Camping Trailer", description: "Home is wherever you park it", buyPrice: 1500, sellPrice: 2200, commission: 150 },
  { id: 2322, title: "Sports Car", description: "Zero to sixty, and zero to broke", buyPrice: 3000, sellPrice: 4000, commission: 300 },
  { id: 2324, title: "Two Acres Farm Land", description: "They're not making any more of it", buyPrice: 3000, sellPrice: 4000, commission: 300 },
  { id: 2325, title: "Fast Food Franchise", description: "Would you like fries with that fortune?", buyPrice: 4000, sellPrice: 5000, commission: 400 },
];

export function shuffleDeck(cards: DealCard[]): DealCard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
