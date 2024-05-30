export const serverOrigin = 'http://localhost:3001'

export function http(method, url, body, content = 'application/json') {
  if (!url.includes('http')) {
    url = serverOrigin + url
  }

  return window.fetch(url, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': content
    },
    body
  }).then(res => res.json()).catch(error => {
    console.error('Error:', error);
  });
}

export function get(url) {
  return http('GET', url, null)
}

export function post(url, json) {
  return http('POST', url, JSON.stringify(json))

}

