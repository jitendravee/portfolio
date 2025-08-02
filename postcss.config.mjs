const config = {
   darkMode: 'class',
  plugins: ["@tailwindcss/postcss"],
  theme: {
    extend: {
      screens: {
        m: '992px', // Custom breakpoint
      },
       colors: {
        text_primary: 'var(--text-primary)',
        text_secondary: 'var(--text-secondary)',
        accent: 'var(--accent)',
        'accent-opacity': 'var(--accent-opacity)',
        bg_color: 'var(--bg-color)',
        elevation_one: 'var(--elevation-one)',
        elevation_two: 'var(--elevation-two)',
        elevation_three: 'var(--elevation-three)',
        elevation_four: 'var(--elevation-four)',
        elevation_five: 'var(--elevation-five)',
        elevation_six: 'var(--elevation-six)',
      },
    },
  },

};

export default config;
