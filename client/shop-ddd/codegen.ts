import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: process.env.API_GATEWAY_URL ?? 'http://localhost:5000/graphql',
    documents: 'src/features/orders/infrastructure/api/queries/**/*.graphql',
    generates: {
        'src/features/orders/infrastructure/api/__generated__/': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-graphql-request'
            ],
            preset: 'client',
            presetConfig: {
                fragmentMasking: false
            },
            config: {
                avoidOptionals: true
            }
        }
    }
};
export default config;
