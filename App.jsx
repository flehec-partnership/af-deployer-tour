import { useState, useEffect, useMemo } from "react";

// ── ASSETS ───────────────────────────────────────────────────────────────────
const IMG_LOGO = "data:image/png;base64,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";

// ── BRAND ────────────────────────────────────────────────────────────────────
const PINK = "#FF2F92", BLACK = "#1D1D1F", GRAY = "#757575", LIGHT = "#F4F4F5", BORDER = "#E6E6E6";
const GRAD = "linear-gradient(90deg,#FFA800 0%,#FE8058 25%,#FF2F92 50%,#0096FF 75%,#029CAF 100%)";
const FONT = "'TWK Lausanne',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const PIN = "AF2026";
const BOOKING_URL = "https://meetings.hubspot.com/flehec";
const PRICING_TOOL_URL = "https://project-0gzn4.vercel.app/";

// ── PRICING (source: Direct Sales – Tokens Pricing List.xlsx, col. C = <250 employees, 36 months) ──
const PRICE = [[5000,3500],[7500,4900],[10000,6000],[12500,7100],[15000,8200],[17500,9200],[20000,10200],[25000,12100],[30000,13950],[35000,15700],[40000,17400],[45000,19050],[50000,20650],[75000,26500],[100000,33200],[125000,39500],[150000,45500],[175000,51200],[200000,56500],[225000,61650],[250000,66700],[275000,71600],[300000,76350],[325000,81050],[350000,85650],[375000,90150],[400000,94550],[425000,98900],[450000,103200],[475000,107450],[500000,111600],[550000,119800],[600000,127800],[650000,135600],[700000,143300],[750000,150850],[800000,158250],[850000,165550],[900000,172700],[950000,179800],[1000000,186800],[1250000,220450],[1500000,252450],[1750000,283050],[2000000,312600]];
const SIZE_COEF = { "<250": 0, "250-1000": 0.25, ">1000": 0.5 };
const DUR_COEF = { 12: 0.2, 24: 0.1, 36: 0, 48: -0.1, 60: -0.2 };
const CUR = { EUR: { s: "€", k: 1 }, USD: { s: "$", k: 1.2 }, GBP: { s: "£", k: 0.9 } };
const PRODUCTS = [
  { id: "CVS", name: "CV Screening", tk: 5 },
  { id: "SCAN", name: "SCAN", tk: 10 },
  { id: "SWIPE", name: "SWIPE", tk: 20 },
  { id: "DRIVE", name: "DRIVE", tk: 20 },
  { id: "BRAIN", name: "BRAIN", tk: 20 },
  { id: "VOICE", name: "VOICE", tk: 20 },
];

const tierFor = (tk) => { let t = PRICE[0]; for (const p of PRICE) if (p[0] <= tk) t = p; return t; };
const listPrice = (tk, months = 36, size = "<250") => {
  const [tt, base] = tierFor(Math.max(tk, PRICE[0][0]));
  return base * (tk / tt) * (1 + SIZE_COEF[size]) * (1 + DUR_COEF[months]);
};
const money = (v, cur, d = 0) => {
  const n = v * CUR[cur].k;
  return CUR[cur].s + n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
};
const num = (v) => Math.round(v).toLocaleString("en-US");

