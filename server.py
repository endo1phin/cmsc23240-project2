from flask import Flask
import subprocess

app = Flask(__name__)


@app.route('/release_odor')
def release_odor():
    # python code goes here
    return "success"
