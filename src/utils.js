const request = require('sync-request');

module.exports.postRequest = function postRequest(url, json) {
  return request('POST', url, { json: json });
};

module.exports.prepareResults = function prepareResults(testResults, config) {
  return testResults
    .filter(test => canBeConverted(test, config))
    .map(test => createTestRailResult(test, config));
};

function canBeConverted(test, config) {
  return config.mapScenario2Case && config.mapScenario2Case.hasOwnProperty(test.title)
}

function createTestRailResult(test, config) {
  return Object.assign({}, {
    status_id: (config.mapMocha2TestRailStatuses[test.state] || config.mapMocha2TestRailStatuses['skipped']),
    elapsed: test.duration / 1000 + "s",
    case_id: config.mapScenario2Case[test.title],
  });
}
