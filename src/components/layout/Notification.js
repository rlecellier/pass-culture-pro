import classnames from 'classnames'
import get from 'lodash.get'
import { closeNotification, Icon } from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'

class Notification extends Component {
  componentDidUpdate() {
    const { notification } = this.props
    if (get(notification, 'tooltip')) {
      ReactTooltip.rebuild()
    }
  }

  render() {
    const { dispatch, isFullscreen, notification } = this.props
    const { text, tooltip, type } = notification || {}

    let svg
    if (type === 'success') {
      svg = 'picto-validation'
    } else if (type === 'warning') {
      svg = 'picto-warning'
    } else if (type === 'info') {
      svg = 'picto-info'
    } else {
      svg = 'picto-echec'
    }

    if (!notification) {
      return <div />
    }

    return (
      <div
        className={classnames(`notification is-${type || 'info'}`, {
          fullscreen: isFullscreen,
          columns: !isFullscreen,
        })}>
        <div
          className={classnames('container', {
            column: !isFullscreen,
          })}>
          <span className="mr12">
            <Icon svg={svg} />
          </span>
          <span>{text}</span>
        </div>
        {tooltip ? (
          <span
            className={classnames({
              'column is-2': !isFullscreen,
            })}
            data-place={tooltip.place}
            data-tip={tooltip.tip}
            data-type={tooltip.type}>
            {tooltip.children}
          </span>
        ) : (
          <button
            className={classnames('close', {
              'column is-1': !isFullscreen,
            })}
            onClick={() => dispatch(closeNotification())}>
            OK
          </button>
        )}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    notification: state.notification,
  }
}

export default connect(mapStateToProps)(Notification)