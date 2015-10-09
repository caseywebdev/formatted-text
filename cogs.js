module.exports = {
  in: {
    es6: {
      out: 'js',
      transformers: {name: 'babel', options: {modules: 'umd', stage: 0}}
    }
  },
  builds: {'formatted-text.es6': '.'}
};
