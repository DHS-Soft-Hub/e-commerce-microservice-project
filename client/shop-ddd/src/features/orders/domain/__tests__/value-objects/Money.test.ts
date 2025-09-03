import { describe, it, expect } from '@jest/globals';
import { Money } from '../../value-objects/Money';

describe('Money Value Object', () => {
    describe('creation', () => {
        it('should create valid money instance', () => {
            // Arrange - prepare test data
            const amount = 100.50;
            const currency = 'EUR';

            // Act - execute the action
            const money = Money.of(amount, currency);

            // Assert - verify the result
            expect(money.amount).toBe(100.50);
            expect(money.currency).toBe('EUR');
        });

        it('should round amount to 2 decimal places', () => {
            // Test that Money properly rounds to 2 decimal places
            const money = Money.of(100.999, 'EUR');

            expect(money.amount).toBe(101.00);
        });

        it('should throw error for infinite amount', () => {
            expect(() => Money.of(Infinity, 'EUR')).toThrow('Money.amount must be finite');
        });

        it('should throw error for negative infinite amount', () => {
            expect(() => Money.of(-Infinity, 'EUR')).toThrow('Money.amount must be finite');
        });

        it('should throw error for NaN amount', () => {
            expect(() => Money.of(NaN, 'EUR')).toThrow('Money.amount must be finite');
        });

        it('should throw error for negative amount', () => {
            expect(() => Money.of(-1, 'EUR')).toThrow('Money.amount must be >= 0');
        });

        it('should throw error for empty currency', () => {
            expect(() => Money.of(100, '')).toThrow('Money.currency required');
        });

        it('should throw error for null currency', () => {
            expect(() => Money.of(100, null as any)).toThrow('Money.currency required');
        });
    });

    describe('operations', () => {
        it('should add money with same currency', () => {
            // Arrange
            const money1 = Money.of(100, 'EUR');
            const money2 = Money.of(50, 'EUR');

            // Act
            const result = money1.add(money2);

            // Assert
            expect(result.amount).toBe(150);
            expect(result.currency).toBe('EUR');
        });

        it('should throw error when adding different currencies', () => {
            const money1 = Money.of(100, 'EUR');
            const money2 = Money.of(50, 'USD');

            expect(() => money1.add(money2)).toThrow('Currency mismatch');
        });

        it('should multiply by positive integer quantity', () => {
            const money = Money.of(25.50, 'EUR');

            const result = money.multiply(3);

            expect(result.amount).toBe(76.50);
            expect(result.currency).toBe('EUR');
        });

        it('should multiply by zero quantity', () => {
            const money = Money.of(25.50, 'EUR');

            const result = money.multiply(0);

            expect(result.amount).toBe(0);
            expect(result.currency).toBe('EUR');
        });

        it('should throw error for negative quantity', () => {
            const money = Money.of(100, 'EUR');

            expect(() => money.multiply(-1)).toThrow('qty must be integer >= 0');
        });

        it('should throw error for decimal quantity', () => {
            const money = Money.of(100, 'EUR');

            expect(() => money.multiply(1.5)).toThrow('qty must be integer >= 0');
        });

        it('should throw error for NaN quantity', () => {
            const money = Money.of(100, 'EUR');

            expect(() => money.multiply(NaN)).toThrow('qty must be integer >= 0');
        });
    });

    describe('equality', () => {
        it('should return true for equal money objects', () => {
            const money1 = Money.of(100, 'EUR');
            const money2 = Money.of(100, 'EUR');

            expect(money1.equals(money2)).toBe(true);
        });

        it('should return false for different amounts', () => {
            const money1 = Money.of(100, 'EUR');
            const money2 = Money.of(200, 'EUR');

            expect(money1.equals(money2)).toBe(false);
        });

        it('should return false for different currencies', () => {
            const money1 = Money.of(100, 'EUR');
            const money2 = Money.of(100, 'USD');

            expect(money1.equals(money2)).toBe(false);
        });

        it('should handle decimal precision correctly', () => {
            const money1 = Money.of(10.1, 'EUR');
            const money2 = Money.of(10.10, 'EUR');

            expect(money1.equals(money2)).toBe(true);
        });
    });
});