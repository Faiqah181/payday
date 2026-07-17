# PayDay ("Salary Day") - Digital Board Game App

## Overview
A digital adaptation of the **1974 PayDay board game**, built with **Expo 54 / React Native**. Players move through a 31-day calendar month, managing finances through deals, mail cards, bills, insurance, loans/savings and Pay Day settlement. 2-4 players, pass-and-play. The whole UI follows the "Sunshine" design system exported from Claude Design (`D:\Projects\Android\Payday Board Game\Payday board game design\`, master file `Pay Period.dc.html`).

## Tech Stack
- **Framework**: Expo SDK 54, React Native 0.81, TypeScript 5.9, pnpm (`nodeLinker: hoisted` in pnpm-workspace.yaml — required for Expo)
- **Navigation**: expo-router. Routes: `index`, `game-setup`, `game`, `how-to-play`, `settings`, `profile`. In-game "screens" (bank, pause, payday) are OVERLAYS inside the game route — the game never navigates away except Leave/Home.
- **Animations**: react-native-reanimated v4; gestures via react-native-gesture-handler (root view in `_layout`)
- **Audio/Haptics**: expo-audio (click) + expo-haptics — both behind toggles in `contexts/SoundContext` (`playClick`, `impactHaptic`, `successHaptic`)
- **Persistence**: `lib/PersistentStorage.ts` (typed wrapper over expo-sqlite/kv-store, sync API) — sound/haptics/avatarIdx
- **Fonts**: Baloo 2 (600/700/800 headings & buttons), Nunito (600/700/800 UI text), Bungee (400, display & ALL money). Loaded via `useFonts(APP_FONTS)`. Always use `components/ui/Typography` (`design="money"|"title"|"body"`, `weight` 600/700/800) — raw `Text` renders the system font.
- **State**: useReducer game state machine in `app/game.tsx`

## Design System (`constants/theme.ts`)
- `SD` — core palette (surface/surface2/ink/soft/line/primary/accent/debt/blue/purple…)
- `SD_CATEGORY` — board tile category colors; `SD_EVENT_GRADIENTS` — full-screen event washes
- `SD_LAYER` — z-index tokens (hud 10, screenOverlay 30, drawer 44, event 45, diceRoll 46, itemModal 47, dialog 50). NEVER use raw zIndex numbers.
- `mixHex(a, b, t)` — color mixing used for tile tints, shadows, disabled states
- `GAME_CONFIG` (`constants/gameConfig.ts`) — ALL tunable economy numbers: initialCash, salary, maxLoan, borrowStep, interestPercentage, savingsInterestPercentage, earlySavingWithdrawFine (0 = free withdrawals, fine UI auto-hides). Game code must use these, never hardcoded amounts.

## Reusable UI kit (`components/ui/`)
`Typography`, `ChunkyButton` (3D press button; disabled = solid washed colors), `ScreenBackground` (bg art + cream fade — every in-app screen), `ScreenHeader`, `BottomDrawer` (draggable sheet: pull-down dismisses, up-overshoot springs back), `SlideOverlay` (full-screen slide-in, `from="right"|"left"`), `PopCard` (pop-in card with colored eyebrow header), `ConfirmDialog`, `ToggleSwitch`, `Avatar`, `PlayerToken`, `LoadingScreen`.

## Game components (`components/game/`)
- `Board.tsx` / `BoardCell.tsx` — design calendar grid (PAY DAY spans 4 cols); cells tappable → `CellDetailDrawer`
- `dice/` — `DiceCube` (true 3D matrix cube), `DiceRoller` (THE single die: docked over RollButton, flies/tumbles/returns), `RollButton`, `StaticDie`
- `drawers/` — `CellDetailDrawer`, `MailDrawer`, `DealsDrawer` (view + sell mode), `CardItemModal`, `DrawerHeader`, `DrawerRow`
- `bank/` — `BankScreen` (player tabs, pot row, AccountCard, actions), `AccountCard`, `AmountSheet` (shared borrow/withdraw/repay/deposit stepper), `PotDrawer` (history ledger)
- `payday/` — `PaydayOverlay` (settlement ledger + repay/deposit), `PayStepRow`
- `events/` — `EventShell` (gradient event screen; "curtain" enter/exit — pours down from above, falls out the bottom, fading at both ends. The panel hangs a `WAVE_H` SVG wave-cap past each screen edge (`react-native-svg`, filled with the gradient's end colours) so a liquid edge sweeps through while sliding; the caps park off-screen at rest and the gradient still covers exactly the screen), `EventPlayerRow`, `EventFooter`, `WinnerCelebration`, `useDelayedReveal`
- Event modals: `PokerGameModal`, `ElectionModal`, `DaylightSavingModal`, `SwellfareModal`, `CommissionModal`, `LotteryRedeemModal`, `EventToast`, `GameOverModal` (results screen), `PauseOverlay`
- Draw modals: `MailCardModal`, `DealCardModal` (on PopCard)

## Economy Rules (implemented)
- **No account choice** — `getAccountStatus(player)` in `types/game.ts` derives `"loan" | "savings" | "neutral"` from balances. Never both at once.
- **Borrow**: anytime, `borrowStep` increments, capped at `maxLoan`, blocked while savings exist
- **No silent spend beyond cash**: mandatory payments (Town Election pay-in, Pay Day bills/interest) auto-drain savings then auto-loan via `coverShortfall()` — you can't refuse them. Every *optional* buy — deal, insurance, poker entry — first checks cash: if cash covers it the buy is immediate, otherwise a `ConfirmDialog` names the exact funding (`lib/financing.ts` → `shortfallFunding`/`fundingClause`, e.g. "$320 from your savings" or "a $200 loan", using savings→loan order since accounts are savings-XOR-loan) and only on confirm dispatches the buy (which runs the same `coverShortfall()`). `canFinance()` (cash + savings + loan headroom) still hard-disables the Buy/Join button when even everything combined can't cover it. Swellfare bets are capped at cash in hand.
- **Withdraw savings**: anytime; fine only if `earlySavingWithdrawFine > 0`
- **Repay loan / deposit savings**: Pay Day only (reducer phase-guarded). Repay fully, then deposit becomes available in the same Pay Day.
- **Pay Day** (landing on day 31): reducer `settlePayday()` applies salary → interest (savings interest compounds into savings; loan interest charged to cash) → pays all bills → auto-covers shortfalls (savings first, then auto-loan). `PaydayOverlay` shows the report + optional repay/deposit, then `START_NEW_MONTH`.
- **Commission**: buying a deal → phase `"commission"` → every player rolls, highest collects `deal.commission` from the bank
- **Pot**: lost swellfare bets fill it; the Town Election is an on-screen dice race (`ElectionModal`: everyone pays $50 in → players take turns rolling → first 6 wins the whole Pot on the spot; resolved by `CONFIRM_ELECTION { winnerIndex }`, pot resets to 0). All movements logged to `potHistory` (shown in PotDrawer).
- **Daylight Savings**: every in-game player moves back one space and resolves the new space AS A REGULAR TURN, in order starting with the lander (`daylightQueue` in GameState; `resolveLanding()` + the `gameReducer` wrapper drive it). Start players just collect salary again; day-1 players return to Start with no consequences; never chains onto another Daylight space.
- **Bankruptcy**: if the loan maxes out on Pay Day and bills still can't be paid, the Bank buys back deals & insurance at cost; if that's not enough the player goes bankrupt (`Player.bankrupt`), retires immediately, skips all turns, and ranks last on the results screen. Unsold deals are worthless at game end (1974 rule).

### Phase Flow
`roll` → dice overlay → `ANIMATION_COMPLETE` resolves the space → `event` / `deal`(→`commission`) / `mail` / `lottery-result` / `asset-buyer` / `poker-game` / `election` / `daylight-saving` / `salary-day`(→`START_NEW_MONTH`) → `end-turn` → next player → `game-over` (results screen).

## Mail & Deal Systems
- 58 mail cards (`constants/mail.ts`): bills (kept until Pay Day; insurance can cancel by `billCategory`), ads (discard), lottery tickets (valid only in month received, cashed on Lottery Draw), insurance (buy once, permanent), swellfare (gamble when in debt: bet ≤$100, roll 5-6 wins 10×, loss feeds the pot)
- 30 deal cards (`constants/deals.ts`): buy on Deal spaces (loans allowed), sell one card at value on Buyer spaces, commission rolled on purchase

## Board data (`constants/board.ts`)
`BOARD_SPACES` day 0-31, `SPACE_CATEGORY` (type → design category), `getCellAmount`, `getSpaceDetail` (tap-a-cell rules text), layout constants (`BOARD_CELL_GAP` etc. — game.tsx sizing math depends on them).

## Pending / Not Implemented
- Online multiplayer (buttons disabled with "Coming Soon" badge, design screens exist: OnlineHub/Join/Lobby; `gameMode` scaffold + online poker branches ready)
- Google Play Games sign-in (profile screen UI ready, sign-in button disabled with "Coming Soon" badge, no-op). Display name is locally editable & persisted (`playerName`) via `ProfileContext.setName`.
- Rate the app uses `expo-store-review` (`StoreReview.requestReview()` → native Google Play / App Store in-app review); only surfaces in production store builds, quota-limited by Google. Feedback = `mailto:` in settings.
- Board landscape layout is functional but unpolished

## Build Notes
- Android SDK path: `C:\Users\Faiqah\AppData\Local\Android\Sdk` — set ANDROID_HOME env var
- `npx expo prebuild --clean` deletes `android/local.properties` — use env var instead
- Native splash: `logo.png` wordmark on `#1A627D` (expo-splash-screen plugin); JS splash = full-bleed `splash-9x19.png` tap-to-start gate in `_layout`
- App name in app.json: "Salary Day", slug: "salaryday", package/bundleId: "com.kamico.salaryday" — a package change requires `npx expo prebuild --clean` + reinstall on device
- Metro misses newly created directories on Windows — restart with `npx expo start -c` after adding folders
- **Web (testing only, not shipped)**: `pnpm web` — metro.config.js carries the wasm asset ext + COEP/COOP headers for expo-sqlite; `PersistentStorage` falls back to localStorage on web (sqlite sync wasm bridge times out); custom Reanimated Keyframes never start on web (element stays hidden) so `PopCard`/`PlayerHud` use predefined `FadeIn`/`ZoomIn` fallbacks behind `Platform.OS === "web"`. Reanimated **custom layout animations are Android/iOS-only by design** (per its docs) — they silently render the final state on web, so `EventShell`'s curtain falls back to predefined `FadeInDown`/`FadeOutDown` there. Rule of thumb: only *predefined* layout animations run on web — always add a `Platform.OS === "web"` fallback.
