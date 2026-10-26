export type LienAffilie = {
  marchand: string;
  url: string;
  prixAffiche?: string;
};

export type Produit = {
  slug: string;
  nom: string;
  categorie: string;
  description: string;
  dimensions?: string;
  materiaux?: string;
  prixIndicatif?: number;
  prixAvant?: number;
  promotionPourcent?: number;
  images: string[];
  liensAffilies: LienAffilie[];
  // Phase 2 — vente directe
  enVente?: boolean;
  fournisseur?: string;
  delaiLivraison?: string;
  origineGeographique?: string;
  /** DOIT être true pour que enVente soit activable */
  domainePublicOuGenerique: boolean;
};

export type Article = {
  slug: string;
  titre: string;
  metaDescription: string;
  type: "article" | "guide" | "comparatif";
  datePublication: string;
  dateMaj: string;
  auteur?: string;
  image?: string;
  imageAlt?: string;
  tags?: string[];
  produitsCites?: string[];
  contientLiensAffilies: boolean;
  tempsLecture?: number;
  comparatif?: Comparatif;
};

export type Categorie = {
  slug: string;
  nom: string;
  description: string;
  image?: string;
};

export type ItemComparatif = {
  nom: string;
  lienAffilie?: string;
  prix?: string;
  note?: number;
  [key: string]: string | number | boolean | undefined;
};

export type Comparatif = {
  slug: string;
  titre: string;
  colonnes: string[];
  items: ItemComparatif[];
};
