
import { describe, it, expect } from '@jest/globals';
import { Address } from '../../value-objects/Address';

describe('Address Value Object', () => {
    describe('creation', () => {
        it('should create valid address instance', () => {
            // Arrange
            const addressData = {
                street: 'Main Street 123',
                city: 'Sofia',
                postalCode: '1000',
                country: 'Bulgaria'
            };

            // Act
            const address = Address.create(addressData);

            // Assert
            expect(address.street).toBe('Main Street 123');
            expect(address.city).toBe('Sofia');
            expect(address.postalCode).toBe('1000');
            expect(address.country).toBe('Bulgaria');
        });

        it('should trim whitespace from all fields', () => {
            // Arrange
            const addressData = {
                street: '  Main Street 123  ',
                city: '  Sofia  ',
                postalCode: '  1000  ',
                country: '  Bulgaria  '
            };

            // Act
            const address = Address.create(addressData);

            // Assert
            expect(address.street).toBe('Main Street 123');
            expect(address.city).toBe('Sofia');
            expect(address.postalCode).toBe('1000');
            expect(address.country).toBe('Bulgaria');
        });

        it('should accept different postal code formats', () => {
            // Arrange & Act
            const addressWithDashes = Address.create({
                street: 'Test Street',
                city: 'Test City',
                postalCode: '1000-ABC',
                country: 'Test Country'
            });

            const addressWithSpaces = Address.create({
                street: 'Test Street',
                city: 'Test City',
                postalCode: 'SW1A 1AA',
                country: 'UK'
            });

            // Assert
            expect(addressWithDashes.postalCode).toBe('1000-ABC');
            expect(addressWithSpaces.postalCode).toBe('SW1A 1AA');
        });
    });

    describe('validation errors', () => {
        it('should throw error for missing street', () => {
            // Arrange
            const addressData = {
                street: '',
                city: 'Sofia',
                postalCode: '1000',
                country: 'Bulgaria'
            };

            // Act & Assert
            expect(() => Address.create(addressData)).toThrow('Address.street required');
        });

        it('should throw error for whitespace-only street', () => {
            // Arrange
            const addressData = {
                street: '   ',
                city: 'Sofia',
                postalCode: '1000',
                country: 'Bulgaria'
            };

            // Act & Assert
            expect(() => Address.create(addressData)).toThrow('Address.street required');
        });

        it('should throw error for missing city', () => {
            // Arrange
            const addressData = {
                street: 'Main Street 123',
                city: '',
                postalCode: '1000',
                country: 'Bulgaria'
            };

            // Act & Assert
            expect(() => Address.create(addressData)).toThrow('Address.city required');
        });

        it('should throw error for whitespace-only city', () => {
            // Arrange
            const addressData = {
                street: 'Main Street 123',
                city: '   ',
                postalCode: '1000',
                country: 'Bulgaria'
            };

            // Act & Assert
            expect(() => Address.create(addressData)).toThrow('Address.city required');
        });

        it('should throw error for missing postal code', () => {
            // Arrange
            const addressData = {
                street: 'Main Street 123',
                city: 'Sofia',
                postalCode: '',
                country: 'Bulgaria'
            };

            // Act & Assert
            expect(() => Address.create(addressData)).toThrow('Address.postalCode required');
        });

        it('should throw error for missing country', () => {
            // Arrange
            const addressData = {
                street: 'Main Street 123',
                city: 'Sofia',
                postalCode: '1000',
                country: ''
            };

            // Act & Assert
            expect(() => Address.create(addressData)).toThrow('Address.country required');
        });

        it('should throw error for null values', () => {
            expect(() => Address.create({
                street: null as any,
                city: 'Sofia',
                postalCode: '1000',
                country: 'Bulgaria'
            })).toThrow('Address.street required');

            expect(() => Address.create({
                street: 'Main Street 123',
                city: null as any,
                postalCode: '1000',
                country: 'Bulgaria'
            })).toThrow('Address.city required');

            expect(() => Address.create({
                street: 'Main Street 123',
                city: 'Sofia',
                postalCode: null as any,
                country: 'Bulgaria'
            })).toThrow('Address.postalCode required');

            expect(() => Address.create({
                street: 'Main Street 123',
                city: 'Sofia',
                postalCode: '1000',
                country: null as any
            })).toThrow('Address.country required');
        });

        it('should throw error for undefined values', () => {
            expect(() => Address.create({
                street: undefined as any,
                city: 'Sofia',
                postalCode: '1000',
                country: 'Bulgaria'
            })).toThrow('Address.street required');
        });
    });

    describe('value object behavior', () => {
        it('should not allow modification of original input object to affect created address', () => {
            // Arrange
            const addressData = {
                street: 'Main Street 123',
                city: 'Sofia',
                postalCode: '1000',
                country: 'Bulgaria'
            };

            // Act
            const address = Address.create(addressData);
            addressData.street = 'Modified Street';

            // Assert - original address should not be affected
            expect(address.street).toBe('Main Street 123');
        });

        it('should maintain readonly properties at TypeScript level', () => {
            // Arrange
            const address = Address.create({
                street: 'Main Street 123',
                city: 'Sofia',
                postalCode: '1000',
                country: 'Bulgaria'
            });

            // Assert - properties are readonly at compile time
            expect(address.street).toBe('Main Street 123');
            expect(address.city).toBe('Sofia');
            expect(address.postalCode).toBe('1000');
            expect(address.country).toBe('Bulgaria');
        });
    });

    describe('real world scenarios', () => {
        it('should handle Bulgarian addresses correctly', () => {
            // Arrange & Act
            const bulgarianAddress = Address.create({
                street: '1 Vitosha Blvd',
                city: 'Sofia',
                postalCode: '1000',
                country: 'Bulgaria'
            });

            // Assert
            expect(bulgarianAddress.street).toBe('1 Vitosha Blvd');
            expect(bulgarianAddress.city).toBe('Sofia');
            expect(bulgarianAddress.country).toBe('Bulgaria');
        });

        it('should handle international addresses correctly', () => {
            // Arrange & Act
            const ukAddress = Address.create({
                street: '10 Downing Street',
                city: 'London',
                postalCode: 'SW1A 2AA',
                country: 'United Kingdom'
            });

            const usAddress = Address.create({
                street: '1600 Pennsylvania Avenue NW',
                city: 'Washington',
                postalCode: '20500',
                country: 'United States'
            });

            // Assert
            expect(ukAddress.postalCode).toBe('SW1A 2AA');
            expect(usAddress.city).toBe('Washington');
        });

        it('should handle apartment/unit numbers in street field', () => {
            // Arrange & Act
            const addressWithApartment = Address.create({
                street: 'Main Street 123, Apt 4B',
                city: 'Sofia',
                postalCode: '1000',
                country: 'Bulgaria'
            });

            // Assert
            expect(addressWithApartment.street).toBe('Main Street 123, Apt 4B');
        });
    });
});