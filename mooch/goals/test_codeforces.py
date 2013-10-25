#!/usr/bin/env python
import os
import unittest
import datetime
from mooch.goals import codeforces

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "fixtures")

class Test_codeforces(unittest.TestCase):

    def test_should_extract_submission_date_and_result_from_html(self):

        # Given codeforces.ru status page
        html = open(os.path.join(FIXTURES_DIR, 'codeforces.html')).read()

        # When parsing it
        submissions = codeforces.parse(html)

        # Then list of submission dates and results should be returned
        self.assertTrue(submissions)
        self.assertEqual(submissions[0]['id'], "4799956")
        self.assertEqual(submissions[0]['date'],
                         datetime.datetime(2013, 10, 16, 00, 01, 38))
        self.assertEqual(submissions[0]['okay'], False)

if __name__ == '__main__':
    unittest.main()
