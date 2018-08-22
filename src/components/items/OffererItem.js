import get from 'lodash.get'
import { Icon } from 'pass-culture-shared'
import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import venuesSelector from '../../selectors/venues'
import { pluralize } from '../../utils/string'

const OffererItem = ({ offerer, venues }) => {
  const { id, name, isValidated } = offerer || {}

  const showPath = `/structures/${id}`
  return (
    <li className="offerer-item">
      <div className="list-content">
        <p className="name">
          <NavLink to={showPath}>{name}</NavLink>
        </p>
        <ul className="actions">
          {isValidated === false ? (
            <li className="is-italic">
              En cours de validation : vous allez recevoir un e-mail.
            </li>
          ) : (
            [
              // J'ai déja ajouté Un lieu mais pas d'offres
              venues.length ? (
                [
                  <li key={0}>
                    <NavLink
                      to={`/offres/nouveau?structure=${id}`}
                      className="has-text-primary">
                      <Icon svg="ico-offres-r" />
                      Nouvelle offre
                    </NavLink>
                  </li>,
                  // J'ai au moins 1 offre
                  offerer.nOccasions > 0 ? (
                    <li key={1}>
                      <NavLink
                        to={`/offres?structure=${id}`}
                        className="has-text-primary">
                        <Icon svg="ico-offres-r" />
                        {pluralize(offerer.nOccasions, 'offres')}
                      </NavLink>
                    </li>
                  ) : (
                    <li key={2}>0 offre</li>
                  ),
                ]
              ) : (
                <li className="is-italic" key={0}>
                  Créez un lieu pour pouvoir y associer des offres.
                </li>
              ),
              // J'ai ajouté un lieu
              venues.length ? (
                <li key={4}>
                  <Icon svg="ico-venue" />
                  {pluralize(venues.length, 'lieux')}
                </li>
              ) : (
                // je n'ai pas encore ajouté de lieu
                <li key={4}>
                  <NavLink
                    to={`/structures/${get(offerer, 'id')}/lieux/nouveau`}
                    className="has-text-primary">
                    <Icon svg="ico-venue-r" /> Ajouter un lieu
                  </NavLink>
                </li>
              ),
            ]
          )}
        </ul>
      </div>
      <div className="caret">
        <NavLink to={showPath}>
          <Icon svg="ico-next-S" />
        </NavLink>
      </div>
    </li>
  )
}

export default connect(() => {
  return (state, ownProps) => ({
    venues: venuesSelector(state, ownProps.offerer.id),
  })
})(OffererItem)