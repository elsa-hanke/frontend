import axios from 'axios'
import { AloituskeskusteluLomake, KoulutussopimusLomake } from '@/types'

export async function getKoejakso() {
  const path = '/erikoistuva-laakari/koejakso'
  return await axios.get(path)
}

export async function postKoulutussopimus(form: KoulutussopimusLomake) {
  const path = 'erikoistuva-laakari/koejakso/koulutussopimus'
  return await axios.post(path, form)
}

export async function putKoulutussopimus(form: KoulutussopimusLomake) {
  const path = 'erikoistuva-laakari/koejakso/koulutussopimus'
  return await axios.put(path, form)
}

export async function postAloituskeskustelu(form: AloituskeskusteluLomake) {
  const path = 'erikoistuva-laakari/koejakso/aloituskeskustelu'
  return await axios.post(path, form)
}

export async function putAloituskeskustelu(form: AloituskeskusteluLomake) {
  const path = 'erikoistuva-laakari/koejakso/aloituskeskustelu'
  return await axios.post(path, form)
}

export async function getKouluttajat() {
  const path = '/kouluttajat'
  return await axios.get(path)
}
