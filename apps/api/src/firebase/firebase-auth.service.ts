import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebase from 'firebase-admin';

@Injectable()
export class FirebaseAuthService {
  private defaultApp: firebase.app.App;
  constructor(private configService: ConfigService) {
    const creds = JSON.parse(this.configService.get('FIREBASE_AUTH_CREDS'));
    if (!firebase.apps.length) {
      this.defaultApp = firebase.initializeApp({
        credential: firebase.credential.cert(creds),
      });
    } else {
      this.defaultApp = firebase.apps[0];
    }
  }

  async validate(token: string) {
    const firebaseUser = await this.defaultApp
      .auth()
      .verifyIdToken(token, true);
    return firebaseUser;
  }
}
