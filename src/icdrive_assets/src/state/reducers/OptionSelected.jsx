const initial_state = {
  option: "home",
}

const reducer = (state=initial_state, action) =>{
  switch(action.type){
      case "switchHome": return{...state, option: action.payload};
      case "switchMarked": return{...state, option: action.payload};
      case "switchShared": return{...state, option: action.payload};
      default: return{...state};
  }
}

export default reducer;