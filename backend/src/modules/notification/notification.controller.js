import { Notification } from './notification.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      organizationId: req.organizationId,
      recipientId: req.user._id,
    })
      .populate('senderId', 'name avatarUrl email')
      .sort({ createdAt: -1 })
      .limit(100);

    const unreadCount = await Notification.countDocuments({
      organizationId: req.organizationId,
      recipientId: req.user._id,
      isRead: false,
    });

    return ApiResponse.success(res, { notifications, unreadCount }, 'Notifications fetched.');
  } catch (error) {
    return ApiResponse.error(res, 'FETCH_NOTIF_ERROR', error.message, 500);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user._id },
      { $set: { isRead: true } },
      { new: true }
    );

    return ApiResponse.success(res, notification, 'Notification marked as read.');
  } catch (error) {
    return ApiResponse.error(res, 'MARK_NOTIF_ERROR', error.message, 500);
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return ApiResponse.success(res, null, 'All notifications marked as read.');
  } catch (error) {
    return ApiResponse.error(res, 'MARK_ALL_NOTIF_ERROR', error.message, 500);
  }
};