// ── i18n ─────────────────────────────────────────────────────────────────────
const T = {
en: {
  langName: "EN", back: "Back", next: "Next", start: "Start the journey", internal: "Internal mode", illustrative: "Illustrative — adjust to your business",
  gate: { title: "AssessFirst Partner Journey", sub: "Reseller & Distributor programme", ph: "Access code", btn: "ENTER", err: "Incorrect code" },
  acts: ["Why now", "Which partner are you?", "What you sell", "How you buy", "Your back-office", "Earnings simulator", "Your first 90 days", "Book a call"],
  home: {
    kicker: "Partner programme", title: "Grow your business with AssessFirst", sub: "Bring predictive hiring decisions to the clients you already serve, and build a new recurring revenue line on top of your services.",
    stats: [["3,000+", "corporate clients worldwide"], ["20+", "years of R&D in psychometrics & predictive AI"], ["35+", "native ATS / HRIS integrations"], ["-30%", "hiring mistakes reported by our clients"]],
    chapters: "Chapters",
  },
  why: {
    t1: "The HR market is changing. Your clients are feeling it.",
    cols: [["What's happening", [["CVs have real limits", "Research puts CVs at less than 15% predictive validity. Most hiring decisions still rely on them."], ["Hiring mistakes are expensive", "A bad hire costs on average 1.5× the annual salary. Most companies make several per year."], ["Regulation is tightening", "The EU AI Act requires transparency and fairness in AI-based decisions."]]],
      ["The AssessFirst approach", [["Assess real potential", "SWIPE, DRIVE, BRAIN — personality, motivation, cognition. Scientifically validated across 20+ years."], ["AI-powered pre-screening", "SCAN and VOICE automate the top of the funnel. 2× faster, 85%+ completion, 35 languages."], ["Built for compliance", "Auditable models, bias-tested, GDPR-ready. Fully aligned with the EU AI Act."]]],
      ["What clients see", [["-30%", "Fewer hiring mistakes within 6 months of use."], ["+25%", "Better performance scores on key roles within 12 months."], ["89%", "Candidate completion rate, mobile-first, in 5–10 minutes."]]]],
    t2: "Partners who already own clients win.",
    sub2: "We built this programme for firms that already have the trust of HR leaders. No cold prospecting required.",
    pts: [["Sell to your existing base", "Your clients already buy your services. AssessFirst is an immediate upsell, not a new sales motion."], ["You set the resale price", "Buy at your partner price, resell at your price. Your margin, your services, your positioning."], ["No competition on your accounts", "You own the commercial relationship. Our team supports you; it never sells around you."]],
    cta: "Which partner are you?",
  },
  who: {
    t1: "Which partner are you?", sub1: "Pick the profile closest to your business. The rest of the journey adapts to it.",
    profiles: { reseller: ["Reseller", "You own the sale and the renewal. AssessFirst trains and onboards your clients.", "Recruitment firms, HR consultancies, HR-tech resellers"], distributor: ["Distributor", "You own the full client lifecycle — sale, onboarding, training, support — on your market.", "RPO providers, HR service groups, country distributors"] },
    you: "You", t2: "Who does what",
    rows: ["Lead generation & demo", "Closing & renewal", "Client onboarding & training", "Customer success", "Level 1 support", "Level 2 support", "Account creation & licences", "Billing"],
    matrix: { reseller: ["You", "You", "AssessFirst", "AssessFirst", "Shared", "AssessFirst", "You (back-office)", "AssessFirst → You"], distributor: ["You", "You", "You", "You", "You", "AssessFirst", "You (back-office)", "AssessFirst → You"] },
    note: "Whatever the profile, your clients use the full AssessFirst application with their own account.",
  },
  sell: {
    t1: "Six products. One token.", sub1: "Every assessment consumes tokens from your client's balance. Simple to quote, simple to resell.",
    desc: { CVS: "AI CV parsing & ranking against the job", SCAN: "AI agent that pre-qualifies candidates by phone", SWIPE: "Personality — Big Five, 20 facets, 5 min", DRIVE: "Motivation — 20 drivers, 8 min", BRAIN: "Cognitive reasoning — adaptive, 8 min", VOICE: "AI interview for hard skills & languages (CEFR)" },
    tokens: "tokens per assessment",
    t2: "Your clients get the full AssessFirst application", sub2: "Not a stripped-down version. The same platform 3,000 companies use every day.",
    pts: [["Their own account", "Recruiters, hiring managers, dashboards, candidate reports — everything in their workspace."], ["35+ integrations", "Workday, SAP SuccessFactors, SmartRecruiters, Teamtailor and more, connected in a few clicks."], ["Results where they work", "Reports in the app, in PDF or pushed straight into their ATS."]],
    t3: "You set the price. You keep the difference.",
    sub3: "You buy tokens at your partner price and resell at the price you decide. Around the licence, you sell what you know best.",
    services: ["Setup & configuration", "Recruiter training", "Candidate debriefs", "Team & manager coaching", "Competency frameworks", "Change management"],
    servicesT: "Services partners typically add",
  },
  buy: {
    t1: "Two ways to order", sub1: "Choose per order. Most partners use both.",
    modes: [["Per-client order", ["You order the exact tokens one client needs", "Priced on your client's size and commitment (12 / 24 / 36 months)", "Best for larger accounts and multi-year deals", "Tokens are booked to that client"]],
            ["Credit Pool", ["You order a pool of tokens for your own portfolio", "Priced on the base grid, with volume degressivity", "Reallocate freely between clients, including small ones", "Best for growing a base of small and mid-size clients"]]],
    t2: "Pricing explorer", sub2: "Public list prices from the AssessFirst grid. Your partner price depends on your programme tier — discussed one-to-one.",
    tokens: "Tokens", months: "Commitment", size: "Client size", list: "Public list price", perToken: "per token", discount: "Illustrative partner discount", partner: "Your illustrative partner price", margin: "Your margin if resold at list price", tool: "Open the full pricing tool →", employees: "employees", monthsU: "months",
    t3: "Two clocks. No lost credits.", sub3: "Your pool has its own clock. Every allocation to a client starts a separate 12-month client subscription.",
    pool: "Your pool", client: "Client", rules: [["Allocate before your pool ends", "Once allocated, your client keeps a full 12-month subscription — even if it runs past the end of your pool."], ["Roll over what you didn't use", "Unallocated tokens carry over when you renew a pool of equal or greater size."], ["Top up any time", "Add tokens to a running pool at the volume tier you have reached."]],
    t4: "Tiers & Market Development Funds", sub4: "Tiers reward the recurring revenue you manage. Reviewed annually.",
    tiers: { reseller: [["Core", "New partner", "—"], ["Premier", "150K managed ARR", "MDF up to €2,500 / year"], ["Elite", "300K managed ARR", "MDF up to €5,000 / year"]], distributor: [["Core", "New partner", "—"], ["Premier", "250K managed ARR", "MDF up to €7,500 / year"], ["Elite", "500K managed ARR", "MDF up to €15,000 / year"]] },
    tierCols: ["Tier", "Condition", "Market Development Funds"], tierNote: "Discount levels are shared in your one-to-one programme conversation. MDF are reimbursed for approved co-marketing activities.",
  },
  bo: {
    kicker: "Deployer — your partner back-office", t1: "Run your AssessFirst business without waiting for us",
    sub1: "Order, create client accounts, allocate tokens, follow consumption. The demo below is interactive.",
    tabs: ["Wallet", "Clients", "Create & allocate", "Users & renewal", "Consumption", "Client workspace"],
    wallet: { balance: "Unallocated tokens", allocated: "Allocated to clients", consumed: "Consumed by clients", ends: "Pool ends", burn: "At the current pace your pool is fully allocated on", topup: "TOP UP POOL", order: "ORDER FOR A CLIENT", alert: "tokens unallocated — allocate before" },
    clients: { cols: ["Client", "Country", "Allocated", "Consumed", "Start", "Renewal", "Users", "Sourced by"], create: "CREATE CLIENT", you: "You" },
    create: { title: "Create a client and allocate tokens", name: "Company name", country: "Country", admin: "Admin email", tokens: "Tokens to allocate", sourced: "Sourced by (optional)", btn: "CREATE & ALLOCATE", done: "created. Subscription runs 12 months from today.", starts: "Client subscription starts today and runs 12 months, independently of your pool.", remaining: "Remaining in your pool after allocation" },
    users: { title: "Users & renewal", add: "ADD USER", renew: "RENEW 12 MONTHS", realloc: "REALLOCATE UNUSED", role: "Role", roles: ["Admin", "Recruiter", "Viewer"], renewed: "Renewed — new period starts at the end of the current one.", realloced: "Unused tokens returned to your pool." },
    cons: { title: "Consumption by client and product", month: "Monthly consumption (tokens)", export: "EXPORT CSV" },
    ws: { title: "Switch to a client workspace", sub: "Open your client's AssessFirst account with delegated access. No password to share, every action logged.", open: "OPEN WORKSPACE", banner: "You are working in", exit: "BACK TO YOUR BACK-OFFICE" },
    orderFor: { title: "Order for a specific client", sub: "Priced on the client's grid. Tokens are booked to this client.", send: "SEND ORDER", sent: "Order sent — you will receive the invoice and the tokens will be credited to this client." },
    specT: "Product spec", spec: ["User story", "Business rules", "Data", "Rights by profile", "Out of scope v1"],
  },
  sim: {
    t1: "Simulate your first year", sub1: "Every figure is an assumption you can change. Resale price and service fees are yours to decide.",
    presets: [["Boutique", 5, 5000], ["Regional", 20, 10000], ["Network", 80, 12500]],
    clients: "Clients per year", perClient: "Tokens per client per year", mode: "Purchase mode", modes: ["Per-client order", "Credit Pool"], pool: "Pool commitment", resale: "Your resale price per client", resaleHint: "Default = AssessFirst public price, 12 months, <250 employees", discount: "Illustrative partner discount", days: "Service days per client", rate: "Your day rate",
    out: { tokens: "Token revenue", cost: "Token purchase cost", margin: "Token margin", services: "Service revenue", total: "Total gross margin", perClient: "per client" },
    note: "Token purchase cost uses the AssessFirst grid and the discount you set above. Final terms are agreed one-to-one.",
  },
  days: {
    t1: "From contract to first client in 90 days", sub1: "A shared plan. We commit to the support, you commit to the pace.",
    phases: [["Day 0–14", "Onboarding", ["Contract signed, portal & back-office access", "Kick-off with your Partner Manager", "Product certification"]], ["Day 14–45", "Activation", ["First opportunities registered", "Monthly business review starts", "Target: 3 qualified leads"]], ["Day 60–90", "First revenue", ["First client signed", "Client created in your back-office", "Tokens allocated, onboarding launched"]], ["Month 3–6", "Scale", ["Recurring pipeline", "Partner-led customer success", "Joint co-marketing"]], ["Year 1+", "Expansion", ["Renewals & upsell", "Joint case studies", "MDF access"]]],
    t2: "Your toolkit", sub2: "Two tools, clearly separated.",
    tools: [["Partner portal (Introw)", ["Certification & playbooks", "Deal registration", "Battle cards & sales assets", "MDF requests"]], ["Deployer — back-office", ["Orders & Credit Pool", "Client accounts & licences", "Users, dates, renewals", "Consumption dashboards"]], ["Partner Manager", ["Your single point of contact", "Co-sell on demand", "Monthly business review", "Escalation to AssessFirst support"]]],
  },
  call: {
    t1: "Interested in exploring a partnership?", sub: "A 30-minute conversation is enough to see whether it's a good fit and what a partnership could look like for you.",
    btn: "BOOK A 30-MIN CALL", next: "What happens next", steps: [["Discovery call (30 min)", "Your market, your clients, the potential fit."], ["Programme walkthrough", "Full product demo and a detailed look at the programme."], ["Contract & onboarding", "Paperwork done, back-office opened, certification started."], ["First client together", "We support your first AssessFirst opportunity."]],
    team: "Partnerships Team — AssessFirst", mail: "partners@assessfirst.com",
  },
},
fr: {
  langName: "FR", back: "Retour", next: "Suivant", start: "Démarrer le parcours", internal: "Mode interne", illustrative: "Illustratif — à adapter à votre activité",
  gate: { title: "AssessFirst Partner Journey", sub: "Programme Revendeur & Distributeur", ph: "Code d'accès", btn: "ENTRER", err: "Code incorrect" },
  acts: ["Pourquoi maintenant", "Quel partenaire êtes-vous ?", "Ce que vous vendez", "Comment vous achetez", "Votre back-office", "Simulateur de gains", "Vos 90 premiers jours", "Prendre rendez-vous"],
  home: {
    kicker: "Programme partenaire", title: "Développez votre activité avec AssessFirst", sub: "Apportez des décisions de recrutement prédictives aux clients que vous servez déjà, et construisez une nouvelle ligne de revenus récurrents au-dessus de vos services.",
    stats: [["3 000+", "entreprises clientes dans le monde"], ["20+", "ans de R&D en psychométrie et IA prédictive"], ["35+", "intégrations natives ATS / SIRH"], ["-30 %", "d'erreurs de recrutement chez nos clients"]],
    chapters: "Chapitres",
  },
  why: {
    t1: "Le marché RH change. Vos clients le ressentent.",
    cols: [["Ce qui se passe", [["Le CV a ses limites", "La recherche évalue le CV à moins de 15 % de validité prédictive. La plupart des décisions s'appuient encore dessus."], ["Les erreurs coûtent cher", "Un mauvais recrutement coûte en moyenne 1,5× le salaire annuel. La plupart des entreprises en font plusieurs par an."], ["La réglementation se durcit", "L'EU AI Act impose transparence et équité dans les décisions basées sur l'IA."]]],
      ["L'approche AssessFirst", [["Évaluer le potentiel réel", "SWIPE, DRIVE, BRAIN — personnalité, motivation, cognition. Validé scientifiquement sur 20+ ans."], ["Présélection par l'IA", "SCAN et VOICE automatisent le haut du funnel. 2× plus rapide, 85 %+ de complétion, 35 langues."], ["Conçu pour la conformité", "Modèles auditables, testés anti-biais, RGPD-ready. Aligné avec l'EU AI Act."]]],
      ["Ce que voient les clients", [["-30 %", "d'erreurs de recrutement dans les 6 mois."], ["+25 %", "de performance sur les postes clés dans les 12 premiers mois."], ["89 %", "de complétion candidat, mobile-first, en 5 à 10 minutes."]]]],
    t2: "Les partenaires qui possèdent déjà leurs clients gagnent.",
    sub2: "Ce programme est conçu pour les cabinets qui ont déjà la confiance des DRH. Aucune prospection à froid demandée.",
    pts: [["Vendez à votre base existante", "Vos clients achètent déjà vos services. AssessFirst est un upsell immédiat, pas une nouvelle motion commerciale."], ["Vous fixez le prix de revente", "Achetez au prix partenaire, revendez à votre prix. Votre marge, vos services, votre positionnement."], ["Pas de concurrence sur vos comptes", "Vous possédez la relation commerciale. Notre équipe vous appuie, elle ne vend jamais à votre place."]],
    cta: "Quel partenaire êtes-vous ?",
  },
  who: {
    t1: "Quel partenaire êtes-vous ?", sub1: "Choisissez le profil le plus proche de votre activité. La suite du parcours s'adapte.",
    profiles: { reseller: ["Revendeur", "Vous portez la vente et le renouvellement. AssessFirst forme et onboarde vos clients.", "Cabinets de recrutement, conseils RH, revendeurs HR-tech"], distributor: ["Distributeur", "Vous portez tout le cycle client — vente, onboarding, formation, support — sur votre marché.", "RPO, groupes de services RH, distributeurs pays"] },
    you: "Vous", t2: "Qui fait quoi",
    rows: ["Génération de leads & démo", "Closing & renouvellement", "Onboarding & formation client", "Customer success", "Support niveau 1", "Support niveau 2", "Création de comptes & licences", "Facturation"],
    matrix: { reseller: ["Vous", "Vous", "AssessFirst", "AssessFirst", "Partagé", "AssessFirst", "Vous (back-office)", "AssessFirst → Vous"], distributor: ["Vous", "Vous", "Vous", "Vous", "Vous", "AssessFirst", "Vous (back-office)", "AssessFirst → Vous"] },
    note: "Quel que soit le profil, vos clients utilisent l'application AssessFirst complète avec leur propre compte.",
  },
  sell: {
    t1: "Six produits. Un seul token.", sub1: "Chaque évaluation consomme des tokens sur le solde de votre client. Simple à chiffrer, simple à revendre.",
    desc: { CVS: "Analyse et classement IA des CV par rapport au poste", SCAN: "Agent IA qui préqualifie les candidats par téléphone", SWIPE: "Personnalité — Big Five, 20 facettes, 5 min", DRIVE: "Motivation — 20 leviers, 8 min", BRAIN: "Raisonnement cognitif — adaptatif, 8 min", VOICE: "Entretien IA hard skills & langues (CECRL)" },
    tokens: "tokens par évaluation",
    t2: "Vos clients disposent de l'application AssessFirst complète", sub2: "Pas une version allégée. La même plateforme que 3 000 entreprises utilisent chaque jour.",
    pts: [["Leur propre compte", "Recruteurs, managers, tableaux de bord, rapports candidats — tout dans leur espace."], ["35+ intégrations", "Workday, SAP SuccessFactors, SmartRecruiters, Teamtailor et d'autres, connectés en quelques clics."], ["Les résultats là où ils travaillent", "Rapports dans l'application, en PDF ou poussés dans leur ATS."]],
    t3: "Vous fixez le prix. Vous gardez la différence.",
    sub3: "Vous achetez des tokens au prix partenaire et revendez au prix que vous décidez. Autour de la licence, vous vendez ce que vous savez faire.",
    services: ["Paramétrage & setup", "Formation des recruteurs", "Debriefs candidats", "Coaching équipes & managers", "Référentiels de compétences", "Accompagnement du changement"],
    servicesT: "Services que les partenaires ajoutent typiquement",
  },
  buy: {
    t1: "Deux façons de commander", sub1: "Au choix à chaque commande. La plupart des partenaires utilisent les deux.",
    modes: [["Commande par client", ["Vous commandez exactement les tokens dont un client a besoin", "Prix selon la taille du client et son engagement (12 / 24 / 36 mois)", "Idéal pour les grands comptes et les deals pluriannuels", "Les tokens sont réservés à ce client"]],
            ["Credit Pool", ["Vous commandez un pool de tokens pour votre portefeuille", "Prix sur la grille de base, avec dégressivité au volume", "Réallocation libre entre clients, y compris les petits", "Idéal pour développer une base de PME et ETI"]]],
    t2: "Explorateur de prix", sub2: "Prix publics issus de la grille AssessFirst. Votre prix partenaire dépend de votre tier — discuté en tête-à-tête.",
    tokens: "Tokens", months: "Engagement", size: "Taille du client", list: "Prix public", perToken: "par token", discount: "Remise partenaire illustrative", partner: "Votre prix partenaire illustratif", margin: "Votre marge si revendu au prix public", tool: "Ouvrir l'outil de pricing complet →", employees: "salariés", monthsU: "mois",
    t3: "Deux horloges. Aucun crédit perdu.", sub3: "Votre pool a sa propre horloge. Chaque allocation à un client démarre un abonnement client de 12 mois, indépendant.",
    pool: "Votre pool", client: "Client", rules: [["Allouez avant la fin de votre pool", "Une fois alloués, votre client garde un abonnement complet de 12 mois — même au-delà de la fin de votre pool."], ["Reportez ce que vous n'avez pas utilisé", "Les tokens non alloués sont reportés lorsque vous renouvelez un pool de taille égale ou supérieure."], ["Rechargez à tout moment", "Ajoutez des tokens à un pool en cours, au palier de volume atteint."]],
    t4: "Tiers & fonds de développement marché", sub4: "Les tiers récompensent le revenu récurrent que vous gérez. Révisés chaque année.",
    tiers: { reseller: [["Core", "Nouveau partenaire", "—"], ["Premier", "150K ARR géré", "MDF jusqu'à 2 500 € / an"], ["Elite", "300K ARR géré", "MDF jusqu'à 5 000 € / an"]], distributor: [["Core", "Nouveau partenaire", "—"], ["Premier", "250K ARR géré", "MDF jusqu'à 7 500 € / an"], ["Elite", "500K ARR géré", "MDF jusqu'à 15 000 € / an"]] },
    tierCols: ["Tier", "Condition", "Fonds de développement marché"], tierNote: "Les niveaux de remise sont partagés lors de votre échange programme en tête-à-tête. Les MDF sont remboursés sur activités de co-marketing approuvées.",
  },
  bo: {
    kicker: "Deployer — votre back-office partenaire", t1: "Pilotez votre activité AssessFirst sans nous attendre",
    sub1: "Commander, créer les comptes clients, allouer les tokens, suivre la consommation. La démo ci-dessous est interactive.",
    tabs: ["Wallet", "Clients", "Créer & allouer", "Utilisateurs & renouvellement", "Consommation", "Espace client"],
    wallet: { balance: "Tokens non alloués", allocated: "Alloués aux clients", consumed: "Consommés par les clients", ends: "Fin du pool", burn: "Au rythme actuel votre pool sera entièrement alloué le", topup: "RECHARGER LE POOL", order: "COMMANDER POUR UN CLIENT", alert: "tokens non alloués — allouez avant le" },
    clients: { cols: ["Client", "Pays", "Alloués", "Consommés", "Début", "Renouvellement", "Utilisateurs", "Apporté par"], create: "CRÉER UN CLIENT", you: "Vous" },
    create: { title: "Créer un client et allouer des tokens", name: "Nom de l'entreprise", country: "Pays", admin: "Email administrateur", tokens: "Tokens à allouer", sourced: "Apporté par (optionnel)", btn: "CRÉER & ALLOUER", done: "créé. L'abonnement court 12 mois à partir d'aujourd'hui.", starts: "L'abonnement client démarre aujourd'hui pour 12 mois, indépendamment de votre pool.", remaining: "Reste dans votre pool après allocation" },
    users: { title: "Utilisateurs & renouvellement", add: "AJOUTER UN UTILISATEUR", renew: "RENOUVELER 12 MOIS", realloc: "RÉALLOUER LE NON-UTILISÉ", role: "Rôle", roles: ["Admin", "Recruteur", "Lecteur"], renewed: "Renouvelé — la nouvelle période démarre à la fin de la période en cours.", realloced: "Tokens non utilisés retournés dans votre pool." },
    cons: { title: "Consommation par client et par produit", month: "Consommation mensuelle (tokens)", export: "EXPORTER CSV" },
    ws: { title: "Basculer dans l'espace d'un client", sub: "Ouvrez le compte AssessFirst de votre client en accès délégué. Aucun mot de passe à partager, chaque action est journalisée.", open: "OUVRIR L'ESPACE", banner: "Vous travaillez dans", exit: "RETOUR À VOTRE BACK-OFFICE" },
    orderFor: { title: "Commander pour un client spécifique", sub: "Prix sur la grille du client. Les tokens sont réservés à ce client.", send: "ENVOYER LA COMMANDE", sent: "Commande envoyée — vous recevrez la facture et les tokens seront crédités à ce client." },
    specT: "Spécification produit", spec: ["User story", "Règles métier", "Données", "Droits par profil", "Hors périmètre v1"],
  },
  sim: {
    t1: "Simulez votre première année", sub1: "Chaque chiffre est une hypothèse modifiable. Le prix de revente et les honoraires de services sont les vôtres.",
    presets: [["Boutique", 5, 5000], ["Régional", 20, 10000], ["Réseau", 80, 12500]],
    clients: "Clients par an", perClient: "Tokens par client et par an", mode: "Mode d'achat", modes: ["Commande par client", "Credit Pool"], pool: "Engagement du pool", resale: "Votre prix de revente par client", resaleHint: "Défaut = prix public AssessFirst, 12 mois, <250 salariés", discount: "Remise partenaire illustrative", days: "Jours de service par client", rate: "Votre TJM",
    out: { tokens: "Revenu tokens", cost: "Coût d'achat des tokens", margin: "Marge tokens", services: "Revenu services", total: "Marge brute totale", perClient: "par client" },
    note: "Le coût d'achat utilise la grille AssessFirst et la remise que vous avez fixée ci-dessus. Les conditions finales sont convenues en tête-à-tête.",
  },
  days: {
    t1: "Du contrat au premier client en 90 jours", sub1: "Un plan partagé. Nous nous engageons sur le support, vous sur le rythme.",
    phases: [["Jour 0–14", "Onboarding", ["Contrat signé, accès portail & back-office", "Kick-off avec votre Partner Manager", "Certification produit"]], ["Jour 14–45", "Activation", ["Premières opportunités enregistrées", "Début des revues mensuelles", "Objectif : 3 leads qualifiés"]], ["Jour 60–90", "Premier revenu", ["Premier client signé", "Client créé dans votre back-office", "Tokens alloués, onboarding lancé"]], ["Mois 3–6", "Croissance", ["Pipeline récurrent", "Customer success mené par vous", "Co-marketing conjoint"]], ["An 1+", "Expansion", ["Renouvellements & upsell", "Cas clients conjoints", "Accès MDF"]]],
    t2: "Votre boîte à outils", sub2: "Deux outils, clairement séparés.",
    tools: [["Portail partenaire (Introw)", ["Certification & playbooks", "Enregistrement des deals", "Battle cards & supports de vente", "Demandes MDF"]], ["Deployer — back-office", ["Commandes & Credit Pool", "Comptes clients & licences", "Utilisateurs, dates, renouvellements", "Tableaux de consommation"]], ["Partner Manager", ["Votre interlocuteur unique", "Co-vente à la demande", "Revue mensuelle", "Escalade vers le support AssessFirst"]]],
  },
  call: {
    t1: "Envie d'explorer un partenariat ?", sub: "30 minutes suffisent pour voir si c'est le bon fit et à quoi un partenariat pourrait ressembler pour vous.",
    btn: "RÉSERVER UN CALL DE 30 MIN", next: "Les prochaines étapes", steps: [["Call de découverte (30 min)", "Votre marché, vos clients, le fit potentiel."], ["Présentation du programme", "Démo produit complète et tour du programme."], ["Contrat & onboarding", "Signature, ouverture du back-office, début de la certification."], ["Premier client ensemble", "Nous accompagnons votre première opportunité AssessFirst."]],
    team: "Équipe Partenariats — AssessFirst", mail: "partners@assessfirst.com",
  },
},
};

