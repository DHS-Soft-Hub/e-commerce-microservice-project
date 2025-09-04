import { validationRules } from '@/constants/validation.constants';
import { z } from 'zod';

/**
 * Two-factor verification schema matching backend TwoFactorVerifySchema
 */
export const twoFactorVerifySchema = z.object({
    code: z
        .string()
        .min(1, validationRules.TWO_FACTOR.MESSAGES.REQUIRED)
        .regex(validationRules.TWO_FACTOR.CODE_REGEX, validationRules.TWO_FACTOR.MESSAGES.INVALID)
        .length(validationRules.TWO_FACTOR.CODE_LENGTH, validationRules.TWO_FACTOR.MESSAGES.INVALID),
});

/**
 * Two-factor disable schema matching backend TwoFactorDisableSchema
 */
export const twoFactorDisableSchema = z.object({
    password: z.string().min(1, 'Password is required'),
    code: z
        .string()
        .min(1, validationRules.TWO_FACTOR.MESSAGES.REQUIRED)
        .regex(validationRules.TWO_FACTOR.CODE_REGEX, validationRules.TWO_FACTOR.MESSAGES.INVALID)
        .length(validationRules.TWO_FACTOR.CODE_LENGTH, validationRules.TWO_FACTOR.MESSAGES.INVALID),
});

/**
 * Backup code verification schema matching backend BackupCodeUseSchema
 */
export const backupCodeVerifySchema = z.object({
    backupCode: z.string().min(1, 'Backup code is required'),
});

// Inferred types from schemas
export type TwoFactorVerifyValues = z.infer<typeof twoFactorVerifySchema>;
export type TwoFactorDisableValues = z.infer<typeof twoFactorDisableSchema>;
export type BackupCodeVerifyValues = z.infer<typeof backupCodeVerifySchema>;
