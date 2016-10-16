module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks:  ['browserify', 'jasmine'],
    files: [
      {pattern: 'test/**/*.spec.js', watched: true, included: true, served: true},
    ],
    preprocessors: {
      'src/**/*.js': ['browserify'],
      'test/**/*.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: ['babelify']
    },
    exclude: [],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
