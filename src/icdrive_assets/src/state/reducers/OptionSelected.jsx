const initial_state = {
  option: "default",
}

const reducer = (state=initial_state, action) =>{
  switch(action.type){
      case "switchDefault": return{...state, option: action.payload};
      case "switchMarked": return{...state, option: action.payload};
      default: return{...state};
  }
}

export default reducer;