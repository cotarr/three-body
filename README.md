# three-body

Simple gravity simulation using javascript to plot the motion of three objects on the web browser canvas.

## Description

This is a very simplistic simulation that will calculate the motion of three objects in space
based on the attractive force of gravity between the objects. This is analogous to 
the sun, the earth, and the moon, three objects in motion.

## Motivation

Some friends were discussing a science fiction book involving 
orbital calculations of a system of three objects. The concept seemed like an 
entertaining way to spend an evening of coding, just for fun.

## Physics calculations

The calculation involves advancing the simulation in small steps of time (dt).
At each time interval, a new position, velocity vector and acceleration vector 
are calculated based on the positions of all three objects.
A JavaScript `setInterval()` timer fires 100 timer events per second.
A `for` loop is used to calculate 100 time intervals per timer event. 
The calculation time interval (dt) is configured to 10 seconds. 
Combined, this provides a real time motion display with 
approximately 100000:1 time acceleration. At the end of each 
for loop, a single pixel is drawn on the canvas for each of three objects.

To simplify the calculation, the position of each object has been 
constrained into a two dimensional X, Y space with the Z coordinate 
set to zero. This is similar to our solar system with the orbits of 
the sun and planets being roughly in planar.

## How to run

The simulation includes a simple HTML file that loads a JavaScript module 
to draw X,Y coordinate points in the browser using the canvas API.
The best way to view the simulation is using VSCode and a web browser.
This was written using the Chrome web browser.

- Clone repository
- Open repository is VSCode.
- Select the `index.html` file and open with the "Live Server" VSCode extension.
- Buttons at the bottom of the web page will select various preset values.

The simulation may be paused by clicking anywhere on the browser canvas element.
Each time the simulation is paused, the coordinates of all 3 objects
are printed in the browser console. A timer will auto-pause the simulation
after 60 seconds to avoid unnecessary CPU usage.
