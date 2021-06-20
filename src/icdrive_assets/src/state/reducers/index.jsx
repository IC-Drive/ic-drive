import {combineReducers} from 'redux'
import FileHandler from './FileHandler'
import OptionSelected from './OptionSelected'
import UploadProgress from './UploadProgress'

export default combineReducers({
  FileHandler,
  OptionSelected,
  UploadProgress
})