/** @type {import('tailwindcss').Config} */
import { designSystemExtend } from "./src/components/ui/tailwind.preset.js";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '360px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      // Merge the Smart Library design-system tokens: full colour ramps
      // (primary / secondary / accent / danger), surfaces, type scale,
      // radii (xl–4xl), shadows (card / elevated / modal / glow-*).
      ...designSystemExtend,

      // Legacy CSS-variable surface aliases kept for older components.
      colors: {
        ...designSystemExtend.colors,
        surface: {
          ...designSystemExtend.colors.surface,
          300: 'var(--color-surface-300)',
          400: 'var(--color-surface-400)',
        },
      },

      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient':   'var(--hero-gradient)',
        // Gentle multi-stop gradient used as the app canvas background.
        // Low enough opacities that white cards pop with clear separation.
        'app-canvas':
          'radial-gradient(1200px 600px at 0% -10%, rgba(139,92,246,0.05), transparent 60%),' +
          'radial-gradient(900px 500px at 100% 0%, rgba(59,130,246,0.04), transparent 55%),' +
          'radial-gradient(900px 500px at 50% 120%, rgba(245,158,11,0.03), transparent 60%)',
        // Bold hero gradient (indigo → violet → blue) — used on dashboard banners.
        'hero-primary':
          'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #2563EB 100%)',
        'hero-member':
          'linear-gradient(135deg, #4338CA 0%, #7C3AED 50%, #2563EB 100%)',
      },
      boxShadow: {
        ...designSystemExtend.boxShadow,
        'glow-violet': '0 0 30px rgba(124, 58, 237, 0.3)',
        'glow-cyan':   '0 0 30px rgba(6, 182, 212, 0.3)',
        'glow-sm':     '0 0 15px rgba(124, 58, 237, 0.2)',
        'glass':       '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'float-slow':  'float 8s ease-in-out infinite',
        'float-soft':  'float-soft 5s ease-in-out infinite',
        'glow-pulse':  'glow-pulse 3s ease-in-out infinite',
        'blob':        'blob 7s infinite',
        'wiggle':      'wiggle 0.6s ease-in-out',
        'bounce-soft': 'bounce-soft 1.4s ease-in-out infinite',
        'pop-in':      'pop-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'twinkle':     'twinkle 2.2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        'float-soft': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':      { transform: 'translateY(-8px) rotate(2deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.8' },
        },
        blob: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%':  { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%':      { transform: 'rotate(-6deg)' },
          '75%':      { transform: 'rotate(6deg)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        'pop-in': {
          '0%':   { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(0.9)' },
          '50%':      { opacity: '1',    transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
}
