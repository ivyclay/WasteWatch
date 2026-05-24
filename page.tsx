@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 220 20% 97%;
    --foreground: 220 20% 10%;

    --card: 0 0% 100%;
    --card-foreground: 220 20% 10%;

    --popover: 0 0% 100%;
    --popover-foreground: 220 20% 10%;

    --primary: 160 84% 39%;
    --primary-foreground: 0 0% 100%;

    --secondary: 220 14% 92%;
    --secondary-foreground: 220 20% 10%;

    --muted: 220 14% 95%;
    --muted-foreground: 220 10% 46%;

    --accent: 160 60% 92%;
    --accent-foreground: 160 84% 25%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;

    --border: 220 13% 88%;
    --input: 220 13% 88%;
    --ring: 160 84% 39%;

    --radius: 0.625rem;
    --radius-sm: calc(0.625rem - 4px);
    --radius-lg: calc(0.625rem + 4px);
    --radius-full: 9999px;

    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-2xl: 48px;
    --spacing-3xl: 64px;

    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.03), 0 1px 3px 0 rgb(0 0 0 / 0.06);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.05);

    --duration-fast: 150ms;
    --duration-normal: 250ms;
    --duration-slow: 350ms;

    --chart-1: 160 84% 39%;
    --chart-2: 199 89% 48%;
    --chart-3: 24 95% 53%;
    --chart-4: 262 83% 58%;
    --chart-5: 340 75% 55%;
  }

  .dark {
    --background: 222 47% 6%;
    --foreground: 210 20% 95%;

    --card: 222 40% 9%;
    --card-foreground: 210 20% 95%;

    --popover: 222 40% 9%;
    --popover-foreground: 210 20% 95%;

    --primary: 160 84% 39%;
    --primary-foreground: 0 0% 100%;

    --secondary: 222 30% 14%;
    --secondary-foreground: 210 20% 95%;

    --muted: 222 30% 14%;
    --muted-foreground: 215 15% 55%;

    --accent: 222 30% 16%;
    --accent-foreground: 160 84% 50%;

    --destructive: 0 62% 40%;
    --destructive-foreground: 0 0% 98%;

    --border: 222 25% 16%;
    --input: 222 25% 16%;
    --ring: 160 84% 39%;

    --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.2), 0 1px 2px -1px rgb(0 0 0 / 0.2);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.2);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.35), 0 4px 6px -4px rgb(0 0 0 / 0.2);

    --chart-1: 160 84% 45%;
    --chart-2: 199 89% 55%;
    --chart-3: 24 95% 60%;
    --chart-4: 262 80% 62%;
    --chart-5: 340 75% 60%;
  }
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  * {
    border-color: hsl(var(--border));
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  [data-hydration-error] {
    display: none !important;
  }
}

@layer utilities {
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300;
  }
  .glow-emerald {
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
  }
  .glow-emerald-strong {
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.25);
  }
}
