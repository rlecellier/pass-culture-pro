import { DEMARCHES_SIMPLIFIEES_VENUE_RIB_UPLOAD_PROCEDURE_URL } from '../../../../../utils/config'
import React, { Fragment } from 'react'
import Icon from '../../../../layout/Icon'
import PropTypes from 'prop-types'

export const BicIbanFields = ({ iban, bic }) => (
  <Fragment>
    <a
      className="tertiary-link"
      href={DEMARCHES_SIMPLIFIEES_VENUE_RIB_UPLOAD_PROCEDURE_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Icon
        alt=""
        svg="ico-external-site"
      />
      {'Modifier'}
    </a>
    <p className="bi-subtitle">
      {
        'Les remboursements des offres éligibles présentées dans ce lieu sont effectués sur le compte ci-dessous :'
      }
    </p>
    <div className="vp-detail">
      <span>
        {'IBAN : '}
      </span>
      <span>
        {iban}
      </span>
    </div>
    <div className="vp-detail">
      <span>
        {'BIC : '}
      </span>
      <span>
        {bic}
      </span>
    </div>
  </Fragment>
)

BicIbanFields.propTypes = {
  bic: PropTypes.string.isRequired,
  iban: PropTypes.string.isRequired,
}
