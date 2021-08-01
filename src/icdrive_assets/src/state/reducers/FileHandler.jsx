const initialState = {
  files: [],
  shared: [],
  upload: { file_uploading: '', file_count: 0, completed: 0 },
  upload_file_id: '',
  refreshFiles: true,
  searched: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'filesUpdate': return { ...state, files: action.payload };
    case 'sharedUpdate': return { ...state, shared: action.payload };
    case 'uploadUpdate': return { ...state, upload: action.payload };
    case 'refreshFiles': return { ...state, refreshFiles: action.payload };
    case 'uploadFileId': return { ...state, upload_file_id: action.payload };
    case 'searchedFile': return { ...state, searched: action.payload };
    default: return { ...state };
  }
};

export default reducer;
