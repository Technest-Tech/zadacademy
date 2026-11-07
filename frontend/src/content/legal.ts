import { siteConfig } from '@/config/site'
import type { Locale } from '@/i18n/config'

/**
 * Who publishes the site. French law (LCEN, art. 6-III) requires these details
 * on every professional website, and the privacy policy and terms point here.
 *
 * ⚠️ Fill in every empty field before advertising. An empty field is printed on
 * the legal pages as a highlighted "[À compléter]" so a gap cannot go unnoticed.
 */
export const legalEntity = {
  /** Who publishes the site. The academy is not registered as a company yet. */
  publisherName: { fr: 'Zad Academy — Académie d’arabe et de Coran', en: 'Zad Academy — Arabic and Quran Academy' },
  /** e.g. "Micro-entreprise", "SAS". Empty until the activity is registered: the line is then left out. */
  legalForm: '',
  address: { fr: 'Le Caire (Égypte) et Paris (France)', en: 'Cairo (Egypt) and Paris (France)' },
  /** SIRET / commercial register number. Empty until registered: the line is then left out. */
  registration: '',
  /** EU VAT number. Leave empty when not VAT-registered. */
  vatNumber: '',
  publicationDirector: { fr: 'La direction de Zad Academy', en: 'Zad Academy management' },
  /** Server that runs zadacademiq.com (IP 167.86.123.146). */
  hostName: 'Contabo GmbH',
  hostAddress: 'Aschauer Straße 32a, 81549 Munich, Allemagne',
  hostAddressEn: 'Aschauer Straße 32a, 81549 Munich, Germany',
  hostWebsite: 'contabo.com',
  /** Consumer mediator (Code de la consommation, art. L612-1). Empty until one is chosen: the sentence is left out. */
  consumerMediator: '',
}

export const LEGAL_UPDATED = { fr: '5 novembre 2026', en: 'November 5, 2026' } as const

export type LegalBlock =
  | string
  | { list: string[] }
  | { table: { head: string[]; rows: string[][] } }

export type LegalSection = { heading: string; body: LegalBlock[] }

export type LegalDoc = {
  eyebrow: string
  title: string
  updated: string
  intro?: string
  sections: LegalSection[]
}

/** Placeholder printed for a missing legal detail; LegalPage highlights it. */
export const PLACEHOLDER = { fr: '[À compléter]', en: '[To be completed]' } as const

function v(value: string, locale: Locale): string {
  return value.trim() || PLACEHOLDER[locale]
}

const contactLine = (locale: Locale) =>
  locale === 'fr'
    ? `E-mail : ${siteConfig.email} — WhatsApp : ${siteConfig.phone}`
    : `Email: ${siteConfig.email} — WhatsApp: ${siteConfig.phone}`

/* ───────────────────────── Mentions légales ───────────────────────── */

