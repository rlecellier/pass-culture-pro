import React from 'react'
import InputWithCalendar from './InputWithCalendar'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import { EMPTY_FILTER_VALUE } from './_constants'

const FilterByEventDate = ({ isDisabled, updateFilters, selectedOfferDate }) => {
  function handleOfferDateChange(offerDate) {
    const dateToFilter = offerDate === null ? EMPTY_FILTER_VALUE : offerDate.format('YYYY-MM-DD')
    const updatedFilter = { offerDate: dateToFilter }
    const updatedSelectedContent = { selectedOfferDate: offerDate }
    updateFilters(updatedFilter, updatedSelectedContent)
  }

  return (
    <div className="fw-offer-date">
      <label
        className="fw-offer-date-label"
        htmlFor="select-filter-date"
      >
        {"Date de l'évènement"}
      </label>
      <div className="fw-offer-date-picker">
        <DatePicker
          className="fw-offer-date-input"
          customInput={
            <InputWithCalendar customClass={`field-date-only ${isDisabled ? 'disabled' : ''}`} />
          }
          disabled={isDisabled}
          dropdownMode="select"
          id="select-filter-date"
          onChange={handleOfferDateChange}
          placeholderText="JJ/MM/AAAA"
          selected={selectedOfferDate}
        />
      </div>
    </div>
  )
}

FilterByEventDate.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  selectedOfferDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]).isRequired,
  updateFilters: PropTypes.func.isRequired,
}

export default FilterByEventDate
