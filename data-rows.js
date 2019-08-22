import fetch from 'node-fetch';
import { variables, tap } from './helpers';

const getPageOfDatarows = async (skip = 0) => {
  console.log(`Getting page ${skip} of dataRows`);
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
      operationName: null,
      variables: {
        ...variables,
        first: 100,
        skip
      },
      query: `
        query($projectId: ID!, $first: PageSize!, $skip: Int!) {
          project(where: { id: $projectId} ) {
            id
            dataRows(first: $first, skip: $skip) {
              id
            }
          }
        }
      `
    }),
    method: 'POST',
    mode: 'cors'
  })
    .then((response) => response.json())
    .then((data) => data.data.project.dataRows)
    .catch((e) => console.error(e));
};

export const getDatarows = async ({ start = 0, end = 40000 }) => {
  if (start >= end) {
    return [];
  }

  const page = await getPageOfDatarows(start);
  const rest = await getDatarows({ start: start + 100, end });
  const all = [...page, ...rest];

  return all;
};
