import createCachedSelector from 're-reselect'

function mapArgsToCacheKey(state, eventId) {
  return eventId || ''
}

export const selectEventById = createCachedSelector(
  state => state.data.events,
  (state, eventId) => eventId,
  (events, eventId) => events.find(event => event.id === eventId)
)(mapArgsToCacheKey)

export default selectEventById