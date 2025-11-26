const TOKEN_KEY = 'accessToken'

export const setAccessToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY)