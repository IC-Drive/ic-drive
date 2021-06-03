import React from "react";
import styled from 'styled-components';

// custom imports
import icdrive from 'ic:canisters/icdrive';

// 3rd party imports
import * as streamSaver from 'streamsaver';
import { WritableStream } from 'web-streams-polyfill/ponyfill'

const CenterPortion = () =>{

  const [files, setFiles] = React.useState("")
  
  const download = async (fileId, chunk_count, fileName) => {
    streamSaver.WritableStream = WritableStream
    const fileStream = streamSaver.createWriteStream(fileName);
    const writer = fileStream.getWriter();
    for(let j=0; j<chunk_count; j++){
      const bytes = await icdrive.getFileChunk(fileId, j+1);
      //const bytesAsBuffer = Buffer.from(new Uint8Array(bytes[0]));
      const bytesAsBuffer = new Uint8Array(bytes[0]);
      writer.write(bytesAsBuffer);
    }
    writer.close();
  };

  const handleDownload = async (fileId, chunk_count, fileName) =>{
    let k = await download(fileId, chunk_count, fileName)
  }

  React.useEffect(async()=>{
    const file_list = await icdrive.getFiles()
    const files_obj = file_list[0].map(value => 
      <div className="strip">
        <span id="name">{value.name}</span>
        <span id="owner"></span>
        <span id="updated"></span>
        <span id="size">{value["chunkCount"]["c"][0]*0.5}&nbsp;MB</span>
        <span id="down" onClick={()=>handleDownload(value.fileId, value["chunkCount"]["c"][0], value.name)}>Download</span>
      </div>)
      setFiles(files_obj)
  }, [])

  return(
    <Style>
      <div className="strip">
        <span id="name"><strong>File Name</strong></span>
        <span id="owner"><strong>Owner</strong></span>
        <span id="updated"><strong>Last Updated</strong></span>
        <span id="size"><strong>File Size</strong></span>
      </div>
      {
        files
      }
    </Style>
  )
}

export default CenterPortion;

const Style = styled.div`
  width: calc(100vw - 225px);
  height: calc(100vh - 50px);
  .data{
    display: flex;
    flex-direction: column;
  }
  .strip{
    display: flex;
    flex-direction: row;
    font-size: 18px;
  }
  #owner{
    margin-left: 10%;
  }
  #updated{
    margin-left: 10%;
  }
  #size{
    margin-left: 10%;
  }

`