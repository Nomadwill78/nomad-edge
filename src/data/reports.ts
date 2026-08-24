// Hand-written market reports for the MVP.
// No AI yet — the goal is to prove people will pay before automating.
// Money figures are framed as typical local price ranges, NOT income promises.

export type Opportunity = {
  name: string;
  priceRange: string; // typical price customers pay locally
  demand: "High" | "Medium" | "Low";
  customers: string;
  whyHere: string;
};

export type Channel = {
  name: string;
  why: string;
  firstAction: string;
};

export type Report = {
  zip: string;
  city: string;
  state: string;
  areaType: string;
  snapshot: string;
  summary: string; // the "read this first" strategy
  opportunities: Opportunity[];
  marketDemand: "High" | "Medium" | "Low";
  competition: "High" | "Medium" | "Low";
  keyInsight: string;
  channels: Channel[];
  quickStart: { day1: string[]; day2: string[] };
  avoid: string[];
  edge: string;
};

// A small set of real, hand-written reports.
const REPORTS: Record<string, Report> = {
  "38103": {
    zip: "38103",
    city: "Memphis",
    state: "TN",
    areaType: "Urban / Downtown",
    snapshot: "Mixed downtown residents and professionals, apartment-heavy near the core.",
    summary:
      "The fastest realistic path here is a recurring, convenience-based local service aimed at busy downtown households — the kind of work people happily pay to not do themselves.",
    opportunities: [
      {
        name: "Residential & Move-Out Cleaning",
        priceRange: "$110–$260 per job",
        demand: "High",
        customers: "Renters, busy professionals, small landlords turning units",
        whyHere:
          "Apartment-dense downtown means constant move-ins and move-outs, which drives steady cleaning demand year-round.",
      },
      {
        name: "Mobile Car Detailing",
        priceRange: "$80–$200 per vehicle",
        demand: "Medium",
        customers: "Professionals who value time over money",
        whyHere:
          "Limited driveway space and busy schedules make a service that comes to them attractive.",
      },
      {
        name: "Senior Errand & Assistance Services",
        priceRange: "$25–$45 per hour",
        demand: "Medium",
        customers: "Older residents and their out-of-town family members",
        whyHere:
          "An aging population with adult children living elsewhere creates ongoing demand for trusted local help.",
      },
    ],
    marketDemand: "High",
    competition: "Medium",
    keyInsight:
      "Downtown's density rewards services that are recurring and easy to book. Retention beats one-off jobs here.",
    channels: [
      {
        name: "Local Facebook & Nextdoor Groups",
        why: "Neighborhood groups are where downtown residents ask for recommendations first.",
        firstAction:
          "Join 3–5 Memphis neighborhood groups and post a short, friendly intro with clear pricing.",
      },
      {
        name: "Apartment Community Partnerships",
        why: "Leasing offices need reliable move-out cleaners and will refer you repeatedly.",
        firstAction:
          "Visit 5 nearby leasing offices and leave a one-page flyer with your rate and phone number.",
      },
      {
        name: "Google Business Profile",
        why: "Ranks you in 'near me' searches at effectively no cost.",
        firstAction: "Create a free Google Business Profile and ask your first 3 customers for reviews.",
      },
    ],
    quickStart: {
      day1: [
        "Pick ONE service above and set a simple price.",
        "Create a free Google Business Profile.",
        "Join 3 local Facebook/Nextdoor groups.",
      ],
      day2: [
        "Post your intro + pricing in each group.",
        "Drop flyers at 5 apartment leasing offices.",
        "Message 10 people you know that you're now offering this.",
      ],
    },
    avoid: [
      "Generic lawn care — heavily saturated and seasonal downtown.",
      "Competing on lowest price; downtown buyers care more about reliability.",
    ],
    edge:
      "Position yourself as the reliable, recurring option for busy downtown households. Consistency and easy re-booking are your real advantage.",
  },

  "37203": {
    zip: "37203",
    city: "Nashville",
    state: "TN",
    areaType: "Urban / Entertainment District",
    snapshot: "Tourists, young renters, and hospitality workers, with heavy short-term-rental activity.",
    summary:
      "The fastest realistic path here is a service tied to the constant churn of short-term rentals and busy hospitality schedules — turnovers, cleaning, and convenience.",
    opportunities: [
      {
        name: "Short-Term Rental Turnover Cleaning",
        priceRange: "$75–$180 per turnover",
        demand: "High",
        customers: "Airbnb / VRBO hosts and property managers",
        whyHere:
          "A large downtown short-term-rental market needs fast, dependable turnovers between guests — often on tight same-day windows.",
      },
      {
        name: "Mobile Car Detailing",
        priceRange: "$80–$200 per vehicle",
        demand: "Medium",
        customers: "Professionals and rideshare drivers",
        whyHere:
          "A busy rideshare and tourism scene means drivers need clean vehicles and value a service that comes to them.",
      },
      {
        name: "Handyman & Furniture Assembly",
        priceRange: "$60–$150 per job",
        demand: "Medium",
        customers: "New renters and short-term-rental hosts",
        whyHere:
          "Constant move-ins and rental setups drive steady demand for small fixes and assembly.",
      },
    ],
    marketDemand: "High",
    competition: "High",
    keyInsight:
      "The short-term-rental economy is the engine here. Build around hosts who need dependable, on-time help and you get recurring work.",
    channels: [
      {
        name: "Short-Term-Rental Host Groups",
        why: "Local Airbnb host Facebook groups are where owners look for reliable cleaners first.",
        firstAction: "Join 3–5 Nashville host groups and offer a dependable turnover service with clear pricing.",
      },
      {
        name: "Cleaner Marketplaces (Turno, etc.)",
        why: "Hosts actively search these platforms for turnover cleaners.",
        firstAction: "Create a profile and take your first few jobs to build reviews.",
      },
      {
        name: "Google Business Profile",
        why: "Ranks you in 'near me' searches at no cost.",
        firstAction: "Set up the free profile and collect reviews from your first hosts.",
      },
    ],
    quickStart: {
      day1: [
        "Pick turnovers or cleaning and set a simple per-job price.",
        "Create a free Google Business Profile.",
        "Join 3 Nashville short-term-rental host groups.",
      ],
      day2: [
        "Post a dependable-turnover offer in each group.",
        "Create a cleaner-marketplace profile.",
        "Message 5 hosts directly offering your first slots.",
      ],
    },
    avoid: [
      "Generic lawn care — saturated and off-focus downtown.",
      "One-off tourist gimmicks with no repeat business.",
    ],
    edge:
      "Become the reliable turnover partner for a handful of hosts. A few recurring properties beats endlessly chasing one-off jobs.",
  },

  "30309": {
    zip: "30309",
    city: "Atlanta",
    state: "GA",
    areaType: "Urban / High-Income",
    snapshot: "Affluent professionals in Midtown high-rises and condos — time-poor and pet-heavy.",
    summary:
      "The fastest realistic path here is convenience services for time-poor professionals — pet care, recurring cleaning, and errands they happily outsource.",
    opportunities: [
      {
        name: "Dog Walking & Pet Sitting",
        priceRange: "$20–$40 per visit",
        demand: "High",
        customers: "Condo-dwelling professionals and frequent travelers",
        whyHere:
          "High-rise pet owners with long workdays need dependable midday walks and travel coverage.",
      },
      {
        name: "Recurring Home Cleaning",
        priceRange: "$120–$280 per visit",
        demand: "High",
        customers: "Dual-income professionals",
        whyHere:
          "High disposable income plus little free time makes recurring cleaning an easy yes.",
      },
      {
        name: "Personal Errand / Concierge",
        priceRange: "$25–$50 per hour",
        demand: "Medium",
        customers: "Busy executives",
        whyHere:
          "People here readily pay to buy back their time on everyday tasks.",
      },
    ],
    marketDemand: "High",
    competition: "High",
    keyInsight:
      "Sell time, not tasks. Recurring, trust-based relationships win with this crowd — and density means referrals travel fast.",
    channels: [
      {
        name: "Building & Concierge Partnerships",
        why: "High-rise concierge desks refer trusted vendors to residents repeatedly.",
        firstAction: "Introduce yourself to 5 nearby building front desks with a simple flyer.",
      },
      {
        name: "Rover / Wag + Nextdoor",
        why: "Where local pet owners and neighbors search for help.",
        firstAction: "Set up profiles and ask early clients for reviews.",
      },
      {
        name: "Google Business Profile",
        why: "Free visibility in local 'near me' searches.",
        firstAction: "Create the profile and gather your first reviews.",
      },
    ],
    quickStart: {
      day1: [
        "Choose pet care or cleaning and set your rate.",
        "Create a free Google Business Profile.",
        "Set up a Rover/Wag or Nextdoor profile.",
      ],
      day2: [
        "Introduce yourself to 5 building front desks.",
        "Post in 3 Midtown Nextdoor/Facebook groups.",
        "Line up your first recurring weekly client.",
      ],
    },
    avoid: [
      "Competing on lowest price — this market values reliability over cheap.",
      "Sporadic availability; recurring clients want a dependable schedule.",
    ],
    edge:
      "Lock in recurring weekly clients within a few buildings. Concentrated, repeat relationships compound through referrals.",
  },

  "78704": {
    zip: "78704",
    city: "Austin",
    state: "TX",
    areaType: "Urban / Creative",
    snapshot: "Young professionals, creatives, and gig workers — event-heavy and outdoorsy.",
    summary:
      "The fastest realistic path here rides Austin's event calendar and active-lifestyle crowd: mobile, flexible, weekend-friendly services.",
    opportunities: [
      {
        name: "Event Setup & Cleanup",
        priceRange: "$150–$500 per event",
        demand: "Medium",
        customers: "Party hosts and small venues",
        whyHere:
          "A constant stream of events, festivals, and gatherings creates reliable weekend demand.",
      },
      {
        name: "Mobile Bike & E-Scooter Repair",
        priceRange: "$40–$120 per job",
        demand: "Medium",
        customers: "Commuters and students",
        whyHere:
          "A bike-heavy, car-light neighborhood keeps repair and tune-up demand steady.",
      },
      {
        name: "Pressure Washing & Exterior Cleaning",
        priceRange: "$150–$400 per job",
        demand: "Medium",
        customers: "Homeowners and small storefronts",
        whyHere:
          "Patios, decks, and busy storefronts in a social, outdoor area need regular refreshing.",
      },
    ],
    marketDemand: "Medium",
    competition: "Medium",
    keyInsight:
      "Weekends and events are your peak. Build a service the local social calendar actually needs and lean into it.",
    channels: [
      {
        name: "Local Instagram & Event Groups",
        why: "Austin runs on Instagram and event Facebook groups for local recommendations.",
        firstAction: "Post your service in 3–5 local event/neighborhood groups with photos.",
      },
      {
        name: "Storefront & Small-Business Outreach",
        why: "Local businesses need recurring exterior cleaning and event help.",
        firstAction: "Visit 10 nearby storefronts and offer a first-time rate.",
      },
      {
        name: "Google Business Profile",
        why: "Free ranking in local searches.",
        firstAction: "Create the profile and collect early reviews.",
      },
    ],
    quickStart: {
      day1: [
        "Pick an event or exterior-cleaning niche and set pricing.",
        "Create a free Google Business Profile.",
        "Set up a simple Instagram with before/after photos.",
      ],
      day2: [
        "Post in 3 local event/neighborhood groups.",
        "Visit 10 storefronts with a first-time offer.",
        "Book your first weekend job — even at a starter rate for photos.",
      ],
    },
    avoid: [
      "Rigid 9-to-5-only availability; the demand here is nights and weekends.",
      "Generic cleaning with no niche — too crowded to stand out.",
    ],
    edge:
      "Own a weekend niche (events or exteriors) that most competitors underserve, and let your photos do the selling.",
  },

  "85251": {
    zip: "85251",
    city: "Scottsdale",
    state: "AZ",
    areaType: "Suburban / Affluent",
    snapshot: "High-income households with many retirees and seasonal 'snowbird' residents — lots of pools and second homes.",
    summary:
      "The fastest realistic path here is premium home and personal services for affluent and seasonal residents — home-watch, senior help, and outdoor upkeep.",
    opportunities: [
      {
        name: "Home-Watch / Seasonal Property Checks",
        priceRange: "$50–$150 per visit",
        demand: "High",
        customers: "Snowbirds and second-home owners",
        whyHere:
          "Many homes sit empty in the off-season, and owners pay well for regular checks and peace of mind.",
      },
      {
        name: "Senior Errand & Companion Services",
        priceRange: "$25–$50 per hour",
        demand: "High",
        customers: "Retirees, often with family out of state",
        whyHere:
          "A large retiree population creates steady demand for trusted local help.",
      },
      {
        name: "Pool & Outdoor Maintenance",
        priceRange: "$100–$250 per month",
        demand: "Medium",
        customers: "Homeowners",
        whyHere:
          "Nearly every home has a pool in the desert climate, creating recurring maintenance work.",
      },
    ],
    marketDemand: "High",
    competition: "Medium",
    keyInsight:
      "Trust and reliability command premium pricing here. This market pays for peace of mind, not the lowest bid.",
    channels: [
      {
        name: "HOA & Gated-Community Referrals",
        why: "Word travels fast in affluent communities, and boards refer trusted vendors.",
        firstAction: "Reach out to 5 nearby HOAs and offer a reliable home-watch service.",
      },
      {
        name: "Realtor & Senior-Center Partnerships",
        why: "Realtors and senior centers regularly refer trustworthy local help.",
        firstAction: "Introduce yourself to a few local realtors and one senior center.",
      },
      {
        name: "Google Business Profile",
        why: "Free visibility, and reviews build the trust this market needs.",
        firstAction: "Create the profile and ask early clients for detailed reviews.",
      },
    ],
    quickStart: {
      day1: [
        "Pick home-watch or senior help and set a professional rate.",
        "Create a free Google Business Profile.",
        "List the gated communities and HOAs nearby.",
      ],
      day2: [
        "Reach out to 5 HOAs and 3 realtors.",
        "Introduce yourself to a local senior center.",
        "Secure your first client and over-deliver for a strong review.",
      ],
    },
    avoid: [
      "Budget or lowest-price positioning; it signals the wrong thing here.",
      "Unreliable scheduling — one missed check can end a premium relationship.",
    ],
    edge:
      "Build a trusted reputation with a few affluent clients. In these communities, referrals are the whole game.",
  },

  "75024": {
    zip: "75024",
    city: "Plano",
    state: "TX",
    areaType: "Suburban / Family",
    snapshot: "Family households with kids and good schools — dual-income, lots of homes and yards.",
    summary:
      "The fastest realistic path here is family- and home-oriented services parents happily outsource — tutoring, cleaning, and home upkeep.",
    opportunities: [
      {
        name: "Tutoring & Test Prep",
        priceRange: "$30–$75 per hour",
        demand: "High",
        customers: "Parents of school-age kids",
        whyHere:
          "Education-focused families invest heavily in their kids' success, especially around test season.",
      },
      {
        name: "Recurring House Cleaning",
        priceRange: "$120–$250 per visit",
        demand: "High",
        customers: "Dual-income families",
        whyHere:
          "Busy two-income households readily outsource chores to reclaim family time.",
      },
      {
        name: "Lawn Care & Seasonal Yard Work",
        priceRange: "$40–$120 per visit",
        demand: "Medium",
        customers: "Homeowners",
        whyHere:
          "Lots of single-family homes with yards — competitive, so differentiate on reliability and communication.",
      },
    ],
    marketDemand: "High",
    competition: "Medium",
    keyInsight:
      "Parents pay for anything that helps their kids or buys back family time. Trust and consistency turn into long-term clients.",
    channels: [
      {
        name: "School & PTA Facebook Groups",
        why: "Parents ask each other for recommendations here constantly.",
        firstAction: "Join local school/PTA groups and share your service with clear pricing.",
      },
      {
        name: "Nextdoor Neighborhood Referrals",
        why: "Neighborhood word-of-mouth drives family-service bookings.",
        firstAction: "Post an intro on Nextdoor and ask early clients to recommend you.",
      },
      {
        name: "Google Business Profile",
        why: "Free ranking for local 'near me' searches.",
        firstAction: "Create the profile and gather reviews from your first families.",
      },
    ],
    quickStart: {
      day1: [
        "Pick tutoring, cleaning, or yard care and set a rate.",
        "Create a free Google Business Profile.",
        "Join 3 local school/PTA and neighborhood groups.",
      ],
      day2: [
        "Post your service with pricing in each group.",
        "Ask 10 people you know for a referral.",
        "Book your first family client and ask for a review.",
      ],
    },
    avoid: [
      "Competing only on price in lawn care — it's a race to the bottom.",
      "Ignoring the school-year calendar; time your offers to it.",
    ],
    edge:
      "Become the trusted, referred provider inside a few neighborhood parent networks. One happy family brings the next three.",
  },
};

