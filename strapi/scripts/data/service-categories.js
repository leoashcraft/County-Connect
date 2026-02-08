/**
 * Master List of Service Categories and Services
 * 
 * This file defines all 245 service pages for County Connect.
 * Each service can be claimed by ONE business for exclusive placement.
 * 
 * Categories are used for organization and filtering.
 * Each service has a unique slug used for routing.
 */

export const serviceCategories = {
  // ============================================
  // HOME SERVICES (60 services)
  // ============================================
  home_services: {
    label: "Home Services",
    icon: "Home",
    iconColor: "blue",
    services: [
      // Structural & Foundation
      { slug: "foundation-repair", title: "Foundation Repair", subcategory: "structural" },
      { slug: "structural-engineer", title: "Structural Engineer", subcategory: "structural" },
      { slug: "house-leveling", title: "House Leveling", subcategory: "structural" },
      
      // Plumbing
      { slug: "plumber", title: "Plumber", subcategory: "plumbing" },
      { slug: "drain-cleaning", title: "Drain Cleaning", subcategory: "plumbing" },
      { slug: "water-heater", title: "Water Heater Service", subcategory: "plumbing" },
      { slug: "slab-leak-repair", title: "Slab Leak Repair", subcategory: "plumbing" },
      { slug: "water-softener", title: "Water Softener Installation", subcategory: "plumbing" },
      { slug: "septic", title: "Septic Service", subcategory: "plumbing" },
      { slug: "well-drilling", title: "Well Drilling", subcategory: "plumbing" },
      { slug: "water-filtration", title: "Water Filtration", subcategory: "plumbing" },
      
      // Electrical
      { slug: "electrician", title: "Electrician", subcategory: "electrical" },
      { slug: "generator", title: "Generator Installation", subcategory: "electrical" },
      { slug: "solar", title: "Solar Installation", subcategory: "electrical" },
      { slug: "ev-charger", title: "EV Charger Installation", subcategory: "electrical" },
      { slug: "ceiling-fan-installation", title: "Ceiling Fan Installation", subcategory: "electrical" },
      { slug: "lighting-installation", title: "Lighting Installation", subcategory: "electrical" },
      { slug: "electrical-panel-upgrade", title: "Electrical Panel Upgrade", subcategory: "electrical" },
      
      // HVAC & Climate
      { slug: "hvac", title: "HVAC Service", subcategory: "climate" },
      { slug: "ac-repair", title: "AC Repair", subcategory: "climate" },
      { slug: "furnace-repair", title: "Furnace Repair", subcategory: "climate" },
      { slug: "duct-cleaning", title: "Duct Cleaning", subcategory: "climate" },
      { slug: "insulation", title: "Insulation", subcategory: "climate" },
      { slug: "air-quality", title: "Indoor Air Quality", subcategory: "climate" },
      
      // Roofing & Exterior
      { slug: "roofing", title: "Roofing", subcategory: "exterior" },
      { slug: "gutter", title: "Gutter Installation & Repair", subcategory: "exterior" },
      { slug: "siding", title: "Siding", subcategory: "exterior" },
      { slug: "window-installation", title: "Window Installation", subcategory: "exterior" },
      { slug: "door-installation", title: "Door Installation", subcategory: "exterior" },
      { slug: "garage-door", title: "Garage Door Service", subcategory: "exterior" },
      { slug: "exterior-painting", title: "Exterior Painting", subcategory: "exterior" },
      { slug: "pressure-washing", title: "Pressure Washing", subcategory: "exterior" },
      
      // Interior
      { slug: "interior-painting", title: "Interior Painting", subcategory: "interior" },
      { slug: "drywall", title: "Drywall Repair", subcategory: "interior" },
      { slug: "flooring", title: "Flooring Installation", subcategory: "interior" },
      { slug: "carpet", title: "Carpet Installation", subcategory: "interior" },
      { slug: "tile", title: "Tile Installation", subcategory: "interior" },
      { slug: "hardwood-floor", title: "Hardwood Floor", subcategory: "interior" },
      { slug: "cabinet-installation", title: "Cabinet Installation", subcategory: "interior" },
      { slug: "countertop", title: "Countertop Installation", subcategory: "interior" },
      
      // Maintenance & Cleaning
      { slug: "cleaning", title: "House Cleaning", subcategory: "maintenance" },
      { slug: "carpet-cleaning", title: "Carpet Cleaning", subcategory: "maintenance" },
      { slug: "window-cleaning", title: "Window Cleaning", subcategory: "maintenance" },
      { slug: "junk-removal", title: "Junk Removal", subcategory: "maintenance" },
      { slug: "handyman", title: "Handyman Services", subcategory: "maintenance" },
      { slug: "home-organizer", title: "Home Organization", subcategory: "maintenance" },
      
      // Pest & Wildlife
      { slug: "pest-control", title: "Pest Control", subcategory: "pest" },
      { slug: "termite-control", title: "Termite Control", subcategory: "pest" },
      { slug: "wildlife-removal", title: "Wildlife Removal", subcategory: "pest" },
      { slug: "mosquito-control", title: "Mosquito Control", subcategory: "pest" },
      { slug: "bee-removal", title: "Bee Removal", subcategory: "pest" },
      
      // Outdoor & Landscaping
      { slug: "landscaping", title: "Landscaping", subcategory: "outdoor" },
      { slug: "lawn-care", title: "Lawn Care", subcategory: "outdoor" },
      { slug: "irrigation", title: "Irrigation Systems", subcategory: "outdoor" },
      { slug: "tree-service", title: "Tree Service", subcategory: "outdoor" },
      { slug: "stump-grinder", title: "Stump Grinding", subcategory: "outdoor" },
      { slug: "fence-builder", title: "Fence Installation", subcategory: "outdoor" },
      { slug: "deck-builder", title: "Deck Building", subcategory: "outdoor" },
      { slug: "patio", title: "Patio Construction", subcategory: "outdoor" },
      { slug: "outdoor-lighting", title: "Outdoor Lighting", subcategory: "outdoor" },
      { slug: "pool-service", title: "Pool Service", subcategory: "outdoor" },
      { slug: "hot-tub-service", title: "Hot Tub Service", subcategory: "outdoor" },
    ]
  },

  // ============================================
  // PROFESSIONAL SERVICES (35 services)
  // ============================================
  professional_services: {
    label: "Professional Services",
    icon: "Briefcase",
    iconColor: "slate",
    services: [
      // Legal
      { slug: "attorney", title: "Attorney", subcategory: "legal" },
      { slug: "family-lawyer", title: "Family Lawyer", subcategory: "legal" },
      { slug: "criminal-lawyer", title: "Criminal Defense Lawyer", subcategory: "legal" },
      { slug: "personal-injury-lawyer", title: "Personal Injury Lawyer", subcategory: "legal" },
      { slug: "estate-attorney", title: "Estate Planning Attorney", subcategory: "legal" },
      { slug: "business-attorney", title: "Business Attorney", subcategory: "legal" },
      { slug: "immigration-lawyer", title: "Immigration Lawyer", subcategory: "legal" },
      
      // Financial
      { slug: "accountant", title: "Accountant", subcategory: "financial" },
      { slug: "tax-preparer", title: "Tax Preparation", subcategory: "financial" },
      { slug: "bookkeeper", title: "Bookkeeper", subcategory: "financial" },
      { slug: "financial-advisor", title: "Financial Advisor", subcategory: "financial" },
      { slug: "payroll-service", title: "Payroll Services", subcategory: "financial" },
      { slug: "insurance-agent", title: "Insurance Agent", subcategory: "financial" },
      
      // Real Estate
      { slug: "realtor", title: "Realtor", subcategory: "real_estate" },
      { slug: "mortgage-lender", title: "Mortgage Lender", subcategory: "real_estate" },
      { slug: "title-company", title: "Title Company", subcategory: "real_estate" },
      { slug: "appraiser", title: "Property Appraiser", subcategory: "real_estate" },
      { slug: "home-inspector", title: "Home Inspector", subcategory: "real_estate" },
      { slug: "property-manager", title: "Property Management", subcategory: "real_estate" },
      
      // Business Services
      { slug: "notary", title: "Notary Public", subcategory: "business" },
      { slug: "locksmith", title: "Locksmith", subcategory: "business" },
      { slug: "process-server", title: "Process Server", subcategory: "business" },
      { slug: "private-investigator", title: "Private Investigator", subcategory: "business" },
      { slug: "security-guard", title: "Security Services", subcategory: "business" },
      { slug: "courier", title: "Courier Service", subcategory: "business" },
      
      // IT & Technology
      { slug: "computer-repair", title: "Computer Repair", subcategory: "technology" },
      { slug: "it-support", title: "IT Support", subcategory: "technology" },
      { slug: "web-design", title: "Web Design", subcategory: "technology" },
      { slug: "marketing-agency", title: "Marketing Agency", subcategory: "technology" },
      { slug: "seo-services", title: "SEO Services", subcategory: "technology" },
      { slug: "social-media-manager", title: "Social Media Management", subcategory: "technology" },
      
      // Consulting
      { slug: "business-consultant", title: "Business Consultant", subcategory: "consulting" },
      { slug: "hr-consultant", title: "HR Consulting", subcategory: "consulting" },
      { slug: "career-coach", title: "Career Coaching", subcategory: "consulting" },
      { slug: "life-coach", title: "Life Coaching", subcategory: "consulting" },
    ]
  },

  // ============================================
  // HEALTH & WELLNESS (30 services)
  // ============================================
  health_wellness: {
    label: "Health & Wellness",
    icon: "Heart",
    iconColor: "rose",
    services: [
      // Dental
      { slug: "dentist", title: "Dentist", subcategory: "dental" },
      { slug: "orthodontist", title: "Orthodontist", subcategory: "dental" },
      { slug: "oral-surgeon", title: "Oral Surgeon", subcategory: "dental" },
      { slug: "pediatric-dentist", title: "Pediatric Dentist", subcategory: "dental" },
      { slug: "cosmetic-dentist", title: "Cosmetic Dentist", subcategory: "dental" },
      
      // Medical
      { slug: "family-doctor", title: "Family Doctor", subcategory: "medical" },
      { slug: "pediatrician", title: "Pediatrician", subcategory: "medical" },
      { slug: "urgent-care", title: "Urgent Care", subcategory: "medical" },
      { slug: "pharmacy", title: "Pharmacy", subcategory: "medical" },
      { slug: "home-health-care", title: "Home Health Care", subcategory: "medical" },
      
      // Specialists
      { slug: "chiropractor", title: "Chiropractor", subcategory: "specialist" },
      { slug: "physical-therapist", title: "Physical Therapist", subcategory: "specialist" },
      { slug: "massage-therapist", title: "Massage Therapist", subcategory: "specialist" },
      { slug: "acupuncture", title: "Acupuncture", subcategory: "specialist" },
      { slug: "optometrist", title: "Optometrist", subcategory: "specialist" },
      { slug: "audiologist", title: "Audiologist", subcategory: "specialist" },
      { slug: "podiatrist", title: "Podiatrist", subcategory: "specialist" },
      
      // Mental Health
      { slug: "therapist", title: "Therapist / Counselor", subcategory: "mental_health" },
      { slug: "psychiatrist", title: "Psychiatrist", subcategory: "mental_health" },
      { slug: "addiction-counselor", title: "Addiction Counselor", subcategory: "mental_health" },
      { slug: "marriage-counselor", title: "Marriage Counselor", subcategory: "mental_health" },
      
      // Fitness & Wellness
      { slug: "personal-trainer", title: "Personal Trainer", subcategory: "fitness" },
      { slug: "yoga-instructor", title: "Yoga Instructor", subcategory: "fitness" },
      { slug: "nutritionist", title: "Nutritionist / Dietitian", subcategory: "fitness" },
      { slug: "gym", title: "Gym / Fitness Center", subcategory: "fitness" },
      { slug: "weight-loss-clinic", title: "Weight Loss Clinic", subcategory: "fitness" },
      
      // Senior Care
      { slug: "assisted-living", title: "Assisted Living", subcategory: "senior" },
      { slug: "nursing-home", title: "Nursing Home", subcategory: "senior" },
      { slug: "senior-care", title: "Senior Home Care", subcategory: "senior" },
      { slug: "hospice", title: "Hospice Care", subcategory: "senior" },
    ]
  },

  // ============================================
  // AUTOMOTIVE (25 services)
  // ============================================
  automotive: {
    label: "Automotive",
    icon: "Car",
    iconColor: "red",
    services: [
      // Repair & Maintenance
      { slug: "auto-repair", title: "Auto Repair", subcategory: "repair" },
      { slug: "oil-change", title: "Oil Change Service", subcategory: "repair" },
      { slug: "brake-repair", title: "Brake Repair", subcategory: "repair" },
      { slug: "transmission", title: "Transmission Service", subcategory: "repair" },
      { slug: "auto-electric", title: "Auto Electrical", subcategory: "repair" },
      { slug: "muffler-exhaust", title: "Muffler & Exhaust", subcategory: "repair" },
      { slug: "ac-repair-auto", title: "Auto AC Repair", subcategory: "repair" },
      { slug: "engine-repair", title: "Engine Repair", subcategory: "repair" },
      
      // Body & Appearance
      { slug: "auto-body", title: "Auto Body Shop", subcategory: "body" },
      { slug: "auto-paint", title: "Auto Painting", subcategory: "body" },
      { slug: "auto-detailing", title: "Auto Detailing", subcategory: "body" },
      { slug: "windshield-repair", title: "Windshield Repair", subcategory: "body" },
      { slug: "dent-repair", title: "Paintless Dent Repair", subcategory: "body" },
      { slug: "window-tinting", title: "Window Tinting", subcategory: "body" },
      
      // Tires & Wheels
      { slug: "tire-shop", title: "Tire Shop", subcategory: "tires" },
      { slug: "wheel-alignment", title: "Wheel Alignment", subcategory: "tires" },
      
      // Services
      { slug: "towing", title: "Towing Service", subcategory: "services" },
      { slug: "roadside-assistance", title: "Roadside Assistance", subcategory: "services" },
      { slug: "car-wash", title: "Car Wash", subcategory: "services" },
      { slug: "auto-glass", title: "Auto Glass", subcategory: "services" },
      
      // Sales & Rentals
      { slug: "used-cars", title: "Used Car Dealer", subcategory: "sales" },
      { slug: "car-rental", title: "Car Rental", subcategory: "sales" },
      
      // Specialty
      { slug: "diesel-mechanic", title: "Diesel Mechanic", subcategory: "specialty" },
      { slug: "motorcycle-repair", title: "Motorcycle Repair", subcategory: "specialty" },
      { slug: "rv-repair", title: "RV Repair", subcategory: "specialty" },
    ]
  },

  // ============================================
  // EVENTS & ENTERTAINMENT (25 services)
  // ============================================
  events_entertainment: {
    label: "Events & Entertainment",
    icon: "Music",
    iconColor: "purple",
    services: [
      // Wedding Services
      { slug: "wedding-venue", title: "Wedding Venue", subcategory: "wedding" },
      { slug: "wedding-planner", title: "Wedding Planner", subcategory: "wedding" },
      { slug: "wedding-photographer", title: "Wedding Photographer", subcategory: "wedding" },
      { slug: "bridal-shop", title: "Bridal Shop", subcategory: "wedding" },
      { slug: "florist", title: "Florist", subcategory: "wedding" },
      { slug: "wedding-cake", title: "Wedding Cakes", subcategory: "wedding" },
      
      // Photography & Video
      { slug: "photographer", title: "Photographer", subcategory: "media" },
      { slug: "videographer", title: "Videographer", subcategory: "media" },
      { slug: "photo-booth", title: "Photo Booth Rental", subcategory: "media" },
      { slug: "drone-photography", title: "Drone Photography", subcategory: "media" },
      
      // Music & Entertainment
      { slug: "dj", title: "DJ Services", subcategory: "music" },
      { slug: "live-band", title: "Live Band", subcategory: "music" },
      { slug: "karaoke", title: "Karaoke Service", subcategory: "music" },
      { slug: "magician", title: "Magician", subcategory: "entertainment" },
      { slug: "face-painter", title: "Face Painter", subcategory: "entertainment" },
      { slug: "balloon-artist", title: "Balloon Artist", subcategory: "entertainment" },
      
      // Event Rentals
      { slug: "tent-rental", title: "Tent Rental", subcategory: "rental" },
      { slug: "party-rental", title: "Party Equipment Rental", subcategory: "rental" },
      { slug: "bounce-house", title: "Bounce House Rental", subcategory: "rental" },
      { slug: "event-furniture-rental", title: "Event Furniture Rental", subcategory: "rental" },
      
      // Venues
      { slug: "event-venue", title: "Event Venue", subcategory: "venue" },
      { slug: "banquet-hall", title: "Banquet Hall", subcategory: "venue" },
      { slug: "conference-room", title: "Conference Room Rental", subcategory: "venue" },
      
      // Services
      { slug: "event-planner", title: "Event Planner", subcategory: "services" },
      { slug: "party-bus", title: "Party Bus / Limo", subcategory: "services" },
    ]
  },

  // ============================================
  // FOOD & BEVERAGE (15 services)
  // ============================================
  food_beverage: {
    label: "Food & Beverage",
    icon: "Utensils",
    iconColor: "orange",
    services: [
      { slug: "catering", title: "Catering", subcategory: "catering" },
      { slug: "bbq-catering", title: "BBQ Catering", subcategory: "catering" },
      { slug: "food-truck", title: "Food Truck", subcategory: "catering" },
      { slug: "personal-chef", title: "Personal Chef", subcategory: "catering" },
      { slug: "meal-prep", title: "Meal Prep Service", subcategory: "catering" },
      { slug: "bakery", title: "Bakery", subcategory: "retail" },
      { slug: "specialty-cakes", title: "Specialty Cakes", subcategory: "retail" },
      { slug: "butcher", title: "Butcher Shop", subcategory: "retail" },
      { slug: "coffee-shop", title: "Coffee Shop", subcategory: "retail" },
      { slug: "ice-cream", title: "Ice Cream Shop", subcategory: "retail" },
      { slug: "liquor-store", title: "Liquor Store", subcategory: "retail" },
      { slug: "grocery-delivery", title: "Grocery Delivery", subcategory: "delivery" },
      { slug: "bartender", title: "Bartender Service", subcategory: "services" },
      { slug: "food-delivery", title: "Food Delivery", subcategory: "delivery" },
      { slug: "vending-machine", title: "Vending Machine Service", subcategory: "services" },
    ]
  },

  // ============================================
  // AGRICULTURE & RURAL (20 services)
  // ============================================
  agriculture_rural: {
    label: "Agriculture & Rural",
    icon: "Leaf",
    iconColor: "green",
    services: [
      // Animals
      { slug: "veterinarian", title: "Veterinarian", subcategory: "animal" },
      { slug: "large-animal-vet", title: "Large Animal Vet", subcategory: "animal" },
      { slug: "pet-groomer", title: "Pet Grooming", subcategory: "animal" },
      { slug: "pet-boarding", title: "Pet Boarding / Kennel", subcategory: "animal" },
      { slug: "pet-sitter", title: "Pet Sitting", subcategory: "animal" },
      { slug: "dog-trainer", title: "Dog Training", subcategory: "animal" },
      { slug: "horse-trainer", title: "Horse Training", subcategory: "animal" },
      { slug: "farrier", title: "Farrier", subcategory: "animal" },
      
      // Farm Services
      { slug: "feed-store", title: "Feed Store", subcategory: "farm" },
      { slug: "farm-supply", title: "Farm Supply", subcategory: "farm" },
      { slug: "tractor-repair", title: "Tractor Repair", subcategory: "farm" },
      { slug: "custom-farming", title: "Custom Farming", subcategory: "farm" },
      { slug: "hay-service", title: "Hay Service", subcategory: "farm" },
      { slug: "cattle-hauling", title: "Cattle Hauling", subcategory: "farm" },
      
      // Land Services
      { slug: "land-clearing", title: "Land Clearing", subcategory: "land" },
      { slug: "excavator", title: "Excavation Service", subcategory: "land" },
      { slug: "dirt-work", title: "Dirt Work", subcategory: "land" },
      { slug: "pond-construction", title: "Pond Construction", subcategory: "land" },
      { slug: "fencing-agricultural", title: "Agricultural Fencing", subcategory: "land" },
      { slug: "hunting-lease", title: "Hunting Lease", subcategory: "land" },
    ]
  },

  // ============================================
  // CONSTRUCTION & TRADES (25 services)
  // ============================================
  construction_trades: {
    label: "Construction & Trades",
    icon: "Hammer",
    iconColor: "amber",
    services: [
      // General Construction
      { slug: "general-contractor", title: "General Contractor", subcategory: "construction" },
      { slug: "home-builder", title: "Home Builder", subcategory: "construction" },
      { slug: "remodeling", title: "Remodeling Contractor", subcategory: "construction" },
      { slug: "kitchen-remodel", title: "Kitchen Remodeling", subcategory: "construction" },
      { slug: "bathroom-remodel", title: "Bathroom Remodeling", subcategory: "construction" },
      { slug: "room-addition", title: "Room Addition", subcategory: "construction" },
      
      // Specialty Construction
      { slug: "concrete", title: "Concrete Work", subcategory: "specialty" },
      { slug: "masonry", title: "Masonry", subcategory: "specialty" },
      { slug: "framing", title: "Framing Contractor", subcategory: "specialty" },
      { slug: "steel-building", title: "Steel Building Construction", subcategory: "specialty" },
      { slug: "pole-barn", title: "Pole Barn Builder", subcategory: "specialty" },
      { slug: "carport", title: "Carport Installation", subcategory: "specialty" },
      
      // Metalwork
      { slug: "welder", title: "Welding Service", subcategory: "metal" },
      { slug: "fabrication", title: "Metal Fabrication", subcategory: "metal" },
      { slug: "ironwork", title: "Ornamental Ironwork", subcategory: "metal" },
      { slug: "trailer-repair", title: "Trailer Repair", subcategory: "metal" },
      
      // Outdoor Structures
      { slug: "outdoor-kitchen", title: "Outdoor Kitchen Builder", subcategory: "outdoor" },
      { slug: "gazebo", title: "Gazebo Construction", subcategory: "outdoor" },
      { slug: "pergola", title: "Pergola Builder", subcategory: "outdoor" },
      { slug: "barn-builder", title: "Barn Builder", subcategory: "outdoor" },
      
      // Commercial
      { slug: "commercial-construction", title: "Commercial Construction", subcategory: "commercial" },
      { slug: "commercial-roofing", title: "Commercial Roofing", subcategory: "commercial" },
      { slug: "parking-lot", title: "Parking Lot Construction", subcategory: "commercial" },
      { slug: "asphalt-paving", title: "Asphalt Paving", subcategory: "commercial" },
      { slug: "demolition", title: "Demolition Service", subcategory: "commercial" },
    ]
  },

  // ============================================
  // BEAUTY & PERSONAL CARE (15 services)
  // ============================================
  beauty_personal: {
    label: "Beauty & Personal Care",
    icon: "Scissors",
    iconColor: "pink",
    services: [
      { slug: "hair-salon", title: "Hair Salon", subcategory: "hair" },
      { slug: "barbershop", title: "Barbershop", subcategory: "hair" },
      { slug: "nail-salon", title: "Nail Salon", subcategory: "nails" },
      { slug: "spa", title: "Day Spa", subcategory: "spa" },
      { slug: "med-spa", title: "Med Spa", subcategory: "spa" },
      { slug: "tanning-salon", title: "Tanning Salon", subcategory: "beauty" },
      { slug: "makeup-artist", title: "Makeup Artist", subcategory: "beauty" },
      { slug: "eyelash-extensions", title: "Eyelash Extensions", subcategory: "beauty" },
      { slug: "microblading", title: "Microblading", subcategory: "beauty" },
      { slug: "waxing", title: "Waxing Service", subcategory: "beauty" },
      { slug: "tattoo-parlor", title: "Tattoo Parlor", subcategory: "body" },
      { slug: "piercing", title: "Body Piercing", subcategory: "body" },
      { slug: "teeth-whitening", title: "Teeth Whitening", subcategory: "dental" },
      { slug: "esthetician", title: "Esthetician", subcategory: "skin" },
      { slug: "laser-hair-removal", title: "Laser Hair Removal", subcategory: "skin" },
    ]
  },

  // ============================================
  // EDUCATION & CHILDCARE (15 services)
  // ============================================
  education_childcare: {
    label: "Education & Childcare",
    icon: "GraduationCap",
    iconColor: "blue",
    services: [
      // Childcare
      { slug: "daycare", title: "Daycare Center", subcategory: "childcare" },
      { slug: "preschool", title: "Preschool", subcategory: "childcare" },
      { slug: "after-school-care", title: "After School Care", subcategory: "childcare" },
      { slug: "babysitter", title: "Babysitting Service", subcategory: "childcare" },
      { slug: "nanny", title: "Nanny Service", subcategory: "childcare" },
      
      // Education
      { slug: "tutoring", title: "Tutoring", subcategory: "education" },
      { slug: "music-lessons", title: "Music Lessons", subcategory: "education" },
      { slug: "piano-lessons", title: "Piano Lessons", subcategory: "education" },
      { slug: "guitar-lessons", title: "Guitar Lessons", subcategory: "education" },
      { slug: "dance-studio", title: "Dance Studio", subcategory: "education" },
      { slug: "martial-arts", title: "Martial Arts School", subcategory: "education" },
      { slug: "driving-school", title: "Driving School", subcategory: "education" },
      { slug: "art-classes", title: "Art Classes", subcategory: "education" },
      { slug: "language-school", title: "Language School", subcategory: "education" },
      { slug: "test-prep", title: "SAT/ACT Test Prep", subcategory: "education" },
    ]
  },

  // ============================================
  // RETAIL (10 services)
  // ============================================
  retail: {
    label: "Retail",
    icon: "ShoppingBag",
    iconColor: "teal",
    services: [
      { slug: "furniture-store", title: "Furniture Store", subcategory: "home" },
      { slug: "appliance-store", title: "Appliance Store", subcategory: "home" },
      { slug: "mattress-store", title: "Mattress Store", subcategory: "home" },
      { slug: "thrift-store", title: "Thrift Store", subcategory: "general" },
      { slug: "pawn-shop", title: "Pawn Shop", subcategory: "general" },
      { slug: "jewelry-store", title: "Jewelry Store", subcategory: "specialty" },
      { slug: "gun-shop", title: "Gun Shop", subcategory: "specialty" },
      { slug: "sporting-goods", title: "Sporting Goods", subcategory: "specialty" },
      { slug: "pet-store", title: "Pet Store", subcategory: "specialty" },
      { slug: "nursery-garden", title: "Plant Nursery", subcategory: "garden" },
    ]
  },

  // ============================================
  // LODGING & TRAVEL (10 services)
  // ============================================
  lodging_travel: {
    label: "Lodging & Travel",
    icon: "Bed",
    iconColor: "indigo",
    services: [
      { slug: "hotel", title: "Hotel", subcategory: "lodging" },
      { slug: "motel", title: "Motel", subcategory: "lodging" },
      { slug: "bed-breakfast", title: "Bed & Breakfast", subcategory: "lodging" },
      { slug: "vacation-rental", title: "Vacation Rental", subcategory: "lodging" },
      { slug: "rv-park", title: "RV Park / Campground", subcategory: "lodging" },
      { slug: "cabin-rental", title: "Cabin Rental", subcategory: "lodging" },
      { slug: "travel-agent", title: "Travel Agent", subcategory: "travel" },
      { slug: "airport-shuttle", title: "Airport Shuttle", subcategory: "travel" },
      { slug: "taxi", title: "Taxi Service", subcategory: "travel" },
      { slug: "charter-bus", title: "Charter Bus Service", subcategory: "travel" },
    ]
  },

  // ============================================
  // INDUSTRIAL & COMMERCIAL (15 services)
  // ============================================
  industrial_commercial: {
    label: "Industrial & Commercial",
    icon: "Factory",
    iconColor: "gray",
    services: [
      // Industrial
      { slug: "machine-shop", title: "Machine Shop", subcategory: "industrial" },
      { slug: "cnc-machining", title: "CNC Machining", subcategory: "industrial" },
      { slug: "industrial-painting", title: "Industrial Painting", subcategory: "industrial" },
      { slug: "sandblasting", title: "Sandblasting", subcategory: "industrial" },
      { slug: "crane-service", title: "Crane Service", subcategory: "industrial" },
      
      // Commercial Services
      { slug: "commercial-cleaning", title: "Commercial Cleaning", subcategory: "commercial" },
      { slug: "janitorial", title: "Janitorial Service", subcategory: "commercial" },
      { slug: "commercial-hvac", title: "Commercial HVAC", subcategory: "commercial" },
      { slug: "commercial-plumbing", title: "Commercial Plumbing", subcategory: "commercial" },
      { slug: "commercial-electrical", title: "Commercial Electrical", subcategory: "commercial" },
      
      // Storage & Logistics
      { slug: "storage-units", title: "Storage Units", subcategory: "storage" },
      { slug: "moving-company", title: "Moving Company", subcategory: "storage" },
      { slug: "freight-shipping", title: "Freight Shipping", subcategory: "logistics" },
      { slug: "warehousing", title: "Warehousing", subcategory: "logistics" },
      { slug: "forklift-service", title: "Forklift Service", subcategory: "industrial" },
    ]
  }
};

// Calculate total services
export function getTotalServiceCount() {
  let total = 0;
  for (const category of Object.values(serviceCategories)) {
    total += category.services.length;
  }
  return total;
}

// Get flat list of all services
export function getAllServices() {
  const services = [];
  for (const [categoryKey, category] of Object.entries(serviceCategories)) {
    for (const service of category.services) {
      services.push({
        ...service,
        category: categoryKey,
        categoryLabel: category.label,
        icon: category.icon,
        iconColor: category.iconColor
      });
    }
  }
  return services;
}

// Get services by category
export function getServicesByCategory(categoryKey) {
  const category = serviceCategories[categoryKey];
  if (!category) return [];
  return category.services.map(service => ({
    ...service,
    category: categoryKey,
    categoryLabel: category.label,
    icon: category.icon,
    iconColor: category.iconColor
  }));
}

// Export default
export default serviceCategories;
