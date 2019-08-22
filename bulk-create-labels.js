import fetch from 'node-fetch';
import { variables, retryOnException } from './helpers';
import { getDatarows } from './data-rows';

const makeLabel = async ({ rowId, apiKey }) => {
  console.log(`Making label from dataRow: ${rowId}`);
  return fetch('https://staging-api.labelbox.com/graphql', {
    credentials: 'include',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
      'sec-fetch-mode': 'cors'
    },
    referrer:
      'https://staging-image-segmentation-v4.labelbox.com/?project=cjzispj1sc7oy0866nqsiworo',
    referrerPolicy: 'no-referrer-when-downgrade',
    body: JSON.stringify({
      query: `mutation CreateLabel(
      $label: String!,
      $secondsToLabel: Float!,
      $rowId: ID!,
      $projectId: ID!,
      $typeName: String!,
      $templateId: String,
    ){
    createLabel(
      data:{
        label: $label,
        secondsToLabel: $secondsToLabel,
        dataRow: {
          connect: {
            id: $rowId
          }
        },
        project: {
          connect: {
            id: $projectId
          }
        },
        type: {
          connect: {
            name: $typeName
          }
        },
        templateId: $templateId,
      }
    ) {
      id
      createdAt
      type{
        name
      }
    }
  }`,
      variables: {
        ...variables,
        rowId,
        secondsToLabel: 23.905,
        typeName: 'Any'
      }
    }),
    method: 'POST',
    mode: 'cors'
  }).catch((e) => {
    console.log('Error in make label');
    console.error(e);
  });
};

const makeLabels = async (dataRows = [], apiKey = process.env.API_KEY) => {
  if (dataRows.length === 0) {
    return [];
  }

  return dataRows.reduce(async (previousRequest, { id: rowId }) => {
    await previousRequest;
    return retryOnException(makeLabel, { apiKey, rowId });
  }, Promise.resolve());
};

const fetchAndMake = async () => {
  const dataRows = await getDatarows({ end: 20000 });

  return makeLabels(dataRows);
};

fetchAndMake();
