#!/usr/bin/python
import RPi.GPIO as GPIO                           #Import GPIO library
from time import sleep

GPIO.setmode(GPIO.BCM)  # set up BCM GPIO numbering

# Pin 21 (BCM), Set as input, set up built in pull down resistor, motion
# sensor activates by pin being pulled high, so we will know to pull intial state to down.
GPIO.setup(21, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

def motionSensor(channel):
    if GPIO.input(21):
        global counter
        counter += 1
        print "Motion Detected: {}".format(counter)

GPIO.add_event_detect(21, GPIO.BOTH, callback=motionSensor, bouncetime=150)
counter=0

try:
    while True:
        sleep(1)        # sleep 1 second
finally:
    GPIO.cleanup()
    print "GPIO Cleaned up. Exiting"
