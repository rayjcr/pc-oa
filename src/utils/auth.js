import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token';
const CookieTokenKey = 'Authorization';

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  Cookies.set(CookieTokenKey, token);
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  console.log("ddccc")
  return Cookies.remove(TokenKey)
}
