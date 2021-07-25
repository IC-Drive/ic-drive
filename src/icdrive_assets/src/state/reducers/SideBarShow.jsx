const initialState = {
  sideBar: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SideBarShow': return { ...state, sideBar: action.payload };
    default: return { ...state };
  }
};

export default reducer;
