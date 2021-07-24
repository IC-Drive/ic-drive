const initialState = {
  state: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'updateState': return { ...state, state: action.payload };
    default: return { ...state };
  }
};

export default reducer;
