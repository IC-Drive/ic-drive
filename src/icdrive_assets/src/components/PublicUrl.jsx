import React from 'react';
import styled from 'styled-components';

// custom imports
import { idlFactory as FileHandleIdl } from 'dfx-generated/FileHandle';

// 3rd party imports
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';
import { Actor } from '@dfinity/agent';
import { httpAgentIdentity } from '../httpAgent';
import {Spin} from 'antd';

const PublicUrl = () => {
  const [data, setData] = React.useState('');
  const [type, setType] = React.useState('');

  React.useEffect(() => {
    const getFiles = async () => {
      const fileHash = window.location.href.split('/*')[1];
      let bytes  = AES.decrypt(fileHash, 'secret key 123');
      let originalText = bytes.toString(CryptoJS.enc.Utf8);
      
      const fileId = originalText.split('$')[3]
      const chunkCount = parseInt(originalText.split('$')[1], 10)
      const mimeType = originalText.split('$')[0]
      const canisterId = originalText.split('$')[2]
      
      const identityAgent = await httpAgentIdentity();
      const userAgentShare = Actor.createActor(FileHandleIdl, { agent: identityAgent, canisterId });

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

      // // if(isPdf(type)){
      // //   setType(mimeType);
      // //   setData(fileURL);
      // // } else{
      // //   let reader = new FileReader();
      // //   //reader.readAsDataURL(fileBlob);
      // //   setData(fileURL);
      // //   //reader.onloadend = function() {
      // //   //  setData(reader.result);
      // //   //}
      // //   setType(mimeType);
      // // }
      setType(mimeType);
      setData(fileURL);
    };
    getFiles();
  }, []);

  const isPdf = (mimeType) => {
    let flag = false;
    if (mimeType.indexOf('pdf') != -1) {
      flag = true;
    }
    return (flag);
  };

  return (
    <Style>
      {
        isPdf(type)
          ? (
            <div className="show-pdf">
              <embed name="316B4D6EC81C66DEFBBB62C94CA2068C" style={{ position: 'absolute', left: '0', top: '0' }} width="100%" height="100%" src={data} type="application/pdf" internalid="316B4D6EC81C66DEFBBB62C94CA2068C" />
            </div>
          )
          : (
            <div className="show-image">
              {
                data===''?
                <div style={{marginTop: "calc(50vh - 13px)", marginLeft: "calc(50vw - 13px)"}}><Spin /></div>
                :
                <img alt="IC Drive - File on Blockchain" id="the-image" src={data} />
              }
            </div>
          )
      }
    </Style>
  );
};

export default PublicUrl;

const Style = styled.div`
  font-style: sans-serif;
  height: 100vh;

  .show-pdf{
    height: 100%;
    width: 100%;
    overflow: hidden;
    margin: 0px;
    background-color: rgb(82, 86, 89);
  }
  .show-image{
    display: flex;
    margin: 0px !important;
    background: #0e0e0e;
    height: 100% !important;
  }
  #the-image{
    -webkit-user-select: none;
    margin: auto;
    background-color: hsl(0, 0%, 90%);
    transition: background-color 300ms;
    max-width: 100%;
    max-height: 100%;
  }
`;
