/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: { extend: { colors: { cream: '#F7F1E5', ink: '#24211F', muted: '#746D65', rooster: '#B4232F', 'rooster-dark': '#8E1823', yolk: '#E6A523', line: '#DED5C6', night: '#171513', panel: '#FFFCF7' }, borderRadius: { app: '18px' } } },
  plugins: []
};
