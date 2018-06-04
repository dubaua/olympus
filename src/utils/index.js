import accounting from 'accounting';

/* eslint-disable import/prefer-default-export */
export const numberWithSpaces = number => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const formatPrice = price => accounting.formatNumber(price, 2, ' ').replace('.', ',');
