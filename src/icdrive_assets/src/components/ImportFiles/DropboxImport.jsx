import React from "react"
import { Dropbox } from 'dropbox';

const DropboxImport = () =>{

  var CLIENT_ID = 'owuibsvme6i5k4w';
  const [go, setGo] = React.useState(false)
  // Parses the url and gets the access token if it is in the urls hash
  function getAccessTokenFromUrl() {
    let k = window.location.hash
    let temp = ''
    let start = false
    if(k.indexOf('access_token')===-1){
      temp = false
    } else{
      for(let i=0; i<k.length; i++){
        if(k[i]==='&'){
          break
        }
        if(start){
          temp = temp + k[i]
        }
        if(k[i]==='='){
          start = true
        }
      }
    }
    console.log(temp)
    return(temp);
    //return utils.parseQueryString(window.location.hash).access_token;
  }

  // Render a list of items to #files
  function renderItems(items) {
    var filesContainer = document.getElementById('files');
    items.forEach(function(item) {
      var li = document.createElement('li');
      li.innerHTML = item.name;
      filesContainer.appendChild(li);
    });
  }

  // This example keeps both the authenticate and non-authenticated setions
  // in the DOM and uses this function to show/hide the correct section.
  function showPageSection(elementId) {
    //document.getElementById(elementId).style.display = 'block';
  }

  React.useEffect(() =>{
    if(getAccessTokenFromUrl()) {
      showPageSection('authed-section');
  
      // Create an instance of Dropbox with the access token and use it to
      // fetch and render the files in the users root directory.
      var dbx = new Dropbox({ accessToken: getAccessTokenFromUrl() });
      dbx.filesListFolder({path: ''})
        .then(function(response) {
          console.log(response)
          //renderItems(response.result.entries);
        })
        .catch(function(error) {
          console.error(error);
        });
    } else {
      showPageSection('pre-auth-section');
      // Set the login anchors href using dbx.getAuthenticationUrl()
      var dbx = new Dropbox({ clientId: CLIENT_ID });
      console.log(dbx)
      var authUrl = dbx.getAuthenticationUrl('http://localhost:8000/?canisterId=rno2w-sqaaa-aaaaa-aaacq-cai')
      // const element = document.createElement("a");
      // element.href = authUrl;
      // element.target = "_blank";
      // element.click();
      //document.getElementById('authlink').href = authUrl;
      let k = fetch('https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=owuibsvme6i5k4w&redirect_uri=http://localhost:8000/?canisterId=rno2w-sqaaa-aaaaa-aaacq-cai')
    }
  },[go])

  // React.useEffect(() =>{
  //   if (getAccessTokenFromUrl()!='') {
  //     showPageSection('authed-section');
  //     // Create an instance of Dropbox with the access token and use it to
  //     // fetch and render the files in the users root directory.
  //     var dbx = new Dropbox({ accessToken: getAccessTokenFromUrl() });
  //     dbx.filesListFolder({path: ''})
  //       .then(function(response) {
  //         renderItems(response.result.entries);
  //       })
  //       .catch(function(error) {
  //         console.error(error);
  //       });
  //   } else {
  //     showPageSection('pre-auth-section');
  //     // Set the login anchors href using dbx.getAuthenticationUrl()
  //     var dbx = new Dropbox({ clientId: CLIENT_ID });
  //     var authUrl = dbx.getAuthenticationUrl('http://localhost:8000/?canisterId=rno2w-sqaaa-aaaaa-aaacq-cai')
  //     const element = document.createElement("a");
  //     element.href = authUrl;
  //     element.click();
  //     //document.getElementById('authlink').href = authUrl;
  //   }
  // },[])

  return (
    <div className="App">
      <a onClick={()=>setGo(true)} id="authlink" className="button">Authenticate</a>
    </div>
  );
}

export default DropboxImport;