// ── INTERNAL SPECS (shown only in ?mode=internal) ────────────────────────────
const SPEC = [
  { story: "As a partner admin, I see my token pool balance, what is allocated, consumed, and when the pool ends.", rules: ["Pool clock starts at invoice date; duration = partner commitment (12/24/36 months)", "Unallocated tokens expire at pool end unless a pool of equal or greater size is renewed (rollover)", "Top-up priced at the cumulative volume tier reached in the period"], data: ["pool_id, tokens_total, tokens_allocated, tokens_consumed, start_date, end_date, commitment_months, tier"], rights: ["Reseller: read", "Distributor: read + top-up + order"], out: ["Multiple concurrent pools", "Automatic renewal"] },
  { story: "As a partner admin, I list every client company I manage with allocation, consumption, dates and attribution.", rules: ["'Sourced by' is a free attribution field (sub-reseller) — no platform access for the sourcing party", "Renewal date = allocation date + 12 months"], data: ["company_id, name, country, tokens_allocated, tokens_consumed, start_date, renewal_date, users_count, sourced_by"], rights: ["Reseller & Distributor: read"], out: ["Hierarchy of sub-partners with their own login"] },
  { story: "As a partner admin, I create a client company and allocate tokens from my pool in one step.", rules: ["Allocation creates a 12-month client subscription starting on allocation date, independent of pool end", "Allocated tokens leave the pool and cannot expire with it", "Minimum allocation: none (small clients allowed)", "Per-client order (client grid) remains available as an alternative"], data: ["company (name, country, admin_email), allocation (tokens, date), subscription (start, end)"], rights: ["Reseller: create company + order for client (AF allocates)", "Distributor: create + allocate from pool"], out: ["Custom subscription lengths per client"] },
  { story: "As a partner admin, I manage my clients' users, renew subscriptions and reallocate unused tokens.", rules: ["Reallocation returns unused tokens to the pool (not to another client directly)", "Renewal creates a new 12-month period starting at current end date", "Roles: admin / recruiter / viewer"], data: ["user_id, email, role, company_id, last_login"], rights: ["Both: manage users", "Distributor: renew + reallocate", "Reseller: renew via order"], out: ["SSO per client", "Bulk user import"] },
  { story: "As a partner admin, I follow consumption per client and per product to anticipate renewals and upsell.", rules: ["Token weights: CVS 5, SCAN 10, SWIPE/DRIVE/BRAIN/VOICE 20", "Alerts at 80% and 100% of a client's allocation"], data: ["consumption events (company_id, product, tokens, date)"], rights: ["Both: read + export"], out: ["Candidate-level data (GDPR: stays in client workspace)"] },
  { story: "As a partner consultant, I open a client's workspace with delegated access to configure campaigns.", rules: ["Delegated access requires the client admin's consent at company creation (checkbox)", "Every action is logged with partner user identity", "Access can be revoked by the client admin"], data: ["delegation (partner_user_id, company_id, granted_at, revoked_at), audit log"], rights: ["Distributor: yes", "Reseller: on client consent"], out: ["Impersonation of individual client users"] },
];

