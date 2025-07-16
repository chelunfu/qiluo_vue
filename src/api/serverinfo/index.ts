import { EventSourcePolyfill } from 'event-source-polyfill'
import { useUserStoreWithOut } from '@/store/modules/user'

import { type Ref, onDeactivated, onUnmounted, ref } from 'vue'
const PATH_URL = import.meta.env.VITE_API_BASE_PATH
export enum ServerInfoApi {
  server_update = '/sys/serverinfo/server_update'
}

export const useSSE = (_url: string) => {
  const data: Ref<string | null> = ref(null)
  const userStore = useUserStoreWithOut()
  const es = new EventSourcePolyfill(PATH_URL + _url, {
    headers: {
      'Content-Type': 'application/json',
      ['Authorization']: userStore.getTokenType + ' ' + userStore.getToken
    }
  })
  es.onmessage = (e: MessageEvent) => {
    data.value = e.data
  }
  onDeactivated(() => {
    es.close()
  })
  onUnmounted(() => {
    es.close()
  })
  return { data }
}
