import deepGet from 'lodash/get';
import unescape from 'lodash/unescape';
import round from 'lodash/round';
import Store from '../store';
import appConfig from '../constants/AppConfig';

let CurrentUser;
import('../models/CurrentUser').then((imports) => {
  CurrentUser = imports.default;
});

class ReduxGetters {
  getHomeFeedUserId(id, state) {
    state = state || Store.getState();
    return deepGet(state, `home_feed_entities.id_${id}.payload.user_id`);
  }

  getHomeFeedVideoId(id, state) {
    state = state || Store.getState();
    return deepGet(state, `home_feed_entities.id_${id}.payload.video_id`);
  }

  getVideoUrl(id, state) {
    state = state || Store.getState();
    return (
      deepGet(state, `video_entities.id_${id}.resolutions.${appConfig.videoConstant.videoWidth}.url`) ||
      deepGet(state, `video_entities.id_${id}.resolutions.original.url`)
    );
  }

  getUser(id, state) {
    state = state || Store.getState();
    return deepGet(state, `user_entities.id_${id}`);
  }

  getUserProfile(id, state) {
    state = state || Store.getState();
    return deepGet(state, `user_profile_entities.id_${id}`);
  }

  getVideoImgUrl(id, state, size) {
    state = state || Store.getState();
    size = size || appConfig.videoConstant.videoImageWidth;
    let posterImageId = deepGet(state, `video_entities.id_${id}.poster_image_id`);
    return (
      deepGet(state, `image_entities.id_${posterImageId}.resolutions.${size}.url`) ||
      deepGet(state, `image_entities.id_${posterImageId}.resolutions.original.url`)
    );
  }

  getUserName(id, state) {
    state = state || Store.getState();
    return deepGet(state, `user_entities.id_${id}.user_name`);
  }

  getName(id, state) {
    state = state || Store.getState();
    return unescape(deepGet(state, `user_entities.id_${id}.name`));
  }

  getUserActivationStatus(id, state) {
    state = state || Store.getState();
    return deepGet(state, `user_entities.id_${id}.ost_status`);
  }

  isCreatorApproved(id, state) {
    state = state || Store.getState();
    return deepGet(state, `user_entities.id_${id}.approved_creator`);
  }

  getBio(id, state) {
    state = state || Store.getState();
    return unescape(deepGet(state, `user_profile_entities.id_${id}.bio.text`));
  }

  getEmail(id, state) {
    state = state || Store.getState();
    return deepGet(state, `user_profile_entities.id_${id}.email.text`);
  }

  getVideoSupporters(id, state) {
    state = state || Store.getState();
    return deepGet(state, `video_stat_entities.id_${id}.total_contributed_by`);
  }

  getVideoBt(id, state) {
    state = state || Store.getState();
    return deepGet(state, `video_stat_entities.id_${id}.total_amount_raised_in_wei`);
  }

  getVideoStats(id, state) {
    state = state || Store.getState();
    return deepGet(state, `video_stat_entities.id_${id}`);
  }

  getVideoDescription(id, state) {
    state = state || Store.getState();
    return unescape(deepGet(state, `video_description_entities.id_${id}.text`));
  }

  getVideoDescriptionId(id, state) {
    state = state || Store.getState();
    return deepGet(state, `video_stat_entities.id_${id}.description_id`);
  }

  getVideoLink(id, state) {
    state = state || Store.getState();
    return unescape(deepGet(state, `link_entities.id_${id}.url`));
  }

  getVideoLinkId(id, state) {
    state = state || Store.getState();
    return deepGet(state, `video_stat_entities.id_${id}.link_ids[0]`);
  }

  isVideoSupported(id, state) {
    state = state || Store.getState();
    let val = deepGet(state, `video_contribution_entities.id_${id}`);
    val = val && Number(val);
    return !!val && CurrentUser.getUserId();
  }

  getUserSupporters(id, state) {
    state = state || Store.getState();
    return deepGet(state, `user_stat_entities.id_${id}.total_contributed_by`);
  }

