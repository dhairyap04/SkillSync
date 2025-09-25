import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Send,
  Smile,
  Image,
  File,
  X,
  Check,
  CheckCheck,
  Clock,
  Star,
  Archive,
  Trash2,
  MessageCircle,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

const MessagesPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState('1')
  const [messageText, setMessageText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const conversations = [
    {
      id: '1',
      participant: {
        id: '2',
        name: 'Alex Thompson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        title: 'Senior Product Manager',
        isOnline: true
      },
      lastMessage: {
        content: 'Great work on the React project! Let\'s discuss the next steps.',
        timestamp: '2 min ago',
        isRead: true,
        senderId: '2'
      },
      unreadCount: 0,
      isPinned: true
    },
    {
      id: '2',
      participant: {
        id: '3',
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        title: 'UX Designer',
        isOnline: false
      },
      lastMessage: {
        content: 'I\'ve reviewed your design portfolio. Here are my suggestions...',
        timestamp: '1 hour ago',
        isRead: false,
        senderId: '3'
      },
      unreadCount: 2,
      isPinned: false
    },
    {
      id: '3',
      participant: {
        id: '4',
        name: 'Michael Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        title: 'Software Engineer',
        isOnline: true
      },
      lastMessage: {
        content: 'Thanks for the mentorship session yesterday!',
        timestamp: '3 hours ago',
        isRead: true,
        senderId: '1'
      },
      unreadCount: 0,
      isPinned: false
    }
  ]

  const messages = {
    '1': [
      {
        id: '1',
        senderId: '2',
        content: 'Hi! I saw your progress on React development. Great work so far!',
        timestamp: '10:30 AM',
        type: 'text',
        isRead: true
      },
      {
        id: '2',
        senderId: '1',
        content: 'Thank you! I\'ve been working hard on the hooks section.',
        timestamp: '10:32 AM',
        type: 'text',
        isRead: true
      },
      {
        id: '3',
        senderId: '2',
        content: 'That\'s excellent! Hooks are fundamental to modern React. Have you tried building any custom hooks yet?',
        timestamp: '10:35 AM',
        type: 'text',
        isRead: true
      },
      {
        id: '4',
        senderId: '1',
        content: 'Not yet, but I\'d love to learn about them. Could you recommend some resources?',
        timestamp: '10:37 AM',
        type: 'text',
        isRead: true
      },
      {
        id: '5',
        senderId: '2',
        content: 'Absolutely! Here are some great resources for custom hooks:',
        timestamp: '10:40 AM',
        type: 'text',
        isRead: true
      },
      {
        id: '6',
        senderId: '2',
        content: 'https://reactjs.org/docs/hooks-custom.html',
        timestamp: '10:40 AM',
        type: 'text',
        isRead: true
      },
      {
        id: '7',
        senderId: '2',
        content: 'Great work on the React project! Let\'s discuss the next steps.',
        timestamp: '2 min ago',
        type: 'text',
        isRead: true
      }
    ],
    '2': [
      {
        id: '1',
        senderId: '3',
        content: 'Hi! I\'ve had a chance to review your design portfolio.',
        timestamp: '9:15 AM',
        type: 'text',
        isRead: true
      },
      {
        id: '2',
        senderId: '1',
        content: 'Thank you for taking the time! What are your thoughts?',
        timestamp: '9:20 AM',
        type: 'text',
        isRead: true
      },
      {
        id: '3',
        senderId: '3',
        content: 'I\'ve reviewed your design portfolio. Here are my suggestions...',
        timestamp: '1 hour ago',
        type: 'text',
        isRead: false
      }
    ],
    '3': [
      {
        id: '1',
        senderId: '1',
        content: 'Thanks for the mentorship session yesterday!',
        timestamp: '3 hours ago',
        type: 'text',
        isRead: true
      }
    ]
  }

  const currentConversation = conversations.find(c => c.id === selectedConversation)
  const currentMessages = messages[selectedConversation as keyof typeof messages] || []

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message via API
      console.log('Sending message:', messageText)
      setMessageText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredConversations = conversations.filter(conversation =>
    conversation.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-lg shadow-soft overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-neutral-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Messages</h2>
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
              className={cn(
                'p-4 border-b border-neutral-100 cursor-pointer transition-colors',
                selectedConversation === conversation.id && 'bg-primary-50 border-primary-200'
              )}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar
                    src={conversation.participant.avatar}
                    fallback={conversation.participant.name}
                    size="md"
                    status={conversation.participant.isOnline ? 'online' : 'offline'}
                  />
                  {conversation.isPinned && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                      <Star className="h-2 w-2 text-white fill-current" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-neutral-900 truncate">
                      {conversation.participant.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {conversation.unreadCount > 0 && (
                        <Badge variant="primary" size="sm">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                      <span className="text-xs text-neutral-500">
                        {conversation.lastMessage.timestamp}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 truncate">
                    {conversation.participant.title}
                  </p>
                  <p className={cn(
                    'text-sm mt-1 truncate',
                    conversation.lastMessage.isRead ? 'text-neutral-500' : 'text-neutral-900 font-medium'
                  )}>
                    {conversation.lastMessage.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar
                  src={currentConversation.participant.avatar}
                  fallback={currentConversation.participant.name}
                  size="md"
                  status={currentConversation.participant.isOnline ? 'online' : 'offline'}
                />
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    {currentConversation.participant.name}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {currentConversation.participant.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex',
                    message.senderId === '1' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div className={cn(
                    'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                    message.senderId === '1'
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-900'
                  )}>
                    <p className="text-sm">{message.content}</p>
                    <div className={cn(
                      'flex items-center justify-end mt-1 text-xs',
                      message.senderId === '1' ? 'text-primary-100' : 'text-neutral-500'
                    )}>
                      <span>{message.timestamp}</span>
                      {message.senderId === '1' && (
                        <div className="ml-1">
                          {message.isRead ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-neutral-200">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={1}
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="p-1">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Image className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Select a conversation</h3>
              <p className="text-neutral-600">Choose a conversation from the sidebar to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagesPage

