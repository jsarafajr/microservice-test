declare module 'googleapis' {
  export function drive(version: string): Drive

  interface Oauth2Client {
    setCredentials(credentials: any): void
  }

  export const auth: Auth;

  interface Auth {
    OAuth2: Oauth2Constructor
  }

  interface Oauth2Constructor {
    new (GoogleClientId: string, GoogleClientSecret: string): Oauth2Client
  }

  interface DriveFiles {
    list(options: any, callback: FilesListResponseCallback): void,
    get(options: any, callback: FilesListResponseCallback): void
  }

  export interface Drive {
    files: DriveFiles
  }

  interface FilesListResponseCallback {
    (error: Error, response: FilesListResponse): void
  }

  interface FilesListResponse {
    files: any[],
    nextPageToken: string
  }
}