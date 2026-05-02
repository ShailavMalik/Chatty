import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) =>
    set((state) => ({
      messages:
        typeof messages === "function" ? messages(state.messages) : messages,
    })),
  unreadCounts: {},
  incrementUnreadCount: (conversationId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: (state.unreadCounts[conversationId] || 0) + 1,
      },
    })),
  clearUnreadCount: (conversationId) =>
    set((state) => {
      if (!state.unreadCounts[conversationId]) {
        return state;
      }

      const nextUnreadCounts = { ...state.unreadCounts };
      delete nextUnreadCounts[conversationId];

      return { unreadCounts: nextUnreadCounts };
    }),
  typingConversations: {},
  setTypingConversation: (conversationId) =>
    set((state) => ({
      typingConversations: {
        ...state.typingConversations,
        [conversationId]: true,
      },
    })),
  clearTypingConversation: (conversationId) =>
    set((state) => {
      if (!state.typingConversations[conversationId]) {
        return state;
      }

      const nextTypingConversations = { ...state.typingConversations };
      delete nextTypingConversations[conversationId];

      return { typingConversations: nextTypingConversations };
    }),
}));

export default useConversation;
