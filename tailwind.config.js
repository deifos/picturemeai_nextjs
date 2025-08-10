// tailwind.config.js
const { heroui } = require('@heroui/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/@heroui/theme/dist/components/(accordion|avatar|button|card|chip|code|dropdown|form|input|kbd|link|listbox|modal|navbar|select|snippet|spinner|toggle|divider|ripple|menu|popover|scroll-shadow).js',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [heroui()],
};
