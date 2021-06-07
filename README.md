## IC Drive

![Compatibility](https://img.shields.io/badge/compatibility-0.7.0-blue)

IC Drive is a storage application built on the internet computer, which offers the users a decentralized alternate to the current web2 storage services like dropbox, google drive, etc. <br>

**Current State of the application ->**
- UI is on ReactJS
- Backend is in motoko
- User can upload an image on the react frontend that is stored in the canister. The uploaded image is then served on the frontend via the canister call from frontend.

![alt text](https://github.com/IC-Drive/ic-drive/blob/master/res/images/dashboard.png?raw=true)

## Prerequisites

Verify the following before running this demo:

*  You have downloaded and installed [Node.js](https://nodejs.org).

*  You have downloaded and installed the [DFINITY Canister
   SDK](https://sdk.dfinity.org).

*  You have stopped any Internet Computer or other network process that would
   create a port conflict on 8000.

## Demo

1. Start a local internet computer.

   ```text
   dfx start
   ```

1. Open a new terminal window.

1. Reserve an identifier for your canister.

   ```text
   dfx canister create --all
   ```

1. Build your front-end.

   ```text
   npm install
   ```

1. Build your canister.

   ```text
   dfx build
   ```

1. Deploy your canister.

   ```text
   dfx canister install --all
   ```

1. Take note of the URL at which the canister is accessible.

   ```text
   echo "http://localhost:8000/?canisterId=$(dfx canister id www)"
   ```

1. Open the aforementioned URL in your web browser.

## Current web2 alternates are broken
- They are susceptible to many types of hacks
- They have backdoor access to user data
- Privacy invading algorithms

![alt text](https://github.com/IC-Drive/ic-drive/blob/master/res/images/broken-web2-services.png?raw=true)
