
import { describe, it, expect } from '@jest/globals';
import { OrderItem } from '../../entities/OrderItem';
import { Money } from '../../value-objects/Money';

describe('OrderItem Entity', () => {
    describe('creation', () => {
        it('should create valid order item with auto-calculated total', () => {
            // Arrange
            const productId = 'prod-123';
            const name = 'Test Product';
            const quantity = 2;
            const price = Money.of(50, 'EUR');

            // Act
            const orderItem = OrderItem.create({
                productId,
                name,
                quantity,
                price
            });

            // Assert
            expect(orderItem.productId).toBe('prod-123');
            expect(orderItem.name).toBe('Test Product');
            expect(orderItem.quantity).toBe(2);
            expect(orderItem.price.amount).toBe(50);
            expect(orderItem.price.currency).toBe('EUR');
            expect(orderItem.total.amount).toBe(100); // 50 * 2
            expect(orderItem.total.currency).toBe('EUR');
        });

        it('should create valid order item with explicit total', () => {
            // Arrange
            const price = Money.of(25.50, 'EUR');
            const quantity = 3;
            const expectedTotal = Money.of(76.50, 'EUR');

            // Act
            const orderItem = OrderItem.create({
                productId: 'prod-456',
                name: 'Another Product',
                quantity,
                price,
                total: expectedTotal
            });

            // Assert
            expect(orderItem.total.amount).toBe(76.50);
            expect(orderItem.total.currency).toBe('EUR');
        });

        it('should trim whitespace from product name', () => {
            // Arrange
            const price = Money.of(10, 'EUR');

            // Act
            const orderItem = OrderItem.create({
                productId: 'prod-789',
                name: '   Trimmed Product   ',
                quantity: 1,
                price
            });

            // Assert
            expect(orderItem.name).toBe('Trimmed Product');
        });

        it('should handle quantity of 1', () => {
            // Arrange
            const price = Money.of(99.99, 'USD');

            // Act
            const orderItem = OrderItem.create({
                productId: 'prod-single',
                name: 'Single Item',
                quantity: 1,
                price
            });

            // Assert
            expect(orderItem.quantity).toBe(1);
            expect(orderItem.total.amount).toBe(99.99);
        });

        it('should handle large quantities', () => {
            // Arrange
            const price = Money.of(1.50, 'EUR');
            const quantity = 1000;

            // Act
            const orderItem = OrderItem.create({
                productId: 'prod-bulk',
                name: 'Bulk Item',
                quantity,
                price
            });

            // Assert
            expect(orderItem.quantity).toBe(1000);
            expect(orderItem.total.amount).toBe(1500); // 1.50 * 1000
        });
    });

    describe('validation errors', () => {
        it('should throw error for missing productId', () => {
            // Arrange
            const price = Money.of(10, 'EUR');

            // Act & Assert
            expect(() => OrderItem.create({
                productId: '',
                name: 'Test Product',
                quantity: 1,
                price
            })).toThrow('OrderItem.productId required');
        });

        it('should throw error for missing name', () => {
            // Arrange
            const price = Money.of(10, 'EUR');

            // Act & Assert
            expect(() => OrderItem.create({
                productId: 'prod-123',
                name: '',
                quantity: 1,
                price
            })).toThrow('OrderItem.name required');
        });

        it('should throw error for invalid quantity - zero', () => {
            // Arrange
            const price = Money.of(10, 'EUR');

            // Act & Assert
            expect(() => OrderItem.create({
                productId: 'prod-123',
                name: 'Test Product',
                quantity: 0,
                price
            })).toThrow('quantity >= 1');
        });

        it('should throw error for invalid quantity - negative', () => {
            // Arrange
            const price = Money.of(10, 'EUR');

            // Act & Assert
            expect(() => OrderItem.create({
                productId: 'prod-123',
                name: 'Test Product',
                quantity: -1,
                price
            })).toThrow('quantity >= 1');
        });

        it('should throw error for invalid quantity - decimal', () => {
            // Arrange
            const price = Money.of(10, 'EUR');

            // Act & Assert
            expect(() => OrderItem.create({
                productId: 'prod-123',
                name: 'Test Product',
                quantity: 1.5,
                price
            })).toThrow('quantity >= 1');
        });

        it('should throw error for missing price', () => {
            // Act & Assert
            expect(() => OrderItem.create({
                productId: 'prod-123',
                name: 'Test Product',
                quantity: 1,
                price: null as any
            })).toThrow('OrderItem.price required');
        });

        it('should throw error for undefined price', () => {
            // Act & Assert
            expect(() => OrderItem.create({
                productId: 'prod-123',
                name: 'Test Product',
                quantity: 1,
                price: undefined as any
            })).toThrow('OrderItem.price required');
        });
    });

    describe('total calculation validation', () => {
        it('should throw error when explicit total does not match calculated total', () => {
            // Arrange
            const price = Money.of(10, 'EUR');
            const quantity = 3;
            const wrongTotal = Money.of(25, 'EUR'); // Should be 30

            // Act & Assert
            expect(() => OrderItem.create({
                productId: 'prod-123',
                name: 'Test Product',
                quantity,
                price,
                total: wrongTotal
            })).toThrow('OrderItem.total must equal price * quantity');
        });

        it('should throw currency mismatch error when total has different currency than price', () => {
            // Arrange
            const price = Money.of(10, 'EUR');
            const quantity = 2;
            const wrongCurrencyTotal = Money.of(20, 'USD'); // Different currency

            // Act & Assert
            expect(() => OrderItem.create({
                productId: 'prod-123',
                name: 'Test Product',
                quantity,
                price,
                total: wrongCurrencyTotal
            })).toThrow('OrderItem.total must equal price * quantity'); // This comes from Money.equals()
        });

        it('should accept total with minor precision differences due to rounding', () => {
            // Arrange
            const price = Money.of(10.33, 'EUR');
            const quantity = 3;
            const calculatedTotal = price.multiply(quantity); // Should handle rounding correctly

            // Act
            const orderItem = OrderItem.create({
                productId: 'prod-123',
                name: 'Test Product',
                quantity,
                price,
                total: calculatedTotal
            });

            // Assert
            expect(orderItem.total.amount).toBe(30.99); // 10.33 * 3 = 30.99
        });
    });

    describe('business scenarios', () => {
        it('should handle expensive items correctly', () => {
            // Arrange
            const expensivePrice = Money.of(1999.99, 'EUR');
            const quantity = 1;

            // Act
            const orderItem = OrderItem.create({
                productId: 'luxury-001',
                name: 'Luxury Watch',
                quantity,
                price: expensivePrice
            });

            // Assert
            expect(orderItem.total.amount).toBe(1999.99);
            expect(orderItem.name).toBe('Luxury Watch');
        });

        it('should handle bulk orders correctly', () => {
            // Arrange
            const bulkPrice = Money.of(0.50, 'USD');
            const bulkQuantity = 500;

            // Act
            const orderItem = OrderItem.create({
                productId: 'bulk-item-001',
                name: 'Bulk Screws',
                quantity: bulkQuantity,
                price: bulkPrice
            });

            // Assert
            expect(orderItem.total.amount).toBe(250); // 0.50 * 500
            expect(orderItem.quantity).toBe(500);
        });

        it('should handle products with special characters in name', () => {
            // Arrange
            const price = Money.of(25, 'BGN');

            // Act
            const orderItem = OrderItem.create({
                productId: 'bg-prod-001',
                name: 'Българска Ракия 500мл',
                quantity: 2,
                price
            });

            // Assert
            expect(orderItem.name).toBe('Българска Ракия 500мл');
            expect(orderItem.total.amount).toBe(50);
            expect(orderItem.total.currency).toBe('BGN');
        });

        it('should handle product IDs with various formats', () => {
            // Arrange
            const price = Money.of(15, 'EUR');
            const testCases = [
                'PROD-123-ABC',
                'product_456',
                '789-ITEM',
                'SKU:ABC123XYZ'
            ];

            // Act & Assert
            testCases.forEach((productId, index) => {
                const orderItem = OrderItem.create({
                    productId,
                    name: `Test Product ${index + 1}`,
                    quantity: 1,
                    price
                });

                expect(orderItem.productId).toBe(productId);
            });
        });
    });

    describe('edge cases', () => {
        it('should handle very small prices correctly', () => {
            // Arrange
            const smallPrice = Money.of(0.01, 'EUR');
            const quantity = 100;

            // Act
            const orderItem = OrderItem.create({
                productId: 'micro-item',
                name: 'Micro Transaction',
                quantity,
                price: smallPrice
            });

            // Assert
            expect(orderItem.total.amount).toBe(1.00); // 0.01 * 100
        });

        it('should handle reasonable large quantities without overflow', () => {
            // Arrange
            const price = Money.of(0.01, 'USD');
            const largeQuantity = 10000;

            // Act
            const orderItem = OrderItem.create({
                productId: 'large-qty-test',
                name: 'Large Quantity Test',
                quantity: largeQuantity,
                price
            });

            // Assert
            expect(orderItem.total.amount).toBe(100.00); // 0.01 * 10000
            expect(orderItem.quantity).toBe(10000);
        });
    });
});