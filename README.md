## IC Drive

![Compatibility](https://img.shields.io/badge/compatibility-0.7.0-blue)

IC Drive is a storage application built on the internet computer, which offers the users a decentralized alternate to the current web2 storage services like dropbox, google drive, etc. <br>

![alt text](https://github.com/IC-Drive/ic-drive/blob/master/res/images/dashboard.png?raw=true)

## Prerequisites

Verify the following before running this demo:

*  You have downloaded and installed [Node.js](https://nodejs.org).

*  You have downloaded and installed the [DFINITY Canister
   SDK](https://sdk.dfinity.org).

*  You have stopped any Internet Computer or other network process that would
   create a port conflict on 8000.

## How to run this code

1. Start a local internet computer instance

   ```text
   dfx start
   ```

2. Open a new terminal window.

3. Build your front-end

   ```text
   npm install
   ```

4. Deploy app

   ```text
   dfx deploy
   ```

5. Take note of the URL at which the canister is accessible

   ```text
   echo "http://localhost:8000/?canisterId=$(dfx canister id icdrive_assets)"
   ```

6. Open the aforementioned URL in your web browser.

## Current web2 alternatives are broken
- They are susceptible to many types of hacks
- They have backdoor access to user data
- Privacy invading algorithms

## How IC Drive ensures privacy
- We believe privacy is a fundamental right in the digital world
- Only a user has access to their data via the Internet Identity
- IC Drive as a platform don't have access to the user data and hence your data is fully secure
- No backdoor access and analysis of any user data
