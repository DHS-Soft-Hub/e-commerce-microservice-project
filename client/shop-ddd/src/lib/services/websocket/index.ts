// WebSocket service for real-time collaboration features
// Based on the existing chat service architecture pattern

export interface WebSocketMessage {
    type: 'user_joined' | 'user_left' | 'live_update' | 'feedback_update' | 'users_update';
    data: CollaborationUser | { userId: string } | LiveUpdateData | FeedbackUpdateData | { users: CollaborationUser[] };
    timestamp: number;
}

export interface CollaborationUser {
    id: string;
    username: string;
    isOnline: boolean;
    lastSeen?: Date;
}

export interface LiveUpdateData {
    type: 'typography' | 'color_palette' | 'design_system';
    data: Record<string, unknown>;
    userId: string;
    username: string;
}

export interface FeedbackUpdateData {
    feedback: Record<string, unknown>;
    action: 'created' | 'updated' | 'deleted';
    userId: string;
    username: string;
}

export class WebSocketService {
    private ws: WebSocket | null = null;
    private connectionState: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
    private currentRoom: string | null = null;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectInterval: number = 3000;
    private heartbeatInterval: NodeJS.Timeout | null = null;

    // Event listeners
    private connectionChangeListeners: ((connected: boolean) => void)[] = [];
    private userJoinedListeners: ((user: CollaborationUser) => void)[] = [];
    private userLeftListeners: ((userId: string) => void)[] = [];
    private usersUpdateListeners: ((users: CollaborationUser[]) => void)[] = [];
    private liveUpdateListeners: ((update: LiveUpdateData) => void)[] = [];
    private feedbackUpdateListeners: ((update: FeedbackUpdateData) => void)[] = [];

    constructor(private baseUrl: string = 'ws://localhost:8000/ws') { }
    /**
     * Connect to WebSocket server
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    connect(_user: { id: number; name: string; role: "developer" | "client" }): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.connectionState === 'connected') {
                resolve();
                return;
            }

            if (this.connectionState === 'connecting') {
                // Wait for current connection attempt
                const checkConnection = () => {
                    if (this.connectionState === 'connected') {
                        resolve();
                    } else if (this.connectionState === 'disconnected') {
                        reject(new Error('Connection failed'));
                    } else {
                        setTimeout(checkConnection, 100);
                    }
                };
                checkConnection();
                return;
            }

            this.connectionState = 'connecting';

            try {
                this.ws = new WebSocket(this.baseUrl);

                this.ws.onopen = () => {
                    this.connectionState = 'connected';
                    this.reconnectAttempts = 0;
                    this.startHeartbeat();
                    this.notifyConnectionChange(true);
                    resolve();
                };

                this.ws.onclose = (event) => {
                    this.connectionState = 'disconnected';
                    this.stopHeartbeat();
                    this.notifyConnectionChange(false);

                    // Auto-reconnect if not a clean close
                    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.attemptReconnect();
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.connectionState = 'disconnected';
                    this.notifyConnectionChange(false);
                    reject(error);
                };

                this.ws.onmessage = (event) => {
                    this.handleMessage(event.data);
                };

            } catch (error) {
                this.connectionState = 'disconnected';
                reject(error);
            }
        });
    }

    /**
     * Disconnect from WebSocket server
     */
    disconnect(): void {
        if (this.ws) {
            this.ws.close(1000, 'Client disconnect');
            this.ws = null;
        }
        this.connectionState = 'disconnected';
        this.currentRoom = null;
        this.stopHeartbeat();
        this.notifyConnectionChange(false);
    }
    /**
     * Join a collaboration room for a specific demo
     */
    joinCollaborationRoom(roomId: string, user: { id: number; name: string; role: "developer" | "client" }): void {
        if (this.connectionState !== 'connected') {
            throw new Error('WebSocket not connected');
        }

        this.currentRoom = roomId;

        this.sendMessage({
            type: 'join_room',
            data: {
                roomId,
                userId: user.id,
                username: user.name,
                role: user.role
            }
        });
    }

    /**
     * Leave current collaboration room
     */
    leaveCollaborationRoom(): void {
        if (this.connectionState !== 'connected' || !this.currentRoom) {
            return;
        }

        this.sendMessage({
            type: 'leave_room',
            data: {
                roomId: this.currentRoom
            }
        });

        this.currentRoom = null;
    }
    /**
     * Send live design update to other collaborators
     */
    sendLiveUpdate(type: string, data: Record<string, unknown>, metadata: Record<string, unknown>): void {
        if (this.connectionState !== 'connected') {
            console.warn('WebSocket not connected, cannot send live update');
            return;
        }

        this.sendMessage({
            type: 'live_update',
            data: {
                type,
                data,
                metadata,
                roomId: this.currentRoom
            }
        });
    }

