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

@app.route("/status/<string:user>")
def status(user):
    status = engine.user_status(user)

    return jsonify(status)

if __name__ == '__main__':
    db = get_db()
    init_db(db)

    global engine
    engine = Engine(db)
    engine.start()

    app.run(debug=True, host='0.0.0.0', port=5000)
