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