// ── UI PRIMITIVES ────────────────────────────────────────────────────────────
const S = {
  page: { fontFamily: FONT, color: BLACK, background: "#fff", minHeight: "100vh" },
  wrap: { maxWidth: 1080, margin: "0 auto", padding: "40px 32px 120px" },
  h1: { fontSize: 40, lineHeight: 1.1, fontWeight: 600, margin: "0 0 12px", letterSpacing: -0.5 },
  sub: { fontSize: 18, color: GRAY, lineHeight: 1.5, margin: "0 0 36px", maxWidth: 720, fontWeight: 300 },
  kicker: { fontSize: 13, color: PINK, fontWeight: 500, marginBottom: 12 },
  card: { background: LIGHT, borderRadius: 14, padding: 24 },
  cardW: { background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 },
  grid: (n, gap = 16) => ({ display: "grid", gridTemplateColumns: `repeat(${n},minmax(0,1fr))`, gap }),
  small: { fontSize: 13, color: GRAY },
  label: { fontSize: 13, color: GRAY, marginBottom: 6, display: "block" },
  input: { width: "100%", padding: "10px 12px", border: `1px solid ${BORDER}`, borderRadius: 8, fontFamily: FONT, fontSize: 15, color: BLACK, background: "#fff", boxSizing: "border-box" },
  tag: { display: "inline-block", fontSize: 12, padding: "3px 10px", borderRadius: 999, background: "#fff", border: `1px solid ${BORDER}`, color: GRAY },
};
const Btn = ({ children, onClick, secondary, href, style, small }) => {
  const base = { display: "inline-block", fontFamily: FONT, fontWeight: 350, textTransform: "uppercase", letterSpacing: 0.5, borderRadius: 8, padding: small ? "8px 14px" : "12px 24px", fontSize: small ? 12 : 14, cursor: "pointer", textDecoration: "none", border: secondary ? `1px solid ${BORDER}` : "none", background: secondary ? "#fff" : PINK, color: secondary ? BLACK : "#fff", ...style };
  return href ? <a href={href} target="_blank" rel="noreferrer" style={base}>{children}</a> : <button onClick={onClick} style={base}>{children}</button>;
};
const Head = ({ kicker, title, sub }) => (<div>{kicker && <div style={S.kicker}>{kicker}</div>}<h1 style={S.h1}>{title}</h1>{sub && <p style={S.sub}>{sub}</p>}</div>);
const Field = ({ label, children, hint }) => (<div><label style={S.label}>{label}</label>{children}{hint && <div style={{ ...S.small, marginTop: 4 }}>{hint}</div>}</div>);
const Range = ({ value, onChange, min, max, step = 1, format }) => (
  <div><input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: PINK }} /><div style={{ fontSize: 15, fontWeight: 500 }}>{format ? format(value) : value}</div></div>
);
const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={e => onChange(e.target.value)} style={S.input}>{options.map(o => <option key={o[0]} value={o[0]}>{o[1]}</option>)}</select>
);
const Stat = ({ v, l, big }) => (<div><div style={{ fontSize: big ? 36 : 28, fontWeight: 600, lineHeight: 1 }}>{v}</div><div style={{ ...S.small, marginTop: 6 }}>{l}</div></div>);
const Pill = ({ children, on, onClick }) => (
  <button onClick={onClick} style={{ fontFamily: FONT, fontSize: 13, padding: "6px 14px", borderRadius: 999, border: `1px solid ${on ? BLACK : BORDER}`, background: on ? BLACK : "#fff", color: on ? "#fff" : BLACK, cursor: "pointer" }}>{children}</button>
);

// ── ACT 0 · HOME ─────────────────────────────────────────────────────────────
const Home = ({ t, go }) => (
  <div>
    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 48, alignItems: "center", marginBottom: 56 }}>
      <div><div style={S.kicker}>{t.home.kicker}</div><h1 style={{ ...S.h1, fontSize: 52 }}>{t.home.title}</h1><p style={S.sub}>{t.home.sub}</p><Btn onClick={() => go(1, 0)}>{t.start}</Btn></div>
      <div style={S.grid(2, 12)}>{t.home.stats.map(([v, l]) => <div key={l} style={S.card}><Stat v={v} l={l} /></div>)}</div>
    </div>
    <div style={{ fontSize: 13, color: GRAY, marginBottom: 12 }}>{t.home.chapters}</div>
    <div style={S.grid(4, 12)}>{t.acts.map((a, i) => (
      <button key={a} onClick={() => go(i + 1, 0)} style={{ ...S.cardW, textAlign: "left", cursor: "pointer", fontFamily: FONT, padding: 18 }}>
        <div style={{ fontSize: 12, color: PINK, marginBottom: 6 }}>{String(i + 1).padStart(2, "0")}</div><div style={{ fontSize: 16, fontWeight: 500, color: BLACK }}>{a}</div>
      </button>))}</div>
  </div>
);

