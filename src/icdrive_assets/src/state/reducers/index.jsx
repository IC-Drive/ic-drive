import { combineReducers } from 'redux';
import FileHandler from './FileHandler';
import OptionSelected from './OptionSelected';
import UploadProgress from './UploadProgress';
import SideBarShow from './SideBarShow';
import FolderHandle from './FolderHandle';

export default combineReducers({
  FileHandler,
  OptionSelected,
  UploadProgress,
  SideBarShow,
  FolderHandle,
});
