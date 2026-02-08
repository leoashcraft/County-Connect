/**
 * Public Services in Navarro County, Texas
 * Includes government offices, utilities, emergency services, healthcare, courts, and more
 * These will be merged into community resources with appropriate categories
 */

export const publicServices = [
  // ==========================================
  // PUBLIC SAFETY & EMERGENCY SERVICES
  // ==========================================
  {
    "name": "Navarro County Sheriff's Office",
    "category": "law_enforcement",
    "subcategory": "sheriff",
    "description": "The Navarro County Sheriff's Office provides law enforcement services throughout Navarro County, operates the county jail, serves civil process, and responds to emergencies in unincorporated areas.",
    "address": "601 N 13th St, Corsicana, TX 75110",
    "phone": "(903) 654-3002",
    "emergency_phone": "911",
    "email": "sheriff@navarrocounty.org",
    "website": "https://www.navarrocounty.org/page/navarro.Sheriff",
    "hours": "24/7 Emergency Services; Admin: Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": null,
    "services": [
      "Law enforcement",
      "Criminal investigations",
      "Jail operations",
      "Civil process",
      "Warrant services",
      "Sex offender registry"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Corsicana Police Department",
    "category": "law_enforcement",
    "subcategory": "police",
    "description": "The Corsicana Police Department serves and protects the citizens of Corsicana with professional law enforcement services including patrol, investigations, and community policing.",
    "address": "330 N 15th St, Corsicana, TX 75110",
    "phone": "(903) 654-4900",
    "emergency_phone": "911",
    "email": null,
    "website": "https://www.cityofcorsicana.com/151/Police-Department",
    "hours": "24/7 Emergency Services; Admin: Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": null,
    "services": [
      "Law enforcement",
      "Criminal investigations",
      "Traffic enforcement",
      "Community policing",
      "Crime prevention"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Corsicana Fire Department",
    "category": "emergency_services",
    "subcategory": "fire_department",
    "description": "The Corsicana Fire Department provides fire suppression, rescue services, emergency medical response, and fire prevention education to the City of Corsicana.",
    "address": "301 N Beaton St, Corsicana, TX 75110",
    "phone": "(903) 654-4950",
    "emergency_phone": "911",
    "email": null,
    "website": "https://www.cityofcorsicana.com/163/Fire-Department",
    "hours": "24/7 Emergency Services",
    "eligibility": null,
    "services": [
      "Fire suppression",
      "Emergency medical services",
      "Rescue services",
      "Fire prevention",
      "Public education"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Navarro County Emergency Management",
    "category": "emergency_services",
    "subcategory": "emergency_management",
    "description": "Coordinates disaster preparedness, response, and recovery efforts for Navarro County. Manages emergency operations during natural disasters and major incidents.",
    "address": "300 W 3rd Ave, Corsicana, TX 75110",
    "phone": "(903) 654-3095",
    "emergency_phone": "911",
    "email": null,
    "website": "https://www.navarrocounty.org/page/navarro.Emergency.Management",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM; 24/7 during emergencies",
    "eligibility": null,
    "services": [
      "Disaster preparedness",
      "Emergency response coordination",
      "Evacuation planning",
      "Public warning systems",
      "Recovery assistance"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Navarro County Animal Control",
    "category": "animal_services",
    "subcategory": "animal_control",
    "description": "Provides animal control services for unincorporated Navarro County including stray animal pickup, rabies control, and animal cruelty investigations.",
    "address": "601 N 13th St, Corsicana, TX 75110",
    "phone": "(903) 654-3002",
    "email": null,
    "website": "https://www.navarrocounty.org",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": null,
    "services": [
      "Stray animal pickup",
      "Rabies control",
      "Animal cruelty investigations",
      "Bite quarantine"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Corsicana Animal Shelter",
    "category": "animal_services",
    "subcategory": "animal_shelter",
    "description": "City-operated animal shelter providing animal adoption services, stray animal intake, and animal control within Corsicana city limits.",
    "address": "2500 W 2nd Ave, Corsicana, TX 75110",
    "phone": "(903) 654-4954",
    "email": null,
    "website": "https://www.cityofcorsicana.com/286/Animal-Services",
    "hours": "Mon-Fri 10:00 AM - 5:00 PM, Sat 10:00 AM - 2:00 PM",
    "eligibility": null,
    "services": [
      "Animal adoptions",
      "Stray intake",
      "Lost and found pets",
      "Spay/neuter assistance referrals"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  
  // ==========================================
  // HEALTH & MEDICAL SERVICES
  // ==========================================
  {
    "name": "Navarro Regional Hospital",
    "category": "medical",
    "subcategory": "hospital",
    "description": "Full-service community hospital providing emergency care, surgical services, diagnostic imaging, and inpatient/outpatient services to Navarro County residents.",
    "address": "3201 W State Hwy 22, Corsicana, TX 75110",
    "phone": "(903) 654-6800",
    "emergency_phone": "911",
    "email": null,
    "website": "https://www.navarroregional.com",
    "hours": "24/7 Emergency Room; Varies by department",
    "eligibility": null,
    "services": [
      "Emergency care",
      "Surgery",
      "Diagnostic imaging",
      "Laboratory services",
      "Cardiology",
      "Orthopedics",
      "Women's services"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0809,
    "lng": -96.5089,
    "is_public_service": true
  },
  {
    "name": "Navarro County Health Department",
    "category": "medical",
    "subcategory": "public_health",
    "description": "Provides public health services including immunizations, disease prevention, environmental health inspections, and vital records for Navarro County.",
    "address": "1401 W 7th Ave, Corsicana, TX 75110",
    "phone": "(903) 872-7501",
    "email": null,
    "website": null,
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": null,
    "services": [
      "Immunizations",
      "Disease prevention",
      "Food service inspections",
      "Septic permits",
      "Birth/death certificates"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Lakes Regional Community Center",
    "category": "mental_health",
    "subcategory": "mental_health_services",
    "description": "Provides mental health and intellectual/developmental disability services to residents of Navarro and surrounding counties. Offers crisis intervention, counseling, and support services.",
    "address": "402 N Main St, Corsicana, TX 75110",
    "phone": "(903) 872-1168",
    "crisis_phone": "1-800-832-1009",
    "email": null,
    "website": "https://www.lakesregional.org",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM; 24/7 Crisis Line",
    "eligibility": "Residents of service area",
    "services": [
      "Mental health counseling",
      "Crisis intervention",
      "Psychiatric services",
      "IDD services",
      "Substance abuse services"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "CareNow Urgent Care - Corsicana",
    "category": "medical",
    "subcategory": "urgent_care",
    "description": "Walk-in urgent care clinic providing treatment for non-life-threatening illnesses and injuries, physicals, and occupational health services.",
    "address": "3102 W State Hwy 22, Corsicana, TX 75110",
    "phone": "(903) 874-9995",
    "email": null,
    "website": "https://www.carenow.com",
    "hours": "Mon-Fri 8:00 AM - 8:00 PM, Sat-Sun 8:00 AM - 5:00 PM",
    "eligibility": null,
    "services": [
      "Urgent care",
      "Minor illness treatment",
      "Minor injury treatment",
      "Physicals",
      "Drug testing"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0809,
    "lng": -96.5089,
    "is_public_service": true
  },

  // ==========================================
  // JUDICIAL & LEGAL SERVICES
  // ==========================================
  {
    "name": "Navarro County Courthouse",
    "category": "government",
    "subcategory": "courthouse",
    "description": "Historic courthouse serving as the seat of Navarro County government. Houses county courts, commissioners court, and various county offices.",
    "address": "300 W 3rd Ave, Corsicana, TX 75110",
    "phone": "(903) 654-3035",
    "email": null,
    "website": "https://www.navarrocounty.org",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": null,
    "services": [
      "County court proceedings",
      "Commissioners court",
      "Public records",
      "County administration"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Navarro County District Clerk",
    "category": "government",
    "subcategory": "district_clerk",
    "description": "Maintains records for district court including civil and criminal cases, jury management, and child support services.",
    "address": "300 W 3rd Ave, Corsicana, TX 75110",
    "phone": "(903) 654-3040",
    "email": null,
    "website": "https://www.navarrocounty.org/page/navarro.District.Clerk",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": null,
    "services": [
      "Court records",
      "Case filings",
      "Jury duty information",
      "Child support"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Navarro County Clerk",
    "category": "government",
    "subcategory": "county_clerk",
    "description": "Maintains vital records, issues marriage licenses, records property documents, and serves as clerk for county court and commissioners court.",
    "address": "300 W 3rd Ave, Corsicana, TX 75110",
    "phone": "(903) 654-3035",
    "email": null,
    "website": "https://www.navarrocounty.org/page/navarro.County.Clerk",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": null,
    "services": [
      "Marriage licenses",
      "Birth certificates",
      "Death certificates",
      "Property records",
      "Assumed name certificates"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Navarro County District Attorney",
    "category": "government",
    "subcategory": "district_attorney",
    "description": "Prosecutes felony criminal cases in Navarro County, represents the State of Texas in district court proceedings.",
    "address": "300 W 3rd Ave, Suite 4, Corsicana, TX 75110",
    "phone": "(903) 654-3045",
    "email": null,
    "website": "https://www.navarrocounty.org/page/navarro.District.Attorney",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": null,
    "services": [
      "Criminal prosecution",
      "Victim assistance",
      "Hot check collection"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Justice of the Peace - Precinct 1",
    "category": "government",
    "subcategory": "justice_of_peace",
    "description": "Handles small claims court, Class C misdemeanors, traffic tickets, truancy cases, and performs marriages in Precinct 1.",
    "address": "300 W 3rd Ave, Corsicana, TX 75110",
    "phone": "(903) 654-3050",
    "email": null,
    "website": "https://www.navarrocounty.org/page/navarro.JP1",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": null,
    "services": [
      "Small claims court",
      "Traffic tickets",
      "Evictions",
      "Marriage ceremonies",
      "Inquests"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },

  // ==========================================
  // TAX & PROPERTY SERVICES
  // ==========================================
  {
    "name": "Navarro County Tax Assessor-Collector",
    "category": "government",
    "subcategory": "tax_office",
    "description": "Collects property taxes for the county and other taxing entities. Handles vehicle registration, title transfers, and disabled veteran exemptions.",
    "address": "300 W 3rd Ave, Corsicana, TX 75110",
    "phone": "(903) 654-3080",
    "email": null,
    "website": "https://www.navarrocounty.org/page/navarro.Tax",
    "hours": "Mon-Fri 8:00 AM - 4:30 PM",
    "eligibility": null,
    "services": [
      "Property tax collection",
      "Vehicle registration",
      "Title transfers",
      "Disabled veteran exemptions",
      "Property tax payments"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Navarro Central Appraisal District",
    "category": "government",
    "subcategory": "appraisal_district",
    "description": "Appraises all property in Navarro County for ad valorem tax purposes. Handles homestead exemptions, agricultural valuations, and property protests.",
    "address": "1209 N 19th St, Corsicana, TX 75110",
    "phone": "(903) 874-7191",
    "email": null,
    "website": "https://www.navarrocad.org",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": null,
    "services": [
      "Property appraisals",
      "Homestead exemptions",
      "Agricultural valuations",
      "Property tax protests",
      "Property records search"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },

  // ==========================================
  // UTILITIES - ELECTRIC
  // ==========================================
  {
    "name": "Navarro County Electric Cooperative",
    "category": "utility",
    "subcategory": "electric",
    "description": "Member-owned rural electric cooperative providing electricity to rural areas of Navarro County and surrounding areas. Serves over 17,000 members.",
    "address": "2797 W State Hwy 22, Corsicana, TX 75110",
    "phone": "(903) 874-7411",
    "outage_phone": "1-888-533-4470",
    "email": null,
    "website": "https://www.navarroelectric.com",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM; 24/7 Outage Reporting",
    "eligibility": "Service area residents",
    "services": [
      "Electric service",
      "New service connections",
      "Outage reporting",
      "Energy efficiency programs",
      "Billing and payments"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0809,
    "lng": -96.5089,
    "is_public_service": true
  },
  {
    "name": "Oncor Electric Delivery",
    "category": "utility",
    "subcategory": "electric",
    "description": "Oncor delivers electricity to homes and businesses in Corsicana and parts of Navarro County. As a regulated utility, they maintain power lines and respond to outages.",
    "address": "Corsicana Service Area",
    "phone": "1-888-313-4747",
    "outage_phone": "1-888-313-4747",
    "email": null,
    "website": "https://www.oncor.com",
    "hours": "24/7 Outage Reporting",
    "eligibility": "Service area residents",
    "services": [
      "Electric delivery",
      "Outage reporting",
      "New service connections",
      "Street light repairs"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },

  // ==========================================
  // UTILITIES - GAS
  // ==========================================
  {
    "name": "Atmos Energy",
    "category": "utility",
    "subcategory": "natural_gas",
    "description": "Natural gas utility serving Corsicana and Navarro County. Provides natural gas for heating, cooking, and other residential and commercial uses.",
    "address": "Corsicana Service Area",
    "phone": "1-888-286-6700",
    "emergency_phone": "1-866-322-8667",
    "email": null,
    "website": "https://www.atmosenergy.com",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM; 24/7 Gas Emergencies",
    "eligibility": "Service area residents",
    "services": [
      "Natural gas service",
      "New service connections",
      "Gas leak reporting",
      "Billing and payments",
      "Energy assistance programs"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },

  // ==========================================
  // UTILITIES - WATER & WASTEWATER
  // ==========================================
  {
    "name": "City of Corsicana Water Utilities",
    "category": "utility",
    "subcategory": "water",
    "description": "Provides water and wastewater services to Corsicana residents. Manages water treatment, distribution, and sewer services.",
    "address": "200 N 12th St, Corsicana, TX 75110",
    "phone": "(903) 654-4850",
    "emergency_phone": "(903) 654-4850",
    "email": null,
    "website": "https://www.cityofcorsicana.com/166/Utility-Billing",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": "Corsicana city limits",
    "services": [
      "Water service",
      "Sewer service",
      "New connections",
      "Billing and payments",
      "Water quality reports"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Kerens Water Department",
    "category": "utility",
    "subcategory": "water",
    "description": "Provides water and sewer services to residents of Kerens.",
    "address": "200 S Colket Ave, Kerens, TX 75144",
    "phone": "(903) 396-2971",
    "email": null,
    "website": null,
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": "Kerens city limits",
    "services": [
      "Water service",
      "Sewer service",
      "Utility billing"
    ],
    "town": "Kerens",
    "status": "active",
    "lat": 32.131,
    "lng": -96.2281,
    "is_public_service": true
  },
  {
    "name": "Blooming Grove Water Department",
    "category": "utility",
    "subcategory": "water",
    "description": "Provides water services to residents of Blooming Grove.",
    "address": "102 E Fordyce St, Blooming Grove, TX 76626",
    "phone": "(903) 695-2613",
    "email": null,
    "website": null,
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": "Blooming Grove city limits",
    "services": [
      "Water service",
      "Utility billing"
    ],
    "town": "Blooming Grove",
    "status": "active",
    "lat": 32.0985,
    "lng": -96.7142,
    "is_public_service": true
  },

  // ==========================================
  // UTILITIES - WASTE DISPOSAL
  // ==========================================
  {
    "name": "City of Corsicana Solid Waste Services",
    "category": "utility",
    "subcategory": "waste_disposal",
    "description": "Provides residential and commercial garbage collection, recycling services, and bulk item pickup within Corsicana city limits.",
    "address": "200 N 12th St, Corsicana, TX 75110",
    "phone": "(903) 654-4850",
    "email": null,
    "website": "https://www.cityofcorsicana.com/227/Solid-Waste",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": "Corsicana city limits",
    "services": [
      "Garbage collection",
      "Recycling",
      "Bulk item pickup",
      "Special waste disposal"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Republic Services",
    "category": "utility",
    "subcategory": "waste_disposal",
    "description": "Provides waste collection and recycling services to residential and commercial customers in rural Navarro County areas.",
    "address": "Service Area",
    "phone": "1-800-772-8653",
    "email": null,
    "website": "https://www.republicservices.com",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": "Service area residents",
    "services": [
      "Residential garbage",
      "Commercial waste",
      "Roll-off containers",
      "Recycling"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },

  // ==========================================
  // EDUCATION
  // ==========================================
  {
    "name": "Navarro College",
    "category": "education",
    "subcategory": "college",
    "description": "Public community college serving Navarro County and surrounding areas. Offers associate degrees, technical certificates, and workforce training. Home of the nationally recognized Navarro College Cheer team.",
    "address": "3200 W 7th Ave, Corsicana, TX 75110",
    "phone": "(903) 874-6501",
    "email": null,
    "website": "https://www.navarrocollege.edu",
    "hours": "Mon-Thu 8:00 AM - 7:00 PM, Fri 8:00 AM - 4:00 PM",
    "eligibility": "Open enrollment",
    "services": [
      "Associate degrees",
      "Technical certificates",
      "Workforce training",
      "Dual credit programs",
      "Continuing education"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0809,
    "lng": -96.4989,
    "is_public_service": true
  },
  {
    "name": "Corsicana Independent School District",
    "category": "education",
    "subcategory": "school_district",
    "description": "Public school district serving Corsicana and surrounding areas. Provides K-12 education with multiple elementary, middle, and high schools.",
    "address": "301 S 15th St, Corsicana, TX 75110",
    "phone": "(903) 872-6411",
    "email": null,
    "website": "https://www.corsicanaisd.org",
    "hours": "Mon-Fri 8:00 AM - 4:30 PM",
    "eligibility": "District residents",
    "services": [
      "K-12 education",
      "Special education",
      "Career and technical education",
      "Athletics",
      "Fine arts"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },

  // ==========================================
  // TRANSPORTATION
  // ==========================================
  {
    "name": "Texas Department of Transportation - Corsicana",
    "category": "transportation",
    "subcategory": "txdot",
    "description": "TxDOT area office responsible for state highway maintenance and construction in Navarro County.",
    "address": "3001 S Interstate Hwy 45, Corsicana, TX 75109",
    "phone": "(903) 872-2574",
    "email": null,
    "website": "https://www.txdot.gov",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": null,
    "services": [
      "Highway maintenance",
      "Road construction",
      "Traffic signals",
      "Road conditions information"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0654,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Corsicana Municipal Airport (CRS)",
    "category": "transportation",
    "subcategory": "airport",
    "description": "General aviation airport serving Corsicana and Navarro County. Features a 5,001-foot runway and various aviation services.",
    "address": "1901 W State Hwy 31, Corsicana, TX 75110",
    "phone": "(903) 654-4862",
    "email": null,
    "website": "https://www.cityofcorsicana.com/148/Airport",
    "hours": "Dawn to Dusk",
    "eligibility": null,
    "services": [
      "General aviation",
      "Fuel services",
      "Hangar rentals",
      "Flight training"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0254,
    "lng": -96.3989,
    "is_public_service": true
  },

  // ==========================================
  // LIBRARY & CULTURAL SERVICES
  // ==========================================
  {
    "name": "Corsicana Public Library",
    "category": "education",
    "subcategory": "library",
    "description": "Public library serving Corsicana and Navarro County with books, digital resources, programs, and community meeting spaces.",
    "address": "100 N 12th St, Corsicana, TX 75110",
    "phone": "(903) 654-4810",
    "email": null,
    "website": "https://www.corsicanalibrary.com",
    "hours": "Mon-Thu 10:00 AM - 7:00 PM, Fri-Sat 10:00 AM - 5:00 PM",
    "eligibility": "Free to all; library card for checkouts",
    "services": [
      "Book lending",
      "Digital resources",
      "Children's programs",
      "Computer access",
      "Meeting rooms"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },

  // ==========================================
  // PARKS & RECREATION
  // ==========================================
  {
    "name": "Corsicana Parks & Recreation",
    "category": "recreation",
    "subcategory": "parks",
    "description": "Manages city parks, recreational facilities, sports leagues, and community programs for Corsicana residents.",
    "address": "200 N 12th St, Corsicana, TX 75110",
    "phone": "(903) 654-4875",
    "email": null,
    "website": "https://www.cityofcorsicana.com/194/Parks-Recreation",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM; Park hours vary",
    "eligibility": null,
    "services": [
      "City parks",
      "Sports leagues",
      "Community center",
      "Special events",
      "Facility rentals"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },

  // ==========================================
  // VETERANS SERVICES
  // ==========================================
  {
    "name": "Navarro County Veterans Service Office",
    "category": "veteran",
    "subcategory": "veterans_services",
    "description": "Assists veterans and their families with VA benefits, claims, healthcare enrollment, and other veteran services.",
    "address": "300 W 3rd Ave, Corsicana, TX 75110",
    "phone": "(903) 654-3070",
    "email": null,
    "website": "https://www.navarrocounty.org/page/navarro.Veterans",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": "Veterans and their families",
    "services": [
      "VA benefits assistance",
      "Claims filing",
      "Healthcare enrollment",
      "Burial benefits",
      "Education benefits"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },

  // ==========================================
  // SOCIAL SERVICES
  // ==========================================
  {
    "name": "Texas Health and Human Services - Corsicana",
    "category": "government",
    "subcategory": "social_services",
    "description": "State office providing SNAP (food stamps), Medicaid, TANF, and other social services programs to Navarro County residents.",
    "address": "1020 W 7th Ave, Corsicana, TX 75110",
    "phone": "2-1-1",
    "email": null,
    "website": "https://www.hhs.texas.gov",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": "Income-based eligibility varies by program",
    "services": [
      "SNAP benefits",
      "Medicaid",
      "TANF",
      "Child care assistance"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },
  {
    "name": "Texas Workforce Solutions - Navarro County",
    "category": "employment",
    "subcategory": "workforce",
    "description": "Provides employment services, job training, unemployment benefits assistance, and workforce development programs.",
    "address": "1900 W 7th Ave, Corsicana, TX 75110",
    "phone": "(903) 872-0191",
    "email": null,
    "website": "https://www.workforcesolutionsrurialcapital.com",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": "Job seekers and employers",
    "services": [
      "Job search assistance",
      "Resume help",
      "Job training programs",
      "Unemployment assistance",
      "Employer services"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },

  // ==========================================
  // ELECTIONS & VOTING
  // ==========================================
  {
    "name": "Navarro County Elections Office",
    "category": "government",
    "subcategory": "elections",
    "description": "Administers all elections in Navarro County including voter registration, early voting, and election day operations.",
    "address": "300 W 3rd Ave, Corsicana, TX 75110",
    "phone": "(903) 654-3095",
    "email": null,
    "website": "https://www.navarrocounty.org/page/navarro.Elections",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": "Registered voters",
    "services": [
      "Voter registration",
      "Early voting",
      "Election day voting",
      "Absentee ballots",
      "Election results"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  },

  // ==========================================
  // EXTENSION SERVICES
  // ==========================================
  {
    "name": "Texas A&M AgriLife Extension - Navarro County",
    "category": "education",
    "subcategory": "extension",
    "description": "Provides research-based educational programs in agriculture, 4-H youth development, family and consumer sciences, and community development.",
    "address": "104 E Pierson St, Corsicana, TX 75110",
    "phone": "(903) 654-3075",
    "email": null,
    "website": "https://navarro.agrilife.org",
    "hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "eligibility": null,
    "services": [
      "Agricultural programs",
      "4-H youth programs",
      "Master Gardener program",
      "Family programs",
      "Homebuyer education"
    ],
    "town": "Corsicana",
    "status": "active",
    "lat": 32.0954,
    "lng": -96.4689,
    "is_public_service": true
  }
];
