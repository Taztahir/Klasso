export interface ChatMessage {
    id: string;
    session_id: string;
    user_id: string;
    role: 'user' | 'model';
    content: string;
    is_liked: boolean;
    created_at: any;
}

export interface ChatSession {
    id: string;
    user_id: string;
    title: string | null;
    created_at: any;
}

export const chatService = {
    async createSession(title?: string) {
        const sessionsStr = localStorage.getItem('klasso_chat_sessions') || '[]';
        const sessions = JSON.parse(sessionsStr) as ChatSession[];

        const newSession: ChatSession = {
            id: 'chat-sess-' + Math.random().toString(36).substr(2, 9),
            user_id: 'demo-user-id',
            title: title || 'New Conversation',
            created_at: new Date().toISOString()
        };

        sessions.unshift(newSession);
        localStorage.setItem('klasso_chat_sessions', JSON.stringify(sessions));
        return newSession;
    },

    async getSessions() {
        const sessionsStr = localStorage.getItem('klasso_chat_sessions') || '[]';
        return JSON.parse(sessionsStr) as ChatSession[];
    },

    async getMessages(sessionId: string) {
        const messagesStr = localStorage.getItem('klasso_chat_messages') || '[]';
        const messages = JSON.parse(messagesStr) as ChatMessage[];
        return messages.filter(m => m.session_id === sessionId);
    },

    async saveMessage(sessionId: string, role: 'user' | 'model', content: string) {
        const messagesStr = localStorage.getItem('klasso_chat_messages') || '[]';
        const messages = JSON.parse(messagesStr) as ChatMessage[];

        const newMessage: ChatMessage = {
            id: 'msg-' + Math.random().toString(36).substr(2, 9),
            session_id: sessionId,
            user_id: 'demo-user-id',
            role,
            content,
            is_liked: false,
            created_at: new Date().toISOString()
        };

        messages.push(newMessage);
        localStorage.setItem('klasso_chat_messages', JSON.stringify(messages));
        return newMessage;
    },

    async updateMessage(messageId: string, content: string) {
        const messagesStr = localStorage.getItem('klasso_chat_messages') || '[]';
        const messages = JSON.parse(messagesStr) as ChatMessage[];
        const idx = messages.findIndex(m => m.id === messageId);
        if (idx !== -1) {
            messages[idx].content = content;
            localStorage.setItem('klasso_chat_messages', JSON.stringify(messages));
            return messages[idx];
        }
        throw new Error('Message not found');
    },

    async toggleLike(messageId: string, isLiked: boolean) {
        const messagesStr = localStorage.getItem('klasso_chat_messages') || '[]';
        const messages = JSON.parse(messagesStr) as ChatMessage[];
        const idx = messages.findIndex(m => m.id === messageId);
        if (idx !== -1) {
            messages[idx].is_liked = isLiked;
            localStorage.setItem('klasso_chat_messages', JSON.stringify(messages));
            return messages[idx];
        }
        throw new Error('Message not found');
    },

    async deleteSession(sessionId: string) {
        const sessionsStr = localStorage.getItem('klasso_chat_sessions') || '[]';
        const sessions = JSON.parse(sessionsStr) as ChatSession[];
        const filteredSessions = sessions.filter(s => s.id !== sessionId);
        localStorage.setItem('klasso_chat_sessions', JSON.stringify(filteredSessions));

        const messagesStr = localStorage.getItem('klasso_chat_messages') || '[]';
        const messages = JSON.parse(messagesStr) as ChatMessage[];
        const filteredMessages = messages.filter(m => m.session_id !== sessionId);
        localStorage.setItem('klasso_chat_messages', JSON.stringify(filteredMessages));
    }
};
