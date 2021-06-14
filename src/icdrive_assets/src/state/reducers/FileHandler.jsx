const initial_state = {
  files: [],
  upload: {file_uploading: "",file_count: 0, completed: 0},
  refresh_files: true
}

const reducer = (state=initial_state, action) =>{
  switch(action.type){
      case "filesUpdate": return{...state, files: action.payload};
      case "uploadUpdate": return{...state, upload: action.payload};
      case "refreshFiles": return{...state, refresh_files: action.payload};
      default: return{...state};
  }
}

export default reducer;