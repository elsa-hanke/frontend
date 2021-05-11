import axios from 'axios'
import { AloituskeskusteluLomake, KoulutussopimusLomake } from '@/types'

export async function getKoejaksot() {
  const path = 'kouluttaja/koejaksot'
  return await axios.get(path)
}

export async function getKoulutussopimus(id: number) {
  const path = `/kouluttaja/koejakso/koulutussopimus/${id}`
  return await axios.get(path)
}

export async function putKoulutussopimus(form: KoulutussopimusLomake) {
  const path = 'kouluttaja/koejakso/koulutussopimus'
  return await axios.put(path, form)
}

export async function putAloituskeskustelu(form: AloituskeskusteluLomake) {
  const path = 'kouluttaja/koejakso/aloituskeskustelu'
  return await axios.put(path, form)
}
