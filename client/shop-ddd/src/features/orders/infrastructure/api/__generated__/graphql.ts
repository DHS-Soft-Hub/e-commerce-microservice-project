/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  street: Scalars['String']['output'];
};

export type Customer = {
  __typename?: 'Customer';
  address: Address;
  customerId: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Money = {
  __typename?: 'Money';
  amount: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
};

export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['DateTime']['output'];
  customer: Customer;
  orderId: Scalars['ID']['output'];
  orderItems: Array<OrderItem>;
  payment: Payment;
  shipping: Shipping;
  status: Scalars['String']['output'];
  totals: Totals;
  updatedAt: Scalars['DateTime']['output'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  name: Scalars['String']['output'];
  price: Money;
  productId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  total: Money;
};

export type Payment = {
  __typename?: 'Payment';
  method: Scalars['String']['output'];
  status: Scalars['String']['output'];
  transactionId: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  order: Maybe<Order>;
};


export type QueryOrderArgs = {
  orderId: Scalars['ID']['input'];
};

export type Shipping = {
  __typename?: 'Shipping';
  address: Address;
  method: Scalars['String']['output'];
  status: Scalars['String']['output'];
  trackingNumber: Scalars['String']['output'];
};

export type Totals = {
  __typename?: 'Totals';
  grandTotal: Money;
  subtotal: Money;
  tax: Money;
};

export type GetOrderByIdQueryVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type GetOrderByIdQuery = { __typename?: 'Query', order: { __typename?: 'Order', createdAt: any, orderId: string, status: string, updatedAt: any, customer: { __typename?: 'Customer', customerId: string, email: string, name: string, address: { __typename?: 'Address', city: string, country: string, postalCode: string, street: string } }, orderItems: Array<{ __typename?: 'OrderItem', name: string, productId: string, quantity: number, price: { __typename?: 'Money', amount: number, currency: string }, total: { __typename?: 'Money', amount: number, currency: string } }>, payment: { __typename?: 'Payment', method: string, status: string, transactionId: string }, shipping: { __typename?: 'Shipping', method: string, status: string, trackingNumber: string, address: { __typename?: 'Address', city: string, country: string, postalCode: string, street: string } }, totals: { __typename?: 'Totals', grandTotal: { __typename?: 'Money', amount: number, currency: string }, subtotal: { __typename?: 'Money', amount: number, currency: string }, tax: { __typename?: 'Money', amount: number, currency: string } } } | null };


export const GetOrderByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"street"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"trackingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"street"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"grandTotal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderByIdQuery, GetOrderByIdQueryVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  street: Scalars['String']['output'];
};

export type Customer = {
  __typename?: 'Customer';
  address: Address;
  customerId: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Money = {
  __typename?: 'Money';
  amount: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
};

export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['DateTime']['output'];
  customer: Customer;
  orderId: Scalars['ID']['output'];
  orderItems: Array<OrderItem>;
  payment: Payment;
  shipping: Shipping;
  status: Scalars['String']['output'];
  totals: Totals;
  updatedAt: Scalars['DateTime']['output'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  name: Scalars['String']['output'];
  price: Money;
  productId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  total: Money;
};

export type Payment = {
  __typename?: 'Payment';
  method: Scalars['String']['output'];
  status: Scalars['String']['output'];
  transactionId: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  order: Maybe<Order>;
};


export type QueryOrderArgs = {
  orderId: Scalars['ID']['input'];
};

export type Shipping = {
  __typename?: 'Shipping';
  address: Address;
  method: Scalars['String']['output'];
  status: Scalars['String']['output'];
  trackingNumber: Scalars['String']['output'];
};

export type Totals = {
  __typename?: 'Totals';
  grandTotal: Money;
  subtotal: Money;
  tax: Money;
};

export type GetOrderByIdQueryVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type GetOrderByIdQuery = { __typename?: 'Query', order: { __typename?: 'Order', createdAt: any, orderId: string, status: string, updatedAt: any, customer: { __typename?: 'Customer', customerId: string, email: string, name: string, address: { __typename?: 'Address', city: string, country: string, postalCode: string, street: string } }, orderItems: Array<{ __typename?: 'OrderItem', name: string, productId: string, quantity: number, price: { __typename?: 'Money', amount: number, currency: string }, total: { __typename?: 'Money', amount: number, currency: string } }>, payment: { __typename?: 'Payment', method: string, status: string, transactionId: string }, shipping: { __typename?: 'Shipping', method: string, status: string, trackingNumber: string, address: { __typename?: 'Address', city: string, country: string, postalCode: string, street: string } }, totals: { __typename?: 'Totals', grandTotal: { __typename?: 'Money', amount: number, currency: string }, subtotal: { __typename?: 'Money', amount: number, currency: string }, tax: { __typename?: 'Money', amount: number, currency: string } } } | null };


export const GetOrderByIdDocument = gql`
    query GetOrderById($orderId: ID!) {
  order(orderId: $orderId) {
    createdAt
    orderId
    status
    updatedAt
    customer {
      customerId
      email
      name
      address {
        city
        country
        postalCode
        street
      }
    }
    orderItems {
      name
      productId
      quantity
      price {
        amount
        currency
      }
      total {
        amount
        currency
      }
    }
    payment {
      method
      status
      transactionId
    }
    shipping {
      method
      status
      trackingNumber
      address {
        city
        country
        postalCode
        street
      }
    }
    totals {
      grandTotal {
        amount
        currency
      }
      subtotal {
        amount
        currency
      }
      tax {
        amount
        currency
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetOrderById(variables: GetOrderByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetOrderByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetOrderByIdQuery>({ document: GetOrderByIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetOrderById', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;