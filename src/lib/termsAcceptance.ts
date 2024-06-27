const LOCALSTORAGE_KEY = '@niftyswap.legal.termsAccepted';

export const areTermsAccepted = () => {
  const termsAccepted = localStorage.getItem(LOCALSTORAGE_KEY);
  return termsAccepted === 'true';
};

export const setTermsAccepted = () => {
  localStorage.setItem(LOCALSTORAGE_KEY, 'true');
};
