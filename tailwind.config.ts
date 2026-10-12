import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F4EFE7',
        sand: '#EBE3D6',
        card: '#FBF8F3',
        ink: '#000000',
        night: '#14100C',
        terra: { DEFAULT: '#B4502D', light: '#E8825A' },
        line: 'rgba(0,0,0,0.14)',
        mute: 'rgba(0,0,0,0.62)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      spacing: { gutter: 'clamp(20px, 5vw, 64px)', section: 'clamp(80px, 14vh, 180px)' },
      maxWidth: { page: '1280px', wide: '1440px' },
      boxShadow: {
        soft: '0 1px 2px rgba(60,40,20,.06), 0 24px 60px -24px rgba(60,40,20,.22)',
        deep: '0 40px 80px -30px rgba(0,0,0,.7)',
      },
      transitionTimingFunction: { premium: 'cubic-bezier(.2,.8,.1,1)', wipe: 'cubic-bezier(.77,0,.18,1)' },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        spin360: { to: { transform: 'rotate(360deg)' } },
        float: { from: { transform: 'translateY(-12px) rotate(-1deg)' }, to: { transform: 'translateY(14px) rotate(1deg)' } },
        pulseSoft: { '50%': { opacity: '.35' } },
        shake: { '20%,60%': { transform: 'translateX(-10px)' }, '40%,80%': { transform: 'translateX(10px)' } },
        kenburns: { to: { transform: 'scale(1.12)' } },
        bar: { '50%': { transform: 'scaleY(.55)' } },
        ping: { from: { transform: 'scale(.95)', opacity: '.9' }, to: { transform: 'scale(1.5)', opacity: '0' } },
        grain: { '25%': { transform: 'translate(-3%,2%)' }, '50%': { transform: 'translate(2%,-3%)' }, '75%': { transform: 'translate(-2%,-1%)' } },
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
        'marquee-rev': 'marquee 60s linear infinite reverse',
        'spin-slow': 'spin360 90s linear infinite',
        'spin-rev': 'spin360 120s linear infinite reverse',
        float: 'float 9s ease-in-out infinite alternate',
        'pulse-soft': 'pulseSoft 1.8s ease-in-out infinite',
        shake: 'shake .5s',
        kenburns: 'kenburns 16s ease-in-out infinite alternate',
        bar: 'bar 2.4s ease-in-out infinite alternate',
        ping: 'ping 3s ease-out infinite',
        grain: 'grain .9s steps(4) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
