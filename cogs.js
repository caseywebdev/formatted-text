module.exports = {
  in: {
    es6: {
      out: 'js',
      transformers: {name: 'babel', options: {modules: 'umd'}}
    }
  },
  builds: {'formatted-text.es6': '.'}
};
