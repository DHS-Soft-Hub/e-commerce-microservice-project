/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query GetOrderById($orderId: ID!) {\n  order(orderId: $orderId) {\n    createdAt\n    orderId\n    status\n    updatedAt\n    customer {\n      customerId\n      email\n      name\n      address {\n        city\n        country\n        postalCode\n        street\n      }\n    }\n    orderItems {\n      name\n      productId\n      quantity\n      price {\n        amount\n        currency\n      }\n      total {\n        amount\n        currency\n      }\n    }\n    payment {\n      method\n      status\n      transactionId\n    }\n    shipping {\n      method\n      status\n      trackingNumber\n      address {\n        city\n        country\n        postalCode\n        street\n      }\n    }\n    totals {\n      grandTotal {\n        amount\n        currency\n      }\n      subtotal {\n        amount\n        currency\n      }\n      tax {\n        amount\n        currency\n      }\n    }\n  }\n}": typeof types.GetOrderByIdDocument,
};
const documents: Documents = {
    "query GetOrderById($orderId: ID!) {\n  order(orderId: $orderId) {\n    createdAt\n    orderId\n    status\n    updatedAt\n    customer {\n      customerId\n      email\n      name\n      address {\n        city\n        country\n        postalCode\n        street\n      }\n    }\n    orderItems {\n      name\n      productId\n      quantity\n      price {\n        amount\n        currency\n      }\n      total {\n        amount\n        currency\n      }\n    }\n    payment {\n      method\n      status\n      transactionId\n    }\n    shipping {\n      method\n      status\n      trackingNumber\n      address {\n        city\n        country\n        postalCode\n        street\n      }\n    }\n    totals {\n      grandTotal {\n        amount\n        currency\n      }\n      subtotal {\n        amount\n        currency\n      }\n      tax {\n        amount\n        currency\n      }\n    }\n  }\n}": types.GetOrderByIdDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetOrderById($orderId: ID!) {\n  order(orderId: $orderId) {\n    createdAt\n    orderId\n    status\n    updatedAt\n    customer {\n      customerId\n      email\n      name\n      address {\n        city\n        country\n        postalCode\n        street\n      }\n    }\n    orderItems {\n      name\n      productId\n      quantity\n      price {\n        amount\n        currency\n      }\n      total {\n        amount\n        currency\n      }\n    }\n    payment {\n      method\n      status\n      transactionId\n    }\n    shipping {\n      method\n      status\n      trackingNumber\n      address {\n        city\n        country\n        postalCode\n        street\n      }\n    }\n    totals {\n      grandTotal {\n        amount\n        currency\n      }\n      subtotal {\n        amount\n        currency\n      }\n      tax {\n        amount\n        currency\n      }\n    }\n  }\n}"): (typeof documents)["query GetOrderById($orderId: ID!) {\n  order(orderId: $orderId) {\n    createdAt\n    orderId\n    status\n    updatedAt\n    customer {\n      customerId\n      email\n      name\n      address {\n        city\n        country\n        postalCode\n        street\n      }\n    }\n    orderItems {\n      name\n      productId\n      quantity\n      price {\n        amount\n        currency\n      }\n      total {\n        amount\n        currency\n      }\n    }\n    payment {\n      method\n      status\n      transactionId\n    }\n    shipping {\n      method\n      status\n      trackingNumber\n      address {\n        city\n        country\n        postalCode\n        street\n      }\n    }\n    totals {\n      grandTotal {\n        amount\n        currency\n      }\n      subtotal {\n        amount\n        currency\n      }\n      tax {\n        amount\n        currency\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;