export const sanitizeText = (str, maxLength = 2000) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/\0/g, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, maxLength);
};

export const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email.trim()) && email.length <= 100;
};
