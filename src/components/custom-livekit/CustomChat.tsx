import type { ChatMessage, ChatOptions } from '@livekit/components-core';
import * as React from 'react';
import { useMaybeLayoutContext } from "@livekit/components-react";
import { cloneSingleChild } from './custom-addon/utils';
import type { MessageFormatter } from "@livekit/components-react";
import { ChatEntry } from "@livekit/components-react";
import { useChat } from "@livekit/components-react";
import { ChatToggle } from "@livekit/components-react";
import { ChatCloseIcon } from "@livekit/components-react";

/** @public */
export interface ChatProps extends React.HTMLAttributes<HTMLDivElement>, ChatOptions {
  messageFormatter?: MessageFormatter;
  isOpen?: boolean;
}

/**
 * The Chat component adds a basis chat functionality to the LiveKit room. The messages are distributed to all participants
 * in the room. Only users who are in the room at the time of dispatch will receive the message.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <Chat />
 * </LiveKitRoom>
 * ```
 * @public
 */
export function CustomChat({
  messageFormatter,
  messageDecoder,
  messageEncoder,
  channelTopic,
  isOpen,
  ...props
}: ChatProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const ulRef = React.useRef<HTMLUListElement>(null);
  const layoutContext = useMaybeLayoutContext();

  const chatOptions: ChatOptions = React.useMemo(() => {
    return { messageDecoder, messageEncoder, channelTopic };
  }, [messageDecoder, messageEncoder, channelTopic]);

  const { send, chatMessages, isSending } = useChat(chatOptions);

  const lastReadMsgAt = React.useRef<ChatMessage['timestamp']>(0);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (inputRef.current && inputRef.current.value.trim() !== '') {
      if (send) {
        await send(inputRef.current.value);
        inputRef.current.value = '';
        inputRef.current.focus();
      }
    }
  }

  React.useEffect(() => {
    if (ulRef) {
      ulRef.current?.scrollTo({ top: ulRef.current.scrollHeight });
    }
  }, [ulRef, chatMessages]);

  React.useEffect(() => {
    if (!layoutContext || chatMessages.length === 0) {
      return;
    }

    if (
      layoutContext.widget.state?.showChat &&
      chatMessages.length > 0 &&
      lastReadMsgAt.current !== chatMessages[chatMessages.length - 1]?.timestamp
    ) {
      lastReadMsgAt.current = chatMessages[chatMessages.length - 1]?.timestamp;
      return;
    }

    const unreadMessageCount = chatMessages.filter(
      (msg) => !lastReadMsgAt.current || msg.timestamp > lastReadMsgAt.current,
    ).length;

    const { widget } = layoutContext;
    if (unreadMessageCount > 0 && widget.state?.unreadMessages !== unreadMessageCount) {
      widget.dispatch?.({ msg: 'unread_msg', count: unreadMessageCount });
    }
  }, [chatMessages, layoutContext?.widget]);

  return (
    <div {...props} className="lk-chat" style={{
      ...props.style,
      display: isOpen ? 'block' : 'none',
      height: '100%',
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
    }}>
      <div style={{ 
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a1a1a',
        borderLeft: '1px solid var(--lk-border-color)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="lk-chat-header" style={{
          padding: '1rem',
          borderBottom: '1px solid var(--lk-border-color)',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          justifyContent: 'flex-end',
          flexShrink: 0,
        }}>
          <ChatToggle className="lk-close-button">
            <ChatCloseIcon />
          </ChatToggle>
        </div>

        <div style={{ 
          flex: 1,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 0,
        }}>
          <ul 
            className="lk-list lk-chat-messages" 
            ref={ulRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              width: '100%',
              scrollbarWidth: 'thin',
              scrollbarColor: '#CBD5E0 #EDF2F7',
              padding: '1rem',
              margin: 0,
              listStyle: 'none',
            }}
          >
            {props.children
              ? chatMessages.map((msg, idx) =>
                  cloneSingleChild(props.children, {
                    entry: msg,
                    key: msg.id ?? idx,
                    messageFormatter,
                  }),
                )
              : chatMessages.map((msg, idx, allMsg) => {
                  const hideName = idx >= 1 && allMsg[idx - 1].from === msg.from;
                  const hideTimestamp = idx >= 1 && msg.timestamp - allMsg[idx - 1].timestamp < 60_000;

                  return (
                    <ChatEntry
                      key={msg.id ?? idx}
                      hideName={hideName}
                      hideTimestamp={hideName === false ? false : hideTimestamp}
                      entry={msg}
                      messageFormatter={messageFormatter}
                    />
                  );
                })}
          </ul>
        </div>

        <form 
          className="lk-chat-form" 
          onSubmit={handleSubmit}
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--lk-border-color)',
            backgroundColor: '#262626',
            display: 'flex',
            gap: '0.5rem',
            flexShrink: 0,
          }}
        >
          <input
            className="lk-form-control lk-chat-form-input"
            disabled={isSending}
            ref={inputRef}
            type="text"
            placeholder="메시지 입력..."
            onInput={(ev) => ev.stopPropagation()}
            onKeyDown={(ev) => ev.stopPropagation()}
            onKeyUp={(ev) => ev.stopPropagation()}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid var(--lk-border-color)',
              backgroundColor: '#1a1a1a',
              color: 'white',
            }}
          />
          <button 
            type="submit" 
            className="lk-button lk-chat-form-button" 
            disabled={isSending}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            보내기
          </button>
        </form>
      </div>
    </div>
  );
}