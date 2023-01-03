
from flask import Flask,redirect,url_for,render_template,request

import numpy as np
import csv
import pandas as pd
import serial
import time
from flask_socketio import SocketIO 
from threading import Lock
from datetime import datetime

thread = None
thread_lock = Lock()

app=Flask(__name__)

socketio = SocketIO(app, cors_allowed_origins='*')


def get_current_datetime():
    now = datetime.now()
    return now.strftime("%m/%d/%Y %H:%M:%S")

# Reading and calculating the 1st signal data

arrSignal1 = pd.read_csv("static/Signals/ECG_Signal.csv", encoding = 'utf-8').values.flatten()[0:4000]

# Calculation duration
timeSignal1,magnitudeSignal1=arrSignal1[::2],arrSignal1[1::2]

durationSignal1=(max(timeSignal1))

# Calculating frequency
fft1=np.fft.fft(magnitudeSignal1)
freq=np.fft.fftfreq(len(fft1))

maxFrequency=max(freq)

# Calculating the max amplitude
maxAmplitude=max(magnitudeSignal1)

# calculate magnitude
magnitude=max(np.abs(fft1))

# calculate phase
phase=max(np.angle(fft1))

Signal1Array=[float(f'{durationSignal1:.3f}'),float(f'{maxFrequency:.3f}'),
float(f'{maxAmplitude:.3f}'),float(f'{magnitude:.3f}'),float(f'{phase:.3f}')]

# Reading and calculating the 2nd signal data

arrSignal2 = pd.read_csv("static/Signals/Pulse_Oximeter_Signal.csv", encoding = 'utf-8').values.flatten()[0:5000]

# Calculation duration
timeSignal2,magnitudeSignal2=arrSignal2[::2],arrSignal2[1::2]

durationSignal2=(max(timeSignal2))

# Calculating frequency
fft2=np.fft.fft(magnitudeSignal2)
freq=np.fft.fftfreq(len(fft2))

maxFrequency=max(freq)

# Calculating the max amplitude
maxAmplitude=max(magnitudeSignal2)

# calculate magnitude
magnitude=max(np.abs(fft2))

# calculate phase
phase=max(np.angle(fft2))

Signal2Array=[float(f'{durationSignal2:.3f}'),float(f'{maxFrequency:.3f}'),
float(f'{maxAmplitude:.3f}'),float(f'{magnitude:.3f}'),float(f'{phase:.3f}')]

# ser=serial.Serial('COM8',9600,timeout=1)
# time.sleep(1)


def background_thread():
    while True:
        # line=ser.readline().decode("utf-8")
        # print(line)
        socketio.emit('updateSensorData', {'value': 1 , "date": get_current_datetime()})
        socketio.sleep(1)


@app.route('/')
def home():
  return render_template("index.html",FirstSignalArray=Signal1Array,SecondSignalArray=Signal2Array)


@socketio.on('connect')
def connect():
    global thread
    print('Client connected')

    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)


@socketio.on('disconnect')
def disconnect():
    print('Client disconnected',  request.sid)


if __name__=="__main__":
  app.run()