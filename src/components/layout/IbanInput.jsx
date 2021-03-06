import { BasicInput, mergeErrors, removeWhitespaces } from 'pass-culture-shared'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { isValidIBAN, friendlyFormatIBAN } from 'ibantools'

class IbanInput extends PureComponent {
  handleOnChange = event => {
    const { dispatch, onChange: onFieldChange } = this.props
    event.persist()
    const value = removeWhitespaces(event.target.value)
    onFieldChange(value, { event })

    if (!isValidIBAN(value)) {
      dispatch(mergeErrors('offerer', { iban: ['IBAN invalide'] }))
    }
  }

  render() {
    const { value } = this.props

    return (
      <BasicInput
        {...this.props}
        onChange={this.handleOnChange}
        type="text"
        value={friendlyFormatIBAN(value)}
      />
    )
  }
}

IbanInput.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

export default connect()(IbanInput)
