# https://github.com/ilkerkesen/tornado-websocket-client-example
# https://www.georgeho.org/tornado-websockets/
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# coding=utf-8

from tornado.ioloop import IOLoop, PeriodicCallback
from tornado import gen
from tornado.websocket import websocket_connect
from sonar import *
import time
import datetime
import os, sys, signal
sys.path.append(os.getenv('PEPPER_TOOLS_HOME')+'/cmd_server')
import pepper_cmd
from pepper_cmd import *

class Client(object):
    def __init__(self, url, timeout):
        self.url = url
        self.timeout = timeout
        self.ioloop = IOLoop.instance()
        self.ws = None
        self.connect()
        PeriodicCallback(self.keep_alive, 20000).start()
        self.ioloop.start()

    @gen.coroutine
    def connect(self):
        print "trying to connect"
        try:
            self.ws = yield websocket_connect(self.url)
        except Exception, e:
            print "connection error"
        else:
            print "connected"
            self.run()

    @gen.coroutine
    def run(self):
        while True:
            data = yield self.ws.read_message()
            received = data.split("_");
            if(received[0]=="RuleViolation"):
                print("%s!!RuleViolation!!%s" %(RED,RESET))
                pepper_cmd.robot.say('You violated the game rules. Try again.')
            elif(received[0]=="EmptyRod"):
                print("%s!!EmptyRod!!%s" %(RED,RESET))
                pepper_cmd.robot.say('You chose an empty rod. Try again.')        
            elif(received[0]=="ActionDone"):
                print("%s!!ActionDone!!%s" %(GREEN,RESET))
                pepper_cmd.robot.say('Now it\'s your turn.')
            elif(received[0]=="Victory"):
                print("%s!!Victory!!%s" %(GREEN,RESET))
                pepper_cmd.robot.say('Victory')
            else:
                print("%s!!uNKNOWN ERROR!!%s" %(RED,RESET))

    def keep_alive(self):
        if self.ws is None:
            self.connect()
        #else:
            #self.ws.write_message("keep alive")
            

'''
["HeadYaw", "HeadPitch", "LShoulderPitch", "LShoulderRoll", "LElbowYaw", "LElbowRoll", "LWristYaw",
"RShoulderPitch", "RShoulderRoll", "RElbowYaw", "RElbowRoll", "RWristYaw", 
"LHand", "RHand", "HipRoll", "HipPitch", "KneePitch"] 
jointValues = [0.00, -0.21, 1.55, 0.13, -1.24, -0.52, 0.01, 
               1.56, -0.14, 1.22, 0.52, -0.01, 0, 0, 0, 0, 0]
               '''
def doHello():
        #jointNames = ["RShoulderPitch", "RShoulderRoll", "RElbowRoll", "RWristYaw", "RHand", "HipRoll", "HeadPitch"]
        #angles = [-0.141, -0.46, 0.892, -0.8, 0.98, -0.07, -0.07]
        #times  = [2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0]
        #isAbsolute = True
        #self.ALMotion.angleInterpolation(jointNames, angles, times, isAbsolute)
        angles = [0.00, -0.07, 1.55, 0.13, -1.24, -0.52, 0.01, -0.141, -0.46, 1.22, 0.892, -0.8, 0, 0.98, -0.07, 0, 0]
        pepper_cmd.robot.setPosture(angles)

        for i in range(2):
            #jointNames = ["RElbowYaw", "HipRoll", "HeadPitch"]
            #angles = [1.7, -0.07, -0.07]
            #times  = [0.8, 0.8, 0.8]
            #isAbsolute = True
            #self.ALMotion.angleInterpolation(jointNames, angles, times, isAbsolute)
            angles[9] = 1.7 #RElbowYaw
            pepper_cmd.robot.setPosture(angles)

            #jointNames = ["RElbowYaw", "HipRoll", "HeadPitch"]
            #angles = [1.3, -0.07, -0.07]
            #times  = [0.8, 0.8, 0.8]
            #isAbsolute = True
            #self.ALMotion.angleInterpolation(jointNames, angles, times, isAbsolute)
            angles[9] = 1.3 #RElbowYaw
            pepper_cmd.robot.setPosture(angles)

        return



if __name__ == "__main__":
    begin()
    
    # Sonar Activation
    pepper_cmd.robot.startSensorMonitor()
    
    stop_flag = True
    try:
		while stop_flag:
			p = pepper_cmd.robot.sensorvalue()
			if(p[1]!=None and p[1]<3):
				print("I have located the user")
				stop_flag=False
			elif p[1]==None:
				print("I don't locate any users near me")
				#Mi fermo 3 secondi prima di controllare se c'e' un'altra persona
				time.sleep(3)
			else:
				print("I have located the user, but it is not close enough")
				# Mi fermo 3 secondi prima di controllare se c'e' un'altra persona
				time.sleep(3)
    except KeyboardInterrupt:
        pass 

	if(stop_flag):
		print("\n\nDetected KeyboardInterrupt. Exit\n")
		try:
			sys.exit(0)
		except SystemExit:
			os._exit(0)
	
	
    pepper_cmd.robot.stopSensorMonitor()
    pepper_cmd.robot.say('Hello! Do you want to play?')
    doHello()
    
    IPAddr="127.0.0.1:9030"
    client = Client("ws://"+IPAddr+"/websocketserver", 5)

#python write.py --key Device/SubDeviceList/Platform/Front/Sonar/Sensor/Value --val 2
