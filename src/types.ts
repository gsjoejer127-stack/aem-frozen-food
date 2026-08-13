/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'zh' | 'ms';

export interface ProductVariant {
  id: string;
  size: string;
  price: number;
  type: 'pkt' | 'ctn' | 'unit' | 'box' | 'pck';
}

export interface Product {
  id: string;
  name: string;
  nameZh: string;
  category: string;
  barcode: string;
  image: string;
  description: string;
  descriptionZh: string;
  variants: ProductVariant[];
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameZh: string;
  iconName: string; // Corresponding to Lucide icon name
  description: string;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface DeliveryRegion {
  id: 'klang-valley' | 'outstation';
  name: string;
  nameZh: string;
  minFreeOrder: number;
  deliveryFee: number;
  description: string;
  descriptionZh: string;
}
