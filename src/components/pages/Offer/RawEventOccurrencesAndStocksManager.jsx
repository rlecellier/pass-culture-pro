import classnames from 'classnames'
import get from 'lodash.get'
import { closeModal } from 'pass-culture-shared'
import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import EventOccurrenceAndStockItem from './EventOccurrenceAndStockItem'
import HeroSection from '../../layout/HeroSection'

export function getAddUrl(
  editedStockId,
  isStockOnly,
  offerId,
  stocks,
  defaultUrl
) {
  if (editedStockId) {
    return defaultUrl
  }

  if (isStockOnly) {
    if (stocks.length > 0) {
      return `/offres/${offerId}?gestion&stock=${stocks[0].id}`
    }
    return `/offres/${offerId}?gestion&stock=nouveau`
  }

  return `/offres/${offerId}?gestion&date=nouvelle`
}

class RawEventOccurrencesAndStocksManager extends Component {
  constructor() {
    super()
    this.state = { info: null }
  }

  componentDidMount() {
    this.elem.focus()
    document.addEventListener('keydown', this.onKeydown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown)
  }

  handleEscKey() {
    if (!this.props.editedStockId) {
      this.onCloseClick()
    } else {
      const cancelButton = document.getElementsByClassName('cancel-step')[0]
      cancelButton.click()
    }
  }

  handleEnterKey() {
    // Dirty DOM selectors but...
    if (!this.props.editedStockId) {
      // This dom node is generated by react-router-dom's <NavLink /> component wich is
      // a 'Function component' and...
      // Warning: Function components cannot be given refs. Attempts to access this ref will fail.
      document.getElementById('add-occurrence-or-stock').focus()
      const { editedStockId, isStockOnly } = this.props
      this.props.history.push(this.getAddUrl(editedStockId, isStockOnly))
    } else {
      // Could fetch ref from the included components, but it will be far more complex
      // as we would have to make the ref transit through callback props.
      // We could probably use context though, but I am not familiar enough with this yet
      // and done is better than perfect
      const submitButton = document.getElementsByClassName('submitStep')[0]
      submitButton.click()
    }
  }

  getAddUrl(editedStockId, isStockOnly) {
    return getAddUrl(
      editedStockId,
      isStockOnly,
      get(this.props.offer, 'id'),
      this.props.stocks,
      `${this.props.location.pathname}${this.props.location.search}`
    )
  }

  closeInfo = () => {
    this.setState({ info: null })
  }

  showInfo = info => {
    this.setState({ info })
  }

  onCloseClick = e => {
    const { dispatch, offer, history } = this.props
    dispatch(closeModal())
    history.push(`/offres/${get(offer, 'id')}`)
  }

  onKeydown = event => {
    if (event.key === 'Enter') {
      this.handleEnterKey()
    } else if (event.key === 'Escape') {
      this.handleEscKey()
    }
  }

  render() {
    const {
      errors,
      event,
      eventOccurrences,
      editedStockId,
      isNew,
      provider,
      stocks,
      thing,
      isStockOnly,
    } = this.props
    const { info } = this.state

    return (
      <div
        className="event-occurrences-and-stocks-manager"
        ref={elem => (this.elem = elem)}>
        <div className={classnames('info', { 'is-invisible': !info })}>
          <div className="content">
            <div>{info}</div>
          </div>
        </div>

        {errors && (
          <div className="notification is-danger">
            {Object.keys(errors).map(key => (
              <p key={key}>
                {' '}
                {key} : {errors[key]}
              </p>
            ))}
          </div>
        )}
        <div className="event-occurrences-and-stocks-table-wrapper">
          <HeroSection
            title={
              get(event, 'id')
                ? 'Dates, horaires et prix'
                : get(thing, 'id') && 'Prix'
            }
            subtitle={get(event, 'name') || get(thing, 'name')}
          />
          <table
            className={classnames(
              'table is-hoverable event-occurrences-and-stocks-table',
              { small: isStockOnly }
            )}>
            <thead>
              <tr>
                {!isStockOnly && (
                  <Fragment>
                    <td>Date</td>
                    <td>
                      Heure de
                      <br />
                      début
                    </td>
                    <td>
                      Heure de
                      <br />
                      fin
                    </td>
                  </Fragment>
                )}
                <td>Prix</td>
                <td>Date Limite de Réservation</td>
                <td>{isStockOnly ? 'Stock' : 'Places affectées'}</td>
                <td>Stock restant</td>
                <td>Modifier</td>
                <td>Supprimer</td>
              </tr>
            </thead>

            {provider ? (
              <tbody>
                <tr>
                  <td colSpan="10">
                    <i>
                      Il n'est pas possible d'ajouter ni de supprimer d'horaires
                      pour cet événement {provider.name}
                    </i>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                <tr
                  className={classnames({
                    inactive: isStockOnly && stocks.length,
                  })}>
                  <td colSpan="10">
                    <NavLink
                      className="button is-secondary"
                      disabled={editedStockId}
                      id="add-occurrence-or-stock"
                      to={this.getAddUrl(editedStockId, isStockOnly)}>
                      {isStockOnly
                        ? stocks.length
                          ? ''
                          : 'Renseigner le stock'
                        : '+ Ajouter une date'}
                    </NavLink>
                  </td>
                </tr>
              </tbody>
            )}

            {isNew && (
              <EventOccurrenceAndStockItem
                closeInfo={this.closeInfo}
                isFullyEditable={!provider}
                isStockOnly={isStockOnly}
                showInfo={this.showInfo}
              />
            )}
            {(isStockOnly ? stocks : eventOccurrences).map(item => (
              <EventOccurrenceAndStockItem
                closeInfo={this.closeInfo}
                key={item.id}
                isFullyEditable={!provider}
                isStockOnly={isStockOnly}
                showInfo={this.showInfo}
                {...{ [isStockOnly ? 'stock' : 'eventOccurrence']: item }}
              />
            ))}

            {Math.max(
              get(stocks, 'length', 0),
              get(eventOccurrences, 'length', 0)
            ) > 12 && (
              <thead>
                <tr>
                  {!isStockOnly && (
                    <Fragment>
                      <td>Date</td>
                      <td>Heure de début</td>
                      <td>Heure de fin</td>
                    </Fragment>
                  )}
                  <td>Prix</td>
                  <td>Date Limite de Réservation</td>
                  <td>Places disponibles</td>
                  <td>Modifier</td>
                  <td>Supprimer</td>
                </tr>
              </thead>
            )}
          </table>
        </div>
        <button
          className="button is-secondary is-pulled-right"
          id="close-manager"
          onClick={this.onCloseClick}>
          Fermer
        </button>
      </div>
    )
  }
}

RawEventOccurrencesAndStocksManager.defaultProps = {
  stocks: [],
  eventOccurrences: [],
}

RawEventOccurrencesAndStocksManager.propTypes = {
  stocks: PropTypes.array,
  eventOccurrences: PropTypes.array,
}

export default RawEventOccurrencesAndStocksManager