import * as bluebird from 'bluebird';
import * as google from 'googleapis';

const { CLIENT_SECRET, CLIENT_ID } = process.env;

const drive = google.drive('v3');

const filesList = bluebird.promisify(drive.files.list);
const fileGet = bluebird.promisify(drive.files.get);

export async function getFilesList(extensionsList: string[], auth: any) {
  const pageSize: number = 1000;
  const fields: string = 'nextPageToken, files(id, name)';
  const q: string = extensionsList.map(x => `fileExtension="${x}"`).join(' or ');

  const result = [];

  let isCompleted: boolean = false;
  let pageToken: string = null;

  while (!isCompleted) {
    const response = await filesList({
      auth,
      pageSize,
      pageToken,
      q,
      fields
    });

    result.push(...response.files);
    pageToken = response.nextPageToken;

    if (!pageToken) isCompleted = true;
  }

  return result;
}

export function getFileMetadata(fileId: number, auth: any) {
  return fileGet({
    auth,
    fileId,
    fields: 'id, name, mimeType, createdTime, modifiedTime'
  });
}

export function getAuthClient(credentials: any) {
  const authClient = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  authClient.setCredentials(credentials);
  return authClient;
}
