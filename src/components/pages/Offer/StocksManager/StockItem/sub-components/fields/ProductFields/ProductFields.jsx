import moment from 'moment'
import PropTypes from 'prop-types'
import React, { PureComponent, Fragment } from 'react'
import { createParseNumberValue } from 'react-final-form-utils'
import ReactTooltip from 'react-tooltip'

import {
  createFormatAvailable,
  formatPrice,
  getFormattedRemainingQuantities,
} from '../../../utils/utils'
import DateField from '../../../../../../../layout/form/fields/DateField/DateField'
import HiddenField from '../../../../../../../layout/form/fields/HiddenField'
import NumberField from '../../../../../../../layout/form/fields/NumberField'
import Icon from '../../../../../../../layout/Icon'

class ProductFields extends PureComponent {
  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  componentWillUnmount() {
    const { closeInfo } = this.props
    closeInfo()
  }

  handleOnPriceBlur = event => {
    const { assignModalConfig, hasIban, readOnly, showInfo } = this.props
    const formPrice = createParseNumberValue('number')(event.target.value)

    if (readOnly || hasIban || !formPrice) {
      return
    }

    event.target.focus()
    assignModalConfig('modal-in-modal')

    showInfo(
      <Fragment>
        <div className="mb24 has-text-left">
          {'Vous avez saisi une offre payante. Pensez à demander à '}
          {'l’administrateur financier nommé pour votre structure de renseigner '}
          {'son IBAN. Sans IBAN, les réservations de vos offres éligibles ne vous '}
          {'seront pas remboursées.'}
        </div>
        <div className="has-text-right">
          <button
            className="button is-primary"
            onClick={this.handleOnClick}
            type="button"
          >
            {'J’ai compris'}
          </button>
        </div>
      </Fragment>
    )
  }

  handleOnClick = () => {
    const { assignModalConfig, closeInfo } = this.props
    assignModalConfig(null)
    closeInfo()
  }

  renderDateFieldValue = (readOnly, venue) => () => {
    if (readOnly) {
      return null
    }

    let tip = "L'heure limite de réservation de ce jour est 23h59 et ne peut pas être changée."
    if (venue && venue.isVirtual) {
      tip = `${tip}<br /><br />Vous êtes sur une offre numérique, la zone horaire de cette date correspond à celle de votre structure.`
    }

    return (
      <span
        className="button tooltip tooltip-info"
        data-place="bottom"
        data-tip={`<p>${tip}</p>`}
      >
        <Icon svg="picto-info" />
      </span>
    )
  }

  renderNumberFieldValue = readOnly => () => {
    if (readOnly) {
      return null
    }
    return (
      <span
        className="button tooltip tooltip-info"
        data-place="bottom"
        data-tip="<p>Laissez ce champ vide pour un nombre de places ou stock illimité.</p>"
      >
        <Icon svg="picto-info" />
      </span>
    )
  }

  render() {
    const { beginningDatetime, isEvent, readOnly, stock, timezone, venue, formProps } = this.props
    const { values } = formProps
    const { quantity } = values
    const { bookingsQuantity } = stock || {}

    const formattedRemainingQuantities = getFormattedRemainingQuantities(quantity, bookingsQuantity)

    const isRemainingQuantityValid =
      formattedRemainingQuantities || formattedRemainingQuantities == 0

    return (
      <Fragment>
        <td title="Gratuit si vide">
          <HiddenField
            name="offerId"
            type="hidden"
          />
          <HiddenField
            name="venueId"
            type="hidden"
          />
          <NumberField
            format={formatPrice(readOnly)}
            min="0"
            name="price"
            onBlur={this.handleOnPriceBlur}
            placeholder="Gratuit"
            readOnly={readOnly}
            title="Prix"
          />
        </td>
        <td
          className="tooltiped"
          title="Si ce champ est vide, les réservations seront possibles jusqu'à l'heure de début de l'événement. S'il est rempli, les réservations seront bloquées à 23h59 à la date saisie."
        >
          <DateField
            maxDate={isEvent ? moment(beginningDatetime) : undefined}
            name="bookingLimitDatetime"
            placeholder=""
            readOnly={readOnly}
            renderValue={this.renderDateFieldValue(readOnly, venue)}
            timezone={timezone}
          />
        </td>
        <td className="tooltiped">
          <NumberField
            format={createFormatAvailable()}
            min={bookingsQuantity}
            name="quantity"
            placeholder="Illimité"
            readOnly={readOnly}
            renderValue={this.renderNumberFieldValue(readOnly)}
            title="Stock total"
          />
        </td>

        {isRemainingQuantityValid ? (
          <td
            className="remaining-stock"
            id="remaining-stock"
          >
            {formattedRemainingQuantities}
          </td>
        ) : (
          <td className="remaining-stock" />
        )}

        <td
          className="bookings-count"
          id="bookings-count"
        >
          {bookingsQuantity}
        </td>
      </Fragment>
    )
  }
}

ProductFields.defaultProps = {
  beginningDatetime: null,
  isEvent: true,
  readOnly: true,
  stock: null,
  timezone: null,
}

ProductFields.propTypes = {
  assignModalConfig: PropTypes.func.isRequired,
  beginningDatetime: PropTypes.string,
  closeInfo: PropTypes.func.isRequired,
  formProps: PropTypes.shape().isRequired,
  hasIban: PropTypes.bool.isRequired,
  isEvent: PropTypes.bool,
  readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  showInfo: PropTypes.func.isRequired,
  stock: PropTypes.shape(),
  timezone: PropTypes.string,
  venue: PropTypes.shape().isRequired,
}

export default ProductFields
