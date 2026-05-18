/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",    // для Next.js App Router
    "./pages/**/*.{js,ts,jsx,tsx}",  // для Next.js Pages Router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}