module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        '1/25': '4%',
        '2/25': '8%',
        '3/25': '12%',
        '4/25': '16%',
        '5/25': '20%',
        '6/25': '24%',
        '7/25': '28%',
        '8/25': '32%',
        '9/25': '36%',
        '10/25': '40%',
        '11/25': '44%',
        '12/25': '48%',
        '13/25': '52%',
        '14/25': '56%',
        '15/25': '60%',
        '16/25': '64%',
        '17/25': '68%',
        '18/25': '72%',
        '19/25': '76%',
        '20/25': '80%',
        '21/25': '84%',
        '22/25': '88%',
        '23/25': '92%',
        '24/25': '96%',
        '25/25': '100%'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
