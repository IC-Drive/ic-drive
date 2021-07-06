export const filesUpdate = (payload) =>{
  return{
      type: 'filesUpdate',
      payload
  }
}
export const sharedUpdate = (payload) =>{
  return{
      type: 'sharedUpdate',
      payload
  }
}
export const uploadUpdate = (payload) =>{
  return{
      type: 'uploadUpdate',
      payload
  }
}
export const refreshFiles = (payload) =>{
  return{
      type: 'refreshFiles',
      payload
  }
}
export const uploadFileId = (payload) =>{
  return{
      type: 'uploadFileId',
      payload
  }
}
//-------------------------------------Switch Options-----------------------------------------//
export const switchHome = (payload) =>{
  return{
      type: 'switchHome',
      payload
  }
}
export const switchMarked = (payload) =>{
  return{
      type: 'switchMarked',
      payload
  }
}
export const switchShared = (payload) =>{
  return{
      type: 'switchShared',
      payload
  }
}

//-------------------------------------Upload Progress-----------------------------------------//
export const uploadProgress = (payload) =>{
  return{
      type: 'progressUpdate',
      payload
  }
}

//---------------------------------------Side Bar----------------------------------------------//
export const updateState = () =>{
  return{
      type: 'updateState',
  }
}