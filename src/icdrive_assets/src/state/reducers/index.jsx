import {combineReducers} from 'redux'
import FileHandler from './FileHandler'
import OptionSelected from './OptionSelected'
import UploadProgress from './UploadProgress'
import SideBarShow from './SideBarShow'

export default combineReducers({
  FileHandler,
  OptionSelected,
  UploadProgress,
  SideBarShow
})