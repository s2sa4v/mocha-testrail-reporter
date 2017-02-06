const mocha = require('mocha');
const config = require('./config');
const request = require('sync-request');

module.exports = TestRailReporter;

function done(config, results, failures) {
  try {
    console.log('--done');
    console.log('--- config', config);
    console.log('--- results', results);

    addResultsForCases(results, config);

    console.log('--- Report has been sent to TestRail');
    process.exit(failures);
  } catch (e) {
    console.error(`There is something wrong with mocha-testrail-reporter: ${e.stack}`);
  }
}

function addResultsForCases(results, config) {
  const url = `https://${config.user}:${config.pass}@webapp20.testrail.net/index.php?/api/v2/add_results_for_cases/${config.runId}`;

  return postRequest(url, results);
}

function postRequest(url, data) {
  return request('POST', url, {
    json: { results: data },
  });
}

function TestRailReporter(runner, options) {
  this.done = (failures, exit) => done(this.config, this.results, failures, exit);

  const allTests = [];

  mocha.reporters.Base.call(this, runner);
  new mocha.reporters.Spec(runner); // eslint-disable-line

  this.config = (options && options.reporterOptions.testRail) || {};
  this.config = Object.assign({}, this.config, { mapMocha2TestRailStatuses: config.mapMocha2TestRailStatuses });
  this.config = Object.assign({}, this.config, { runId: process.env[config.TESTRAIL_TESTRUN_ID] || 0 });

  runner.on('test end', (test) => allTests.push(test));
  runner.on('end', () => {
    if (allTests.length < 1) {
      process.exit();
    }
    this.results = prepareResults(allTests, this.config);
  });
}

function prepareResults(testResults, config) {
  return testResults
    .filter(test => config.mapScenario2Case.hasOwnProperty(test.title))
    .map(test => {
      return Object.assign({}, {
        status_id: config.mapMocha2TestRailStatuses[test.state],
        elapsed: test.duration * 1000 + "s",
        case_id: config.mapScenario2Case[test.title],
      });
    });
}
