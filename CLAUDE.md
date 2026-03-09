# PayDay - Digital Board Game App

## Overview
A digital adaptation of the **1974 PayDay board game**, built with **Expo 54 / React Native**. Players move through a 31-day calendar month, managing finances through deals, mail cards, bills, insurance, and salary collection. The game supports 2-4 players in pass-and-play mode.

## Tech Stack
- **Framework**: Expo SDK 54, React Native 0.81.5, TypeScript 5.9.2
- **Navigation**: expo-router (file-based routing)
- **Animations**: react-native-reanimated v4 (FadeIn, FadeOut, spring physics, sequential step animations)
- **Audio**: expo-audio (click sound effects)
- **Font**: System bold (fontWeight: "800") for titles
- **State**: useReducer pattern for game state machine in `app/game.tsx`

## Project Structure

```
app/
  _layout.tsx        — Root layout: JS splash screen overlay, SoundProvider, Stack nav
  index.tsx          — Main menu: "Pass & Play" and "Online" (disabled) buttons
  game-setup.tsx     — Player config: names, count (2-4), months (2-6), account types
  game.tsx           — Main game screen: reducer, board, modals, all game logic (~700 lines)
  how-to-play.tsx    — Rules/tutorial with 11 card sections
  settings.tsx       — Sound toggle, support link, quit button

components/game/
  Board.tsx          — 5×7 calendar grid, animated pawn movement (step-by-step 120ms/cell)
  BoardCell.tsx      — Individual cell: day number, type icon, player tokens, highlight
  Dice.tsx           — Interactive die with shake animation, random 1-6
  PlayerCard.tsx     — Player stats: name, cash, loans, deals count, mail count
  EventToast.tsx     — Pop-up for space events (birthday +$400, rent -$50, etc.)
  DealCardModal.tsx  — Deal purchase modal: buy price, sell value, commission
  MailCardModal.tsx  — Polymorphic mail modal (ad/bill/insurance/lottery/swellfare)
  LotteryRedeemModal.tsx — Select lottery tickets to cash on lottery-result space
  DealsViewer.tsx    — Tabbed viewer (Deals + Mail tabs) for held cards, sell mode for asset-buyer

components/menu/
  MenuButton.tsx     — Animated button with press spring, sound, variants (primary/secondary/disabled)
  IconButton.tsx     — Circular icon button (settings, help)
  ComingSoonBadge.tsx — Rotated orange badge for disabled features

constants/
  board.ts           — BOARD_SPACES (32 spaces, day 0-31), SPACE_CONFIG (icons/colors), SPACE_EVENTS
  colors.ts          — COLORS (yellow bg, button styles, text), SPACING (xs-xl), BORDER_RADIUS
  deals.ts           — ALL_DEALS (30 cards, $30-$800 range), shuffleDeck()
  mail.ts            — ALL_MAIL (58 cards), shuffleMailDeck()

types/game.ts        — All game types: SpaceType, BoardSpace, DealCard, MailCard, Player, GameState
contexts/SoundContext.tsx — Global sound toggle + playClick() via expo-audio
```

## Game State Machine

State is managed by `useReducer` in `app/game.tsx`. The `GameState` tracks:
- `players[]` — each with cash, position, deals, unpaidBills, lotteryTickets, insurance
- `phase` — current game phase (drives which UI is shown)
- `dealDeck[]`, `mailDeck[]` — shuffled card decks
- `currentDeal`, `currentMail` — card being shown in modal

### Phase Flow
```
"roll" → player rolls dice
  → "event" → animation plays, space logic resolves
    → "deal" → deal card modal (buy/discard)
    → "mail" → mail card modal (type-specific actions)
    → "lottery-result" → redeem lottery tickets
    → "asset-buyer" → sell held deals
    → "salary-day" → (currently auto-resolves via END_TURN)
    → "end-turn" → player ends turn
      → back to "roll" for next player
      → "game-over" when all players finish all months
```

### Reducer Actions
| Action | Purpose |
|--------|---------|
| `ROLL_DICE` | Calculate target position, start animation |
| `ANIMATION_COMPLETE` | Resolve space: draw cards, apply events, set next phase |
| `DISMISS_EVENT` | Close event toast, advance to end-turn |
| `BUY_DEAL` | Deduct buyPrice, add deal to player |
| `DISCARD_DEAL` | Skip deal, advance to end-turn |
| `SELL_DEAL` | Add sellPrice to cash, remove deal from player |
| `SKIP_ASSET_BUYER` | No sale, advance to end-turn |
| `DISMISS_MAIL` | Handle mail by type: bills→unpaidBills, lottery→tickets, insurance discard, ad→nothing |
| `BUY_INSURANCE` | Deduct premium, add to player.insurance |
| `REDEEM_LOTTERY` | Cash selected tickets, add amounts to cash |
| `SKIP_LOTTERY` | No redemption, advance to end-turn |
| `END_TURN` | If at Salary Day (pos 31): reset pos, increment month, deduct bills, expire tickets. Advance player. |

