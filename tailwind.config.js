/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: { extend: { colors: { cream: '#FFF6EE', ink: '#1F1C1A', muted: '#716A64', rooster: '#D1263B', 'rooster-dark': '#AA1D30', yolk: '#F4B223', line: '#E1D8CF', night: '#171513', panel: '#FFFFFF', 'soft-primary': '#FFE8DD' }, borderRadius: { app: '16px' } } },
  plugins: []
};
