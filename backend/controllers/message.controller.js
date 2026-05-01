import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET IO FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      const deliveredAt = new Date();
      newMessage.deliveredAt = deliveredAt;
      await newMessage.save();

      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
      io.to(senderId.toString()).emit("messageDelivered", {
        messageId: newMessage._id.toString(),
        deliveredAt,
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;
    const unreadMessages = messages.filter(
      (message) =>
        message.senderId.toString() === userToChatId &&
        message.receiverId.toString() === senderId.toString() &&
        !message.seenAt,
    );

    if (unreadMessages.length > 0) {
      const seenAt = new Date();
      const unreadMessageIds = unreadMessages.map((message) => message._id);

      await Message.updateMany(
        { _id: { $in: unreadMessageIds } },
        { $set: { deliveredAt: seenAt, seenAt } },
      );

      messages.forEach((message) => {
        if (unreadMessageIds.some((id) => id.equals(message._id))) {
          message.deliveredAt = seenAt;
          message.seenAt = seenAt;
        }
      });

      const senderSocketId = getReceiverSocketId(userToChatId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", {
          messageIds: unreadMessageIds.map((messageId) => messageId.toString()),
          seenAt,
        });
      }
    }

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
