import { Conversation, Message } from './chat.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      organizationId: req.organizationId,
      participants: req.user._id,
    })
      .populate('participants', 'name email avatarUrl title')
      .populate('projectId', 'name code')
      .sort({ updatedAt: -1 });

    return ApiResponse.success(res, conversations, 'Conversations fetched successfully.');
  } catch (error) {
    return ApiResponse.error(res, 'FETCH_CONVERSATIONS_ERROR', error.message, 500);
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({
      organizationId: req.organizationId,
      conversationId,
    })
      .populate('senderId', 'name email avatarUrl')
      .sort({ createdAt: 1 })
      .limit(200);

    return ApiResponse.success(res, messages, 'Messages fetched.');
  } catch (error) {
    return ApiResponse.error(res, 'FETCH_MESSAGES_ERROR', error.message, 500);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    const message = await Message.create({
      organizationId: req.organizationId,
      conversationId,
      senderId: req.user._id,
      content,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      $set: {
        lastMessage: {
          content,
          senderId: req.user._id,
          timestamp: new Date(),
        },
      },
    });

    const populatedMsg = await Message.findById(message._id).populate('senderId', 'name email avatarUrl');

    return ApiResponse.success(res, populatedMsg, 'Message sent successfully.', 201);
  } catch (error) {
    return ApiResponse.error(res, 'SEND_MESSAGE_ERROR', error.message, 500);
  }
};
