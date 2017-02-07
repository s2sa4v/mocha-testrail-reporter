/*
 status_id	int	The ID of the test status. The built-in system statuses have the following IDs:
 1	Passed
 2	Blocked
 3	Untested (not allowed when adding a result)
 4	Retest
 5	Failed
 You can get a full list of system and custom statuses via get_statuses.
 */
const mapMocha2TestRailStatuses = {
  'failed': 5,
  'passed': 1,
  'skipped': 3,
};

const TESTRAIL_TESTRUN_ID = 'TESTRAIL_TESTRUN_ID';

module.exports.conf = function (config, options) {
  let result = (options && options.reporterOptions.testRail) || {};

  result = Object.assign({}, config, { mapMocha2TestRailStatuses: mapMocha2TestRailStatuses });
  result = Object.assign({}, config, { runId: getRunIdFromEnv() });

  return result;
};

function getRunIdFromEnv() {
  process.env[TESTRAIL_TESTRUN_ID] || 0;
}
