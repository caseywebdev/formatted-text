module.exports = {
  main: {
    transformers: {
      name: 'babel',
      only: 'formatted-text.es6',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: [
          '@babel/plugin-proposal-class-properties',
          [
            '@babel/plugin-transform-modules-umd',
            {
              globals: {
                react: 'React',
                'prop-types': 'PropTypes',
                'react-dom': 'ReactDOM',
                'formatted-text': 'FormattedText'
              },
              moduleId: 'formatted-text',
              exactGlobals: true
            }
          ]
        ]
      }
    },
    builds: {
      'formatted-text.es6': { ext: { '.es6': '.js' } }
    }
  }
};
