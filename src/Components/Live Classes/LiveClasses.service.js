import { post, apiValidation } from '../../Utilities';

export function createJitsiStream(batches = [], duration, clientId, clientUserId) {
  const streamLink = `${Date.now()}${clientId}${clientUserId}`;

  const payload = {
    stream_link: streamLink,
    duration,
    client_user_id: clientUserId,
    batch_array: batches,
    client_id: clientId,
  };

  post(payload, '/addLiveStream')
    .then((res) => {
      const result = apiValidation(res);
      console.log(result);
    })
    .catch((e) => {
      console.error(e);
    });
}
