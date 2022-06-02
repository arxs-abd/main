module.exports = {
  content: [
    'views/*.ejs',
    'views/partials/*.ejs',
    './node_modules/tw-elements/dist/js/**/*.js',
    // "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    fontFamily: {
      display: ['Inter', 'system-ui', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
    },
    container: {
      center: true,
      padding: '32px',
    },
    extend: {
      colors: {
        primary: '#4f46e5',
        secondary: '#64748b',
        dark: '#0f172a',
      },
      screens: {
        '2xl': '1320px',
      },
    },
  },
  plugins: [
    // require('@flowbite/plugin')
    require('tw-elements/dist/plugin')
  ],
};