// Broad fallback profiles so ANY ZIP returns a useful preview during the MVP.
// (Later this gets replaced by real data + AI.)
function fallbackReport(zip: string): Report {
  return {
    zip,
    city: "Your Area",
    state: "",
    areaType: "Mixed",
    snapshot: "A mix of households and small businesses with everyday service needs.",
    summary:
      "The most realistic starting point in most areas is a recurring local service that solves a boring, repeated problem — cleaning, hauling, or personal help.",
    opportunities: [
      {
        name: "Residential Cleaning",
        priceRange: "$100–$250 per job",
        demand: "High",
        customers: "Busy households and small landlords",
        whyHere: "Cleaning demand is steady almost everywhere and easy to start with low overhead.",
      },
      {
        name: "Junk Removal & Hauling",
        priceRange: "$75–$400 per load",
        demand: "Medium",
        customers: "Movers, renovators, downsizing families",
        whyHere: "A truck and some hustle can meet demand most competitors ignore.",
      },
      {
        name: "Pet Care (Walking / Sitting)",
        priceRange: "$18–$40 per visit",
        demand: "Medium",
        customers: "Working professionals and travelers",
        whyHere: "Recurring, relationship-based work that builds a loyal client base.",
      },
    ],
    marketDemand: "Medium",
    competition: "Medium",
    keyInsight:
      "Reliability and repeat customers matter more than being the cheapest. Focus on services people need again and again.",
    channels: [
      {
        name: "Local Facebook Groups",
        why: "Where neighbors ask for recommendations first.",
        firstAction: "Join 3–5 local groups and post a short intro with clear pricing.",
      },
      {
        name: "Google Business Profile",
        why: "Free way to show up in 'near me' searches.",
        firstAction: "Create the profile and collect your first reviews.",
      },
      {
        name: "Word of Mouth",
        why: "Your first customers come from people who already trust you.",
        firstAction: "Tell 10 people you know exactly what you're offering.",
      },
    ],
    quickStart: {
      day1: [
        "Choose ONE service and set a simple price.",
        "Create a free Google Business Profile.",
        "Join 3 local Facebook groups.",
      ],
      day2: [
        "Post your intro + pricing.",
        "Message 10 people you know.",
        "Line up your first job — even a discounted one for a review.",
      ],
    },
    avoid: [
      "Trying to offer everything at once.",
      "Competing only on price.",
    ],
    edge:
      "Pick one service, do it reliably, and turn early customers into repeat business and referrals.",
  };
}

export function getReport(zipRaw: string): Report {
  const zip = (zipRaw || "").trim();
  return REPORTS[zip] ?? fallbackReport(zip || "00000");
}

export function hasCuratedReport(zipRaw: string): boolean {
  return Boolean(REPORTS[(zipRaw || "").trim()]);
}
