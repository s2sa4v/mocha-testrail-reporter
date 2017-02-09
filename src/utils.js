const request = require('sync-request');

/*
 status_id	int	The ID of the test status. The built-in system statuses have the following IDs:
 1	Passed
 2	Blocked
 3	Untested (not allowed when adding a result)
 4	Retest
 5	Failed
 You can get a full list of system and custom statuses via get_statuses.
 */
const mapMochaStatuses2Testrail = {
  'failed': 5,
  'passed': 1,
  'skipped': 3,
};
const SCENARIO_2_CASE_KEY = 'mapScenario2Case';
const RUN_ID_KEY = 'runId';
const TESTRAIL_TESTRUN_ID = 'TESTRAIL_TESTRUN_ID';
const OPTIONS_KEY = 'testRail';

module.exports.postRequest = function postRequest(url, json) {
  return request('POST', url, { json: json });
};

module.exports.prepareResults = function prepareResults(testResults, config) {
  return testResults
    .filter(test => canBeConverted(test, config))
    .map(test => createTestRailResult(test, config));
};

function canBeConverted(test, config) {
  return config[SCENARIO_2_CASE_KEY] && config[SCENARIO_2_CASE_KEY].hasOwnProperty(test.title)
}

function createTestRailResult(test, config) {
  return Object.assign({}, {
    status_id: (config.mapMochaStatuses2Testrail[test.state] || config.mapMochaStatuses2Testrail['skipped']),
    elapsed: test.duration / 1000 + "s",
    case_id: config[SCENARIO_2_CASE_KEY][test.title],
  });
}

module.exports.conf = function (config, options) {
  return Object.assign(
    {},
    config,
    getStatusesData(),
    getTestRailOptions(options),
    getRunIdData(options)
  );
};

function getStatusesData() {
  return { mapMochaStatuses2Testrail };
}

function getTestRailOptions(options) {
  return (options && options.reporterOptions && options.reporterOptions[OPTIONS_KEY]) || {};
}

function getRunIdData(options) {
  return { [RUN_ID_KEY]: getRunIdFromEnv() || getRunIdFromOptions(options) }
}

function getRunIdFromEnv() {
  return process.env[TESTRAIL_TESTRUN_ID] || 0;
}

function getRunIdFromOptions(options) {
  return getTestRailOptions(options)[RUN_ID_KEY] || 0;
}