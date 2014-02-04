# WikiMap

An iOS app for viewing Wikipedia as a Mind Map.

### Build Process
- install [npm](https://npmjs.org/) if you haven't already
- install PhoneGap globally by running

`npm install -g phonegap`

- cd into the _/platforms_ subdirectory from the root folder of the project
- build the app by running

`phonegap build ios`

- will probably throw an error saying that you need to install ios-sim 

`npm install -g ios-sim`

- once that has succeeded, run (I _think_ from the root folder)

`phonegap install ios`

- should then open in ios simulator