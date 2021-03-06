import { mount } from 'enzyme'
import { showNotification } from 'pass-culture-shared'
import React from 'react'
import { Provider } from 'react-redux'

import DownloadButtonContainer from '../DownloadButtonContainer'
import configureStore from '../../../../utils/store'

global.fetch = url => {
  if (url.includes('reimbursements/csv')) {
    const response = new Response(JSON.stringify({ foo: 'foo' }))
    return response
  }
  const response = new Response(400)
  return response
}

jest.spyOn(window.location, 'assign')
const mockDownloadUrl = 'http://plop.com'
window.URL = { createObjectURL: jest.fn(() => mockDownloadUrl) }

describe('src | components | Layout | DownloadButtonContainer', () => {
  it('should download data', () => {
    // given
    const props = {
      children: 'Fake title',
      href: 'https://foo.com/reimbursements/csv',
    }
    const { store } = configureStore()
    jest.spyOn(store, 'dispatch')

    // when
    const wrapper = mount(
      <Provider store={store}>
        <DownloadButtonContainer {...props} />
      </Provider>
    )

    // then
    wrapper.find('button').simulate('click')
    setTimeout(() => {
      expect(window.location.assign).toHaveBeenCalledWith(mockDownloadUrl)
    })
  })

  it('should notify when wrong href', () => {
    // given
    const props = {
      children: 'Fake title',
      href: 'https://foo.com/wrong-url',
    }
    const { store } = configureStore()
    jest.spyOn(store, 'dispatch')

    // when
    const wrapper = mount(
      <Provider store={store}>
        <DownloadButtonContainer {...props} />
      </Provider>
    )

    // then
    wrapper.find('button').simulate('click')
    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        showNotification({
          text: 'Il y a une erreur avec le chargement du fichier csv.',
          type: 'danger',
        })
      )
    })
  })
})
