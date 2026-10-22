/**
 * All shop content in one typed place. Source of truth: the client's current site
 * (absolutetattooshop.com). Nothing here is invented: no prices, reviews, awards or artist names.
 */
import { FOUNDED_YEAR } from "@/lib/years";

/* -------------------------------------------------------------------------- */
/*  Shop                                                                      */
/* -------------------------------------------------------------------------- */

export const shop = {
  name: "Absolute Tattoos & Body Piercing",
  shortName: "Absolute Tattoos",
  owners: "Dan and Anna B.",
  founded: { year: FOUNDED_YEAR, month: "July", iso: "1994-07" },
  phone: { display: "402-293-8827", href: "tel:+14022938827", e164: "+14022938827" },
  email: "dbotsfordtat@yahoo.com",
  hours: "Call for hours",
  address: {
    street: "215 W. Mission Ave.",
    city: "Bellevue",
    region: "NE",
    regionName: "Nebraska",
    postalCode: "68005",
    country: "US",
  },
  geo: { lat: 41.136349, lng: -95.895999 },
  serviceArea: "the Omaha metro area and Iowa",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Absolute+Tattoos+%26+Body+Piercing%2C+215+W+Mission+Ave%2C+Bellevue%2C+NE+68005",
  socials: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/pages/Absolute-Tattoos-and-Body-Piercings/182359051783253",
    },
    { label: "Yelp", href: "https://www.yelp.com/biz/absolute-tattoos-bellevue" },
  ],
  /** Public URL of the new site, used for canonical, OG and JSON-LD. */
  siteUrl: "https://absolutetattooshop.com",
} as const;

export const coordsLabel = `${shop.geo.lat.toFixed(4)}° N / ${Math.abs(shop.geo.lng).toFixed(4)}° W`;

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

export type NavItem = { label: string; href: `#${string}` };

export const nav: NavItem[] = [
  { label: "Our Story", href: "#story" },
  { label: "Services", href: "#services" },
  { label: "Clean & Certified", href: "#clean" },
  { label: "Tattoos", href: "#tattoos" },
  { label: "Piercings", href: "#piercings" },
  { label: "Process", href: "#process" },
  { label: "Visit Us", href: "#visit" },
];

/* -------------------------------------------------------------------------- */
/*  Story: adapted from the owners' own words on the old home page            */
/* -------------------------------------------------------------------------- */

export type StoryBeat = { marker: string; kicker: string; title: string; body: string };

export const story = {
  /** Owners' quote, verbatim from the old site. */
  quote: "We are an Old School Mom & Pop business and hope to earn yours!",
  quoteBy: "Dan and Anna B., owners",
  beats: [
    {
      marker: "01",
      kicker: "Service",
      title: "U.S. Army",
      body: "Before the shop there was the Army. We're both military brats. Dan is a former Airborne Army Tanker (Hooah!) and Anna is a former Medical Assistant.",
    },
    {
      marker: "02",
      kicker: "Europe",
      title: "The apprenticeship",
      body: "That Army career included a tattooing apprenticeship in Europe. That's where the craft started.",
    },
    {
      marker: "03",
      kicker: "Bellevue, NE",
      title: "Back home",
      body: "Back in our hometown of Bellevue, Nebraska, we went to City Hall to ask about tattoo and body piercing regulations.",
    },
    {
      marker: "04",
      kicker: "July 1994",
      title: "The “For Rent” sign",
      body: "Walking out of City Hall, we spotted a “For Rent” sign on a commercial spot across the street. We rented it.",
    },
    {
      marker: "05",
      kicker: "Today",
      title: "Still here",
      body: "Same street, same family, same promise. We're still here.",
    },
  ] satisfies StoryBeat[],
};

/* -------------------------------------------------------------------------- */
/*  Services                                                                  */
/* -------------------------------------------------------------------------- */

/** `images`: pieces from the gallery shown in the hover preview (cycled) and inline on touch (first one). */
export type Service = { number: string; title: string; body: string; images: ImageId[] };

