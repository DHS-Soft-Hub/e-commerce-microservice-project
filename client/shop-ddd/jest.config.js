/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: [
        '**/__tests__/**/*.{test,spec}.{ts,tsx}',
        '**/*.(test|spec).{ts,tsx}'
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        'setup.ts'
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/__tests__/**',
        '!src/**/node_modules/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@core/(.*)$': '<rootDir>/../core/src/$1'
    }
};