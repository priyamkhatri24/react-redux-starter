// we are builidng URLS hence disabling max-len for the file
/* eslint-disable max-len */

import * as sha1 from 'js-sha1';
import { post, apiValidation, get } from '../../Utilities';

export function createBigBlueButtonStream(
  batches,
  duration,
  clientUserId,
  clientId,
  firstName,
  lastName,
) {
  const payload = {
    batch_array: batches,
    duration,
    client_user_id: clientUserId,
    client_id: clientId,
  };

  post(payload, '/addBigBlueButtonLiveStreamLatest')
    .then((res) => {
      const result = apiValidation(res);
      const stringName = `${firstName.trim()} ${lastName.trim()}`;
      const name = stringName.replace(' ', '%20').trim();
      const meetingUrl = result.meeting_url;
      const { secret } = result;
      if (result) {
        const joinChecksum = sha1(
          `joinfullName=${name}&meetingID=${result.meeting_id}&userID=${clientUserId}&password=${result.moderator_password}&allowStartStopRecording=true&redirect=true${secret}`,
        );

        window.open(
          `${meetingUrl}bigbluebutton/api/join?fullName=${name}&meetingID=${result.meeting_id}&userID=${clientUserId}&password=${result.moderator_password}&allowStartStopRecording=true&redirect=true&checksum=${joinChecksum}`,
          '_blank',
        );
      } else {
        console.log('Could not execute BBB');
      }
    })
    .catch((e) => console.error(e));
}

export function rejoinBigBlueButtonStream(firstName, lastName, streamId, clientUserId, role) {
  const stringName = `${firstName.trim()} ${lastName.trim()}`;
  const name = stringName.replace(' ', '%20').trim();

  get({ stream_id: streamId }, '/joinLiveStreamLatest')
    .then((res) => {
      const result = apiValidation(res);
      let password = '';
      if (role === 'teacher') password = result.moderator_password;
      else if (role === 'student') password = result.attendee_password;
      const joinChecksum = sha1(
        `joinfullName=${name}&meetingID=${result.meeting_id}&userID=${clientUserId}&password=${password}&allowStartStopRecording=true&redirect=true${result.secret}`,
      );

      window.open(
        `${result.meeting_url}bigbluebutton/api/join?fullName=${name}&meetingID=${result.meeting_id}&userID=${clientUserId}&password=${password}&allowStartStopRecording=true&redirect=true&checksum=${joinChecksum}`,
        '_blank',
      );
    })
    .catch((e) => console.error(e));
}
