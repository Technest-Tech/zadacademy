import type { Locale } from '@/i18n/config'

/** "Notre approche" — from the academy's teacher presentation file (Nov 2026). */
export type ApproachContent = {
  eyebrow: string
  heading: string
  intro: string
  audiences: { label: string; text: string }[]
  pedagogyTitle: string
  pedagogy: string[]
  sessionTitle: string
  session: { minutes: string; activity: string; goal: string }[]
  reportTitle: string
  reportIntro: string
  report: { label: string; text: string }[]
}

const fr: ApproachContent = {
  eyebrow: 'Notre approche',
  heading: 'Un encadrement conçu pour les familles francophones',
  intro:
    'Explications en français, supports interactifs, objectifs mesurables, bilan de progression et accompagnement bienveillant — avec un parcours adapté à l’âge, au niveau et aux attentes de chaque famille.',
  audiences: [
    { label: 'Enfants de 5 à 8 ans', text: 'Éveil aux sons arabes, lettres, repérage visuel, courtes sourates, séances rythmées et ludiques.' },
    { label: 'Enfants de 9 à 14 ans', text: 'Lecture progressive, orthographe simple, mémorisation, notions de tajwīd et suivi des acquis.' },
    { label: 'Adolescents et adultes', text: 'Arabe standard moderne, compréhension de textes, expression orale, lecture coranique et perfectionnement.' },
  ],
  pedagogyTitle: 'Ce que change une pédagogie francophone',
  pedagogy: [
    'Consignes reformulées en français clair : l’élève comprend immédiatement l’objectif et la correction attendue.',
    'Ponts phonétiques ciblés : ح / ه, ع / أ, ق / ك, ص / س, ض / د, voyelles brèves et longues.',
    'Terminologie bilingue : lettre (ḥarf), voyelle courte (ḥaraka), prolongation (madd), point d’articulation (makhraj), révision (murājaʿa).',
    'Visioconférence avec partage d’écran, tableau numérique, cartes syllabiques, audios et exercices de répétition.',
    'Communication régulière aux parents : ce qui a été appris, points à revoir, devoir court et objectif suivant.',
  ],
  sessionTitle: 'Le déroulé d’une séance de 45 minutes',
  session: [
    { minutes: '5 min', activity: 'Accueil et rappel en français', goal: 'Réactiver les acquis' },
    { minutes: '10 min', activity: 'Phonétique et lecture', goal: 'Précision de la prononciation' },
    { minutes: '15 min', activity: 'Nouveau contenu arabe / Coran', goal: 'Acquérir une compétence' },
    { minutes: '10 min', activity: 'Mise en pratique guidée', goal: 'Automatiser sans surcharge' },
    { minutes: '5 min', activity: 'Bilan et devoir oral bref', goal: 'Consolider entre les cours' },
  ],
  reportTitle: 'Un compte rendu en français après chaque séance',
  reportIntro: 'Les parents savent toujours où en est leur enfant et quoi réviser, sans longues heures de devoirs.',
  report: [
    { label: 'Contenu étudié', text: 'lettres, mots, sourate ou règle précise' },
    { label: 'Réussites', text: 'deux points concrets observés' },
    { label: 'Point d’attention', text: 'une difficulté prioritaire, sans jugement' },
    { label: 'Devoir', text: '5 à 10 minutes de pratique ciblée' },
    { label: 'Prochaine étape', text: 'ce qui sera abordé au cours suivant' },
  ],
}

const en: ApproachContent = {
  eyebrow: 'Our approach',
  heading: 'Teaching designed for French-speaking families',
  intro:
    'Explanations in French, interactive materials, measurable goals, progress reviews and caring support — with a path adapted to each family’s age, level and expectations.',
  audiences: [
    { label: 'Children aged 5 to 8', text: 'Arabic sounds, letters, visual recognition, short surahs, lively and playful sessions.' },
    { label: 'Children aged 9 to 14', text: 'Step-by-step reading, simple spelling, memorisation, tajweed basics and progress tracking.' },
    { label: 'Teenagers and adults', text: 'Modern Standard Arabic, text comprehension, speaking, Quran reading and refinement.' },
  ],
  pedagogyTitle: 'What teaching in French changes',
  pedagogy: [
    'Instructions rephrased in clear French: students immediately understand the goal and the correction.',
    'Targeted sound bridges: ح / ه, ع / أ, ق / ك, ص / س, ض / د, short and long vowels.',
    'Bilingual terms: letter (ḥarf), short vowel (ḥaraka), lengthening (madd), point of articulation (makhraj), revision (murājaʿa).',
    'Video classes with screen sharing, a digital whiteboard, syllable cards, audio and repetition exercises.',
    'Regular updates for parents: what was learned, what to review, a short homework and the next goal.',
  ],
  sessionTitle: 'How a 45-minute class runs',
  session: [
    { minutes: '5 min', activity: 'Welcome and recap in French', goal: 'Reactivate what was learned' },
    { minutes: '10 min', activity: 'Phonetics and reading', goal: 'Accurate pronunciation' },
    { minutes: '15 min', activity: 'New Arabic / Quran content', goal: 'Gain a new skill' },
    { minutes: '10 min', activity: 'Guided practice', goal: 'Make it automatic without overload' },
    { minutes: '5 min', activity: 'Review and short oral homework', goal: 'Consolidate between classes' },
  ],
  reportTitle: 'A report in French after every class',
  reportIntro: 'Parents always know where their child stands and what to review, without hours of homework.',
  report: [
    { label: 'What we studied', text: 'letters, words, a surah or a specific rule' },
    { label: 'Successes', text: 'two concrete points observed' },
    { label: 'Focus point', text: 'one priority difficulty, without judgement' },
    { label: 'Homework', text: '5 to 10 minutes of targeted practice' },
    { label: 'Next step', text: 'what the next class will cover' },
  ],
}

export function getApproach(locale: Locale): ApproachContent {
  return locale === 'fr' ? fr : en
}
