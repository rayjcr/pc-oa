import fetch from 'utils/fetch';

export function loginByEmailadmin (username, password, userId, kaptcha, platform) {
  const data = {
    username,
    password,
    kaptcha,
    userId,
    platform
  };
  return fetch({
    url: '/api/auth/jwt/token',
    method: 'post',
    data
  });
}
export function loginByEmail(adminusercode, adminpassword, usercode) {
  const data = {
    adminusercode,
    adminpassword,
    usercode,
  };
  return fetch({
    url: '/api/auth/jwt/adminToanyToken',
    method: 'post',
    data
  });
}
export function logout(token) {
  return fetch({
    url: '/api/auth/jwt/invalid',
    method: 'post',
    params: { token }
  });
}


export function lga(data) {
  return fetch({
    url: '/api/auth/jwt/token',
    method: 'post',
    data
  });
}

export function getvalidateYzm(params) {
  return fetch({
    url: '/api/auth/jwt/vrifyKaptcha',
    method: 'get',
    params
  })
}

export function checkValidate(params) {
  return fetch({
    url: '/api/auth/jwt/mobileToken',
    method: 'post',
    data:params
  })
}

export function validatePhone(params) {
  return fetch({
    url: '/api/auth/jwt/mobileKaptcha',
    method: 'post',
    data:params
  })
}

export function editPwd(params) {
  return fetch({
    url: '/api/auth/jwt/editPassword?newPass='+params.newPass+"&token="+params.token,
    method: 'post',
    data:params
  })
}

// http://lcyhqqxx.91sst.com/api/auth/jwt/editPassword?newPass=ryudo1212&token=eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxNTQ0MjMyIiwidXNlcklkIjoiNjAxMmU5NDYtMTlmMS00OGQ2LTk3OTQtM2VhYjU0OWQ0MzZmIiwidXNlck5hbWUiOiLlp5znkoAiLCJ4eGRtIjoiMTU0NCIsInR5cGUiOiIzIiwibW9iaWxlIjoiMTM1ODg3MjcxNTgiLCJ1c2VyY29kZSI6IjIzMiIsImV4cGlyZSI6MTU5MzA4MzgxNzQ3M30.E41RXzQbyoVmOaC7OTHCcN-d8idFgHK0ZzCAHxslVjJGfCB0FZDoPDLfkGqNnrNIjcDsy6U5zlq50Tg8pOYT0SswpAKHQQHttlxlC0hUGVqV6o3s6bT6u2a2BxnCkjUUvx-0rZLTV1Xubypw1Kmz0eWbUggG0TnlAqRs09msh5I

//授权日志分页列表 
export function logPage(params) {
  return fetch({
    url: '/api/auth/jwt/logPage',
    method: 'get',
    params
  })
}

//GET 导出授权日志

export function logExport(params) {
  return fetch({
    url: '/api/auth/jwt/logExport',
    method: 'get',
    responseType: 'arraybuffer',
    params
  })
}

// export function getvalidateYzm(params) {
//   return fetch({
//     url: '/api/auth/jwt/vrifyKaptcha',
//     method: 'get',
//     params
//   })
// }

export function getDingToken(query) {
  return fetch({
      url: `/api/auth/jwt/getUserByDuserId`,
      method: 'get',
      params: query
  });
}