export function getLegalNotice(locale: Locale): LegalDoc {
  const e = legalEntity
  if (locale === 'fr') {
    return {
      eyebrow: 'Informations légales',
      title: 'Mentions légales',
      updated: `Dernière mise à jour : ${LEGAL_UPDATED.fr}`,
      sections: [
        {
          heading: 'Éditeur du site',
          body: [
            {
              list: [
                `Nom commercial : ${siteConfig.name} (${siteConfig.nameArabic})`,
                `Éditeur : ${e.publisherName.fr}`,
                ...(e.legalForm.trim() ? [`Forme juridique : ${e.legalForm}`] : []),
                `Adresse : ${e.address.fr}`,
                ...(e.registration.trim() ? [`Immatriculation : ${e.registration}`] : []),
                ...(e.vatNumber.trim() ? [`N° de TVA intracommunautaire : ${e.vatNumber}`] : []),
                `Directeur de la publication : ${e.publicationDirector.fr}`,
                contactLine('fr'),
              ],
            },
          ],
        },
        {
          heading: 'Hébergement',
          body: [
            {
              list: [
                `Hébergeur : ${v(e.hostName, 'fr')}`,
                `Adresse : ${v(e.hostAddress, 'fr')}`,
                `Site web : ${v(e.hostWebsite, 'fr')}`,
              ],
            },
          ],
        },
        {
          heading: 'Propriété intellectuelle',
          body: [
            `Les textes, logos, illustrations et supports pédagogiques publiés sur ${siteConfig.url.replace(/^https?:\/\//, '')} appartiennent à ${siteConfig.name} ou sont utilisés avec l’autorisation de leurs auteurs. Toute reproduction, même partielle, sans autorisation écrite préalable est interdite.`,
          ],
        },
        {
          heading: 'Données personnelles et cookies',
          body: [
            'La manière dont nous collectons et protégeons vos données, ainsi que l’usage des cookies, est décrite dans notre [politique de confidentialité](/privacy).',
          ],
        },
        {
          heading: 'Conditions de vente',
          body: ['Les conditions applicables aux cours et aux forfaits figurent dans nos [conditions générales](/terms).'],
        },
      ],
    }
  }
  return {
    eyebrow: 'Legal information',
    title: 'Legal notice',
    updated: `Last updated: ${LEGAL_UPDATED.en}`,
    sections: [
      {
        heading: 'Publisher',
        body: [
          {
            list: [
              `Trading name: ${siteConfig.name} (${siteConfig.nameArabic})`,
              `Publisher: ${e.publisherName.en}`,
              ...(e.legalForm.trim() ? [`Legal form: ${e.legalForm}`] : []),
              `Address: ${e.address.en}`,
              ...(e.registration.trim() ? [`Registration: ${e.registration}`] : []),
              ...(e.vatNumber.trim() ? [`EU VAT number: ${e.vatNumber}`] : []),
              `Publication director: ${e.publicationDirector.en}`,
              contactLine('en'),
            ],
          },
        ],
      },
      {
        heading: 'Hosting',
        body: [
          {
            list: [
              `Host: ${v(e.hostName, 'en')}`,
              `Address: ${v(e.hostAddressEn, 'en')}`,
              `Website: ${v(e.hostWebsite, 'en')}`,
            ],
          },
        ],
      },
      {
        heading: 'Intellectual property',
        body: [
          `The texts, logos, illustrations and teaching materials on ${siteConfig.url.replace(/^https?:\/\//, '')} belong to ${siteConfig.name} or are used with their authors’ permission. Reproducing them, even in part, without prior written permission is prohibited.`,
        ],
      },
      {
        heading: 'Personal data and cookies',
        body: ['How we collect and protect your data, and how we use cookies, is explained in our [privacy policy](/privacy).'],
      },
      {
        heading: 'Terms of sale',
        body: ['The terms that apply to classes and lesson packages are set out in our [terms and conditions](/terms).'],
      },
    ],
  }
}

/* ───────────────────────── Politique de confidentialité ───────────────────────── */

