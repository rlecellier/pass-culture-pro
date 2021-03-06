import { shallow } from 'enzyme'
import React from 'react'

import StocksManager from '../StocksManager'

describe('src | components | pages | Offer | StocksManager | StocksManager', () => {
  let props
  let query
  const stock = {
    available: 10,
    bookingLimitDatetime: '2019-03-06T23:00:00Z',
    bookingRecapSent: null,
    dateModified: '2019-03-06T15:51:39.253527Z',
    dateModifiedAtLastProvider: '2019-03-06T15:51:39.253504Z',
    eventOccurrenceId: null,
    id: 'ARMQ',
    idAtProviders: null,
    isSoftDeleted: false,
    lastProviderId: null,
    modelName: 'Stock',
    offerId: 'AUSQ',
    price: 17,
  }

  beforeEach(() => {
    query = {
      changeToCreation: jest.fn(),
      changeToReadOnly: jest.fn(),
      context: jest.fn().mockReturnValue({}),
    }
    props = {
      dispatch: jest.fn(),
      isEvent: true,
      location: {
        pathname: '/offres/AWHA',
        search: '?gestion',
        hash: '',
        state: undefined,
        key: '4c2v7m',
      },
      offer: {
        name: 'OfferName',
      },
      product: {
        id: 'ABDD',
      },
      query,
      isStockCreationAllowed: true,
      stocks: [stock],
    }
  })

  describe('when managing an event', () => {
    it('should contain the event cancellation legal text', () => {
      // when
      const wrapper = shallow(<StocksManager {...props} />)

      // then
      const legalTextFirstSentence = wrapper
        .findWhere(
          node =>
            node.text() ===
            "Les réservations peuvent être annulées par les utilisateurs jusque 72h avant le début de l'événement."
        )
        .first()
      const legalTextSecondSentence = wrapper
        .findWhere(
          node =>
            node.text() ===
            "Si la date limite de réservation n'est pas encore passée, la place est alors automatiquement remise en vente."
        )
        .first()
      expect(legalTextFirstSentence).toHaveLength(1)
      expect(legalTextSecondSentence).toHaveLength(1)
    })
  })

  describe('when managing a thing', () => {
    it('should not contain the event cancellation legal text', () => {
      // given
      props.isEvent = false

      // when
      const wrapper = shallow(<StocksManager {...props} />)

      // then
      const legalTextFirstSentence = wrapper
        .findWhere(
          node =>
            node.text() ===
            "Les réservations peuvent être annulées par les utilisateurs jusque 72h avant le début de l'événement."
        )
        .first()
      const legalTextSecondSentence = wrapper
        .findWhere(
          node =>
            node.text() ===
            "Si la date limite de réservation n'est pas encore passée, la place est alors automatiquement remise en vente."
        )
        .first()
      expect(legalTextFirstSentence).toHaveLength(0)
      expect(legalTextSecondSentence).toHaveLength(0)
    })
  })

  describe('onClickCreateStockItem', () => {
    it('should update URL query param when click on add stock button', () => {
      // given
      const wrapper = shallow(<StocksManager {...props} />)
      const button = wrapper.find('#add-stock')

      // when
      button.simulate('click')

      // then
      expect(query.changeToCreation).toHaveBeenCalledWith(null, {
        key: 'stock',
      })
    })
  })

  describe('handleShouldPreventCreationOfSecondNotEventStock', () => {
    it('when the creation of second stock is allowed', () => {
      // given
      props.isStockCreationAllowed = true
      const wrapper = shallow(<StocksManager {...props} />)

      // when
      const result = wrapper.instance().handleShouldPreventCreationOfSecondNotEventStock()

      // then
      expect(result).toBeUndefined()
    })

    it('when the creation of second stock is not allowed', () => {
      // given
      props.isStockCreationAllowed = false
      props.query.context.mockReturnValue({
        isCreatedEntity: true,
      })

      const wrapper = shallow(<StocksManager {...props} />)

      // when
      wrapper.instance().handleShouldPreventCreationOfSecondNotEventStock()

      // then
      expect(query.changeToReadOnly).toHaveBeenCalledWith(null, { key: 'stock' })
    })
  })

  describe('handleEnterKey', () => {
    describe('when all stocks are read only', () => {
      beforeEach(() => {
        props.location.search = '?gestion&lieu=CU'
      })
      it('should do nothing when stock creation is not allowed', () => {
        // given
        props.isStockCreationAllowed = false
        const wrapper = shallow(<StocksManager {...props} />)

        // when
        const result = wrapper.instance().handleEnterKey()

        // then
        expect(result).toBeUndefined()
      })

      it('should call focus on add-stock element when it exists', () => {
        // given
        let spy = jest.spyOn(document, 'getElementById')
        const wrapper = shallow(<StocksManager {...props} />)
        let addStockElement = {}

        spy.mockReturnValue(addStockElement)
        addStockElement.focus = () => {}
        jest.spyOn(addStockElement, 'focus')

        // when
        wrapper.instance().handleEnterKey()

        // then
        expect(addStockElement.focus).toHaveBeenCalledWith()
      })

      it('should call query changeToCreation with proper params when creation is allowed', () => {
        // given
        props.isStockCreationAllowed = true
        const wrapper = shallow(<StocksManager {...props} />)

        // when
        wrapper.instance().handleEnterKey()

        // then
        expect(query.changeToCreation).toHaveBeenCalledWith(null, { key: 'stock' })
      })
    })

    describe('when all stocks are not read only', () => {
      it('should click on submit button', () => {
        // given
        props.location.search = '?gestion&lieu=CU&stockMU=modification'
        const wrapper = shallow(<StocksManager {...props} />)

        let spy = jest.spyOn(document, 'querySelector')
        let submitElement = {}

        spy.mockReturnValue(submitElement)
        submitElement.click = () => {}
        jest.spyOn(submitElement, 'click')

        // when
        wrapper.instance().handleEnterKey()

        // then
        expect(submitElement.click).toHaveBeenCalledWith()
      })
    })
  })

  describe('render', () => {
    it('should return a error message', () => {
      // given
      props.query = { context: () => ({}) }
      const wrapper = shallow(<StocksManager {...props} />)
      wrapper.setState({
        errors: {
          global: ['Mon message d’erreur custom'],
        },
      })

      // when
      const errorMessage = wrapper.find('[children="global : Mon message d’erreur custom"]')

      // then
      expect(errorMessage).toHaveLength(1)
    })

    it('should return a success message', () => {
      // given
      props.query = { context: () => ({}) }
      const wrapper = shallow(<StocksManager {...props} />)
      wrapper.setState({
        editSuccess: true,
      })

      // when
      const successMessage = wrapper.find('div.notification.is-success')

      // then
      expect(successMessage).toHaveLength(1)
      expect(successMessage.text()).toBe(
        "Les modifications ont été enregistrées.Si la date de l'évènement a été modifiée, les utilisateurs ayant déjà réservé cette offre seront prévenus par email."
      )
      expect(successMessage.hasClass('fade-out')).toBe(false)
    })
  })
})
