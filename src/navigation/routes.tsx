import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { ManageDomainPage } from '@/pages/ManageDomainPage/ManageDomainPage';
import { AddSubdomainPage } from '@/pages/AddSubdomainPage/AddSubdomainPage';
import { CreateCollectionPage } from '@/pages/CreateCollectionPage/CreateCollectionPage';

export interface RouteType {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: RouteType[] = [
  { path: '/', Component: IndexPage },
  { path: '/create-collection', Component: CreateCollectionPage },
  { path: '/add-subdomain', Component: AddSubdomainPage },
  { path: '/manage', Component: ManageDomainPage },
];
