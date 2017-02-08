const postRequest = require('./utils').postRequest;

module.exports.addResultsForCases = function addResultsForCases(results, options) {
  const url = `https://${options.user}:${options.pass}@webapp20.testrail.net/index.php?/api/v2/add_results_for_cases/${options.runId}`;
  const data = { results: results };

  return postRequest(url, data);
};
