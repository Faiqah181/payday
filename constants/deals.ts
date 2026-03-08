import type { DealCard } from "@/types/game";

export const ALL_DEALS: DealCard[] = [
  { id: 1, title: "Antique Auto", description: "A 1967 beauty that still purrs like a kitten", buyPrice: 350, sellPrice: 600, commission: 70 },
  { id: 2, title: "Diamond Ring", description: "Sparkles so bright it'll blind the neighbors", buyPrice: 150, sellPrice: 450, commission: 30 },
  { id: 3, title: "Popcorn Machine", description: "Movie nights will never be the same", buyPrice: 50, sellPrice: 250, commission: 10 },
  { id: 4, title: "Buried Treasure", description: "X marks the spot — you hope", buyPrice: 200, sellPrice: 700, commission: 40 },
  { id: 5, title: "Timber Land", description: "Trees as far as the eye can see", buyPrice: 300, sellPrice: 550, commission: 60 },
  { id: 6, title: "Hot Dog Stand", description: "Ketchup and mustard empire awaits", buyPrice: 100, sellPrice: 300, commission: 20 },
  { id: 7, title: "Ski Chalet", description: "Cozy cabin with a million-dollar view", buyPrice: 400, sellPrice: 800, commission: 80 },
  { id: 8, title: "Video Games", description: "Rare retro collection in mint condition", buyPrice: 50, sellPrice: 200, commission: 10 },
  { id: 9, title: "Stradivarius Violin", description: "May or may not be authentic — sounds great though", buyPrice: 250, sellPrice: 650, commission: 50 },
  { id: 10, title: "Invention Rights", description: "A gadget that solves a problem nobody has", buyPrice: 200, sellPrice: 500, commission: 40 },
  { id: 11, title: "Used Car", description: "Only slightly dented, runs on optimism", buyPrice: 200, sellPrice: 250, commission: 40 },
  { id: 12, title: "Motorcycle", description: "Two wheels and a whole lot of attitude", buyPrice: 150, sellPrice: 200, commission: 30 },
  { id: 13, title: "Antique Clock", description: "It's always five o'clock somewhere", buyPrice: 80, sellPrice: 120, commission: 16 },
  { id: 14, title: "Painting", description: "Abstract art — or a toddler's masterpiece?", buyPrice: 100, sellPrice: 150, commission: 20 },
  { id: 15, title: "Coin Collection", description: "Pennies from heaven, literally", buyPrice: 120, sellPrice: 180, commission: 24 },
  { id: 16, title: "Rare Stamp Collection", description: "Tiny paper, big money potential", buyPrice: 90, sellPrice: 140, commission: 18 },
  { id: 17, title: "Fishing Boat", description: "The one that won't get away", buyPrice: 300, sellPrice: 400, commission: 60 },
  { id: 18, title: "Camping Trailer", description: "Home is wherever you park it", buyPrice: 250, sellPrice: 320, commission: 50 },
  { id: 19, title: "Stereo System", description: "Blast your tunes and annoy the neighbors", buyPrice: 70, sellPrice: 100, commission: 14 },
  { id: 20, title: "Television", description: "60 inches of pure couch potato bliss", buyPrice: 90, sellPrice: 120, commission: 18 },
  { id: 21, title: "Golf Clubs", description: "For when you need an excuse to skip work", buyPrice: 50, sellPrice: 80, commission: 10 },
  { id: 22, title: "Camera", description: "Capture moments — or sell it for profit", buyPrice: 60, sellPrice: 90, commission: 12 },
  { id: 23, title: "Bicycle", description: "Eco-friendly and wallet-friendly", buyPrice: 30, sellPrice: 50, commission: 6 },
  { id: 24, title: "Fishing Gear", description: "Reel in the big bucks... eventually", buyPrice: 40, sellPrice: 65, commission: 8 },
  { id: 25, title: "Comic Book Collection", description: "Mint condition, do NOT remove from sleeve", buyPrice: 70, sellPrice: 110, commission: 14 },
  { id: 26, title: "Antique Vase", description: "Handle with extreme care — seriously", buyPrice: 150, sellPrice: 220, commission: 30 },
  { id: 27, title: "Jewelry Set", description: "Bling bling, ka-ching ka-ching", buyPrice: 200, sellPrice: 280, commission: 40 },
  { id: 28, title: "Old Painting", description: "Could be a lost masterpiece — or not", buyPrice: 80, sellPrice: 130, commission: 16 },
  { id: 29, title: "Laptop Computer", description: "Slightly used, stickers included for free", buyPrice: 150, sellPrice: 210, commission: 30 },
  { id: 30, title: "Designer Furniture", description: "Sit in style, sell for a smile", buyPrice: 180, sellPrice: 250, commission: 36 },
];

export function shuffleDeck(cards: DealCard[]): DealCard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
