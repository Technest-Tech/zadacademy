import type { Locale } from '@/i18n/config'

export type FaqCategory = 'General' | 'Classes' | 'Teachers' | 'Pricing' | 'Technical'

export type FaqItem = {
  id: string
  q: string
  a: string
  category: FaqCategory
}

export const faqCategories: FaqCategory[] = [
  'General',
  'Classes',
  'Teachers',
  'Pricing',
  'Technical',
]

export const faqs: FaqItem[] = [
  // General
  {
    id: 'g1',
    category: 'General',
    q: 'What is Zad Academy?',
    a: "Zad Academy is an online Quran and Arabic academy offering live 1-on-1 classes for children and adults, with Arabic-speaking male and female teachers. 230 students currently take classes with us.",
  },
  {
    id: 'g2',
    category: 'General',
    q: 'What courses do you offer?',
    a: "Quran reading and recitation (children and adults), Noorani Qaida, Tajweed, Quran memorisation (Hifz), Arabic for children and adults, Arabic conversation for kids, Islamic studies and stories of the prophets for kids, and an introduction to understanding the Quran. See our Courses page for details.",
  },
  {
    id: 'g3',
    category: 'General',
    q: 'Which countries do you serve?',
    a: 'Classes are online, so you can join from any country. Explanations are given in French or English, and classes run 7 days a week, from 8 am to 10 pm, to fit your timezone.',
  },
  {
    id: 'g4',
    category: 'General',
    q: 'Do you offer classes for children?',
    a: 'Yes. We have dedicated programs for children as young as 5. Our teachers are trained to engage young learners, and we offer female teachers for families who prefer them.',
  },
  // Classes
  // Parents
  {
    id: 'parent1',
    category: 'Classes',
    q: "My child doesn’t speak Arabic at home — can they start?",
    a: "Yes. Classes can start with explanations entirely in French, then gradually bring in simple Arabic words and instructions.",
  },
  {
    id: 'parent2',
    category: 'Classes',
    q: "Do you teach Arabic or only Quran recitation?",
    a: "Both. Families can choose an Arabic-focused path, a Quran/tajweed path or a balanced mix.",
  },
  {
    id: 'parent3',
    category: 'Classes',
    q: "How do you handle siblings at different levels?",
    a: "Each child gets a short individual assessment. Skills, amount of practice and pace are not the same for everyone.",
  },
  {
    id: 'parent4',
    category: 'Classes',
    q: "How will I know my child is progressing?",
    a: "We record a starting point, then review progress regularly: reading, pronunciation, memorisation, independence and consistency. After every class you receive a short report in French.",
  },
  {
    id: 'parent5',
    category: 'Classes',
    q: "Can we choose a female teacher for a girl and a male teacher for a boy?",
    a: "Families can state their preference. The final match depends on teachers’ availability.",
  },
  {
    id: 'parent6',
    category: 'Classes',
    q: "Is French used for the whole class?",
    a: "French is used to explain and reassure; Arabic gradually takes more room to build listening and speaking.",
  },
  {
    id: 'c1',
    category: 'Classes',
    q: 'How does a trial class work?',
    a: "Fill out the contact form and we will match you with a suitable teacher based on your level, schedule, and preferences. The first class is completely free — no credit card required. After the class, you decide whether to continue.",
  },
  {
    id: 'c2',
    category: 'Classes',
    q: 'What platform are classes held on?',
    a: 'Classes are held via Zoom, Google Meet, or Skype — whichever you prefer. We send you the meeting link before each session.',
  },
  {
    id: 'c3',
    category: 'Classes',
    q: 'Can I choose my class schedule?',
    a: "Yes. After matching with a teacher, you agree on a recurring time slot that fits both schedules. Classes run 7 days a week, from 8 am to 10 pm.",
  },
  {
    id: 'c4',
    category: 'Classes',
    q: 'What if I need to reschedule?',
    a: "You can cancel or reschedule a class free of charge by telling our team at least 24 hours in advance on WhatsApp. A class cancelled with less notice is counted as taken, except in exceptional situations approved by the team. If your teacher is late or has to cancel, the time is made up or the class is rescheduled at no cost.",
  },
  {
    id: 'c5',
    category: 'Classes',
    q: 'Are classes recorded?',
    a: "Sessions are not recorded by default to protect student privacy. If you would like recordings for review, please discuss this with your teacher and our admin team.",
  },
  // Teachers
  {
    id: 't1',
    category: 'Teachers',
    q: 'Are your teachers qualified?',
    a: "Our teachers are Arabic speakers who teach the Quran and Arabic in private classes. The best way to judge is the first class, which is free — and your first package comes with a money-back guarantee.",
  },
  {
    id: 't2',
    category: 'Teachers',
    q: 'Do you have female teachers?',
    a: 'Yes. We have several highly qualified female teachers available for female students or families who prefer a female teacher for their children. Indicate your preference when booking your trial.',
  },
  {
    id: 't3',
    category: 'Teachers',
    q: 'Can I request a specific teacher?',
    a: 'Growth and Premium plan subscribers can request priority teacher selection. Starter plan students are matched based on level and availability. You can always request a change if the initial match is not the right fit.',
  },
  {
    id: 't4',
    category: 'Teachers',
    q: "What if my child doesn't connect with their teacher?",
    a: "Teacher compatibility matters. If your child is not clicking with their current teacher, message us on WhatsApp and we will arrange a free switch to another teacher — no questions asked.",
  },
  // Pricing
  {
    id: 'p1',
    category: 'Pricing',
    q: 'How much do classes cost?',
    a: "Packages start at €19.99 for 4 classes of 30 minutes (€5 per class) — the larger the package, the lower the price per class. See our Pricing page for every package and lesson length.",
  },
  {
    id: 'p2',
    category: 'Pricing',
    q: 'Is there a contract or lock-in period?',
    a: "No. There is no subscription and no automatic renewal: you buy a package of classes, valid for 14 months, and only buy another one if you want to. You can also pause your package up to twice.",
  },
  {
    id: 'p3',
    category: 'Pricing',
    q: 'Do you offer family discounts?',
    a: "For several children from the same family, message us on WhatsApp after the free trial: we will recommend the most cost-effective package and organise each child’s classes.",
  },
  {
    id: 'p4',
    category: 'Pricing',
    q: 'What payment methods do you accept?',
    a: "Packages are paid in advance, in euros, via PayPal (you can pay by bank card through PayPal). Your class slots are confirmed once payment is received.",
  },
  // Technical
  {
    id: 'tech1',
    category: 'Technical',
    q: 'What do I need to join a class?',
    a: 'A computer, tablet, or smartphone with a working camera, microphone, and a stable internet connection. Zoom, Google Meet, or Skype installed (free). No other software is required.',
  },
  {
    id: 'tech2',
    category: 'Technical',
    q: 'What internet speed do I need?',
    a: 'A minimum of 2 Mbps upload and download is sufficient for video classes. We recommend 5 Mbps+ for the best experience.',
  },
  {
    id: 'tech3',
    category: 'Technical',
    q: 'Can I join from a mobile phone or tablet?',
    a: 'Yes. Zoom, Meet, and Skype all have iOS and Android apps. Many students join from tablets, which provide a large enough screen for reading Quran text.',
  },
  {
    id: 'tech4',
    category: 'Technical',
    q: 'What if I have a technical issue during a class?',
    a: 'Contact your teacher or our WhatsApp support line. If a class is disrupted by a technical issue on our side, the session is not counted against your monthly allocation.',
  },
]

