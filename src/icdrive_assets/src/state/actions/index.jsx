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