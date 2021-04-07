import { Kouluttaja, Koulutuspaikka, Vastuuhenkilo } from '@/types'

export const vaativuustasot = [
  {
    arvo: 1,
    nimi: 'helppo',
    kuvaus: 'lorem-ipsum'
  },
  {
    arvo: 2,
    nimi: 'tavallista-helpompi',
    kuvaus: 'lorem-ipsum'
  },
  {
    arvo: 3,
    nimi: 'tavallinen',
    kuvaus: 'lorem-ipsum'
  },
  {
    arvo: 4,
    nimi: 'kohtalaisen-vaativa',
    kuvaus: 'lorem-ipsum'
  },
  {
    arvo: 5,
    nimi: 'erittain-vaativa',
    kuvaus: 'lorem-ipsum'
  }
]

export const luottamuksenTasot = [
  {
    arvo: 1,
    nimi: 'ohjaajan-toiminnan-seuraaminen',
    kuvaus: 'ohjaajan-toiminnan-seuraaminen-ohje'
  },
  {
    arvo: 2,
    nimi: 'toiminta-suoran-ohjauksen-alaisena',
    kuvaus: 'toiminta-suoran-ohjauksen-alaisena-ohje'
  },
  {
    arvo: 3,
    nimi: 'toiminta-epasuoran-ohjauksen-alaisena',
    kuvaus: 'toiminta-epasuoran-ohjauksen-alaisena-ohje'
  },
  {
    arvo: 4,
    nimi: 'toiminta-ilman-ohjausta',
    kuvaus: 'toiminta-ilman-ohjausta-ohje'
  },
  {
    arvo: 5,
    nimi: 'toiminta-ohjaajana',
    kuvaus: 'toiminta-ohjaajana-ohje'
  }
]

export const tyoskentelypaikkaTyypit = {
  TERVEYSKESKUS: 'terveyskeskus',
  KESKUSSAIRAALA: 'keskussairaala',
  YLIOPISTOLLINEN_SAIRAALA: 'yliopistollinen-sairaala',
  YKSITYINEN: 'yksityinen',
  MUU: 'muu'
} as any

export const tyoskentelyjaksoKaytannonKoulutusTyypit = {
  OMAN_ERIKOISALAN_KOULUTUS: 'oman-erikoisalan-koulutus',
  OMAA_ERIKOISALAA_TUKEVA_KOULUTUS: 'omaa-erikoisalaa-tukeva-tai-taydentava-koulutus',
  TUTKIMUSTYO: 'tutkimustyo',
  TERVEYSKESKUSTYO: 'terveyskeskustyo'
} as any

export const arvioinninPerustuminen = {
  LasnaolevaHavainnointi: 'LASNA',
  KirjallinenMateriaali: 'KIRJALLINEN',
  Etayhteys: 'ETA',
  Muu: 'MUU'
} as any

export enum KoulutussopimusTilat {
  UUSI = 'UUSI',
  HYVAKSYTTY = 'HYVAKSYTTY',
  PALAUTETTU_KORJATTAVAKSI = 'PALAUTETTU_KORJATTAVAKSI',
  TALLENNETTU_KESKENERAISENA = 'TALLENNETTU_KESKENERAISENA',
  ODOTTAA_HYVAKSYNTAA = 'ODOTTAA_HYVAKSYNTAA'
}

export const defaultKoulutuspaikka: Koulutuspaikka = {
  id: null,
  erikoisala: '',
  nimi: '',
  yliopisto: ''
}

export const defaultKouluttaja: Kouluttaja = {
  kayttajaId: null,
  kuittausaika: '',
  lahiosoite: '',
  nimi: 'Testi Kouluttaja',
  nimike: 'professori',
  postitoimipaikka: '',
  puhelin: '',
  sahkoposti: '',
  sopimusHyvaksytty: false,
  toimipaikka: ''
}

// TODO remove dummy
export const yliopistot = [
  {
    name: 'Yliopisto 1',
    value: 1
  },
  {
    name: 'Yliopisto 2',
    value: 2
  },
  {
    name: 'Yliopisto 3',
    value: 3
  },
  {
    name: 'Yliopisto 4',
    value: 4
  },
  {
    name: 'Yliopisto 5',
    value: 5
  }
]

// TODO remove dummy
export const vastuuhenkilot: Vastuuhenkilo[] = [
  {
    nimi: 'Ville Vastaava',
    nimike: 'dosentti',
    id: 1,
    kuittausaika: '',
    sopimusHyvaksytty: false
  },
  {
    nimi: 'Erkki Erikoinen',
    nimike: 'professori',
    id: 2,
    kuittausaika: '',
    sopimusHyvaksytty: false
  }
]
