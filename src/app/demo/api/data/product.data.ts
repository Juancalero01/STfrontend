import { IProduct } from '../interfaces/product.interface';

export const PRODUCTS: IProduct[] = [
  {
    id: 1,
    client: {
      id: 118,
      taxpayerName: 'WORLDLINE CBA',
    },
    productType: {
      id: 2,
      prefix: '0300',
      name: 'CGI-300 Basic',
    },
    serial: '0300-2041',
    reference: '0001-R-00003377',
    deliveryDate: new Date('2022-05-31'),
  },
  {
    id: 2,
    client: {
      id: 117,
      taxpayerName: 'WORLDLINE BS AS',
    },
    productType: {
      id: 2,
      prefix: '0300',
      name: 'CGI-300 Basic',
    },
    serial: '0300-2042',
    reference: '0001-R-00003377',
    deliveryDate: new Date('2022-05-31'),
  },
  {
    id: 2,
    client: {
      id: 117,
      taxpayerName: 'WORLDLINE BS AS',
    },
    productType: {
      id: 3,
      prefix: '0000',
      name: 'CGI-500 AB',
    },
    serial: '0300-2042',
    reference: '0001-R-00003377',
    deliveryDate: new Date('2022-05-31'),
  },
];
