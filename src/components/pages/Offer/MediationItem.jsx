import { Field, Form } from 'pass-culture-shared'
import React from 'react'

import { THUMBS_URL } from '../../../utils/config'

const MediationItem = ({ mediation }) => {
  const { id, isActive } = mediation || {}
  return (
    <Form
      action={`/mediations/${id}`}
      handleSuccessNotification={null}
      isAutoSubmit
      name={`mediation-${id}`}
      patch={mediation}
      Tag="li">
      <img
        alt={`accroche-${id}`}
        disabled={!isActive}
        src={`${THUMBS_URL}/mediations/${id}`}
      />
      <br />
      <br />
      <div className="columns is-centered">
        <Field name="isActive" type="checkbox" />
      </div>
    </Form>
  )
}

export default MediationItem