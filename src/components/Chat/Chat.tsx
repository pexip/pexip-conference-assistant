import React, { useEffect, useRef } from 'react'
import type { Message } from '@pexip/infinity'

import './Chat.scss'

interface ChatMessageProps {
  message: Message
}

const ChatMessage = (props: ChatMessageProps): JSX.Element => {
  const hours = props.message.at.getHours()
  const minutes = props.message.at.getMinutes()

  return (
    <div className='ChatMessage'>
      <div className='Info'>
        <span className='DisplayName'>{props.message.displayName}</span>
        <span className='Hour'>{`${hours}:${minutes}`}</span>
      </div>
      <div className='Message'>
        {props.message.message}
      </div>
    </div>
  )
}

interface ChatProps {
  messages: Message[]
}

export const Chat = (props: ChatProps): JSX.Element => {
  const ref = useRef<HTMLSpanElement>(null)

  const scrollToBottom = (): void => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [props.messages])

  return (
    <div className='Chat'>
      {props.messages.length === 0 && <div className='NoMessages'>No messages yet</div>}
      {props.messages.length !== 0 &&
        <div className='MessagesContainer'>
          {props.messages.map((message) => <ChatMessage key={message.id} message={message} />)}
          <span ref={ref} />
        </div>
      }
    </div>
  )
}
