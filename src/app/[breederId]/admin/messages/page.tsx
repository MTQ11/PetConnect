'use client';

import { useState, use } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/Label';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export default function MessagesPage({ params }: { params: Promise<{ breederId: string }> }) {
  const resolvedParams = use(params);
  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Mock data
  const messages: Message[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@email.com",
      message: "Hi! I'm interested in Bella. Could you tell me more about her vaccination status?",
      date: "2024-08-28",
      read: false
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike@email.com",
      message: "Do you have any Yorkshire Terrier puppies available for next month?",
      date: "2024-08-27",
      read: true
    }
  ];

  const openModal = (message: Message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const renderModal = () => {
    if (!showModal || !selectedMessage) return null;

    return (
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>From</Label>
              <p className="text-gray-900 font-medium mt-1">{selectedMessage.name}</p>
              <p className="text-sm text-gray-600">{selectedMessage.email}</p>
            </div>
            <div>
              <Label>Date</Label>
              <p className="text-gray-900 mt-1">{selectedMessage.date}</p>
            </div>
            <div>
              <Label>Message</Label>
              <p className="text-gray-900 mt-1">{selectedMessage.message}</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="destructive">
            {messages.filter(m => !m.read).length} unread
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !message.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => openModal(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{message.name}</h3>
                      {!message.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{message.email}</p>
                    <p className="text-gray-800 line-clamp-2">{message.message}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{message.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div>
      {renderContent()}
      {renderModal()}
    </div>
  );
}
