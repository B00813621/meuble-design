import type { Metadata } from "next";
import { getAllProduits } from "@/lib/content";
import { buildMetadata, jsonLdBreadcrumb } from "@/lib/seo";
import { BoutiqueGrid } from "@/components/BoutiqueGrid";
import { FAQSection } from "@/components/FAQSection";

type CategoryData = {
  nom: string;
  description: string;
  intro: string;
  conseil: string;
  faqs: { question: string; reponse: string }[];
};

const CATEGORIES: Record<string, CategoryData> = {
  canapes: {
    nom: "Canapés",
    description: "Canapés et fauteuils design pour un salon élégant.",
    intro: "Le canapé est la pièce maîtresse de votre salon. Que vous préfériez un modèle en tissu doux pour les soirées en famille ou un canapé en cuir au style industriel, notre sélection réunit les meilleures références design alliant confort et esthétique. Chaque modèle est choisi pour sa qualité de fabrication, sa durabilité et son rapport qualité/prix.",
    conseil: "Mesurez votre espace avant d'acheter : un canapé 3 places nécessite au minimum 220 cm de largeur. Prévoyez 80 cm de passage devant. Optez pour des housses déhoussables pour faciliter l'entretien.",
    faqs: [
      { question: "Quelle taille de canapé choisir pour un salon de 20 m² ?", reponse: "Pour un salon de 20 m², un canapé 3 places de 180-200 cm est idéal. Laissez au moins 70 cm de passage devant et 40 cm entre le canapé et la table basse." },
      { question: "Tissu ou cuir : quel revêtement pour un canapé design ?", reponse: "Le tissu offre plus de choix de couleurs et de textures, idéal pour une ambiance chaleureuse. Le cuir (ou similicuir) est plus facile à nettoyer et apporte une touche contemporaine. Pour les familles avec enfants ou animaux, les tissus microfibre ou velours côtelé résistent mieux aux taches." },
      { question: "Comment entretenir un canapé en tissu ?", reponse: "Passez l'aspirateur chaque semaine pour enlever les poussières. Pour les taches, tamponnez avec un chiffon humide et du savon de Marseille sans frotter. La plupart des coussins déhoussables peuvent être lavés en machine à 30°C." },
    ],
  },
  lampes: {
    nom: "Lampes",
    description: "Lampes, suspensions et luminaires design.",
    intro: "L'éclairage transforme l'ambiance d'une pièce. Notre sélection de lampes design réunit suspensions, lampadaires et lampes à poser soigneusement choisis pour leur esthétique et leur qualité lumineuse. Du minimalisme scandinave au style industriel, trouvez le luminaire qui sublimera votre intérieur.",
    conseil: "Associez plusieurs sources de lumière à différentes hauteurs pour créer des ambiances modulables. Préférez des ampoules LED E27 2700K (blanc chaud) pour une atmosphère cosy, ou 4000K pour un bureau.",
    faqs: [
      { question: "Quelle puissance d'ampoule choisir pour une lampe de salon ?", reponse: "Pour un salon, optez pour des ampoules LED de 800 à 1100 lumens (équivalent 60-75W) en blanc chaud (2700K). Pour une lampe d'appoint ou décorative, 400-600 lumens suffisent." },
      { question: "Comment choisir la hauteur d'une suspension au-dessus d'une table ?", reponse: "Une suspension au-dessus d'une table à manger doit être à 70-80 cm de la surface de la table. Pour un couloir ou un salon, laissez au minimum 2,10 m de hauteur libre sous la lampe." },
    ],
  },
  "lampes-chevet": {
    nom: "Lampes de chevet",
    description: "Lampes de chevet design pour votre chambre.",
    intro: "La lampe de chevet est à la fois fonctionnelle et décorative. Elle doit offrir une lumière suffisante pour lire sans éblouir, et s'harmoniser avec votre décoration de chambre. Notre sélection privilégie les modèles avec variateur intégré, les designs compacts et les matériaux nobles.",
    conseil: "La base de votre lampe de chevet doit être à hauteur de vos épaules lorsque vous êtes allongé, soit environ 65-70 cm du sol. Choisissez une ampoule 300-500 lumens en blanc chaud (2700K) pour une lecture confortable.",
    faqs: [
      { question: "Lampe de chevet avec ou sans fil : que choisir ?", reponse: "Les lampes sans fil (rechargeables USB) offrent plus de flexibilité d'emplacement mais nécessitent une recharge régulière. Les lampes avec fil sont plus fiables pour une utilisation quotidienne intensive. Si votre table de nuit est loin d'une prise, optez pour le sans-fil." },
      { question: "Quelle hauteur pour une lampe de chevet ?", reponse: "La hauteur idéale est 45-65 cm, de sorte que l'abat-jour soit à hauteur de vos épaules quand vous lisez au lit. Pour une table de nuit haute (55-60 cm), une lampe de 40-45 cm suffit." },
    ],
  },
  chaises: {
    nom: "Chaises",
    description: "Chaises et tabourets design pour chaque pièce.",
    intro: "La chaise design est un investissement à long terme. Notre sélection couvre tous les usages : chaises de salle à manger, chaises de bureau, fauteuils d'appoint et tabourets. Nous privilégions les matériaux durables (bois massif, métal traité, polypropylène recyclé) et les designs intemporels.",
    conseil: "La hauteur d'assise standard est de 45-48 cm pour une table de 75 cm. Vérifiez que vos genoux forment un angle de 90° et que vos pieds reposent à plat sur le sol pour un confort optimal.",
    faqs: [
      { question: "Quelle hauteur d'assise pour une table standard ?", reponse: "Pour une table de hauteur standard (75-76 cm), choisissez des chaises avec une hauteur d'assise de 44-46 cm. Prévoyez au moins 20 cm entre le dessus de l'assise et le dessous de la table." },
      { question: "Combien de chaises prévoir autour d'une table pour 6 personnes ?", reponse: "Pour 6 personnes, prévoyez une table d'au moins 180 cm de long. Chaque convive a besoin de 60 cm de largeur minimum. Avec des chaises sans accoudoirs, le passage entre les chaises et le mur doit être d'au moins 80 cm." },
    ],
  },
  tables: {
    nom: "Tables",
    description: "Tables basses, à manger et de bureau design.",
    intro: "Table basse, table à manger, bureau ou console : chaque table a un rôle précis dans votre intérieur. Notre sélection met en avant les matériaux nobles (bois, marbre, verre, métal) et les finitions soignées. Nous privilégions les tables extensibles pour les petits espaces et les designs intemporels qui traversent les tendances.",
    conseil: "Pour une table à manger, comptez 60-70 cm par convive en largeur. Une table ronde de 120 cm convient pour 4 personnes, de 150 cm pour 6. Le plateau doit être entre 74 et 76 cm de hauteur.",
    faqs: [
      { question: "Quelle taille de table basse pour un canapé 3 places ?", reponse: "Pour un canapé 3 places (environ 200 cm), une table basse de 120-130 cm de long est idéale. La hauteur doit être proche de l'assise du canapé (42-45 cm) pour un usage confortable. Laissez 40-50 cm entre canapé et table." },
      { question: "Table en bois, marbre ou verre : comment choisir ?", reponse: "Le bois est chaleureux et résistant, idéal pour les familles. Le marbre apporte une touche de luxe mais est lourd et fragile aux acides. Le verre agrandit visuellement l'espace mais se raye et demande un entretien régulier. Le métal (acier, laiton) est très tendance et durable." },
    ],
  },
  salon: {
    nom: "Salon",
    description: "Canapés, fauteuils, tables basses et meubles TV design.",
    intro: "Le salon est le cœur de la maison, l'espace de détente et de convivialité. Notre sélection pour le salon réunit tout le mobilier nécessaire pour créer un intérieur harmonieux : canapés confortables, fauteuils design, tables basses élégantes et meubles TV épurés. Chaque pièce est choisie pour s'intégrer dans une déco cohérente.",
    conseil: "Pour un salon équilibré, suivez la règle 60-30-10 : 60% couleur dominante (murs, canapé), 30% secondaire (fauteuils, tapis), 10% accent (coussins, luminaires). Ancrez l'espace avec un tapis sous la table basse.",
    faqs: [
      { question: "Comment choisir un tapis pour son salon ?", reponse: "Le tapis doit être suffisamment grand pour que les pieds avant des canapés et fauteuils reposent dessus. Pour un salon type, un tapis de 200x300 cm convient à un canapé 3 places. Choisissez une épaisseur de 15-20mm pour le confort et l'isolation phonique." },
      { question: "Quelle hauteur de meuble TV face à un canapé ?", reponse: "Le centre de l'écran TV doit être à hauteur des yeux lorsque vous êtes assis, soit environ 100-110 cm du sol. Si votre télévision fait 55 pouces (140 cm de diagonale), le bas de l'écran doit être à 60-70 cm." },
    ],
  },
  bureau: {
    nom: "Bureau",
    description: "Chaises ergonomiques, bureaux et rangements design.",
    intro: "Un bureau bien conçu améliore la productivité et le bien-être. Notre sélection pour le bureau à domicile combine ergonomie et esthétique : bureaux ajustables en hauteur, chaises ergonomiques, rangements intelligents. Que vous cherchiez un coin bureau discret ou un vrai espace de travail dédié, nous avons la solution.",
    conseil: "La hauteur de bureau standard est 72-75 cm pour quelqu'un de 170 cm. Vos coudes doivent former un angle de 90° quand vous tapez. L'écran doit être à 50-70 cm des yeux, avec le haut de l'écran à hauteur des yeux.",
    faqs: [
      { question: "Comment aménager un bureau dans une petite chambre ?", reponse: "Dans une petite chambre, optez pour un bureau mural rabattable (60x40 cm minimum), un bureau en coin qui utilise l'angle mort, ou un secrétaire à fermeture. Choisissez des couleurs claires pour agrandir visuellement l'espace et installez un bon éclairage de tâche." },
      { question: "Chaise de bureau avec ou sans accoudoirs ?", reponse: "Les accoudoirs réduisent la tension dans les épaules et le cou lors de longues sessions. Choisissez des accoudoirs réglables en hauteur et largeur. L'inconvénient : ils empêchent souvent de rapprocher la chaise suffisamment du bureau." },
    ],
  },
  chambre: {
    nom: "Chambre",
    description: "Lits, chevets, armoires et commodes design.",
    intro: "La chambre est votre sanctuaire. Notre sélection pour la chambre à coucher privilégie les matériaux naturels (bois, lin, coton) et les tons apaisants. Des lits design aux tables de chevet sculptées, en passant par les armoires sur mesure et les commodes aux finitions impeccables, composez une chambre qui favorise le repos.",
    conseil: "Prévoyez au minimum 60 cm de chaque côté du lit pour circuler confortablement. La hauteur de sommier idéale est 50-55 cm (avec matelas) pour se lever sans effort. Orientez la tête du lit vers un mur plein, loin des fenêtres et de la porte.",
    faqs: [
      { question: "Quelle taille de lit pour deux personnes ?", reponse: "Pour deux personnes, un lit 160x200 cm (Queen size) offre un bon confort. Le 180x200 cm (King size) est idéal si l'espace le permet. Pour une chambre inférieure à 12 m², un 140x200 cm peut suffire avec une organisation optimisée." },
      { question: "Comment choisir un matelas pour son lit ?", reponse: "Le choix du matelas dépend de votre morphologie et position de sommeil. Les dormeurs sur le côté préfèrent un matelas medium (25-30 kg/m³). Les dormeurs sur le dos ou le ventre optent pour un medium-ferme. Testez toujours un matelas au moins 10 minutes en magasin." },
    ],
  },
  cuisine: {
    nom: "Cuisine",
    description: "Tables, chaises et rangements design pour la cuisine.",
    intro: "La cuisine est devenue le deuxième salon. Notre sélection pour la cuisine design réunit tables extensibles, chaises et tabourets résistants, et solutions de rangement astucieuses. Nous privilégions les matériaux faciles d'entretien (stratifié, métal laqué, bois traité) sans sacrifier l'esthétique.",
    conseil: "Pour une cuisine ouverte, assurez la continuité visuelle avec le salon : mêmes tons, mêmes matériaux. Un îlot central nécessite au moins 90 cm de passage tout autour. Optez pour des tabourets de bar à hauteur réglable pour s'adapter à votre plan de travail.",
    faqs: [
      { question: "Quelle hauteur de tabouret pour un îlot de cuisine ?", reponse: "Pour un îlot standard (90 cm de hauteur), choisissez des tabourets de 65-70 cm de hauteur d'assise. Pour un plan de travail à 90 cm, il faut entre 25 et 30 cm d'espace entre l'assise et le dessous du plan." },
      { question: "Table ronde ou rectangulaire pour une petite cuisine ?", reponse: "La table ronde est plus adaptée aux petites cuisines : elle facilite la circulation, permet d'asseoir une personne de plus en cas de besoin, et les coins arrondis évitent les chocs. Une table ronde de 90 cm convient confortablement à 4 personnes." },
    ],
  },
  exterieur: {
    nom: "Extérieur",
    description: "Mobilier de jardin et de terrasse design.",
    intro: "Le mobilier d'extérieur doit allier résistance aux intempéries et esthétique. Notre sélection outdoor propose des tables, chaises et fauteuils en matériaux certifiés pour l'usage extérieur : aluminium thermolaqué, teck certifié FSC, résine tressée haute densité, acier Corten. Créez un espace de vie extérieur aussi soigné que votre intérieur.",
    conseil: "Protégez votre mobilier outdoor en hiver avec des housses respirantes. Le teck se nourrit une fois par an avec de l'huile de teck. L'aluminium ne rouille pas mais se tâche : nettoyez avec de l'eau savonneuse. Rentrez les coussins dès qu'il pleut.",
    faqs: [
      { question: "Quel mobilier de jardin pour une terrasse de 15 m² ?", reponse: "Pour 15 m², un salon de jardin composé d'un canapé 2 places, deux fauteuils et une table basse est adapté. Alternativement, une table à manger de 120x70 cm avec 4 chaises. Laissez toujours 80 cm de passage libre." },
      { question: "Comment entretenir un salon de jardin en résine tressée ?", reponse: "Nettoyez la résine tressée avec de l'eau tiède et du savon doux, à l'aide d'une brosse souple. Évitez les jets d'eau haute pression qui endommagent les fibres. Rangez en hiver dans un endroit sec ou couvrez avec des housses respirantes." },
    ],
  },
  "salle-de-bain": {
    nom: "Salle de bain",
    description: "Miroirs, meubles vasque et accessoires design.",
    intro: "La salle de bain design, c'est possible même dans un petit espace. Notre sélection privilégie les meubles vasque suspendus (qui agrandissent visuellement la pièce), les miroirs à LED, et les accessoires en laiton brossé ou en béton ciré. Chaque meuble est choisi pour sa résistance à l'humidité et ses finitions durables.",
    conseil: "Pour une salle de bain de 4 m², un meuble vasque suspendu de 60 cm avec rangement est suffisant. Installez un miroir de la largeur du meuble pour agrandir l'espace. Choisissez des matériaux hydrofuges : MDF hydro, stratifié haute pression, céramique.",
    faqs: [
      { question: "Meuble vasque suspendu ou sur pieds : que choisir ?", reponse: "Le meuble suspendu facilite le nettoyage du sol et donne une impression d'espace. Il faut des murs porteurs ou des supports adaptés. Le meuble sur pieds est plus stable et ne nécessite pas de fixation murale spéciale, mais le sol en dessous est plus difficile à nettoyer." },
      { question: "Quelle hauteur pour un miroir de salle de bain ?", reponse: "Le bas du miroir doit être à environ 1 m du sol (ou à hauteur des yeux moins 10 cm). Pour un couple de tailles différentes, un grand miroir de 80-100 cm de hauteur convient à tous. Les miroirs à LED intégrée offrent le meilleur éclairage pour le maquillage et le rasage." },
    ],
  },
  luminaire: {
    nom: "Luminaires",
    description: "Lampes, suspensions et appliques design.",
    intro: "Le luminaire est le bijou de votre intérieur. Notre sélection couvre toutes les typologies : suspensions sculpturales, appliques murales discrètes, spots encastrés, lampadaires d'ambiance. Nous sélectionnons des luminaires compatibles LED et conçus pour durer, alliant innovation technique et beauté formelle.",
    conseil: "Planifiez votre éclairage en trois couches : éclairage général (plafonnier ou spots), éclairage d'accentuation (spots directionnels sur œuvres d'art), éclairage d'ambiance (lampes et appliques). Cette superposition permet de moduler l'atmosphère selon les moments.",
    faqs: [
      { question: "Comment calculer le nombre de spots pour un salon ?", reponse: "Comptez environ 50-60 lumens par m² pour un salon confortable. Pour 25 m², il vous faut 1250-1500 lumens au total. Avec des spots LED de 500 lumens chacun, 3 spots sont suffisants. Espacez-les de 1 à 1,2 m du mur et entre eux." },
      { question: "Applique murale ou lampadaire : pour quelle ambiance ?", reponse: "L'applique murale est idéale dans un couloir, une entrée ou de part et d'autre d'un lit. Le lampadaire crée un coin lecture chaleureux et se déplace facilement. Pour un salon, associez les deux : lampadaire derrière le canapé et applique dans un angle." },
    ],
  },
  "salle-a-manger": {
    nom: "Salle à manger",
    description: "Tables et chaises design pour vos repas.",
    intro: "La salle à manger est le lieu du partage. Notre sélection réunit tables extensibles intelligentes, chaises confortables et buffets élégants pour créer une salle à manger à la fois fonctionnelle et esthétique. Du style contemporain au mid-century, chaque pièce est choisie pour sa robustesse et son caractère.",
    conseil: "Pour une salle à manger de 12 m², une table de 140x90 cm (extensible à 180 cm) est idéale. Prévoyez 50 cm par convive en largeur et au moins 80 cm de dégagement autour de la table. Un buffet de 180 cm de large s'intègre parfaitement sur un mur de 3 m.",
    faqs: [
      { question: "Table extensible : mécanisme à allonges ou à rallonge centrale ?", reponse: "La rallonge centrale (papillon) est la plus pratique : elle s'ouvre en une seconde et se range à l'intérieur. Les allonges latérales offrent plus de longueur supplémentaire (2x40 cm) mais nécessitent un rangement dédié. Pour un usage fréquent, préférez le système papillon." },
      { question: "Comment harmoniser une table en bois avec des chaises design ?", reponse: "Mélangez les matières : une table en bois massif s'harmonise avec des chaises en métal noir ou en velours coloré. Évitez de tout assortir à l'identique. Jouez sur la couleur des assises pour unifier l'ensemble avec le reste de la pièce." },
    ],
  },
  jardin: {
    nom: "Extérieur & Jardin",
    description: "Mobilier outdoor design pour l'extérieur.",
    intro: "Votre jardin mérite autant de soin que votre intérieur. Notre sélection de mobilier de jardin design privilégie les matériaux certifiés durables (aluminium recyclé, teck FSC, textilène) et les collections qui résistent aux UV et aux intempéries. Du salon de jardin lounge à la table de repas outdoor, créez un espace extérieur raffiné.",
    conseil: "Mesurez votre terrasse avant d'acheter. Pour un espace repas extérieur, prévoyez 1 m² par personne. Les matériaux les plus résistants aux intempéries : aluminium (inalterab), textilène (séchage rapide), teck huilé (chaleureux). Ancrez les parasols en cas de vent.",
    faqs: [
      { question: "Quel parasol pour une table de jardin de 6 personnes ?", reponse: "Pour couvrir une table de 6 personnes (180x90 cm), choisissez un parasol d'au moins 3 m de diamètre (ronde) ou un parasol déporté rectangulaire 3x4 m. Le parasol déporté offre plus de liberté de mouvement sans pied central gênant." },
      { question: "Comment protéger son mobilier de jardin en bois ?", reponse: "Huilez le teck et le bois exotique une fois par an au printemps avec une huile spéciale bois extérieur. Poncez légèrement au papier de verre 120 avant d'huiler. Couvrez ou rentrez le mobilier en hiver. Le bois grise naturellement si non traité, sans se détériorer." },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  if (!cat) return {};
  return buildMetadata({
    title: `${cat.nom} — Meubles design`,
    description: cat.description,
    path: `/categories/${slug}`,
  });
}

export default async function CategoriePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  const produits = getAllProduits();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdBreadcrumb([
              { name: "Accueil", url: "/" },
              { name: "Boutique", url: "/boutique" },
              { name: cat?.nom ?? slug, url: `/categories/${slug}` },
            ])
          ),
        }}
      />

      <div className="border-b border-stone-100 bg-white px-4 pb-6 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Fil d'Ariane" className="mb-3 flex items-center gap-1.5 text-sm text-stone-400">
            <a href="/" className="hover:text-brand-700">Accueil</a>
            <span aria-hidden>›</span>
            <a href="/boutique" className="hover:text-brand-700">Boutique</a>
            <span aria-hidden>›</span>
            <span className="font-medium text-stone-700">{cat?.nom ?? slug}</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
            {cat?.nom ?? slug}
          </h1>
          {cat && <p className="mt-2 max-w-2xl text-stone-500">{cat.description}</p>}
        </div>
      </div>

      {cat?.intro && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="prose prose-stone max-w-2xl">
            <p className="text-stone-600 leading-relaxed">{cat.intro}</p>
          </div>
          {cat.conseil && (
            <div className="mt-4 flex gap-3 rounded-xl border border-brand-100 bg-brand-50 px-5 py-4 max-w-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-brand-800">{cat.conseil}</p>
            </div>
          )}
        </div>
      )}

      {/* Tous les produits + filtre pré-sélectionné */}
      <BoutiqueGrid produits={produits} initialFiltres={[slug]} />

      {cat?.faqs?.length ? (
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <FAQSection faqs={cat.faqs} />
        </div>
      ) : null}
    </>
  );
}
