const initialState = {
  progress: 0,
  size: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'progressUpdate': return { ...state, progress: action.payload };
    case 'sizeUpdate': return { ...state, size: action.payload };
    default: return { ...state };
  }
};

export default reducer;
