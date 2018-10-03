import get from 'lodash.get'
import createCachedSelector from 're-reselect'

import { showOptions } from '../utils/edd'

const mapArgsToKey = musicType => musicType || ' '

const selectShowSubOptionsByShowType = createCachedSelector(
  showType => showType,
  showType => {
    if (!showType) {
      return
    }
    const parentCode = Number(showType)
    const option = showOptions.find(option => option.code === parentCode)
    return get(option, 'children')
  }
)(mapArgsToKey)

export default selectShowSubOptionsByShowType