import { recursiveMap, SubmitButton } from 'pass-culture-shared'
import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

const CreationControl = ({ parseFormChild }) =>
  recursiveMap(
    <div
      className="field is-grouped is-grouped-centered"
      style={{ justifyContent: 'space-between' }}
    >
      <div className="control">
        <NavLink
          className="button is-secondary is-medium"
          to="/structures"
        >
          {'Retour'}
        </NavLink>
      </div>
      <div className="control">
        <SubmitButton className="button is-primary is-medium">{'Valider'}</SubmitButton>
      </div>
    </div>,
    parseFormChild
  )

CreationControl.propTypes = {
  parseFormChild: PropTypes.func.isRequired
}

CreationControl.isParsedByForm = true

export default CreationControl