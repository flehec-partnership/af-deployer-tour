import { useState, useMemo } from "react";

/* ============ DESIGN TOKENS (identical to AssessFirst Embedded tour) ============ */
const AF = {
  pink: "#FF2F92", black: "#1D1D1F", grayMid: "#757575", grayLight: "#F4F4F5", border: "#E6E6E6", white: "#FFFFFF",
  gradient: "linear-gradient(90deg,#FFA800 0%,#FE8058 25%,#FF2F92 50%,#0096FF 75%,#029CAF 100%)",
  font: "'TWK Lausanne', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};
const BOOKING_URL = "https://meetings.hubspot.com/flehec";
const PARTNERS_MAIL = "partners@assessfirst.com";

/* AssessFirst product catalogue */
const PRODUCTS = [
  { id: "CVS", label: "CV Screening", short: "CV analysis", cost: 5, icon: "▤", grad: "linear-gradient(135deg,#757575,#1D1D1F)", info: "Automatic parsing · 1 min · Extracts skills, experience and education from every CV and ranks applications against the role." },
  { id: "SCAN", label: "SCAN", short: "AI pre-qualification", cost: 10, icon: "◎", grad: "linear-gradient(135deg,#FF2F92,#0096FF)", info: "AI voice agent · 5 min · Calls candidates and validates the key criteria of the role — experience, salary, availability, mobility — with instant fit scoring." },
  { id: "SWIPE", label: "SWIPE", short: "Personality", cost: 20, icon: "◐", grad: "linear-gradient(135deg,#FF2F92,#FE8058)", info: "Visual questionnaire · 5 min · Measures 20 personality traits (Big Five) — how someone works, collaborates and grows." },
  { id: "DRIVE", label: "DRIVE", short: "Motivations", cost: 20, icon: "▲", grad: "linear-gradient(135deg,#FFA800,#FE8058)", info: "Paired statements · 8 min · Measures 20 motivation drivers — what keeps someone engaged. A predictor of retention." },
  { id: "BRAIN", label: "BRAIN", short: "Reasoning", cost: 20, icon: "◆", grad: "linear-gradient(135deg,#0096FF,#029CAF)", info: "Adaptive test · 8 min · Adjusts to the candidate in real time. Evaluates reasoning, problem-solving and learning agility." },
  { id: "VOICE", label: "VOICE", short: "Skills & languages", cost: 20, icon: "●", grad: "linear-gradient(135deg,#029CAF,#0096FF)", info: "AI voice interview · ~3 min per skill · Job-specific scenarios validate any technical skill or spoken language, with a CEFR certificate." },
];

/* ============ PRICING (public direct-sales grid, base column: 36 months) ============ */
const PRICE = [[5000,3500],[7500,4900],[10000,6000],[12500,7100],[15000,8200],[17500,9200],[20000,10200],[25000,12100],[30000,13950],[35000,15700],[40000,17400],[45000,19050],[50000,20650],[75000,26500],[100000,33200],[125000,39500],[150000,45500],[175000,51200],[200000,56500],[225000,61650],[250000,66700],[275000,71600],[300000,76350],[325000,81050],[350000,85650],[375000,90150],[400000,94550],[425000,98900],[450000,103200],[475000,107450],[500000,111600]];
const DUR = { 12: 0.2, 24: 0.1, 36: 0, 48: -0.1 };
const SIZE = { "<250": 0, "250-1000": 0.25, ">1000": 0.5 };
const PARTNER_SIZE = "250-1000"; // channel grid: partners buy on the 250–1,000-employee column (+25%), all order types
const DISC = { reseller: [30, 35, 40], distributor: [40, 45, 50] };
const TIER_NAMES = ["Core", "Premier", "Elite"];
const tierFor = (tk) => { let t = PRICE[0]; for (const p of PRICE) if (p[0] <= tk) t = p; return t; };
const basePrice = (tk) => { const [tt, b] = tierFor(Math.max(tk, PRICE[0][0])); return b * (tk / tt); };
const publicPrice = (tk, months = 12, size = "<250") => basePrice(tk) * (1 + SIZE[size]) * (1 + (DUR[months] ?? 0));
const partnerPrice = (tk, months, disc) => publicPrice(tk, months, PARTNER_SIZE) * (1 - disc / 100);
const CUR = { EUR: { s: "€", r: 1 }, USD: { s: "$", r: 1.2 }, GBP: { s: "£", r: 0.9 } };
const fmtN = (n) => Math.round(n).toLocaleString("en-US");

/* ============ SHARED UI ============ */
const AF_MARK = "data:image/png;base64,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";
const AfMark = ({ size = 22 }) => <img src={AF_MARK} alt="AssessFirst" style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }} />;
const AfLogo = ({ size = 15 }) => (
  <span style={{ fontFamily: AF.font, fontWeight: 700, fontSize: size, color: AF.black, letterSpacing: "-0.02em", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6 }}><AfMark size={size * 1.15} />AssessFirst</span>
);
const AfCta = ({ children, onClick, small, disabled, href }) => {
  const st = { background: disabled ? "#F8B9D6" : AF.pink, color: "#fff", fontFamily: AF.font, fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.06em", border: "none", borderRadius: 8, padding: small ? "8px 18px" : "12px 26px", fontSize: small ? 11 : 13, cursor: disabled ? "default" : "pointer", textDecoration: "none", display: "inline-block" };
  return href ? <a href={href} target="_blank" rel="noreferrer" style={st}>{children}</a> : <button onClick={disabled ? undefined : onClick} style={st}>{children}</button>;
};
const GhostBtn = ({ children, onClick, small }) => (
  <button onClick={onClick} style={{ background: "#fff", border: `1px solid ${AF.border}`, color: AF.black, borderRadius: 8, padding: small ? "7px 14px" : "11px 22px", fontFamily: AF.font, fontSize: small ? 11 : 12, textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer" }}>{children}</button>
);
const Chip = ({ children, on, onClick }) => (
  <span onClick={onClick} style={{ fontSize: 11, fontWeight: 500, borderRadius: 14, padding: "5px 11px", cursor: onClick ? "pointer" : "default", background: on ? "#FFF5FA" : AF.grayLight, color: on ? AF.pink : AF.grayMid, border: on ? `1.5px solid ${AF.pink}` : "1.5px solid transparent", display: "inline-block" }}>{children}</span>
);
const Check = ({ size = 18 }) => <span style={{ display: "inline-flex", width: size, height: size, borderRadius: "50%", background: "#12B76A", color: "#fff", alignItems: "center", justifyContent: "center", fontSize: size * 0.6, fontWeight: 700, flexShrink: 0 }}>✓</span>;
const Frame = ({ children, dark, gray }) => (
  <div style={{ background: dark ? AF.black : gray ? AF.grayLight : "#fff", border: dark || gray ? "none" : `1px solid ${AF.border}`, borderRadius: 12, minHeight: 500, padding: "34px 38px", fontFamily: AF.font, boxSizing: "border-box" }}>{children}</div>
);
const Bar = () => <div style={{ height: 4, width: 120, background: AF.gradient, borderRadius: 2, marginBottom: 18 }} />;
const H2 = ({ children, dark }) => <h2 style={{ fontSize: 23, fontWeight: 700, color: dark ? "#fff" : AF.black, letterSpacing: "-0.02em", margin: "0 0 8px" }}>{children}</h2>;
const P = ({ children, dark, max = 680 }) => <p style={{ fontSize: 12.5, color: dark ? "#B9B9BC" : AF.grayMid, margin: "0 0 18px", maxWidth: max, lineHeight: 1.6 }}>{children}</p>;
const Kicker = ({ children }) => <div style={{ fontSize: 10.5, fontWeight: 700, color: AF.grayMid, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>{children}</div>;
const LangSwitch = ({ lang, setLang }) => (
  <div style={{ display: "inline-flex", border: `1px solid ${AF.border}`, borderRadius: 8, overflow: "hidden" }}>
    {["en", "fr"].map((k) => <span key={k} onClick={() => setLang(k)} style={{ padding: "4px 11px", fontSize: 10.5, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", background: lang === k ? AF.black : "#fff", color: lang === k ? "#fff" : AF.grayMid }}>{k}</span>)}
  </div>
);
const CurSwitch = ({ cur, setCur }) => (
  <div style={{ display: "inline-flex", border: `1px solid ${AF.border}`, borderRadius: 9, overflow: "hidden" }}>
    {Object.keys(CUR).map((k) => <span key={k} onClick={() => setCur(k)} style={{ padding: "6px 13px", fontSize: 11, fontWeight: 700, cursor: "pointer", background: cur === k ? AF.pink : "#fff", color: cur === k ? "#fff" : AF.grayMid }}>{k}</span>)}
  </div>
);
const Slider = ({ label, value, onChange, min, max, step = 1, suffix = "" }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 4 }}><span style={{ color: AF.grayMid }}>{label}</span><b style={{ color: AF.black }}>{value.toLocaleString("en-US")}{suffix}</b></div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: AF.pink }} />
  </div>
);
const Seg = ({ options, value, onChange }) => (
  <div style={{ display: "inline-flex", border: `1px solid ${AF.border}`, borderRadius: 9, overflow: "hidden" }}>
    {options.map(([v, l]) => <span key={v} onClick={() => onChange(v)} style={{ padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", background: value === v ? AF.black : "#fff", color: value === v ? "#fff" : AF.grayMid }}>{l}</span>)}
  </div>
);
const PROD_FR = {
  CVS: ["Analyse de CV", "Analyse automatique · 1 min · Extrait compétences, expériences et formation de chaque CV et classe les candidatures par rapport au poste."],
  SCAN: ["Préqualification IA", "Agent vocal IA · 5 min · Appelle les candidats et valide les critères clés du poste — expérience, salaire, disponibilité, mobilité — avec un score d'adéquation immédiat."],
  SWIPE: ["Personnalité", "Questionnaire visuel · 5 min · Mesure 20 traits de personnalité (Big Five) — comment une personne travaille, collabore et progresse."],
  DRIVE: ["Motivations", "Énoncés par paires · 8 min · Mesure 20 leviers de motivation — ce qui entretient l'engagement. Un prédicteur de la fidélisation."],
  BRAIN: ["Raisonnement", "Test adaptatif · 8 min · S'ajuste au candidat en temps réel. Évalue le raisonnement, la résolution de problèmes et l'agilité d'apprentissage."],
  VOICE: ["Compétences & langues", "Entretien vocal IA · ~3 min par compétence · Des mises en situation propres au poste valident toute compétence technique ou langue parlée, avec un certificat CECR."],
};
const prodTxt = (p, lang) => lang === "fr" ? { short: PROD_FR[p.id][0], info: PROD_FR[p.id][1] } : { short: p.short, info: p.info };
const ProductTile = ({ p, big, lang = "en" }) => {
  const [hover, setHover] = useState(false);
  const tx = prodTxt(p, lang);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ position: "relative", background: AF.grayLight, borderRadius: 10, padding: big ? 16 : 12, minHeight: big ? 96 : 64 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: big ? 42 : 34, height: big ? 42 : 34, borderRadius: 9, background: p.grad, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: big ? 18 : 15, color: "#fff", flexShrink: 0 }}>{p.icon}</span>
        <div><div style={{ fontSize: big ? 15 : 13, fontWeight: 700, color: AF.black }}>{p.label}</div><div style={{ fontSize: big ? 11 : 10, color: AF.grayMid }}>{tx.short}</div></div>
        <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: AF.pink, whiteSpace: "nowrap" }}>{p.cost} tk</span>
      </div>
      {big && <div style={{ fontSize: 11, color: AF.grayMid, lineHeight: 1.45, marginTop: 10 }}>{tx.info.split(" · ").slice(2).join(" ")}</div>}
      {hover && <div style={{ position: "absolute", zIndex: 5, inset: 0, background: "rgba(29,29,31,0.96)", color: "#fff", borderRadius: 10, padding: "10px 14px", fontSize: 11, lineHeight: 1.5, display: "flex", alignItems: "center" }}>{tx.info}</div>}
    </div>
  );
};

/* ============ I18N (narrative layer) ============ */
const L = {
en: {
  nav: { back: "← Back", next: "Next →", restart: "Restart", intro: "Introduction", act: "Act" },
  hdr: { title: "partner journey", sub: "How you resell and deploy predictive assessment across your own clients — from programme to margin.",
    acts: { 0: "Welcome", 1: "Why now", 2: "Your programme", 3: "What you sell", 4: "Your back-office", 5: "How you buy", 6: "Estimate your opportunity", 7: "Your first 90 days" } },
  profiles: [["rpo", "RPO & staffing", "Volume hiring, pre-qualification, quality of hire"], ["recruit", "Recruitment firm", "Shortlists, time-to-hire, candidate experience"], ["consult", "HR consulting", "Assessment centres, mobility, development"]],
  welcome: {
    h: "Add a talent intelligence layer to everything you deliver for your clients.",
    p: "AssessFirst helps organisations understand people at work and make better decisions. Behavioural science and AI build a complete picture of each person — personality, motivations, reasoning, skills, languages, job fit. As a partner, you deploy it across your own clients, run it from your own back-office and turn it into a recurring revenue line.",
    pickT: "Choose your profile", pickSub: "The journey is the same for everyone; your choice adapts the use cases in “Why now”, the client data in the back-office demo and the default assumptions of the simulator.",
    chapters: [["Why now", "The HR market shifts, what your clients see — and why partners who own clients win."], ["Your programme", "Reseller or Distributor: who does what, tiers, discounts and market development funds."], ["What you sell", "Six tools, one token. Your margin: token resale plus your own services."], ["Your back-office", "Deployer: order, create client accounts, allocate, track, renew — without waiting for us."], ["How you buy", "Per-client order or Credit Pool, two clocks, the public price grid."], ["Your opportunity", "A margin simulator built on your portfolio and your project mix."], ["Your first 90 days", "From contract to first client — and how to book a call."]],
    start: "Start the journey →", skip: "Skip to the simulator →",
  },
  why: {
    h: "The HR market is changing. Your clients are feeling it.",
    cols: [["What's happening", [["CVs have real limits", "Less than 15% predictive validity, yet most decisions still rely on them."], ["Mistakes are expensive", "A bad hire costs ~1.5× annual salary; a failed promotion costs a team."], ["Regulation is tightening", "The EU AI Act requires transparency and fairness in AI-based decisions."]]],
      ["The AssessFirst approach", [["Understand the whole person", "Personality, motivations, reasoning, skills and languages — one profile, six tools."], ["AI where it saves time", "SCAN and VOICE automate pre-qualification and skills interviews."], ["Built for compliance", "Auditable models, bias-tested, GDPR-ready, aligned with the EU AI Act."]]],
      ["What clients see", [["-30%", "hiring mistakes within 6 months"], ["+25%", "performance on key roles within 12 months"], ["4.9/5", "candidate & employee experience · 2,700+ Google reviews"], ["39", "languages · 3,500+ clients in 40+ countries"]]]],
    h2: "Partners who already own clients win.",
    p2: "We built this programme for firms that already have the trust of HR leaders. No cold prospecting required: you add AssessFirst to what you already deliver.",
    use: {
      rpo: [["Pre-qualification at scale", "SCAN calls every applicant and validates the key criteria — your recruiters only handle qualified profiles."], ["Volume hiring, secured", "SWIPE, DRIVE and BRAIN on every shortlist: objective fit, fewer early departures."], ["Prove quality of hire", "Consumption and fit data per client — the KPI your account managers need in reviews."]],
      recruit: [["Sharper shortlists", "Objective data on personality, motivation and reasoning, before the client interview."], ["Faster time-to-hire", "Pre-qualification and skills interviews run without a recruiter on the line."], ["A candidate experience clients remember", "Every candidate receives their own profile — a signature of your firm."]],
      consult: [["Assessment centres, scaled", "The same scientific backbone for every candidate, in 39 languages, in days rather than weeks."], ["Internal mobility & development", "Match people to target roles; feed reviews, coaching and career conversations."], ["Leadership & outplacement", "Complete profiles as the starting point of every individual programme."]],
    },
    pts: [["Sell to your existing base", "An immediate add-on to your services, not a new sales motion."], ["You set the resale price", "Buy at partner price, resell at yours — and bill your services around it."], ["No competition on your accounts", "You own the relationship. Our team supports you and never sells around you."]],
  },
  prog: {
    h: "Reseller or Distributor — pick your programme",
    p: "Two programmes, one back-office. The difference is who onboards and supports your clients — and therefore your discount level.",
    cards: { reseller: ["Reseller", "You sell and renew. AssessFirst trains and onboards your clients.", "Recruitment firms, HR consultancies", "30 → 40 % off the public grid"], distributor: ["Distributor", "You own the full client lifecycle: sale, onboarding, training, level-1 support.", "RPOs, HR service groups, country distributors", "40 → 50 % off the public grid"] },
    compareT: "Who does what", rows: ["Lead generation, demo, closing", "Renewals & upsell", "Client onboarding & training", "Customer success", "Level-1 support (functional)", "Level-2 support (technical)", "Client accounts, allocation, renewals", "Billing", "Discount on public grid"],
    m: { reseller: ["You", "You", "AssessFirst", "AssessFirst", "Shared", "AssessFirst", "You — in your back-office", "AssessFirst invoices you; you invoice your client", "30–40 % by tier"], distributor: ["You", "You", "You", "You", "You", "AssessFirst", "You — in your back-office", "AssessFirst invoices you; you invoice your client", "40–50 % by tier"] },
    you: "You", af: "AssessFirst", shared: "Shared",
    tH: "Tiers & market development funds", tP: "Three tiers reward the recurring revenue you manage across your portfolio (managed ARR, reviewed annually). Higher tier, higher discount — plus market development funds to co-finance events, webinars, content and local campaigns (approved activities, 50% co-investment).",
    tCols: ["Tier", "Managed ARR", "Discount", "MDF / year"],
    tiers: { reseller: [["Core", "New partner", "30 %", "—"], ["Premier", "150K", "35 %", "up to €2,500"], ["Elite", "300K", "40 %", "up to €5,000"]], distributor: [["Core", "New partner", "40 %", "—"], ["Premier", "250K", "45 %", "up to €7,500"], ["Elite", "500K", "50 %", "up to €15,000"]] },
    tNote: "Indicative programme structure — final terms are set in your partnership agreement.",
  },
  sell: {
    h: "Six tools. One token.", p: "Your clients buy an annual subscription with a number of tokens; every assessment consumes tokens. Hover a tool to see what it does.",
    note: "Each source enriches the others: combined, they give recruiters and managers a reliable, actionable view of every person. Every candidate or employee receives their own profile.",
    h2: "Your margin: tokens you resell, services you deliver.",
    p2: "You buy tokens at your partner price and resell an annual subscription at the price you decide. Around it, you sell what you know best — that second line is often the larger one.",
    tokT: "Token resale", tok: ["Partner price = public grid − your tier discount", "Resale price = yours, per client", "Renewals compound year after year"],
    servT: "Services you bill on top", serv: ["Setup & job-model configuration", "Recruiter & manager training", "Candidate and employee debriefs", "Assessment centres & mobility programmes", "Coaching, competency frameworks, change"],
    foot: "Figures come later, in the simulator — built on your own portfolio.",
  },
},
fr: {
  nav: { back: "← Retour", next: "Suivant →", restart: "Recommencer", intro: "Introduction", act: "Acte" },
  hdr: { title: "parcours partenaire", sub: "Comment vous revendez et déployez l'évaluation prédictive chez vos propres clients — du programme à la marge.",
    acts: { 0: "Bienvenue", 1: "Pourquoi maintenant", 2: "Votre programme", 3: "Ce que vous vendez", 4: "Votre back-office", 5: "Comment vous achetez", 6: "Estimez votre opportunité", 7: "Vos 90 premiers jours" } },
  profiles: [["rpo", "RPO & staffing", "Recrutement en volume, préqualification, qualité d'embauche"], ["recruit", "Cabinet de recrutement", "Shortlists, time-to-hire, expérience candidat"], ["consult", "Conseil RH", "Assessment centers, mobilité, développement"]],
  welcome: {
    h: "Ajoutez une couche d'intelligence des talents à toutes les prestations que vous délivrez à vos clients.",
    p: "AssessFirst aide les organisations à comprendre les personnes au travail et à prendre de meilleures décisions. Sciences comportementales et IA construisent une compréhension complète de chaque individu — personnalité, motivations, raisonnement, compétences, langues, adéquation au poste. En tant que partenaire, vous la déployez chez vos propres clients, la pilotez depuis votre back-office et en faites une ligne de revenus récurrents.",
    pickT: "Choisissez votre profil", pickSub: "Le parcours est le même pour tous ; votre choix adapte les cas d'usage de « Pourquoi maintenant », les données clients de la démo back-office et les hypothèses par défaut du simulateur.",
    chapters: [["Pourquoi maintenant", "Le marché RH bouge, ce que voient vos clients — et pourquoi les partenaires qui possèdent leurs clients gagnent."], ["Votre programme", "Revendeur ou Distributeur : qui fait quoi, tiers, remises et fonds de développement marché."], ["Ce que vous vendez", "Six outils, un token. Votre marge : revente des tokens plus vos propres services."], ["Votre back-office", "Deployer : commander, créer les comptes clients, allouer, suivre, renouveler — sans nous attendre."], ["Comment vous achetez", "Commande par client ou Credit Pool, deux horloges, la grille tarifaire publique."], ["Votre opportunité", "Un simulateur de marge construit sur votre portefeuille et votre mix de projets."], ["Vos 90 premiers jours", "Du contrat au premier client — et comment prendre rendez-vous."]],
    start: "Démarrer le parcours →", skip: "Aller au simulateur →",
  },
  why: {
    h: "Le marché RH change. Vos clients le ressentent.",
    cols: [["Ce qui se passe", [["Le CV a ses limites", "Moins de 15 % de validité prédictive, et pourtant la plupart des décisions s'appuient encore dessus."], ["Les erreurs coûtent cher", "Un mauvais recrutement coûte ~1,5× le salaire annuel ; une promotion ratée coûte une équipe."], ["La réglementation se durcit", "L'EU AI Act impose transparence et équité dans les décisions basées sur l'IA."]]],
      ["L'approche AssessFirst", [["Comprendre la personne entière", "Personnalité, motivations, raisonnement, compétences et langues — un profil, six outils."], ["L'IA là où elle fait gagner du temps", "SCAN et VOICE automatisent la préqualification et les entretiens de compétences."], ["Conçu pour la conformité", "Modèles auditables, testés anti-biais, RGPD-ready, alignés avec l'EU AI Act."]]],
      ["Ce que voient les clients", [["-30 %", "d'erreurs de recrutement dans les 6 mois"], ["+25 %", "de performance sur les postes clés dans les 12 mois"], ["4,9/5", "expérience candidats & collaborateurs · 2 700+ avis Google"], ["39", "langues · 3 500+ clients dans 40+ pays"]]]],
    h2: "Les partenaires qui ont déjà leurs clients gagnent.",
    p2: "Ce programme est conçu pour les cabinets qui ont déjà la confiance des directions RH. Aucune prospection à froid : vous ajoutez AssessFirst aux prestations que vous délivrez déjà.",
    use: {
      rpo: [["Préqualification à grande échelle", "SCAN appelle chaque candidat et valide les critères clés — vos recruteurs ne traitent que des profils qualifiés."], ["Recrutement en volume, sécurisé", "SWIPE, DRIVE et BRAIN sur chaque shortlist : adéquation objective, moins de départs précoces."], ["Prouvez la qualité des embauches", "Données de consommation et d'adéquation par client — le KPI qu'attendent vos account managers en revue."]],
      recruit: [["Des shortlists plus justes", "Des données objectives sur la personnalité, la motivation et le raisonnement, avant l'entretien client."], ["Un time-to-hire plus court", "Préqualification et entretiens de compétences sans recruteur au téléphone."], ["Une expérience candidat mémorable", "Chaque candidat reçoit son propre profil — une signature de votre cabinet."]],
      consult: [["Des assessment centers à l'échelle", "Le même socle scientifique pour chaque candidat, en 39 langues, en jours plutôt qu'en semaines."], ["Mobilité interne & développement", "Rapprochez les personnes des postes cibles ; alimentez revues, coaching et entretiens de carrière."], ["Leadership & outplacement", "Des profils complets comme point de départ de chaque programme individuel."]],
    },
    pts: [["Vendez à vos clients existants", "Un complément immédiat à vos prestations, pas un nouveau cycle de vente à construire."], ["Vous fixez le prix de revente", "Achetez au prix partenaire, revendez au vôtre — et facturez vos services autour."], ["Aucune concurrence sur vos comptes", "La relation client est la vôtre. Notre équipe vous appuie et ne vend jamais à votre place."]],
  },
  prog: {
    h: "Revendeur ou Distributeur — choisissez votre programme",
    p: "Deux programmes, un seul back-office. Ce qui change : qui prend en charge le démarrage et le support de vos clients — et donc votre niveau de remise.",
    cards: { reseller: ["Revendeur", "Vous vendez et renouvelez ; AssessFirst forme vos clients et les accompagne au démarrage.", "Cabinets de recrutement, cabinets de conseil RH", "30 → 40 % sur la grille publique"], distributor: ["Distributeur", "Vous prenez en charge tout le cycle client : vente, démarrage, formation, support de niveau 1.", "RPO, groupes de services RH, distributeurs pays", "40 → 50 % sur la grille publique"] },
    compareT: "Qui fait quoi", rows: ["Prospection, démo, signature", "Renouvellements & ventes additionnelles", "Démarrage & formation des clients", "Suivi de la satisfaction client", "Support de niveau 1 (fonctionnel)", "Support de niveau 2 (technique)", "Comptes clients, allocation, renouvellements", "Facturation", "Remise sur la grille publique"],
    m: { reseller: ["Vous", "Vous", "AssessFirst", "AssessFirst", "Partagé", "AssessFirst", "Vous — dans votre back-office", "AssessFirst vous facture ; vous facturez votre client", "30–40 % selon le tier"], distributor: ["Vous", "Vous", "Vous", "Vous", "Vous", "AssessFirst", "Vous — dans votre back-office", "AssessFirst vous facture ; vous facturez votre client", "40–50 % selon le tier"] },
    you: "Vous", af: "AssessFirst", shared: "Partagé",
    tH: "Tiers & fonds de développement marché", tP: "Trois tiers récompensent le revenu récurrent que vous gérez sur votre portefeuille (ARR géré, révisé chaque année). Plus le tier est élevé, plus la remise l'est — avec des fonds de développement marché pour cofinancer événements, webinaires, contenus et campagnes locales (activités approuvées, co-investissement 50 %).",
    tCols: ["Tier", "ARR géré", "Remise", "MDF / an"],
    tiers: { reseller: [["Core", "Nouveau partenaire", "30 %", "—"], ["Premier", "150K", "35 %", "jusqu'à 2 500 €"], ["Elite", "300K", "40 %", "jusqu'à 5 000 €"]], distributor: [["Core", "Nouveau partenaire", "40 %", "—"], ["Premier", "250K", "45 %", "jusqu'à 7 500 €"], ["Elite", "500K", "50 %", "jusqu'à 15 000 €"]] },
    tNote: "Structure de programme indicative — les conditions finales sont fixées dans votre contrat de partenariat.",
  },
  sell: {
    h: "Six outils. Un seul token.", p: "Vos clients souscrivent un abonnement annuel incluant un volume de tokens ; chaque évaluation en consomme. Survolez un outil pour en savoir plus.",
    note: "Chaque source enrichit les autres : combinées, elles donnent aux recruteurs et aux managers une vision fiable et actionnable de chaque personne. Chaque candidat ou collaborateur reçoit son propre profil.",
    h2: "Votre marge : les tokens que vous revendez et les services que vous facturez.",
    p2: "Vous achetez les tokens au prix partenaire et revendez un abonnement annuel au prix que vous décidez. Autour, vous vendez ce que vous savez faire — cette seconde ligne de revenus est souvent la plus importante.",
    tokT: "Revente des tokens", tok: ["Prix partenaire = grille publique − remise de votre tier", "Prix de revente = le vôtre, par client", "Les renouvellements se cumulent année après année"],
    servT: "Services facturés en plus", serv: ["Paramétrage & modèles de postes", "Formation des recruteurs et managers", "Restitutions candidats et collaborateurs", "Assessment centers & programmes de mobilité", "Coaching, référentiels de compétences, conduite du changement"],
    foot: "Les chiffres viennent plus tard, dans le simulateur — construit sur votre propre portefeuille.",
  },
},
};

/* ============ ACT 0 — WELCOME ============ */
const S_Welcome = ({ goto, lang, profile, setProfile, steps }) => {
  const T = L[lang].welcome;
  return (
    <Frame>
      <AfMark size={54} />
      <div style={{ height: 4, width: 120, background: AF.gradient, borderRadius: 2, margin: "16px 0" }} />
      <h2 style={{ fontSize: 26, fontWeight: 700, color: AF.black, letterSpacing: "-0.02em", margin: "0 0 10px", maxWidth: 680 }}>{T.h}</h2>
      <p style={{ fontSize: 13, color: AF.grayMid, lineHeight: 1.65, margin: "0 0 28px", maxWidth: 740 }}>{T.p}</p>
      <div style={{ borderTop: `1px solid ${AF.border}`, paddingTop: 22, marginBottom: 6 }}><Kicker>{T.pickT}</Kicker></div>
      <p style={{ fontSize: 11.5, color: AF.grayMid, lineHeight: 1.5, margin: "0 0 12px", maxWidth: 740 }}>{T.pickSub}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, maxWidth: 740, marginBottom: 28 }}>
        {L[lang].profiles.map(([id, t, d]) => { const on = profile === id; return (
          <div key={id} onClick={() => setProfile(id)} style={{ border: on ? `2px solid ${AF.pink}` : `1px solid ${AF.border}`, background: on ? "#FFF5FA" : "#fff", borderRadius: 12, padding: "12px 15px", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 15, height: 15, borderRadius: "50%", border: on ? `5px solid ${AF.pink}` : `2px solid ${AF.border}`, flexShrink: 0 }} /><b style={{ fontSize: 13.5, color: AF.black }}>{t}</b></div>
            <p style={{ fontSize: 10.5, color: AF.grayMid, margin: "6px 0 0 23px", lineHeight: 1.45 }}>{d}</p>
          </div>); })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8, marginBottom: 26 }}>
        {T.chapters.map(([t, d], k) => (
          <div key={t} onClick={() => goto(steps.findIndex((st) => st.act === k + 1))} style={{ border: `1px solid ${AF.border}`, borderRadius: 12, padding: 12, cursor: "pointer" }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: AF.pink, color: "#fff", fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>{k + 1}</span>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: AF.black, lineHeight: 1.3, marginBottom: 5 }}>{t}</div>
            <div style={{ fontSize: 9.5, color: AF.grayMid, lineHeight: 1.4 }}>{d}</div>
          </div>))}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <AfCta onClick={() => goto(1)}>{T.start}</AfCta>
        <span onClick={() => goto(steps.findIndex((st) => st.label === "Simulator"))} style={{ fontSize: 12, fontWeight: 600, color: AF.pink, cursor: "pointer" }}>{T.skip}</span>
      </div>
    </Frame>
  );
};

