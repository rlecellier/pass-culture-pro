import classnames from 'classnames'
import get from 'lodash.get'
import { requestData, showNotification, withLogin } from 'pass-culture-shared'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { compose } from 'redux'

import HeroSection from '../../layout/HeroSection'
import Main from '../../layout/Main'
import UploadThumb from '../../layout/UploadThumb'
import mediationSelector from '../../../selectors/mediation'
import offerSelector from '../../../selectors/offer'
import offererSelector from '../../../selectors/offerer'
import venueSelector from '../../../selectors/venue'
import {
  mediationNormalizer,
  offerNormalizer,
} from '../../../utils/normalizers'

class Mediation extends Component {
  constructor() {
    super()
    this.state = {
      croppingRect: null,
      inputUrl: '',
      imageUrl: null,
      image: null,
      isLoading: false,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      match: {
        params: { mediationId },
      },
    } = nextProps
    return {
      imageUrl: prevState.imageUrl || get(nextProps, 'mediation.thumbPath'),
      isNew: mediationId === 'nouveau',
    }
  }

  static defaultProps = {
    type: 'image',
    imageUploadSize: 400,
    imageUploadBorder: 25,
  }

  handleDataRequest = (handleSuccess, handleFail) => {
    const {
      dispatch,
      match: {
        params: { mediationId, offerId },
      },
      offer,
    } = this.props
    const { isNew } = this.state
    !offer &&
      dispatch(
        requestData('GET', `offers/${offerId}`, {
          normalizer: offerNormalizer,
        })
      )
    if (!isNew) {
      dispatch(
        requestData('GET', `mediations/${mediationId}`, {
          handleSuccess,
          handleFail,
          normalizer: mediationNormalizer,
        })
      )
      return
    }
    handleSuccess()
  }

  handleFailData = (state, action) => {
    const { dispatch, history, offer } = this.props

    this.setState({ isLoading: false }, () => {
      history.push(`/offres/${offer.id}`)
      dispatch(
        showNotification({
          text: get(action, 'errors.thumb[0]'),
          type: 'fail',
        })
      )
    })
  }

  handleSuccessData = (state, action) => {
    const { dispatch, history, offer } = this.props

    this.setState({ isLoading: false }, () => {
      history.push(`/offres/${offer.id}`)
      dispatch(
        showNotification({
          text: 'Votre accroche a bien été enregistrée',
          type: 'success',
        })
      )
    })
  }

  onImageChange = (context, image, croppingRect) => {
    this.setState({
      image,
      croppingRect,
    })
    this.drawRectangles(context)
  }

  drawRectangles = ctx => {
    const { imageUploadBorder, imageUploadSize } = this.props

    const size =
      window.devicePixelRatio * (imageUploadSize + 2 * imageUploadBorder)
    const firstDimensions = [
      imageUploadBorder + size / 32,
      imageUploadBorder + size / 32,
      size - 2 * (imageUploadBorder + size / 32),
      size - 2 * (imageUploadBorder + size / 32),
    ]

    const secondDimensions = [
      imageUploadBorder + size / 7.5,
      imageUploadBorder + size / 20,
      size - 2 * (imageUploadBorder + size / 7.5),
      size - 2 * (imageUploadBorder + size / 20),
    ]

    const thirdDimensions = [
      imageUploadBorder + size / 6,
      imageUploadBorder + size / 4.5,
      size - 2 * (imageUploadBorder + size / 6),
      size / 2.7 - 2 * imageUploadBorder,
    ]

    // First violet rectangle
    ctx.beginPath()
    ctx.lineWidth = '7'
    ctx.strokeStyle = 'white'
    ctx.rect(...firstDimensions)
    ctx.stroke()
    ctx.beginPath()
    ctx.lineWidth = '3'
    ctx.strokeStyle = '#b921d7'
    ctx.rect(...firstDimensions)
    ctx.stroke()

    // Second green rectangle
    ctx.beginPath()
    ctx.lineWidth = '7'
    ctx.strokeStyle = 'white'
    ctx.rect(...secondDimensions)
    ctx.stroke()
    ctx.beginPath()
    ctx.lineWidth = '3'
    ctx.strokeStyle = '#4CD964'
    ctx.rect(...secondDimensions)
    ctx.stroke()

    // Third blue rectangle
    ctx.beginPath()
    ctx.lineWidth = '7'
    ctx.strokeStyle = 'white'
    ctx.rect(...thirdDimensions)
    ctx.stroke()
    ctx.beginPath()
    ctx.lineWidth = '3'
    ctx.strokeStyle = '#54c7fc'
    ctx.rect(...thirdDimensions)
    ctx.stroke()
  }

  onOkClick = e => {
    this.state.inputUrl &&
      this.setState({
        image: null,
        imageUrl: this.state.inputUrl,
      })
  }

