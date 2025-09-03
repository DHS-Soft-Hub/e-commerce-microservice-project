/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: [
        '**/__tests__/**/*.{ts,tsx}',
        '**/*.(test|spec).{ts,tsx}'
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
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@core/(.*)$': '<rootDir>/../core/src/$1'
    }
};