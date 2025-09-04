import { UserEntity } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { TokenData, UserResponse } from '../types/api.types';

/**
 * User Mapper for converting between API types and Domain entities
 * Follows the Repository pattern by abstracting data transformation
 */
export class UserMapper {
    /**
     * Convert API UserResponse to Domain UserEntity
     */
    static fromApiUserResponse(userResponse: UserResponse): UserEntity {
        return new UserEntity(
            userResponse.id.toString(),
            Email.create(userResponse.email),
            undefined, // username not in API response
            userResponse.first_name,
            userResponse.last_name,
            [], // roles not in basic UserResponse
            [], // permissions not in basic UserResponse
            userResponse.is_active,
            userResponse.is_email_verified,
            userResponse.two_factor_enabled,
            new Date(), // createdAt not in API response
            new Date(), // updatedAt not in API response
            userResponse.last_login ? new Date(userResponse.last_login) : undefined,
            {} // metadata not in API response
        );
    }

    /**
     * Convert TokenData to Domain UserEntity
     */
    static fromTokenData(tokenData: TokenData): UserEntity {
        return new UserEntity(
            tokenData.user_id.toString(),
            Email.create(''), // Email not directly in TokenData, will be extracted from token
            undefined, // username not in TokenData
            undefined, // firstName not in TokenData
            undefined, // lastName not in TokenData
            tokenData.roles || [],
            tokenData.permissions || [],
            true, // Default active
            tokenData.is_email_verified,
            tokenData.two_factor_enabled,
            new Date(), // createdAt
            new Date(), // updatedAt
            undefined, // lastLoginAt
            tokenData.profile_info || {}
        );
    }

    /**
     * Convert Domain UserEntity to serializable format for Redux store
     * This should be the ONLY place where we convert UserEntity for state management
     */
    static toSerializable(userEntity: UserEntity): {
        id: number;
        email: string;
        first_name?: string;
        last_name?: string;
        username?: string;
        roles: string[];
        permissions: string[];
        is_active: boolean;
        is_email_verified: boolean;
        two_factor_enabled: boolean;
        last_login?: string;
        created_at: string;
        updated_at: string;
        metadata?: Record<string, unknown>;
    } {
        return {
            id: Number(userEntity.id) || 0,
            email: userEntity.email.value,
            first_name: userEntity.firstName,
            last_name: userEntity.lastName,
            username: userEntity.username,
            roles: userEntity.roles,
            permissions: userEntity.permissions,
            is_active: userEntity.isActive,
            is_email_verified: userEntity.isEmailVerified,
            two_factor_enabled: userEntity.twoFactorEnabled,
            last_login: userEntity.lastLoginAt?.toISOString(),
            created_at: userEntity.createdAt.toISOString(),
            updated_at: userEntity.updatedAt.toISOString(),
            metadata: userEntity.metadata,
        };
    }

    /**
     * Convert serializable format back to Domain UserEntity
     * Used when rehydrating from Redux store
     */
    static fromSerializable(serializedUser: {
        id: number;
        email: string;
        first_name?: string;
        last_name?: string;
        username?: string;
        roles: string[];
        permissions: string[];
        is_active: boolean;
        is_email_verified: boolean;
        two_factor_enabled: boolean;
        last_login?: string;
        created_at: string;
        updated_at: string;
        metadata?: Record<string, unknown>;
    }): UserEntity {
        return new UserEntity(
            serializedUser.id.toString(),
            Email.create(serializedUser.email),
            serializedUser.username,
            serializedUser.first_name,
            serializedUser.last_name,
            serializedUser.roles,
            serializedUser.permissions,
            serializedUser.is_active,
            serializedUser.is_email_verified,
            serializedUser.two_factor_enabled,
            new Date(serializedUser.created_at),
            new Date(serializedUser.updated_at),
            serializedUser.last_login ? new Date(serializedUser.last_login) : undefined,
            serializedUser.metadata
        );
    }
}