  onSubmit = () => {
    const { dispatch, match, mediation, offerer } = this.props
    const { croppingRect, image, credit, isNew } = this.state

    const offererId = get(offerer, 'id')
    const offerId = match.params.offerId

    const body = new FormData()
    body.append('offererId', offererId)
    body.append('offerId', offerId)
    body.append('credit', credit)
    if (typeof image === 'string') {
      body.append('thumbUrl', image)
    } else {
      body.append('thumb', image)
    }
    body.append('croppingRect[x]', croppingRect.x)
    body.append('croppingRect[y]', croppingRect.y)
    body.append('croppingRect[width]', croppingRect.width)
    body.append('croppingRect[height]', croppingRect.height)

    this.setState({ isLoading: true })

    dispatch(
      requestData(
        isNew ? 'POST' : 'PATCH',
        `mediations${isNew ? '' : `/${get(mediation, 'id')}`}`,
        {
          body,
          encode: 'multipart/form-data',
          handleFail: this.handleFailData,
          handleSuccess: this.handleSuccessData,
          key: 'mediations',
        }
      )
    )
  }

  onUrlChange = event => {
    this.setState({ inputUrl: event.target.value })
  }

  onUploadClick = event => {
    this.setState({
      image: this.$uploadInput.files[0],
      imageUrl: null,
      inputUrl: '',
    })
  }

  render() {
    const {
      imageUploadSize,
      imageUploadBorder,
      match: {
        params: { offerId },
      },
      mediation,
    } = this.props
    const { image, credit, imageUrl, inputUrl, isLoading, isNew } = this.state
    const backPath = `/offres/${offerId}`

    const $imageSections = (image || imageUrl) && (
      <Fragment>
        <div className="section">
          <p className="mb12">Pour obtenir le meilleur effet:</p>
          <ul>
            <li className="mb12">
              1. Votre visuel doit remplir le cadre violet
            </li>
            <li className="mb12">
              2. Les élèments importants du visuel doivent se situer dans la{' '}
              <b>
                zone verte : c'est la première vision de l'offre qu'aura
                l'utilisateur.
              </b>
            </li>
          </ul>
          La zone bleue représente le cadrage de l'image dans la fiche détails.
        </div>
        <div className="section columns">
          <div className="column is-three-quarters">
            <UploadThumb
              border={imageUploadBorder}
              borderRadius={0}
              collectionName="mediations"
              entityId={get(mediation, 'id')}
              hasExistingImage={!isNew}
              height={imageUploadSize}
              image={image || imageUrl}
              index={0}
              width={imageUploadSize}
              readOnly
              required
              onImageChange={this.onImageChange}
              storeKey="mediations"
              type="thumb"
            />
          </div>
          <div className="column is-one-quarter">
            <div className="section">
              <h6>Exemple :</h6>
              <img
                src="/mediation-example.png"
                title="Exemple de cadrage"
                alt="Explication"
              />
            </div>
          </div>
        </div>
        <div className="section">
          <div className="field-group">
            <div className="field">
              <label className="label">Crédit photo</label>
              <input
                id="mediation-credit"
                type="text"
                className="input is-rounded"
                value={credit}
                onChange={e => this.setState({ credit: e.target.value })}
              />
            </div>
          </div>
        </div>
        <hr />
        <div
          className="field is-grouped is-grouped-centered"
          style={{ justifyContent: 'space-between' }}>
          <div className="control">
            <NavLink
              to={backPath}
              className="button is-primary is-outlined is-medium">
              Annuler
            </NavLink>
          </div>
          <div className="control">
            <button
              className={classnames('button is-primary is-medium', {
                'is-loading': isLoading,
              })}
              disabled={!image}
              onClick={this.onSubmit}>
              Valider
            </button>
          </div>
        </div>
      </Fragment>
    )

    return (
      <Main
        name="mediation"
        backTo={{ path: backPath, label: "Revenir à l'offre" }}
        handleDataRequest={this.handleDataRequest}>
        <HeroSection title={`${isNew ? 'Créez' : 'Modifiez'} une accroche`}>
          <p className="subtitle">
            Ajoutez un visuel marquant pour mettre en avant cette offre.
            <br />
            <span className="label">Le fichier doit peser 100Ko minimum.</span>
          </p>
        </HeroSection>

        <div className="section">
          <label className="label">Depuis une adresse Internet :</label>
          <div className="field is-grouped">
            <p className="control is-expanded">
              <input
                type="url"
                className="input is-rounded"
                placeholder="URL du fichier"
                value={inputUrl}
                onChange={this.onUrlChange}
              />
            </p>
            <p className="control">
              <button
                className="button is-primary is-outlined is-medium"
                onClick={this.onOkClick}>
                OK
              </button>
            </p>
          </div>
        </div>

        <div className="section">
          <label className="label">...ou depuis votre poste :</label>
          <label className="button is-primary is-outlined">
            Choisir un fichier{' '}
            <input
              hidden
              onChange={this.onUploadClick}
              ref={$element => (this.$uploadInput = $element)}
              type="file"
            />
          </label>
        </div>
        {$imageSections}
      </Main>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const offer = offerSelector(state, ownProps.match.params.offerId)
  const venue = venueSelector(state, get(offer, 'venueId'))
  return {
    offer,
    offerer: offererSelector(state, get(venue, 'managingOffererId')),
    mediation: mediationSelector(state, ownProps.match.params.mediationId),
  }
}

export default compose(
  withLogin({ failRedirect: '/connexion' }),
  withRouter,
  connect(mapStateToProps)
)(Mediation)