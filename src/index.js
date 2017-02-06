const mocha = require('mocha');
const config = require('./config');
const utils = require('./utils');
const testrail = require('./testrail');

module.exports = TestRailReporter;

function done(config, results, failures) {
  try {
    console.log('--done');
    console.log('--- config', config);
    console.log('--- results', results);

    testrail.addResultsForCases(results, config);

    console.log('--- Report has been sent to TestRail');
    process.exit(failures);
  } catch (e) {
    console.error(`There is something wrong with mocha-testrail-reporter: ${e.stack}`);
  }
}

function TestRailReporter(runner, options) {
  this.done = (failures, exit) => done(this.config, this.results, failures, exit);

  const allTests = [];

  mocha.reporters.Base.call(this, runner);
  new mocha.reporters.Spec(runner);

  this.config = (options && options.reporterOptions.testRail) || {};
  this.config = Object.assign({}, this.config, { mapMocha2TestRailStatuses: config.mapMocha2TestRailStatuses });
  this.config = Object.assign({}, this.config, { runId: process.env[config.TESTRAIL_TESTRUN_ID] || 0 });

  runner.on('test end', (test) => allTests.push(test));
  runner.on('end', () => {
    if (allTests.length < 1) {
      process.exit();
    }
    this.results = utils.prepareResults(allTests, this.config);
  });
}


