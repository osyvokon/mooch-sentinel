import sqlite3
from flask import Flask, jsonify
app = Flask(__name__)


def get_db():
    return sqlite3.connect(":memory:")

@app.route("/status")
def status():
    return jsonify({"okay": True,
                    "GitHub": {"lastCommitTime": "2013-03-12T08:14:29-07:00"}})

@app.route("/hooks/github", methods=["POST"])
def github_hook():
    pass

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
