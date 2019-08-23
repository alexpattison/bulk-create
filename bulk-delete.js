import { humanReadableDate, tap } from './helpers';
import fetch from 'node-fetch';

export const bulkDelete = () => {
  const start = Date.now();
  console.log(
    `Starting bulkDelete operation on project ${
      process.env.PROJECT_ID
    } at ${humanReadableDate()}`
  );

  return fetch('https://staging-api.labelbox.com/graphql', {
    credentials: 'include',
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9,la;q=0.8',
      authorization: `Bearer ${process.env.API_KEY}`,
      'content-type': 'application/json'
    },
    referrer: 'https://staging-api.labelbox.com/graphql',
    body: JSON.stringify({
      operationName: 'BulkDeleteLabels',
      variables: {
        makeTemplates: true,
        projectId: process.env.PROJECT_ID,
        labelsWhere: {}
      },
      query: `mutation
        BulkDeleteLabels($projectId: ID!, $makeTemplates: Boolean, $labelsWhere: WhereBulkLabelDelete) {
          project(where: {id: $projectId}) {
            bulkDeleteLabels(where: $labelsWhere, makeTemplates: $makeTemplates, waitForQueue: true) {
              count
              success
            }
          }
        }
      `
    }),
    method: 'POST'
  }).then(() => logEnd(start));
};

const logEnd = (start) => {
  const end = Date.now();
  const total = end - start;
  console.log(
    `Finished bulkDelete operation on project ${
      process.env.PROJECT_ID
    } at ${humanReadableDate()}`
  );
  console.log(`bulkDelete took ${total} ms to complete`);
};
