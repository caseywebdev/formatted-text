module.exports = {
  in: {
    es6: {
      out: 'js',
      transformers: {
        name: 'babel',
        options: {modules: 'umd', optional: ['es7.classProperties']}
      }
    }
  },
  builds: {'formatted-text.es6': '.'}
};
