import fetch from 'node-fetch';
import { humanReadableDate, tap } from './helpers';

export const pingLabels = (function() {
  let max = 0;
  console.log(`Pinging labels on project ${process.env.PROJECT_ID}`);

  const queryLabels = () => {
    const start = Date.now();
    return fetch('https://staging-api.labelbox.com/graphql', {
      credentials: 'include',
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9,la;q=0.8',
        authorization: `Bearer ${process.env.API_KEY}`,
        'content-type': 'application/json',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      },
      referrer: 'https://staging-api.labelbox.com/graphql',
      referrerPolicy: 'no-referrer-when-downgrade',
      body: JSON.stringify({
        operationName: 'GetLabels',
        variables: { projectId: process.env.PROJECT_ID },
        query: `query GetLabels($projectId: ID!) {
            project(where: {id: $projectId}) {
              labels(skip: 0, first: 100) {
                id
              }
            }
          }`
      }),
      method: 'POST',
      mode: 'cors'
    }).then(() => calculateMaxAndLog(start));
  };

  const calculateMaxAndLog = (start) => {
    const end = Date.now();
    const total = end - start;
    const readable = humanReadableDate();
    console.log(`Finished in ${total} ms`);

    if (total > max) {
      max = total;
      console.log(`New max latency of ${total} ms achieved at ${readable}`);
    }

    console.log(`Max Latency: ${max} ms`);
  };

  return setInterval(queryLabels, 1000);
})();
