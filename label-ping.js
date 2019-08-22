import fetch from 'node-fetch';
import { humanReadableDate } from './helpers';

let max = 0;

const queryLabels = () => {
  const start = Date.now();
  console.log(`Start: ${start}`);
  return fetch('https://staging-api.labelbox.com/graphql', {
    credentials: 'include',
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9,la;q=0.8',
      authorization: `Bearer ${process.env.API_KEY} `,
      'content-type': 'application/json',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin'
    },
    referrer: 'https://staging-api.labelbox.com/graphql',
    referrerPolicy: 'no-referrer-when-downgrade',
    body: JSON.stringify({
      operationName: 'GetLabels',
      variables: { projectId: process.env.PROJECT_ID },
      query:
        'query GetLabels($projectId: ID!) {\\n  project(where: {id: $projectId}) {\\n    labels(skip: 0, first: 100) {\\n      id\\n    }\\n  }\\n}'
    }),
    method: 'POST',
    mode: 'cors'
  }).then(() => calculateMaxAndLog(start));
};

const calculateMaxAndLog = (start) => {
  const end = Date.now();
  const total = end - start;
  const readable = humanReadableDate();
  console.log(`End ${end}`);
  console.log(`Finished in ${total} ms`);

  if (total > max) {
    max = total;
    console.log(`New max latency of ${total} ms achieved at ${readable}`);
  }

  console.log(`Max Latency: ${max}`);
};

setInterval(queryLabels, 1000);
