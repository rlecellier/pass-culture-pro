import classnames from 'classnames'
import get from 'lodash.get'
import { Icon, pluralize } from 'pass-culture-shared'
import React, { PureComponent } from 'react'
import Dotdotdot from 'react-dotdotdot'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import Price from '../../../layout/Price'
import Thumb from '../../../layout/Thumb'
import OfferPreviewLink from '../../../layout/OfferPreviewLink/OfferPreviewLink'
import { buildWebappDiscoveryUrl } from '../../../layout/OfferPreviewLink/buildWebappDiscoveryUrl'

class OfferItem extends PureComponent {
  handleHrefClick = event => {
    event.preventDefault()
    const { offer } = this.props
    const offerId = get(offer, 'id')
    const mediationId = get(get(offer, 'activeMediation'), 'id')
    const offerWebappUrl = buildWebappDiscoveryUrl(offerId, mediationId)

    window.open(offerWebappUrl, 'targetWindow', 'toolbar=no,width=375,height=667').focus()
  }

  handleOnDeactivateClick = () => {
    const { offer, updateOffer, trackActivateOffer, trackDeactivateOffer } = this.props
    const { id, isActive } = offer || {}
    updateOffer(id, !isActive)
    isActive ? trackDeactivateOffer(id) : trackActivateOffer(id)
  }

  buildNumberOfParticipantsLabel = (groupSizeMin, groupSizeMax) => {
    return groupSizeMin === groupSizeMax ? `${groupSizeMin}` : `${groupSizeMin} - ${groupSizeMax}`
  }

  buildNumberOfParticipantsTitle = (groupSizeMin, groupSizeMax) => {
    const groupLabel =
      groupSizeMin === groupSizeMax
        ? `minimum ${pluralize(groupSizeMin, 'personnes')}`
        : `entre ${groupSizeMin} et ${groupSizeMax} personnes`

    return groupSizeMin > 0 ? groupLabel : null
  }

  buildProductNavLinkLabel = (offer, stockSize) => {
    if (offer.isThing) {
      return `${stockSize} prix`
    }

    if (offer.isEvent) {
      return pluralize(stockSize, 'date')
    }
  }

  getThumbUrl = () => {
    const { offer, product } = this.props

    if (offer.activeMediation) {
      return offer.activeMediation.thumbUrl
    }

    if (product && product.thumbUrl) {
      return product.thumbUrl
    }

    return ''
  }

  render() {
    const {
      aggregatedStock,
      location: { search },
      maxDate,
      mediations,
      offer,
      offerTypeLabel,
      offerer,
      product,
      stockAlertMessage,
      stocks,
      venue,
    } = this.props

    const { isNew, name } = offer || {}
    const { groupSizeMin, groupSizeMax, priceMin, priceMax } = aggregatedStock || {}
    const thumbUrl = this.getThumbUrl()
    const numberOfMediations = get(mediations, 'length')
    const remainingStockQuantity = get(stocks, 'length')
    const mediationId = get(get(offer, 'activeMediation'), 'id')
    const offerWebappUrl = buildWebappDiscoveryUrl(offer.id, mediationId)
    const offerHasActiveMediations = get(offer, 'activeMediation')
    const offerisEditable = get(offer, 'isEditable')

    return (
      <li
        className={classnames('offer-item', {
          active: offer.isActive,
          product,
        })}
      >
        <Thumb
          alt="offre"
          src={thumbUrl}
        />
        <div className="list-content">
          <NavLink
            className="name"
            title={name}
            to={`/offres/${offer.id}${search}`}
          >
            <Dotdotdot clamp={1}>
              {name}
            </Dotdotdot>
          </NavLink>
          <ul className="infos">
            <li className="is-uppercase">
              {offerTypeLabel}
            </li>
            <li>
              <span className="label">
                {'Structure : '}
              </span>
              {offerer && offerer.name}
            </li>
            <li>
              <span className="label">
                {'Lieu : '}
              </span>
              {(venue && venue.publicName) || venue.name}
            </li>
          </ul>
          <ul className="infos">
            {isNew && (
              <li>
                <div className="recently-added" />
              </li>
            )}
            <li title={this.buildNumberOfParticipantsTitle(groupSizeMin, groupSizeMax)}>
              {groupSizeMin === 1 && <Icon svg="picto-user" />}
              {groupSizeMin > 1 && (
                <div>
                  <Icon svg="picto-group" />
                  {', '}
                  <p>
                    {this.buildNumberOfParticipantsLabel(groupSizeMin, groupSizeMax)}
                  </p>
                </div>
              )}
            </li>
            <li>
              <NavLink
                className="has-text-primary"
                to={`/offres/${offer.id}?gestion`}
              >
                {this.buildProductNavLinkLabel(offer, remainingStockQuantity)}
              </NavLink>
            </li>
            <li>
              {maxDate && `jusqu’au ${maxDate.format('DD/MM/YYYY')}`}
            </li>
            {stockAlertMessage &&
              <li>
                {stockAlertMessage}
              </li>}
            <li>
              {priceMin === priceMax ? (
                <Price value={priceMin || 0} />
              ) : (
                <span>
                  <Price value={priceMin} />
                  {' - '}
                  <Price value={priceMax} />
                </span>
              )}
            </li>
          </ul>
          <ul className="actions offer-actions-list">
            <li>
              <NavLink
                className={`button is-small ${
                  numberOfMediations ? 'is-secondary' : 'is-primary is-outlined'
                } add-mediations-link`}
                to={`/offres/${offer.id}${numberOfMediations ? '' : `/accroches/nouveau${search}`}`}
              >
                <span className="icon">
                  <Icon svg="ico-stars" />
                </span>
                <span>
                  {numberOfMediations ? 'Accroches' : 'Ajouter une Accroche'}
                </span>
              </NavLink>
            </li>
            {offerHasActiveMediations && (
              <li>
                <OfferPreviewLink
                  className="button is-secondary is-small offer-preview-link"
                  href={offerWebappUrl}
                  onClick={this.handleHrefClick}
                />
              </li>
            )}
            {offerisEditable && (
              <li>
                <NavLink
                  className="button is-secondary is-small edit-link"
                  to={`/offres/${offer.id}`}
                >
                  <Icon svg="ico-pen-r" />
                  {'Modifier'}
                </NavLink>
              </li>
            )}
            <li>
              <button
                className="button is-secondary is-small activ-switch"
                onClick={this.handleOnDeactivateClick}
                type="button"
              >
                {offer.isActive ? (
                  <span>
                    <Icon svg="ico-close-r" />
                    {'Désactiver'}
                  </span>
                ) : (
                  'Activer'
                )}
              </button>
            </li>
          </ul>
        </div>
      </li>
    )
  }
}

OfferItem.propTypes = {
  aggregatedStock: PropTypes.shape().isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  maxDate: PropTypes.shape().isRequired,
  mediations: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  offer: PropTypes.shape().isRequired,
  offerTypeLabel: PropTypes.string.isRequired,
  offerer: PropTypes.shape().isRequired,
  product: PropTypes.shape().isRequired,
  stockAlertMessage: PropTypes.string.isRequired,
  stocks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  trackActivateOffer: PropTypes.func.isRequired,
  trackDeactivateOffer: PropTypes.func.isRequired,
  updateOffer: PropTypes.func.isRequired,
  venue: PropTypes.shape().isRequired,
}

export default OfferItem
