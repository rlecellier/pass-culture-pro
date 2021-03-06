import { all } from 'redux-saga/effects'
import { watchDataActions } from 'redux-saga-data'

import { watchErrorsActions } from './errors'
import { watchModalActions } from './modal'

import { API_URL } from '../utils/config'

function* rootSaga() {
  yield all([
    watchDataActions({
      rootUrl: API_URL,
      timeout: 50000,
    }),
    watchErrorsActions(),
    watchModalActions(),
  ])
}

export default rootSaga
