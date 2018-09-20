import get from 'lodash.get'
import { createSelector } from 'reselect'

export function errorKeyToFrenchKey(errorKey) {
  switch (errorKey) {
    case 'available':
      return 'Places'
    case 'beginningDatetime':
      return 'Date'
    case 'endDatetime':
      return 'Heure de fin'
    case 'price':
      return 'Prix'
    default:
      return
  }
}

export default createSelector(
  (state, eventOccurrenceIdOrNew) =>
    get(state, `errors.eventOccurrence${eventOccurrenceIdOrNew}`),
  (state, eventOccurrenceIdOrNew, stockIdOrNew) =>
    get(state, `errors.stock${stockIdOrNew}`),
  (eventOccurrenceErrors, stockErrors) => {
    const errors = Object.assign({}, eventOccurrenceErrors, stockErrors)
    const e = Object.keys(errors)
      .filter(errorKeyToFrenchKey)
      .reduce(
        (result, errorKey) =>
          Object.assign(
            { [errorKeyToFrenchKey(errorKey)]: errors[errorKey] },
            result
          ),
        null
      )
    return e
  }
)