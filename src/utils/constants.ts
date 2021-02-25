export const vaativuustasot = [
  {
    arvo: 1,
    nimi: "helppo",
    kuvaus: "lorem-ipsum"
  },
  {
    arvo: 2,
    nimi: "tavallista-helpompi",
    kuvaus: "lorem-ipsum"
  },
  {
    arvo: 3,
    nimi: "tavallinen",
    kuvaus: "lorem-ipsum"
  },
  {
    arvo: 4,
    nimi: "kohtalaisen-haastava",
    kuvaus: "lorem-ipsum"
  },
  {
    arvo: 5,
    nimi: "hyvin-vaativa",
    kuvaus: "lorem-ipsum"
  }
];

export const luottamuksenTasot = [
  {
    arvo: 1,
    nimi: "ohjaajan-toiminnan-seuraaminen",
    kuvaus: "ohjaajan-toiminnan-seuraaminen-ohje"
  },
  {
    arvo: 2,
    nimi: "toiminta-suoran-ohjauksen-alaisena",
    kuvaus: "toiminta-suoran-ohjauksen-alaisena-ohje"
  },
  {
    arvo: 3,
    nimi: "toiminta-epasuoran-ohjauksen-alaisena",
    kuvaus: "toiminta-epasuoran-ohjauksen-alaisena-ohje"
  },
  {
    arvo: 4,
    nimi: "toiminta-ilman-ohjausta",
    kuvaus: "toiminta-ilman-ohjausta-ohje"
  },
  {
    arvo: 5,
    nimi: "toiminta-ohjaajana",
    kuvaus: "toiminta-ohjaajana-ohje"
  }
];

export const tyoskentelypaikkaTyypit = {
  TERVEYSKESKUS: "terveyskeskus",
  KESKUSSAIRAALA: "keskussairaala",
  YLIOPISTOLLINEN_SAIRAALA: "yliopistollinen-sairaala",
  YKSITYINEN: "yksityinen",
  MUU: "muu"
} as any;

export const tyoskentelyjaksoKaytannonKoulutusTyypit = {
  OMAN_ERIKOISALAN_KOULUTUS: "oman-erikoisalan-koulutus",
  OMAA_ERIKOISALAA_TUKEVA_KOULUTUS:
    "omaa-erikoisalaa-tukeva-tai-taydentava-koulutus",
  TUTKIMUSTYO: "tutkimustyo",
  TERVEYSKESKUSTYO: "terveyskeskustyo"
} as any;

export const arvioinninPerustuminen = {
  LasnaolevaHavainnointi: "LASNA",
  KirjallinenMateriaali: "KIRJALLINEN",
  Etayhteys: "ETA",
  Muu: "MUU"
} as any;