// ── ACT 1 · WHY NOW ──────────────────────────────────────────────────────────
const Why1 = ({ t }) => (
  <div><Head title={t.why.t1} />
    <div style={S.grid(3, 20)}>{t.why.cols.map(([h, items], ci) => (
      <div key={h}><div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${ci === 1 ? PINK : BORDER}` }}>{h}</div>
        {items.map(([a, b]) => <div key={a} style={{ ...S.card, marginBottom: 12 }}><div style={{ fontSize: ci === 2 ? 30 : 16, fontWeight: 600, marginBottom: 6 }}>{a}</div><div style={{ fontSize: 14, color: GRAY, lineHeight: 1.5 }}>{b}</div></div>)}
      </div>))}</div>
  </div>
);
const Why2 = ({ t, go }) => (
  <div><Head title={t.why.t2} sub={t.why.sub2} />
    <div style={S.grid(3, 16)}>{t.why.pts.map(([a, b], i) => <div key={a} style={S.card}><div style={{ fontSize: 13, color: PINK, marginBottom: 10 }}>{i + 1}</div><div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>{a}</div><div style={{ fontSize: 14, color: GRAY, lineHeight: 1.5 }}>{b}</div></div>)}</div>
    <div style={{ marginTop: 32 }}><Btn onClick={() => go(2, 0)}>{t.why.cta}</Btn></div>
  </div>
);

// ── ACT 2 · WHICH PARTNER ────────────────────────────────────────────────────
const Who1 = ({ t, profile, setProfile, go }) => (
  <div><Head title={t.who.t1} sub={t.who.sub1} />
    <div style={S.grid(2, 20)}>{Object.entries(t.who.profiles).map(([k, [name, d, ex]]) => {
      const on = profile === k;
      return <button key={k} onClick={() => { setProfile(k); }} style={{ ...S.cardW, textAlign: "left", cursor: "pointer", fontFamily: FONT, border: `2px solid ${on ? PINK : BORDER}`, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><div style={{ fontSize: 24, fontWeight: 600 }}>{name}</div>{on && <span style={{ ...S.tag, background: PINK, color: "#fff", border: "none" }}>{t.who.you}</span>}</div>
        <div style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 14 }}>{d}</div><div style={S.small}>{ex}</div></button>;
    })}</div>
    <div style={{ marginTop: 28 }}><Btn onClick={() => go(2, 1)}>{t.next}</Btn></div>
  </div>
);
const Who2 = ({ t, profile }) => {
  const who = (v) => v.startsWith(t.who.you) ? PINK : v === "AssessFirst" ? "#0096FF" : GRAY;
  return (<div><Head title={t.who.t2} sub={t.who.profiles[profile][0]} />
    <div style={{ ...S.cardW, padding: 0, overflow: "hidden" }}>{t.who.rows.map((r, i) => {
      const v = t.who.matrix[profile][i];
      return <div key={r} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "14px 24px", borderTop: i ? `1px solid ${BORDER}` : "none" }}><div style={{ fontSize: 15 }}>{r}</div><div style={{ fontSize: 15, fontWeight: 500, color: who(v) }}>{v}</div></div>;
    })}</div>
    <p style={{ ...S.small, marginTop: 16 }}>{t.who.note}</p></div>);
};

// ── ACT 3 · WHAT YOU SELL ────────────────────────────────────────────────────
const Sell1 = ({ t }) => (
  <div><Head title={t.sell.t1} sub={t.sell.sub1} />
    <div style={S.grid(3, 16)}>{PRODUCTS.map(p => <div key={p.id} style={S.card}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><div style={{ fontSize: 20, fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: 13, color: PINK, fontWeight: 500 }}>{p.tk} tk</div></div><div style={{ fontSize: 14, color: GRAY, marginTop: 8, lineHeight: 1.5 }}>{t.sell.desc[p.id]}</div></div>)}</div>
    <p style={{ ...S.small, marginTop: 14 }}>tk = {t.sell.tokens}</p>
  </div>
);
const Sell2 = ({ t }) => (
  <div><Head title={t.sell.t2} sub={t.sell.sub2} />
    <div style={{ background: GRAD, borderRadius: 20, padding: 32 }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 28, ...S.grid(3, 20) }}>{t.sell.pts.map(([a, b]) => <div key={a}><div style={{ fontSize: 17, fontWeight: 500, marginBottom: 8 }}>{a}</div><div style={{ fontSize: 14, color: GRAY, lineHeight: 1.5 }}>{b}</div></div>)}</div>
    </div>
  </div>
);
const Sell3 = ({ t, cur }) => {
  const buy = listPrice(10000, 12, "<250") * 0.6, sell = listPrice(10000, 12, "<250");
  return (<div><Head title={t.sell.t3} sub={t.sell.sub3} />
    <div style={S.grid(2, 20)}>
      <div style={S.card}><div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", alignItems: "center", gap: 8, textAlign: "center" }}>
        <Stat v={money(sell, cur)} l={t.buy.list} /><div style={{ fontSize: 24, color: GRAY }}>−</div><Stat v={money(buy, cur)} l={t.buy.partner} /><div style={{ fontSize: 24, color: GRAY }}>=</div><div><div style={{ fontSize: 28, fontWeight: 600, color: PINK }}>{money(sell - buy, cur)}</div><div style={{ ...S.small, marginTop: 6 }}>{t.buy.margin}</div></div>
      </div><div style={{ ...S.small, marginTop: 16, textAlign: "center" }}>10,000 tk · 12 {t.buy.monthsU} · &lt;250 {t.buy.employees} · {t.illustrative}</div></div>
      <div style={S.cardW}><div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>{t.sell.servicesT}</div><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{t.sell.services.map(s => <span key={s} style={{ ...S.tag, fontSize: 14, padding: "8px 14px", color: BLACK }}>{s}</span>)}</div></div>
    </div></div>);
};

// ── ACT 4 · HOW YOU BUY ──────────────────────────────────────────────────────
const Buy1 = ({ t }) => (
  <div><Head title={t.buy.t1} sub={t.buy.sub1} />
    <div style={S.grid(2, 20)}>{t.buy.modes.map(([name, pts], i) => <div key={name} style={{ ...S.cardW, borderTop: `4px solid ${i ? PINK : BLACK}`, padding: 28 }}><div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>{name}</div>{pts.map(p => <div key={p} style={{ fontSize: 15, lineHeight: 1.5, padding: "8px 0", borderTop: `1px solid ${BORDER}` }}>{p}</div>)}</div>)}</div>
  </div>
);
const Buy2 = ({ t, cur }) => {
  const [i, setI] = useState(2), [m, setM] = useState(12), [sz, setSz] = useState("<250"), [disc, setDisc] = useState(40);
  const tk = PRICE[i][0], lp = listPrice(tk, m, sz), pp = lp * (1 - disc / 100);
  return (<div><Head title={t.buy.t2} sub={t.buy.sub2} />
    <div style={S.grid(2, 24)}>
      <div style={{ ...S.card, display: "grid", gap: 18 }}>
        <Field label={t.buy.tokens}><Range value={i} onChange={setI} min={0} max={PRICE.length - 1} format={v => num(PRICE[v][0]) + " tk"} /></Field>
        <div style={S.grid(2, 12)}><Field label={t.buy.months}><Select value={m} onChange={v => setM(Number(v))} options={[12, 24, 36, 48, 60].map(x => [x, x + " " + t.buy.monthsU])} /></Field><Field label={t.buy.size}><Select value={sz} onChange={setSz} options={Object.keys(SIZE_COEF).map(x => [x, x + " " + t.buy.employees])} /></Field></div>
        <Field label={t.buy.discount} hint={t.illustrative}><Range value={disc} onChange={setDisc} min={20} max={50} step={5} format={v => v + " %"} /></Field>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={S.cardW}><Stat v={money(lp, cur)} l={t.buy.list + " · " + money(lp / tk, cur, 2) + " " + t.buy.perToken} big /></div>
        <div style={{ ...S.cardW, borderColor: PINK }}><Stat v={money(pp, cur)} l={t.buy.partner + " · " + money(pp / tk, cur, 2) + " " + t.buy.perToken} big /></div>
        <div style={S.card}><Stat v={money(lp - pp, cur)} l={t.buy.margin} /></div>
        <a href={PRICING_TOOL_URL} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: BLACK, textDecoration: "underline" }}>{t.buy.tool}</a>
      </div>
    </div></div>);
};
const Buy3 = ({ t }) => {
  const clients = [[1, "A"], [5, "B"], [11, "C"], [19, "D"]]; // start month, label (pool = 24 months)
  return (<div><Head title={t.buy.t3} sub={t.buy.sub3} />
    <div style={{ ...S.cardW, padding: 28, marginBottom: 20 }}>
      <div style={{ position: "relative", height: 34, marginBottom: 14 }}><div style={{ position: "absolute", left: 0, width: `${24 / 32 * 100}%`, height: 34, background: BLACK, borderRadius: 8, color: "#fff", fontSize: 13, display: "flex", alignItems: "center", paddingLeft: 12 }}>{t.buy.pool} — 24 {t.buy.monthsU}</div></div>
      {clients.map(([s, l]) => <div key={l} style={{ position: "relative", height: 26, marginBottom: 8 }}><div style={{ position: "absolute", left: `${s / 32 * 100}%`, width: `${12 / 32 * 100}%`, height: 26, background: s + 12 > 24 ? PINK : "#0096FF", borderRadius: 6, color: "#fff", fontSize: 12, display: "flex", alignItems: "center", paddingLeft: 10 }}>{t.buy.client} {l} — 12 {t.buy.monthsU}</div></div>)}
      <div style={{ position: "relative", height: 1, background: BORDER, marginTop: 8 }}><div style={{ position: "absolute", left: `${24 / 32 * 100}%`, top: -60, height: 68, borderLeft: `2px dashed ${PINK}` }} /></div>
    </div>
    <div style={S.grid(3, 16)}>{t.buy.rules.map(([a, b]) => <div key={a} style={S.card}><div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{a}</div><div style={{ fontSize: 14, color: GRAY, lineHeight: 1.5 }}>{b}</div></div>)}</div>
  </div>);
};
const Buy4 = ({ t, profile }) => (
  <div><Head title={t.buy.t4} sub={t.buy.sub4} />
    <div style={{ ...S.cardW, padding: 0, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr", padding: "12px 24px", background: LIGHT, fontSize: 13, color: GRAY }}>{t.buy.tierCols.map(c => <div key={c}>{c}</div>)}</div>
      {t.buy.tiers[profile].map(([a, b, c], i) => <div key={a} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr", padding: "16px 24px", borderTop: `1px solid ${BORDER}` }}><div style={{ fontWeight: 600, color: i === 2 ? PINK : BLACK }}>{a}</div><div>{b}</div><div style={{ color: GRAY }}>{c}</div></div>)}
    </div>
    <p style={{ ...S.small, marginTop: 14 }}>{t.buy.tierNote}</p>
  </div>
);

// ── ACT 5 · BACK-OFFICE DEMO ─────────────────────────────────────────────────
const SEED = [
  { n: "Nordwind Retail", c: "FR", a: 12500, u: 8600, s: "2026-02-03", users: 6, by: "" },
  { n: "Altura Consulting", c: "ES", a: 5000, u: 1900, s: "2026-04-15", users: 3, by: "" },
  { n: "Bergmann Logistics", c: "DE", a: 20000, u: 14200, s: "2025-11-20", users: 9, by: "TalentLab" },
  { n: "Cielo Hospitality", c: "IT", a: 7500, u: 2300, s: "2026-06-02", users: 4, by: "" },
  { n: "Kestrel Fintech", c: "UK", a: 10000, u: 6100, s: "2026-01-12", users: 5, by: "TalentLab" },
];
const POOL = { total: 100000, start: "2026-01-01", end: "2027-12-31" };
const addYear = (d) => { const x = new Date(d); x.setFullYear(x.getFullYear() + 1); return x.toISOString().slice(0, 10); };
const MIX = [0.08, 0.22, 0.3, 0.15, 0.15, 0.1]; // consumption share by product (illustrative)

const BO = ({ t, cur, internal, profile }) => {
  const [tab, setTab] = useState(0);
  const [clients, setClients] = useState(SEED);
  const [sel, setSel] = useState(0);
  const [ws, setWs] = useState(null);
  const [msg, setMsg] = useState("");
  const [showOrder, setShowOrder] = useState(false);
  const [topup, setTopup] = useState(0);
  const [form, setForm] = useState({ n: "", c: "", e: "", tk: 5000, by: "" });
  const b = t.bo;
  const allocated = clients.reduce((s, c) => s + c.a, 0), consumed = clients.reduce((s, c) => s + c.u, 0);
  const total = POOL.total + topup, free = total - allocated;
  const pace = allocated / 9; // per month since pool start (illustrative)
  const burnDate = new Date(2026, 8, 21 + Math.round(free / pace * 30)).toISOString().slice(0, 10);
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3500); };
  const Spec = () => internal ? (
    <div style={{ background: BLACK, color: "#fff", borderRadius: 14, padding: 20, fontSize: 13, lineHeight: 1.5 }}>
      <div style={{ color: "#FFA800", marginBottom: 10, fontWeight: 500 }}>{b.specT} · {b.tabs[tab]}</div>
      {[SPEC[tab].story, SPEC[tab].rules, SPEC[tab].data, SPEC[tab].rights, SPEC[tab].out].map((v, i) => <div key={i} style={{ marginBottom: 10 }}><div style={{ color: "#aaa", fontSize: 11 }}>{b.spec[i]}</div>{Array.isArray(v) ? v.map(x => <div key={x}>· {x}</div>) : <div>{v}</div>}</div>)}
    </div>) : null;
  const Row = ({ c, i }) => (
    <div onClick={() => setSel(i)} style={{ display: "grid", gridTemplateColumns: "1.6fr .5fr .8fr .8fr .9fr .9fr .6fr 1fr", padding: "12px 16px", borderTop: `1px solid ${BORDER}`, fontSize: 13, cursor: "pointer", background: sel === i ? "#fff5fa" : "#fff" }}>
      <div style={{ fontWeight: 500 }}>{c.n}</div><div>{c.c}</div><div>{num(c.a)}</div><div><span style={{ display: "inline-block", width: 60, height: 6, background: BORDER, borderRadius: 3, verticalAlign: "middle", marginRight: 6 }}><span style={{ display: "block", width: `${Math.min(100, c.u / c.a * 100)}%`, height: 6, background: c.u / c.a > .8 ? PINK : "#0096FF", borderRadius: 3 }} /></span>{num(c.u)}</div><div>{c.s}</div><div>{addYear(c.s)}</div><div>{c.users}</div><div style={{ color: GRAY }}>{c.by || b.clients.you}</div>
    </div>);
  const panel = { background: "#fff", borderRadius: 12, padding: 24, minHeight: 380 };
  let body;
  if (ws !== null) body = (<div style={{ ...panel, border: `2px solid ${PINK}` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><div style={{ fontSize: 13 }}>{b.ws.banner} <b>{clients[ws].n}</b> · {clients[ws].c}</div><Btn small secondary onClick={() => setWs(null)}>{b.ws.exit}</Btn></div>
    <div style={S.grid(3, 12)}>{["Campaigns", "Candidates", "Reports"].map((x, i) => <div key={x} style={S.card}><div style={{ fontSize: 13, color: GRAY }}>{x}</div><div style={{ fontSize: 26, fontWeight: 600 }}>{[7, 312, 148][i]}</div></div>)}</div>
    <div style={{ ...S.card, marginTop: 12, height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: GRAY, fontSize: 13 }}>AssessFirst app — client workspace (delegated access, all actions logged)</div>
  </div>);
  else if (tab === 0) body = (<div style={panel}>
    <div style={S.grid(4, 12)}><div style={S.card}><Stat v={num(free)} l={b.wallet.balance} /></div><div style={S.card}><Stat v={num(allocated)} l={b.wallet.allocated} /></div><div style={S.card}><Stat v={num(consumed)} l={b.wallet.consumed} /></div><div style={S.card}><Stat v={POOL.end} l={b.wallet.ends} /></div></div>
    <div style={{ height: 14, background: LIGHT, borderRadius: 7, marginTop: 20, overflow: "hidden", display: "flex" }}><div style={{ width: `${consumed / total * 100}%`, background: BLACK }} /><div style={{ width: `${(allocated - consumed) / total * 100}%`, background: "#0096FF" }} /></div>
    <div style={{ ...S.small, marginTop: 8 }}>{b.wallet.burn} <b>{burnDate}</b></div>
    <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: "#FFF5FA", border: `1px solid ${PINK}`, fontSize: 13 }}><b>{num(free)}</b> {b.wallet.alert} {POOL.end}.</div>
    <div style={{ display: "flex", gap: 10, marginTop: 20 }}><Btn small onClick={() => { setTopup(topup + 50000); flash("+50,000 tokens"); }}>{b.wallet.topup}</Btn><Btn small secondary onClick={() => setShowOrder(!showOrder)}>{b.wallet.order}</Btn></div>
    {showOrder && <OrderFor t={t} cur={cur} clients={clients} onSent={() => { setShowOrder(false); flash(b.orderFor.sent); }} />}
  </div>);
  else if (tab === 1) body = (<div style={{ ...panel, padding: 0, overflow: "hidden" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 16px 8px" }}><div style={{ fontSize: 15, fontWeight: 500 }}>{clients.length} {b.tabs[1]}</div><Btn small onClick={() => setTab(2)}>{b.clients.create}</Btn></div>
    <div style={{ display: "grid", gridTemplateColumns: "1.6fr .5fr .8fr .8fr .9fr .9fr .6fr 1fr", padding: "8px 16px", fontSize: 11, color: GRAY }}>{b.clients.cols.map(c => <div key={c}>{c}</div>)}</div>
    {clients.map((c, i) => <Row key={c.n + i} c={c} i={i} />)}
  </div>);
  else if (tab === 2) body = (<div style={panel}><div style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>{b.create.title}</div>
    <div style={S.grid(2, 14)}>
      <Field label={b.create.name}><input style={S.input} value={form.n} onChange={e => setForm({ ...form, n: e.target.value })} /></Field>
      <Field label={b.create.country}><input style={S.input} value={form.c} onChange={e => setForm({ ...form, c: e.target.value })} /></Field>
      <Field label={b.create.admin}><input style={S.input} value={form.e} onChange={e => setForm({ ...form, e: e.target.value })} /></Field>
      <Field label={b.create.sourced}><input style={S.input} value={form.by} onChange={e => setForm({ ...form, by: e.target.value })} placeholder="TalentLab" /></Field>
      <Field label={b.create.tokens} hint={b.create.remaining + ": " + num(free - form.tk)}><Range value={form.tk} onChange={v => setForm({ ...form, tk: v })} min={500} max={Math.max(500, free)} step={500} format={v => num(v) + " tk"} /></Field>
      <div style={{ ...S.card, fontSize: 13, color: GRAY, alignSelf: "end" }}>{b.create.starts}</div>
    </div>
    <div style={{ marginTop: 18 }}><Btn small onClick={() => { if (!form.n) return; setClients([...clients, { n: form.n, c: form.c || "—", a: form.tk, u: 0, s: "2026-09-21", users: 1, by: form.by }]); flash(`${form.n} ${b.create.done}`); setForm({ n: "", c: "", e: "", tk: 5000, by: "" }); setTab(1); }}>{b.create.btn}</Btn></div>
  </div>);
  else if (tab === 3) { const c = clients[sel]; body = (<div style={panel}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}><div style={{ fontSize: 18, fontWeight: 500 }}>{c.n}</div><div style={S.small}>{c.s} → {addYear(c.s)} · {num(c.a - c.u)} tk left</div></div>
    <div style={{ ...S.cardW, padding: 0, overflow: "hidden", marginBottom: 16 }}>{Array.from({ length: c.users }).map((_, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "10px 16px", borderTop: i ? `1px solid ${BORDER}` : "none", fontSize: 13 }}><div>user{i + 1}@{c.n.split(" ")[0].toLowerCase()}.com</div><div style={{ color: GRAY }}>{b.users.roles[i === 0 ? 0 : i % 3 === 0 ? 2 : 1]}</div><div style={{ color: GRAY }}>2026-09-{10 + i}</div></div>)}</div>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Btn small secondary onClick={() => { const cs = [...clients]; cs[sel] = { ...c, users: c.users + 1 }; setClients(cs); }}>{b.users.add}</Btn><Btn small onClick={() => flash(b.users.renewed)}>{b.users.renew}</Btn><Btn small secondary onClick={() => { const cs = [...clients]; cs[sel] = { ...c, a: c.u }; setClients(cs); flash(b.users.realloced); }}>{b.users.realloc}</Btn></div>
  </div>); }
  else if (tab === 4) body = (<div style={panel}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><div style={{ fontSize: 18, fontWeight: 500 }}>{b.cons.title}</div><Btn small secondary onClick={() => flash("consumption.csv")}>{b.cons.export}</Btn></div>
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 3fr", gap: 8, fontSize: 12, color: GRAY, marginBottom: 6 }}><div /><div style={{ display: "flex", gap: 12 }}>{PRODUCTS.map((p, i) => <span key={p.id}><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: ["#FFA800", "#FE8058", PINK, "#7C3AED", "#0096FF", "#029CAF"][i], marginRight: 4 }} />{p.id}</span>)}</div></div>
    {clients.map(c => <div key={c.n} style={{ display: "grid", gridTemplateColumns: "1.4fr 3fr", gap: 8, alignItems: "center", marginBottom: 8, fontSize: 13 }}><div>{c.n}</div><div style={{ display: "flex", height: 18, borderRadius: 4, overflow: "hidden", background: LIGHT }}>{MIX.map((m, i) => <div key={i} style={{ width: `${c.u / 20000 * m * 100}%`, background: ["#FFA800", "#FE8058", PINK, "#7C3AED", "#0096FF", "#029CAF"][i] }} />)}</div></div>)}
    <div style={{ ...S.small, marginTop: 18, marginBottom: 6 }}>{b.cons.month}</div>
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 90 }}>{[4.2, 5.1, 6.3, 5.8, 7.4, 8.1, 7.9, 9.2, 8.6].map((v, i) => <div key={i} style={{ flex: 1, height: `${v * 9}%`, background: i === 8 ? PINK : BLACK, borderRadius: 4 }} title={num(v * 1000)} />)}</div>
  </div>);
  else body = (<div style={panel}><div style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>{b.ws.title}</div><div style={{ ...S.small, marginBottom: 18 }}>{b.ws.sub}</div>
    <div style={S.grid(3, 12)}>{clients.slice(0, 6).map((c, i) => <div key={c.n} style={S.card}><div style={{ fontWeight: 500, marginBottom: 4 }}>{c.n}</div><div style={{ ...S.small, marginBottom: 12 }}>{c.users} users · {num(c.a - c.u)} tk left</div><Btn small onClick={() => setWs(i)}>{b.ws.open}</Btn></div>)}</div>
  </div>);
  return (<div>
    <Head kicker={b.kicker} title={b.t1} sub={b.sub1} />
    <div style={{ background: GRAD, borderRadius: 20, padding: 20 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>{b.tabs.map((x, i) => <button key={x} onClick={() => { setTab(i); setWs(null); }} style={{ fontFamily: FONT, fontSize: 13, padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: tab === i && ws === null ? "#fff" : "rgba(255,255,255,.35)", color: BLACK, fontWeight: tab === i ? 500 : 400 }}>{x}</button>)}<div style={{ marginLeft: "auto", fontSize: 12, color: "#fff", alignSelf: "center" }}>{t.who.profiles[profile][0]} · Deployer</div></div>
      <div style={{ display: "grid", gridTemplateColumns: internal ? "1fr 300px" : "1fr", gap: 14 }}>{body}<Spec /></div>
      {msg && <div style={{ marginTop: 12, background: BLACK, color: "#fff", borderRadius: 10, padding: "10px 16px", fontSize: 13 }}>{msg}</div>}
    </div>
  </div>);
};
const OrderFor = ({ t, cur, clients, onSent }) => {
  const [c, setC] = useState(0), [i, setI] = useState(2), [m, setM] = useState(12), [sz, setSz] = useState("<250");
  const tk = PRICE[i][0], lp = listPrice(tk, m, sz);
  return (<div style={{ ...S.card, marginTop: 16 }}><div style={{ fontWeight: 500, marginBottom: 4 }}>{t.bo.orderFor.title}</div><div style={{ ...S.small, marginBottom: 14 }}>{t.bo.orderFor.sub}</div>
    <div style={S.grid(4, 12)}>
      <Field label={t.bo.clients.cols[0]}><Select value={c} onChange={v => setC(Number(v))} options={clients.map((x, k) => [k, x.n])} /></Field>
      <Field label={t.buy.tokens}><Select value={i} onChange={v => setI(Number(v))} options={PRICE.slice(0, 15).map((p, k) => [k, num(p[0])])} /></Field>
      <Field label={t.buy.months}><Select value={m} onChange={v => setM(Number(v))} options={[12, 24, 36].map(x => [x, x + " " + t.buy.monthsU])} /></Field>
      <Field label={t.buy.size}><Select value={sz} onChange={setSz} options={Object.keys(SIZE_COEF).map(x => [x, x])} /></Field>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}><div><span style={S.small}>{t.buy.list}: </span><b>{money(lp, cur)}</b></div><Btn small onClick={onSent}>{t.bo.orderFor.send}</Btn></div>
  </div>);
};

// ── ACT 6 · SIMULATOR ────────────────────────────────────────────────────────
const Sim = ({ t, cur }) => {
  const [clients, setClients] = useState(20), [per, setPer] = useState(10000), [mode, setMode] = useState(1), [pm, setPm] = useState(24), [disc, setDisc] = useState(40), [days, setDays] = useState(0), [rate, setRate] = useState(1200), [resale, setResale] = useState(null);
  const defResale = listPrice(per, 12, "<250"), rs = resale ?? defResale;
  const yearTokens = clients * per, k = pm / 12;
  const cost = mode === 0 ? clients * listPrice(per, 12, "<250") * (1 - disc / 100) : listPrice(yearTokens * k, pm, "<250") / k * (1 - disc / 100);
  const rev = clients * rs, margin = rev - cost, serv = clients * days * rate, total = margin + serv;
  const o = t.sim.out, max = Math.max(rev, 1);
  const Bar = ({ l, v, c }) => (<div style={{ marginBottom: 10 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span>{l}</span><b>{money(v, cur)}</b></div><div style={{ height: 10, background: LIGHT, borderRadius: 5 }}><div style={{ width: `${Math.max(0, Math.min(100, v / max * 100))}%`, height: 10, background: c, borderRadius: 5 }} /></div></div>);
  return (<div><Head title={t.sim.t1} sub={t.sim.sub1} />
    <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>{t.sim.presets.map(([n, c, p]) => <Pill key={n} on={clients === c && per === p} onClick={() => { setClients(c); setPer(p); setResale(null); }}>{n} · {c} × {num(p)} tk</Pill>)}</div>
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24 }}>
      <div style={{ ...S.card, display: "grid", gap: 16 }}>
        <div style={S.grid(2, 14)}><Field label={t.sim.clients}><Range value={clients} onChange={setClients} min={1} max={200} /></Field><Field label={t.sim.perClient}><Range value={per} onChange={v => { setPer(v); setResale(null); }} min={500} max={50000} step={500} format={v => num(v) + " tk"} /></Field></div>
        <div style={S.grid(2, 14)}><Field label={t.sim.mode}><div style={{ display: "flex", gap: 6 }}>{t.sim.modes.map((m, i) => <Pill key={m} on={mode === i} onClick={() => setMode(i)}>{m}</Pill>)}</div></Field>{mode === 1 && <Field label={t.sim.pool}><Select value={pm} onChange={v => setPm(Number(v))} options={[12, 24, 36].map(x => [x, x + " " + t.buy.monthsU])} /></Field>}</div>
        <Field label={t.sim.resale + " (" + CUR[cur].s + ")"} hint={t.sim.resaleHint}><input type="number" style={S.input} value={Math.round(rs * CUR[cur].k)} onChange={e => setResale(Number(e.target.value) / CUR[cur].k)} /></Field>
        <Field label={t.sim.discount} hint={t.illustrative}><Range value={disc} onChange={setDisc} min={20} max={50} step={5} format={v => v + " %"} /></Field>
        <div style={S.grid(2, 14)}><Field label={t.sim.days}><Range value={days} onChange={setDays} min={0} max={10} step={0.5} /></Field><Field label={t.sim.rate + " (" + CUR[cur].s + ")"}><input type="number" style={S.input} value={Math.round(rate * CUR[cur].k)} onChange={e => setRate(Number(e.target.value) / CUR[cur].k)} /></Field></div>
      </div>
      <div>
        <div style={{ ...S.cardW, borderColor: PINK, marginBottom: 12 }}><Stat v={money(total, cur)} l={o.total + " · " + money(total / clients, cur) + " " + o.perClient} big /></div>
        <div style={S.cardW}><Bar l={o.tokens} v={rev} c={BLACK} /><Bar l={o.cost} v={cost} c={GRAY} /><Bar l={o.margin} v={margin} c={PINK} />{serv > 0 && <Bar l={o.services} v={serv} c="#0096FF" />}</div>
        <p style={{ ...S.small, marginTop: 12 }}>{t.sim.note}</p>
      </div>
    </div></div>);
};

// ── ACT 7 · FIRST 90 DAYS ────────────────────────────────────────────────────
const Days1 = ({ t }) => (
  <div><Head title={t.days.t1} sub={t.days.sub1} />
    <div style={{ height: 4, background: GRAD, borderRadius: 2, marginBottom: 16 }} />
    <div style={S.grid(5, 12)}>{t.days.phases.map(([when, name, pts], i) => <div key={name} style={S.card}><div style={{ fontSize: 12, color: PINK, marginBottom: 6 }}>{when}</div><div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{name}</div>{pts.map(p => <div key={p} style={{ fontSize: 13, lineHeight: 1.5, color: GRAY, marginBottom: 6 }}>{p}</div>)}</div>)}</div>
  </div>
);
const Days2 = ({ t }) => (
  <div><Head title={t.days.t2} sub={t.days.sub2} />
    <div style={S.grid(3, 16)}>{t.days.tools.map(([name, pts], i) => <div key={name} style={{ ...S.cardW, borderTop: `4px solid ${[BLACK, PINK, "#0096FF"][i]}`, padding: 28 }}><div style={{ fontSize: 20, fontWeight: 600, marginBottom: 14 }}>{name}</div>{pts.map(p => <div key={p} style={{ fontSize: 14, padding: "8px 0", borderTop: `1px solid ${BORDER}` }}>{p}</div>)}</div>)}</div>
  </div>
);

// ── ACT 8 · BOOK A CALL ──────────────────────────────────────────────────────
const Call = ({ t }) => (
  <div><Head title={t.call.t1} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
      <div style={{ ...S.cardW, padding: 32 }}><p style={{ fontSize: 17, lineHeight: 1.6, marginTop: 0 }}>{t.call.sub}</p><div style={{ fontSize: 14, fontWeight: 500, marginTop: 24 }}>{t.call.team}</div><a href={"mailto:" + t.call.mail} style={{ fontSize: 14, color: GRAY }}>{t.call.mail}</a><div style={{ marginTop: 24 }}><Btn href={BOOKING_URL}>{t.call.btn}</Btn></div></div>
      <div><div style={{ fontSize: 13, color: GRAY, marginBottom: 12 }}>{t.call.next}</div>{t.call.steps.map(([a, b], i) => <div key={a} style={{ ...S.card, marginBottom: 10, display: "grid", gridTemplateColumns: "32px 1fr", gap: 12 }}><div style={{ width: 28, height: 28, borderRadius: 14, background: PINK, color: "#fff", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div><div><div style={{ fontWeight: 500 }}>{a}</div><div style={S.small}>{b}</div></div></div>)}</div>
    </div>
  </div>
);

// ── SHELL ────────────────────────────────────────────────────────────────────
const ACTS = [[Home], [Why1, Why2], [Who1, Who2], [Sell1, Sell2, Sell3], [Buy1, Buy2, Buy3, Buy4], [BO], [Sim], [Days1, Days2], [Call]];
const ss = { get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch {} } };
const isInternal = () => { try { return /mode=internal|#internal/.test(window.location.href); } catch { return false; } };

export default function App() {
  const [ok, setOk] = useState(ss.get("af_ok") === "1");
  const [code, setCode] = useState(""), [err, setErr] = useState(false);
  const [lang, setLang] = useState("en"), [cur, setCur] = useState("EUR");
  const [profile, setProfile] = useState("distributor");
  const [pos, setPos] = useState({ a: 0, s: 0 });
  const internal = useMemo(isInternal, []);
  const t = T[lang];
  useEffect(() => { window.scrollTo(0, 0); }, [pos]);
  const go = (a, s = 0) => setPos({ a, s });
  const next = () => { const { a, s } = pos; if (s + 1 < ACTS[a].length) go(a, s + 1); else if (a + 1 < ACTS.length) go(a + 1, 0); };
  const back = () => { const { a, s } = pos; if (s > 0) go(a, s - 1); else if (a > 0) go(a - 1, ACTS[a - 1].length - 1); };
  if (!ok) return (<div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 360, textAlign: "center" }}><img src={IMG_LOGO} alt="AssessFirst" style={{ height: 56, marginBottom: 20 }} /><div style={{ fontSize: 22, fontWeight: 600 }}>{t.gate.title}</div><div style={{ ...S.small, marginBottom: 24 }}>{t.gate.sub}</div>
      <input style={{ ...S.input, textAlign: "center", marginBottom: 10 }} placeholder={t.gate.ph} value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { if (code.trim().toUpperCase() === PIN) { ss.set("af_ok", "1"); setOk(true); } else setErr(true); } }} />
      <Btn onClick={() => { if (code.trim().toUpperCase() === PIN) { ss.set("af_ok", "1"); setOk(true); } else setErr(true); }} style={{ width: "100%" }}>{t.gate.btn}</Btn>{err && <div style={{ color: PINK, fontSize: 13, marginTop: 10 }}>{t.gate.err}</div>}
      <div style={{ height: 3, background: GRAD, borderRadius: 2, marginTop: 28 }} /></div></div>);
  const Screen = ACTS[pos.a][pos.s];
  const last = pos.a === ACTS.length - 1 && pos.s === ACTS[pos.a].length - 1;
  return (<div style={S.page}>
    <div style={{ height: 3, background: GRAD }} />
    <div style={{ borderBottom: `1px solid ${BORDER}`, background: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "10px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <img src={IMG_LOGO} alt="AssessFirst" style={{ height: 32, cursor: "pointer" }} onClick={() => go(0)} />
        <div style={{ display: "flex", gap: 2, flex: 1, overflowX: "auto" }}>{t.acts.map((a, i) => <button key={a} onClick={() => go(i + 1)} style={{ fontFamily: FONT, fontSize: 12, padding: "6px 10px", border: "none", borderBottom: `2px solid ${pos.a === i + 1 ? PINK : "transparent"}`, background: "none", color: pos.a === i + 1 ? BLACK : GRAY, cursor: "pointer", whiteSpace: "nowrap" }}>{a}</button>)}</div>
        {internal && <span style={{ ...S.tag, background: BLACK, color: "#fff", border: "none" }}>{t.internal}</span>}
        <div style={{ display: "flex", gap: 4 }}>{Object.keys(CUR).map(c => <Pill key={c} on={cur === c} onClick={() => setCur(c)}>{CUR[c].s}</Pill>)}</div>
        <div style={{ display: "flex", gap: 4 }}>{Object.keys(T).map(l => <Pill key={l} on={lang === l} onClick={() => setLang(l)}>{T[l].langName}</Pill>)}</div>
      </div>
    </div>
    <div style={S.wrap}><Screen t={t} cur={cur} go={go} profile={profile} setProfile={setProfile} internal={internal} /></div>
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Btn secondary onClick={back} style={{ visibility: pos.a === 0 ? "hidden" : "visible" }}>{t.back}</Btn>
        <div style={S.small}>{pos.a > 0 && `${pos.a}.${pos.s + 1} — ${t.acts[pos.a - 1]}`}</div>
        {last ? <Btn href={BOOKING_URL}>{t.call.btn}</Btn> : <Btn onClick={next}>{pos.a === 0 ? t.start : t.next}</Btn>}
      </div>
    </div>
  </div>);
}
