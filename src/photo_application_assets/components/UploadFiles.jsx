import React from 'react'

import photo_application from 'ic:canisters/photo_application'

const UploadFiles = () =>{

  const [img, setImg] = React.useState()
  const [id, setId] = React.useState()
  
  React.useState(async ()=>{
  	const ownId = await photo_application.getOwnId()
  	setId(ownId)
  },[])

  const showFile = (e) =>{
    e.preventDefault()
    let file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      photo_application.update({
      	id: id,
      	firstName: "a",
      	lastName: "b",
      	img: reader.result
      })
    };
  }
  
  const getImg = async() =>{
  	const data = await photo_application.get(id);
  	setImg(data.img);
  }

  return(
    <div> 
      <input type="file" onChange={(e) => showFile(e)} />
      <button type="button" onClick={()=>getImg()}>show!</button>
      <img src={img} />
    </div> 
  )
}

export default UploadFiles;

