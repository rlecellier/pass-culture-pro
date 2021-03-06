import { shallow } from 'enzyme'
import React from 'react'

import Venues from '../Venues'

describe('src | components | pages | OffererCreation | Venues', () => {
  let props

  beforeEach(() => {
    props = {
      offererId: '5767Fdtre',
      venues: [],
      isVenueCreationAvailable: true,
    }
  })

  describe('render', () => {
    it('should render a title link', () => {
      // given
      props.adminUserOfferer = true
      const wrapper = shallow(<Venues {...props} />)

      // when
      const title = wrapper.find('h2')

      // then
      expect(title.text()).toBe('Lieux')
    })

    describe('create new venue link', () => {
      describe('when the venue creation is available', () => {
        it('should render a create venue link', () => {
          // given
          props.adminUserOfferer = true
          const wrapper = shallow(<Venues {...props} />)

          // when
          const link = wrapper.find({ children: '+ Ajouter un lieu' })

          // then
          expect(link.prop('to')).toBe('/structures/5767Fdtre/lieux/creation')
        })
      })
      describe('when the venue creation is disabled', () => {
        it('should render a create venue link', () => {
          // given
          props.adminUserOfferer = true
          props.isVenueCreationAvailable = false
          const wrapper = shallow(<Venues {...props} />)

          // when
          const link = wrapper.find({ children: '+ Ajouter un lieu' })

          // then
          expect(link.prop('to')).toBe('/erreur/indisponible')
        })
      })
    })
  })
})
