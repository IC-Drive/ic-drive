const initialState = {
  option: 'home',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'switchHome': return { ...state, option: action.payload };
    case 'switchMarked': return { ...state, option: action.payload };
    case 'switchShared': return { ...state, option: action.payload };
    case 'switchProfile': return { ...state, option: action.payload };
    case 'switchSearch': return { ...state, option: action.payload };
    case 'switchFolder': return { ...state, option: action.payload };
    default: return { ...state };
  }
};

export default reducer;
