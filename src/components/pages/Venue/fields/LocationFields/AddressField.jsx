import classnames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import { composeValidators } from 'react-final-form-utils'

import LocationViewer from './LocationViewer'
import FieldErrors from '../../../../layout/form/FieldErrors'
import getRequiredValidate from '../../../../layout/form/utils/getRequiredValidate'

const updateLocationFields = (form, { isLocationFrozen }) => location => {
  form.batch(() => {
    const { address, city, latitude, longitude, postalCode } = location
    form.change('address', address)
    form.change('city', city)
    form.change('isLocationFrozen', isLocationFrozen)
    form.change('latitude', latitude)
    form.change('longitude', longitude)
    form.change('postalCode', postalCode)
  })
}

export const AddressFieldRender = ({
  className,
  disabled,
  form,
  id,
  innerClassName,
  label,
  name,
  placeholder,
  readOnly,
  required,
  addressProps,
}) => ({ input, meta }) => (
  <div
    className={classnames('field text-field', className, {
      'is-label-aligned': label,
      'is-read-only': readOnly,
    })}
    id={id}
  >
    <label
      className={classnames('field-label', { empty: !label })}
      htmlFor={name}
    >
      {label && (
        <span>
          <span>
            {label}
          </span>
          {required && !readOnly &&
          <span className="field-asterisk">
            {'*'}
          </span>}
        </span>
      )}
    </label>
    <div className="field-control">
      <div className="field-value flex-columns items-center">
        <div className={classnames('field-inner flex-columns items-center', innerClassName)}>
          <LocationViewer
            {...input}
            {...addressProps}
            className="field-input field-address"
            disabled={disabled || readOnly}
            name={name}
            onMarkerDragend={updateLocationFields(form, {
              isLocationFrozen: false,
            })}
            onSuggestionSelect={updateLocationFields(form, {
              isLocationFrozen: true,
            })}
            onTextChange={updateLocationFields(form, {
              isLocationFrozen: false,
            })}
            placeholder={readOnly ? '' : placeholder}
            readOnly={readOnly}
            required={!!required}
          />
        </div>
      </div>
      <FieldErrors meta={meta} />
    </div>
    <div />
  </div>
)

export const AddressField = ({
  className,
  disabled,
  form,
  format,
  id,
  innerClassName,
  label,
  name,
  placeholder,
  readOnly,
  required,
  validate,
  ...addressProps
}) => (
  <Field
    format={format}
    name={name}
    render={AddressFieldRender({
      className,
      disabled,
      form,
      id,
      innerClassName,
      label,
      name,
      placeholder,
      readOnly,
      required,
      addressProps,
    })}
    validate={composeValidators(validate, getRequiredValidate(required))}
  />
)

AddressField.defaultProps = {
  className: '',
  disabled: false,
  format: null,
  id: null,
  innerClassName: null,
  label: '',
  placeholder: '',
  readOnly: false,
  required: false,
  validate: null,
}

AddressField.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  form: PropTypes.shape().isRequired,
  format: PropTypes.func,
  id: PropTypes.string,
  innerClassName: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  validate: PropTypes.func,
}

export default AddressField
