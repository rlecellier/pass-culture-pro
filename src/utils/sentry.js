import * as Sentry from '@sentry/browser'

import { ENVIRONMENT_NAME, SENTRY_SERVER_URL } from './config'
import { version } from '../../package.json'

if (SENTRY_SERVER_URL) {
  Sentry.init({
    dsn: SENTRY_SERVER_URL,
    environment: ENVIRONMENT_NAME,
    release: version,
  })
}
