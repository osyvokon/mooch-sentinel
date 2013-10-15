import unittest
import json
import os
from mooch.app import app

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "fixtures")


class MoochTest(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def get_json(self, path, **params):
        response = self.app.get(path, query_string=params)
        self.assertEqual(response.status_code, 200,
                "Server unexpectedly returned %s.  Response: \n\n%s" %
                (response.status_code, response.data))
        try:
            return json.loads(response.data)
        except ValueError:
            self.fail(u"`%s` returned malfored JSON!\n%s" %
                    (path, response.data[:200]))

    def post_json(self, path, data, **params):
        data = json.dumps(data)
        headers = [('Content-Type', 'application/json')]
        return self.app.post(path, data=data, headers=headers)


class Test_GithubHook(MoochTest):

    def test_should_store_last_commit_time(self):

        # When issuing Github POST request
        payload = json.load(open(os.path.join(FIXTURES_DIR, "github-hook.json")))
        self.post_json("/hooks/github", payload)

        # Then last commit time should be updated
        status = self.get_json("/status")
        self.assertEqual(status['GitHub']['lastCommitTime'],
                        "2013-03-12T08:14:29-07:00")
    
    def test_should_have_null_last_commit_time_before_first_hook_issued(self):

        # Given no Github POST requests done yet
        pass

        # When requesting server status
        status = self.get_json("/status")

        # Then last commit time should be null
        self.assertIsNone(status.get("GitHub", {}).get("lastCommitTime"))


if __name__ == '__main__':
    unittest.main()
