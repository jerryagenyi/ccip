
'use client';

import { useState } from 'react';
import { mockConversations, mockTeamMembers } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format } from 'date-fns';
import { Search, PenSquare, Send, Reply, Forward, Paperclip, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Conversation, Message } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';

const ConversationListItem = ({ conversation, onSelect, isActive }: { conversation: Conversation, onSelect: () => void, isActive: boolean }) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const sender = lastMessage.sender;
    const avatar = PlaceHolderImages.find(p => p.id === sender.avatarId);

    return (
        <button
            onClick={onSelect}
            className={cn(
                "flex w-full items-start gap-4 rounded-lg p-3 text-left transition-colors",
                isActive ? "bg-primary/10" : "hover:bg-muted"
            )}
        >
            <Avatar className="h-12 w-12 border-2 border-background">
                <AvatarImage src={avatar?.imageUrl} />
                <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <div className="flex items-baseline justify-between">
                    <p className={cn("font-semibold truncate", !conversation.isRead && "text-foreground")}>{conversation.subject}</p>
                    <p className="text-xs text-muted-foreground shrink-0">{format(new Date(conversation.lastMessageTimestamp), 'p')}</p>
                </div>
                <p className="text-sm text-muted-foreground truncate">{sender.name}: {lastMessage.content}</p>
            </div>
            {!conversation.isRead && <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}
        </button>
    );
};

const MessageItem = ({ message }: { message: { sender: { name: string; avatarId: string }, content: string, timestamp: string } }) => {
    const avatar = PlaceHolderImages.find(p => p.id === message.sender.avatarId);
    // This is a mock; in a real app, you'd compare with the current user's ID
    const isCurrentUser = message.sender.name === "Dr. Amina Yusuf";

    return (
        <div className={cn("group flex items-start gap-4", isCurrentUser && "justify-end")}>
            {!isCurrentUser && (
                 <Avatar className="h-10 w-10">
                    <AvatarImage src={avatar?.imageUrl} />
                    <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                </Avatar>
            )}
            <div className={cn("relative max-w-md rounded-lg p-4", isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
                 <Button variant="ghost" size="icon" className={cn(
                    "absolute bottom-1 right-1 h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                    isCurrentUser ? "text-primary-foreground/70 hover:bg-white/20 hover:text-primary-foreground" : "text-muted-foreground"
                 )}>
                    <Reply className="h-4 w-4" />
                </Button>
                <p className="font-bold text-sm mb-1">{message.sender.name} {isCurrentUser && <span className="font-normal opacity-70">(You)</span>}</p>
                <p>{message.content}</p>
                 <p className={cn("text-xs mt-2", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
                    {format(new Date(message.timestamp), 'PPpp')}
                </p>
            </div>
            {isCurrentUser && (
                 <Avatar className="h-10 w-10">
                    <AvatarImage src={avatar?.imageUrl} />
                    <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                </Avatar>
            )}
        </div>
    );
};

const ForwardMessageDialog = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Forward className="mr-2 h-4 w-4" /> Forward
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Forward Message</DialogTitle>
            <DialogDescription>
              Select recipients and add an optional message.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {value
                      ? mockTeamMembers.find((member) => member.email.toLowerCase() === value)?.name
                      : "Select member..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search members..." />
                    <CommandList>
                        <CommandEmpty>No member found.</CommandEmpty>
                        <CommandGroup>
                        {mockTeamMembers.map((member) => (
                            <CommandItem
                            key={member.email}
                            value={member.email}
                            onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue);
                                setOpen(false);
                            }}
                            >
                            <Check
                                className={cn(
                                "mr-2 h-4 w-4",
                                value === member.email ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {member.name}
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="forward-message">Additional Message (Optional)</Label>
              <Textarea
                id="forward-message"
                placeholder="FYI, thought you should see this..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="gradient">
              <Send className="mr-2 h-4 w-4" /> Forward Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
};

const NewMessageDialog = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
  
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <PenSquare className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Compose New Message</DialogTitle>
                    <DialogDescription>
                        Select recipients and compose your message below.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="recipients-compose">To:</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between"
                            >
                                {value
                                ? mockTeamMembers.find((member) => member.email.toLowerCase() === value)?.name
                                : "Select recipients..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search members..." />
                                <CommandList>
                                    <CommandEmpty>No member found.</CommandEmpty>
                                    <CommandGroup>
                                    {mockTeamMembers.map((member) => (
                                        <CommandItem
                                        key={member.email}
                                        value={member.email}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue);
                                            setOpen(false);
                                        }}
                                        >
                                        <Check
                                            className={cn(
                                            "mr-2 h-4 w-4",
                                            value === member.email ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {member.name}
                                        </CommandItem>
                                    ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subject-compose">Subject</Label>
                        <Input id="subject-compose" placeholder="Enter message subject" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message-body-compose">Message</Label>
                        <Textarea id="message-body-compose" placeholder="Type your message here..." className="min-h-[150px]" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                    </DialogClose>
                    <Button type="submit" variant="gradient">
                        <Send className="mr-2 h-4 w-4" /> Send Message
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function MessagesPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(mockConversations[0].id);

    const selectedConversation = mockConversations.find(c => c.id === selectedConversationId);

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-10rem)] gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Messages
                </h1>
                <p className="text-muted-foreground">
                    Your internal communication hub.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
                {/* Conversations List */}
                <Card className="md:col-span-1 lg:col-span-1 flex flex-col">
                    <CardHeader className="flex-row items-center justify-between">
                       <div>
                            <CardTitle>Inbox</CardTitle>
                            <CardDescription>3 Unread</CardDescription>
                       </div>
                       <NewMessageDialog />
                    </CardHeader>
                    <div className="relative px-4 pb-4">
                        <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search messages..." className="pl-9" />
                    </div>
                    <ScrollArea className="flex-1 px-2">
                        <div className="space-y-1 p-2">
                            {mockConversations.map(conv => (
                                <ConversationListItem
                                    key={conv.id}
                                    conversation={conv}
                                    onSelect={() => setSelectedConversationId(conv.id)}
                                    isActive={selectedConversationId === conv.id}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Conversation View */}
                <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
                    {selectedConversation ? (
                        <>
                            <CardHeader className="border-b">
                                <CardTitle className="truncate">{selectedConversation.subject}</CardTitle>
                                <CardDescription>
                                    With: {selectedConversation.participants.map(p => p.name).join(', ')}
                                </CardDescription>
                            </CardHeader>
                            <ScrollArea className="flex-1 p-6">
                                <div className="space-y-6">
                                    {selectedConversation.messages.map(msg => (
                                        <MessageItem key={msg.id} message={msg} />
                                    ))}
                                </div>
                            </ScrollArea>
                             <CardContent className="border-t bg-muted/50 p-4">
                                <div className="relative">
                                    <Textarea
                                        placeholder="Type your reply..."
                                        className="pr-20"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                            <Paperclip className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" className="h-8 w-8">
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                     <Button variant="outline" size="sm"><Reply className="mr-2 h-4 w-4" /> Reply</Button>
                                     <ForwardMessageDialog />
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <PenSquare className="h-16 w-16 text-muted-foreground/50" />
                            <h3 className="text-xl font-semibold mt-4">Select a conversation</h3>
                            <p className="text-muted-foreground">Or start a new one to begin messaging.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}



    

    
