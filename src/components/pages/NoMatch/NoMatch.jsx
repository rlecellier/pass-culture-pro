import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Icon from '../../layout/Icon'

const NoMatch = ({ redirect }) => (
  <div className="page fullscreen no-match">
    <Icon svg="ico-404" />
    <div className="nm-title">
      {'Oh non !'}
    </div>
    <div className="nm-subtitle">
      {"Cette page n'existe pas."}
    </div>
    <Link
      className="nm-redirection-link"
      to={redirect}
    >
      {"Retour à la page d'accueil"}
    </Link>
  </div>
)

NoMatch.defaultProps = {
  redirect: '/offres',
}

NoMatch.propTypes = {
  redirect: PropTypes.string,
}

export default NoMatch
