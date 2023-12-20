export const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
        const error = (res.status === 404) ? new Error('Not found') : new Error('An error occurred while fetching the data.')
        throw error
    }

    return res.json()
}

export const swr_options = {
    errorRetryCount: 0,
    revalidateOnFocus: false,
    // revalidateOnMount:false,
    shouldRetryOnError: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
  }