/* ============ ACT 1 — WHY NOW ============ */
const S_Market = ({ lang }) => {
  const T = L[lang].why;
  return (
    <Frame><Bar /><H2>{T.h}</H2><div style={{ height: 10 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {T.cols.map(([h, items], ci) => (
          <div key={h}>
            <div style={{ fontSize: 11, fontWeight: 700, color: ci === 1 ? AF.pink : AF.grayMid, textTransform: "uppercase", letterSpacing: "0.05em", paddingBottom: 8, borderBottom: `2px solid ${ci === 1 ? AF.pink : AF.border}`, marginBottom: 10 }}>{h}</div>
            {items.map(([a, b]) => (
              <div key={a} style={{ background: AF.grayLight, borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                <div style={{ fontSize: ci === 2 ? 24 : 13.5, fontWeight: 700, color: ci === 2 ? AF.pink : AF.black, marginBottom: 3 }}>{a}</div>
                <div style={{ fontSize: 11.5, color: AF.grayMid, lineHeight: 1.45 }}>{b}</div>
              </div>))}
          </div>))}
      </div>
    </Frame>
  );
};
const S_Own = ({ lang, profile, next }) => {
  const T = L[lang].why;
  return (
    <Frame><Bar /><H2>{T.h2}</H2><P>{T.p2}</P>
      <Kicker>{L[lang].profiles.find((p) => p[0] === profile)[1]}</Kicker>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {T.use[profile].map(([a, b]) => <div key={a} style={{ border: `1px solid ${AF.border}`, borderRadius: 12, padding: "14px 16px" }}><div style={{ fontSize: 14, fontWeight: 700, color: AF.black, marginBottom: 6 }}>{a}</div><div style={{ fontSize: 11.5, color: AF.grayMid, lineHeight: 1.5 }}>{b}</div></div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 22 }}>
        {T.pts.map(([a, b], k) => <div key={a} style={{ background: AF.grayLight, borderRadius: 12, padding: "14px 16px" }}><div style={{ fontSize: 11, color: AF.pink, fontWeight: 700, marginBottom: 6 }}>0{k + 1}</div><div style={{ fontSize: 14, fontWeight: 700, color: AF.black, marginBottom: 6 }}>{a}</div><div style={{ fontSize: 11.5, color: AF.grayMid, lineHeight: 1.5 }}>{b}</div></div>)}
      </div>
      <AfCta onClick={next}>{L[lang].hdr.acts[2]} →</AfCta>
    </Frame>
  );
};

/* ============ ACT 2 — YOUR PROGRAMME ============ */
const S_Programme = ({ lang, prog, setProg }) => {
  const T = L[lang].prog;
  const [open, setOpen] = useState(true);
  const col = (v) => v.startsWith(T.you) ? AF.pink : v.startsWith(T.af) ? "#0096FF" : AF.grayMid;
  return (
    <Frame><Bar /><H2>{T.h}</H2><P>{T.p}</P>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        {Object.entries(T.cards).map(([id, [n, d, who, disc]]) => { const on = prog === id; return (
          <div key={id} onClick={() => { setProg(id); setOpen(true); }} style={{ border: on ? `2px solid ${AF.pink}` : `1px solid ${AF.border}`, background: on ? "#FFF5FA" : "#fff", borderRadius: 12, padding: "16px 18px", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><b style={{ fontSize: 17, color: AF.black }}>{n}</b><span style={{ fontSize: 10.5, fontWeight: 700, color: AF.pink, background: "#fff", border: `1px solid ${AF.pink}`, borderRadius: 10, padding: "3px 9px" }}>{disc}</span></div>
            <div style={{ fontSize: 12.5, color: AF.black, lineHeight: 1.5, marginBottom: 6 }}>{d}</div><div style={{ fontSize: 11, color: AF.grayMid }}>{who}</div>
          </div>); })}
      </div>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "10px 14px", background: AF.grayLight, borderRadius: open ? "10px 10px 0 0" : 10 }}>
        <b style={{ fontSize: 12.5, color: AF.black }}>{T.compareT} — {T.cards[prog][0]}</b><span style={{ fontSize: 12, color: AF.grayMid }}>{open ? "▴" : "▾"}</span>
      </div>
      {open && <div style={{ border: `1px solid ${AF.border}`, borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
        {T.rows.map((r, i) => { const a = T.m.reseller[i], b = T.m.distributor[i]; return (
          <div key={r} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", columnGap: 24, padding: "9px 14px", borderTop: i ? `1px solid ${AF.border}` : "none", fontSize: 12, lineHeight: 1.4, alignItems: "center" }}>
            <span style={{ color: AF.grayMid }}>{r}</span>
            <span style={{ fontWeight: 600, color: col(a), opacity: prog === "reseller" ? 1 : 0.45 }}>{a}</span>
            <span style={{ fontWeight: 600, color: col(b), opacity: prog === "distributor" ? 1 : 0.45 }}>{b}</span>
          </div>); })}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", columnGap: 24, padding: "6px 14px", background: AF.grayLight, fontSize: 10, color: AF.grayMid, textTransform: "uppercase", letterSpacing: "0.05em" }}><span /><span>{T.cards.reseller[0]}</span><span>{T.cards.distributor[0]}</span></div>
      </div>}
    </Frame>
  );
};
const S_Tiers = ({ lang, prog }) => {
  const T = L[lang].prog;
  return (
    <Frame><Bar /><H2>{T.tH}</H2><P>{T.tP}</P>
      <Kicker>{T.cards[prog][0]}</Kicker>
      <div style={{ border: `1px solid ${AF.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr 1.2fr", background: AF.grayLight, padding: "10px 16px", fontSize: 10, fontWeight: 700, color: AF.grayMid, textTransform: "uppercase", letterSpacing: "0.05em" }}>{T.tCols.map((c) => <span key={c}>{c}</span>)}</div>
        {T.tiers[prog].map(([a, b, c, d], i) => (
          <div key={a} style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr 1.2fr", padding: "14px 16px", borderTop: `1px solid ${AF.border}`, fontSize: 13, alignItems: "center", background: i === 2 ? "#FFF5FA" : "#fff" }}>
            <b style={{ color: i === 2 ? AF.pink : AF.black }}>{a}</b><span>{b}</span><b style={{ fontSize: 16, color: AF.pink }}>{c}</b><span style={{ color: AF.grayMid }}>{d}</span>
          </div>))}
      </div>
      <p style={{ fontSize: 10.5, color: "#98A2AE", margin: 0 }}>{T.tNote}</p>
    </Frame>
  );
};

/* ============ ACT 3 — WHAT YOU SELL ============ */
const S_Products = ({ lang }) => {
  const T = L[lang].sell;
  return (
    <Frame><Bar /><H2>{T.h}</H2><P>{T.p}</P>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>{PRODUCTS.map((p) => <ProductTile key={p.id} p={p} big lang={lang} />)}</div>
      <p style={{ fontSize: 11.5, color: AF.grayMid, lineHeight: 1.55, margin: 0, maxWidth: 760 }}>{T.note}</p>
    </Frame>
  );
};
const S_Margin = ({ lang }) => {
  const T = L[lang].sell;
  return (
    <Frame><Bar /><H2>{T.h2}</H2><P>{T.p2}</P>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 14, alignItems: "stretch", marginBottom: 16 }}>
        <div style={{ border: `2px solid ${AF.pink}`, borderRadius: 12, padding: "18px 20px", background: "#FFF5FA" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: AF.pink, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{T.tokT}</div>
          {T.tok.map((t) => <div key={t} style={{ display: "flex", gap: 8, fontSize: 12.5, color: AF.black, marginBottom: 8, lineHeight: 1.45 }}><Check size={15} />{t}</div>)}
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 28, color: AF.grayMid }}>+</div>
        <div style={{ border: `1px solid ${AF.border}`, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: AF.grayMid, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{T.servT}</div>
          {T.serv.map((t) => <div key={t} style={{ display: "flex", gap: 8, fontSize: 12.5, color: AF.black, marginBottom: 8, lineHeight: 1.45 }}><span style={{ color: AF.pink }}>·</span>{t}</div>)}
        </div>
      </div>
      <p style={{ fontSize: 11, color: "#98A2AE", margin: 0 }}>{T.foot}</p>
    </Frame>
  );
};

/* ============ ACT 4 — BACK-OFFICE "DEPLOYER" (product vision, English UI) ============ */
const BO_INTRO = {
  en: { h: "Deployer — run your AssessFirst business without waiting for us", p: "Order, create client accounts, allocate tokens, follow consumption, renew. This is the partner back-office we are building — the demo below is interactive.", spec: "Product spec" },
  fr: { h: "Deployer — pilotez votre activité AssessFirst sans nous attendre", p: "Commander, créer les comptes clients, allouer les tokens, suivre la consommation, renouveler. C'est le back-office partenaire que nous construisons — la démo ci-dessous est interactive.", spec: "Spécification produit" },
};
const SEED_BY_PROFILE = {
  rpo: [["Nordwind Retail", "FR", 20000, 14200, "2026-01-12", 9, "", 4200], ["Bergmann Logistics", "DE", 15000, 11800, "2025-11-20", 7, "Regional partner", 6500], ["Kestrel Contact Centres", "UK", 12500, 5100, "2026-05-02", 5, "", 1800], ["Altura Hospitality", "ES", 7500, 6900, "2025-10-15", 4, "", 950], ["Cielo Fintech", "IT", 10000, 3200, "2026-07-01", 6, "Regional partner", 2400]],
  recruit: [["Maison Verdier", "FR", 5000, 3100, "2026-02-03", 3, "", 180], ["Orbis Consulting", "BE", 2500, 2300, "2025-10-20", 2, "", 240], ["Helix Biotech", "CH", 7500, 2600, "2026-06-15", 4, "", 420], ["Northgate Real Estate", "UK", 1000, 400, "2026-08-01", 1, "", 60], ["Solano Energy", "ES", 5000, 1200, "2026-08-20", 3, "", 700]],
  consult: [["Groupe Amarante", "FR", 10000, 6400, "2026-01-20", 5, "", 3200], ["Steinberg Industries", "DE", 7500, 7100, "2025-11-05", 4, "", 2100], ["Lumen Insurance", "NL", 5000, 1900, "2026-05-12", 3, "", 1500], ["Vantage Public Sector", "UK", 12500, 4300, "2026-04-01", 6, "Regional partner", 3800], ["Aurora Pharma", "IT", 5000, 800, "2026-08-25", 2, "", 900]],
};
const POOL = { total: 100000, start: "2026-01-01", end: "2026-12-31" };
const addYear = (d) => { const x = new Date(d); x.setFullYear(x.getFullYear() + 1); return x.toISOString().slice(0, 10); };
const daysTo = (d) => Math.round((new Date(d) - new Date("2026-09-22")) / 86400000);
const MIX = [0.06, 0.24, 0.3, 0.14, 0.14, 0.12];
const PCOL = ["#757575", "#0096FF", "#FF2F92", "#FFA800", "#029CAF", "#7C3AED"];
const SPEC = {
  Overview: { story: "As a partner admin, I see my pool, my alerts and what to do next in one screen.", rules: ["Pool clock starts at AssessFirst invoice date; duration = partner commitment (12 by default, 24/36 possible)", "Unallocated tokens expire at pool end", "Alerts: client at 80% / 100% of allocation, renewal due in 30 days, pool ends in 60 days, pool 90% allocated"], data: ["pool_id, tokens_total, allocated, consumed, start, end, commitment_months, tier, discount"], rights: ["Reseller: read + order", "Distributor: read + order + top-up"], out: ["Multiple concurrent pools", "Auto-renewal"] },
  Clients: { story: "As a partner admin, I list every client company with allocation, consumption, dates and attribution.", rules: ["'Sourced by' = free attribution field (sub-partner) — no platform access for the sourcing party", "Renewal date = allocation date + 12 months", "Declared headcount captured at creation, visible to AssessFirst"], data: ["company_id, name, country, headcount_band, tokens_allocated, consumed, start, renewal, users_count, sourced_by, health"], rights: ["Both: read, filter, export"], out: ["Sub-partner logins"] },
  "Create client": { story: "As a partner admin, I create a client company and allocate tokens from my pool in one step — or order tokens for that client.", rules: ["Allocation creates a 12-month client subscription from allocation date, independent of pool end", "Allocated tokens leave the pool and cannot expire with it", "No minimum allocation", "Per-client order: priced on public grid × commitment − discount; AssessFirst invoices, tokens credited on payment"], data: ["company (name, country, headcount_band, admin_email), allocation (tokens, date), subscription (start, end)"], rights: ["Reseller: create + order for client", "Distributor: create + allocate from pool + order"], out: ["Custom subscription lengths"] },
  "Users & renewals": { story: "As a partner admin, I manage my clients' users, renew subscriptions and return unused tokens to my pool.", rules: ["Reallocation returns unused tokens to the pool (never client-to-client directly)", "Renewal = new 12-month period from current end date, new allocation", "Roles: admin / recruiter / viewer", "Renewal reminders to partner at D-60 / D-30"], data: ["user_id, email, role, company_id, last_login, invited_by"], rights: ["Both: manage users, renew", "Distributor: reallocate"], out: ["SSO per client", "Bulk import"] },
  Consumption: { story: "As a partner admin, I follow consumption per client and per product to anticipate renewals and upsell.", rules: ["Token weights: CVS 5, SCAN 10, SWIPE/DRIVE/BRAIN/VOICE 20", "Monthly aggregation, 24-month history", "Export CSV"], data: ["consumption events (company_id, product, tokens, date)"], rights: ["Both: read + export"], out: ["Candidate-level data (GDPR: stays in client workspace)"] },
  Orders: { story: "As a partner admin, I see every order, invoice and its status, and I download invoices myself.", rules: ["Order types: pool, top-up, per-client", "Statuses: pending, invoiced, paid, credited", "Tokens credited on payment (or on PO acceptance for approved partners)"], data: ["order_id, type, tokens, amount, currency, commitment, status, company_id (per-client), invoice_pdf"], rights: ["Both: read, download", "Admin role: place orders"], out: ["Online card payment v1"] },
  Team: { story: "As a partner admin, I manage my own team's access to the back-office.", rules: ["Roles: admin (orders, allocation), manager (clients, users), consultant (delegated access to assigned clients only)", "Every action logged with user identity (audit log)"], data: ["partner_user_id, email, role, assigned_companies, last_login; audit_log"], rights: ["Admin only"], out: ["SSO / SCIM"] },
  "Client workspace": { story: "As a partner consultant, I open a client's AssessFirst account with delegated access to configure campaigns and read results.", rules: ["Delegation granted by client admin at creation (checkbox) — revocable anytime", "Every action logged with partner user identity", "Scoped to assigned companies"], data: ["delegation (partner_user_id, company_id, granted_at, revoked_at)"], rights: ["Distributor: default on", "Reseller: on client consent"], out: ["Impersonation of individual client users"] },
};
const TABS_ALL = ["Overview", "Clients", "Create client", "Users & renewals", "Consumption", "Orders", "Team", "Client workspace"];
const TABS = TABS_ALL;
const BoBtn = ({ children, onClick, primary }) => <button onClick={onClick} style={{ background: primary ? AF.pink : "#fff", color: primary ? "#fff" : AF.black, border: primary ? "none" : `1px solid ${AF.border}`, borderRadius: 7, padding: "7px 13px", fontSize: 11, fontWeight: 600, fontFamily: AF.font, cursor: "pointer", whiteSpace: "nowrap" }}>{children}</button>;
const Kpi = ({ t, v, s }) => <div style={{ background: "#fff", border: `1px solid ${AF.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10, fontWeight: 700, color: AF.grayMid, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t}</div><div style={{ fontSize: 20, fontWeight: 800, color: AF.black, margin: "3px 0 1px" }}>{v}</div>{s && <div style={{ fontSize: 10, color: AF.grayMid }}>{s}</div>}</div>;
const Input = (props) => <input {...props} style={{ width: "100%", padding: "8px 10px", border: `1px solid ${AF.border}`, borderRadius: 7, fontFamily: AF.font, fontSize: 12, color: AF.black, boxSizing: "border-box", ...props.style }} />;

const S_BackOffice = ({ lang, profile, prog, internal }) => {
  const T = BO_INTRO[lang];
  const [tab, setTab] = useState(0);
  const [clients, setClients] = useState(() => SEED_BY_PROFILE[profile].map(([n, c, a, u, s, users, by, m]) => ({ n, c, a, u, s, users, by, m, hc: "<250" })));
  const [sel, setSel] = useState(0);
  const [ws, setWs] = useState(null);
  const [msg, setMsg] = useState("");
  const [topup, setTopup] = useState(0);
  const [orders, setOrders] = useState([{ id: "PO-2026-001", type: "Credit Pool · 12 months", tk: 100000, amt: partnerPrice(100000, 12, DISC[prog][0]), st: "Paid", d: "2026-01-01" }, { id: "PO-2026-014", type: "Per-client order · Bergmann", tk: 15000, amt: partnerPrice(15000, 24, DISC[prog][0]), st: "Paid", d: "2025-11-20" }]);
  const [form, setForm] = useState({ n: "", c: "", e: "", hc: "<250", tk: 5000, by: "", mode: "pool", months: 12 });
  const [team, setTeam] = useState([["you@yourfirm.com", "Admin", "All clients"], ["m.dupont@yourfirm.com", "Manager", "All clients"], ["a.rossi@yourfirm.com", "Consultant", "2 assigned"]]);
  const allocated = clients.reduce((s, c) => s + c.a, 0), consumed = clients.reduce((s, c) => s + c.u, 0);
  const total = POOL.total + topup, free = total - allocated;
  const disc = DISC[prog][0];
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3500); };
  const alerts = [
    ...clients.filter((c) => c.u / c.a >= 0.8).map((c) => ({ k: "warn", t: `${c.n} has used ${Math.round(c.u / c.a * 100)}% of its allocation — propose a renewal or a top-up.` })),
    ...clients.filter((c) => daysTo(addYear(c.s)) <= 60).map((c) => ({ k: "info", t: `${c.n} renews in ${daysTo(addYear(c.s))} days (${addYear(c.s)}).` })),
    { k: daysTo(POOL.end) <= 100 ? "warn" : "info", t: `Your pool ends in ${daysTo(POOL.end)} days — ${fmtN(free)} tokens are still unallocated.` },
  ];
  const Spec = () => { const s = SPEC[TABS[tab]]; return internal ? (
    <div style={{ background: AF.black, color: "#fff", borderRadius: 12, padding: 16, fontSize: 11, lineHeight: 1.5, alignSelf: "start" }}>
      <div style={{ color: "#FFA800", fontWeight: 700, marginBottom: 8, fontSize: 11 }}>{T.spec} · {TABS[tab]}</div>
      {[["User story", s.story], ["Business rules", s.rules], ["Data", s.data], ["Rights", s.rights], ["Out of scope v1", s.out]].map(([k, v]) => <div key={k} style={{ marginBottom: 8 }}><div style={{ color: "#9A9A9E", fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</div>{Array.isArray(v) ? v.map((x) => <div key={x}>· {x}</div>) : <div>{v}</div>}</div>)}
    </div>) : null; };
  const grid = "1.5fr .45fr .7fr .8fr .85fr .85fr .5fr .9fr";
  const Health = ({ c }) => { const r = c.u / c.a; const col = r >= 0.8 ? AF.pink : r >= 0.4 ? "#0096FF" : "#12B76A"; return <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 54, height: 6, background: AF.grayLight, borderRadius: 3, overflow: "hidden", display: "inline-block" }}><span style={{ display: "block", width: `${Math.min(100, r * 100)}%`, height: 6, background: col }} /></span>{fmtN(c.u)}</span>; };
  let body;
  const panel = { background: "#fff", borderRadius: 10, padding: 18, minHeight: 360 };
  if (ws !== null) body = (<div style={{ ...panel, border: `2px solid ${AF.pink}` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><span style={{ fontSize: 12 }}>Delegated access · <b>{clients[ws].n}</b> · every action is logged</span><BoBtn onClick={() => setWs(null)}>← Back to Deployer</BoBtn></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 12 }}>{[["Campaigns", 7], ["Candidates", 312], ["Job models", 5], ["Reports", 148]].map(([k, v]) => <Kpi key={k} t={k} v={v} />)}</div>
    <div style={{ background: AF.grayLight, borderRadius: 10, height: 150, display: "flex", alignItems: "center", justifyContent: "center", color: AF.grayMid, fontSize: 12, gap: 8 }}><AfLogo size={13} /> client workspace — campaigns, predictive models, results</div>
  </div>);
  else if (tab === 0) body = (<div style={panel}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}><Kpi t="Unallocated tokens" v={fmtN(free)} s={`of ${fmtN(total)} in pool`} /><Kpi t="Allocated to clients" v={fmtN(allocated)} s={`${clients.length} client accounts`} /><Kpi t="Consumed by clients" v={fmtN(consumed)} s={`${Math.round(consumed / allocated * 100)}% of allocated`} /><Kpi t="Pool ends" v={POOL.end} s={`${daysTo(POOL.end)} days left · tier ${TIER_NAMES[0]} · ${disc}%`} /></div>
    <div style={{ height: 12, background: AF.grayLight, borderRadius: 6, marginTop: 14, overflow: "hidden", display: "flex" }}><div style={{ width: `${consumed / total * 100}%`, background: AF.black }} /><div style={{ width: `${(allocated - consumed) / total * 100}%`, background: "#0096FF" }} /></div>
    <div style={{ fontSize: 10, color: AF.grayMid, marginTop: 4 }}>■ consumed · <span style={{ color: "#0096FF" }}>■</span> allocated, not yet consumed · unallocated</div>
    <div style={{ fontSize: 10.5, fontWeight: 700, color: AF.grayMid, textTransform: "uppercase", letterSpacing: "0.05em", margin: "16px 0 8px" }}>Alerts & next actions</div>
    {alerts.map((a, k) => <div key={k} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12, padding: "8px 12px", borderRadius: 8, background: a.k === "warn" ? "#FFF5FA" : AF.grayLight, border: a.k === "warn" ? `1px solid ${AF.pink}` : "none", marginBottom: 6 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: a.k === "warn" ? AF.pink : "#0096FF", flexShrink: 0 }} />{a.t}</div>)}
    <div style={{ display: "flex", gap: 8, marginTop: 14 }}><BoBtn primary onClick={() => { setTopup(topup + 50000); setOrders([{ id: `PO-2026-0${orders.length + 20}`, type: "Top-up · 12 months", tk: 50000, amt: partnerPrice(150000, 12, disc) - partnerPrice(100000, 12, disc), st: "Pending", d: "2026-09-22" }, ...orders]); flash("Top-up of 50,000 tokens ordered at your current volume tier — invoice pending."); }}>Top up pool</BoBtn><BoBtn onClick={() => { setTab(2); setForm({ ...form, mode: "order" }); }}>Order for a client</BoBtn><BoBtn onClick={() => setTab(1)}>See clients</BoBtn></div>
  </div>);
  else if (tab === 1) body = (<div style={{ ...panel, padding: 0, overflow: "hidden" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px 6px" }}><b style={{ fontSize: 13 }}>{clients.length} client accounts</b><div style={{ display: "flex", gap: 8 }}><BoBtn onClick={() => flash("clients.csv exported")}>Export</BoBtn><BoBtn primary onClick={() => setTab(2)}>+ Create client</BoBtn></div></div>
    <div style={{ display: "grid", gridTemplateColumns: grid, padding: "6px 16px", fontSize: 10, color: AF.grayMid, textTransform: "uppercase", letterSpacing: "0.04em" }}>{["Client", "Country", "Allocated", "Consumed", "Start", "Renewal", "Users", "Sourced by"].map((h) => <span key={h}>{h}</span>)}</div>
    {clients.map((c, i) => <div key={c.n + i} onClick={() => setSel(i)} style={{ display: "grid", gridTemplateColumns: grid, padding: "10px 16px", borderTop: `1px solid ${AF.border}`, fontSize: 12, cursor: "pointer", background: sel === i ? "#FFF5FA" : "#fff", alignItems: "center" }}><b>{c.n}</b><span>{c.c}</span><span>{fmtN(c.a)}</span><Health c={c} /><span>{c.s}</span><span style={{ color: daysTo(addYear(c.s)) <= 60 ? AF.pink : AF.black }}>{addYear(c.s)}</span><span>{c.users}</span><span style={{ color: AF.grayMid }}>{c.by || "You"}</span></div>)}
    <div style={{ padding: "10px 16px", fontSize: 10.5, color: "#98A2AE" }}>Click a client, then open “Users & renewals” or “Client workspace”.</div>
  </div>);
  else if (tab === 2) { const cost = form.mode === "order" ? partnerPrice(form.tk, form.months, disc) : 0; body = (<div style={panel}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><b style={{ fontSize: 15 }}>Create a client account</b><Seg value={form.mode} onChange={(v) => setForm({ ...form, mode: v })} options={[["pool", "Allocate from pool"], ["order", "Order for this client"]]} /></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
      <label style={{ fontSize: 11, color: AF.grayMid }}>Company name<Input value={form.n} onChange={(e) => setForm({ ...form, n: e.target.value })} placeholder="Acme Group" /></label>
      <label style={{ fontSize: 11, color: AF.grayMid }}>Country<Input value={form.c} onChange={(e) => setForm({ ...form, c: e.target.value })} placeholder="FR" /></label>
      <label style={{ fontSize: 11, color: AF.grayMid }}>Client admin email<Input value={form.e} onChange={(e) => setForm({ ...form, e: e.target.value })} placeholder="hr@acme.com" /></label>
      <label style={{ fontSize: 11, color: AF.grayMid }}>Declared headcount<div style={{ marginTop: 4 }}><Seg value={form.hc} onChange={(v) => setForm({ ...form, hc: v })} options={[["<250", "< 250"], ["250-1000", "250–1,000"], [">1000", "> 1,000"]]} /></div></label>
      <label style={{ fontSize: 11, color: AF.grayMid }}>Sourced by (optional)<Input value={form.by} onChange={(e) => setForm({ ...form, by: e.target.value })} placeholder="Sub-partner name" /></label>
      {form.mode === "order" && <label style={{ fontSize: 11, color: AF.grayMid }}>Client commitment<div style={{ marginTop: 4 }}><Seg value={form.months} onChange={(v) => setForm({ ...form, months: v })} options={[[12, "12 m"], [24, "24 m"], [36, "36 m"]]} /></div></label>}
    </div>
    <div style={{ marginTop: 12 }}><Slider label={form.mode === "pool" ? `Tokens to allocate (${fmtN(free)} available in pool)` : "Tokens to order for this client"} value={form.tk} onChange={(v) => setForm({ ...form, tk: v })} min={500} max={form.mode === "pool" ? Math.max(500, free) : 100000} step={500} suffix=" tk" /></div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: AF.grayLight, borderRadius: 8, padding: "10px 14px" }}>
      <span style={{ fontSize: 11.5, color: AF.grayMid }}>{form.mode === "pool" ? `Client subscription: 12 months from today, independent of your pool. Remaining in pool after allocation: ${fmtN(free - form.tk)} tk.` : `Public grid × ${form.months} months − ${disc}% partner discount = €${fmtN(cost)} · AssessFirst invoices you, tokens credited to this client on payment.`}</span>
      <BoBtn primary onClick={() => { if (!form.n) { flash("Give the company a name first."); return; } setClients([...clients, { n: form.n, c: form.c || "—", a: form.tk, u: 0, s: "2026-09-22", users: 1, by: form.by, m: 0, hc: form.hc }]); if (form.mode === "order") setOrders([{ id: `PO-2026-0${orders.length + 20}`, type: `Per-client order · ${form.n}`, tk: form.tk, amt: cost, st: "Pending", d: "2026-09-22" }, ...orders]); flash(`${form.n} created — 12-month subscription active, admin invited.`); setForm({ ...form, n: "", c: "", e: "", by: "" }); setTab(1); }}>{form.mode === "pool" ? "Create & allocate" : "Create & send order"}</BoBtn>
    </div>
  </div>); }
  else if (tab === 3) { const c = clients[sel]; body = (<div style={panel}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}><b style={{ fontSize: 15 }}>{c.n}</b><span style={{ fontSize: 11, color: AF.grayMid }}>{c.s} → {addYear(c.s)} · {fmtN(c.a - c.u)} tk left · declared {c.hc} employees</span></div>
    <div style={{ border: `1px solid ${AF.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr .8fr", padding: "6px 14px", background: AF.grayLight, fontSize: 10, color: AF.grayMid, textTransform: "uppercase" }}><span>User</span><span>Role</span><span>Last login</span><span /></div>
      {Array.from({ length: c.users }).map((_, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr .8fr", padding: "9px 14px", borderTop: `1px solid ${AF.border}`, fontSize: 12, alignItems: "center" }}><span>user{i + 1}@{c.n.split(" ")[0].toLowerCase()}.com</span><span style={{ color: AF.grayMid }}>{["Admin", "Recruiter", "Recruiter", "Viewer"][i % 4]}</span><span style={{ color: AF.grayMid }}>2026-09-{10 + (i % 12)}</span><span style={{ fontSize: 10.5, color: AF.pink, cursor: "pointer" }}>Edit</span></div>)}
    </div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <BoBtn onClick={() => { const cs = [...clients]; cs[sel] = { ...c, users: c.users + 1 }; setClients(cs); flash("Invitation sent."); }}>+ Add user</BoBtn>
      <BoBtn primary onClick={() => { const cs = [...clients]; cs[sel] = { ...c, s: addYear(c.s), a: c.a + 5000 }; setClients(cs); flash(`Renewed — new 12-month period from ${addYear(c.s)}, 5,000 tokens allocated.`); }}>Renew 12 months (+5,000 tk)</BoBtn>
      <BoBtn onClick={() => { const back = c.a - c.u; const cs = [...clients]; cs[sel] = { ...c, a: c.u }; setClients(cs); flash(`${fmtN(back)} unused tokens returned to your pool.`); }}>Return unused to pool</BoBtn>
      <BoBtn onClick={() => { setWs(sel); setTab(7); }}>Open client workspace</BoBtn>
    </div>
    <p style={{ fontSize: 10.5, color: "#98A2AE", margin: "12px 0 0" }}>Renewal reminders are sent to you at D-60 and D-30. Returned tokens go back to the pool, never directly to another client.</p>
  </div>); }
  else if (tab === 4) body = (<div style={panel}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><b style={{ fontSize: 15 }}>Consumption by client and product</b><BoBtn onClick={() => flash("consumption.csv exported")}>Export CSV</BoBtn></div>
    <div style={{ display: "flex", gap: 12, fontSize: 10.5, color: AF.grayMid, marginBottom: 8 }}>{PRODUCTS.map((p, i) => <span key={p.id}><span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 2, background: PCOL[i], marginRight: 4 }} />{p.id}</span>)}</div>
    {clients.map((c) => <div key={c.n} style={{ display: "grid", gridTemplateColumns: "1.3fr 3fr .8fr", gap: 10, alignItems: "center", marginBottom: 7, fontSize: 12 }}><span>{c.n}</span><div style={{ display: "flex", height: 16, borderRadius: 4, overflow: "hidden", background: AF.grayLight }}>{MIX.map((m, i) => <div key={i} style={{ width: `${c.u / 20000 * m * 100}%`, background: PCOL[i] }} />)}</div><span style={{ color: AF.grayMid, textAlign: "right" }}>{fmtN(c.u)} tk · {fmtN(c.u / 18)} tests</span></div>)}
    <div style={{ fontSize: 10.5, fontWeight: 700, color: AF.grayMid, textTransform: "uppercase", letterSpacing: "0.05em", margin: "16px 0 6px" }}>Monthly consumption (tokens)</div>
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 80 }}>{[4.2, 5.1, 6.3, 5.8, 7.4, 8.1, 7.9, 9.2, 8.6].map((v, i) => <div key={i} style={{ flex: 1, textAlign: "center" }}><div style={{ height: v * 7, background: i === 8 ? AF.pink : AF.black, borderRadius: "4px 4px 0 0" }} /><div style={{ fontSize: 9, color: AF.grayMid, marginTop: 3 }}>{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"][i]}</div></div>)}</div>
  </div>);
  else if (tab === 5) body = (<div style={{ ...panel, padding: 0, overflow: "hidden" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px 6px" }}><b style={{ fontSize: 13 }}>Orders & invoices</b><span style={{ fontSize: 11, color: AF.grayMid }}>Tier {TIER_NAMES[0]} · {disc}% partner discount</span></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr .8fr .8fr .7fr .7fr .6fr", padding: "6px 16px", fontSize: 10, color: AF.grayMid, textTransform: "uppercase" }}>{["Order", "Type", "Tokens", "Amount", "Date", "Status", ""].map((h, i) => <span key={i}>{h}</span>)}</div>
    {orders.map((o) => <div key={o.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr .8fr .8fr .7fr .7fr .6fr", padding: "10px 16px", borderTop: `1px solid ${AF.border}`, fontSize: 12, alignItems: "center" }}><b>{o.id}</b><span>{o.type}</span><span>{fmtN(o.tk)}</span><span>€{fmtN(o.amt)}</span><span style={{ color: AF.grayMid }}>{o.d}</span><span style={{ fontSize: 10.5, fontWeight: 600, color: o.st === "Paid" ? "#12B76A" : "#B54708" }}>{o.st}</span><span style={{ fontSize: 10.5, color: AF.pink, cursor: "pointer" }} onClick={() => flash(`${o.id}.pdf downloaded`)}>PDF ↓</span></div>)}
  </div>);
  else if (tab === 6) body = (<div style={panel}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><b style={{ fontSize: 15 }}>Your team & roles</b><BoBtn primary onClick={() => { setTeam([...team, [`new${team.length}@yourfirm.com`, "Consultant", "0 assigned"]]); flash("Invitation sent."); }}>+ Invite teammate</BoBtn></div>
    <div style={{ border: `1px solid ${AF.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>{team.map(([e, r, s], i) => <div key={e} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "9px 14px", borderTop: i ? `1px solid ${AF.border}` : "none", fontSize: 12 }}><span>{e}</span><b style={{ color: r === "Admin" ? AF.pink : AF.black }}>{r}</b><span style={{ color: AF.grayMid }}>{s}</span></div>)}</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>{[["Admin", "Orders, pool, allocation, team"], ["Manager", "Clients, users, renewals, consumption"], ["Consultant", "Delegated access to assigned client workspaces only"]].map(([r, d]) => <div key={r} style={{ background: AF.grayLight, borderRadius: 8, padding: "10px 12px", fontSize: 11 }}><b>{r}</b><div style={{ color: AF.grayMid, marginTop: 3 }}>{d}</div></div>)}</div>
    <div style={{ fontSize: 10.5, fontWeight: 700, color: AF.grayMid, textTransform: "uppercase", letterSpacing: "0.05em", margin: "14px 0 6px" }}>Audit log</div>
    {[["2026-09-22 09:14", "you@yourfirm.com", "Allocated 5,000 tk to Cielo Fintech"], ["2026-09-21 17:02", "a.rossi@yourfirm.com", "Opened workspace · Nordwind Retail"], ["2026-09-20 11:40", "m.dupont@yourfirm.com", "Added user · Bergmann Logistics"]].map(([d, u, a]) => <div key={d} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 2fr", fontSize: 11, color: AF.grayMid, padding: "4px 0" }}><span>{d}</span><span>{u}</span><span style={{ color: AF.black }}>{a}</span></div>)}
  </div>);
  else body = (<div style={panel}><b style={{ fontSize: 15 }}>Open a client workspace</b><p style={{ fontSize: 11.5, color: AF.grayMid, margin: "6px 0 14px" }}>Delegated access to your client's AssessFirst account — no password to share, every action logged, revocable by the client at any time.</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>{clients.slice(0, 6).map((c, i) => <div key={c.n} style={{ background: AF.grayLight, borderRadius: 10, padding: 12 }}><b style={{ fontSize: 12.5 }}>{c.n}</b><div style={{ fontSize: 10.5, color: AF.grayMid, margin: "3px 0 10px" }}>{c.users} users · {fmtN(c.a - c.u)} tk left</div><BoBtn primary onClick={() => setWs(i)}>Open workspace</BoBtn></div>)}</div>
  </div>);
  return (
    <Frame gray>
      <H2>{T.h}</H2><P>{T.p}</P>
      <div style={{ background: "#fff", border: `1px solid ${AF.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "0 16px", height: 48, borderBottom: `1px solid ${AF.border}` }}>
          <AfLogo size={13} /><span style={{ fontSize: 12, fontWeight: 700, color: AF.pink, marginLeft: -8 }}>Deployer</span>
          <div style={{ display: "flex", gap: 2, flex: 1, overflowX: "auto" }}>{TABS.map((x, i) => (internal || !["Orders", "Team"].includes(x)) && <span key={x} onClick={() => { setTab(i); setWs(null); }} style={{ fontSize: 11.5, padding: "14px 9px", cursor: "pointer", whiteSpace: "nowrap", color: tab === i ? AF.black : AF.grayMid, fontWeight: tab === i ? 700 : 400, borderBottom: tab === i ? `2px solid ${AF.pink}` : "2px solid transparent" }}>{x}</span>)}</div>
          <span style={{ fontSize: 11, fontWeight: 600, border: `1px solid ${AF.border}`, borderRadius: 20, padding: "4px 10px", display: "inline-flex", gap: 6, alignItems: "center" }}><span style={{ width: 9, height: 9, borderRadius: 5, background: AF.gradient, display: "inline-block" }} />{fmtN(free)} tk free</span>
          <span style={{ fontSize: 10.5, color: AF.grayMid }}>{L[lang].prog.cards[prog][0]}</span>
        </div>
        <div style={{ padding: 14, background: AF.grayLight, display: "grid", gridTemplateColumns: internal ? "1fr 290px" : "1fr", gap: 12 }}>{body}<Spec /></div>
        {msg && <div style={{ margin: "0 14px 14px", background: AF.black, color: "#fff", borderRadius: 8, padding: "9px 14px", fontSize: 12 }}>{msg}</div>}
      </div>
    </Frame>
  );
};

/* ============ I18N — buy / simulator / roadmap ============ */
L.en.buy = {
  h: "Two ways to order", p: "Choose per order — most partners use both. In both cases you buy at the public grid minus your partner discount, and AssessFirst invoices you.",
  modes: [["Per-client order", ["You order the exact tokens one client needs", "Priced on the public grid × the client's commitment (12 to 48 months) − your discount", "Best for large accounts and multi-year deals", "Tokens are booked to that client"]],
          ["Credit Pool", ["You order a pool of tokens for your own portfolio", "One price on the same grid, with volume degressivity — the bigger the pool, the higher your margin on every client", "Reallocate freely across clients: small accounts, one-shot projects, pilots", "Tokens valid 12 months from your order; once allocated, 12 months for the client"]]],
  cH: "Two clocks. Allocate before the pool ends.", cP: "Your pool has its own clock — 12 months by default, 24 or 36 on request. Every allocation to a client starts a separate 12-month client subscription, independent of your pool.",
  pool: "Your pool", client: "Client", months: "months",
  rules: [["Tokens are valid 12 months from your order", "The pool clock starts at the AssessFirst invoice. Tokens still unallocated at the end of the pool expire."], ["Allocated tokens are valid 12 months for your client", "Once allocated, the client subscription runs its full 12 months — even past the end of your pool."], ["Top up any time", "Add tokens to a running pool at the volume tier you have reached; the pool end date does not change."]],
  gH: "Public price grid", gP: "One grid, from 5,000 to 500,000 tokens; above that, custom terms. Your partner price applies your tier discount — the difference with the public price is your margin if you resell at list price.",
  tokens: "Tokens", commit: "Commitment", tier: "Your tier", pub: "Public price", part: "Your partner price", perTk: "per token", mLbl: "margin", yourMargin: "Your margin if resold at public price", custom: "Custom", keyRows: ["Tokens", "Public price", "Your partner price", "Your margin at public price"],
  convT: "What does that buy?", convP: "Tick the tools your clients would use on each person — the grid shows how many people you can assess with this volume.", people: "people assessed", perPerson: "tokens per person",
};
L.fr.buy = {
  h: "Deux façons de commander", p: "Au choix à chaque commande — la plupart des partenaires utilisent les deux. Dans les deux cas, vous achetez au prix de la grille publique moins votre remise partenaire, et AssessFirst vous facture.",
  modes: [["Commande par client", ["Vous commandez exactement les tokens dont un client a besoin", "Prix : grille publique × engagement du client (12 à 48 mois) − votre remise", "Idéal pour les grands comptes et les deals pluriannuels", "Les tokens sont réservés à ce client"]],
          ["Credit Pool", ["Vous commandez un pool de tokens pour votre portefeuille", "Un seul prix sur la même grille, dégressif au volume — plus le pool est gros, plus votre marge est élevée sur chaque client", "Réallocation libre entre clients : petits comptes, projets ponctuels, pilotes", "Tokens valables 12 mois à partir de la commande ; une fois alloués, 12 mois pour le client"]]],
  cH: "Deux horloges. Allouez avant la fin du pool.", cP: "Votre pool a sa propre horloge — 12 mois par défaut, 24 ou 36 sur demande. Chaque allocation à un client démarre un abonnement client de 12 mois, indépendant de votre pool.",
  pool: "Votre pool", client: "Client", months: "mois",
  rules: [["Les tokens sont valables 12 mois à partir de votre commande", "L'horloge du pool démarre à la facture AssessFirst. Les tokens encore non alloués à la fin du pool expirent."], ["Les tokens alloués sont valables 12 mois pour votre client", "Une fois alloués, l'abonnement client court ses 12 mois complets — même au-delà de la fin de votre pool."], ["Rechargez à tout moment", "Ajoutez des tokens à un pool en cours au palier de volume atteint ; la date de fin du pool ne change pas."]],
  gH: "Grille tarifaire publique", gP: "Une seule grille, de 5 000 à 500 000 tokens ; au-delà, conditions sur mesure. Votre prix partenaire applique la remise de votre tier — l'écart avec le prix public est votre marge si vous revendez au tarif public.",
  tokens: "Tokens", commit: "Engagement", tier: "Votre tier", pub: "Prix public", part: "Votre prix partenaire", perTk: "par token", mLbl: "de marge", yourMargin: "Votre marge si revendu au prix public", custom: "Sur mesure", keyRows: ["Tokens", "Prix public", "Votre prix partenaire", "Votre marge au prix public"],
  convT: "Ça représente quoi ?", convP: "Cochez les outils que vos clients utiliseraient pour chaque personne : vous voyez combien de personnes ce volume permet d'évaluer.", people: "personnes évaluées", perPerson: "tokens par personne",
};
L.en.sim = {
  h: "Estimate your partner opportunity", p: "Built on your portfolio: how many client projects a year, what each one assesses, which tools. Every figure is an assumption you can change.",
  s1: "1 · Your portfolio", projects: "Client projects per year", type: "Project type", types: [["recruit", "Hiring campaigns"], ["talent", "Talent projects"], ["both", "Both"]], camps: "Campaigns per project", cands: "Candidates per campaign", emps: "People assessed per talent project",
  s2: "2 · Tools used", s2n: "Each % applies to the people assessed. Your clients run the tools they need, in any order.",
  s3: "3 · Your pool", commit: "Pool commitment", tier: "Your tier",
  vol: "Your estimated volume", volu: "tokens / year", people: "people assessed", perPerson: "tk per person",
  tCols: ["Tier", "Discount", "Partner cost / year", "Gross profit / year", "Margin"], best: "Selected",
  resale: "Your resale price per token", resaleHint: "Default = AssessFirst public price for each client's own volume, 12 months. Type your own to test another positioning.",
  how: (rs, pc, pool) => `Your clients pay the public price for their own volume (≈ ${rs} per token). You buy a pool of ${pool} tokens at ${pc} per token: your tier discount plus volume degressivity — that gap is your margin.`,
  kpis: ["Potential token revenue", "Partner cost", "Gross profit on tokens", "Gross margin"],
  services: "Plus your services: setup, training, debriefs, assessment centres, coaching — billed on top of this margin, at your rates.",
  custom: "Above 500,000 tokens: indicative — custom terms.", cta: "Discuss this business case",
};
L.fr.sim = {
  h: "Estimez votre opportunité partenaire", p: "Construit sur votre portefeuille : combien de projets clients par an, ce que chacun évalue, avec quels outils. Chaque chiffre est une hypothèse modifiable.",
  s1: "1 · Votre portefeuille", projects: "Projets clients par an", type: "Type de projet", types: [["recruit", "Campagnes de recrutement"], ["talent", "Projets talents"], ["both", "Les deux"]], camps: "Campagnes par projet", cands: "Candidats par campagne", emps: "Personnes évaluées par projet talents",
  s2: "2 · Outils utilisés", s2n: "Chaque % s'applique aux personnes évaluées. Vos clients utilisent les outils dont ils ont besoin, dans l'ordre qu'ils veulent.",
  s3: "3 · Votre pool", commit: "Engagement du pool", tier: "Votre tier",
  vol: "Votre volume estimé", volu: "tokens / an", people: "personnes évaluées", perPerson: "tk par personne",
  tCols: ["Tier", "Remise", "Coût partenaire / an", "Marge brute / an", "Marge"], best: "Sélectionné",
  resale: "Votre prix de revente par token", resaleHint: "Défaut = prix public AssessFirst pour le volume propre de chaque client, 12 mois. Saisissez le vôtre pour tester un autre positionnement.",
  how: (rs, pc, pool) => `Vos clients paient le prix public pour leur propre volume (≈ ${rs} par token). Vous achetez un pool de ${pool} tokens à ${pc} par token : remise de votre tier plus dégressivité au volume — cet écart est votre marge.`,
  kpis: ["Revenu tokens potentiel", "Coût partenaire", "Marge brute tokens", "Taux de marge"],
  services: "Plus vos services : paramétrage, formation, restitutions, assessment centers, coaching — facturés en plus de cette marge, à vos tarifs.",
  custom: "Au-delà de 500 000 tokens : indicatif — conditions sur mesure.", cta: "Discuter de ce business case",
};
L.en.road = {
  h: "From contract to first client in 90 days", p: "A shared plan. We commit to the support, you commit to the pace. Your back-office is open on day one.",
  you: "You", af: "AssessFirst",
  ms: [["Day 0", "Contract signed", "Partnership agreement, programme and tier confirmed.", "Back-office access, Partner Manager assigned, welcome kit."], ["Day 7", "Kick-off", "Your team meets your Partner Manager; first accounts mapped.", "Portal access (Introw): playbooks, battle cards, sandbox."], ["Day 14", "Certified", "Product & sales certification completed by your consultants.", "Badge issued; deal registration and co-sell unlocked."], ["Day 30", "First client created", "First order or pool; first client account created in Deployer.", "Onboarding of the client (Reseller) or coaching of your team (Distributor)."], ["Day 60", "First campaign live", "First assessments running at your client; consumption visible.", "Escalation path active; first monthly business review."], ["Day 90", "Business review", "Pipeline for the next quarter, renewals planned, second client in motion.", "Tier trajectory, co-marketing plan, MDF eligibility."]],
  cH: "Interested in exploring a partnership?", cP: "A 30-minute conversation with our Partnerships team is enough to see whether the model fits your business — and which programme is right for you.",
  cta: "Book a 30-minute call", mail: "or write to", restart: "↻ Restart the journey",
};
L.fr.road = {
  h: "Du contrat au premier client en 90 jours", p: "Un plan partagé. Nous nous engageons sur le support, vous sur le rythme. Votre back-office est ouvert dès le premier jour.",
  you: "Vous", af: "AssessFirst",
  ms: [["Jour 0", "Contrat signé", "Contrat de partenariat, programme et tier confirmés.", "Accès back-office, Partner Manager assigné, kit de bienvenue."], ["Jour 7", "Kick-off", "Votre équipe rencontre votre Partner Manager ; premiers comptes cartographiés.", "Accès portail (Introw) : playbooks, battle cards, sandbox."], ["Jour 14", "Certifié", "Certification produit & vente complétée par vos consultants.", "Badge remis ; enregistrement des deals et co-vente débloqués."], ["Jour 30", "Premier client créé", "Première commande ou pool ; premier compte client créé dans Deployer.", "Onboarding du client (Revendeur) ou coaching de votre équipe (Distributeur)."], ["Jour 60", "Première campagne live", "Premières évaluations chez votre client ; consommation visible.", "Escalade active ; première revue mensuelle."], ["Jour 90", "Revue business", "Pipeline du trimestre suivant, renouvellements planifiés, deuxième client en cours.", "Trajectoire de tier, plan de co-marketing, éligibilité MDF."]],
  cH: "Envie d'explorer un partenariat ?", cP: "Une conversation de 30 minutes avec notre équipe Partenariats suffit pour voir si le modèle correspond à votre activité — et quel programme vous convient.",
  cta: "Réserver un call de 30 minutes", mail: "ou écrivez à", restart: "↻ Recommencer le parcours",
};

/* ============ ACT 5 — HOW YOU BUY ============ */
const S_Modes = ({ lang }) => {
  const T = L[lang].buy;
  return (<Frame><Bar /><H2>{T.h}</H2><P>{T.p}</P>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {T.modes.map(([n, pts], i) => <div key={n} style={{ border: `1px solid ${AF.border}`, borderTop: `4px solid ${i ? AF.pink : AF.black}`, borderRadius: 12, padding: "18px 20px" }}><div style={{ fontSize: 18, fontWeight: 700, color: AF.black, marginBottom: 12 }}>{n}</div>{pts.map((p) => <div key={p} style={{ display: "flex", gap: 8, fontSize: 12.5, color: AF.black, lineHeight: 1.5, padding: "7px 0", borderTop: `1px solid ${AF.border}` }}><Check size={15} /><span>{p}</span></div>)}</div>)}
    </div></Frame>);
};
const S_Clocks = ({ lang }) => {
  const T = L[lang].buy;
  const cl = [[1, "A"], [4, "B"], [8, "C"], [11, "D"]];
  return (<Frame><Bar /><H2>{T.cH}</H2><P>{T.cP}</P>
    <div style={{ border: `1px solid ${AF.border}`, borderRadius: 12, padding: "22px 24px", marginBottom: 16 }}>
      <div style={{ position: "relative", height: 30, marginBottom: 10 }}><div style={{ position: "absolute", left: 0, width: `${12 / 24 * 100}%`, height: 30, background: AF.black, borderRadius: 8, color: "#fff", fontSize: 12, display: "flex", alignItems: "center", paddingLeft: 12 }}>{T.pool} — 12 {T.months}</div></div>
      {cl.map(([s, l]) => <div key={l} style={{ position: "relative", height: 24, marginBottom: 6 }}><div style={{ position: "absolute", left: `${s / 24 * 100}%`, width: `${12 / 24 * 100}%`, height: 24, background: s + 12 > 12 ? AF.pink : "#0096FF", borderRadius: 6, color: "#fff", fontSize: 11, display: "flex", alignItems: "center", paddingLeft: 10 }}>{T.client} {l} — 12 {T.months}</div></div>)}
      <div style={{ position: "relative", height: 1, background: AF.border, marginTop: 6 }}><div style={{ position: "absolute", left: `${12 / 24 * 100}%`, top: -170, height: 176, borderLeft: `2px dashed ${AF.pink}` }} /><div style={{ position: "absolute", left: `${12 / 24 * 100}%`, top: 6, transform: "translateX(-50%)", fontSize: 10, color: AF.pink, fontWeight: 700 }}>{T.pool} · end</div></div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 24 }}>{T.rules.map(([a, b]) => <div key={a} style={{ background: AF.grayLight, borderRadius: 12, padding: "14px 16px" }}><div style={{ fontSize: 13.5, fontWeight: 700, color: AF.black, marginBottom: 6 }}>{a}</div><div style={{ fontSize: 11.5, color: AF.grayMid, lineHeight: 1.5 }}>{b}</div></div>)}</div>
  </Frame>);
};
const S_Grid = ({ lang, prog }) => {
  const T = L[lang].buy;
  const [cur, setCur] = useState("EUR"); const { s: sym, r } = CUR[cur];
  const [i, setI] = useState(2), [m, setM] = useState(12), [tier, setTier] = useState(0);
  const [use, setUse] = useState({ CVS: false, SCAN: true, SWIPE: true, DRIVE: true, BRAIN: false, VOICE: false });
  const tk = PRICE[i][0], disc = DISC[prog][tier], pub = publicPrice(tk, m, PARTNER_SIZE), part = pub * (1 - disc / 100);
  const money = (n) => sym + fmtN(n * r);
  const perPerson = PRODUCTS.reduce((a, p) => a + (use[p.id] ? p.cost : 0), 0);
  const key = [5000, 10000, 25000, 50000, 100000, 250000, 500000];
  return (<Frame><Bar />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><H2>{T.gH}</H2><CurSwitch cur={cur} setCur={setCur} /></div><P>{T.gP}</P>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div>
        <div style={{ background: AF.grayLight, borderRadius: 12, padding: "16px 18px", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 4 }}><span style={{ color: AF.grayMid }}>{T.tokens}</span><b style={{ color: AF.black }}>{fmtN(tk)} tk</b></div>
          <input type="range" min={0} max={PRICE.length - 1} value={i} onChange={(e) => setI(Number(e.target.value))} style={{ width: "100%", accentColor: AF.pink, marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <span><span style={{ fontSize: 11, color: AF.grayMid, marginRight: 8 }}>{T.commit}</span><Seg value={m} onChange={setM} options={[[12, "12 m"], [24, "24 m"], [36, "36 m"], [48, "48 m"]]} /></span>
            <span><span style={{ fontSize: 11, color: AF.grayMid, marginRight: 8 }}>{T.tier}</span><Seg value={tier} onChange={setTier} options={TIER_NAMES.map((n, k) => [k, `${n} · ${DISC[prog][k]}%`])} /></span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ border: `1px solid ${AF.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10, color: AF.grayMid, textTransform: "uppercase", letterSpacing: "0.05em" }}>{T.pub}</div><div style={{ fontSize: 22, fontWeight: 800, color: AF.black }}>{money(pub)}</div><div style={{ fontSize: 11, color: AF.grayMid }}>{sym}{(pub / tk * r).toFixed(2)} {T.perTk}</div></div>
          <div style={{ border: `1px solid ${AF.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10, color: AF.grayMid, textTransform: "uppercase", letterSpacing: "0.05em" }}>{T.part} · −{disc}%</div><div style={{ fontSize: 22, fontWeight: 800, color: AF.black }}>{money(part)}</div><div style={{ fontSize: 11, color: AF.grayMid }}>{sym}{(part / tk * r).toFixed(2)} {T.perTk}</div></div>
        </div>
        <div style={{ border: `2px solid ${AF.pink}`, borderRadius: 10, padding: "12px 16px", background: "#FFF5FA", marginTop: 10, display: "flex", alignItems: "center", gap: 14 }}><div style={{ flex: 1 }}><div style={{ fontSize: 10, color: AF.pink, textTransform: "uppercase", letterSpacing: "0.05em" }}>{T.yourMargin}</div><div style={{ fontSize: 26, fontWeight: 800, color: AF.pink }}>{money(pub - part)}</div></div><div style={{ fontSize: 11, color: AF.grayMid, textAlign: "right", lineHeight: 1.5 }}>{fmtN(tk)} tk · {m} {T.months}<br />{disc}% {T.mLbl}</div></div>
        <div style={{ border: `1px solid ${AF.border}`, borderRadius: 10, overflow: "hidden", marginTop: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.2fr", padding: "7px 12px", background: AF.grayLight, fontSize: 9.5, fontWeight: 700, color: AF.grayMid, textTransform: "uppercase" }}>{T.keyRows.map((k) => <span key={k}>{k}</span>)}<span style={{ gridColumn: "1 / -1", fontWeight: 400, textTransform: "none", fontSize: 9.5, marginTop: 2 }}>{m} {T.months} · {TIER_NAMES[tier]} −{disc}%</span></div>
          {key.map((k) => { const pk = publicPrice(k, m, PARTNER_SIZE), pp = pk * (1 - disc / 100); return <div key={k} onClick={() => setI(PRICE.findIndex((p) => p[0] === k))} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.2fr", padding: "7px 12px", borderTop: `1px solid ${AF.border}`, fontSize: 11.5, cursor: "pointer", background: tk === k ? "#FFF5FA" : "#fff" }}><b>{fmtN(k)}</b><span>{money(pk)}</span><span style={{ color: AF.pink }}>{money(pp)}</span><b style={{ color: AF.black }}>{money(pk - pp)} <span style={{ fontWeight: 400, color: AF.grayMid }}>· {disc}%</span></b></div>; })}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 3.2fr", padding: "7px 12px", borderTop: `1px solid ${AF.border}`, fontSize: 11.5, color: AF.grayMid }}><b style={{ color: AF.black }}>&gt; 500,000</b><span>{T.custom}</span></div>
        </div>
      </div>
      <div style={{ border: `1px solid ${AF.border}`, borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: AF.black, marginBottom: 4 }}>{T.convT}</div><div style={{ fontSize: 11.5, color: AF.grayMid, lineHeight: 1.5, marginBottom: 12 }}>{T.convP}</div>
        {PRODUCTS.map((p) => <div key={p.id} onClick={() => setUse({ ...use, [p.id]: !use[p.id] })} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 9, marginBottom: 6, cursor: "pointer", background: use[p.id] ? "#FFF5FA" : AF.grayLight, border: use[p.id] ? `1.5px solid ${AF.pink}` : "1.5px solid transparent" }}>
          <span style={{ width: 15, height: 15, borderRadius: 4, border: use[p.id] ? "none" : `2px solid ${AF.border}`, background: use[p.id] ? AF.pink : "#fff", color: "#fff", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{use[p.id] ? "✓" : ""}</span>
          <span style={{ width: 22, height: 22, borderRadius: 6, background: p.grad, color: "#fff", fontSize: 10, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{p.icon}</span>
          <b style={{ fontSize: 12, flex: 1 }}>{p.label}</b><span style={{ fontSize: 10.5, color: AF.grayMid }}>{prodTxt(p, lang).short}</span><span style={{ fontSize: 11, fontWeight: 700, color: AF.pink }}>{p.cost} tk</span>
        </div>)}
        <div style={{ background: AF.black, color: "#fff", borderRadius: 10, padding: "14px 16px", marginTop: 12 }}>
          <div style={{ fontSize: 10, color: "#9A9A9E", textTransform: "uppercase", letterSpacing: "0.05em" }}>{fmtN(tk)} tokens · {perPerson} {T.perPerson}</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: "#fff" }}>{perPerson ? fmtN(tk / perPerson) : "—"} <span style={{ fontSize: 13, fontWeight: 500, color: "#B9B9BC" }}>{T.people}</span></div>
        </div>
      </div>
    </div>
  </Frame>);
};

/* ============ ACT 6 — SIMULATOR ============ */
const SIM_DEF = { rpo: { projects: 20, type: "recruit", camps: 6, cands: 150, emps: 50 }, recruit: { projects: 12, type: "recruit", camps: 2, cands: 40, emps: 30 }, consult: { projects: 8, type: "talent", camps: 1, cands: 30, emps: 60 } };
const MIX_DEF = { recruit: { CVS: [false, 100], SCAN: [true, 100], SWIPE: [true, 30], DRIVE: [true, 30], BRAIN: [true, 30], VOICE: [true, 15] }, talent: { CVS: [false, 0], SCAN: [false, 0], SWIPE: [true, 100], DRIVE: [true, 100], BRAIN: [true, 50], VOICE: [true, 20] } };
const S_Simulator = ({ lang, prog, profile }) => {
  const T = L[lang].sim;
  const d = SIM_DEF[profile];
  const [cur, setCur] = useState("EUR"); const { s: sym, r } = CUR[cur];
  const [projects, setProjects] = useState(d.projects), [type, setType] = useState(d.type), [camps, setCamps] = useState(d.camps), [cands, setCands] = useState(d.cands), [emps, setEmps] = useState(d.emps);
  const [usage, setUsage] = useState(MIX_DEF[d.type === "talent" ? "talent" : "recruit"]);
  const [months, setMonths] = useState(12), [tier, setTier] = useState(0), [resale, setResale] = useState(null);
  const chType = (t) => { setType(t); setUsage(MIX_DEF[t === "talent" ? "talent" : "recruit"]); };
  const people = projects * ((type !== "talent" ? camps * cands : 0) + (type !== "recruit" ? emps : 0));
  const perPerson = PRODUCTS.reduce((a, p) => a + (usage[p.id][0] ? usage[p.id][1] / 100 * p.cost : 0), 0);
  const tokens = Math.round(people * perPerson);
  const k = months / 12, poolTk = tokens * k, over = poolTk > 500000;
  const rows = TIER_NAMES.map((n, idx) => { const cost = partnerPrice(poolTk, months, DISC[prog][idx]) / k; return { n, disc: DISC[prog][idx], cost }; });
  const perProject = tokens / Math.max(projects, 1);
  const pubRevenue = projects * publicPrice(perProject, 12, PARTNER_SIZE);
  const avgPub = tokens ? pubRevenue / tokens : 0;
  const rs = resale ?? avgPub, revenue = tokens * rs;
  const act = rows[tier], profit = revenue - act.cost, margin = revenue > 0 ? profit / revenue * 100 : 0;
  const fmt = (n) => { const v = n * r; return sym + (Math.abs(v) >= 1000 ? (v / 1000).toFixed(1) + "k" : fmtN(v)); };
  const setU = (id, on, pct) => setUsage({ ...usage, [id]: [on, pct] });
  return (
    <div style={{ background: "#fff", border: `1px solid ${AF.border}`, borderRadius: 12, minHeight: 500, padding: "28px 30px", fontFamily: AF.font, boxSizing: "border-box" }}>
      <div style={{ height: 4, width: 120, background: AF.gradient, borderRadius: 2, marginBottom: 14 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><h2 style={{ fontSize: 21, fontWeight: 700, color: AF.black, letterSpacing: "-0.02em", margin: 0 }}>{T.h}</h2><CurSwitch cur={cur} setCur={setCur} /></div>
      <p style={{ fontSize: 12, color: AF.grayMid, margin: "0 0 16px", maxWidth: 680, lineHeight: 1.55 }}>{T.p}</p>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: "0 0 300px" }}>
          <Kicker>{T.s1}</Kicker>
          <Slider label={T.projects} value={projects} onChange={setProjects} min={1} max={100} />
          <div style={{ fontSize: 11.5, color: AF.grayMid, marginBottom: 6 }}>{T.type}</div><div style={{ marginBottom: 12 }}><Seg value={type} onChange={chType} options={T.types} /></div>
          {type !== "talent" && <><Slider label={T.camps} value={camps} onChange={setCamps} min={1} max={20} /><Slider label={T.cands} value={cands} onChange={setCands} min={20} max={2000} step={10} /></>}
          {type !== "recruit" && <Slider label={T.emps} value={emps} onChange={setEmps} min={10} max={1000} step={10} />}
          <div style={{ marginTop: 6 }}><Kicker>{T.s2}</Kicker></div>
          <p style={{ fontSize: 10, color: "#98A2AE", margin: "0 0 8px", lineHeight: 1.4 }}>{T.s2n}</p>
          {PRODUCTS.map((p) => { const [on, pct] = usage[p.id]; return (
            <div key={p.id} style={{ background: on ? "#FFF5FA" : AF.grayLight, border: on ? `1.5px solid ${AF.pink}` : "1.5px solid transparent", borderRadius: 9, padding: "6px 10px", marginBottom: 5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span onClick={() => setU(p.id, !on, pct || 30)} style={{ width: 15, height: 15, borderRadius: 4, cursor: "pointer", border: on ? "none" : `2px solid ${AF.border}`, background: on ? AF.pink : "#fff", color: "#fff", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{on ? "✓" : ""}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: on ? AF.black : AF.grayMid, flex: 1 }}>{p.label} <span style={{ fontWeight: 400, fontSize: 10, color: AF.grayMid }}>· {p.cost} tk</span></span>
                {on && <b style={{ fontSize: 11, color: AF.pink }}>{pct}%</b>}
              </div>
              {on && <input type="range" min={5} max={100} step={5} value={pct} onChange={(e) => setU(p.id, true, Number(e.target.value))} style={{ width: "100%", accentColor: AF.pink, marginTop: 3 }} />}
            </div>); })}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", background: "linear-gradient(135deg, rgba(255,47,146,0.08), rgba(0,150,255,0.06))", border: `1.5px solid ${AF.pink}`, borderRadius: 12, padding: "14px 20px", marginBottom: 12 }}>
            <div><div style={{ fontSize: 10, fontWeight: 700, color: AF.grayMid, textTransform: "uppercase", letterSpacing: "0.05em" }}>{T.vol}</div><div style={{ fontSize: 34, fontWeight: 800, color: AF.pink, lineHeight: 1.1 }}>{tokens >= 1000 ? (tokens / 1000).toFixed(0) + "K" : fmtN(tokens)} <span style={{ fontSize: 15, fontWeight: 700 }}>{T.volu}</span></div></div>
            <div style={{ marginLeft: "auto", fontSize: 10.5, color: AF.grayMid, textAlign: "right", lineHeight: 1.6 }}>{fmtN(people)} {T.people}<br />{perPerson.toFixed(1)} {T.perPerson}</div>
          </div>
          <Kicker>{T.s3}</Kicker>
          <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
            <span><span style={{ fontSize: 11, color: AF.grayMid, marginRight: 8 }}>{T.commit}</span><Seg value={months} onChange={setMonths} options={[[12, "12 m"], [24, "24 m"], [36, "36 m"], [48, "48 m"]]} /></span>
            {over && <span style={{ fontSize: 10.5, color: "#B54708", background: "#FFF6E6", borderRadius: 8, padding: "4px 9px" }}>{T.custom}</span>}
          </div>
          <div style={{ border: `1px solid ${AF.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr 1fr 1fr .8fr", padding: "8px 12px", background: AF.grayLight, fontSize: 9.5, fontWeight: 700, color: AF.grayMid, textTransform: "uppercase", letterSpacing: "0.05em" }}>{T.tCols.map((c) => <span key={c}>{c}</span>)}</div>
            {rows.map((row, idx) => { const pr = revenue - row.cost; const on = idx === tier; return (
              <div key={row.n} onClick={() => setTier(idx)} style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr 1fr 1fr .8fr", padding: "9px 12px", fontSize: 12, borderTop: `1px solid ${AF.border}`, background: on ? "#FFF5FA" : "#fff", cursor: "pointer", boxShadow: on ? `inset 3px 0 0 ${AF.pink}` : "none", alignItems: "center" }}>
                <span><b>{row.n}</b>{on && <span style={{ fontSize: 8.5, fontWeight: 800, color: "#fff", background: AF.pink, borderRadius: 8, padding: "2px 7px", marginLeft: 6, textTransform: "uppercase" }}>{T.best}</span>}</span><span>−{row.disc}%</span><span>{fmt(row.cost)}</span><b style={{ color: AF.pink }}>{fmt(pr)}</b><span>{revenue > 0 ? (pr / revenue * 100).toFixed(0) : 0}%</span>
              </div>); })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, color: AF.grayMid }}>{T.resale}</span>
            <input type="number" step={0.01} min={0.1} value={Number((rs * r).toFixed(2))} onChange={(e) => setResale(Number(e.target.value) / r)} style={{ width: 70, fontSize: 12, fontWeight: 700, color: AF.black, border: `1px solid ${AF.pink}`, borderRadius: 6, padding: "4px 6px", textAlign: "center", fontFamily: AF.font }} />
            <span style={{ fontSize: 11, color: AF.grayMid }}>{sym}</span>
            {resale !== null && <span onClick={() => setResale(null)} style={{ fontSize: 10.5, color: AF.pink, cursor: "pointer" }}>↺</span>}
          </div>
          <p style={{ fontSize: 10, color: "#98A2AE", margin: "0 0 10px", lineHeight: 1.45 }}>{T.resaleHint}</p>
          <div style={{ fontSize: 11, color: AF.black, background: AF.grayLight, borderRadius: 8, padding: "8px 12px", marginBottom: 12, lineHeight: 1.5 }}>{T.how(sym + (rs * r).toFixed(2), sym + (tokens ? act.cost / tokens * r : 0).toFixed(2), fmtN(poolTk))}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12 }}>
            {[[T.kpis[0], fmt(revenue)], [T.kpis[1] + " · " + act.n, fmt(act.cost)], [T.kpis[2], fmt(profit)], [T.kpis[3], margin.toFixed(0) + "%"]].map(([t, v]) => <div key={t} style={{ background: "#FDF7FB", border: `1px solid ${AF.pink}`, borderRadius: 10, padding: "11px 13px" }}><div style={{ fontSize: 9.5, fontWeight: 700, color: AF.grayMid, textTransform: "uppercase", letterSpacing: "0.04em" }}>{t}</div><div style={{ fontSize: 19, fontWeight: 800, color: AF.pink, marginTop: 2 }}>{v}</div></div>)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, background: AF.grayLight, borderRadius: 10, padding: "10px 14px" }}>
            <span style={{ fontSize: 11.5, color: AF.black, lineHeight: 1.5, flex: 1 }}>{T.services}</span>
            <AfCta small href={BOOKING_URL}>{T.cta}</AfCta>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============ ACT 7 — FIRST 90 DAYS & CALL ============ */
const S_Roadmap = ({ lang }) => {
  const T = L[lang].road;
  return (<Frame><Bar /><H2>{T.h}</H2><P>{T.p}</P>
    <div style={{ position: "relative", margin: "26px 0 8px" }}>
      <div style={{ position: "absolute", left: "8%", right: "8%", top: 19, height: 3, background: AF.gradient, borderRadius: 2, zIndex: 0 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, position: "relative", zIndex: 1 }}>
        {T.ms.map(([d, t, you, af], k) => (
          <div key={t}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><span style={{ width: 34, height: 34, borderRadius: "50%", background: k === 5 ? AF.black : AF.pink, color: "#fff", fontSize: 10, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "4px solid #fff", boxShadow: `0 0 0 1px ${AF.border}`, boxSizing: "content-box" }}>{d.split(" ")[1]}</span></div>
            <div style={{ textAlign: "center", fontSize: 10, color: AF.pink, fontWeight: 700 }}>{d}</div>
            <div style={{ textAlign: "center", fontSize: 12.5, fontWeight: 700, color: AF.black, margin: "2px 0 10px", lineHeight: 1.3 }}>{t}</div>
            <div style={{ background: "#FFF5FA", border: `1px solid ${AF.pink}`, borderRadius: 10, padding: "9px 10px", marginBottom: 6, minHeight: 78 }}><div style={{ fontSize: 9, color: AF.pink, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{T.you}</div><div style={{ fontSize: 10.5, color: AF.black, lineHeight: 1.45 }}>{you}</div></div>
            <div style={{ background: AF.grayLight, borderRadius: 10, padding: "9px 10px", minHeight: 78 }}><div style={{ fontSize: 9, color: AF.grayMid, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{T.af}</div><div style={{ fontSize: 10.5, color: AF.black, lineHeight: 1.45 }}>{af}</div></div>
          </div>))}
      </div>
    </div>
  </Frame>);
};
const S_Call = ({ lang, restart }) => {
  const T = L[lang].road;
  return (<Frame dark>
    <div style={{ height: 4, width: 120, background: AF.gradient, borderRadius: 2, marginBottom: 22 }} />
    <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 10px", maxWidth: 640 }}>{T.cH}</h2>
    <p style={{ color: "#B9B9BC", fontSize: 14, lineHeight: 1.6, margin: "0 0 28px", maxWidth: 620 }}>{T.cP}</p>
    <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
      <AfCta href={BOOKING_URL}>{T.cta}</AfCta>
      <span style={{ color: "#B9B9BC", fontSize: 12.5 }}>{T.mail} <a href={`mailto:${PARTNERS_MAIL}`} style={{ color: "#fff" }}>{PARTNERS_MAIL}</a></span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, margin: "36px 0 28px", maxWidth: 760 }}>
      {[["3,500+", lang === "fr" ? "clients dans 40+ pays" : "clients in 40+ countries"], ["39", lang === "fr" ? "langues" : "languages"], ["4.9/5", lang === "fr" ? "expérience candidat · 2 700+ avis Google" : "candidate experience · 2,700+ Google reviews"]].map(([v, l]) => <div key={l} style={{ background: "#2A2A2C", borderRadius: 12, padding: "16px 18px" }}><div style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{v}</div><div style={{ fontSize: 11, color: "#B9B9BC", marginTop: 3 }}>{l}</div></div>)}
    </div>
    <button onClick={restart} style={{ background: "transparent", border: "1px solid #48484A", color: "#D9D9DC", borderRadius: 8, padding: "10px 20px", fontFamily: AF.font, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer" }}>{T.restart}</button>
    <p style={{ color: "#6E6E73", fontSize: 10.5, marginTop: 24 }}>AssessFirst Partner Programme · Decide with confidence.</p>
  </Frame>);
};

/* ============ TOUR SHELL ============ */
const STEPS = [
  { act: 0, label: "Welcome", C: S_Welcome },
  { act: 1, label: "The HR market", C: S_Market },
  { act: 1, label: "Partners who own clients", C: S_Own },
  { act: 2, label: "Reseller or Distributor", C: S_Programme },
  { act: 2, label: "Tiers & MDF", C: S_Tiers },
  { act: 3, label: "Six tools, one token", C: S_Products },
  { act: 3, label: "Your margin", C: S_Margin },
  { act: 4, label: "Deployer back-office", C: S_BackOffice },
  { act: 5, label: "Two ways to order", C: S_Modes },
  { act: 5, label: "Two clocks", C: S_Clocks },
  { act: 5, label: "Public price grid", C: S_Grid },
  { act: 6, label: "Simulator", C: S_Simulator },
  { act: 7, label: "First 90 days", C: S_Roadmap },
  { act: 7, label: "Book a call", C: S_Call },
];
const store = { get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch {} } };
const isInternal = () => { try { return /mode=internal|#internal/.test(window.location.href); } catch { return false; } };
const PinGate = ({ onOk }) => {
  const [pin, setPin] = useState(""); const [err, setErr] = useState(false);
  const submit = () => { if (pin.trim().toUpperCase() === "AF2026") { store.set("af_rd_auth", "1"); onOk(); } else { setErr(true); setPin(""); } };
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: AF.font, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: 24 }}>
        <AfMark size={64} />
        <h1 style={{ fontSize: 22, fontWeight: 700, color: AF.black, margin: "18px 0 4px", letterSpacing: "-0.02em" }}>AssessFirst Partner Programme</h1>
        <p style={{ fontSize: 13, color: AF.grayMid, margin: "0 0 24px" }}>Partner journey — enter your access code</p>
        <input type="password" value={pin} autoFocus onChange={(e) => { setPin(e.target.value); setErr(false); }} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Access code" style={{ fontFamily: AF.font, fontSize: 15, padding: "12px 16px", borderRadius: 8, border: err ? `2px solid ${AF.pink}` : `1px solid ${AF.border}`, outline: "none", textAlign: "center", width: 220, display: "block", margin: "0 auto 6px" }} />
        <div style={{ fontSize: 12, color: AF.pink, minHeight: 18 }}>{err ? "Incorrect code, please try again." : ""}</div>
        <div style={{ marginTop: 8 }}><AfCta onClick={submit}>Enter</AfCta></div>
      </div>
    </div>
  );
};

export default function App() {
  const [authed, setAuthed] = useState(() => store.get("af_rd_auth") === "1");
  const [lang, setLang] = useState("en");
  const [profile, setProfile] = useState("rpo");
  const [prog, setProg] = useState("distributor");
  const [hov, setHov] = useState(null);
  const [i, setI] = useState(0);
  const internal = useMemo(isInternal, []);
  if (!authed) return <PinGate onOk={() => setAuthed(true)} />;
  const N = L[lang].nav, H = L[lang].hdr;
  const step = STEPS[Math.min(i, STEPS.length - 1)];
  const Screen = step.C;
  const next = () => setI((v) => Math.min(v + 1, STEPS.length - 1));
  const prev = () => setI((v) => Math.max(v - 1, 0));
  const restart = () => setI(0);
  const props = { next, restart, lang, profile, setProfile, prog, setProg, internal, steps: STEPS, goto: (k) => setI(k) };
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: AF.font, padding: "0 0 40px" }}>
      <div style={{ height: 5, background: AF.gradient }} />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "26px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 6 }}>
          <div>
            <AfLogo size={20} />
            <h1 style={{ fontSize: 24, fontWeight: 700, color: AF.black, margin: "14px 0 2px", letterSpacing: "-0.02em" }}>AssessFirst Partner Programme <span style={{ color: AF.grayMid, fontWeight: 400 }}>— {H.title}</span></h1>
            <p style={{ fontSize: 13, color: AF.grayMid, margin: 0 }}>{H.sub}</p>
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: AF.grayMid }}>
            <div style={{ marginBottom: 6, display: "flex", gap: 6, justifyContent: "flex-end", alignItems: "center" }}>{internal && <span style={{ fontSize: 9.5, fontWeight: 700, color: "#fff", background: AF.black, borderRadius: 8, padding: "3px 8px", textTransform: "uppercase" }}>internal</span>}<LangSwitch lang={lang} setLang={setLang} /></div>
            {step.act > 0 ? `${N.act} ${step.act} / 7` : N.intro}<br /><b style={{ color: AF.black }}>{H.acts[step.act]}</b>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, margin: "18px 0 16px" }}>
          {STEPS.map((s, k) => (
            <div key={k} onClick={() => setI(k)} onMouseEnter={() => setHov(k)} onMouseLeave={() => setHov(null)} style={{ flex: 1, position: "relative", padding: "6px 0", marginLeft: k > 0 && s.act !== STEPS[k - 1].act ? 8 : 0, cursor: "pointer" }}>
              <div style={{ height: 6, borderRadius: 3, background: k <= i ? AF.pink : AF.grayLight, opacity: k === i ? 1 : k < i ? 0.55 : 1, transform: hov === k ? "scaleY(1.5)" : "none", transition: "background .3s, transform .15s" }} />
              {hov === k && <div style={{ position: "absolute", bottom: "calc(100% + 2px)", left: "50%", transform: "translateX(-50%)", background: AF.black, color: "#fff", fontSize: 10.5, fontWeight: 600, borderRadius: 7, padding: "5px 10px", whiteSpace: "nowrap", zIndex: 20, pointerEvents: "none", boxShadow: "0 6px 18px rgba(0,0,0,0.22)" }}>{s.act > 0 ? `${s.act}.` : ""} {s.label}<span style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", border: "4px solid transparent", borderTopColor: AF.black }} /></div>}
            </div>))}
        </div>
        <Screen {...props} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
          <button onClick={prev} disabled={i === 0} style={{ background: "#fff", border: `1px solid ${AF.border}`, borderRadius: 8, padding: "10px 22px", fontFamily: AF.font, fontWeight: 400, textTransform: "uppercase", fontSize: 12, letterSpacing: "0.06em", color: AF.black, cursor: i === 0 ? "default" : "pointer", opacity: i === 0 ? 0.4 : 1 }}>{N.back}</button>
          <span style={{ fontSize: 12, color: AF.grayMid }}>{i + 1} / {STEPS.length} — {step.label}</span>
          {i < STEPS.length - 1 ? <AfCta onClick={next}>{N.next}</AfCta> : <AfCta onClick={restart}>{N.restart}</AfCta>}
        </div>
      </div>
    </div>
  );
}
