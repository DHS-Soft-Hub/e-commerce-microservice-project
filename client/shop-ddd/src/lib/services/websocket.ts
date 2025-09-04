/**
 * WebSocket Service for Real-time Collaboration
 * 
 * Provides real-time communication for collaboration features including:
 * - Live demo updates
 * - User presence tracking
 * - Real-time feedback
 * - Live cursor positions
 * - Instant notifications
 */

export interface WebSocketMessage {
    type: string;
    payload: unknown;
    timestamp: number;
    userId?: number;
    sessionId?: string;
}

export interface CollaborationUpdate {
    demoId: number;
    section: 'typography' | 'colors' | 'components' | 'layout';
    changes: Record<string, unknown>;
    userId: number;
    userName: string;
    timestamp: number;
}

export interface UserPresence {
    userId: number;
    userName: string;
    role: 'developer' | 'client';
    isActive: boolean;
    lastSeen: number;
    currentSection?: string;
    cursorPosition?: { x: number; y: number };
}

export interface LiveFeedback {
    id: string;
    demoId: number;
    section: string;
    element?: string;
    comment: string;
    rating?: number;
    userId: number;
    userName: string;
    timestamp: number;
    position?: { x: number; y: number };
}

export type WebSocketEventType =
    | 'collaboration_update'
    | 'user_joined'
    | 'user_left'
    | 'user_presence'
    | 'live_feedback'
    | 'cursor_move'
    | 'demo_save'
    | 'notification'
    | 'error';

export interface WebSocketConfig {
    url: string;
    reconnectInterval: number;
    maxReconnectAttempts: number;
    heartbeatInterval: number;
}

export class WebSocketService {
    private ws: WebSocket | null = null;
    private config: WebSocketConfig;
    private reconnectAttempts = 0;
    private isConnecting = false;
    private listeners: Map<WebSocketEventType, Set<(...args: unknown[]) => void>> = new Map();
    private heartbeatTimer: NodeJS.Timeout | null = null;
    private sessionId: string;
    private currentDemoId: number | null = null;
    private userInfo: { id: number; name: string; role: 'developer' | 'client' } | null = null;

    constructor(config: Partial<WebSocketConfig> = {}) {
        this.config = {
            url: config.url || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/collaboration/`,
            reconnectInterval: config.reconnectInterval || 3000,
            maxReconnectAttempts: config.maxReconnectAttempts || 10,
            heartbeatInterval: config.heartbeatInterval || 30000,
        };
        this.sessionId = this.generateSessionId();
    }

    private generateSessionId(): string {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    /**
     * Connect to WebSocket server
     */
    public connect(userInfo: { id: number; name: string; role: 'developer' | 'client' }): Promise<void> {
        if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
            return Promise.resolve();
        }

        this.userInfo = userInfo;
        this.isConnecting = true;

        return new Promise((resolve, reject) => {
            try {
                const token = localStorage.getItem('authToken');
                const wsUrl = `${this.config.url}?token=${token}&userId=${userInfo.id}&sessionId=${this.sessionId}`;

                this.ws = new WebSocket(wsUrl);

                this.ws.onopen = () => {
                    this.isConnecting = false;
                    this.reconnectAttempts = 0;
                    this.startHeartbeat();
                    this.emit('connection', { status: 'connected' });
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const message: WebSocketMessage = JSON.parse(event.data);
                        this.handleMessage(message);
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                };

                this.ws.onclose = (event) => {
                    this.isConnecting = false;
                    this.stopHeartbeat();
                    this.emit('connection', { status: 'disconnected', code: event.code, reason: event.reason });

                    if (!event.wasClean && this.reconnectAttempts < this.config.maxReconnectAttempts) {
                        this.scheduleReconnect();
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.isConnecting = false;
                    this.emit('error', { error: 'WebSocket connection error' });
                    reject(error);
                };

            } catch (error) {
                this.isConnecting = false;
                reject(error);
            }
        });
    }

    /**
     * Disconnect from WebSocket server
     */
    public disconnect(): void {
        if (this.ws) {
            this.ws.close(1000, 'Client disconnecting');
            this.ws = null;
        }
        this.stopHeartbeat();
        this.currentDemoId = null;
    }

    /**
     * Join a demo collaboration session
     */
    public joinDemo(demoId: number): void {
        if (this.currentDemoId === demoId) return;

        // Leave current demo if any
        if (this.currentDemoId) {
            this.leaveDemo();
        }

        this.currentDemoId = demoId;
        this.send('join_demo', { demoId, userInfo: this.userInfo });
    }

    /**
     * Leave current demo collaboration session
     */
    public leaveDemo(): void {
        if (this.currentDemoId) {
            this.send('leave_demo', { demoId: this.currentDemoId, userInfo: this.userInfo });
            this.currentDemoId = null;
        }
    }

    /**
     * Send collaboration update
     */
    public sendCollaborationUpdate(update: Omit<CollaborationUpdate, 'userId' | 'userName' | 'timestamp'>): void {
        if (!this.userInfo) return;

        const fullUpdate: CollaborationUpdate = {
            ...update,
            userId: this.userInfo.id,
            userName: this.userInfo.name,
            timestamp: Date.now(),
        };

        this.send('collaboration_update', fullUpdate);
    }

    /**
     * Send live feedback
     */
    public sendLiveFeedback(feedback: Omit<LiveFeedback, 'id' | 'userId' | 'userName' | 'timestamp'>): void {
        if (!this.userInfo) return;

        const fullFeedback: LiveFeedback = {
            id: `feedback_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            ...feedback,
            userId: this.userInfo.id,
            userName: this.userInfo.name,
            timestamp: Date.now(),
        };

        this.send('live_feedback', fullFeedback);
    }

