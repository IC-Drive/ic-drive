const initialState = {
  folders: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'folderUpdate': return { ...state, folders: action.payload };
    default: return { ...state };
  }
};

export default reducer;
