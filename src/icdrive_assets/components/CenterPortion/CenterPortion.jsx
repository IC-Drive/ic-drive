import React from "react";
import styled from 'styled-components';

// custom imports
import icdrive from 'ic:canisters/icdrive';

// 3rd party imports

const CenterPortion = () =>{

  const [files, setFiles] = React.useState([])

  React.useEffect(async()=>{
    const resultFromCanCan = await icdrive.getFiles();
    setFiles(resultFromCanCan[0])
    console.log(resultFromCanCan)
  }, [])

  return(
    <Style>
      
    </Style>
  )
}

export default CenterPortion;

const Style = styled.div`
  width: calc(100vw - 225px);
  height: calc(100vh - 50px);
  
`