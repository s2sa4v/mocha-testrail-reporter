import expect from 'expect';
import * as utils from '../../src/utils';

describe('src/utils', () => {
  describe('#.conf', () => {
    it('should return valid config', () => {
      const config = {
        user: 'user@domain.com',
        pass: 'cccsssddd',
        mapScenario2Case: {
          'User logs in with valid credentials': 1,
          'User logs with invalid credentials': 2,
          'User logs with empty fields': 5
        },
        runId: '1'
      };
      const test = { test: 'test' };
      const options = {
        reporterOptions: {
          testRail: config,
        }
      };
      const exp = {
        "mapMochaStatuses2Testrail": {
          "failed": 5,
          "passed": 1,
          "skipped": 3,
        },
        "mapScenario2Case": {
          "User logs in with valid credentials": 1,
          "User logs with empty fields": 5,
          "User logs with invalid credentials": 2,
        },
        "runId": '1',
        "user": "user@domain.com",
        "pass": "cccsssddd",
      };

      expect(utils.conf(config, options)).toEqual(exp);
    });

    describe('runId parameter', () => {
      it('should be possible to port `runId` from system environment', () => {
        const config = {};
        const runId = "32";
        const options = {
          reporterOptions: {
            testRail: config,
          }
        };
        process.env['TESTRAIL_TESTRUN_ID'] = runId;

        let conf = utils.conf(config, options);

        expect(conf.runId).toEqual(runId);
      });

      it('should overwrite config data with system environment', () => {
        const runId = "32";
        const config = {
          runId: 4,
        };
        const options = {
          reporterOptions: {
            testRail: config,
          }
        };
        process.env['TESTRAIL_TESTRUN_ID'] = runId;

        expect(utils.conf(config, options).runId).toEqual(runId);
      });
    });

    it('should return object event when `conf` is undefined', () => {
      expect(utils.conf(undefined, {})).toBeA('object');
    });

    it('should return object even when `conf` is null', () => {
      expect(utils.conf(null, {})).toBeA('object');
    });

    it('should return object event when `options` is undefined', () => {
      expect(utils.conf(undefined, undefined)).toBeA('object');
    });

    it('should return object even when `options` is null', () => {
      expect(utils.conf(undefined, null)).toBeA('object');
    });
  });

  describe('#.prepareResults', () => {
    it('should convert results data to testrail fields', () => {
      const status = "5";
      const caseId = "32";
      const config = {
        mapScenario2Case: { 'test tset': caseId },
        mapMochaStatuses2Testrail: { failed: status },
      };
      const testResults = [
        {
          title: 'test tset',
          duration: '1000',
          state: 'failed',
          other: 'other',
        }
      ];
      const exp = [{ status_id: status, elapsed: "1s", case_id: caseId }];

      expect(utils.prepareResults(testResults, config)).toEqual(exp);
    });
  });
});
