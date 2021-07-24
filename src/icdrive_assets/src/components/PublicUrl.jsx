import React from 'react';
import styled from 'styled-components';

// custom imports
import { idlFactory as FileHandleIdl } from 'dfx-generated/FileHandle';

// 3rd party imports
import { Result } from 'antd';
import { Actor } from '@dfinity/agent';
import { httpAgent, httpAgentIdentity } from '../httpAgent';
import { imageTypes, pdfType } from './CenterPortion/MimeTypes';

const PublicUrl = () => {
  const [notFound, setNotFound] = React.useState(false);
  const [data, setData] = React.useState('');

  React.useEffect(() => {
    const getFiles = async () => {
      const icdrive = await httpAgent();
      const temp = window.location.href.split('/');
      const hash = temp[temp.length - 1];
      // console.log(hash);
      const file = await icdrive.getPublicFileLocation(hash);
      // console.log(file);
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
            // console.log(bytes);
            const bytesAsBuffer = new Uint8Array(bytes[0]);
            chunkBuffers.push(bytesAsBuffer);
          }

          const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
            type: mimeType,
          });

          const fileURL = URL.createObjectURL(fileBlob);
          setData(fileURL);
          window.open(fileURL, '_self');
        } else {
          setNotFound(true);
        }
      }
    };
    getFiles();
  }, []);

  return (
    <Style>
      {
        notFound
          ? (
            <Result
              status="404"
              title="404"
              subTitle="Sorry, the page you visited does not exist."
            />
          )
          : null
      }
    </Style>
  );
};

export default PublicUrl;

const Style = styled.div`
  font-style: sans-serif;
  
`;
