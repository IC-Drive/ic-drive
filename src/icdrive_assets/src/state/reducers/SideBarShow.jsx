const initial_state = {
  state: false
}

const reducer = (state=initial_state, action) =>{
  switch(action.type){
      case "updateState": return{...state, state: action.payload};
      default: return{...state};
  }
}

export default reducer;