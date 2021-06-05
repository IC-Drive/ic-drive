import React from "react";
import styled from 'styled-components';

// custom imports
import ListView from './ListView'
import GridView from './GridView'
//import { Actor, HttpAgent } from '@dfinity/agent';
//import { idlFactory as icdrive_idl, canisterId as icdrive_id } from 'dfx-generated/icdrive';

// 3rd party imports
//import * as streamSaver from 'streamsaver';
//import { WritableStream } from 'web-streams-polyfill/ponyfill'

const CenterPortion = () =>{

  const [selectedView, setSelectedView] = React.useState("listView");

  //const agent = new HttpAgent();
  //const icdrive = Actor.createActor(icdrive_idl, { agent, canisterId: icdrive_id });

  /*const download = async (fileId, chunk_count, fileName) => {
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
    console.log(file_list)
    const files_obj = file_list[0].map(value => 
      <div className="strip">
        <span id="name">{value.name}</span>
        <span id="owner"></span>
        <span id="updated"></span>
        <span id="size">{value["chunkCount"]*0.5}&nbsp;MB</span>
        <span id="down" onClick={()=>handleDownload(value.fileId, value["chunkCount"], value.name)}>Download</span>
      </div>)
      setFiles(files_obj)
  }, [])*/

  return(
    <Style>
      {
        selectedView==="listView"?
        <ListView setSelectedView={setSelectedView}/>
        :
        <GridView setSelectedView={setSelectedView}/>
      }
    </Style>
  )
}

export default CenterPortion;

const Style = styled.div`
  width: calc(100vw - 225px);
  height: calc(100vh - 50px);
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: auto;
`