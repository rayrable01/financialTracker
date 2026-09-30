export type PaymentSystem = 'visa' | 'mastercard' | 'mir' | 'unknown';

export interface Card {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cardType: PaymentSystem;
  balance: number;
  currency: string;
  gradient: string;
  createdAt: string;
}

export type CreateCardDto = Omit<Card, 'id' | 'createdAt'> & {
  cvv: string;
};

export type UpdateCardDto = Partial<Omit<Card, 'id' | 'createdAt'>>;

export interface CardPreview {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cardType: PaymentSystem;
  gradient: string;
}
