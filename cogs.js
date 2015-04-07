module.exports = {
  in: {
    es6: {
      out: 'js',
      transformers: {
        name: 'babel',
        options: {modules: 'ignore', blacklist: ['useStrict']}
      }
    }
  },
  builds: {'formatted-text.es6': '.'}
};