export const faqPageContent = {
  hero: {
    eyebrow: 'Frequently Asked Questions',
    heading: 'Everything You Need to Know',
    subheading: "Can't find your answer? Chat with us on WhatsApp — we reply within minutes.",
  },
  cta: {
    heading: 'Still Have Questions?',
    subheading: 'Our team is available on WhatsApp 7 days a week. We typically reply within 10 minutes.',
    ctaPrimary: 'Book Free Trial',
    ctaSecondary: 'Chat on WhatsApp',
  },
}

export const faqCategoriesFr: string[] = [
  'Générale',
  'Cours',
  'Enseignants',
  'Tarifs',
  'Technique',
]

export const faqsFr: { id: string; q: string; a: string; category: string }[] = [
  // Générale
  {
    id: 'g1',
    category: 'Générale',
    q: "Qu'est-ce que Zad Academy ?",
    a: "Zad Academy est une académie en ligne de Coran et d’arabe : des cours particuliers en direct, pour enfants et adultes, avec des enseignants et enseignantes arabophones. 230 élèves suivent actuellement nos cours.",
  },
  {
    id: 'g2',
    category: 'Générale',
    q: 'Quels cours proposez-vous ?',
    a: "La lecture et la récitation du Coran (enfants et adultes), la Qaïda Nourania, le tajwid, la mémorisation du Coran (hifz), l’arabe pour enfants et adultes, la conversation arabe pour enfants, l’islam et les histoires des prophètes pour enfants, et une initiation à la compréhension du Coran. Tous les détails sur la page Cours.",
  },
  {
    id: 'g3',
    category: 'Générale',
    q: 'Quels pays desservez-vous ?',
    a: "Les cours ont lieu en ligne : vous pouvez les suivre depuis n'importe quel pays. Les explications se font en français, et les cours ont lieu 7 jours sur 7, de 8 h à 22 h, pour s'adapter à votre fuseau horaire.",
  },
  {
    id: 'g4',
    category: 'Générale',
    q: 'Proposez-vous des cours pour les enfants ?',
    a: "Oui. Nous avons des programmes dédiés aux enfants dès 5 ans. Nos enseignants sont formés pour capter l'attention des jeunes apprenants, et nous proposons des enseignantes pour les familles qui le préfèrent.",
  },
  // Cours
  // Parents
  {
    id: 'parent1',
    category: 'Cours',
    q: "Mon enfant ne parle pas arabe à la maison : peut-il commencer ?",
    a: "Oui. Le cours peut démarrer entièrement avec des explications en français, puis introduire progressivement des mots et des consignes simples en arabe.",
  },
  {
    id: 'parent2',
    category: 'Cours',
    q: "Enseignez-vous l’arabe ou seulement la récitation du Coran ?",
    a: "Les deux sont possibles. La famille peut choisir un parcours centré sur l’arabe, un parcours Coran/tajwīd ou une formule équilibrée.",
  },
  {
    id: 'parent3',
    category: 'Cours',
    q: "Comment gérez-vous les niveaux différents au sein d’une fratrie ?",
    a: "Un bref bilan individuel est réalisé pour chaque enfant. Les compétences, la quantité d’exercices et la vitesse de progression ne sont pas identiques.",
  },
  {
    id: 'parent4',
    category: 'Cours',
    q: "Comment savoir si mon enfant progresse ?",
    a: "Un point de départ est enregistré, puis les acquis sont revus régulièrement : lecture, prononciation, mémorisation, autonomie et régularité. Après chaque séance, vous recevez un court compte rendu en français.",
  },
  {
    id: 'parent5',
    category: 'Cours',
    q: "Peut-on choisir une enseignante pour une fille et un enseignant pour un garçon ?",
    a: "Les familles peuvent exprimer leur préférence. L’affectation finale dépend des disponibilités des enseignants.",
  },
  {
    id: 'parent6',
    category: 'Cours',
    q: "Le français est-il utilisé pendant toute la séance ?",
    a: "Le français sert à expliquer et rassurer ; l’arabe prend progressivement plus de place pour développer l’écoute et l’expression.",
  },
  {
    id: 'c1',
    category: 'Cours',
    q: "Comment se déroule un cours d'essai ?",
    a: "Remplissez le formulaire de contact et nous vous mettrons en relation avec un enseignant adapté à votre niveau, votre emploi du temps et vos préférences. Le premier cours est entièrement gratuit — aucune carte bancaire requise. À l'issue du cours, vous décidez si vous souhaitez continuer.",
  },
  {
    id: 'c2',
    category: 'Cours',
    q: 'Sur quelle plateforme les cours ont-ils lieu ?',
    a: "Les cours ont lieu via Zoom, Google Meet ou Skype — selon votre préférence. Nous vous envoyons le lien de la réunion avant chaque séance.",
  },
  {
    id: 'c3',
    category: 'Cours',
    q: 'Puis-je choisir mon emploi du temps ?',
    a: "Oui. Après avoir été mis en relation avec un enseignant, vous convenez d’un créneau récurrent qui convient aux deux emplois du temps. Les cours ont lieu 7 jours sur 7, de 8 h à 22 h.",
  },
  {
    id: 'c4',
    category: 'Cours',
    q: 'Que faire si je dois reporter un cours ?',
    a: "Vous pouvez annuler ou reporter un cours sans frais en prévenant notre équipe sur WhatsApp au moins 24 heures à l’avance. En dessous de 24 heures, la séance est considérée comme effectuée, sauf situation exceptionnelle validée par l’équipe. Si l’enseignant est en retard ou doit annuler, le temps est rattrapé ou le cours reprogrammé sans frais.",
  },
  {
    id: 'c5',
    category: 'Cours',
    q: 'Les cours sont-ils enregistrés ?',
    a: "Les séances ne sont pas enregistrées par défaut afin de protéger la vie privée des élèves. Si vous souhaitez des enregistrements pour révision, veuillez en discuter avec votre enseignant et notre équipe administrative.",
  },
  // Enseignants
  {
    id: 't1',
    category: 'Enseignants',
    q: 'Vos enseignants sont-ils qualifiés ?',
    a: "Nos enseignants sont arabophones et enseignent le Coran et l’arabe en cours particuliers. Le meilleur moyen d’en juger est le premier cours, offert — et votre premier forfait est satisfait ou remboursé.",
  },
  {
    id: 't2',
    category: 'Enseignants',
    q: 'Avez-vous des enseignantes ?',
    a: "Oui. Nous avons plusieurs enseignantes hautement qualifiées disponibles pour les élèves de sexe féminin ou pour les familles qui préfèrent une enseignante pour leurs enfants. Indiquez votre préférence lors de la réservation de votre essai.",
  },
  {
    id: 't3',
    category: 'Enseignants',
    q: 'Puis-je demander un enseignant en particulier ?',
    a: "Les abonnés aux formules Growth et Premium peuvent bénéficier d'une sélection prioritaire de l'enseignant. Les élèves de la formule Starter sont mis en relation en fonction de leur niveau et des disponibilités. Vous pouvez toujours demander un changement si la première mise en relation ne convient pas.",
  },
  {
    id: 't4',
    category: 'Enseignants',
    q: "Que faire si mon enfant n'accroche pas avec son enseignant ?",
    a: "La compatibilité avec l'enseignant est essentielle. Si votre enfant n'accroche pas avec son enseignant actuel, envoyez-nous un message sur WhatsApp et nous organiserons un changement gratuit vers un autre enseignant — sans aucune question.",
  },
  // Tarifs
  {
    id: 'p1',
    category: 'Tarifs',
    q: 'Combien coûtent les cours ?',
    a: "Les forfaits commencent à 19,99 € pour 4 cours de 30 minutes (5 € le cours) : plus le forfait est grand, moins le cours revient cher. Tous les forfaits et toutes les durées sont sur la page Tarifs.",
  },
  {
    id: 'p2',
    category: 'Tarifs',
    q: "Y a-t-il un contrat ou une période d'engagement ?",
    a: "Non. Il n’y a ni abonnement ni reconduction automatique : vous achetez un forfait de cours, valable 14 mois, et vous en reprenez un seulement si vous le souhaitez. Vous pouvez aussi suspendre votre forfait jusqu’à deux fois.",
  },
  {
    id: 'p3',
    category: 'Tarifs',
    q: 'Proposez-vous des réductions pour les familles ?',
    a: "Pour plusieurs enfants d’une même famille, écrivez-nous sur WhatsApp après le cours d’essai : nous vous conseillons le forfait le plus avantageux et organisons les cours de chaque enfant.",
  },
  {
    id: 'p4',
    category: 'Tarifs',
    q: 'Quels moyens de paiement acceptez-vous ?',
    a: "Les forfaits se règlent à l’avance, en euros, via PayPal (paiement par carte bancaire possible via PayPal). Vos créneaux sont confirmés dès réception du paiement.",
  },
  // Technique
  {
    id: 'tech1',
    category: 'Technique',
    q: "De quoi ai-je besoin pour rejoindre un cours ?",
    a: "Un ordinateur, une tablette ou un smartphone doté d'une caméra et d'un microphone en état de marche, ainsi qu'une connexion Internet stable. Zoom, Google Meet ou Skype installé (gratuit). Aucun autre logiciel n'est requis.",
  },
  {
    id: 'tech2',
    category: 'Technique',
    q: 'Quelle vitesse de connexion me faut-il ?',
    a: "Un minimum de 2 Mbps en envoi et en réception suffit pour les cours en visioconférence. Nous recommandons 5 Mbps ou plus pour une expérience optimale.",
  },
  {
    id: 'tech3',
    category: 'Technique',
    q: "Puis-je rejoindre un cours depuis un téléphone ou une tablette ?",
    a: "Oui. Zoom, Meet et Skype disposent tous d'applications iOS et Android. De nombreux élèves se connectent depuis une tablette, dont l'écran est suffisamment grand pour lire le texte du Coran.",
  },
  {
    id: 'tech4',
    category: 'Technique',
    q: "Que faire en cas de problème technique pendant un cours ?",
    a: "Contactez votre enseignant ou notre ligne d'assistance WhatsApp. Si un cours est interrompu par un problème technique de notre côté, la séance n'est pas décomptée de votre quota mensuel.",
  },
]

export function getFaqCategories(locale: Locale): string[] {
  return locale === 'fr' ? faqCategoriesFr : (faqCategories as unknown as string[])
}

/** A FAQ entry whose `category` is a display string rather than the English-only union. */
export type LocalizedFaqItem = { id: string; q: string; a: string; category: string }

export function getFaqs(locale: Locale): LocalizedFaqItem[] {
  return locale === 'fr' ? faqsFr : (faqs as unknown as LocalizedFaqItem[])
}

export const faqPageContentFr: typeof faqPageContent = {
  hero: {
    eyebrow: 'Foire aux questions',
    heading: 'Tout ce que vous devez savoir',
    subheading: "Vous ne trouvez pas votre réponse ? Discutez avec nous sur WhatsApp — nous répondons en quelques minutes.",
  },
  cta: {
    heading: "Vous avez encore des questions ?",
    subheading: "Notre équipe est disponible sur WhatsApp 7 jours sur 7. Nous répondons généralement en moins de 10 minutes.",
    ctaPrimary: "Réserver un essai gratuit",
    ctaSecondary: 'Discuter sur WhatsApp',
  },
}

export function getFaqPageContent(locale: Locale) {
  return locale === 'fr' ? faqPageContentFr : faqPageContent
}
