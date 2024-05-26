/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  useTabs: false,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "none",
  parser: "flow",
  arrowParens: "avoid",
  bracketSpacing: true,
  singleAttributePerLine: true,
  jsxSingleQuote: false,
};

export default config;