  getVideoSupporters(id, state) {
    state = state || Store.getState();
    return deepGet(state, `video_stat_entities.id_${id}.total_contributed_by`);
  }

  getUsersSupporting(id, state) {
    state = state || Store.getState();
    return deepGet(state, `user_stat_entities.id_${id}.total_contributed_to`);
  }

  getUsersBt(id, state) {
    state = state || Store.getState();
    return deepGet(state, `user_stat_entities.id_${id}.total_amount_raised_in_wei`);
  }

  getRecordedVideo() {
    return deepGet(Store.getState(), `recorded_video`);
  }

  getRecordedVideoCurrentProcess() {
    let processing = [];
    if (deepGet(Store.getState(), `recorded_video.cover_capture_processing`)) {
      processing.push('cover is capturing');
    }
    if (deepGet(Store.getState(), `recorded_video.cover_s3_upload_processing`)) {
      processing.push('cover is uploading');
    }
    if (deepGet(Store.getState(), `recorded_video.compression_processing`)) {
      processing.push('video is compressing');
    }
    if (deepGet(Store.getState(), `recorded_video.video_s3_upload_processing`)) {
      processing.push('video is uploading');
    }
    return processing.join(', ');
  }

  getUserCoverVideoId(id, state) {
    state = state || Store.getState();
    if (deepGet(state, `user_profile_entities.id_${id}.cover_video_id`)) {
      return deepGet(state, `user_profile_entities.id_${id}.cover_video_id`);
    } else if (deepGet(state, `recorded_video.cover_video_id`)) {
      return deepGet(state, `recorded_video.cover_video_id`);
    }
  }

  getUserCoverImageId(id, state) {
    state = state || Store.getState();
    if (deepGet(state, `user_profile_entities.id_${id}.cover_image_id`)) {
      return deepGet(state, `user_profile_entities.id_${id}.cover_image_id`);
    } else if (deepGet(state, `recorded_video.cover_image_id`)) {
      return deepGet(state, `recorded_video.cover_image_id`);
    }
  }

  getCurrentUserProfile(state) {
    state = state || Store.getState();
    return deepGet(state, `user_profile_entities.id_${CurrentUser.getUserId()}`);
  }

  getImage(id, state, size) {
    state = state || Store.getState();
    size = size || 'original';
    return deepGet(state, `image_entities.id_${id}.resolutions.${size}.url`);
  }

  getUserVideoId(id, state) {
    state = state || Store.getState();
    return deepGet(state, `user_video_entities.id_${id}.payload.video_id`);
  }

  getUserVideoUserId(id, state) {
    state = state || Store.getState();
    return deepGet(state, `user_video_entities.id_${id}.payload.user_id`);
  }

  getProfileImage(id, state) {
    state = state || Store.getState();
    return (
      deepGet(state, `image_entities.id_${id}.resolutions.${appConfig.profileImageConstants.imageWidth}.url`) ||
      deepGet(state, `image_entities.id_${id}.resolutions.original.url`)
    );
  }

  getUserLinkId(id, state) {
    state = state || Store.getState();
    return deepGet(state, `user_profile_entities.id_${id}.link_ids[0]`);
  }

  getLink(id, state) {
    state = state || Store.getState();
    return unescape(deepGet(state, `link_entities.id_${id}.url`));
  }

  getVideoTimeStamp(id, state) {
    state = state || Store.getState();
    return deepGet(state, `video_entities.id_${id}.uts`);
  }

  getProfileImageId(id, state) {
    state = state || Store.getState();
    return deepGet(state, `user_entities.id_${id}.profile_image_id`);
  }

  getVideoUploadUTS(id, state) {
    state = state || Store.getState();
    return deepGet(state, `video_entities.id_${id}.uts`);
  }

  getVideoSize(id, state, size) {
    state = state || Store.getState();
    size = size || 'original';
    let byteSize = deepGet(state, `video_entities.id_${id}.resolutions.${size}.size`);
    return (byteSize && round(byteSize / 1024 / 1024, 2)) || 'NA';
  }

