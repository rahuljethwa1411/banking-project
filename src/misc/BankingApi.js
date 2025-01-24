import axios from 'axios';

export const bankingApi = {
  authenticate,
  register,
  logout,
  getUser,
  getTransactions,
  withdraw,
  deposit,
  transfer,
  getCreditCardTransactions,
  applyCreditCard,
  getPendingCreditCards, // New method
  updateCreditCardStatus, // New method
};

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

// -- User Management
function authenticate(username, password) {
  return instance.post('/api/v1/login', { username, password }, {
    headers: { 'Content-type': 'application/json' },
  });
}

function register(user) {
  return instance.post('/api/v1/register', user, {
    headers: { 'Content-type': 'application/json' },
  });
}

function logout() {
  return instance.post('/api/v1/logout', null, {
    withCredentials: true,
  });
}

// -- Get User Details (Bank Account and Credit Card Details as well)
function getUser(user) {
  const url = "/api/v1/users/me";
  return instance.get(url, {
    headers: { 'Authorization': basicAuth(user) },
  });
}

// -- Bank Account Features
function getTransactions(bankAccountId, user) {
  const url = `/api/v1/bank-accounts/${bankAccountId}/history`;
  return instance.get(url, {
    headers: { 'Authorization': basicAuth(user) },
  });
}

function withdraw(bankAccountNumber, amount, user) {
  return instance.post('api/v1/bank-accounts/withdraw', {
    'bankAccountNumber': bankAccountNumber,
    'amount': amount,
  }, {
    headers: { 'Authorization': basicAuth(user) },
  });
}

function deposit(bankAccountNumber, amount, user) {
  return instance.post('api/v1/bank-accounts/deposit', {
    'bankAccountNumber': bankAccountNumber,
    'amount': amount,
  }, {
    headers: { 'Authorization': basicAuth(user) },
  });
}

function transfer(fromBankAccountNumber, toBankAccountNumber, amount, user) {
  return instance.post('/api/v1/bank-accounts/transfer', {
    'fromBankAccountNumber': fromBankAccountNumber,
    'toBankAccountNumber': toBankAccountNumber,
    "amount": amount,
  }, {
    headers: { 'Authorization': basicAuth(user) },
  });
}

// -- Credit Card Features
function getCreditCardTransactions(creditCardId, user) {
  const url = `/api/v1/credit-cards/${creditCardId}/history`;
  return instance.get(url, {
    headers: { 'Authorization': basicAuth(user) },
  });
}

function applyCreditCard(annualSalary, cardType, user) {
  return instance.post('/api/v1/credit-cards/apply', {
    'annualSalary': annualSalary,
    'cardType': cardType,
  }, {
    headers: { 'Authorization': basicAuth(user) },
  });
}

// -- New Methods for Admin Dashboard

// Fetch all pending credit cards
function getPendingCreditCards(user) {
  const url = "/api/v1/credit-cards/pending";
  return instance.get(url, {
    headers: { 'Authorization': basicAuth(user) },
  });
}

// Update credit card status (approve/reject)
function updateCreditCardStatus(creditCardId, status, user) {
  const url = `/api/v1/credit-cards/${creditCardId}/status`;
  return instance.put(
    url,
    {}, // No request body needed
    {
      params: { status }, // Pass status as a query parameter
      headers: { 'Authorization': basicAuth(user) },
    }
  );
}

// -- Helper functions

function basicAuth(user) {
  return `Basic ${user.authdata}`;
}