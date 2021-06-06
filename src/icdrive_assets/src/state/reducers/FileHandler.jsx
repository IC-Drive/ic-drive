const initial_state = {
  files: [],
  upload: {file_uploading: "",file_count: 0, completed: 0}
}

const reducer = (state=initial_state, action) =>{
  switch(action.type){
      case "filesUpdate": return{...state, files: action.payload};
      case "uploadUpdate": return{...state, upload: action.payload};
      default: return{...state};
  }
}

export default reducer;