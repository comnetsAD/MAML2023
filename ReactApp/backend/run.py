

from api import app, db
import pymysql


@app.shell_context_processor
def make_shell_context():
    return {"app": app,
            "db": db
            }


if __name__ == '__main__':
    app.run(debug=True, host="10.224.41.106", port=8080)
