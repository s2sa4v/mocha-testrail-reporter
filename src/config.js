
/*
 status_id	int	The ID of the test status. The built-in system statuses have the following IDs:
 1	Passed
 2	Blocked
 3	Untested (not allowed when adding a result)
 4	Retest
 5	Failed
 You can get a full list of system and custom statuses via get_statuses.
 */
module.exports.mapMocha2TestRailStatuses = {
  'failed': 5,
  'passed': 1,
  'skipped': 3,
};

module.exports.TESTRAIL_TESTRUN_ID = 'TESTRAIL_TESTRUN_ID';