export const services: Service[] = [
  {
    number: "01",
    title: "Custom Tattoos",
    body: "Your idea, drawn for you. Fine line, black and grey, bold color. Every piece is made to fit you and built to last.",
    images: ["tattoo-21", "tattoo-37", "tattoo-22", "tattoo-34"],
  },
  {
    number: "02",
    title: "Portrait Tattoos",
    body: "People, pets and the ones you've lost, worked from your photos with the detail they deserve.",
    images: ["tattoo-20", "tattoo-24", "tattoo-35", "tattoo-02"],
  },
  {
    number: "03",
    title: "Body Piercing",
    body: "Ears, nose, lip, navel and more, by a state-licensed piercer using autoclave-sterilized tools.",
    images: ["piercing-11", "piercing-07", "piercing-02", "piercing-05"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Clean & Certified                                                         */
/* -------------------------------------------------------------------------- */

export const trust = {
  heading: ["Clean isn't", "optional."],
  intro:
    "Anna is a former Medical Assistant. Clean isn't a box we tick at Absolute. It's a habit, every single session.",
  points: [
    {
      title: "Autoclave sterilization",
      body: "Equipment is sterilized in an autoclave, the same kind of sterilizer used in medical settings.",
    },
    {
      title: "State-licensed & certified",
      body: "Our tattoo artist and piercer are state-licensed and certified.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Process: generic and accurate, no invented policies                      */
/* -------------------------------------------------------------------------- */

export const processSteps = [
  {
    step: "01",
    title: "Consult",
    body: "Call or stop by the shop. Tell us your idea, the placement and size, and ask us anything.",
  },
  {
    step: "02",
    title: "Design",
    body: "We turn your idea into a custom design made for you, and fine-tune it together before any ink.",
  },
  {
    step: "03",
    title: "Session",
    body: "Clean station, sterilized equipment, steady hands. The stencil goes on, you check placement, then we get to work.",
  },
  {
    step: "04",
    title: "Aftercare",
    body: "You leave knowing how to care for your new work. Questions while it heals? Just call.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Gallery: the client's own photos (downloaded originals, see scripts/)     */
/* -------------------------------------------------------------------------- */

/**
 * Frame size in the flash-wall grid. Strong high-res pieces get `feature` frames,
 * low-res originals (<500px) are kept to `small` frames so their weaknesses don't show.
 */
export type Tier = "feature" | "standard" | "small";

export type ImageId = `tattoo-${string}` | `piercing-${string}`;

export type GalleryItem = { id: ImageId; alt: string; tier: Tier; style?: string };

export const tattoos: GalleryItem[] = [
  { id: "tattoo-37", tier: "feature", style: "Black & grey", alt: "Black and grey mandala lion tattoo with an ornamental crown and hanging jewels" },
  { id: "tattoo-02", tier: "standard", style: "Realism", alt: "Realistic black and grey tiger portrait tattoo with blue eyes on the calf" },
  { id: "tattoo-22", tier: "standard", style: "Watercolor", alt: "Watercolor monarch butterfly tattoo with rainbow wings and paint splashes on the shoulder blade" },
  { id: "tattoo-08", tier: "feature", style: "Black & grey", alt: "Black and grey grim reaper tattoo with a scythe and red accents on the calf" },
  { id: "tattoo-20", tier: "standard", style: "Portrait", alt: "Realistic black and grey dog portrait tattoo with a red collar" },
  { id: "tattoo-03", tier: "standard", style: "Black & grey", alt: "Black and grey owl tattoo with roses and a heart-shaped lock and key on the upper arm" },
  { id: "tattoo-21", tier: "standard", style: "Color", alt: "Watercolor-style rainbow rose tattoo with dripping color on the calf" },
  { id: "tattoo-34", tier: "feature", style: "Traditional", alt: "Traditional color tattoo of a couple embracing with orange flowers and teal leaves, shown from two angles" },
  { id: "tattoo-04", tier: "standard", style: "Tribute", alt: "Black and grey battle cross memorial tattoo with boots, rifle, helmet, American flag and “Some Gave All” lettering on the upper arm" },
  { id: "tattoo-25", tier: "standard", style: "Black & grey", alt: "Black and grey Egyptian pharaoh tattoo on the calf" },
  { id: "tattoo-30", tier: "feature", style: "Sleeve", alt: "Black and grey forest sleeve tattoo with bare trees, birds and a full moon, shown from three angles" },
  { id: "tattoo-47", tier: "standard", style: "Black & grey", alt: "Black and grey half sleeve tattoo of a skull and motorcycle rider with lightning and a U.S.A. plate" },
  { id: "tattoo-45", tier: "standard", style: "Realism", alt: "Black and grey crowned lion tattoo on the forearm, shown from three angles" },
  { id: "tattoo-19", tier: "standard", style: "Realism", alt: "Realistic black and grey elephant tattoo on the upper arm, shown from three angles" },
  { id: "tattoo-23", tier: "standard", style: "Portrait", alt: "Two black and grey dog portrait tattoos on the upper arm, shown next to the reference photos" },
  { id: "tattoo-24", tier: "standard", style: "Portrait", alt: "Black and grey sad clown portrait tattoo on the forearm, shown next to the reference photo" },
  { id: "tattoo-48", tier: "standard", style: "Fine line", alt: "Fine-line tattoo of a little girl floating away holding a dandelion, on the forearm" },
  { id: "tattoo-31", tier: "standard", style: "Tribal", alt: "Bold black tribal-style eagle tattoo on the side, shown from two angles" },
  { id: "tattoo-38", tier: "standard", style: "Polynesian", alt: "Polynesian-style black tribal tattoo on the forearm, shown from three angles" },
  { id: "tattoo-07", tier: "standard", style: "Black & grey", alt: "Black and grey tattoo of two owls with hearts on a tree branch under a full moon, on the shoulder blade" },
  { id: "tattoo-05", tier: "standard", style: "Black & grey", alt: "Black and grey windmill and fence landscape tattoo under a full moon on the thigh" },
  { id: "tattoo-26", tier: "standard", style: "White ink", alt: "Subtle white-ink sugar skull tattoo with flowers on the forearm" },
  { id: "tattoo-16", tier: "standard", style: "Black & grey", alt: "Black and grey rose tattoo with “Still I rise” script on the forearm" },
  { id: "tattoo-43", tier: "standard", style: "Black & grey", alt: "Black and grey mother and baby elephant tattoo on the upper arm" },
  { id: "tattoo-27", tier: "standard", style: "Black & grey", alt: "Heart-shaped padlock tattoo with “True Love” banners in black and grey with red accents" },
  { id: "tattoo-28", tier: "standard", style: "Color", alt: "Color tattoo of a classic blue muscle car under a full moon on the shoulder" },
  { id: "tattoo-29", tier: "standard", style: "Matching", alt: "Matching mother and daughter tattoos of blue roses with “I love you most” and “I love you more” script" },
  { id: "tattoo-01", tier: "standard", style: "Black & grey", alt: "Black and grey tattoo of four silhouetted figures walking beneath bare trees on the upper arm" },
  { id: "tattoo-06", tier: "small", style: "Color", alt: "Color four-leaf clover vine tattoo with teal, yellow and pink clovers on the ankle" },
  { id: "tattoo-44", tier: "small", style: "Watercolor", alt: "Watercolor owl tattoo with rainbow paint splashes and script on the upper arm" },
  { id: "tattoo-35", tier: "small", style: "Portrait", alt: "Black and grey memorial portrait tattoo of a soldier in uniform, 1921–2011, shown next to the original photo" },
  { id: "tattoo-17", tier: "small", style: "Memorial", alt: "Memorial ribbon tattoo with blue and purple angel wings, a halo and “Gone but not forgotten” script on the calf" },
  { id: "tattoo-18", tier: "small", style: "Black & grey", alt: "Black and grey tattoo of a figure seated on a throne, upper arm half sleeve" },
  { id: "tattoo-12", tier: "small", style: "Black & grey", alt: "Black and grey skull on a book with a candle, roses and a script quote on the ribs" },
  { id: "tattoo-11", tier: "small", style: "Black & grey", alt: "Black and grey tattoo of Jesus with a crown of thorns over a radiant cross" },
  { id: "tattoo-09", tier: "small", style: "Neo-traditional", alt: "Neo-traditional woman's portrait in a gold cameo frame with a red rose on the top of the foot" },
  { id: "tattoo-10", tier: "small", style: "Black & grey", alt: "Black and grey sugar-skull style woman with roses on the upper arm" },
  { id: "tattoo-13", tier: "small", style: "Tribute", alt: "Black and grey military tribute tattoo with “Freedom is not free” lettering on the upper arm" },
  { id: "tattoo-32", tier: "small", style: "Color", alt: "Cheshire Cat grin tattoo with blue fur and “We're all mad here” lettering on the upper arm" },
  { id: "tattoo-33", tier: "small", style: "Color", alt: "Color Joker portrait tattoo with green hair on the upper arm" },
  { id: "tattoo-36", tier: "small", style: "Black & grey", alt: "Black and grey pin-up silhouette tattoo on the forearm" },
  { id: "tattoo-14", tier: "small", style: "Black & grey", alt: "Black and grey dragon tattoo with Chinese characters on the forearm" },
  { id: "tattoo-42", tier: "small", style: "Realism", alt: "Snarling black and grey tiger face tattoo" },
  { id: "tattoo-41", tier: "small", style: "Color", alt: "Color tattoo of a bluebird in flight with spread wings" },
  { id: "tattoo-40", tier: "small", style: "Color", alt: "Red rose tattoo with black and grey filigree" },
  { id: "tattoo-39", tier: "small", style: "Script", alt: "Orange awareness ribbon tattoo with “Survivor” script on the top of the foot" },
  { id: "tattoo-15", tier: "small", style: "Color", alt: "Color sugar skull tattoo with teal filigree on the forearm" },
];
// Note: tattoo-46 is a lower-res duplicate of tattoo-23 and is intentionally not shown.

export const piercings: GalleryItem[] = [
  { id: "piercing-11", tier: "feature", style: "Ear", alt: "Rook barbell and two conch rings on the ear" },
  { id: "piercing-07", tier: "standard", style: "Industrial", alt: "Industrial barbell across the upper ear with crystal lobe studs" },
  { id: "piercing-02", tier: "standard", style: "Navel", alt: "Navel piercing with a double-gem curved barbell" },
  { id: "piercing-05", tier: "standard", style: "Septum", alt: "Septum piercing with a horseshoe ring" },
  { id: "piercing-10", tier: "standard", style: "Ear", alt: "Helix ring with a flat helix stud and stacked lobe studs" },
  { id: "piercing-06", tier: "standard", style: "Ear", alt: "Helix stud, rook barbell and three graduated lobe gems" },
  { id: "piercing-03", tier: "standard", style: "Labret", alt: "Smiling client with a lower-lip labret piercing" },
  { id: "piercing-12", tier: "standard", style: "Ear", alt: "Curated ear with a daith ring, rook and helix studs" },
  { id: "piercing-01", tier: "standard", style: "Ear", alt: "Helix hoop and a gem stud in the conch" },
  { id: "piercing-09", tier: "standard", style: "Ear", alt: "Several captive bead rings with colored gems in the inner ear" },
  { id: "piercing-04", tier: "standard", style: "Ear", alt: "Forward helix stud on the ear" },
  { id: "piercing-08", tier: "standard", style: "Ear", alt: "Captive bead ring with a gem and stacked lobe studs" },
];

/** Hero centerpiece: the strongest, highest-resolution original (1545×2176). */
export const heroImage: GalleryItem = tattoos[0];

/* -------------------------------------------------------------------------- */
/*  SEO                                                                       */
/* -------------------------------------------------------------------------- */

export const seo = {
  title: "Tattoo Shop in Bellevue, NE | Absolute Tattoos & Body Piercing, Omaha Metro",
  description:
    "Custom tattoos, portrait tattoos and body piercing in Bellevue, Nebraska, serving Omaha and Iowa since 1994. Autoclave sterilization, state-licensed and certified artist and piercer. Call 402-293-8827.",
  keywords: [
    "tattoo shop Bellevue NE",
    "tattoos Omaha",
    "body piercing Omaha",
    "portrait tattoos Nebraska",
    "custom tattoos Omaha",
    "piercing Bellevue Nebraska",
  ],
};
