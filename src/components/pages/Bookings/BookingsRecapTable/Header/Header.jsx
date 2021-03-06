import React from 'react'
import PropTypes from 'prop-types'
import { pluralizeWord } from './utils/pluralizeWord'
import { CSVLink } from 'react-csv'
import generateBookingsCsvFile from '../utils/generateBookingsCsvFile'
import Icon from '../../../../layout/Icon'

const Header = ({ bookingsRecapFiltered, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bookings-header-loading">
        {'Chargement des réservations...'}
      </div>
    )
  } else {
    return (
      <div className="bookings-header">
        <span className="bookings-header-number">
          {`${bookingsRecapFiltered.length} ${pluralizeWord(
            bookingsRecapFiltered.length,
            'réservation'
          )}`}
        </span>
        <span className="bookings-header-csv-download">
          <CSVLink
            data={generateBookingsCsvFile(bookingsRecapFiltered)}
            filename="Réservations Pass Culture.csv"
            separator=";"
          >
            <Icon
              alt="Télécharger le CSV"
              svg="ico-download"
            />
            {'Télécharger le CSV'}
          </CSVLink>
        </span>
      </div>
    )
  }
}

Header.propTypes = {
  bookingsRecapFiltered: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default Header
