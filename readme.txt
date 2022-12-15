-- Assignment 5 --
A three.js project built for visualizing how structures can affect light levels in a park. 

-- Running the program --
Open the project folder in a terminal and run the following commands:
```bash
npm install
npm run dev
```
If the browser window doesn't open automatically, the server should be running at http://127.0.0.1:8080

-- Controls --
Left click and hold: Rotate camera
Middle mouse and hold: zoom in/zoom out
Right click and hold: Pan camera

When object is selected: 
Delete: Delete selected object
R: Change between rotate and translate gizmo
SHIFT: Snap objects during movement

When gizmo is clicked: 
Drag: move or rotate object


-- UI Elements --
-LEFT SIDE-
Sun position E -> W slider: Changes the sun position in the sky. By default the camera is looking towards north.
Shape dropdown and button: Changes which shape will be added. Click add object to add the selected shape
FOV slider: Change the field of view of the user camera

-RIGHT SIDE-
Calculate shadow heatmap: Calculates the shadow values for a day in the park
# Samples for sun position: Determines the quality of the heatmap. Can become performance heavy. Around 50-100 samples is accurate without sacrificing too much performance
