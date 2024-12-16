module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js", // Include Flowbite's classes
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
