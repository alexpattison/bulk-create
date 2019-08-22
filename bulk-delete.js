import { humanReadableDate } from './helpers';

const bulkDelete = () => {
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
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanpiamRqcTJhNmVzMDg2NnlpbW11cjB2Iiwib3JnYW5pemF0aW9uSWQiOiJjanl5bjVzbTg2a2N3MDg2NmxscnJjNmZ3IiwiaWF0IjoxNTY2NTEyMTkwLCJleHAiOjE1NjcxMTY5OTB9.VgeiX00G--XFwYrktp-AOM6lgBBox03n5xBR-SOSEEE',
      'content-type': 'application/json',
      'sec-fetch-mode': 'cors'
    },
    referrer:
      'https://staging-app.labelbox.com/projects/cjyyn5sqm6keg0866cez9uact/labels/activity',
    referrerPolicy: 'no-referrer-when-downgrade',
    body: JSON.stringify({
      operationName: 'BulkDeleteLabels',
      variables: {
        makeTemplates: true,
        projectId: process.env.PROJECT_ID,
        pageSize: 10,
        skip: 0,
        labelsWhere: { createdBy: {}, dataRow: {}, type_in: ['Any', 'Skip'] }
      },
      query:
        'mutation BulkDeleteLabels($projectId: ID!, $makeTemplates: Boolean = false, $labelsWhere: WhereBulkLabelDelete, $first: PageSize, $skip: Int) {\\n  project(where: {id: $projectId}) {\\n    bulkDeleteLabels(where: $labelsWhere, makeTemplates: $makeTemplates, waitForQueue: true, first: $first, skip: $skip) {\\n      count\\n      success\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n'
    }),
    method: 'POST',
    mode: 'cors'
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
