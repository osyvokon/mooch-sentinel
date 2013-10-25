#!/usr/bin/env python
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


if __name__ == '__main__':
    unittest.main()
