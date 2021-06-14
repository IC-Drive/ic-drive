export const filesUpdate = (payload) =>{
  return{
      type: 'filesUpdate',
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

//-------------------------------------Switch Options-----------------------------------------//
export const switchDefault = (payload) =>{
  return{
      type: 'switchDefault',
      payload
  }
}
export const switchMarked = (payload) =>{
  return{
      type: 'switchMarked',
      payload
  }
}