    /**
     * Send feedback update to other collaborators
     */
    sendFeedbackUpdate(feedbackData: Omit<FeedbackUpdateData, 'userId' | 'username'>): void {
        if (this.connectionState !== 'connected') {
            throw new Error('WebSocket not connected');
        }

        this.sendMessage({
            type: 'feedback_update',
            data: feedbackData
        });
    }

    // Event listener registration methods
    onConnectionChange(listener: (connected: boolean) => void): () => void {
        this.connectionChangeListeners.push(listener);
        return () => {
            const index = this.connectionChangeListeners.indexOf(listener);
            if (index > -1) {
                this.connectionChangeListeners.splice(index, 1);
            }
        };
    }

    onUserJoined(listener: (user: CollaborationUser) => void): () => void {
        this.userJoinedListeners.push(listener);
        return () => {
            const index = this.userJoinedListeners.indexOf(listener);
            if (index > -1) {
                this.userJoinedListeners.splice(index, 1);
            }
        };
    }

    onUserLeft(listener: (userId: string) => void): () => void {
        this.userLeftListeners.push(listener);
        return () => {
            const index = this.userLeftListeners.indexOf(listener);
            if (index > -1) {
                this.userLeftListeners.splice(index, 1);
            }
        };
    }

    onUsersUpdate(listener: (users: CollaborationUser[]) => void): () => void {
        this.usersUpdateListeners.push(listener);
        return () => {
            const index = this.usersUpdateListeners.indexOf(listener);
            if (index > -1) {
                this.usersUpdateListeners.splice(index, 1);
            }
        };
    }

    onLiveUpdate(listener: (update: LiveUpdateData) => void): () => void {
        this.liveUpdateListeners.push(listener);
        return () => {
            const index = this.liveUpdateListeners.indexOf(listener);
            if (index > -1) {
                this.liveUpdateListeners.splice(index, 1);
            }
        };
    }

    onFeedbackUpdate(listener: (update: FeedbackUpdateData) => void): () => void {
        this.feedbackUpdateListeners.push(listener);
        return () => {
            const index = this.feedbackUpdateListeners.indexOf(listener);
            if (index > -1) {
                this.feedbackUpdateListeners.splice(index, 1);
            }
        };
    }

    // Private methods
    private sendMessage(message: Record<string, unknown>): void {
        if (this.ws && this.connectionState === 'connected') {
            this.ws.send(JSON.stringify({
                ...message,
                timestamp: Date.now()
            }));
        }
    } private handleMessage(data: string): void {
        try {
            const message: WebSocketMessage = JSON.parse(data);

            switch (message.type) {
                case 'user_joined':
                    this.userJoinedListeners.forEach(listener => listener(message.data as CollaborationUser));
                    break;
                case 'user_left':
                    this.userLeftListeners.forEach(listener => listener((message.data as { userId: string }).userId));
                    break;
                case 'users_update':
                    this.usersUpdateListeners.forEach(listener => listener((message.data as { users: CollaborationUser[] }).users));
                    break;
                case 'live_update':
                    this.liveUpdateListeners.forEach(listener => listener(message.data as LiveUpdateData));
                    break;
                case 'feedback_update':
                    this.feedbackUpdateListeners.forEach(listener => listener(message.data as FeedbackUpdateData));
                    break;
                default:
                    console.warn('Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }

    private notifyConnectionChange(connected: boolean): void {
        this.connectionChangeListeners.forEach(listener => listener(connected));
    }
    private attemptReconnect(): void {
        this.reconnectAttempts++;

        setTimeout(() => {
            // Use a dummy user for reconnection - in a real app, this should be stored
            this.connect({ id: 0, name: 'unknown', role: 'developer' }).catch(() => {
                // Reconnection failed, will try again if under limit
            });
        }, this.reconnectInterval);
    }

    private startHeartbeat(): void {
        this.heartbeatInterval = setInterval(() => {
            if (this.connectionState === 'connected') {
                this.sendMessage({ type: 'ping' });
            }
        }, 30000); // Send ping every 30 seconds
    }

    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    // Getter methods
    get isConnected(): boolean {
        return this.connectionState === 'connected';
    }

    get currentRoomId(): string | null {
        return this.currentRoom;
    }
}

// Create singleton instance
const wsInstance = new WebSocketService();

// Export the instance as default
export default wsInstance;
