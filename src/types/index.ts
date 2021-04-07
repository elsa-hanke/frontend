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
  id?: number | null
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

export interface PoissaoloLomake {
  tyoskentelyjaksot: any[]
  poissaolonSyyt: any[]
}
