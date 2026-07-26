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

export const Chats = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { chatId: chatIdFromUrl } = useParams();
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;
  const { chatId: chatIdFromURL } = useParams();
  const showChatList = !isMobile || !chatIdFromUrl;
  const showChatWindow = !isMobile || !!chatIdFromUrl;

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
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUserChats = useCallback(async () => {
    if (!user?.id) return;

    try {
      const rawChatsData: any[] = await chatsService.getUserChats();
      const clientChatsData = rawChatsData
        .map((c) => mapChatToClient(c, user.id!))
        .filter((chat): chat is Chat => chat !== null);

      setUserChats(clientChatsData);

      if (chatIdFromUrl) {
        const chatByUrl = clientChatsData.find((c) => c.id === chatIdFromUrl);

        if (chatByUrl) {
          setActiveChat(chatByUrl);
          return;
        }

        try {
          const userData = await userService.getUserById(chatIdFromUrl);

          setActiveChat({
            id: "",
            name: `${userData.firstName} ${userData.lastName}`,
            username: userData.username,
            avatar: userData.avatar,
            participants: [user, userData],
            messages: [],
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
  }, [user, chatIdFromUrl]);

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

  useEffect(() => {
    if (!activeChat || !user?.id) {
      setMessages([]);
      return;
    }

    const currentChatId = activeChat.id;

    socket.off("receiveMessage");
    socket.off("messageUpdated");
    socket.off("messageDeleted");
    socket.off("newActivity");

    if (currentChatId) {
      socket.emit("joinChat", {
        chatId: currentChatId,
      });

      chatsService.getMessages(currentChatId).then((data) => {
        setMessages(data);
        setTimeout(scrollToBottom, 50);
      });
    }

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
        };

        setActiveChat(newChat);
        navigate(`/chats/${newChat?.id}`, { replace: true });

        return;
      }

      if (data.chatId === current?.id) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            sender: data.sender,
            text: data.text,
            chatId: data.chatId,
            createdAt: data.createdAt,
          },
        ]);

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

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageUpdated", handleMessageUpdated);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("newActivity", (data: any) => {
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
        };

        setUserChats((prev) => {
          const filtered = prev.filter((c) => c.id !== "");
          return [...filtered, newChat];
        });

        setActiveChat(newChat);

        navigate(`/chats/${newChat.id}`, { replace: true });

        fetchUserChats();
      }
    });

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageUpdated", handleMessageUpdated);
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("newActivity", fetchUserChats);
      socket.emit("leaveChat", { chatId: currentChatId });
    };
  }, [activeChat?.id]);

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket.on("typingStatus", (data) => {
      if (!activeChat?.id) return;

      setIsTyping(data.isTyping);
    });

    return () => {
      socket.off("typingStatus");
    };
  }, [activeChat?.id]);

  const deleteChat = async (chatId: string) => {
    await chatsService.deleteChat(chatId);

    setUserChats((prev) => {
      const newList = prev.filter((c) => c.id !== chatId);

      if (chatIdFromUrl !== chatId) {
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
        !(chatIdFromURL && isMobile) ? "min-2000px:mt-[1vw] mt-[80px]" : "mt-4",
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
        <div className="flex-1 flex flex-col max-768px:h-[80vh]">
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
                activeChatId={activeChat?.id || null}
                socket={socket}
                userId={user?.id!}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              {userChats.length < 0 ? (
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
