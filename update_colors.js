const fs = require('fs');

const uiPrimitivesFile = './src/components/ui-primitives.tsx';
let uiPrims = fs.readFileSync(uiPrimitivesFile, 'utf8');
uiPrims = uiPrims.replace(/primary:\s*'#[a-f0-9]+'/, "primary:      '#145c70'")
  .replace(/primaryDark:\s*'#[a-f0-9]+'/, "primaryDark:  '#0d3d4a'")
  .replace(/primaryMid:\s*'#[a-f0-9]+'/, "primaryMid:   '#104b5c'")
  .replace(/primaryLight:\s*'#[a-f0-9]+'/, "primaryLight: '#1f7a95'")
  .replace(/gold:\s*'#[a-f0-9]+'/, "gold:         '#247c6c'")
  .replace(/goldLight:\s*'#[a-f0-9]+'/, "goldLight:    '#3ba491'")
  .replace(/goldDark:\s*'#[a-f0-9]+'/, "goldDark:     '#18574a'")
  .replace(/bg:\s*'#[a-f0-9]+'/, "bg:           '#f4f8f9'")
  .replace(/bgCard:\s*'#[a-f0-9]+'/, "bgCard:       '#e6f0f2'")
  .replace(/bgCard2:\s*'#[a-f0-9]+'/, "bgCard2:      '#d3e3e8'")
  .replace(/text:\s*'#[a-f0-9]+'/, "text:         '#121d21'")
  .replace(/textMuted:\s*'#[a-f0-9]+'/, "textMuted:    '#50676e'")
  .replace(/border:\s*'#[a-f0-9]+'/, "border:       '#c3d7dc'")
  .replace(/footerBg:\s*'#[a-f0-9]+'/, "footerBg:     '#08171c'");
fs.writeFileSync(uiPrimitivesFile, uiPrims);

const globalsFile = './src/app/globals.css';
let globals = fs.readFileSync(globalsFile, 'utf8');
globals = globals.replace(/--background: #[a-f0-9]+;/, "--background: #f4f8f9;")
  .replace(/--foreground: #[a-f0-9]+;/, "--foreground: #121d21;")
  .replace(/--card: #[a-f0-9]+;/, "--card: #e6f0f2;")
  .replace(/--card-foreground: #[a-f0-9]+;/, "--card-foreground: #121d21;")
  .replace(/--primary: #[a-f0-9]+;/, "--primary: #145c70;")
  .replace(/--secondary: #[a-f0-9]+;/, "--secondary: #247c6c;")
  .replace(/--muted: #[a-f0-9]+;/, "--muted: #d3e3e8;")
  .replace(/--muted-foreground: #[a-f0-9]+;/, "--muted-foreground: #50676e;")
  .replace(/--accent: #[a-f0-9]+;/, "--accent: #1f7a95;")
  .replace(/--border: #[a-f0-9]+;/, "--border: #c3d7dc;")
  .replace(/--ring: #[a-f0-9]+;/, "--ring: #145c70;")
  .replace(/--primary-dark: #[a-f0-9]+;/, "--primary-dark: #0d3d4a;")
  .replace(/--primary-mid: #[a-f0-9]+;/, "--primary-mid: #104b5c;")
  .replace(/--primary-light: #[a-f0-9]+;/, "--primary-light: #1f7a95;")
  .replace(/--gold-light: #[a-f0-9]+;/, "--gold-light: #3ba491;")
  .replace(/--gold-dark: #[a-f0-9]+;/, "--gold-dark: #18574a;")
  .replace(/--footer-bg: #[a-f0-9]+;/, "--footer-bg: #08171c;")
  .replace(/fill='%23c8a96e'/g, "fill='%23247c6c'");
fs.writeFileSync(globalsFile, globals);

const homeFile = './src/components/home-client.tsx';
let home = fs.readFileSync(homeFile, 'utf8');
home = home.replace(/const dark = '#100402';/, "const dark = '#061217';")
  .replace(/stopColor="#070201"/, 'stopColor="#03090a"')
  .replace(/stopColor="#180a05"/, 'stopColor="#091f26"')
  .replace(/stopColor="#3d2010"/, 'stopColor="#103f4f"')
  .replace(/stopColor="#c8a96e"/g, 'stopColor="#247c6c"')
  .replace(/fill="#d4b96a"/, 'fill="#3ba491"')
  .replace(/fill="#050e07"/, 'fill="#020709"')
  .replace(/fill="#c8a96e"/g, 'fill="#247c6c"')
  .replace(/fill="#0a2510"/g, 'fill="#09222a"')
  .replace(/linear-gradient\(135deg,#0c0402 0%,#1a0a05 55%,#3d2010cc 100%\)/, "linear-gradient(135deg,#060b0d 0%,#0c1b22 55%,#103f4fcc 100%)")
  .replace(/rgba\(200,169,110,\.12\)/, "rgba(36,124,108,.12)") // gold rgba
  .replace(/rgba\(27,94,32,\.25\)/, "rgba(20,92,112,.25)") // primary box-shadow
  .replace(/rgba\(27,94,32,\.22\)/, "rgba(20,92,112,.22)");
fs.writeFileSync(homeFile, home);

console.log("Colors updated!");