export function getPrivacyPolicy(locale: Locale): LegalDoc {
  const e = legalEntity
  if (locale === 'fr') {
    return {
      eyebrow: 'Vos données',
      title: 'Politique de confidentialité',
      updated: `Dernière mise à jour : ${LEGAL_UPDATED.fr}`,
      intro:
        'Nous collectons le minimum de données nécessaire pour organiser vos cours, et nous ne les vendons jamais. Cette page explique quelles données nous utilisons, pourquoi, combien de temps, et comment exercer vos droits.',
      sections: [
        {
          heading: '1. Responsable du traitement',
          body: [
            `${e.publisherName.fr} (voir les [mentions légales](/legal-notice)). Pour toute question sur vos données : ${siteConfig.email}.`,
          ],
        },
        {
          heading: '2. Les données que nous collectons',
          body: [
            {
              list: [
                'Formulaire de cours d’essai : nom, adresse e-mail, numéro de téléphone/WhatsApp, pays (déduit de l’indicatif), fuseau horaire, cours souhaité, cours pour un adulte ou un enfant, et votre message éventuel.',
                'Formulaire de contact et avis sur un enseignant : nom, adresse e-mail et contenu de votre message ou de votre avis.',
                'Échanges sur WhatsApp : votre numéro et le contenu de la conversation.',
                'Élèves inscrits : les informations nécessaires au suivi des cours (planning, présence, progression, forfaits achetés et paiements).',
                'Mesure d’audience interne : page consultée, page de provenance, paramètres de campagne (utm), langue. Votre adresse IP n’est pas conservée : elle est transformée en une empreinte qui change chaque jour. Un identifiant de session est gardé dans votre navigateur (sessionStorage) et disparaît à la fermeture de l’onglet.',
                'Cookies publicitaires et de mesure (Meta, Google, TikTok) : uniquement si vous les acceptez (voir la section 9).',
              ],
            },
          ],
        },
        {
          heading: '3. Pourquoi nous les utilisons',
          body: [
            {
              table: {
                head: ['Finalité', 'Base légale'],
                rows: [
                  ['Organiser votre cours d’essai et répondre à vos demandes', 'Mesures précontractuelles prises à votre demande (art. 6.1.b RGPD)'],
                  ['Donner les cours, assurer le suivi pédagogique, gérer les forfaits et les paiements', 'Exécution du contrat (art. 6.1.b) et obligations comptables (art. 6.1.c)'],
                  ['Statistiques de fréquentation anonymes, sécurité et lutte contre le spam', 'Intérêt légitime à faire fonctionner et protéger le site (art. 6.1.f)'],
                  ['Mesurer et améliorer nos publicités (Meta, Google, TikTok)', 'Votre consentement (art. 6.1.a), que vous pouvez retirer à tout moment'],
                ],
              },
            },
          ],
        },
        {
          heading: '4. Qui peut y accéder',
          body: [
            'Seuls notre équipe administrative et l’enseignant qui vous suit accèdent à vos données, et uniquement à ce qui leur est utile. Nous faisons aussi appel à des prestataires qui les traitent pour notre compte :',
            {
              list: [
                `Hébergement du site et de nos outils : ${v(e.hostName, 'fr')}.`,
                'PayPal : paiement des forfaits (nous ne conservons aucun numéro de carte).',
                'Web3Forms : envoi par e-mail à notre équipe des demandes reçues par formulaire.',
                'Meta (WhatsApp) : échanges avec l’équipe et les enseignants.',
                'Zoom, Google Meet ou Skype : la plateforme de visioconférence que vous choisissez pour les cours.',
                'Cloudflare (Turnstile) : protection anti-spam des formulaires de contact et d’avis.',
                'Meta, Google et TikTok : mesure publicitaire, seulement avec votre accord.',
              ],
            },
          ],
        },
        {
          heading: '5. Transferts hors de l’Union européenne',
          body: [
            'Une partie de notre équipe pédagogique et administrative est basée en Égypte, et certains prestataires (Meta, Google, TikTok, Cloudflare, Zoom) peuvent traiter des données hors de l’Union européenne. Ces transferts sont encadrés par une décision d’adéquation de la Commission européenne (par exemple le Data Privacy Framework pour les entreprises américaines certifiées) ou par les clauses contractuelles types de la Commission européenne.',
          ],
        },
        {
          heading: '6. Combien de temps nous les gardons',
          body: [
            {
              list: [
                'Demande de cours d’essai sans inscription : 3 ans après le dernier échange.',
                'Élèves : pendant toute la durée des cours, puis 3 ans.',
                'Factures et pièces comptables : 10 ans (obligation légale).',
                'Statistiques de fréquentation : 13 mois maximum.',
                'Votre choix sur les cookies : 6 mois, après quoi nous vous redemandons.',
                'Cookies publicitaires et de mesure : 13 mois maximum.',
              ],
            },
          ],
        },
        {
          heading: '7. Enfants',
          body: [
            'Pour un cours destiné à un enfant, le formulaire doit être rempli par un parent ou un responsable légal. Nous ne demandons sur l’enfant que ce qui est utile aux cours (prénom, âge, niveau).',
          ],
        },
        {
          heading: '8. Vos droits',
          body: [
            `Vous pouvez à tout moment demander l’accès à vos données, leur rectification ou leur effacement, limiter leur utilisation, vous y opposer, demander leur portabilité, retirer votre consentement, et définir des directives sur leur sort après votre décès. Écrivez-nous à ${siteConfig.email} : nous répondons sous un mois. Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL ([cnil.fr](https://www.cnil.fr)).`,
          ],
        },
        {
          heading: '9. Cookies et traceurs',
          body: [
            'Les cookies nécessaires au fonctionnement du site sont toujours actifs. Les autres ne sont déposés qu’après votre accord, que vous pouvez modifier à tout moment avec le lien « Gérer les cookies » en bas de chaque page.',
            {
              table: {
                head: ['Catégorie', 'Traceurs', 'Durée'],
                rows: [
                  ['Nécessaires', 'zad.lang (langue choisie), zad.consent (vos choix cookies), zad.sid (session, effacé à la fermeture de l’onglet)', '12 mois / 6 mois / session'],
                  ['Mesure d’audience', 'Google Analytics (_ga, _ga_*)', '13 mois maximum'],
                  ['Publicité', 'Meta Pixel (_fbp), Google Ads (_gcl_au), TikTok Pixel (_ttp)', '13 mois maximum'],
                ],
              },
            },
          ],
        },
        {
          heading: '10. Modifications',
          body: ['Nous pouvons mettre à jour cette politique ; la date de dernière mise à jour figure en haut de la page.'],
        },
      ],
    }
  }
  return {
    eyebrow: 'Your data',
    title: 'Privacy policy',
    updated: `Last updated: ${LEGAL_UPDATED.en}`,
    intro:
      'We collect the minimum data needed to organise your classes, and we never sell it. This page explains what we use, why, for how long, and how to exercise your rights.',
    sections: [
      {
        heading: '1. Data controller',
        body: [
          `${e.publisherName.en} (see the [legal notice](/legal-notice)). For any question about your data: ${siteConfig.email}.`,
        ],
      },
      {
        heading: '2. What we collect',
        body: [
          {
            list: [
              'Free trial form: name, email address, phone/WhatsApp number, country (from the dialling code), time zone, chosen course, whether the class is for an adult or a child, and any message you add.',
              'Contact form and teacher reviews: name, email address and the content of your message or review.',
              'WhatsApp conversations: your number and the content of the conversation.',
              'Enrolled students: what is needed to run the classes (schedule, attendance, progress, packages bought and payments).',
              'First-party audience statistics: page viewed, referring page, campaign parameters (utm) and language. Your IP address is not stored: it is reduced to a fingerprint that changes every day. A session id is kept in your browser (sessionStorage) and disappears when the tab is closed.',
              'Advertising and analytics cookies (Meta, Google, TikTok): only if you accept them (see section 9).',
            ],
          },
        ],
      },
      {
        heading: '3. Why we use it',
        body: [
          {
            table: {
              head: ['Purpose', 'Legal basis'],
              rows: [
                ['Arranging your free trial and answering your requests', 'Steps taken at your request before a contract (GDPR art. 6(1)(b))'],
                ['Teaching, following your progress, managing packages and payments', 'Performance of the contract (art. 6(1)(b)) and accounting obligations (art. 6(1)(c))'],
                ['Anonymous traffic statistics, security and spam prevention', 'Legitimate interest in running and protecting the site (art. 6(1)(f))'],
                ['Measuring and improving our advertising (Meta, Google, TikTok)', 'Your consent (art. 6(1)(a)), which you can withdraw at any time'],
              ],
            },
          },
        ],
      },
      {
        heading: '4. Who can access it',
        body: [
          'Only our admin team and your teacher can see your data, and only what they need. We also use service providers that process it on our behalf:',
          {
            list: [
              `Hosting of the site and our tools: ${v(e.hostName, 'en')}.`,
              'PayPal: payment for packages (we never store card numbers).',
              'Web3Forms: emails the requests received through our forms to our team.',
              'Meta (WhatsApp): conversations with our team and teachers.',
              'Zoom, Google Meet or Skype: the video platform you choose for classes.',
              'Cloudflare (Turnstile): spam protection on the contact and review forms.',
              'Meta, Google and TikTok: advertising measurement, only with your consent.',
            ],
          },
        ],
      },
      {
        heading: '5. Transfers outside the European Union',
        body: [
          'Part of our teaching and admin team is based in Egypt, and some providers (Meta, Google, TikTok, Cloudflare, Zoom) may process data outside the European Union. These transfers rely on a European Commission adequacy decision (such as the Data Privacy Framework for certified US companies) or on the European Commission’s standard contractual clauses.',
        ],
      },
      {
        heading: '6. How long we keep it',
        body: [
          {
            list: [
              'Free trial request without enrolment: 3 years after the last exchange.',
              'Students: for as long as classes continue, then 3 years.',
              'Invoices and accounting records: 10 years (legal obligation).',
              'Traffic statistics: 13 months at most.',
              'Your cookie choice: 6 months, after which we ask again.',
              'Advertising and analytics cookies: 13 months at most.',
            ],
          },
        ],
      },
      {
        heading: '7. Children',
        body: [
          'For a class for a child, the form must be filled in by a parent or legal guardian. We only ask what the classes need about the child (first name, age, level).',
        ],
      },
      {
        heading: '8. Your rights',
        body: [
          `You can ask at any time to access, correct or erase your data, restrict or object to its use, receive a portable copy, withdraw your consent, and leave instructions for after your death. Write to ${siteConfig.email}: we answer within one month. If you believe your rights have not been respected, you can complain to your data protection authority (in France, the CNIL: [cnil.fr](https://www.cnil.fr)).`,
        ],
      },
      {
        heading: '9. Cookies and trackers',
        body: [
          'Cookies the site needs to work are always on. The others are only set after you agree, and you can change your choice at any time with the “Cookie settings” link at the bottom of every page.',
          {
            table: {
              head: ['Category', 'Trackers', 'Lifetime'],
              rows: [
                ['Necessary', 'zad.lang (chosen language), zad.consent (your cookie choice), zad.sid (session, erased when the tab closes)', '12 months / 6 months / session'],
                ['Analytics', 'Google Analytics (_ga, _ga_*)', '13 months at most'],
                ['Advertising', 'Meta Pixel (_fbp), Google Ads (_gcl_au), TikTok Pixel (_ttp)', '13 months at most'],
              ],
            },
          },
        ],
      },
      {
        heading: '10. Changes',
        body: ['We may update this policy; the date of the latest update is shown at the top of the page.'],
      },
    ],
  }
}

