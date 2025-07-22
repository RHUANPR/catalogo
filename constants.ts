
import { Product, Theme } from './types';

export const ADMIN_PASSWORD = 'admin'; // For demonstration purposes

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod1',
    name: 'Ração Premium para Cães Adultos',
    description: 'Ração completa e balanceada para cães adultos de todas as raças. Sabor frango e arroz.',
    price: 159.9,
    category: 'Alimentação',
    imageUrl: 'https://picsum.photos/seed/dogfood/400/400',
  },
  {
    id: 'prod2',
    name: 'Arranhador para Gatos',
    description: 'Arranhador de sisal com torre e brinquedo, ideal para o entretenimento do seu gato.',
    price: 89.9,
    category: 'Acessórios',
    imageUrl: 'https://picsum.photos/seed/catscratcher/400/400',
  },
  {
    id: 'prod3',
    name: 'Coleira de Couro para Cães',
    description: 'Coleira de couro legítimo, resistente e elegante para passeios seguros.',
    price: 45.5,
    category: 'Acessórios',
    imageUrl: 'https://picsum.photos/seed/collar/400/400',
  },
  {
    id: 'prod4',
    name: 'Brinquedo Bola com Dispenser',
    description: 'Bola de borracha resistente que solta petiscos enquanto seu pet brinca.',
    price: 29.9,
    category: 'Brinquedos',
    imageUrl: 'https://picsum.photos/seed/balltoy/400/400',
  },
  {
    id: 'prod5',
    name: 'Shampoo Hipoalergênico',
    description: 'Shampoo suave para cães e gatos com pele sensível. Fragrância neutra.',
    price: 35.0,
    category: 'Higiene',
    imageUrl: 'https://picsum.photos/seed/shampoo/400/400',
  },
  {
    id: 'prod6',
    name: 'Areia Higiênica para Gatos',
    description: 'Areia aglomerante de alta performance que neutraliza odores.',
    price: 25.0,
    category: 'Higiene',
    imageUrl: 'https://picsum.photos/seed/catsand/400/400',
  },
];

export const INITIAL_THEME: Theme = {
  primary: '#2563eb', // blue-600
  secondary: '#475569', // slate-600
  accent: '#ef4444', // red-500
  base100: '#f8fafc', // slate-50
  base200: '#e2e8f0', // slate-200
  base300: '#cbd5e1', // slate-300
};