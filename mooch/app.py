import sqlite3
from flask import Flask, jsonify, request, render_template
import pymongo
from mooch.engine import Engine

app = Flask(__name__)


def init_db(db):
    pass

def get_db():
    return pymongo.MongoClient("localhost:27017").mooch

@app.route("/")
def index():
    return render_template("index.html")

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
    db = get_db()
    init_db(db)

    engine = Engine(db)
    engine.start()

    app.run(debug=True, host='0.0.0.0', port=5000)
