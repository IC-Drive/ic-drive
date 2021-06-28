const initial_state = {
  progress: 0
}

const reducer = (state=initial_state, action) =>{
  switch(action.type){
      case "progressUpdate": return{...state, progress: action.payload};
      default: return{...state};
  }
}

export default reducer;