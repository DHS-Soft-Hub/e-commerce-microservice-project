import { IBaseEntity, IDomainEvent } from '@dhs-hub/core';

/**
 * Token Types
 */
export enum TokenType {
    ACCESS = 'access',
    REFRESH = 'refresh',
    VERIFICATION = 'verification',
    RESET = 'reset'
}

// Token entity interface
export interface Token extends IBaseEntity<string> {
    userId: string;
    token: string;
    type: TokenType;
    expiresAt: Date;
    createdAt: Date;
    isRevoked: boolean;
    revokedAt?: Date;
    metadata?: Record<string, unknown>;
}

export class TokenEntity implements Token {
    public domainEvents: IDomainEvent[] = [];

    constructor(
        public id: string,
        public userId: string,
        public token: string,
        public type: TokenType,
        public expiresAt: Date,
        public createdAt: Date,
        public updatedAt: Date = new Date(),
        public isRevoked: boolean = false,
        public revokedAt?: Date,
        public metadata?: Record<string, unknown>
    ) { }

    static create(
        userId: string,
        token: string,
        type: TokenType = TokenType.ACCESS,
        duration: number = 3600
    ): TokenEntity {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + duration * 1000);

        return new TokenEntity(
            generateId(),
            userId,
            token,
            type,
            expiresAt,
            now,
            now,
            false
        );
    }

    static fromData(data: Partial<Token>): TokenEntity {
        return new TokenEntity(
            data.id || generateId(),
            data.userId || '',
            data.token || '',
            data.type || TokenType.ACCESS,
            data.expiresAt || new Date(),
            data.createdAt || new Date(),
            data.updatedAt || new Date(),
            data.isRevoked || false,
            data.revokedAt,
            data.metadata
        );
    }

    /**
     * Check if token is expired
     */
    isExpired(): boolean {
        return new Date() > this.expiresAt;
    }

    /**
     * Check if token is valid (not expired and not revoked)
     */
    isValid(): boolean {
        return !this.isExpired() && !this.isRevoked;
    }

    /**
     * Revoke the token
     */
    revoke(): void {
        this.isRevoked = true;
        this.revokedAt = new Date();
        this.updatedAt = new Date();
    }

    /**
     * Extend token expiration
     */
    extend(additionalDuration: number): void {
        this.expiresAt = new Date(this.expiresAt.getTime() + additionalDuration * 1000);
        this.updatedAt = new Date();
    }

    addDomainEvent(event: IDomainEvent): void {
        this.domainEvents.push(event);
    }

    clearDomainEvents(): void {
        this.domainEvents = [];
    }

    pullDomainEvents(): IDomainEvent[] {
        const events = [...this.domainEvents];
        this.clearDomainEvents();
        return events;
    }
}

function generateId(): string {
    return crypto.randomUUID();
}

