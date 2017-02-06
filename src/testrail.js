const postRequest = require('./utils').postRequest;

module.exports.addResultsForCases = function addResultsForCases(results, config) {
  const url = `https://${config.user}:${config.pass}@webapp20.testrail.net/index.php?/api/v2/add_results_for_cases/${config.runId}`;
  const data = { results: results };
  return postRequest(url, data);
};