## Mail Card System (58 cards in `constants/mail.ts`)

| Type | Count | Behavior |
|------|-------|----------|
| **Lottery** | 4 | Kept until lottery-result space. Valid only in month received. |
| **Ad** | 12 | Shown then immediately discarded. No action needed. |
| **Bill** | 36 | Kept in unpaidBills until Salary Day, then paid and discarded. |
| **Insurance** | 6 | Must buy ($150-$200) or discard immediately. If bought, held permanently. |
| **Swellfare** | 0 | Type exists but no cards yet. Gambling mechanic TBD. |

### Bill Categories & Insurance Cancellation
- Bills have `billCategory`: "auto", "doctor", "dentist", "other"
- Insurance has `cancelsCategories`: CARR Insurance cancels "auto"; Aches & Pains cancels "doctor" + "dentist"
- When a bill is drawn, if player holds matching insurance → bill is cancelled (discarded, not kept)
- "other" category bills are never cancelled by insurance
- Check happens in both UI (green "Cancelled!" note) and reducer logic

## Deal Card System (30 cards in `constants/deals.ts`)
- Buy price: $30-$400, Sell price: $50-$800
- Bought on "deal" spaces, sold on "asset-buyer" spaces
- Commission field exists but not yet deducted in sell logic

## Board Layout (`constants/board.ts`)
- 7 columns (Sun-Sat) × 5 rows = 32 spaces (day 0 START through day 31 SALARY DAY)
- Calendar-style grid. Players move left-to-right through each week.
- Space types trigger different phases/events (see SPACE_CONFIG for icons and labels)

### Space Events (instant cash changes)
- Birthday Gift: +$400
- Performance Bonus: +$100
- Visitor Surprise: -$50
- School Reunion: -$40
- Household Essentials: -$75
- Home Rent: -$50

## Salary Day (END_TURN at position 31)
When a player reaches day 31:
1. Position resets to 0
2. `currentMonth` increments
3. All `unpaidBills` totaled and deducted from cash (negative cash allowed for now)
4. `unpaidBills` cleared
5. Expired lottery tickets (from current month) removed
6. If player completed all months → check game over

## Player Initialization
- Starting cash: $500
- Starting loanBalance: $0
- Position: 0 (START)
- Month: 1
- Empty arrays for deals, unpaidBills, lotteryTickets, insurance
- Color assigned from PLAYER_COLORS (red, blue, green, orange)

## UI/UX Patterns
- **Responsive layout**: Portrait (stacked) vs Landscape (split panel) based on dimensions
- **Color coding per mail type**: Blue (bills), Gold (lottery), Grey (ads), Purple (insurance)
- **System bold font**: fontWeight "800" used for all title text in modals and headers
- **Reanimated animations**: Spring press effects, fade in/out modals, step-by-step pawn movement
- **Sound**: Click sound on button presses, toggleable via SoundContext

## Pending Features (Not Yet Implemented)
- **Loan/Savings account mechanics**: loanBalance field exists but no UI. Negative cash allowed temporarily.
- **Salary collection**: Players don't receive salary on Salary Day yet.
- **Interest on loans**: Not implemented.
- **Swellfare cards**: Type exists, no cards or logic.
- **Commission deduction**: Commission shown on deals but not deducted on sell.
- **Poker Game space**: Space exists on board, no special logic.
- **Election space**: Space exists, no logic.
- **Daylight Saving space**: Space exists, no logic.
- **Online multiplayer**: Button exists but disabled with "Coming Soon" badge.
- **Game-over summary**: Currently just an Alert dialog, no proper summary screen.
- **How-to-play updates**: Needs updating for bill/insurance/lottery mechanics.

## Build Notes
- Android SDK path: `C:\Users\Faiqah\AppData\Local\Android\Sdk` — set ANDROID_HOME env var
- `npx expo prebuild --clean` deletes `android/local.properties` — use env var instead
- Splash screen: `assets/images/splash-screen.png` with cover mode, bg color #1a6b5a
- App name in app.json: "paycheck", slug: "salaryday", package: "com.anonymous.salaryday"
