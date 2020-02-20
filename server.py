from flask import Flask
import subprocess
import serial

app = Flask(__name__)

#This path may differ by machine
ser = serial.Serial('/dev/cu.usbserial-1410')
ser.flushInput()

@app.route('/release_odor_high')
def release_odor_high():
    #3 second release
    ser.write(b'h')
    return "success"

@app.route('/release_odor_low')
def release_odor_low():
    #1 second release
    ser.write(b'l')
    return "success"
