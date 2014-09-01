#!/usr/bin/env python
from mooch import app

@app.route("/")
def index():
    return """
    <html>
      <body>
        <h1>Mooch Sentinel"</h1>
        <a href="/signup">Sign up</a>
      </body>
    </html>
    """
