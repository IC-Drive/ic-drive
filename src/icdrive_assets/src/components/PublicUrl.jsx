import React from 'react';
import styled from 'styled-components';
import { Helmet } from "react-helmet";

// custom imports
import { idlFactory as FileHandleIdl } from 'dfx-generated/FileHandle';
import { imageTypes, pdfType } from './CenterPortion/MimeTypes';

// 3rd party imports
import { Result } from 'antd';
import { Actor } from '@dfinity/agent';
import { httpAgent, httpAgentIdentity } from '../httpAgent';

const PublicUrl = () => {
  const [notFound, setNotFound] = React.useState(false);
  const [data, setData] = React.useState('');
  const [type, setType] = React.useState('');

  const isPdf = (mimeType) =>{
    let flag = false
    if(mimeType===pdfType){
      flag = true
    }
    return(flag)
  }

  React.useEffect(() => {
    const getFiles = async () => {
      const icdrive = await httpAgent();
      const temp = window.location.href.split('/');
      const hash = temp[temp.length - 1];
      
      const file = await icdrive.getPublicFileLocation(hash);

      if (file.length === 1) {
        const metaData = file[0].split('$');

        let fileId = '';
        for (let i = 3; i < metaData.length; i += 1) {
          fileId += metaData[i];
        }

        const mimeType = metaData[0];

        let flag = 0;
        for (let i = 0; i < imageTypes.length; i += 1) {
          if (mimeType === imageTypes[i]) {
            flag = 1;
            break;
          }
        }
        if (mimeType === pdfType) {
          flag = 1;
        }

        if (flag) {
          const chunkCount = parseInt(metaData[1], 10);
          const fileCanister = metaData[2];
          const identityAgent = await httpAgentIdentity();
          const userAgentShare = Actor.createActor(FileHandleIdl, { agent: identityAgent, canisterId: fileCanister });
          const chunkBuffers = [];
          for (let j = 0; j < chunkCount; j += 1) {
            const bytes = await userAgentShare.getPublicFileChunk(fileId, j + 1);
            const bytesAsBuffer = new Uint8Array(bytes[0]);
            chunkBuffers.push(bytesAsBuffer);
          }

          const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
            type: mimeType,
          });

          const fileURL = URL.createObjectURL(fileBlob);
          if(isPdf(type)){
            setType(mimeType);
            setData(fileURL);
          } else{
            let reader = new FileReader();
            reader.readAsDataURL(fileBlob);
            reader.onloadend = function() {
              setData(reader.result);
            }
            setType(mimeType);
          }
          //window.open(fileURL, '_self');
        } else {
          setNotFound(true);
        }
      }
    };
    getFiles();
  }, []);

  return (
    <Style>
      <Helmet>
        <title>IC Drive</title>
        <meta name="viewport" content="width=device-width, minimum-scale=0.1" />
      </Helmet>
      {
        notFound
          ? (
            <Result
              status="404"
              title="404"
              subTitle="Sorry, the page you visited does not exist."
            />
          )
          :
            isPdf(type)?
            <div className="show-pdf">
              <embed name="316B4D6EC81C66DEFBBB62C94CA2068C" style={{position:"absolute", left: "0", top: "0"}} width="100%" height="100%" src={data} type="application/pdf" internalid="316B4D6EC81C66DEFBBB62C94CA2068C" />
            </div>
            :
            <div className="show-image">
              <img alt="IC Drive - File on Blockchain" id="the-image" src={data}/>
            </div>
      }
    </Style>
  );
};

export default PublicUrl;

const Style = styled.div`
  font-style: sans-serif;
  height: 100vh;
  width: 100vw;

  .show-pdf{
    height: 100%;
    width: 100%;
    overflow: hidden;
    margin: 0px;
    background-color: rgb(82, 86, 89);
  }
  .show-image{
    display: flex;
    margin: 0px;
    background: #0e0e0e;
    height: 100%;
  }
  #the-image{
    -webkit-user-select: none;
    margin: auto;
    background-color: hsl(0, 0%, 90%);
    transition: background-color 300ms;
  }
`;