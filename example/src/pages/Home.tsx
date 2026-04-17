import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { AmplitudeAnalytics } from 'capacitor-sdk-amplitude'
import React, { useState } from 'react'

const Home: React.FC = () => {
  const [status, setStatus] = useState<string>('No action taken yet.')

  const handleInit = async () => {
    try {
      await AmplitudeAnalytics.init({
        apiKey: 'YOUR_API_KEY',
        serverZone: 'EU',
      })
      setStatus('init() succeeded.')
    } catch (e) {
      setStatus(`init() error: ${e}`)
    }
  }

  const handleSetUserId = async () => {
    try {
      await AmplitudeAnalytics.setUserId({ userId: 'test-user-id' })
      setStatus('setUserId() succeeded.')
    } catch (e) {
      setStatus(`setUserId() error: ${e}`)
    }
  }

  const handleTrack = async () => {
    try {
      await AmplitudeAnalytics.track({
        eventType: 'button_tapped',
        eventProperties: { screen: 'home' },
      })
      setStatus('track() succeeded.')
    } catch (e) {
      setStatus(`track() error: ${e}`)
    }
  }

  const handleReset = async () => {
    try {
      await AmplitudeAnalytics.reset()
      setStatus('reset() succeeded.')
    } catch (e) {
      setStatus(`reset() error: ${e}`)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Amplitude Plugin Demo</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className='ion-padding'>
        <IonList>
          <IonItem>
            <IonLabel>
              <h2>Status</h2>
              <IonNote>{status}</IonNote>
            </IonLabel>
          </IonItem>
        </IonList>

        <IonButton
          expand='block'
          onClick={handleInit}
          style={{ marginTop: '16px' }}
        >
          init(apiKey, serverZone: EU)
        </IonButton>

        <IonButton
          expand='block'
          onClick={handleSetUserId}
          style={{ marginTop: '8px' }}
        >
          setUserId(user-uuid-here)
        </IonButton>

        <IonButton
          expand='block'
          onClick={handleTrack}
          style={{ marginTop: '8px' }}
        >
          track(button_tapped)
        </IonButton>

        <IonButton
          expand='block'
          color='danger'
          onClick={handleReset}
          style={{ marginTop: '8px' }}
        >
          reset()
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Home
