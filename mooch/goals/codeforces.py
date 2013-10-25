# encoding: utf-8
import datetime
import requests
from BeautifulSoup import BeautifulSoup

class Codeforces(object):
    goal_id = "codeforces"
    description = "Solve codeforces.ru programming challenge. "

    def __init__(self, codeforces_login):
        self.login = codeforces_login

    @staticmethod
    def from_dict(cfg):
        login = cfg.get("codeforcesLogin")
        if not login:
            raise ValueError("`codeforcesLogin` is a mandatory field")
        return Codeforces(login)

    def to_dict(self):
        return {
                "goal": self.goal_id,
                "description": "Solve at least 1 codeforces.ru challenge per day",
                "codeforcesLogin": self.login,
            }

    def check_achievements(self):
        attempts = download_and_parse(self.login)
        success_dates = {x['date'] for x in attempts if x['okay']}
        return [{"date": dt} for dt in success_dates]

def download_and_parse(user_id):
    """Return parsed results for `user_id`. """

    html = requests.get("http://codeforces.ru/submissions/%s" % user_id)
    return parse(html.content)

def parse(html):
    """Parse codeforces.ru submissions page and return list of structures::

        {
            "id": unicode,  # unique ID of submission
            "date": datetime.datetime,
            "okay": bool
        }

    """

    page = BeautifulSoup(html)
    rows = page.find("table", "status-frame-datatable").findAll("tr")[1:]
    submissions = []

    for row in rows:
        submission_id = dict(row.attrs)['data-submission-id']
        date = row.findAll("td")[1].contents[0].strip()
        verdict = row.find("td", "status-verdict-cell").find("span")
        okay = dict(verdict.attrs)['class'] == 'verdict-accepted'

        submissions.append({
            "id": submission_id,
            "date": datetime.datetime.strptime(date, "%d.%m.%Y %H:%M:%S"),
            "okay": okay})

    return submissions



if __name__ == '__main__':
    pass
