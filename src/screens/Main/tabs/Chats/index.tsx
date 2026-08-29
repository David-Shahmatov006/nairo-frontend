import { useRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../../stores/auth";
import { chatsService } from "../../../../services/chats.service";
import { socket } from "../../../../services/socket.service";
import { useNavigate, useParams } from "react-router-dom";
import type { Chat, IMessage } from "../../../../types/chats";
import { ChatList } from "./components/ChatList";
import { ConfirmModal } from "../../../../components/ConfirmModal";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessageList } from "./components/ChatMesageList";
import { ChatInput } from "./components/ChatInput";
import { userService } from "../../../../services/user.service";
import surprisedMuskot from "../../../../assets/images/surprisedMuskot2.webp";
import searchMuskot from "../../../../assets/images/search_muskot.webp";
import clsx from "clsx";
import { mutate } from "swr";
import { useAppStore } from "../../../../stores/app";
import type { VoiceRecording } from "../../../../hooks/useVoiceRecorder";

export const Chats = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const chats = useAppStore((s) => s.chats);
  const setChats = useAppStore((s) => s.setChats);
  const navigate = useNavigate();
  const { chatId: chatIdFromURL } = useParams();
  const isMobile = window.innerWidth <= 768;
  const showChatList = !isMobile || !chatIdFromURL;
  const showChatWindow = !isMobile || !!chatIdFromURL;

  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeChatRef = useRef<Chat | null>(null);

  const mapChatToClient = (chat: Chat, currentUserId: string): Chat | null => {
    const otherParticipant = chat.participants.find(
      (p: any) => p.id !== currentUserId,
    );
    if (!otherParticipant) return null;

    const name = [otherParticipant.firstName, otherParticipant.lastName]
      .filter(Boolean)
      .join(" ");

    return {
      id: chat.id,
      name: name,
      username: otherParticipant.username,
      avatar: otherParticipant.avatar,
      participants: chat.participants,
      messages: [],
      unreadCount: chat.unreadCount,
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUserChats = useCallback(async () => {
    if (!user?.id || !chats) return;

    try {
      const clientChatsData = chats
        .map((c) => mapChatToClient(c, user.id!))
        .filter((chat): chat is Chat => chat !== null);

      setUserChats(clientChatsData);

      if (chatIdFromURL) {
        const chatByUrl = clientChatsData.find((c) => c.id === chatIdFromURL);

        if (chatByUrl) {
          setActiveChat(chatByUrl);
          return;
        }

        try {
          const userData = await userService.getUserById(chatIdFromURL);

          setActiveChat({
            id: "",
            name: `${userData.firstName} ${userData.lastName}`,
            username: userData.username,
            avatar: userData.avatar,
            participants: [user, userData],
            messages: [],
            unreadCount: 0,
          });

          return;
        } catch {
          setActiveChat(null);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to fetch user chats:", error);
    }
  }, [user, chatIdFromURL, chats]);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    fetchUserChats();
  }, [fetchUserChats]);

  const handleSendMessage = (htmlContent: string) => {
    if (!activeChat || !user?.id || !htmlContent.trim()) return;

    const receiver = activeChat.participants.find((p) => p.id !== user.id);
    if (!receiver) return;

    if (!activeChat.id) {
      socket.emit("sendMessage", {
        chatId: null,
        senderId: user.id,
        receiverId: receiver.id,
        text: htmlContent,
      });

      return;
    }

    socket.emit("sendMessage", {
      chatId: activeChat.id,
      senderId: user.id,
      receiverId: receiver.id,
      text: htmlContent,
    });
  };

  const handleSendVoice = async (recording: VoiceRecording) => {
    if (!activeChat || !user?.id) return;

    const receiver = activeChat.participants.find((p) => p.id !== user.id);
    if (!receiver) return;

    const tempId = `pending-${Date.now()}`;
    const objectUrl = URL.createObjectURL(recording.blob);

    const pending: IMessage = {
      id: tempId,
      type: "voice",
      text: null,
      audioUrl: objectUrl,
      durationMs: recording.durationMs,
      waveform: recording.waveform,
      sender: user,
      chatId: activeChat.id || "",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, pending]);
    setTimeout(scrollToBottom, 50);

    try {
      const saved = await chatsService.sendVoiceMessage({
        chatId: activeChat.id || null,
        receiverId: receiver.id,
        blob: recording.blob,
        durationMs: recording.durationMs,
        waveform: recording.waveform,
      });

      setMessages((prev) => {
        const withoutPending = prev.filter((message) => message.id !== tempId);

        if (withoutPending.some((message) => message.id === saved.id)) {
          return withoutPending;
        }

        return [...withoutPending, saved];
      });
    } catch (error) {
      console.error(error);
      setMessages((prev) => prev.filter((message) => message.id !== tempId));
    } finally {
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    }
  };

  useEffect(() => {
    if (!activeChat || !user?.id) {
      setMessages([]);
      return;
    }

    const currentChatId = activeChat.id;
    let cancelled = false;

    if (currentChatId) {
      socket.emit("joinChat", {
        chatId: currentChatId,
      });

      socket.emit("readMessages", {
        chatId: currentChatId,
        userId: user?.id,
      });

      chatsService.getMessages(currentChatId).then((data) => {
        if (cancelled) return;
        setMessages(data);
        setTimeout(scrollToBottom, 50);
      });
    }

    const addNewChat = (newChat: Chat) => {
      const currentChats = useAppStore.getState().chats;
      const nextChats = [
        ...currentChats.filter(
          (chat) => chat.id && chat.id !== newChat.id,
        ),
        newChat,
      ];

      setChats(nextChats);
      mutate("user-chats", nextChats, { revalidate: false });
      setUserChats((prev) => [
        ...prev.filter((chat) => chat.id && chat.id !== newChat.id),
        newChat,
      ]);
    };

    const handleReceiveMessage = (data: IMessage) => {
      const current = activeChatRef.current;

      if (!current?.id && data.chatId) {
        const receiver = current?.participants.find((p) => p.id !== user.id);

        const newChat: Chat = {
          id: data.chatId,
          name: `${receiver?.firstName} ${receiver?.lastName}`,
          username: receiver?.username!,
          avatar: receiver?.avatar,
          participants: current?.participants!,
          messages: [],
          unreadCount: 0,
        };

        addNewChat(newChat);
        setActiveChat(newChat);
        navigate(`/chats/${newChat?.id}`, { replace: true });

        return;
      }

      if (data.chatId === current?.id) {
        setMessages((prev) => {
          if (prev.some((message) => message.id === data.id)) {
            return prev;
          }

          return [...prev, data];
        });

        scrollToBottom();
      }
    };

    const handleMessageUpdated = (data: {
      messageId: string;
      text: string;
      editedAt: string;
    }) => {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === data.messageId
            ? {
                ...message,
                text: data.text,
                editedAt: data.editedAt,
              }
            : message,
        ),
      );
    };

    const handleMessageDeleted = (data: { messageId: string }) => {
      setMessages((prev) =>
        prev.filter((message) => message.id !== data.messageId),
      );
    };

    const handleMessagesRead = async (data: {
      chatId: string;
      userId: string;
      lastReadAt: string;
    }) => {
      if (data.userId !== user?.id) {
        return;
      }

      if (data.chatId !== activeChatRef.current?.id) {
        return;
      }

      await mutate(
        "user-chats",
        (chats: Chat[] | undefined) =>
          chats?.map((chat) =>
            chat.id === data.chatId ? { ...chat, unreadCount: 0 } : chat,
          ),
        { revalidate: false },
      );
    };

    const handleNewActivity = (data: any) => {
      const current = activeChatRef.current;

      if (!current?.id && data.chatId) {
        const receiver = current?.participants.find((p) => p.id !== user.id);

        const newChat: Chat = {
          id: data.chatId,
          name: `${receiver?.firstName} ${receiver?.lastName}`,
          username: receiver?.username!,
          avatar: receiver?.avatar,
          participants: current?.participants!,
          messages: [],
          unreadCount: data.unreadCount,
        };

        addNewChat(newChat);
        setActiveChat(newChat);

        navigate(`/chats/${newChat.id}`, { replace: true });
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageUpdated", handleMessageUpdated);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("newActivity", handleNewActivity);

    return () => {
      cancelled = true;
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageUpdated", handleMessageUpdated);
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("newActivity", handleNewActivity);
      socket.emit("leaveChat", { chatId: currentChatId });
    };
  }, [activeChat?.id]);

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const handleTypingStatus = (data: { isTyping: boolean }) => {
      if (!activeChat?.id) return;

      setIsTyping(data.isTyping);
    };

    socket.on("typingStatus", handleTypingStatus);

    return () => {
      socket.off("typingStatus", handleTypingStatus);
    };
  }, [activeChat?.id]);

  const deleteChat = async (chatId: string) => {
    await chatsService.deleteChat(chatId);

    const remainingChats = chats.filter((chat) => chat.id !== chatId);
    setChats(remainingChats);
    await mutate("user-chats", remainingChats, { revalidate: false });

    setUserChats((prev) => {
      const newList = prev.filter((c) => c.id !== chatId);

      if (chatIdFromURL !== chatId) {
        return newList;
      }

      if (newList.length === 0) {
        setActiveChat(null);
        navigate("/chats", { replace: true });
        return newList;
      }

      if (newList.length === 1) {
        const onlyChat = newList[0];
        setActiveChat(onlyChat);
        navigate(`/chats/${onlyChat.id}`, { replace: true });
        return newList;
      }

      const deletedIndex = prev.findIndex((c) => c.id === chatId);

      const previous = newList[deletedIndex - 1];
      if (previous) {
        setActiveChat(previous);
        navigate(`/chats/${previous.id}`, { replace: true });
        return newList;
      }

      const first = newList[0];
      setActiveChat(first);
      navigate(`/chats/${first.id}`, { replace: true });

      return newList;
    });

    setIsDeleteModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={clsx(
        "font-manrope h-full w-full flex",
        !(chatIdFromURL && isMobile) ? "min-2000px:mt-[1vw] mt-[80px]" : "mt-0",
      )}
    >
      {showChatList && (
        <ChatList
          chats={userChats}
          setActiveChat={setActiveChat}
          onDeleteChat={(id) => {
            setChatToDelete(id);
            setIsDeleteModal(true);
          }}
        />
      )}

      {showChatWindow && (
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col h-[calc(100dvh-80px)] max-768px:h-[100dvh]">
          {activeChat ? (
            <>
              <ChatHeader activeChat={activeChat} />

              <ChatMessageList
                isTyping={isTyping}
                messages={messages}
                messagesEndRef={messagesEndRef}
              />

              <ChatInput
                onSendMessage={handleSendMessage}
                onSendVoice={handleSendVoice}
                activeChatId={activeChat?.id || null}
                socket={socket}
                userId={user?.id!}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              {userChats.length > 0 ? (
                <div className="flex-1 max-h-[70vh] flex flex-col justify-center items-center">
                  <img
                    src={searchMuskot}
                    className="min-2000px:w-[5vw] w-[80px]"
                  />
                  <p className="text-gray-500 text-center min-2000px:text-[.7vw] py-4">
                    {t("chat.select_chat")}
                  </p>
                </div>
              ) : (
                <div className="flex-1 max-h-[70vh] flex flex-col justify-center items-center">
                  <img
                    src={surprisedMuskot}
                    className="min-2000px:w-[7vw] w-[120px]"
                  />
                  <p className="text-gray-500 text-center min-2000px:text-[.9vw] py-4">
                    {t("chat.no_chats")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModal}
        onClose={() => setIsDeleteModal(false)}
        onConfirm={() => {
          if (chatToDelete) deleteChat(chatToDelete);
        }}
        title={t("chat.delete_chat")}
        subtitle={t("chat.delete_chat_desc")}
        confirmText={t("chat.delete_modal_confirm")}
        cancelText={t("chat.confirm_modal_cancel")}
      />
    </motion.div>
  );
};
