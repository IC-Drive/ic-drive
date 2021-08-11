export const filesUpdate = (payload) => ({
  type: 'filesUpdate',
  payload,
});
export const sharedUpdate = (payload) => ({
  type: 'sharedUpdate',
  payload,
});
export const uploadUpdate = (payload) => ({
  type: 'uploadUpdate',
  payload,
});
export const refreshFiles = (payload) => ({
  type: 'refreshFiles',
  payload,
});
export const uploadFileId = (payload) => ({
  type: 'uploadFileId',
  payload,
});
export const searchedFile = (payload) => ({
  type: 'searchedFile',
  payload,
});

// -------------------------------------Switch Options-----------------------------------------//
export const switchHome = (payload) => ({
  type: 'switchHome',
  payload,
});
export const switchMarked = (payload) => ({
  type: 'switchMarked',
  payload,
});
export const switchShared = (payload) => ({
  type: 'switchShared',
  payload,
});
export const switchProfile = (payload) => ({
  type: 'switchProfile',
  payload,
});
export const switchSearch = (payload) => ({
  type: 'switchSearch',
  payload,
});
export const switchFolder = (payload) => ({
  type: 'switchFolder',
  payload,
});

// -------------------------------------Upload Progress-----------------------------------------//
export const uploadProgress = (payload) => ({
  type: 'progressUpdate',
  payload,
});
export const sizeUpdate = (payload) => ({
  type: 'sizeUpdate',
  payload,
});

// ---------------------------------------Side Bar----------------------------------------------//
export const SideBarShow = (payload) => ({
  type: 'SideBarShow',
  payload,
});

// ---------------------------------------Folder------------------------------------------------//
export const folderUpdate = (payload) => ({
  type: 'folderUpdate',
  payload,
});