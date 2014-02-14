# WikiMap

An iOS app for viewing Wikipedia as a Mind Map.

## Using Grunt

Grunt is a JavaScript task-runner that makes development on the WikiMap app easier.

To get grunt up and running, you'll need to first have node.js installed.  (See http://nodejs.org/.) 

Then, navigate to the WikiMap root directory and type "npm install".  This will install all the appropriate plugins.

Finally, type "npm install -g grunt-cli" and you'll get the grunt command-line interface.

When you're developing, start "grunt watch" going in a command window, and it will automatically compile Compass/SASS and HAML changes, lint the JS code, and perform a number of other automated tassk.

If you'd like to automatically reload the app in your browser whenever its code changes, you'll want to install the "LiveReload" plugin for your browser, and serve the application off of a server on your machine.  (For Windows, I recommend mongoose.exe.)


## Build Process
This project uses the Intel XDK.

- install the Intel XDK from http://xdk-software.intel.com/
- from there, you should be able to load the app on emulators and deploy it to devices.