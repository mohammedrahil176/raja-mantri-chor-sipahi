# Raja Mantri Chor Sipahi

A modern, responsive, and polished web version of the traditional Indian 4-player paper game.

## Description
Raja Mantri Chor Sipahi (King, Minister, Police, Thief) is a classic deduction game where players receive hidden roles. The King must ask the Minister to find the Thief. Correct guesses earn the Minister points, while wrong guesses let the Thief escape with the points!

## Features
- **Pass-and-Play Mode**: Play locally with 4 players on a single device.
- **Hidden Roles**: Securely pass the device and tap to reveal roles without exposing them to others.
- **Dynamic Scoring**: Automatically calculates and tracks points across multiple rounds.
- **Polished UI**: Beautiful card flip animations, gradients, and modern layout.
- **State Persistence**: The game remembers your progress so you can resume if you accidentally refresh.

## Game Rules
- 4 players enter their names.
- Roles are shuffled and hidden every round.
- The **King** calls out: "Who is my Minister?"
- The **Minister** reveals themselves.
- The Minister must then identify the **Thief** from the remaining hidden players.

## Scoring
- 👑 **King**: +1000 pts
- 👮 **Police**: +300 pts
- ⚜️ **Minister**: +500 pts (if they guess correctly), else 0 pts
- 🕵️ **Thief**: 0 pts (if caught), +500 pts (if they escape)

## Tech Stack
- React 19 (TypeScript)
- Vite
- Tailwind CSS v4
- Framer Motion (Animations)
- Lucide React (Icons)
- Vitest (Testing)

## Installation
```bash
git clone https://github.com/rahil/raja-mantri-chor-sipahi.git
cd raja-mantri-chor-sipahi
npm install
npm run dev
```

## Development
Run the local dev server:
```bash
npm run dev
```

## Testing
Run the test suite:
```bash
npm test
```

## Production Build
Build for production:
```bash
npm run build
```

## Deployment
Can be easily deployed on Vercel, Netlify, or GitHub Pages. The build output is generated in the `dist` folder.

## License
MIT