    /**
     * Send user presence update
     */
    public updatePresence(presence: Partial<Pick<UserPresence, 'currentSection' | 'cursorPosition'>>): void {
        if (!this.userInfo) return;

        const presenceUpdate: Partial<UserPresence> = {
            userId: this.userInfo.id,
            userName: this.userInfo.name,
            role: this.userInfo.role,
            isActive: true,
            lastSeen: Date.now(),
            ...presence,
        };

        this.send('user_presence', presenceUpdate);
    }

    /**
     * Send cursor position
     */
    public updateCursor(position: { x: number; y: number }): void {
        if (!this.userInfo) return;

        // Throttle cursor updates to avoid spam
        this.throttle(() => {
            this.send('cursor_move', {
                userId: this.userInfo!.id,
                userName: this.userInfo!.name,
                position,
                timestamp: Date.now(),
            });
        }, 100);
    }

    /**
     * Save demo changes
     */
    public saveDemoChanges(changes: Record<string, unknown>): void {
        this.send('demo_save', {
            demoId: this.currentDemoId,
            changes,
            userId: this.userInfo?.id,
            timestamp: Date.now(),
        });
    }    /**
     * Add event listener
     */
    public on(eventType: WebSocketEventType | 'connection', listener: (...args: unknown[]) => void): void {
        if (!this.listeners.has(eventType as WebSocketEventType)) {
            this.listeners.set(eventType as WebSocketEventType, new Set());
        }
        this.listeners.get(eventType as WebSocketEventType)!.add(listener);
    }

    /**
     * Remove event listener
     */
    public off(eventType: WebSocketEventType | 'connection', listener: (...args: unknown[]) => void): void {
        this.listeners.get(eventType as WebSocketEventType)?.delete(listener);
    }

    /**
     * Get connection status
     */
    public isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    /**
     * Get current demo ID
     */
    public getCurrentDemoId(): number | null {
        return this.currentDemoId;
    }

    // Private methods

    private handleMessage(message: WebSocketMessage): void {
        this.emit(message.type as WebSocketEventType, message.payload);
    }

    private send(type: string, payload: unknown): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message: WebSocketMessage = {
                type,
                payload,
                timestamp: Date.now(),
                userId: this.userInfo?.id,
                sessionId: this.sessionId,
            };
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket not connected, message not sent:', type, payload);
        }
    }

    private emit(eventType: WebSocketEventType | 'connection', payload: unknown): void {
        const listeners = this.listeners.get(eventType as WebSocketEventType);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(payload);
                } catch (error) {
                    console.error('Error in WebSocket event listener:', error);
                }
            });
        }
    }

    private scheduleReconnect(): void {
        this.reconnectAttempts++;
        const delay = Math.min(this.config.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1), 30000);

        setTimeout(() => {
            if (this.userInfo) {
                this.connect(this.userInfo).catch(error => {
                    console.error('Reconnect failed:', error);
                });
            }
        }, delay);
    }

    private startHeartbeat(): void {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            this.send('ping', { timestamp: Date.now() });
        }, this.config.heartbeatInterval);
    }

    private stopHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    private throttle(func: (...args: unknown[]) => void, delay: number): void {
        const key = func.toString();
        if (!this.throttleTimers) {
            this.throttleTimers = new Map();
        }

        if (this.throttleTimers.has(key)) {
            return;
        }

        this.throttleTimers.set(key, true);
        setTimeout(() => {
            this.throttleTimers.delete(key);
            func();
        }, delay);
    }

    private throttleTimers = new Map<string, boolean>();
}

// Singleton instance
let wsService: WebSocketService | null = null;

export const getWebSocketService = (): WebSocketService => {
    if (!wsService) {
        wsService = new WebSocketService();
    }
    return wsService;
};

export default WebSocketService;
