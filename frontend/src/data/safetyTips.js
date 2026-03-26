/**
 * Static data: Safety tips for travellers.
 * Organised into categories for the SafetyTipsPage.
 *
 * DATA SHAPE:
 * ───────────
 * category   : string  — Group heading
 * tips[]     : array   — Individual tip objects
 *   .icon    : LucideIcon
 *   .title   : string
 *   .text    : string
 */
import {
  Shield,
  Phone,
  AlertTriangle,
  MapPin,
  Wallet,
  Users,
  Heart,
  Wifi,
  Sun,
  Droplets,
  Car,
  Camera,
  Lock,
  Compass,
  Clock,
  FileText,
} from 'lucide-react';

const safetyTips = [
  /* ── Scam Awareness ───────────────────────────── */
  {
    category: 'Scam Awareness',
    categoryIcon: AlertTriangle,
    tips: [
      {
        icon: AlertTriangle,
        title: 'Taxi & Auto Overcharging',
        text: 'Always insist on the meter or negotiate the fare before boarding. Use ride-hailing apps like Ola or Uber for transparent pricing.',
      },
      {
        icon: Shield,
        title: 'Fake Tour Guides',
        text: 'At major monuments, only hire guides with government-issued ID badges. Ignore unsolicited offers from strangers claiming to be "official" guides.',
      },
      {
        icon: Wallet,
        title: 'ATM & Card Skimming',
        text: 'Use ATMs inside bank branches. Cover the keypad while entering your PIN and avoid machines with loose card slots or suspicious attachments.',
      },
      {
        icon: Camera,
        title: '"Free" Photo Scams',
        text: 'People offering to take your photo or placing items on you for a "free" picture will demand money afterwards. Politely decline.',
      },
    ],
  },

  /* ── Emergency Info ───────────────────────────── */
  {
    category: 'Emergency Information',
    categoryIcon: Phone,
    tips: [
      {
        icon: Phone,
        title: 'Essential Numbers',
        text: 'Police: 100 | Ambulance: 108 | Fire: 101 | Tourist Helpline: 1363 | Women Helpline: 1091 | Railway Enquiry: 139.',
      },
      {
        icon: FileText,
        title: 'Keep Digital Copies',
        text: 'Store scanned copies of your passport, visa, travel insurance, and emergency contacts in cloud storage or email them to yourself.',
      },
      {
        icon: MapPin,
        title: 'Register with Your Embassy',
        text: 'Foreign tourists should register with their country\'s embassy or consulate in India for emergency assistance.',
      },
    ],
  },

  /* ── Solo Travel ──────────────────────────────── */
  {
    category: 'Solo Travel Tips',
    categoryIcon: Compass,
    tips: [
      {
        icon: MapPin,
        title: 'Share Your Location',
        text: 'Share live GPS location with a trusted family member or friend. Use offline maps (Google Maps or maps.me) in areas with poor connectivity.',
      },
      {
        icon: Users,
        title: 'Choose Trusted Accommodations',
        text: 'Book verified accommodations on established platforms. Read recent reviews. Avoid isolated guesthouses late at night.',
      },
      {
        icon: Clock,
        title: 'Avoid Late Night Travel',
        text: 'Try to arrive at new cities during daylight. Avoid empty train compartments at night. Pre-book transport from airports or stations.',
      },
      {
        icon: Lock,
        title: 'Secure Your Belongings',
        text: 'Use padlocks on hostel lockers. Carry a money belt for cash and cards, and keep valuables in your hotel safe.',
      },
    ],
  },

  /* ── Health & Wellness ────────────────────────── */
  {
    category: 'Health & Wellness',
    categoryIcon: Heart,
    tips: [
      {
        icon: Droplets,
        title: 'Drink Safe Water',
        text: 'Stick to sealed bottled water or use a portable purifier. Avoid ice in drinks from street stalls. Check bottle seals before buying.',
      },
      {
        icon: Sun,
        title: 'Sun & Heat Protection',
        text: 'India can be extremely hot. Wear sunscreen (SPF 50+), carry a hat, stay hydrated, and rest during peak afternoon hours.',
      },
      {
        icon: Heart,
        title: 'Travel Insurance',
        text: 'Always carry comprehensive travel insurance that covers medical emergencies, trip cancellations, and theft. Save the policy number on your phone.',
      },
    ],
  },

  /* ── Practical Travel Advice ──────────────────── */
  {
    category: 'Practical Travel Advice',
    categoryIcon: Compass,
    tips: [
      {
        icon: Wifi,
        title: 'Get a Local SIM',
        text: 'Buy a prepaid SIM card from Jio or Airtel at the airport. You\'ll need your passport and a passport-sized photo. Data is extremely affordable.',
      },
      {
        icon: Car,
        title: 'Transport Tips',
        text: 'Indian Railways is the backbone of travel. Book trains on the IRCTC app well in advance. For shorter distances, use state buses or local ride-hailing apps.',
      },
      {
        icon: Compass,
        title: 'Respect Local Customs',
        text: 'Dress modestly at religious sites. Remove shoes before entering temples. Ask before photographing people. Tipping 10% is standard at restaurants.',
      },
      {
        icon: Wallet,
        title: 'Carry Cash in Small Bills',
        text: 'Many local shops and auto drivers prefer cash. Keep small denominations (₹10, ₹20, ₹50, ₹100) handy. UPI (Google Pay, PhonePe) is widely accepted in cities.',
      },
    ],
  },
];

export default safetyTips;
