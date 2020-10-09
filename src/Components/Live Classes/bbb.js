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

  post(payload, '/addBigBlueButtonLiveStream')
    .then((res) => {
      const result = apiValidation(res);
      const stringName = `${firstName.trim()} ${lastName.trim()}`;
      const name = stringName.replace(' ', '%20').trim();
      if (result) {
        const joinChecksum = sha1(
          `joinfullName=${name}&meetingID=${result.meeting_id}&userID=${clientUserId}&password=${result.moderator_password}&allowStartStopRecording=true&redirect=true3L3ge85tg64smJueuHlp9tEB5Bjxp3NTj4oygr6aT8`,
        );

        window.open(
          `https://live.ingeniumedu.com/bigbluebutton/api/join?fullName=${name}&meetingID=${result.meeting_id}&userID=${clientUserId}&password=${result.moderator_password}&allowStartStopRecording=true&redirect=true&checksum=${joinChecksum}`,
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

  get({ stream_id: streamId }, '/joinLiveStream')
    .then((res) => {
      const result = apiValidation(res);
      let password = '';
      if (role === 'teacher') password = result.moderator_password;
      else if (role === 'student') password = result.attendee_password;
      const joinChecksum = sha1(
        `joinfullName=${name}&meetingID=${result.meeting_id}&userID=${clientUserId}&password=${password}&allowStartStopRecording=true&redirect=true3L3ge85tg64smJueuHlp9tEB5Bjxp3NTj4oygr6aT8`,
      );

      window.open(
        `https://live.ingeniumedu.com/bigbluebutton/api/join?fullName=${name}&meetingID=${result.meeting_id}&userID=${clientUserId}&password=${password}&allowStartStopRecording=true&redirect=true&checksum=${joinChecksum}`,
        '_blank',
      );
    })
    .catch((e) => console.error(e));
}
