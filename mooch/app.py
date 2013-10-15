import sqlite3
from flask import Flask, jsonify, request
app = Flask(__name__)


def init_db(db):

    db.execute("""
        CREATE TABLE if not exists events (
            id INTEGER PRIMARY KEY,
            eventType TEXT,
            eventTime datetime,
            data BLOB,
            insertTime datetime default current_timestamp);
        """)

    # FIXME: not exists


def get_db():
    return sqlite3.connect("/tmp/mooch.sqlite", isolation_level=None)

@app.route("/status")
def status():
    status = {}
    c = get_db().cursor()

    # GitHub
    c.execute(""" select max(eventTime) from events
                  where eventType = 'github'  """)
    last_github_ts = c.fetchone()[0]
    if last_github_ts is not None:
        status['GitHub'] = {"lastCommitTime": last_github_ts}

    return jsonify(status)

@app.route("/hooks/github", methods=["POST"])
def github_hook():
    #import pdb; pdb.set_trace()
    last_ts = max(commit['timestamp'] for commit in request.json['commits'])
    get_db().execute("INSERT INTO events (eventType, eventTime) VALUES (?, ?)",
                     ("github", last_ts))


if __name__ == '__main__':
    init_db(get_db())
    app.run(debug=True, host='0.0.0.0', port=5000)