  getImageSize(id, state, size) {
    state = state || Store.getState();
    size = size || 'original';
    let posterImageId = deepGet(state, `video_entities.id_${id}.poster_image_id`);
    let byteSize = deepGet(state, `image_entities.id_${posterImageId}.resolutions.${size}.size`);
    return (byteSize && round(byteSize / 1024 / 1024, 2)) || 'NA';
  }

  getVideoProcessingStatus(state) {
    state = state || Store.getState();
    return deepGet(state, 'video_in_processing');
  }

  getPricePoint(state) {
    state = state || Store.getState();
    return state['price_points'];
  }

  getToken(state) {
    state = state || Store.getState();
    return state['token'];
  }

  getActivityTransactionId(id, state) {
    state = state || Store.getState();
    return deepGet(state, `activities_entities.id_${id}.payload.ost_transaction_id`);
  }

  getActivityGiffyId(id, state) {
    state = state || Store.getState();
    return deepGet(state, `activities_entities.id_${id}.payload.gif_id`);
  }

  getGiffy(id, state) {
    state = state || Store.getState();
    return deepGet(state, `giffy_entities.id_${id}`);
  }

  getActivityMessage(id, state) {
    state = state || Store.getState();
    return deepGet(state, `activities_entities.id_${id}.payload.text`);
  }

  getActivityTransactionStatus(id, state) {
    state = state || Store.getState();
    return deepGet(state, `activities_entities.id_${id}.status`);
  }

  getActivityTransactionTimeStamp(id, state) {
    state = state || Store.getState();
    return deepGet(state, `activities_entities.id_${id}.uts`);
  }

  getTransactionFromUserId(id, state) {
    state = state || Store.getState();
    return deepGet(state, `transaction_entities.id_${id}.from_user_id`);
  }

  getTransactionToUserId(id, state) {
    state = state || Store.getState();
    return deepGet(state, `transaction_entities.id_${id}.to_user_ids[0]`);
  }

  getTransactionAmount(id, state) {
    state = state || Store.getState();
    return deepGet(state, `transaction_entities.id_${id}.amounts[0]`);
  }

  getUserContributionToStats(fromUserId, toUserId, state) {
    state = state || Store.getState();
    return deepGet(state, `user_contribution_to_stats.id_${fromUserId}[${toUserId}]['total_amount']`);
  }

  getUserContributionByStats(fromUserId, toUserId, state) {
    state = state || Store.getState();
    return deepGet(state, `user_contribution_by_stats.id_${toUserId}[${fromUserId}]['total_amount']`);
  }

  getNotificationHeading(notificationId, state) {
    state = state || Store.getState();
    return deepGet(state, `user_notifications.id_${notificationId}.heading`);
  }

  getNotificationPictureId(notificationId, state) {
    state = state || Store.getState();
    return deepGet(state, `user_notifications.id_${notificationId}.image_id`);
  }

  getNotificationKind(notificationId, state) {
    state = state || Store.getState();
    return deepGet(state, `user_notifications.id_${notificationId}.kind`);
  }

  getNotificationPayload(notificationId, state) {
    state = state || Store.getState();
    return deepGet(state, `user_notifications.id_${notificationId}.payload`);
  }

  getNotificationTimestamp(notificationId, state) {
    state = state || Store.getState();
    return deepGet(state, `user_notifications.id_${notificationId}.timestamp`);
  }

  getNotificationGoTo(notificationId, state) {
    state = state || Store.getState();
    return deepGet(state, `user_notifications.id_${notificationId}.goto`);
  }
  getPushNotification(state) {
    state = state || Store.getState();
    return deepGet(state, `push_notification`);
  }

  getNotificationUnreadFlag(state) {
    state = state || Store.getState();
    return deepGet(state, `notification_unread.flag`);
  }
}

export default new ReduxGetters();