/* ───────────────────────── Conditions générales ───────────────────────── */

export function getTerms(locale: Locale): LegalDoc {
  const e = legalEntity
  if (locale === 'fr') {
    return {
      eyebrow: 'Cours et forfaits',
      title: 'Conditions générales',
      updated: `Dernière mise à jour : ${LEGAL_UPDATED.fr}`,
      intro: `Ces conditions s’appliquent à l’utilisation du site ${siteConfig.url.replace(/^https?:\/\//, '')} et à l’achat de cours auprès de ${siteConfig.name}. En réservant un cours ou en achetant un forfait, vous les acceptez.`,
      sections: [
        {
          heading: '1. Les cours',
          body: [
            'Nous proposons des cours particuliers en ligne de Coran, de Tajwid, d’arabe et de sciences islamiques, pour adultes et enfants, en visioconférence (Zoom, Google Meet ou Skype). Il suffit d’une connexion internet stable et d’un appareil avec micro et, de préférence, une caméra.',
          ],
        },
        {
          heading: '2. Le cours d’essai gratuit',
          body: [
            'Le premier cours est gratuit, sans carte bancaire et sans engagement. Il sert à évaluer le niveau de l’élève et à proposer un programme. Un seul cours d’essai gratuit est accordé par élève.',
          ],
        },
        {
          heading: '3. Forfaits et prix',
          body: [
            'Les cours sont vendus par forfaits (un nombre de cours d’une durée donnée). Les prix en vigueur sont affichés sur la page [Tarifs](/pricing) en euros. Le forfait choisi et son prix vous sont confirmés par écrit (WhatsApp ou e-mail) avant tout paiement.',
          ],
        },
        {
          heading: '4. Commande et paiement',
          body: [
            'Vous commandez un forfait en nous contactant sur WhatsApp ou par e-mail. Le forfait est payé à l’avance, en euros, via PayPal (paiement par carte bancaire possible via PayPal). Les créneaux sont confirmés uniquement après réception du paiement. Nous ne conservons aucun numéro de carte bancaire.',
          ],
        },
        {
          heading: '5. Sans engagement, validité et suspension',
          body: [
            'Il n’y a ni abonnement ni reconduction automatique : vous achetez un nouveau forfait seulement si vous le souhaitez.',
            'La validité du forfait commence au premier cours suivant le cours d’essai. Toutes les séances doivent être utilisées dans un délai de 14 mois. Vous pouvez demander la suspension de votre forfait jusqu’à deux fois, en prévenant notre équipe.',
            'Si les cours sont interrompus plus de 60 jours sans prévenir l’équipe ni demander de suspension, les séances restantes peuvent être considérées comme expirées.',
          ],
        },
        {
          heading: '6. Annulation, report et retards',
          body: [
            'Un cours peut être annulé ou reporté sans frais en prévenant notre équipe au moins 24 heures à l’avance, par le canal habituel (WhatsApp). En dessous de 24 heures, la séance est considérée comme effectuée, sauf situation exceptionnelle validée par l’équipe.',
            'Le cours commence à l’heure prévue. En cas de retard de l’élève, le temps perdu n’est pas automatiquement rattrapé ; l’enseignant peut prolonger la séance s’il en a la possibilité. En cas de retard ou d’annulation de l’enseignant, le temps perdu est rattrapé ou la séance reprogrammée, sans être décomptée du forfait.',
          ],
        },
        {
          heading: '7. Problèmes techniques',
          body: [
            'Si le problème technique vient de notre côté ou de l’enseignant, le cours est reprogrammé ou compensé intégralement. Si le problème vient de l’élève (connexion, appareil…), nous faisons preuve de compréhension lors du premier incident sur un même forfait ; à partir du deuxième, les règles d’annulation et de retard peuvent s’appliquer.',
          ],
        },
        {
          heading: '8. Changement d’enseignant',
          body: [
            'Vous pouvez demander à changer d’enseignant. La demande est étudiée selon les disponibilités des enseignants et des créneaux.',
          ],
        },
        {
          heading: '9. Droit de rétractation et remboursement',
          body: [
            'Si vous êtes un consommateur résidant dans l’Union européenne, vous disposez de 14 jours à compter de l’achat d’un forfait pour vous rétracter, sans avoir à vous justifier, en nous l’indiquant par écrit (WhatsApp ou e-mail). Si vous avez demandé que les cours commencent pendant ce délai, seuls les cours déjà effectués restent dus. Le remboursement intervient sous 14 jours, par le moyen de paiement utilisé.',
            'Garantie « satisfait ou remboursé » : si, après le premier cours payant de votre premier forfait, vous n’êtes pas satisfait, prévenez-nous avant le deuxième cours et nous vous remboursons l’intégralité de ce premier forfait.',
            'Après ce délai : un remboursement intégral est possible si aucun cours du forfait n’a commencé. Après le premier cours, les séances effectuées sont facturées au tarif unitaire et le solde restant peut être remboursé, après déduction des éventuels frais de paiement ou de transfert. Aucun remboursement n’est accordé une fois plus de 25 % du forfait utilisé.',
          ],
        },
        {
          heading: '10. Enregistrement et comportement',
          body: [
            'Les cours ne sont pas enregistrés sans l’accord de l’élève (ou de son parent) et de l’enseignant. Nous pouvons mettre fin aux cours en cas de comportement irrespectueux envers un enseignant ou un élève ; les cours payés et non effectués sont alors remboursés.',
          ],
        },
        {
          heading: '11. Responsabilité',
          body: [
            'Nous nous engageons à fournir des cours de qualité avec des enseignants qualifiés (obligation de moyens). Les cas de problèmes techniques sont traités à l’article 7.',
          ],
        },
        {
          heading: '12. Propriété intellectuelle',
          body: ['Les supports transmis pendant les cours sont réservés à un usage personnel et ne peuvent pas être diffusés sans notre accord.'],
        },
        {
          heading: '13. Données personnelles',
          body: ['Le traitement de vos données est décrit dans notre [politique de confidentialité](/privacy).'],
        },
        {
          heading: '14. Réclamations et médiation',
          body: [
            `Pour toute réclamation, écrivez-nous à ${siteConfig.email} : nous cherchons d’abord une solution amiable. ${e.consumerMediator.trim() ? `Si elle n’aboutit pas, vous pouvez recourir gratuitement au médiateur de la consommation : ${e.consumerMediator}.` : 'Si elle n’aboutit pas, vous restez libre de saisir les juridictions compétentes.'}`,
          ],
        },
        {
          heading: '15. Droit applicable',
          body: [
            'Ces conditions sont soumises au droit français. Si vous êtes un consommateur, vous bénéficiez en plus des dispositions impératives de la loi de votre pays de résidence.',
          ],
        },
      ],
    }
  }
  return {
    eyebrow: 'Classes and packages',
    title: 'Terms and conditions',
    updated: `Last updated: ${LEGAL_UPDATED.en}`,
    intro: `These terms apply to the use of ${siteConfig.url.replace(/^https?:\/\//, '')} and to buying classes from ${siteConfig.name}. By booking a class or buying a package, you accept them.`,
    sections: [
      {
        heading: '1. The classes',
        body: [
          'We offer private online classes in Quran, Tajweed, Arabic and Islamic studies, for adults and children, by video call (Zoom, Google Meet or Skype). You need a stable internet connection and a device with a microphone and, ideally, a camera.',
        ],
      },
      {
        heading: '2. The free trial class',
        body: [
          'The first class is free, with no card and no commitment. It is used to assess the student’s level and propose a plan. One free trial class is given per student.',
        ],
      },
      {
        heading: '3. Packages and prices',
        body: [
          'Classes are sold as packages (a number of classes of a set length). Current prices are shown on the [Pricing](/pricing) page. The package you choose and its price are confirmed to you in writing (WhatsApp or email) before any payment.',
        ],
      },
      {
        heading: '4. Ordering and payment',
        body: [
          'You order a package by contacting us on WhatsApp or by email. Packages are paid in advance, in euros, via PayPal (you can pay by bank card through PayPal). Class slots are only confirmed once payment is received. We never store card numbers.',
        ],
      },
      {
        heading: '5. No commitment, validity and pausing',
        body: [
          'There is no subscription and no automatic renewal: you only buy another package if you want to.',
          'A package is valid from the first class after the free trial. All classes must be used within 14 months. You can ask to pause your package up to twice by telling our team.',
          'If classes stop for more than 60 days without telling the team or asking for a pause, the remaining classes may be treated as expired.',
        ],
      },
      {
        heading: '6. Cancelling, rescheduling and lateness',
        body: [
          'A class can be cancelled or rescheduled free of charge by telling our team at least 24 hours in advance through the usual channel (WhatsApp). With less notice, the class is counted as taken, except in exceptional situations approved by the team.',
          'Classes start on time. If the student is late, the lost time is not automatically made up; the teacher may extend the class if they can. If the teacher is late or cancels, the time is made up or the class rescheduled, and it is not deducted from the package.',
        ],
      },
      {
        heading: '7. Technical problems',
        body: [
          'If the problem is on our side or the teacher’s, the class is rescheduled or fully made up. If it is on the student’s side (connection, device…), we are understanding the first time it happens within a package; from the second time, the cancellation and lateness rules may apply.',
        ],
      },
      {
        heading: '8. Changing teacher',
        body: [
          'You can ask to change teacher. The request is handled according to teachers’ and time slots’ availability.',
        ],
      },
      {
        heading: '9. Right of withdrawal and refunds',
        body: [
          'If you are a consumer living in the European Union, you have 14 days from buying a package to withdraw, without giving a reason, by telling us in writing (WhatsApp or email). If you asked for classes to start during that period, only the classes already given remain payable. Refunds are made within 14 days, using the payment method you used.',
          'Money-back guarantee: if you are not satisfied after the first paid class of your first package, tell us before the second class and we refund that first package in full.',
          'After that period: a full refund is possible if no class from the package has started. After the first class, classes taken are charged at the single-class rate and the remaining balance can be refunded, minus any payment or transfer fees. No refund is given once more than 25% of the package has been used.',
        ],
      },
      {
        heading: '10. Recording and conduct',
        body: [
          'Classes are not recorded without the agreement of the student (or their parent) and the teacher. We may end classes in case of disrespectful behaviour towards a teacher or student; any paid classes not yet given are then refunded.',
        ],
      },
      {
        heading: '11. Liability',
        body: [
          'We are committed to providing quality classes with qualified teachers (best-efforts obligation). Technical problems are handled under section 7.',
        ],
      },
      {
        heading: '12. Intellectual property',
        body: ['Materials shared during classes are for personal use only and may not be distributed without our permission.'],
      },
      {
        heading: '13. Personal data',
        body: ['How we handle your data is described in our [privacy policy](/privacy).'],
      },
      {
        heading: '14. Complaints and mediation',
        body: [
          `For any complaint, write to ${siteConfig.email}: we first look for an amicable solution. ${e.consumerMediator.trim() ? `If that fails, you can refer the matter free of charge to the consumer mediator: ${e.consumerMediator}.` : 'If that fails, you remain free to bring the matter before the competent courts.'}`,
        ],
      },
      {
        heading: '15. Governing law',
        body: [
          'These terms are governed by French law. If you are a consumer, you also keep the protection of the mandatory rules of your country of residence.',
        ],
      },
    ],
  }
}
