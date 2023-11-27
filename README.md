# Artemix Frontend

## Setup:

- About environment:
  - If `npm` not works, could try `yarn install` and `yarn run ios`.
  - If meet the error related with `CocoaPods` dependencies could try to run `pod install` in the `ios` directory to manually install.
- Here is a sample code for connection:
  ```
  fetch('http://192.168.1.5:4000/api/', {
    method: 'GET',
  })
  .then(response => console.log(response.json()))
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
  ```
- Make sure you run the backend code or there would be connection error
- Try npm install react-native-elements if not already installed or if any errors occur(Kongmeng)

## Developing in a simulator:

- Install the React Native CLI: `npm install -g react-native-cli`
- Open Xcode and open a simulator
- Run `npx react-native run-ios`
- If cocoapods fails, `brew install cocoapods` in the root directory, then `cd` into `ios` and `pod install`
