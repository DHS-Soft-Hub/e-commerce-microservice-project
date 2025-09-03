import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    // Use a local SDL schema file to avoid relying on server introspection
    schema: './schema.graphql',
    // Support queries placed under domain or repositories layers
    documents: 'src/features/**/api/queries/**/*.graphql',
    generates: {
        'src/features/orders/infrastructure/api/__generated__/graphql.ts': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-graphql-request'
            ],
            config: {
                avoidOptionals: true
            }
        }
    }
};
export default config;
