import React from 'react'
import styled from 'styled-components'

// custom imports
import { image_types, pdf_type } from './CenterPortion/MimeTypes'
import { httpAgent, httpAgentIdentity } from '../httpAgent'
import { idlFactory as FileHandle_idl } from 'dfx-generated/FileHandle'

// 3rd party imports
import { Result } from 'antd'
import { Actor } from '@dfinity/agent'

const PublicUrl = () =>{

  const [notFound, setNotFound] = React.useState(false)
  const [data, setData] = React.useState("")

  React.useEffect(async() => {
    const icdrive = await httpAgent();
    let temp = window.location.href.split("/")
    let hash = temp[temp.length-1]
    console.log(hash)
    const file = await icdrive.getPublicFileLocation(hash)
    console.log(file)
    if(file.length===1){
      let meta_data = file[0].split("$")

      let fileId = ""
      for(let i=3; i<meta_data.length; i++){
        fileId = fileId + meta_data[i]
      }

      let mimeType = meta_data[0]

      let flag = 0
      for(let i=0; i<image_types.length;i++){
        if(mimeType===image_types[i]){
          flag=1
          break
        }
      }
      if(mimeType===pdf_type){
        flag=1
      }

      if(flag){
        let chunkCount = parseInt(meta_data[1])
        let fileCanister = meta_data[2]
        //console.log(fileId)
        //console.log(chunkCount)
        //console.log(fileCanister)
        const identityAgent = await httpAgentIdentity()
        const userAgentShare = Actor.createActor(FileHandle_idl, { agent: identityAgent, canisterId: fileCanister });
        const chunkBuffers = [];
        for(let j=0; j<chunkCount; j++){
          console.log("here");
          const bytes = await userAgentShare.getPublicFileChunk(fileId, j+1);
          console.log(bytes)
          const bytesAsBuffer = new Uint8Array(bytes[0]);
          chunkBuffers.push(bytesAsBuffer);
        }
        
        const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
          type: mimeType,
        });
        
        const fileURL = URL.createObjectURL(fileBlob);
        setData(fileURL)
        window.open(fileURL, "_self");
      } else{
        setNotFound(true)
      }
    }
  }, [])

  return(
    <Style>
      {
        notFound?
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
        />
        :
        null
      }
    </Style>
  )
}

export default PublicUrl;

const Style = styled.div`
  font-style: sans-serif;
  
`