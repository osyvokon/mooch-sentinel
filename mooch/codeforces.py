# encoding: utf-8
import requests
from BeautifulSoup import BeautifulSoup

def download_and_parse(user_id):
    """Return parsed results for `user_id`. """

    html = requests.get("http://codeforces.ru/submissions/%s" % user_id)
    return parse(html.content)

def parse(html):
    """Parse codeforces.ru submissions page and return list of structures::

        {
            "id": unicode,  # unique ID of submission
            "date": unicode,
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
            "date": date,
            "okay": okay})

    return submissions



if __name__ == '__main__':
    pass
