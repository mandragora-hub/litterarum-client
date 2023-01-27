import { $fetch } from 'ohmyfetch'
import LRU from 'lru-cache'
import { hash as ohash } from 'ohash'
import type { Tag, MediaType, PageResult, Book, Author } from '../types'

const apiBaseUrl = 'http://localhost:3000'
// const apiBaseUrl = 'https://litterarum.onrender.com'
const API_VERSION = 'api/v1'
const ACCESS_TOKEN = 'b14eub2ig974nk92kv231w'

const cache = new LRU({
  max: 500,
  ttl: 2000 * 60 * 60, // 2 hour
})

function _fetchLitterarumApi(
  url: string,
  params: Record<string, string | number | undefined> = {}
) {
  // if (params.language == null) {
  //   const locale = useNuxtApp().$i18n.locale
  //   params.language = unref(locale)
  // }
  return $fetch(url, {
    baseURL: `${apiBaseUrl}/${API_VERSION}`,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    params,
  })
}

export function fetchLitterarumApi(
  url: string,
  params: Record<string, string | number | undefined> = {}
): Promise<any> {
  const hash = ohash([url, params])
  if (!cache.has(hash)) {
    cache.set(
      hash,
      _fetchLitterarumApi(url, params).catch((e) => {
        cache.delete(hash)
        throw e
      })
    )
  }
  return cache.get(hash)!
}

export function listMedia(
  type: MediaType,
  query: string,
  page: number
): Promise<PageResult<Book>> {
  return fetchLitterarumApi(`${type}/${query}`, { page })
}

// export function getMedia(type: MediaType, id: string): Promise<Book> {
//   return fetchLitterarumApi(`${type}/${id}`, {
//     append_to_response: 'videos,credits,images,external_ids,release_dates',
//     include_image_language: 'en',
//   })
// }

// /**
//  * Get recommended
//  */
// export function getRecommendations(
//   type: MediaType,
//   id: string,
//   page = 1
// ): Promise<PageResult<Book>> {
//   return fetchLitterarumApi(`${type}/${id}/recommendations`, { page })
// }

// /**
//  * Get trending
//  */
// export function getTrending(media: string, page = 1) {
//   return fetchLitterarumApi(`trending/${media}/week`, { page })
// }

// /**
//  * Discover media by genre
//  */
// export function getMediaByGenre(
//   media: string,
//   genre: string,
//   page = 1
// ): Promise<PageResult<Book>> {
//   return fetchLitterarumApi(`discover/${media}`, {
//     with_genres: genre,
//     page,
//   })
// }

// /**
//  * Get author
//  */
// export function getAuthor(id: string | number, type: string): Promise<Author> {
//   return fetchLitterarumApi(`author/${id}/${type}`)
// }

// /**
//  * Get tag list
//  */
// export function getTagList(
//   media: string
// ): Promise<{ name: string; id: number }[]> {
//   return fetchLitterarumApi(`genre/${media}/list`).then((res) => res.genres)
// }

// /**
//  * Get person (single)
//  */

// export function getPerson(id: string): Promise<Person> {
//   return fetchLitterarumApi(`person/${id}`, {
//     append_to_response: 'images,combined_credits,external_ids',
//     include_image_language: 'en',
//   })
// }

// /**
//  * Search (searches movies, tv and people)
//  */

// export function searchShows(query: string, page = 1) {
//   return fetchLitterarumApi('search/multi', { query, page })
// }
