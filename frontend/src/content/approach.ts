import type { Locale } from '@/i18n/config'

/** Short homepage strip: what teaching for French-speaking families looks like. */
export type ApproachContent = {
  heading: string
  points: { icon: 'Languages' | 'Clock' | 'FileText'; title: string; text: string }[]
}

const fr: ApproachContent = {
  heading: 'Un encadrement pensé pour les familles francophones',
  points: [
    {
      icon: 'Languages',
      title: 'Explications en français',
      text: 'Consignes et corrections en français clair, avec des repères pour les sons propres à l’arabe.',
    },
    {
      icon: 'Clock',
      title: 'Des séances de 45 minutes structurées',
      text: 'Rappel, lecture, nouveau contenu, pratique guidée et bilan : un rythme clair à chaque cours.',
    },
    {
      icon: 'FileText',
      title: 'Un compte rendu après chaque séance',
      text: 'Ce qui a été appris, le point à travailler et un devoir court de 5 à 10 minutes.',
    },
  ],
}

const en: ApproachContent = {
  heading: 'Teaching designed for French-speaking families',
  points: [
    {
      icon: 'Languages',
      title: 'Explanations in French',
      text: 'Instructions and corrections in clear French, with pointers for the sounds unique to Arabic.',
    },
    {
      icon: 'Clock',
      title: 'Structured 45-minute classes',
      text: 'Recap, reading, new content, guided practice and review: a clear rhythm every class.',
    },
    {
      icon: 'FileText',
      title: 'A report after every class',
      text: 'What was learned, the point to work on and a short 5 to 10 minute homework.',
    },
  ],
}

export function getApproach(locale: Locale): ApproachContent {
  return locale === 'fr' ? fr : en
}
