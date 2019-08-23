import { pingLabels } from './label-ping';
import { sleep } from './helpers';
import { bulkDelete } from './bulk-delete';

const logAndDelete = async () => {
  console.log(
    '*****************************************************************'
  );
  await sleep(10 * 1000);
  await bulkDelete();
  await sleep(10 * 1000);
  clearInterval(pingLabels);
  console.log(
    '*****************************************************************'
  );
};

logAndDelete();
