export type ErikoistuvaLaakari = {
  erikoisalaId: number
  id: number
  kayttajaId: number
  opintojenAloitusvuosi: string
  opiskelijatunnus: string
  puhelinnumero: string
  sahkoposti: string
}

export interface UserAccount {
  activated: boolean
  firstName: string
  lastName: string
  email: string
  authorities: string[]
  erikoistuvaLaakari: ErikoistuvaLaakari
  id: string
  login: string
  langKey: string
  createdBy: string
  createdDate: string
  lastModifiedBy: string
  lastModifiedDate: string
  profilePicture: {
    src: string
  }
}

export interface ArviointipyyntoLomake {
  tyoskentelyjaksot: any[]
  kunnat: any[]
  erikoisalat: any[]
  epaOsaamisalueenKategoriat: any[]
  kouluttajat: any[]
}

export interface SuoritemerkintaLomake {
  tyoskentelyjaksot: any[]
  kunnat: any[]
  erikoisalat: any[]
  oppimistavoitteenKategoriat: any[]
}

export interface TyoskentelyjaksoLomake {
  kunnat: any[]
  erikoisalat: any[]
}

export type Koulutuspaikka = {
  erikoisala: string
  nimi: string
  id: number | null
  yliopisto: string
}

export type Kouluttaja = {
  id: number | null
  kayttajaId: number | null
  kuittausaika: string
  lahiosoite: string
  nimi: string
  nimike: string
  postitoimipaikka: string
  puhelin: string
  sahkoposti: string
  sopimusHyvaksytty: boolean
  toimipaikka: string
}

export type Vastuuhenkilo = {
  id: number
  kuittausaika: string
  nimi: string
  nimike: string
  sopimusHyvaksytty: boolean
}

export interface KoulutussopimusLomake {
  erikoistuvanNimi: string
  erikoistuvanOpiskelijatunnus: string
  erikoistuvanPuhelinnumero: string
  erikoistuvanSahkoposti: string
  erikoistuvanSyntymaaika: string
  erikoistuvanYliopisto: string
  id: number
  koejaksonAlkamispaiva: string
  korjausehdotus: string
  kouluttajat: Kouluttaja[]
  koulutuspaikat: Koulutuspaikka[]
  lahetetty: boolean
  muokkauspaiva: string
  opintooikeudenMyontamispaiva: string
  vastuuhenkilo: Vastuuhenkilo
}

export type Lahikouluttaja = {
  id: number
  kuittausaika: string
  nimi: string
  sopimusHyvaksytty: boolean
}

export type Lahiesimies = {
  id: number
  kuittausaika: string
  nimi: string
  sopimusHyvaksytty: boolean
}

export type BlobFileResult = {
  anchorElement: any
  error: boolean
  msSaveOrOpenBlob: boolean
}

export interface AloituskeskusteluLomake {
  erikoistuvanErikoisala: string
  erikoistuvanNimi: string
  erikoistuvanOpiskelijatunnus: string
  erikoistuvanSahkoposti: string
  erikoistuvanYliopisto: string
  id: number
  koejaksonAlkamispaiva: string
  koejaksonOsaamistavoitteet: string
  koejaksonPaattymispaiva: string
  koejaksonSuorituspaikka: string
  koejaksonToinenSuorituspaikka: string
  korjausehdotus: string
  lahetetty: boolean
  lahiesimies: Lahiesimies
  lahikouluttaja: Lahikouluttaja
  muokkauspaiva: string
  suoritettuKokoaikatyossa: boolean
  tyotunnitViikossa: number
}

export interface PoissaoloLomake {
  tyoskentelyjaksot: any[]
  poissaolonSyyt: any[]
}

export interface Koejakso {
  aloituskeskustelu: AloituskeskusteluLomake
  aloituskeskustelunTila: string | null
  koulutusSopimuksenTila: string | null
  koulutussopimus: KoulutussopimusLomake
}

export interface Asiakirja {
  id: number
  nimi: string
  lisattypvm: string
  disablePreview: boolean
  disableDownload: boolean
  disableDelete: boolean
}
