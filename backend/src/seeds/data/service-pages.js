/**
 * Service Pages Seed Data for Navarro County, Texas
 * 
 * Each page is a comprehensive local resource with genuine, unique content
 * designed to provide real value to residents while also being monetizable.
 * 
 * Structure:
 * - slug: URL path (e.g., "foundation-repair" -> /foundation-repair)
 * - title: Page title
 * - category: Service category for organization
 * - layout: Layout variant (1-5) to avoid template detection
 * - icon: Lucide icon name
 * - iconColor: Tailwind color for theming
 * - metaTitle: SEO title
 * - metaDescription: SEO description (150-160 chars)
 * - metaKeywords: SEO keywords
 * - heroContent: Rich intro content
 * - localContext: Navarro County specific information
 * - sections: Array of content sections (rendered in order)
 * - faqs: Array of {question, answer} for FAQ schema
 * - relatedServices: Array of related service slugs
 * - externalResources: Array of {name, url} for authority links
 * - claimedBusinessId: null until claimed
 * - status: "active" | "draft"
 */

export const servicePages = [
  // ============================================
  // HOME SERVICES
  // ============================================
  {
    slug: "foundation-repair",
    title: "Foundation Repair",
    category: "home_services",
    subcategory: "structural",
    layout: 1,
    icon: "Home",
    iconColor: "slate",
    metaTitle: "Foundation Repair in Navarro County, TX | Expert Foundation Services",
    metaDescription: "Foundation repair services in Corsicana and Navarro County. Expert solutions for settling foundations, cracks, and drainage issues in Texas Blackland Prairie soil.",
    metaKeywords: "foundation repair Corsicana, foundation repair Navarro County, pier and beam repair, slab foundation repair, foundation leveling Texas",
    heroContent: `Navarro County sits squarely in the Texas Blackland Prairies, a region stretching from San Antonio to the Red River known for its highly expansive Vertisol clay soils. This "black gumbo" soil contains smectite clay minerals that undergo dramatic volume changes with moisture fluctuations—expanding significantly when wet and shrinking when dry. For homeowners in Corsicana, Kerens, Blooming Grove, and throughout Navarro County, this means foundation problems are not a matter of if, but when.`,
    localContext: `The clay soils in Navarro County can exert pressures exceeding 5,000 pounds per square foot on foundation walls during expansion. Combined with our hot, dry summers followed by sudden heavy rains, foundations here experience stress cycles that foundations in other regions simply don't face. Many homes built in the 1950s through 1980s on post-tension slab foundations are now showing significant settling, with some areas of the county seeing foundation repairs needed on over 40% of homes older than 30 years.`,
    sections: [
      {
        type: "guide",
        heading: "Signs Your Navarro County Home Needs Foundation Repair",
        content: `Living in the Blackland Prairie means staying vigilant for foundation issues. Here are the warning signs every Navarro County homeowner should know:

**Interior Warning Signs:**
- Doors that stick, won't latch, or swing open on their own
- Cracks in drywall, especially diagonal cracks from door/window corners
- Gaps between walls and ceiling or walls and floor
- Uneven or sloping floors (place a ball on the floor—does it roll?)
- Cracks in tile flooring, especially in patterns radiating from corners
- Windows that are difficult to open or won't stay open

**Exterior Warning Signs:**
- Stair-step cracks in brick mortar joints
- Horizontal cracks in concrete block walls
- Gaps between the foundation and siding
- Chimney leaning or separating from the house
- Gaps around exterior doors and windows
- Foundation visibly higher on one side

**Soil and Drainage Indicators:**
- Soil pulling away from foundation (common in Navarro County summers)
- Standing water near foundation after rain
- Gutters overflowing or missing sections
- Flower beds sloping toward the house`
      },
      {
        type: "comparison",
        heading: "Foundation Repair Methods Used in Navarro County",
        content: `Different foundation problems require different solutions. Here's what you should know about the repair methods commonly used in our area:

**Pressed Concrete Pilings**
- Most common method in Navarro County
- Concrete cylinders driven deep into stable soil below the active clay layer
- Typically reaches 12-20 feet depth in our area
- Cost: $300-$500 per piling, most homes need 15-25 pilings
- Best for: Moderate settling on slab foundations

**Steel Piers (Push Piers)**
- Hydraulically driven steel tubes reaching bedrock or stable strata
- Can reach 30+ feet in Navarro County's deep clay profiles
- More expensive but provides strongest, most permanent solution
- Cost: $1,000-$1,500 per pier
- Best for: Severe settling, heavy structures, commercial buildings

**Helical Piers**
- Steel shafts with helical plates screwed into ground
- Work well in our variable soil conditions
- Can be installed in limited-access areas
- Cost: $1,200-$1,800 per pier
- Best for: Lighter structures, additions, areas with access limitations

**Pier and Beam Adjustments**
- For older Navarro County homes built on pier and beam foundations
- Shimming, replacing damaged beams, adding support piers
- Allows for under-house access and future adjustments
- Cost: $2,000-$5,000 for typical adjustments
- Best for: Pre-1960s homes, homes with crawl spaces

**Mudjacking/Slabjacking**
- Pumping material under slab to raise settled areas
- Temporary solution not recommended for active clay soils
- May need repeating every 5-10 years in our climate
- Cost: $500-$1,500 per section
- Not recommended for severe settling or structural issues`
      },
      {
        type: "local_info",
        heading: "Why Navarro County Foundations Fail",
        content: `Understanding why foundations fail in our specific area helps you make better decisions about repairs and prevention.

**The Blackland Prairie Factor**
Navarro County's Vertisol soils contain up to 60% smectite clay, one of the most expansive clay types. When summer droughts hit—and our average August sees less than 2 inches of rain—this clay shrinks dramatically. Then when fall rains arrive (we average 4+ inches in October), the soil expands rapidly. This seasonal cycle creates enormous stress on foundations.

**Historical Construction Practices**
Many Navarro County homes built between 1950-1990 were constructed using building practices that didn't account for our extreme soil movement:
- Inadequate footer depth (many only 18 inches when 36+ inches is recommended)
- No or minimal steel reinforcement in slabs
- Poor drainage planning around foundations
- No root barriers near large trees

**Tree Root Influence**
Our beautiful live oaks and pecan trees—icons of Navarro County landscapes—can have root systems extending 50+ feet. These roots extract tremendous amounts of moisture from soil near foundations, causing localized shrinkage and differential settling. A single mature live oak can extract 50+ gallons of water daily from surrounding soil.

**Plumbing Leaks**
Older cast iron plumbing, common in pre-1970s Navarro County homes, often develops leaks under slabs. These hidden leaks create localized wet zones that cause soil expansion and heaving—pushing the foundation up rather than settling.`
      },
      {
        type: "checklist",
        heading: "Questions to Ask Foundation Repair Contractors",
        items: [
          "Are you licensed and insured in Texas? (Verify at TDLR.texas.gov)",
          "How many years have you worked specifically in Navarro County or Blackland Prairie soils?",
          "What depth will the piers reach? (Should be below the active clay zone, typically 15-30 feet here)",
          "Do you provide a transferable lifetime warranty?",
          "Will you provide a detailed engineering report?",
          "What is your process if initial repairs don't fully stabilize the foundation?",
          "Do you offer drainage solutions as part of the repair?",
          "Can you provide references from other Navarro County projects?",
          "What is the timeline and will work be interrupted by weather?",
          "Do you handle permit acquisition with Navarro County?"
        ]
      },
      {
        type: "prevention",
        heading: "Preventing Foundation Problems in Navarro County",
        content: `While our soil makes some foundation movement inevitable, you can significantly reduce problems with proper maintenance:

**Maintain Consistent Moisture Levels**
- Install a soaker hose system 18 inches from your foundation
- Water foundation during drought (yes, water your foundation!)
- Run soaker hoses 15-30 minutes daily during dry periods
- Don't overwater—soggy soil is as bad as dry soil

**Manage Drainage**
- Ensure gutters direct water at least 5 feet from foundation
- Grade soil to slope away from foundation (6 inches per 10 feet)
- Consider French drains for low areas
- Don't let flower beds trap water against foundation

**Control Tree Roots**
- Install root barriers between large trees and foundation
- Consider removing trees within 20 feet of foundation
- Keep large trees well-watered during drought (draws roots away from foundation)

**Maintain Plumbing**
- Have plumbing leak detection performed every few years
- Address slow drains promptly (may indicate under-slab issues)
- Consider video inspection of sewer lines on homes 30+ years old

**Monitor Seasonally**
- Check for new cracks each spring and fall
- Document crack width with dated photos
- Note door/window operation changes
- Watch for new sticking points`
      }
    ],
    faqs: [
      {
        question: "How much does foundation repair cost in Navarro County?",
        answer: "Foundation repair in Navarro County typically costs $4,000-$15,000 for residential homes, depending on the severity and number of piers needed. Minor repairs may run $2,000-$4,000, while severe settling requiring 20+ piers can exceed $20,000. Most companies offer free inspections and financing options."
      },
      {
        question: "Does homeowners insurance cover foundation repair in Texas?",
        answer: "Standard Texas homeowners insurance typically does not cover foundation repair due to settling or soil movement, as these are considered maintenance issues. However, if foundation damage results from a covered peril like a plumbing leak, that portion may be covered. Review your policy and consider foundation endorsements when renewing."
      },
      {
        question: "How long does foundation repair take?",
        answer: "Most Navarro County foundation repairs are completed in 1-3 days. Pier installation typically takes 1-2 days, with an additional day for cleanup and final adjustments. The foundation can bear full weight immediately after repair, though you should wait 7-10 days before making interior repairs to allow for any minor settling."
      },
      {
        question: "Will foundation repair fix all my cracks?",
        answer: "Foundation repair stabilizes and levels your foundation but doesn't automatically repair cosmetic damage. Most cracks won't worsen after repair, but existing drywall cracks, brick cracks, and stuck doors typically need separate repairs. Many foundation companies can recommend trusted contractors for these follow-up repairs."
      },
      {
        question: "Is it safe to buy a house with foundation issues in Navarro County?",
        answer: "Many Navarro County homes have had foundation repairs and are completely structurally sound. The key is getting a qualified foundation inspection before purchase, reviewing any repair warranties, and understanding what work was done. A properly repaired foundation can actually be more stable than an original foundation that hasn't shown problems yet."
      }
    ],
    relatedServices: ["plumber", "drainage", "concrete", "home-inspector", "structural-engineer"],
    externalResources: [
      { name: "Texas Department of Licensing and Regulation", url: "https://www.tdlr.texas.gov/" },
      { name: "Navarro County Building Permits", url: "https://www.navarrocounty.org" },
      { name: "Better Business Bureau - Dallas", url: "https://www.bbb.org/us/tx/dallas" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "plumber",
    title: "Plumber",
    category: "home_services",
    subcategory: "plumbing",
    layout: 2,
    icon: "Wrench",
    iconColor: "sky",
    metaTitle: "Plumber in Navarro County, TX | Licensed Plumbing Services Corsicana",
    metaDescription: "Licensed plumber serving Corsicana and Navarro County. Emergency plumbing, drain cleaning, water heater repair, and slab leak detection for local homes.",
    metaKeywords: "plumber Corsicana, plumber Navarro County, emergency plumber, drain cleaning, water heater repair, slab leak repair",
    heroContent: `Finding a reliable plumber in Navarro County means finding someone who understands the unique challenges our homes face. From historic downtown Corsicana properties with original cast iron pipes to modern subdivisions with PEX plumbing, Navarro County homes span over a century of plumbing technology and challenges.`,
    localContext: `Navarro County's hard water, with calcium carbonate levels averaging 180-250 ppm, accelerates mineral buildup in pipes and reduces water heater efficiency. Many homes on well water face even higher mineral content, often requiring specialized water treatment. Additionally, our expansive clay soils put constant stress on underground plumbing, making slab leaks a common and serious concern for homeowners throughout Corsicana, Kerens, and Blooming Grove.`,
    sections: [
      {
        type: "guide",
        heading: "Common Plumbing Issues in Navarro County Homes",
        content: `Our local conditions create some plumbing challenges you won't find in other regions:

**Hard Water Damage**
Navarro County's naturally hard water leaves mineral deposits throughout your plumbing system:
- Water heater elements fail 30-40% faster than in soft water areas
- Showerheads and faucets clog with calcium buildup
- Dishwashers and washing machines require more maintenance
- White crusty deposits form on fixtures and shower doors

**Slab Leaks**
Our expansive Blackland Prairie soils shift constantly, stressing the copper and cast iron pipes running under and through concrete slabs:
- Watch for unexplained increases in water bills
- Warm spots on floors may indicate hot water line leaks
- Foundation cracks combined with water stains suggest slab leak
- Mold or mildew smells without visible source

**Cast Iron Pipe Deterioration**
Homes built before 1975 in Navarro County typically have cast iron drain pipes that are now 50+ years old:
- Bellied (sagging) pipe sections trap waste and cause backups
- Rust and corrosion create rough surfaces that catch debris
- Tree roots exploit small cracks in deteriorating joints
- Complete failure can cause sewage backup into home

**Septic System Challenges**
Many rural Navarro County properties rely on septic systems:
- Clay soil requires specialized drain field design
- Regular pumping crucial—every 3-5 years for most systems
- Heavy rain can cause system backup
- Old systems may not meet current code for home sales`
      },
      {
        type: "services",
        heading: "Plumbing Services Available in Navarro County",
        content: `A qualified Navarro County plumber should offer these essential services:

**Emergency Services (24/7)**
- Burst pipe repair
- Sewage backup cleanup
- Gas leak response
- Water heater failures
- Major fixture leaks

**Drain Services**
- Hydro jetting for stubborn clogs
- Video camera inspection
- Root removal from sewer lines
- Drain line replacement
- Preventive maintenance cleaning

**Water Heater Services**
- Tank and tankless installation
- Repair and maintenance
- Anode rod replacement (critical for hard water)
- Expansion tank installation
- Efficiency upgrades

**Slab Leak Services**
- Electronic leak detection
- Pipe rerouting (through attic or walls)
- Under-slab repair
- Epoxy pipe lining
- Foundation coordination

**Fixture Installation**
- Faucet and sink installation
- Toilet replacement and repair
- Shower and tub installation
- Garbage disposal service
- Water softener installation

**Pipe Services**
- Whole-house repiping
- Gas line installation and repair
- Water line replacement
- Polybutylene pipe replacement
- Pipe insulation for freeze protection`
      },
      {
        type: "local_info",
        heading: "Plumbing Considerations for Navarro County Homes",
        content: `**Winter Freeze Protection**
While Navarro County doesn't see extended freezes often, when temperatures drop into the teens—as they did during the 2021 winter storm—unprotected pipes are at serious risk. Local plumbers recommend:
- Insulating exposed pipes in attics, crawl spaces, and exterior walls
- Knowing location of main water shut-off valve
- Keeping cabinet doors open under sinks during freezes
- Letting faucets drip during extended freezing periods
- Considering pipe heat tape for vulnerable areas

**Well Water Systems**
Rural Navarro County properties on well water face additional considerations:
- Pressure tank maintenance and replacement
- Well pump service (submersible or jet pump)
- Iron and sulfur treatment systems
- UV or chlorine treatment for bacteria
- Regular water quality testing

**Polybutylene Pipe Concerns**
Many Navarro County homes built between 1978-1995 have polybutylene (gray plastic) water supply lines. These pipes are known to fail and many insurers won't cover or will surcharge homes with poly pipes. A repipe to PEX or copper typically costs $4,000-$8,000 for an average home but may be required for insurance or home sales.`
      },
      {
        type: "checklist",
        heading: "Hiring a Plumber in Navarro County: What to Verify",
        items: [
          "Valid Texas plumbing license (verify at TSBPE.texas.gov)",
          "Workers' compensation and liability insurance coverage",
          "Local experience with Navarro County soil and water conditions",
          "Flat-rate pricing or detailed written estimates before work begins",
          "Warranty on parts and labor (1 year minimum)",
          "Response time for emergency calls",
          "References from other Navarro County customers",
          "Whether they pull required permits for major work",
          "Experience with your specific issue (slab leaks, well pumps, etc.)",
          "Membership in professional associations (indication of commitment to trade)"
        ]
      }
    ],
    faqs: [
      {
        question: "How much does a plumber charge in Navarro County?",
        answer: "Navarro County plumbers typically charge $75-$150 for service calls plus hourly rates of $80-$150. Simple repairs like unclogging a drain run $150-$300, while major work like water heater installation runs $800-$2,000 including the unit. Emergency after-hours service usually adds 50-100% to standard rates."
      },
      {
        question: "How do I know if I have a slab leak?",
        answer: "Common signs include unexplained water bill increases, sound of running water when nothing is on, warm spots on floors, cracks in foundation accompanied by moisture, mold or mildew smell, and low water pressure. A plumber can perform electronic leak detection to locate the exact leak position without destructive testing."
      },
      {
        question: "How often should I have my drains cleaned?",
        answer: "For preventive maintenance in Navarro County homes, professional drain cleaning every 18-24 months helps prevent major clogs. Homes with older cast iron pipes, lots of trees near sewer lines, or history of clogs should consider annual cleaning. Between professional cleanings, enzyme-based monthly treatments help maintain flow."
      },
      {
        question: "Should I repair or replace my water heater?",
        answer: "Water heaters in Navarro County's hard water typically last 8-12 years versus the 12-15 year national average. If your unit is over 8 years old and needs significant repairs, replacement is usually more economical. Also consider replacing if you see rust in hot water, hear rumbling sounds, or notice pooling water around the base."
      },
      {
        question: "Do I need a permit for plumbing work?",
        answer: "In Navarro County, permits are required for water heater installation, new plumbing rough-in, sewer line replacement, and gas line work. Simple repairs like faucet replacement and drain cleaning don't require permits. Licensed plumbers handle permit acquisition as part of their service for major work."
      }
    ],
    relatedServices: ["water-heater", "drain-cleaning", "septic", "well-drilling", "water-softener"],
    externalResources: [
      { name: "Texas State Board of Plumbing Examiners", url: "https://www.tsbpe.texas.gov/" },
      { name: "City of Corsicana Utilities", url: "https://www.cityofcorsicana.com/utilities" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "electrician",
    title: "Electrician",
    category: "home_services",
    subcategory: "electrical",
    layout: 3,
    icon: "Zap",
    iconColor: "yellow",
    metaTitle: "Electrician in Navarro County, TX | Licensed Electrical Services",
    metaDescription: "Licensed electrician serving Corsicana and Navarro County. Panel upgrades, outlet installation, ceiling fans, rewiring, and 24/7 emergency electrical service.",
    metaKeywords: "electrician Corsicana, electrician Navarro County, electrical repair, panel upgrade, ceiling fan installation, rewiring",
    heroContent: `Electrical work requires expertise, proper licensing, and knowledge of local codes. In Navarro County, where homes range from turn-of-the-century downtown Corsicana properties with knob-and-tube wiring to modern smart homes with EV chargers, finding the right electrician is essential for safety and code compliance.`,
    localContext: `Navarro County's mix of historic homes, mid-century ranches, and new construction creates diverse electrical challenges. Many older homes have outdated 60-amp service when modern households need 200 amps or more. The summer heat pushes air conditioning systems hard, and undersized electrical panels can't keep up. Rural properties face additional challenges with longer utility runs and the need for backup power solutions during frequent outages.`,
    sections: [
      {
        type: "guide",
        heading: "Electrical Warning Signs Navarro County Homeowners Should Know",
        content: `Electrical problems can be dangerous. Know these warning signs:

**Immediate Danger Signs - Call Now:**
- Burning smell from outlets or switches
- Sparks when plugging in devices
- Buzzing sounds from electrical panel
- Flickering lights throughout house (not just one fixture)
- Warm or hot electrical panel
- Charred or discolored outlets

**Signs You Need Service Soon:**
- Frequently tripped breakers
- Outlets that don't work
- Two-prong outlets throughout home
- Extension cord dependency for daily use
- Dimming lights when appliances run
- Electrical panel is full with no room for additions

**Signs of Outdated Wiring:**
- Knob-and-tube wiring (pre-1940s homes)
- Cloth-covered wiring
- Aluminum branch wiring (1965-1973 homes)
- Ungrounded outlets (no third prong hole)
- Federal Pacific or Zinsco electrical panels`
      },
      {
        type: "services",
        heading: "Electrical Services for Navarro County Homes",
        content: `**Panel & Service Upgrades**
- 100-amp to 200-amp service upgrades
- Panel replacement (especially Federal Pacific, Zinsco)
- Sub-panel installation for additions or shops
- Meter base replacement
- Grounding system updates

**Indoor Electrical**
- Outlet and switch installation
- GFCI and AFCI protection upgrades
- Ceiling fan installation and repair
- Recessed lighting installation
- Under-cabinet lighting
- Whole-house rewiring
- USB outlet installation
- Smart home wiring and setup

**Outdoor & Specialty**
- Landscape lighting installation
- Security lighting with motion sensors
- Pool and hot tub wiring
- Detached garage/shop wiring
- RV hookup installation
- Generator installation and transfer switches
- EV charger installation

**Safety & Code**
- Electrical inspections
- Code violation corrections
- Aluminum wiring remediation
- Smoke/CO detector hardwiring
- Surge protection installation
- Ground fault testing`
      },
      {
        type: "local_info",
        heading: "Electrical Considerations for Navarro County Properties",
        content: `**Storm and Outage Preparedness**
Navarro County experiences frequent power outages from severe thunderstorms, ice storms, and high winds. Many residents invest in backup power:

*Portable Generators:* $500-$2,000, requires manual operation and cord connection
*Interlock Kits:* $300-$500 installed, allows safe generator connection to panel
*Standby Generators:* $5,000-$15,000 installed, automatic operation on natural gas or propane
*Battery Backup Systems:* $10,000-$25,000, pairs with solar, silent operation

**Solar Considerations**
Navarro County averages 230+ sunny days per year, making solar viable for many properties. Key considerations:
- Oncor interconnection requirements
- Net metering availability
- Roof orientation and shading
- Panel upgrade needs before solar installation

**Rural Property Challenges**
Properties outside Corsicana city limits may face:
- Longer runs from transformer (voltage drop concerns)
- Higher exposure to lightning-induced surges
- Need for taller service masts
- Agricultural electrical needs (wells, outbuildings, irrigation)

**Historic Home Wiring**
Downtown Corsicana and other historic areas have homes with original wiring:
- Knob-and-tube can be functional but limits insurance options
- Cloth wiring insulation deteriorates and becomes fire hazard
- Upgrades must often meet both current code and historic preservation standards`
      },
      {
        type: "checklist",
        heading: "Hiring an Electrician: Verification Checklist",
        items: [
          "Valid Texas electrical contractor license (verify at TDLR.texas.gov)",
          "Liability insurance ($300,000+ recommended)",
          "Workers' compensation coverage",
          "Local permits pulled for all permitted work",
          "Written estimates before work begins",
          "Warranty on workmanship (1-2 years standard)",
          "Experience with your specific needs (historic homes, generators, etc.)",
          "Clear communication about timeline and disruption",
          "Cleanup included in service",
          "References from Navarro County projects"
        ]
      }
    ],
    faqs: [
      {
        question: "How much does an electrician cost in Navarro County?",
        answer: "Navarro County electricians typically charge $75-$125 for service calls plus $75-$150 per hour. Small jobs like outlet installation run $150-$300 each. Ceiling fan installation costs $150-$350. Panel upgrades from 100 to 200 amp typically cost $1,800-$3,500. Always get written estimates for larger projects."
      },
      {
        question: "Do I need a permit for electrical work?",
        answer: "In Navarro County, permits are required for new circuits, panel work, service upgrades, and major installations. Simple repairs and like-for-like replacements typically don't require permits. Licensed electricians handle permitting and schedule required inspections as part of their service."
      },
      {
        question: "How do I know if I need a panel upgrade?",
        answer: "Consider a panel upgrade if you have less than 200-amp service, your panel is over 25 years old, breakers trip frequently, you're adding major appliances (EV charger, hot tub, shop equipment), or you have a Federal Pacific or Zinsco panel. An electrician can assess your current capacity and recommend solutions."
      },
      {
        question: "Is aluminum wiring dangerous?",
        answer: "Aluminum branch wiring (used 1965-1973) can be a fire hazard if not properly addressed. The connections can loosen over time, creating heat and potential fire risk. Solutions include replacing with copper, installing COPALUM connectors, or using approved aluminum-rated devices. An electrician should evaluate and document the condition."
      },
      {
        question: "How long does a whole-house rewire take?",
        answer: "A complete rewire of an average Navarro County home (1,500-2,500 sq ft) typically takes 3-5 days. This includes removing old wiring, running new circuits, installing a new panel, and reconnecting devices. Drywall repair is usually needed and adds additional time. Cost ranges from $8,000-$15,000 depending on home size and access."
      }
    ],
    relatedServices: ["generator", "solar", "home-security", "hvac", "ev-charger"],
    externalResources: [
      { name: "Texas Department of Licensing and Regulation - Electricians", url: "https://www.tdlr.texas.gov/electricians/electricians.htm" },
      { name: "Oncor Electric Delivery", url: "https://www.oncor.com/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "hvac",
    title: "HVAC",
    category: "home_services",
    subcategory: "climate",
    layout: 4,
    icon: "Thermometer",
    iconColor: "red",
    metaTitle: "HVAC Service in Navarro County, TX | AC Repair & Heating Corsicana",
    metaDescription: "HVAC service for Corsicana and Navarro County. AC repair, furnace service, heat pump installation, and 24/7 emergency heating and cooling for Texas summers.",
    metaKeywords: "HVAC Corsicana, AC repair Navarro County, heating repair, air conditioning, heat pump installation, furnace repair",
    heroContent: `In Navarro County, your HVAC system isn't a luxury—it's a necessity. With summer temperatures regularly exceeding 100°F and over 2,700 cooling degree days annually, air conditioning runs nearly year-round. Finding a reliable HVAC contractor who understands our climate and homes is essential for comfort and managing energy costs.`,
    localContext: `Navarro County's climate presents unique HVAC challenges. Our humid subtropical conditions mean systems must handle both temperature and humidity control. The long cooling season—typically April through October—puts tremendous strain on equipment. Many older Corsicana homes have undersized ductwork designed for an era before central air, limiting system efficiency. Proper sizing and installation aren't just about comfort; they're about managing electricity bills that can exceed $300 monthly during peak summer.`,
    sections: [
      {
        type: "guide",
        heading: "HVAC Challenges Specific to Navarro County",
        content: `**Extreme Cooling Demands**
With 80+ days above 90°F annually and heat indexes often exceeding 105°F, Navarro County AC systems work harder and longer than units in most of the country. This means:
- Compressors face 30% more run time than national averages
- Refrigerant systems are under constant high-pressure operation
- Air filters clog faster due to continuous operation
- Electrical components face more thermal stress

**Humidity Management**
Central Texas humidity, especially during spring and early summer, requires systems that effectively dehumidify:
- Oversized units cool quickly but don't run long enough to remove humidity
- Properly sized systems provide better humidity control
- Variable-speed systems excel in our climate
- Additional dehumidification may be needed in tight newer homes

**Dust and Allergens**
Navarro County's agricultural surroundings and Blackland Prairie soils create dusty conditions:
- Outdoor units require regular cleaning
- Higher-grade filters recommended (MERV 11-13)
- Ductwork should be inspected for leaks allowing dust infiltration
- Consider UV lights or air purifiers for allergy sufferers

**Power Quality Issues**
Rural areas of Navarro County experience voltage fluctuations that can damage HVAC equipment:
- Surge protectors recommended for outdoor units
- Hard-start kits extend compressor life
- Voltage monitors can prevent damage during brownouts`
      },
      {
        type: "services",
        heading: "HVAC Services Available in Navarro County",
        content: `**Air Conditioning Services**
- AC repair and diagnostics
- New AC installation
- Refrigerant recharge (R-410A systems)
- Compressor replacement
- Condenser coil cleaning
- Evaporator coil replacement
- Thermostat upgrades (smart thermostats)

**Heating Services**
- Furnace repair and maintenance
- Heat pump service and installation
- Heating element replacement
- Gas line connections
- Pilot light and ignition repair
- Heat exchanger inspection

**Ductwork Services**
- Duct leak testing and sealing
- Ductwork replacement
- Duct cleaning
- Zoning system installation
- Return air modifications
- Insulation upgrades

**Indoor Air Quality**
- Air filtration system installation
- UV light purification systems
- Whole-house dehumidifiers
- Ventilation improvements
- Duct sanitization

**Maintenance Programs**
- Seasonal tune-ups (spring AC, fall heating)
- Priority emergency service
- Parts discounts
- Extended equipment life
- Maintained warranty compliance`
      },
      {
        type: "comparison",
        heading: "Choosing the Right System for Navarro County",
        content: `**Central Air Conditioner + Gas Furnace (Traditional)**
Most common in Navarro County. Gas furnace handles winter (natural gas widely available), AC handles summer.
- Pros: Proven technology, separate components, lower upfront cost
- Cons: Two systems to maintain, natural gas required
- Cost: $6,000-$12,000 installed

**Heat Pump (Dual Purpose)**
Single system provides both heating and cooling. Works well in our mild winters.
- Pros: Energy efficient, one system, works well to about 35°F
- Cons: Less efficient in coldest weather, may need auxiliary heat strips
- Cost: $7,000-$14,000 installed

**Mini-Split Systems (Ductless)**
Individual wall-mounted units for each zone. Good for additions, older homes, garages.
- Pros: No ductwork needed, zone control, very efficient
- Cons: Higher per-ton cost, visible interior units
- Cost: $3,000-$5,000 per zone

**Dual Fuel (Heat Pump + Gas Furnace)**
Heat pump handles moderate temperatures, furnace kicks in for coldest days. Premium efficiency.
- Pros: Most efficient option for our climate, best of both worlds
- Cons: Higher upfront cost, more complex system
- Cost: $10,000-$18,000 installed

**Geothermal**
Uses ground temperature for heating and cooling. Very efficient but high installation cost.
- Pros: Lowest operating cost, 25+ year life, quiet operation
- Cons: High upfront cost, requires land for ground loops
- Cost: $20,000-$35,000 installed`
      },
      {
        type: "checklist",
        heading: "Finding a Quality HVAC Contractor",
        items: [
          "TDLR HVAC contractor license (verify online)",
          "EPA 608 certification for refrigerant handling",
          "Insurance coverage (liability and workers' comp)",
          "NATE-certified technicians preferred",
          "Local references in Navarro County",
          "Written load calculation before sizing new equipment",
          "Detailed written estimates with equipment model numbers",
          "Warranty coverage explained (parts, labor, compressor)",
          "Maintenance plan options offered",
          "Emergency service availability and response time"
        ]
      }
    ],
    faqs: [
      {
        question: "How much does AC repair cost in Navarro County?",
        answer: "Service calls typically run $75-$125 plus repairs. Common repairs include capacitor replacement ($150-$300), contactor replacement ($150-$350), refrigerant recharge ($200-$500), and blower motor replacement ($400-$700). Compressor replacement runs $1,200-$2,500. For systems over 10 years old, compare repair costs to replacement value."
      },
      {
        question: "How often should I service my HVAC system?",
        answer: "In Navarro County's demanding climate, twice-yearly maintenance is recommended—once in spring before cooling season and once in fall before heating season. This includes coil cleaning, refrigerant check, electrical inspection, and filter replacement. Regular maintenance can extend equipment life by 5+ years and maintain efficiency."
      },
      {
        question: "What size AC do I need for my Navarro County home?",
        answer: "A proper Manual J load calculation is essential—rules of thumb often result in oversized systems. Generally, Navarro County homes need 400-500 square feet per ton of cooling, but factors like insulation, window orientation, and ceiling height affect sizing. Oversized units short-cycle, failing to properly dehumidify."
      },
      {
        question: "How long do HVAC systems last in Texas?",
        answer: "Due to our long cooling season and high demand, Navarro County HVAC systems typically last 12-15 years versus 15-20 years in milder climates. Well-maintained systems can exceed this, while neglected units may fail in 8-10 years. If your system is 10+ years old and needs major repairs, consider replacement."
      },
      {
        question: "Should I replace my AC and furnace at the same time?",
        answer: "Generally, yes. Matched systems operate more efficiently and carry better warranties. If your furnace is over 15 years old when your AC fails, replacing both makes sense. However, if your furnace is under 10 years old and in good condition, you can replace just the AC with a compatible unit."
      }
    ],
    relatedServices: ["electrician", "insulation", "duct-cleaning", "air-quality", "generator"],
    externalResources: [
      { name: "Texas Department of Licensing and Regulation - HVAC", url: "https://www.tdlr.texas.gov/acr/acr.htm" },
      { name: "ENERGY STAR HVAC Guide", url: "https://www.energystar.gov/products/heating_cooling" },
      { name: "Oncor Rebates", url: "https://www.oncor.com/savings" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "roofing",
    title: "Roofing",
    category: "home_services",
    subcategory: "exterior",
    layout: 5,
    icon: "Home",
    iconColor: "slate",
    metaTitle: "Roofing Contractor in Navarro County, TX | Roof Repair Corsicana",
    metaDescription: "Roofing contractor serving Corsicana and Navarro County. Roof repair, replacement, storm damage, shingle and metal roofing with free estimates.",
    metaKeywords: "roofing Corsicana, roof repair Navarro County, roof replacement, storm damage repair, metal roofing, shingle roof",
    heroContent: `Navarro County roofs face some of the toughest conditions in Texas. From softball-sized hail in spring storms to relentless summer sun that can push shingle temperatures past 160°F, our roofs work hard to protect our homes. Choosing the right roofing contractor and materials for our local conditions is essential for a roof that lasts.`,
    localContext: `Navarro County experiences an average of 5-7 significant hail events annually, with hailstones frequently exceeding 1 inch in diameter. The May 2020 storm that hit Corsicana caused over $50 million in roof damage alone. Our location in Tornado Alley means roofs must also withstand high winds, with gusts regularly exceeding 60 mph during severe weather. Understanding these challenges helps homeowners make better roofing decisions.`,
    sections: [
      {
        type: "guide",
        heading: "Signs Your Navarro County Roof Needs Attention",
        content: `**After Storm Events (Check Within 48 Hours):**
- Visible missing or damaged shingles
- Dents on metal vents, flashing, or gutters
- Granule accumulation in gutters or downspout areas
- Exposed roof deck visible from ground
- Leaks or water stains appearing inside

**Age-Related Warning Signs:**
- Shingles curling at edges or cupping in center
- Bald spots where granules have worn away
- Cracked or brittle shingles
- Moss or algae growth (indicates moisture retention)
- Daylight visible through roof boards in attic

**Structural Concerns:**
- Sagging roof sections
- Damaged or missing flashing around vents and chimneys
- Deteriorating soffit or fascia
- Multiple layers of shingles (maximum 2 allowed by code)
- Previous patch repairs failing

**Interior Indicators:**
- Water stains on ceilings or walls
- Mold or mildew in attic
- Peeling paint near roofline
- Higher than normal energy bills (poor ventilation)
- Ice dams in winter (rare but indicates ventilation issues)`
      },
      {
        type: "comparison",
        heading: "Roofing Materials for Navarro County Conditions",
        content: `**3-Tab Asphalt Shingles**
The basic option, declining in popularity due to limited hail resistance.
- Lifespan: 15-20 years in our climate
- Wind Rating: 60-70 mph
- Hail Rating: Class 1-2 (minimal protection)
- Cost: $3.00-$4.50 per sq ft installed
- Best For: Budget-conscious, rental properties

**Architectural (Dimensional) Shingles**
Most popular choice in Navarro County for balance of cost and performance.
- Lifespan: 20-30 years in our climate
- Wind Rating: 110-130 mph
- Hail Rating: Class 2-3 (moderate protection)
- Cost: $4.50-$6.50 per sq ft installed
- Best For: Most residential applications

**Impact-Resistant Shingles (Class 4)**
Premium shingles designed for hail protection. Insurance discounts often available.
- Lifespan: 25-30 years
- Wind Rating: 110-130+ mph
- Hail Rating: Class 4 (highest rating)
- Cost: $6.00-$9.00 per sq ft installed
- Best For: Hail-prone areas (all of Navarro County), insurance savings

**Metal Roofing (Standing Seam)**
Increasingly popular for durability and energy efficiency.
- Lifespan: 40-70 years
- Wind Rating: 140+ mph
- Hail Rating: Dent resistant (especially aluminum)
- Cost: $10.00-$18.00 per sq ft installed
- Best For: Long-term homes, rural properties, energy efficiency

**Metal Shingles/Tiles**
Metal fabricated to look like shingles, tiles, or shake.
- Lifespan: 40-50 years
- Wind Rating: 120+ mph
- Hail Rating: Impact resistant
- Cost: $8.00-$14.00 per sq ft installed
- Best For: Want metal durability with traditional look

**Stone-Coated Steel**
Steel panels with stone granule coating. Popular for hail resistance.
- Lifespan: 50+ years
- Wind Rating: 120+ mph
- Hail Rating: Class 4
- Cost: $9.00-$15.00 per sq ft installed
- Best For: Maximum protection with aesthetic options`
      },
      {
        type: "local_info",
        heading: "Insurance and Storm Damage Considerations",
        content: `**Navigating Insurance Claims in Navarro County**
With our frequent hail storms, understanding the insurance process is essential:

*Documenting Damage:*
- Photograph damage immediately after storms
- Get professional inspection within 48 hours
- Don't make permanent repairs before adjuster visit
- Keep all damaged materials for inspection

*Insurance Inspection Process:*
- Request contractor be present during adjuster visit
- Adjuster may miss concealed damage—insist on thorough inspection
- Get independent inspection if you disagree with assessment
- Understand your policy's actual cash value vs. replacement cost terms

*Choosing a Storm Damage Contractor:*
- Beware of storm chasers with out-of-state plates
- Verify contractor is licensed and local
- Never sign assignment of benefits (AOB) without understanding implications
- Get multiple estimates before committing
- Avoid "free roof" claims—reputable contractors work with your insurance fairly

**Class 4 Shingle Insurance Discounts**
Texas Insurance Code requires insurers to offer discounts for Class 4 impact-resistant shingles. In Navarro County, these discounts typically range from 10-35% on the dwelling portion of your premium. For a home with $1,500 annual premium, this could save $150-$500 yearly—often paying for the upgrade within 5-7 years.`
      },
      {
        type: "checklist",
        heading: "Vetting a Roofing Contractor in Navarro County",
        items: [
          "Verify Texas roofing contractor license or registration",
          "Confirm adequate liability insurance ($1 million+ recommended)",
          "Workers' compensation coverage for crew",
          "Physical local address (not just P.O. box)",
          "Established business (5+ years preferred)",
          "Written warranty on workmanship (5-10 years)",
          "Manufacturer certification for material warranties",
          "Detailed written estimate with materials specified",
          "No large upfront deposit required (material deposit OK)",
          "References from recent Navarro County projects",
          "Better Business Bureau rating check",
          "Pull all required permits through proper channels"
        ]
      }
    ],
    faqs: [
      {
        question: "How much does a new roof cost in Navarro County?",
        answer: "For a typical 2,000 sq ft home (about 25 roofing squares), expect to pay $8,000-$12,000 for quality architectural shingles, $12,000-$16,000 for Class 4 impact-resistant shingles, or $20,000-$35,000 for standing seam metal. These prices include tear-off of one layer, new underlayment, and proper installation."
      },
      {
        question: "How long does roof replacement take?",
        answer: "Most residential roof replacements in Navarro County are completed in 1-3 days, weather permitting. Simple roofs may be done in one day, while complex roofs with multiple levels, dormers, or skylights take longer. Material availability can also affect timing—specialty orders may add lead time."
      },
      {
        question: "Should I repair or replace my roof?",
        answer: "Consider replacement if your roof is over 15 years old, has widespread damage, has had multiple repairs, or you're seeing systemic issues like widespread granule loss. Repairs make sense for localized damage on newer roofs. A reputable contractor will give honest assessment—if they push replacement on a 5-year-old roof with minor damage, get another opinion."
      },
      {
        question: "Will my homeowners insurance cover roof replacement?",
        answer: "Insurance covers damage from covered perils like hail, wind, and fallen trees, but not normal wear and aging. If your roof fails due to age, you'll pay out of pocket. After a storm, have your roof professionally inspected—damage may not be visible from ground level. Document everything and file claims promptly."
      },
      {
        question: "What's the best roofing material for Navarro County?",
        answer: "For most Navarro County homeowners, Class 4 impact-resistant architectural shingles offer the best balance of protection, cost, and insurance savings. For maximum longevity and storm protection, standing seam metal or stone-coated steel are excellent choices. Consider your budget, how long you plan to stay in the home, and potential insurance discounts."
      }
    ],
    relatedServices: ["gutter", "siding", "home-inspector", "insurance-agent", "painter"],
    externalResources: [
      { name: "Texas Department of Insurance - Roofing Consumer Information", url: "https://www.tdi.texas.gov" },
      { name: "Navarro County Building Department", url: "https://www.navarrocounty.org" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // Continue with more services...
  // Adding abbreviated entries for remaining pages to keep file manageable
  // Full content would follow same detailed pattern

  {
    slug: "pest-control",
    title: "Pest Control",
    category: "home_services",
    subcategory: "maintenance",
    layout: 1,
    icon: "Bug",
    iconColor: "green",
    metaTitle: "Pest Control in Navarro County, TX | Exterminator Corsicana",
    metaDescription: "Pest control services for Corsicana and Navarro County. Termite treatment, ant control, rodent removal, and preventive pest management for Texas homes.",
    metaKeywords: "pest control Corsicana, exterminator Navarro County, termite treatment, ant control, rodent control",
    heroContent: `Navarro County's warm climate and mix of urban and rural environments create ideal conditions for a wide variety of pests. From the fire ants that plague our yards to the termites that threaten our homes' structures, effective pest management is essential for Navarro County property owners.`,
    localContext: `The Texas Blackland Prairie region hosts aggressive pest populations year-round. Subterranean termites cause more damage in Texas than any other state, with Navarro County properties at particular risk due to our clay soils and older housing stock. Fire ants, imported to Texas in the 1950s, have established dense populations throughout the county. Our proximity to farmland brings additional challenges including rodents seeking shelter in homes during harvest season.`,
    sections: [
      {
        type: "guide",
        heading: "Common Pests in Navarro County",
        content: `**Structural Pests:**
- Subterranean termites (most destructive)
- Carpenter ants
- Wood-boring beetles
- Powder post beetles

**Stinging Insects:**
- Fire ants (imported red fire ant)
- Paper wasps
- Yellow jackets
- Africanized bees (increasing presence)

**Crawling Insects:**
- American cockroaches ("waterbugs")
- German cockroaches
- Spiders (brown recluse, black widow)
- Scorpions
- Silverfish
- Crickets

**Rodents:**
- House mice
- Norway rats
- Roof rats
- Field mice (seasonal)

**Wildlife:**
- Raccoons
- Opossums
- Skunks
- Squirrels
- Armadillos`
      }
    ],
    faqs: [
      {
        question: "How much does pest control cost in Navarro County?",
        answer: "Monthly pest control service runs $35-$60 per month. Quarterly service costs $100-$175 per treatment. One-time treatments range from $150-$400 depending on pest type. Termite treatment typically costs $1,200-$3,000 for liquid treatment or $8-$12 per linear foot for bait systems."
      },
      {
        question: "How often should I have pest control in Texas?",
        answer: "Due to our year-round pest activity, quarterly professional treatment is recommended for most Navarro County homes. Properties with history of issues, wooded lots, or proximity to water may benefit from bi-monthly service. Termite inspections should be conducted annually."
      }
    ],
    relatedServices: ["termite-control", "wildlife-removal", "lawn-care", "landscaping"],
    externalResources: [
      { name: "Texas A&M AgriLife Extension - Urban Entomology", url: "https://urbanentomology.tamu.edu/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "landscaping",
    title: "Landscaping",
    category: "home_services",
    subcategory: "outdoor",
    layout: 2,
    icon: "Trees",
    iconColor: "emerald",
    metaTitle: "Landscaping in Navarro County, TX | Lawn Care & Landscape Design",
    metaDescription: "Landscaping services for Corsicana and Navarro County. Lawn care, landscape design, irrigation, tree service, and seasonal maintenance for Texas properties.",
    metaKeywords: "landscaping Corsicana, lawn care Navarro County, landscape design, irrigation, tree trimming",
    heroContent: `Creating and maintaining beautiful landscapes in Navarro County requires understanding our unique climate, soil, and growing conditions. From the hot, dry summers to the clay-heavy Blackland Prairie soils, successful landscaping here demands expertise in plants and techniques suited to Central Texas.`,
    localContext: `Navarro County's USDA Hardiness Zone 8a climate supports a diverse range of plants but also presents challenges. Summer temperatures regularly exceed 100°F, and drought is a recurring concern. Our heavy clay soils have poor drainage yet crack deeply when dry. Native and adapted plants thrive here, while many traditional landscape plants struggle without significant amendment and irrigation.`,
    sections: [
      {
        type: "guide",
        heading: "Landscaping for Navarro County Conditions",
        content: `**Best Lawn Grasses for Our Area:**
- Bermudagrass: Drought-tolerant, sun-loving, most popular choice
- St. Augustinegrass: Shade-tolerant, needs more water
- Zoysiagrass: Moderate water needs, good traffic tolerance
- Buffalograss: Native, extremely drought-tolerant, low maintenance

**Native Plants That Thrive:**
- Texas Sage (Leucophyllum)
- Flame Acanthus
- Blackfoot Daisy
- Mexican Honeysuckle
- Turk's Cap
- Texas Mountain Laurel
- Possumhaw Holly

**Trees Suited to Navarro County:**
- Live Oak (iconic Texas tree)
- Bur Oak
- Cedar Elm
- Desert Willow
- Texas Redbud
- Vitex
- Crape Myrtle (not native but well-adapted)`
      }
    ],
    faqs: [
      {
        question: "How much does lawn care cost in Navarro County?",
        answer: "Weekly mowing for average-sized yards (under 10,000 sq ft) runs $30-$50 per visit. Full-service lawn care including fertilization and weed control adds $200-$400 per year. Landscape installation varies widely—basic plantings start around $500 while comprehensive landscape design and installation can run $5,000-$20,000+."
      }
    ],
    relatedServices: ["tree-service", "irrigation", "lawn-care", "hardscape", "outdoor-lighting"],
    externalResources: [
      { name: "Texas A&M AgriLife Extension - Navarro County", url: "https://navarro.agrilife.org/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // PROFESSIONAL SERVICES
  // ============================================

  {
    slug: "attorney",
    title: "Attorney",
    category: "professional_services",
    subcategory: "legal",
    layout: 3,
    icon: "Scale",
    iconColor: "slate",
    metaTitle: "Attorney in Navarro County, TX | Lawyer in Corsicana",
    metaDescription: "Find an attorney in Corsicana and Navarro County. Legal services for family law, criminal defense, personal injury, estate planning, and business law.",
    metaKeywords: "attorney Corsicana, lawyer Navarro County, legal services, family law, criminal defense",
    heroContent: `Legal matters require experienced counsel who understands not just the law, but the local courts and community. Navarro County attorneys practice in the 13th Judicial District Court and County Courts, handling everything from family disputes to criminal defense to business transactions.`,
    localContext: `The Navarro County legal community, centered around the historic 1905 Courthouse in Corsicana, serves a diverse population with varied legal needs. From oil and gas matters reflecting the county's petroleum history to agricultural law serving our farming community, local attorneys handle cases that require understanding of both Texas law and local practices.`,
    sections: [
      {
        type: "guide",
        heading: "Legal Services Available in Navarro County",
        content: `**Family Law:**
- Divorce and legal separation
- Child custody and visitation
- Child support modifications
- Adoption
- Prenuptial agreements
- Protective orders

**Criminal Defense:**
- DWI/DUI defense
- Drug charges
- Assault and violent crimes
- Theft and property crimes
- Juvenile defense
- Probation violations

**Personal Injury:**
- Auto accidents
- Workplace injuries
- Medical malpractice
- Premises liability
- Wrongful death

**Estate Planning:**
- Wills and trusts
- Powers of attorney
- Probate
- Estate administration
- Guardianship

**Business Law:**
- Business formation
- Contracts
- Commercial litigation
- Employment law`
      }
    ],
    faqs: [
      {
        question: "How much does a lawyer cost in Navarro County?",
        answer: "Attorney fees vary by practice area and complexity. Family law and criminal defense often charge $200-$400 per hour or flat fees of $2,500-$10,000 for standard cases. Personal injury attorneys typically work on contingency (25-40% of settlement). Estate planning ranges from $300-$1,500 for basic documents to $3,000+ for complex trusts."
      }
    ],
    relatedServices: ["family-lawyer", "criminal-lawyer", "personal-injury-lawyer", "estate-attorney", "accountant"],
    externalResources: [
      { name: "State Bar of Texas - Find a Lawyer", url: "https://www.texasbar.com/AM/Template.cfm?Section=Find_A_Lawyer" },
      { name: "Navarro County Courts", url: "https://www.navarrocounty.org/district-court" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "accountant",
    title: "Accountant",
    category: "professional_services",
    subcategory: "financial",
    layout: 4,
    icon: "Calculator",
    iconColor: "blue",
    metaTitle: "Accountant in Navarro County, TX | CPA & Tax Services Corsicana",
    metaDescription: "CPA and accounting services in Corsicana and Navarro County. Tax preparation, bookkeeping, payroll, small business accounting, and financial planning.",
    metaKeywords: "accountant Corsicana, CPA Navarro County, tax preparation, bookkeeping, small business accounting",
    heroContent: `Whether you're a small business owner navigating Texas franchise tax, a farmer dealing with agricultural deductions, or a family planning for the future, working with a local accountant who understands Navarro County's economy provides significant advantages.`,
    localContext: `Navarro County's diverse economy—spanning oil and gas, agriculture, manufacturing, and small business—creates varied accounting needs. Local CPAs understand the specific tax considerations for cotton farmers, oil royalty recipients, and Main Street business owners alike. With the Texas franchise tax, sales tax requirements, and federal obligations, professional accounting guidance helps Navarro County residents and businesses stay compliant while minimizing tax burden.`,
    sections: [
      {
        type: "services",
        heading: "Accounting Services Available Locally",
        content: `**Tax Services:**
- Individual tax preparation
- Business tax preparation (sole proprietor, LLC, S-Corp, C-Corp)
- Farm and ranch tax returns
- Oil, gas, and mineral rights taxation
- Tax planning strategies
- IRS representation

**Business Accounting:**
- Bookkeeping services
- Payroll processing
- Financial statement preparation
- Cash flow analysis
- Accounts receivable/payable management
- QuickBooks setup and training

**Advisory Services:**
- Business startup consulting
- Entity selection guidance
- Retirement planning
- Estate tax planning
- Succession planning for family businesses`
      }
    ],
    faqs: [
      {
        question: "How much does an accountant cost in Navarro County?",
        answer: "Individual tax returns typically cost $150-$400 depending on complexity. Business returns range from $400-$1,500+. Monthly bookkeeping runs $200-$600 for small businesses. Hourly rates for CPAs in our area typically range from $100-$250 per hour. Many offer package pricing for combined services."
      }
    ],
    relatedServices: ["tax-preparer", "bookkeeper", "financial-advisor", "payroll-service", "attorney"],
    externalResources: [
      { name: "Texas State Board of Public Accountancy", url: "https://www.tsbpa.texas.gov/" },
      { name: "IRS Free File", url: "https://www.irs.gov/filing/free-file-do-your-federal-taxes-for-free" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "realtor",
    title: "Realtor",
    category: "professional_services",
    subcategory: "real_estate",
    layout: 5,
    icon: "Home",
    iconColor: "green",
    metaTitle: "Realtor in Navarro County, TX | Real Estate Agent Corsicana",
    metaDescription: "Find a realtor in Corsicana and Navarro County. Expert real estate agent for buying or selling homes, land, farms, and commercial property in Central Texas.",
    metaKeywords: "realtor Corsicana, real estate agent Navarro County, homes for sale, land for sale, Central Texas real estate",
    heroContent: `Buying or selling property in Navarro County is a significant decision that benefits from local expertise. A Navarro County realtor understands our market values, neighborhoods, school districts, and the unique aspects of Central Texas real estate—from historic Corsicana homes to rural acreages and everything in between.`,
    localContext: `The Navarro County real estate market offers diverse opportunities at price points below the DFW metroplex just an hour north. From affordable first homes to sprawling ranches, the county attracts buyers seeking value and rural lifestyle while maintaining reasonable access to urban employment centers. Local realtors understand flood zones along Richland Creek, mineral rights considerations in oil country, and the charm of historic downtown Corsicana properties.`,
    sections: [
      {
        type: "guide",
        heading: "Navarro County Real Estate Market Overview",
        content: `**Market Characteristics:**
- Median home price significantly below state average
- Mix of urban, suburban, and rural properties
- Growing interest from DFW buyers seeking affordable land
- Active farm and ranch market
- Historic properties in downtown Corsicana

**Popular Areas:**
- Corsicana (county seat, most amenities)
- Kerens (smaller community, lake access nearby)
- Blooming Grove (small-town living)
- Rice (rural, agricultural)
- Frost (small community, ISD)

**Property Types Available:**
- Single-family homes (all eras)
- Historic properties (downtown Corsicana)
- New construction (limited but growing)
- Land and acreage (plentiful)
- Farms and ranches
- Lake properties (nearby Lake Bardwell, Navarro Mills)
- Commercial and investment properties`
      }
    ],
    faqs: [
      {
        question: "How much does a realtor cost?",
        answer: "Real estate commissions in Navarro County typically total 5-6% of the sale price, usually split between buyer's and seller's agents. Sellers traditionally pay the commission from sale proceeds. Buyers typically don't pay their agent directly. Some agents offer reduced commission structures for certain services."
      }
    ],
    relatedServices: ["home-inspector", "mortgage-lender", "title-company", "appraiser", "attorney"],
    externalResources: [
      { name: "Texas Real Estate Commission", url: "https://www.trec.texas.gov/" },
      { name: "Navarro County Appraisal District", url: "https://www.navarrocad.com/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // HEALTH & WELLNESS
  // ============================================

  {
    slug: "dentist",
    title: "Dentist",
    category: "health_wellness",
    subcategory: "dental",
    layout: 1,
    icon: "Smile",
    iconColor: "cyan",
    metaTitle: "Dentist in Navarro County, TX | Dental Care Corsicana",
    metaDescription: "Find a dentist in Corsicana and Navarro County. Family dentistry, cosmetic dental, emergency dental care, and orthodontics for all ages.",
    metaKeywords: "dentist Corsicana, dental care Navarro County, family dentist, emergency dentist, teeth cleaning",
    heroContent: `Maintaining good oral health is essential for overall well-being. Navarro County residents have access to quality dental care ranging from preventive services to advanced restorative and cosmetic treatments. Finding a dentist who meets your family's needs ensures consistent care for lasting oral health.`,
    localContext: `Navarro County's dental practices serve patients across the spectrum, from young families to seniors. Many accept Medicaid and CHIP for children's dental coverage, helping address dental health disparities in our community. With the nearest dental specialists often in Dallas or Waco, general dentists in Navarro County frequently handle a broader range of procedures than their urban counterparts.`,
    sections: [
      {
        type: "services",
        heading: "Dental Services Available in Navarro County",
        content: `**Preventive Care:**
- Routine cleanings and exams
- X-rays and diagnostics
- Fluoride treatments
- Dental sealants
- Oral cancer screenings
- Periodontal evaluations

**Restorative Dentistry:**
- Fillings (composite and amalgam)
- Crowns and bridges
- Root canal therapy
- Dentures and partials
- Dental implants
- Extractions

**Cosmetic Dentistry:**
- Teeth whitening
- Veneers
- Bonding
- Smile makeovers
- Clear aligners

**Specialty Services:**
- Pediatric dentistry
- Emergency dental care
- Sedation dentistry
- TMJ treatment
- Sleep apnea appliances`
      }
    ],
    faqs: [
      {
        question: "How much does dental care cost without insurance?",
        answer: "Basic cleaning and exam runs $100-$200. Fillings cost $150-$300 per tooth. Crowns range from $800-$1,500. Root canals run $700-$1,200. Extractions cost $150-$400 for simple, $250-$600 for surgical. Many Navarro County dentists offer payment plans and membership programs for uninsured patients."
      }
    ],
    relatedServices: ["orthodontist", "oral-surgeon", "pediatric-dentist"],
    externalResources: [
      { name: "Texas State Board of Dental Examiners", url: "https://www.tsbde.texas.gov/" },
      { name: "Texas Dental Association - Find a Dentist", url: "https://www.tda.org/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "veterinarian",
    title: "Veterinarian",
    category: "health_wellness",
    subcategory: "animal_care",
    layout: 2,
    icon: "Heart",
    iconColor: "rose",
    metaTitle: "Veterinarian in Navarro County, TX | Vet Clinic Corsicana",
    metaDescription: "Find a veterinarian in Corsicana and Navarro County. Pet care, vaccinations, surgery, emergency vet services, and large animal care for Central Texas.",
    metaKeywords: "veterinarian Corsicana, vet clinic Navarro County, pet care, animal hospital, large animal vet",
    heroContent: `Navarro County pet owners and livestock producers need reliable veterinary care for their animals. From routine wellness checks for family pets to emergency care for horses and cattle, local veterinarians serve the diverse animal population of Central Texas.`,
    localContext: `Navarro County's mix of urban and rural areas means veterinary practices often serve both small and large animals. Beyond the typical dogs and cats, local vets care for horses, cattle, goats, sheep, and exotics. The agricultural heritage of the region requires veterinarians skilled in livestock medicine, reproduction, and herd health—expertise that may be harder to find in purely urban areas.`,
    sections: [
      {
        type: "services",
        heading: "Veterinary Services in Navarro County",
        content: `**Small Animal Services:**
- Wellness exams and vaccinations
- Spay/neuter surgery
- Dental care
- Diagnostic imaging (X-ray, ultrasound)
- Laboratory testing
- Microchipping
- Surgery (soft tissue and orthopedic)
- Chronic disease management
- End-of-life care

**Large Animal Services:**
- Farm calls and ranch visits
- Equine wellness and lameness
- Cattle herd health programs
- Reproduction services (AI, pregnancy checking)
- Emergency colic and injury treatment
- Coggins testing
- Health certificates for transport

**Emergency Services:**
- After-hours emergency care (varies by clinic)
- Trauma and injury treatment
- Toxin ingestion
- Bloat and GDV treatment`
      }
    ],
    faqs: [
      {
        question: "How much does a vet visit cost in Navarro County?",
        answer: "Basic wellness exams run $45-$75. Vaccinations cost $20-$40 each. Spay/neuter surgery ranges from $150-$400 for dogs, $100-$200 for cats. Emergency visits typically cost $100-$200 for exam plus treatment. Farm calls for large animals run $50-$100 plus mileage and services rendered."
      }
    ],
    relatedServices: ["pet-groomer", "pet-boarding", "pet-sitter", "feed-store"],
    externalResources: [
      { name: "Texas State Board of Veterinary Medical Examiners", url: "https://www.veterinary.texas.gov/" },
      { name: "ASPCA Animal Poison Control", url: "https://www.aspca.org/pet-care/animal-poison-control" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "chiropractor",
    title: "Chiropractor",
    category: "health_wellness",
    subcategory: "alternative",
    layout: 3,
    icon: "Activity",
    iconColor: "purple",
    metaTitle: "Chiropractor in Navarro County, TX | Chiropractic Care Corsicana",
    metaDescription: "Find a chiropractor in Corsicana and Navarro County. Chiropractic adjustments, back pain relief, sports injuries, and wellness care for all ages.",
    metaKeywords: "chiropractor Corsicana, chiropractic Navarro County, back pain, neck pain, spinal adjustment",
    heroContent: `Chiropractic care offers a drug-free approach to managing pain and improving function. Navarro County chiropractors help patients with back pain, neck pain, headaches, and other musculoskeletal conditions through spinal adjustments and complementary therapies.`,
    localContext: `Many Navarro County residents work in occupations that put strain on their bodies—farming, oil field work, manufacturing, and long-distance driving. Chiropractic care can be particularly valuable for these populations in managing work-related strain and maintaining mobility. Local chiropractors understand the physical demands our community faces and tailor treatment accordingly.`,
    sections: [
      {
        type: "services",
        heading: "Chiropractic Services Available",
        content: `**Core Chiropractic Care:**
- Spinal adjustments
- Extremity adjustments
- Spinal decompression therapy
- Posture correction
- Ergonomic assessment

**Complementary Therapies:**
- Massage therapy
- Physical therapy modalities
- Electrical stimulation
- Ultrasound therapy
- Cold laser therapy
- Kinesiology taping

**Specialized Care:**
- Sports injury rehabilitation
- Auto accident injury treatment
- Work injury treatment
- Prenatal chiropractic
- Pediatric chiropractic
- Geriatric care`
      }
    ],
    faqs: [
      {
        question: "How much does a chiropractor cost?",
        answer: "Initial visits with exam typically run $100-$200. Regular adjustment visits cost $40-$75. Package pricing often offers better value for ongoing care. Many insurance plans cover chiropractic with copays of $20-$50. Medicare covers chiropractic adjustments with standard Part B costs."
      }
    ],
    relatedServices: ["massage-therapist", "physical-therapist", "acupuncture"],
    externalResources: [
      { name: "Texas Board of Chiropractic Examiners", url: "https://www.tbce.state.tx.us/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // AUTOMOTIVE
  // ============================================

  {
    slug: "auto-repair",
    title: "Auto Repair",
    category: "automotive",
    subcategory: "repair",
    layout: 4,
    icon: "Car",
    iconColor: "blue",
    metaTitle: "Auto Repair in Navarro County, TX | Mechanic Corsicana",
    metaDescription: "Find auto repair in Corsicana and Navarro County. Car mechanic, oil change, brake repair, engine diagnostics, and transmission service for all vehicles.",
    metaKeywords: "auto repair Corsicana, mechanic Navarro County, car repair, brake repair, oil change",
    heroContent: `Keeping your vehicle running reliably is essential in Navarro County, where distances between towns make dependable transportation crucial. Local auto repair shops provide everything from basic maintenance to major repairs, often at prices well below dealership rates.`,
    localContext: `Navarro County's roads—from the interstate to rural farm roads—put varied demands on vehicles. The summer heat is particularly hard on cooling systems and batteries, while the occasionally harsh winters can affect starting systems. Local mechanics understand these conditions and the common issues they cause in the vehicles driven by our community.`,
    sections: [
      {
        type: "services",
        heading: "Auto Repair Services Available Locally",
        content: `**Maintenance Services:**
- Oil changes and fluid services
- Filter replacement (oil, air, fuel, cabin)
- Tire rotation and balancing
- Battery testing and replacement
- Belt and hose inspection/replacement
- Fluid flushes (coolant, transmission, brake, power steering)

**Repair Services:**
- Brake repair (pads, rotors, calipers)
- Steering and suspension
- Engine diagnostics and repair
- Transmission service and repair
- Electrical system repair
- Exhaust system repair
- AC repair and recharge
- Heating system repair

**Specialty Services:**
- State inspections
- Pre-purchase inspections
- Computer diagnostics
- Check engine light diagnosis
- Performance modifications`
      }
    ],
    faqs: [
      {
        question: "How much does car repair cost in Navarro County?",
        answer: "Labor rates typically run $75-$120 per hour, below major metro rates. Oil changes cost $35-$75 depending on oil type. Brake pad replacement runs $150-$300 per axle. Transmission service costs $150-$250. Major repairs vary widely—get detailed estimates before authorizing work."
      }
    ],
    relatedServices: ["towing", "tire-shop", "auto-body", "oil-change", "transmission"],
    externalResources: [
      { name: "Texas DMV - Vehicle Inspection", url: "https://www.txdmv.gov/" },
      { name: "AAA - Auto Repair", url: "https://www.aaa.com/autorepair" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "towing",
    title: "Towing",
    category: "automotive",
    subcategory: "emergency",
    layout: 5,
    icon: "Truck",
    iconColor: "orange",
    metaTitle: "Towing Service in Navarro County, TX | Tow Truck Corsicana",
    metaDescription: "24/7 towing service in Corsicana and Navarro County. Roadside assistance, flatbed towing, accident recovery, jump starts, and lockout service.",
    metaKeywords: "towing Corsicana, tow truck Navarro County, roadside assistance, flatbed towing, emergency towing",
    heroContent: `When your vehicle breaks down or you're in an accident, you need fast, reliable towing service. Navarro County towing companies provide 24/7 emergency response across the county, from I-45 to the most remote farm roads.`,
    localContext: `Navarro County's mix of interstate highway, state roads, and rural farm-to-market roads means towing situations vary widely. I-45 traffic can complicate accident recovery, while remote locations may require extended response times. Local towing companies know the county's roads and can typically respond faster than dispatch services from larger cities.`,
    sections: [
      {
        type: "services",
        heading: "Towing & Roadside Services",
        content: `**Towing Services:**
- Local towing (within county)
- Long-distance towing
- Flatbed towing (required for AWD, low-clearance vehicles)
- Wheel-lift towing
- Motorcycle towing
- Heavy-duty towing (trucks, RVs)
- Accident recovery

**Roadside Assistance:**
- Jump starts
- Lockout service
- Flat tire changes
- Fuel delivery
- Winch-out service (stuck vehicles)
- Minor roadside repairs`
      }
    ],
    faqs: [
      {
        question: "How much does towing cost in Navarro County?",
        answer: "Local towing typically costs $75-$125 for hookup plus $3-$5 per mile. Flatbed towing runs $100-$150 hookup plus $4-$6 per mile. After-hours and holiday rates are usually 25-50% higher. Heavy-duty towing for trucks and RVs starts around $200. Get quotes before authorizing service when possible."
      }
    ],
    relatedServices: ["auto-repair", "tire-shop", "auto-body", "locksmith"],
    externalResources: [
      { name: "Texas DMV - Towing and Booting", url: "https://www.txdmv.gov/motorists/consumer-protection/towing-booting" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // EVENTS & ENTERTAINMENT
  // ============================================

  {
    slug: "photographer",
    title: "Photographer",
    category: "events_entertainment",
    subcategory: "creative",
    layout: 1,
    icon: "Camera",
    iconColor: "purple",
    metaTitle: "Photographer in Navarro County, TX | Photography Services Corsicana",
    metaDescription: "Find a photographer in Corsicana and Navarro County. Wedding photography, family portraits, senior photos, events, and commercial photography.",
    metaKeywords: "photographer Corsicana, photography Navarro County, wedding photographer, portrait photographer, senior photos",
    heroContent: `Capturing life's important moments requires a photographer who combines technical skill with an eye for meaningful images. Navarro County photographers document everything from weddings and family milestones to business headshots and commercial projects.`,
    localContext: `Navarro County offers diverse backdrops for photography—from the historic downtown Corsicana courthouse and vintage Main Street buildings to pastoral ranch settings and the natural beauty of area lakes. Local photographers know these locations intimately, often scouting spots that visiting photographers would never discover. This local knowledge translates to more distinctive, location-authentic images.`,
    sections: [
      {
        type: "services",
        heading: "Photography Services Available",
        content: `**Portrait Photography:**
- Family portraits
- Senior photos
- Newborn and baby photography
- Maternity sessions
- Professional headshots
- Pet photography

**Event Photography:**
- Wedding photography
- Engagement sessions
- Quinceañera
- Birthday parties
- Corporate events
- School events

**Commercial Photography:**
- Product photography
- Real estate photography
- Business headshots
- Food photography
- Construction progress documentation`
      }
    ],
    faqs: [
      {
        question: "How much does a photographer cost in Navarro County?",
        answer: "Family portrait sessions run $150-$400 including edited digital images. Senior photo packages range from $200-$600. Wedding photography typically costs $1,500-$4,000 for 6-8 hours of coverage. Headshots run $100-$250 per person. Pricing varies based on experience level and deliverables included."
      }
    ],
    relatedServices: ["videographer", "wedding-planner", "photo-booth", "print-shop"],
    externalResources: [
      { name: "Professional Photographers of America", url: "https://www.ppa.com/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "dj",
    title: "DJ",
    category: "events_entertainment",
    subcategory: "music",
    layout: 2,
    icon: "Music",
    iconColor: "violet",
    metaTitle: "DJ in Navarro County, TX | Wedding DJ & Event DJ Corsicana",
    metaDescription: "Find a DJ in Corsicana and Navarro County. Wedding DJ, party DJ, corporate events, school dances, and quinceañeras with professional sound and lighting.",
    metaKeywords: "DJ Corsicana, wedding DJ Navarro County, party DJ, event DJ, quinceañera DJ",
    heroContent: `The right DJ can make or break an event. Beyond just playing music, a professional DJ sets the tone, reads the crowd, and keeps the energy flowing throughout your celebration. Navarro County DJs bring experience with local venues and events to make your occasion memorable.`,
    localContext: `From wedding receptions at local venues to quinceañeras, school dances, and corporate events, Navarro County DJs serve a community that values celebration. Local DJs understand the mix of musical tastes in our area—from country to Tejano to current hits—and can navigate requests while keeping events moving smoothly.`,
    sections: [
      {
        type: "services",
        heading: "DJ Services Available",
        content: `**Event Types:**
- Wedding receptions
- Quinceañeras
- Corporate events
- School dances (prom, homecoming)
- Birthday parties
- Anniversary celebrations
- Holiday parties
- Community events

**Services Included:**
- Professional sound system
- Wireless microphones
- Music library (all genres)
- MC services
- Event timeline coordination
- Setup and breakdown

**Add-On Services:**
- Lighting packages
- Dance floor lighting
- Uplighting
- Photo booth
- Karaoke`
      }
    ],
    faqs: [
      {
        question: "How much does a DJ cost in Navarro County?",
        answer: "Wedding DJs typically charge $800-$2,000 for 4-6 hours. Party DJs run $300-$600 for 3-4 hours. School dance packages range $400-$800. Pricing varies based on equipment provided, lighting included, and event complexity. Book early for prime dates—good DJs are reserved months in advance."
      }
    ],
    relatedServices: ["photographer", "videographer", "wedding-planner", "caterer", "florist"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // AGRICULTURE & RURAL
  // ============================================

  {
    slug: "welder",
    title: "Welder",
    category: "agriculture_rural",
    subcategory: "trades",
    layout: 3,
    icon: "Flame",
    iconColor: "orange",
    metaTitle: "Welder in Navarro County, TX | Welding Service Corsicana",
    metaDescription: "Find a welder in Corsicana and Navarro County. Mobile welding, fabrication, farm equipment repair, trailer repair, and custom metal work.",
    metaKeywords: "welder Corsicana, welding Navarro County, mobile welding, fabrication, farm equipment repair",
    heroContent: `Welding services are essential in Navarro County's agricultural and industrial economy. From repairing farm equipment to fabricating custom trailers and gates, skilled welders keep our community's machinery and infrastructure operational.`,
    localContext: `Navarro County's farming operations, ranches, and oil field services depend on welders for equipment repair and custom fabrication. Mobile welding services are particularly valuable for farm equipment too large to transport and for on-site repairs during critical harvest periods. Local welders understand the specific equipment and conditions common to Central Texas agriculture.`,
    sections: [
      {
        type: "services",
        heading: "Welding Services Available",
        content: `**Welding Types:**
- MIG welding
- TIG welding
- Stick welding
- Flux core welding
- Aluminum welding
- Stainless steel welding

**Agricultural Services:**
- Farm equipment repair
- Implement modifications
- Livestock equipment (pens, chutes, feeders)
- Hay equipment repair
- Tractor repair

**Trailer Services:**
- Trailer repair
- Custom trailer fabrication
- Floor replacement
- Hitch repair and modification
- Jack replacement

**Custom Fabrication:**
- Gates and fencing
- Cattle guards
- Custom metal projects
- Pipe fencing
- Custom brackets and mounts`
      }
    ],
    faqs: [
      {
        question: "How much does welding cost in Navarro County?",
        answer: "Shop welding rates run $75-$125 per hour. Mobile welding service calls typically cost $100-$150 plus hourly rates of $85-$135. Minimum charges often apply. Custom fabrication is quoted by project. Materials are typically additional unless quoted as package price."
      }
    ],
    relatedServices: ["fabrication", "trailer-repair", "tractor-repair", "fence-builder"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "tree-service",
    title: "Tree Service",
    category: "agriculture_rural",
    subcategory: "landscaping",
    layout: 4,
    icon: "TreeDeciduous",
    iconColor: "green",
    metaTitle: "Tree Service in Navarro County, TX | Tree Removal Corsicana",
    metaDescription: "Tree service in Corsicana and Navarro County. Tree removal, trimming, stump grinding, storm damage cleanup, and emergency tree service.",
    metaKeywords: "tree service Corsicana, tree removal Navarro County, tree trimming, stump grinding, storm damage",
    heroContent: `Navarro County's majestic live oaks, pecans, and other trees enhance our properties but also require professional care. From routine trimming to emergency storm damage response, tree services keep our landscapes safe and beautiful.`,
    localContext: `Trees in Navarro County face challenges including drought stress, oak wilt disease, and storm damage from severe thunderstorms. Our large pecan trees are both treasured for nut production and can become hazards when damaged. Professional arborists understand the diseases and pests affecting Central Texas trees and can recommend appropriate treatment or removal when necessary.`,
    sections: [
      {
        type: "services",
        heading: "Tree Services Available",
        content: `**Tree Care:**
- Tree trimming and pruning
- Crown reduction
- Deadwood removal
- Tree health assessment
- Disease treatment
- Cabling and bracing

**Tree Removal:**
- Complete tree removal
- Hazardous tree removal
- Storm damage cleanup
- Emergency tree service
- Land clearing

**Stump Services:**
- Stump grinding
- Stump removal
- Root removal
- Site preparation for replanting

**Additional Services:**
- Brush chipping
- Firewood (often available from removals)
- Lot clearing
- Fence line clearing`
      }
    ],
    faqs: [
      {
        question: "How much does tree removal cost?",
        answer: "Small tree removal (under 30 feet) typically costs $300-$600. Medium trees (30-60 feet) run $600-$1,200. Large trees (60+ feet) cost $1,200-$3,000+. Complex removals near structures or power lines cost more. Stump grinding adds $100-$400 depending on stump size. Emergency service carries premium rates."
      }
    ],
    relatedServices: ["stump-grinder", "landscaping", "firewood", "land-clearing"],
    externalResources: [
      { name: "Texas A&M Forest Service", url: "https://tfsweb.tamu.edu/" },
      { name: "International Society of Arboriculture", url: "https://www.isa-arbor.com/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "septic",
    title: "Septic",
    category: "home_services",
    subcategory: "plumbing",
    layout: 5,
    icon: "Droplets",
    iconColor: "blue",
    metaTitle: "Septic Service in Navarro County, TX | Septic Pumping Corsicana",
    metaDescription: "Septic service in Corsicana and Navarro County. Septic pumping, inspection, repair, installation, and maintenance for rural Texas properties.",
    metaKeywords: "septic service Corsicana, septic pumping Navarro County, septic tank, septic repair, septic installation",
    heroContent: `Many Navarro County properties outside city limits rely on septic systems for wastewater treatment. Proper maintenance of these systems protects your property, your family's health, and our local groundwater resources.`,
    localContext: `Navarro County's clay-heavy Blackland Prairie soils present challenges for conventional septic system drain fields. The soil's poor percolation rates often require alternative treatment systems or larger drain fields than might be needed in sandier soils. Local septic professionals understand these soil conditions and can design systems that work effectively in our specific environment.`,
    sections: [
      {
        type: "services",
        heading: "Septic Services Available",
        content: `**Maintenance Services:**
- Septic tank pumping
- Routine inspections
- Drain field inspection
- Effluent filter cleaning
- Bacteria treatment additives
- Maintenance contracts

**Repair Services:**
- Tank repair
- Lid and riser repair
- Baffle replacement
- Distribution box repair
- Drain field repair
- Pump replacement

**Installation Services:**
- New system installation
- System replacement
- Aerobic system installation
- Alternative treatment systems
- Drain field installation
- Permit acquisition

**Inspection Services:**
- Real estate transaction inspections
- Annual inspections (required for aerobic systems)
- Problem diagnosis
- Permit inspections`
      }
    ],
    faqs: [
      {
        question: "How often should I pump my septic tank?",
        answer: "Most Navarro County homes should pump their septic tanks every 3-5 years. Households with garbage disposals, large families, or older systems may need pumping every 2-3 years. Aerobic systems require quarterly inspections and more frequent maintenance. Keep pumping records for reference and property sale."
      },
      {
        question: "How much does septic pumping cost?",
        answer: "Septic tank pumping in Navarro County typically costs $300-$500 for standard tanks (1,000-1,500 gallons). Larger tanks and difficult access may cost more. Real estate inspections run $300-$450. Repairs vary widely—minor fixes may run $200-$500 while major repairs or drain field work can cost $3,000-$10,000+."
      }
    ],
    relatedServices: ["plumber", "well-drilling", "excavator"],
    externalResources: [
      { name: "Texas Commission on Environmental Quality - On-Site Sewage", url: "https://www.tceq.texas.gov/permitting/wastewater/ossf" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // MORE HOME SERVICES
  // ============================================
  {
    slug: "roofing",
    title: "Roofing",
    category: "home_services",
    subcategory: "exterior",
    layout: 1,
    icon: "Home",
    iconColor: "amber",
    metaTitle: "Roofing Contractors in Navarro County, TX | Roof Repair Corsicana",
    metaDescription: "Professional roofing services in Corsicana and Navarro County. Storm damage repair, roof replacement, shingle and metal roofing for Texas weather.",
    metaKeywords: "roofing Corsicana, roof repair Navarro County, storm damage roof, metal roofing Texas, shingle roof replacement",
    heroContent: `Navarro County's position in North Central Texas means our roofs face everything from scorching summer heat to severe spring thunderstorms, occasional hail, and the rare ice storm. Finding a reliable roofing contractor who understands these challenges—and who will be here after the storm chasers leave—is essential for protecting your home.`,
    localContext: `The Corsicana area averages 3-5 significant hail events per year, with spring storms bringing the highest risk. Our hot summers, with 80+ days above 90°F, cause thermal expansion and UV degradation that shortens roof life. Many Navarro County homes built in the 1970s-1990s are now on their second or third roof. The 2021 winter storm revealed how ice dams can damage roofs not designed for extended freezing conditions.`,
    sections: [
      {
        type: "guide",
        heading: "Roofing Options for Navarro County Homes",
        content: \`**Asphalt Shingles (Most Common)**
- 3-tab shingles: $3-$4/sq ft installed, 15-20 year lifespan
- Architectural shingles: $4-$6/sq ft, 25-30 year lifespan
- Impact-resistant shingles: $5-$7/sq ft, may reduce insurance premiums 5-10%
- Best for: Budget-conscious homeowners, traditional aesthetics

**Metal Roofing (Growing in Popularity)**
- Standing seam: $10-$14/sq ft, 40-70 year lifespan
- Metal shingles: $7-$10/sq ft, 30-50 year lifespan
- Corrugated/R-panel: $5-$8/sq ft, 25-40 year lifespan
- Best for: Longevity, energy efficiency, rural properties

**Tile Roofing**
- Concrete tile: $8-$12/sq ft, 50+ year lifespan
- Clay tile: $12-$18/sq ft, 75+ year lifespan
- Requires structural evaluation for weight
- Best for: Spanish/Mediterranean style homes

**Flat Roofing (Commercial/Some Residential)**
- TPO membrane: $5-$8/sq ft
- Modified bitumen: $4-$7/sq ft
- Commonly used on additions and low-slope sections\`
      },
      {
        type: "local_info",
        heading: "Storm Damage and Insurance Claims in Navarro County",
        content: \`After severe weather, Navarro County sees an influx of roofing contractors—some reputable, many not. Here's how to navigate storm damage repairs:

**Documenting Damage**
- Photograph damage from ground level before anyone walks on roof
- Note date and time of storm event
- Keep any debris (hailstones in freezer, fallen branches)
- Document interior damage (water stains, leaks)

**Insurance Process**
- File claim promptly (most policies require reporting within 1 year)
- Your insurance company will send an adjuster
- Get independent estimates before accepting settlement
- Understand your deductible (many policies have separate wind/hail deductibles)

**Avoiding Storm Chaser Scams**
- Never sign contracts with door-knockers immediately after storms
- Verify Texas contractor license and local business address
- Don't pay large deposits upfront
- Be wary of "free roof" or "we'll pay your deductible" claims (insurance fraud)
- Check references with other Navarro County homeowners\`
      }
    ],
    faqs: [
      {
        question: "How much does a new roof cost in Navarro County?",
        answer: "A new asphalt shingle roof on a typical 2,000 sq ft Navarro County home costs $8,000-$15,000 for architectural shingles. Metal roofing runs $15,000-$25,000. Factors affecting cost include roof pitch, accessibility, removal of old layers, and decking repairs. Most roofers offer free estimates."
      },
      {
        question: "How do I know if my roof has hail damage?",
        answer: "Signs include dented or cracked shingles, granules in gutters, dented metal vents/flashing, and damaged gutters. Hail damage isn't always visible from the ground. After a hailstorm, have a professional inspection—most reputable roofers offer free storm damage assessments."
      },
      {
        question: "Will my homeowners insurance cover roof replacement?",
        answer: "Texas homeowners insurance typically covers roof damage from covered perils (hail, wind, fallen trees) minus your deductible. Normal wear and aging are not covered. Some policies limit coverage on roofs over 10-15 years old. Review your policy and consider replacement before filing claims on older roofs."
      }
    ],
    relatedServices: ["gutter", "siding", "exterior-painting", "home-inspector"],
    externalResources: [
      { name: "Texas Department of Insurance", url: "https://www.tdi.texas.gov/" },
      { name: "Better Business Bureau - Dallas", url: "https://www.bbb.org/us/tx/dallas" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "pest-control",
    title: "Pest Control",
    category: "home_services",
    subcategory: "pest",
    layout: 2,
    icon: "Bug",
    iconColor: "green",
    metaTitle: "Pest Control in Navarro County, TX | Exterminator Services Corsicana",
    metaDescription: "Professional pest control in Corsicana and Navarro County. Treatment for fire ants, termites, roaches, rodents, mosquitoes, and seasonal Texas pests.",
    metaKeywords: "pest control Corsicana, exterminator Navarro County, fire ant treatment, termite inspection, mosquito control Texas",
    heroContent: `Central Texas is home to a diverse array of pests that thrive in our warm, humid climate. From fire ants that make outdoor living miserable to termites silently damaging structures, Navarro County homeowners face year-round pest pressure that requires professional management.`,
    localContext: `Navarro County's agricultural surroundings and warm climate create ideal conditions for pests. Our location in the Cross Timbers ecoregion means we see both prairie and woodland pest species. The Richland Chambers Reservoir and numerous stock ponds support robust mosquito populations. Fire ants, introduced to Texas in the 1950s, have thoroughly colonized our area—expect them in every yard not actively treated.`,
    sections: [
      {
        type: "guide",
        heading: "Common Pests in Navarro County",
        content: \`**Year-Round Pests**
- Fire ants: Aggressive, painful stings, damage electrical equipment
- German cockroaches: Indoor pest, multiplies rapidly, triggers allergies
- American cockroaches: Large "water bugs," enter from outdoors
- Rodents (mice, rats): Seek shelter in fall/winter, damage wiring and insulation
- Spiders: Brown recluse and black widow are venomous species present locally

**Seasonal Pests**
- Termites: Swarm in spring (March-May), active year-round underground
- Mosquitoes: Peak April-October, carry West Nile and other diseases
- Wasps/hornets: Most aggressive late summer through fall
- Fleas/ticks: Heaviest spring through fall, linked to wildlife and pets
- Scorpions: Active warm months, striped bark scorpions common in rural areas

**Agricultural/Rural Pests**
- Cattle flies: Horn flies, stable flies affect livestock
- Stored product pests: Weevils, moths in feed and grain
- Wildlife: Raccoons, opossums, armadillos cause property damage\`
      },
      {
        type: "services",
        heading: "Pest Control Services Available",
        content: \`**Residential Programs**
- Quarterly pest control (most popular, $100-$150/visit)
- Monthly service for severe infestations
- One-time treatments for specific issues
- New construction pre-treatments

**Specialty Services**
- Termite inspections (often required for home sales)
- Termite treatment: Liquid barrier ($1,500-$3,000) or bait systems ($1,200-$2,500)
- Fire ant yard treatments
- Mosquito misting systems and recurring treatments
- Bed bug heat treatments ($1,000-$3,000)
- Wildlife exclusion and removal

**Commercial Services**
- Restaurant and food service pest management
- Property management programs
- Agricultural pest consulting\`
      }
    ],
    faqs: [
      {
        question: "How much does pest control cost in Navarro County?",
        answer: "One-time treatments typically run $150-$300 depending on the pest and home size. Quarterly service plans average $100-$150 per visit ($400-$600 annually). Termite treatments cost $1,200-$3,000 depending on method and home size. Many companies offer free inspections and quotes."
      },
      {
        question: "How often should I have pest control service?",
        answer: "In Navarro County's climate, quarterly service provides effective year-round protection for most homes. Properties with heavy pest pressure, wooded lots, or previous infestations may benefit from bi-monthly service. New homes should establish a program within the first year."
      },
      {
        question: "Are pest control chemicals safe for my family and pets?",
        answer: "Modern pest control products, when applied by licensed professionals following label directions, pose minimal risk. Most treatments require only brief re-entry intervals (2-4 hours after drying). Inform your technician about pets, children, and any sensitivities. Many companies offer reduced-risk or organic options."
      }
    ],
    relatedServices: ["termite-control", "mosquito-control", "wildlife-removal", "lawn-care"],
    externalResources: [
      { name: "Texas A&M AgriLife Extension - Urban Entomology", url: "https://extensionentomology.tamu.edu/" },
      { name: "Texas Structural Pest Control Board", url: "https://www.spcb.texas.gov/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "landscaping",
    title: "Landscaping",
    category: "home_services",
    subcategory: "outdoor",
    layout: 3,
    icon: "Leaf",
    iconColor: "green",
    metaTitle: "Landscaping in Navarro County, TX | Landscape Design Corsicana",
    metaDescription: "Professional landscaping services in Corsicana and Navarro County. Landscape design, installation, hardscaping, and drought-tolerant Texas native plants.",
    metaKeywords: "landscaping Corsicana, landscape design Navarro County, Texas native plants, xeriscaping, hardscape installation",
    heroContent: `Creating beautiful outdoor spaces in Navarro County requires understanding our unique growing conditions. From the Blackland Prairie clay soils to our hot, dry summers and unpredictable rainfall, successful landscaping here demands plants and designs suited to Central Texas.`,
    localContext: `Navarro County straddles two ecoregions—the Blackland Prairies to the east and the Cross Timbers to the west—giving us access to diverse native plant palettes. Our USDA hardiness zone (8a, with winter lows to 10°F) supports a wide range of ornamentals. However, summer drought is the defining challenge: July and August typically see less than 2 inches of rain combined while temperatures exceed 100°F. Water-wise landscaping isn't just environmentally responsible—it's practical.`,
    sections: [
      {
        type: "guide",
        heading: "Landscaping Services for Navarro County Properties",
        content: \`**Design Services**
- Full landscape design and master planning
- 3D renderings and plant selection
- Irrigation system design
- Outdoor living space planning

**Installation Services**
- Trees, shrubs, and perennial installation
- Sod and seeding (Bermuda, St. Augustine, Zoysia)
- Mulch and bed preparation
- Boulder and decorative stone placement

**Hardscaping**
- Patios (flagstone, pavers, concrete)
- Retaining walls
- Outdoor kitchens
- Fire pits and fireplaces
- Walkways and driveways
- Drainage solutions

**Water Features**
- Ponds and waterfalls
- Fountains
- Rainwater harvesting systems\`
      },
      {
        type: "local_info",
        heading: "Plants That Thrive in Navarro County",
        content: \`**Native Trees**
- Live Oak (Quercus virginiana) - Iconic Texas shade tree
- Cedar Elm (Ulmus crassifolia) - Drought tolerant, yellow fall color
- Texas Red Oak (Quercus buckleyi) - Brilliant red fall color
- Bur Oak (Quercus macrocarpa) - Large, stately, tolerates clay
- Pecan (Carya illinoinensis) - Texas state tree, edible nuts

**Native Shrubs**
- Texas Sage (Leucophyllum frutescens) - Purple blooms after rain
- Yaupon Holly (Ilex vomitoria) - Evergreen, bird-friendly
- Flame Acanthus (Anisacanthus quadrifidus) - Hummingbird magnet
- Aromatic Sumac (Rhus aromatica) - Fall color, erosion control

**Perennials and Grasses**
- Black-eyed Susan (Rudbeckia hirta)
- Salvia greggii (Autumn sage)
- Gulf Muhly (Muhlenbergia capillaris) - Pink plumes in fall
- Lindheimer's Muhly
- Purple Coneflower (Echinacea purpurea)
- Mealy Blue Sage (Salvia farinacea)\`
      }
    ],
    faqs: [
      {
        question: "How much does landscaping cost in Navarro County?",
        answer: "Basic landscaping (beds, mulch, shrubs) runs $2,000-$5,000 for an average front yard. Full landscape installations with hardscaping typically cost $10,000-$30,000+. Design fees range from $500-$2,000 depending on scope. Most landscapers provide free consultations and estimates."
      },
      {
        question: "When is the best time to plant in Navarro County?",
        answer: "Fall (October-November) is ideal for trees, shrubs, and perennials—roots establish during mild weather before summer stress. Spring (March-April) is second best. Avoid planting in summer heat. Sod can be installed spring through early fall with proper irrigation."
      },
      {
        question: "How can I reduce water use in my landscape?",
        answer: "Choose native and adapted plants, group plants by water needs, use drip irrigation, apply 3-4 inches of mulch, and water deeply but infrequently. Consider rain gardens and rainwater harvesting. A well-designed xeriscape can reduce outdoor water use by 50-75%."
      }
    ],
    relatedServices: ["lawn-care", "irrigation", "tree-service", "fence-builder", "outdoor-lighting"],
    externalResources: [
      { name: "Texas A&M AgriLife - Earth-Kind Landscaping", url: "https://aggie-horticulture.tamu.edu/earthkind/" },
      { name: "Lady Bird Johnson Wildflower Center", url: "https://www.wildflower.org/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "fence-builder",
    title: "Fence Installation",
    category: "home_services",
    subcategory: "outdoor",
    layout: 4,
    icon: "Fence",
    iconColor: "amber",
    metaTitle: "Fence Installation in Navarro County, TX | Fencing Contractors Corsicana",
    metaDescription: "Professional fence installation in Corsicana and Navarro County. Wood, chain link, iron, and ranch fencing for residential and agricultural properties.",
    metaKeywords: "fence installation Corsicana, fencing contractor Navarro County, wood fence, ranch fencing, iron fence Texas",
    heroContent: `Whether you need to contain livestock, secure your property, add privacy, or enhance curb appeal, quality fencing is essential for Navarro County properties. Our mix of suburban neighborhoods, rural acreages, and working ranches means diverse fencing needs—and local fence builders who understand them.`,
    localContext: `Navarro County's Blackland Prairie clay soil presents unique challenges for fence installation. Posts set in this expansive soil can heave and shift without proper depth and concrete. Our hot summers weather wood rapidly, while winter freezes can crack improperly cured concrete. Wind loads from spring storms test fence integrity. Local fence contractors understand these conditions and build accordingly.`,
    sections: [
      {
        type: "guide",
        heading: "Fencing Options for Navarro County Properties",
        content: \`**Residential Fencing**
- Cedar privacy fence: $25-$35/linear foot, 15-20 year lifespan
- Pine privacy fence: $18-$25/linear foot, 10-15 years with treatment
- Ornamental iron/aluminum: $30-$50/linear foot, 20+ years
- Chain link: $12-$20/linear foot, 15-20 years
- Vinyl/PVC: $25-$40/linear foot, 20-30 years

**Agricultural/Ranch Fencing**
- Barbed wire (5-strand): $2-$4/linear foot
- T-post and field fence: $4-$6/linear foot
- Pipe fencing: $15-$25/linear foot
- High-tensile wire: $1.50-$3/linear foot
- Board fence (horse): $12-$20/linear foot

**Specialty Fencing**
- Pool fencing (code-compliant): $20-$35/linear foot
- Deer fencing (8'+): $6-$10/linear foot
- Electric fence: $1-$3/linear foot
- Game fencing: $8-$15/linear foot\`
      },
      {
        type: "local_info",
        heading: "Fence Installation Considerations in Navarro County",
        content: \`**Soil and Post Setting**
In Navarro County's expansive clay, fence posts should be set 30-36 inches deep minimum. Concrete footings help stabilize posts but must cure properly. Some installers use gravel drainage beneath concrete to reduce heaving. Steel posts may be preferred in areas with severe soil movement.

**Property Lines and Surveys**
Before installing a fence, know your exact property boundaries. Navarro County Appraisal District has property maps, but for expensive fencing, consider a professional survey. Discuss fence placement with neighbors—Texas law generally requires fences to be set on or inside your property line.

**HOA and City Requirements**
- City of Corsicana: Permits typically not required for residential fences under 8 feet, but check setback requirements
- HOA communities: May restrict fence height, style, and materials
- Pool fencing: Must meet Texas Health and Safety Code requirements (4+ feet height, self-closing gates)

**Utility Lines**
Call 811 before digging! Navarro County has underground utilities, especially in developed areas. Hitting a gas or electric line is dangerous and expensive.\`
      }
    ],
    faqs: [
      {
        question: "How much does a fence cost in Navarro County?",
        answer: "A standard 6-foot cedar privacy fence costs $25-$35 per linear foot installed, so a typical 200 linear foot backyard fence runs $5,000-$7,000. Chain link is more affordable at $2,400-$4,000 for the same length. Ranch fencing varies widely—barbed wire may cost $1,000-$2,000 per mile while pipe fencing costs $15,000-$25,000 per mile."
      },
      {
        question: "How long does fence installation take?",
        answer: "A typical residential fence (150-250 linear feet) takes 1-3 days to install. Larger ranch fencing projects may take weeks. Weather delays are common in spring storm season. Most installers can provide scheduling estimates after assessing your property."
      },
      {
        question: "Do I need a permit for a fence in Navarro County?",
        answer: "In unincorporated Navarro County, permits are generally not required for standard fencing. Within Corsicana city limits, fences typically don't require permits unless over 8 feet tall, but setback rules apply. Always check with your HOA if applicable, and confirm requirements with local building departments for your specific location."
      }
    ],
    relatedServices: ["deck-builder", "landscaping", "fencing-agricultural", "gate-installation"],
    externalResources: [
      { name: "Texas 811 - Call Before You Dig", url: "https://www.texas811.org/" },
      { name: "Navarro County Appraisal District", url: "https://www.navarrocad.com/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // PROFESSIONAL SERVICES
  // ============================================
  {
    slug: "attorney",
    title: "Attorney",
    category: "professional_services",
    subcategory: "legal",
    layout: 5,
    icon: "Scale",
    iconColor: "slate",
    metaTitle: "Attorney in Navarro County, TX | Lawyers in Corsicana",
    metaDescription: "Find attorneys in Corsicana and Navarro County. Family law, criminal defense, personal injury, estate planning, and business law services.",
    metaKeywords: "attorney Corsicana, lawyer Navarro County, family lawyer, criminal defense, personal injury attorney Texas",
    heroContent: `Legal matters require experienced representation familiar with local courts, judges, and procedures. Navarro County attorneys handle cases in the 13th District Court, County Courts, and Justice of the Peace courts, bringing knowledge of local practice that out-of-area lawyers simply don't have.`,
    localContext: `The Navarro County Courthouse in downtown Corsicana, built in 1905 and listed on the National Register of Historic Places, remains the center of local legal proceedings. The 13th Judicial District Court handles felonies and major civil matters, while County Courts at Law handle misdemeanors and smaller civil cases. Having an attorney familiar with these courts, their staff, and their procedures can significantly impact case outcomes.`,
    sections: [
      {
        type: "guide",
        heading: "Legal Services Available in Navarro County",
        content: \`**Family Law**
- Divorce (contested and uncontested)
- Child custody and visitation
- Child support modifications
- Adoption
- Prenuptial agreements
- Protective orders

**Criminal Defense**
- DWI/DUI defense
- Drug charges
- Assault and violent crimes
- Theft and property crimes
- Probation violations
- Expunctions and non-disclosures

**Personal Injury**
- Car accidents
- Truck accidents
- Workplace injuries
- Premises liability
- Product liability
- Wrongful death

**Estate Planning**
- Wills and trusts
- Powers of attorney
- Probate administration
- Estate litigation
- Guardianship

**Business Law**
- Business formation
- Contract review and drafting
- Employment law
- Real estate transactions
- Business litigation\`
      },
      {
        type: "local_info",
        heading: "Navarro County Legal Resources",
        content: \`**Court Information**
- Navarro County Courthouse: 300 W. 3rd Ave, Corsicana
- District Clerk: (903) 654-3035
- County Clerk: (903) 654-3036

**Legal Aid Resources**
- Lone Star Legal Aid serves low-income Navarro County residents
- Texas RioGrande Legal Aid for certain civil matters
- Navarro County Bar Association lawyer referral

**Attorney Fees**
Local attorney fees vary by practice area:
- Consultations: Many offer free initial consultations
- Hourly rates: $150-$350/hour typical for Navarro County
- Flat fees: Common for simple matters (uncontested divorce, simple wills)
- Contingency: Personal injury cases typically 33-40% of recovery
- Retainers: Criminal and family law often require upfront retainers\`
      }
    ],
    faqs: [
      {
        question: "How do I find a good attorney in Navarro County?",
        answer: "Start with referrals from friends, family, or other professionals. Check the State Bar of Texas website to verify licensing and disciplinary history. Many attorneys offer free consultations—meet with several before deciding. Consider experience in your specific legal issue and comfort level with the attorney."
      },
      {
        question: "How much does a lawyer cost in Corsicana?",
        answer: "Navarro County attorneys typically charge $150-$350 per hour depending on experience and practice area. Simple matters like basic wills ($300-$800) or uncontested divorces ($1,500-$3,000) often have flat fees. Personal injury attorneys work on contingency (no fee unless you win). Criminal defense retainers typically start at $2,500-$5,000."
      },
      {
        question: "When do I need an attorney vs. handling something myself?",
        answer: "Consider an attorney for: any criminal charge, contested divorce or custody, significant personal injury, business disputes, estate planning beyond simple wills, and real estate issues. Small claims court (up to $20,000 in Texas) is designed for self-representation, and simple matters like name changes can often be done pro se with court assistance."
      }
    ],
    relatedServices: ["family-lawyer", "criminal-lawyer", "personal-injury-lawyer", "estate-attorney", "notary"],
    externalResources: [
      { name: "State Bar of Texas - Find a Lawyer", url: "https://www.texasbar.com/AM/Template.cfm?Section=Find_A_Lawyer" },
      { name: "Navarro County District Clerk", url: "https://www.co.navarro.tx.us/page/navarro.DistrictClerk" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "accountant",
    title: "Accountant",
    category: "professional_services",
    subcategory: "financial",
    layout: 1,
    icon: "Calculator",
    iconColor: "blue",
    metaTitle: "Accountant in Navarro County, TX | CPA Services Corsicana",
    metaDescription: "Professional accounting services in Corsicana and Navarro County. Tax preparation, bookkeeping, payroll, business accounting, and financial planning.",
    metaKeywords: "accountant Corsicana, CPA Navarro County, tax preparation, bookkeeping, business accounting Texas",
    heroContent: `Whether you're filing personal taxes, managing a small business, or need comprehensive financial planning, Navarro County accountants provide the expertise local residents and businesses need. From agricultural operations to oil and gas interests to Main Street retail, local CPAs understand the unique financial landscape of our community.`,
    localContext: `Navarro County's economy includes significant agricultural operations, oil and gas production, small businesses, and commuters working in the Dallas-Fort Worth metroplex. This diversity creates complex tax situations—farm income, royalty payments, home office deductions, and small business accounting all require specialized knowledge. Local accountants familiar with Texas-specific issues like franchise tax and agricultural exemptions provide valuable expertise.`,
    sections: [
      {
        type: "services",
        heading: "Accounting Services in Navarro County",
        content: \`**Tax Services**
- Individual tax preparation
- Business tax returns (partnerships, S-corps, C-corps)
- Farm and ranch tax returns
- Oil and gas royalty reporting
- Tax planning and strategy
- IRS representation and audit support
- Back taxes and amendments

**Business Accounting**
- Bookkeeping (monthly, quarterly)
- Payroll processing
- Financial statement preparation
- Cash flow management
- Budgeting and forecasting
- Business entity selection
- QuickBooks setup and training

**Specialized Services**
- Agricultural accounting
- Estate and trust taxation
- Non-profit accounting
- New business setup
- Business valuations
- Forensic accounting\`
      },
      {
        type: "guide",
        heading: "Choosing an Accountant in Navarro County",
        content: \`**Credentials to Look For**
- CPA (Certified Public Accountant): Licensed by Texas State Board, required for audits and certain services
- EA (Enrolled Agent): Federally licensed, specializes in tax matters
- Bookkeeper: May not be licensed, suitable for basic bookkeeping

**Questions to Ask**
- What is your experience with my type of situation (farm, small business, oil/gas)?
- How do you charge—hourly, flat fee, or value-based?
- What is your availability during tax season?
- Do you offer year-round tax planning or just annual preparation?
- How do you handle IRS notices or audits?
- What accounting software do you support?

**Red Flags**
- Promises of unusually large refunds
- Fees based on refund percentage
- Unwillingness to sign tax returns
- No verifiable credentials\`
      }
    ],
    faqs: [
      {
        question: "How much does tax preparation cost in Navarro County?",
        answer: "Simple individual returns (W-2 income, standard deduction) typically cost $150-$300. Returns with self-employment, rental income, or itemized deductions run $300-$600. Business returns range from $500 for simple sole proprietors to $1,500+ for complex corporations. Farm returns often fall in the $400-$800 range."
      },
      {
        question: "What's the difference between a CPA, EA, and tax preparer?",
        answer: "CPAs are state-licensed accountants who can perform audits, prepare taxes, and provide comprehensive financial services. EAs are federally licensed tax specialists who can represent clients before the IRS. Tax preparers may have no specific license—while many are competent, they cannot represent you in audits or perform certain services."
      },
      {
        question: "When should I hire an accountant vs. using tax software?",
        answer: "Consider professional help if you: own a business or have self-employment income, have rental properties, received an inheritance, have complex investments, own farm/ranch operations, have oil and gas royalties, or experienced major life changes (marriage, divorce, home purchase). Software works fine for simple W-2 returns with standard deductions."
      }
    ],
    relatedServices: ["tax-preparer", "bookkeeper", "payroll-service", "financial-advisor"],
    externalResources: [
      { name: "Texas State Board of Public Accountancy", url: "https://www.tsbpa.texas.gov/" },
      { name: "IRS Free File", url: "https://www.irs.gov/filing/free-file-do-your-federal-taxes-for-free" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "realtor",
    title: "Realtor",
    category: "professional_services",
    subcategory: "real_estate",
    layout: 2,
    icon: "Home",
    iconColor: "rose",
    metaTitle: "Realtor in Navarro County, TX | Real Estate Agents Corsicana",
    metaDescription: "Find realtors in Corsicana and Navarro County. Experienced real estate agents for buying, selling homes, land, farms, and investment properties.",
    metaKeywords: "realtor Corsicana, real estate agent Navarro County, homes for sale, land for sale, farm ranch real estate Texas",
    heroContent: `Buying or selling property in Navarro County requires an agent who understands our diverse real estate market—from historic Corsicana homes to rural acreages, lakefront properties on Richland Chambers, and working farms and ranches. Local realtors bring market knowledge that online searches simply can't provide.`,
    localContext: `Navarro County's real estate market includes everything from $80,000 starter homes to multi-million dollar ranches. Corsicana's historic districts feature turn-of-the-century homes, while newer subdivisions offer modern construction. Rural properties dominate much of the county, with land prices varying significantly based on water access, highway frontage, and agricultural value. Richland Chambers Reservoir, Texas's third-largest lake, drives a strong market for waterfront and water-view properties.`,
    sections: [
      {
        type: "guide",
        heading: "Real Estate Services in Navarro County",
        content: \`**Buyer Services**
- Property search and showing coordination
- Market analysis and pricing guidance
- Offer negotiation
- Contract management
- Closing coordination
- First-time homebuyer guidance

**Seller Services**
- Comparative market analysis (CMA)
- Pricing strategy
- Professional photography and marketing
- MLS listing and syndication
- Showing management
- Offer negotiation and closing

**Specialized Markets**
- Farm and ranch properties
- Waterfront/lake properties (Richland Chambers)
- Land and acreage
- Commercial properties
- Investment properties
- Historic homes\`
      },
      {
        type: "local_info",
        heading: "Navarro County Real Estate Market Overview",
        content: \`**Market Areas**
- **Corsicana:** County seat, most services, schools, and amenities. Historic districts, established neighborhoods, and new construction.
- **Kerens:** Small-town feel, more affordable, good schools
- **Richland Chambers Area:** Lake properties, vacation homes, retirement community
- **Rural Navarro County:** Farms, ranches, acreages, privacy

**What Buyers Should Know**
- Property taxes vary by location and exemptions
- Many rural properties use well water and septic systems
- Flood zones exist near creeks and the reservoir
- Agricultural exemptions significantly reduce property taxes on qualifying land
- Oil and gas mineral rights may or may not convey with property

**What Sellers Should Know**
- Proper pricing is crucial in our market
- Professional photos dramatically increase showing requests
- Disclosure requirements include known defects, flood history, HOA details
- Foundation issues are common and should be addressed before listing\`
      }
    ],
    faqs: [
      {
        question: "How much do realtors charge in Navarro County?",
        answer: "Real estate commissions in Navarro County typically total 5-6% of the sale price, split between buyer's and seller's agents. On a $250,000 home, that's $12,500-$15,000 total. Sellers typically pay the commission. Some agents offer reduced rates for certain situations. Buyer's agent services are generally free to buyers."
      },
      {
        question: "Do I need a realtor to buy a home?",
        answer: "While not legally required, a buyer's agent provides valuable services at no direct cost to you (the seller pays commissions). Agents provide market expertise, handle negotiations, coordinate inspections, and manage paperwork. For FSBO purchases or new construction, having your own representation is especially important."
      },
      {
        question: "How long does it take to sell a house in Navarro County?",
        answer: "Average days on market varies by price point and property type. Well-priced homes under $300,000 often sell within 30-60 days. Higher-priced homes and specialized properties (farms, commercial) may take longer. Market conditions fluctuate—your agent can provide current data for your specific situation."
      }
    ],
    relatedServices: ["home-inspector", "mortgage-lender", "title-company", "appraiser", "property-manager"],
    externalResources: [
      { name: "Texas Real Estate Commission", url: "https://www.trec.texas.gov/" },
      { name: "Navarro County Appraisal District", url: "https://www.navarrocad.com/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // AUTOMOTIVE
  // ============================================
  {
    slug: "auto-repair",
    title: "Auto Repair",
    category: "automotive",
    subcategory: "repair",
    layout: 3,
    icon: "Car",
    iconColor: "red",
    metaTitle: "Auto Repair in Navarro County, TX | Mechanic Services Corsicana",
    metaDescription: "Reliable auto repair in Corsicana and Navarro County. Full service mechanic for brakes, engines, transmissions, AC, diagnostics, and maintenance.",
    metaKeywords: "auto repair Corsicana, mechanic Navarro County, car repair, brake service, engine repair, transmission service",
    heroContent: `When your vehicle needs repair, you want a mechanic you can trust—someone who'll diagnose the actual problem, explain your options honestly, and get you back on the road safely. Navarro County auto repair shops serve everyone from daily commuters to farmers needing work trucks running for harvest season.`,
    localContext: `With many Navarro County residents commuting to Dallas, Waco, or Tyler for work, reliable transportation is essential. Our hot summers are brutal on cooling systems and batteries, while dusty rural roads accelerate air filter and brake wear. Local mechanics understand these conditions and can recommend maintenance schedules suited to Texas driving.`,
    sections: [
      {
        type: "services",
        heading: "Auto Repair Services Available",
        content: \`**Engine Services**
- Diagnostics and check engine light
- Tune-ups and spark plug replacement
- Timing belt/chain replacement
- Engine repair and rebuilding
- Fuel system service
- Oil leaks and gasket replacement

**Drivetrain**
- Transmission service and repair
- Clutch replacement
- CV joints and axles
- Differential service
- Transfer case service (4WD)

**Brake System**
- Brake pad and rotor replacement
- Brake line repair
- ABS diagnostics
- Brake fluid flush
- Emergency brake adjustment

**Cooling and AC**
- Radiator repair and replacement
- AC recharge and repair
- Heater core service
- Thermostat replacement
- Cooling system flush

**Electrical**
- Battery testing and replacement
- Alternator and starter repair
- Electrical diagnostics
- Lighting repairs
- Power window/lock repair

**Steering and Suspension**
- Alignment
- Shocks and struts
- Ball joints and tie rods
- Power steering service
- Wheel bearing replacement\`
      },
      {
        type: "guide",
        heading: "Choosing an Auto Repair Shop",
        content: \`**What to Look For**
- ASE-certified technicians
- Clear written estimates before work begins
- Warranty on parts and labor
- Clean, organized facility
- Willingness to show you the problem
- Transparent pricing

**Questions to Ask**
- What is your diagnostic fee, and does it apply to repairs?
- Do you use OEM or aftermarket parts?
- What warranty do you offer?
- How long will the repair take?
- Do you offer loaner vehicles or shuttle service?

**Red Flags**
- Pressure to decide immediately
- Vague estimates or "it depends"
- Unwillingness to explain the repair
- Dirty, disorganized shop
- No written documentation\`
      }
    ],
    faqs: [
      {
        question: "How much does auto repair cost in Navarro County?",
        answer: "Labor rates in Navarro County typically run $80-$120 per hour, lower than Dallas-area shops. Common repairs: oil change $40-$80, brake pads $150-$300 per axle, alternator $300-$600, transmission service $150-$300. Major repairs like engine or transmission rebuild range from $2,000-$5,000+. Always get written estimates."
      },
      {
        question: "How do I know if a mechanic is honest?",
        answer: "Trustworthy shops: provide written estimates, explain problems in understandable terms, show you worn parts, don't pressure you, have verifiable reviews, and are willing to let you get a second opinion. Ask friends and neighbors for recommendations—reputation matters in a community like Navarro County."
      },
      {
        question: "Should I go to the dealer or an independent shop?",
        answer: "Dealers have factory training and equipment but charge $150-$200+ per hour. Independent shops offer competitive pricing and often equal quality. For warranty work or complex electronic issues, dealers may be necessary. For routine maintenance and common repairs, a trusted independent shop typically saves 30-50%."
      }
    ],
    relatedServices: ["oil-change", "brake-repair", "transmission", "towing", "tire-shop"],
    externalResources: [
      { name: "ASE - Automotive Service Excellence", url: "https://www.ase.com/" },
      { name: "Texas DMV", url: "https://www.txdmv.gov/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "towing",
    title: "Towing Service",
    category: "automotive",
    subcategory: "services",
    layout: 4,
    icon: "Truck",
    iconColor: "orange",
    metaTitle: "Towing Service in Navarro County, TX | 24/7 Tow Truck Corsicana",
    metaDescription: "24/7 towing services in Corsicana and Navarro County. Emergency towing, roadside assistance, flatbed towing, and heavy duty towing for all vehicles.",
    metaKeywords: "towing Corsicana, tow truck Navarro County, 24 hour towing, roadside assistance, flatbed towing Texas",
    heroContent: `When your vehicle breaks down on I-45, Highway 31, or a rural county road, you need a towing company that responds quickly and handles your vehicle with care. Navarro County towing services provide 24/7 emergency response for everything from passenger cars to heavy equipment.`,
    localContext: `Navarro County's location along I-45 between Dallas and Houston means significant traffic and frequent needs for emergency towing. Rural roads throughout the county can leave stranded motorists far from help, making responsive local towing services essential. Major highways 287, 31, and 22 also see regular demand for towing and roadside assistance.`,
    sections: [
      {
        type: "services",
        heading: "Towing Services Available",
        content: \`**Standard Towing**
- Local towing (within Navarro County)
- Long-distance towing
- Flatbed towing (recommended for AWD, luxury, lowered vehicles)
- Wheel-lift towing
- Dollies for front/rear-wheel drive

**Heavy Duty Towing**
- Semi-trucks and trailers
- Buses and RVs
- Construction equipment
- Agricultural equipment
- Load shifts and recovery

**Roadside Assistance**
- Battery jump starts
- Flat tire changes
- Fuel delivery
- Lockout service
- Winch-outs (stuck vehicles)

**Specialty Services**
- Accident recovery
- Impound services
- Motorcycle towing
- Classic car transport
- Equipment hauling\`
      },
      {
        type: "guide",
        heading: "What to Do When You Need a Tow",
        content: \`**If You Break Down**
1. Pull off the road as far as safely possible
2. Turn on hazard lights
3. Set up reflective triangles if you have them
4. Call for assistance from a safe location
5. Stay with your vehicle unless it's dangerous

**Information to Provide**
- Your exact location (highway, mile marker, cross streets)
- Vehicle type, make, model, and color
- What happened (won't start, flat tire, accident, etc.)
- Where you want vehicle towed
- Your phone number

**Insurance and Roadside Coverage**
- Many insurance policies include towing coverage
- AAA and similar memberships cover towing
- Credit cards sometimes include roadside assistance
- Check your coverage limits and preferred providers\`
      }
    ],
    faqs: [
      {
        question: "How much does towing cost in Navarro County?",
        answer: "Local towing (within 10-15 miles) typically costs $75-$150 for standard vehicles. Longer distances add $3-$5 per mile. After-hours calls may include $50+ extra. Heavy-duty towing starts around $200-$300. Roadside assistance (jump start, tire change, lockout) usually runs $50-$100. Always confirm pricing before agreeing to service."
      },
      {
        question: "How long will it take for a tow truck to arrive?",
        answer: "In Corsicana and along major highways, response time is typically 30-60 minutes. Rural areas of Navarro County may take longer, especially during peak times or bad weather. Ask for an estimated arrival time when you call, and inform them if you're in an unsafe location."
      },
      {
        question: "Should I use a flatbed or wheel-lift tow truck?",
        answer: "Flatbed towing is recommended for: AWD/4WD vehicles, lowered or sports cars, luxury vehicles, motorcycles, vehicles with transmission problems, and long-distance towing. Wheel-lift is adequate for most standard front or rear-wheel drive vehicles for short local tows."
      }
    ],
    relatedServices: ["roadside-assistance", "auto-repair", "tire-shop", "auto-body"],
    externalResources: [
      { name: "Texas Department of Motor Vehicles", url: "https://www.txdmv.gov/" },
      { name: "Texas Department of Licensing and Regulation - Tow Companies", url: "https://www.tdlr.texas.gov/towing/towing.htm" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // HEALTH & WELLNESS
  // ============================================
  {
    slug: "dentist",
    title: "Dentist",
    category: "health_wellness",
    subcategory: "dental",
    layout: 5,
    icon: "Smile",
    iconColor: "sky",
    metaTitle: "Dentist in Navarro County, TX | Dental Care Corsicana",
    metaDescription: "Find dentists in Corsicana and Navarro County. Family dentistry, cleanings, fillings, crowns, implants, and emergency dental care for all ages.",
    metaKeywords: "dentist Corsicana, dental care Navarro County, family dentist, teeth cleaning, dental implants, emergency dentist",
    heroContent: `Good dental health is essential for overall well-being, and finding a dentist you trust makes all the difference. Navarro County dental practices offer comprehensive care for the whole family, from children's first dental visits to complex restorative work for adults.`,
    localContext: `Navarro County residents have access to a range of dental providers in Corsicana and surrounding communities. Many practices accept Medicaid and CHIP for children's dental care, and community health resources help connect uninsured residents with affordable options. Local dentists understand the importance of building long-term relationships with patients and their families.`,
    sections: [
      {
        type: "services",
        heading: "Dental Services Available",
        content: \`**Preventive Care**
- Routine cleanings and exams
- Digital X-rays
- Fluoride treatments
- Dental sealants
- Oral cancer screenings
- Gum disease prevention

**Restorative Dentistry**
- Fillings (composite and amalgam)
- Crowns and bridges
- Root canal therapy
- Dentures and partials
- Dental implants
- Extractions

**Cosmetic Dentistry**
- Teeth whitening
- Veneers
- Bonding
- Smile makeovers
- Invisalign/clear aligners

**Specialty Services**
- Pediatric dentistry
- Periodontal treatment
- TMJ/jaw pain treatment
- Sleep apnea appliances
- Sedation dentistry
- Emergency dental care\`
      },
      {
        type: "guide",
        heading: "Choosing a Dentist in Navarro County",
        content: \`**What to Consider**
- Location and office hours
- Insurance acceptance
- Payment plans available
- Experience with your specific needs
- Comfort with children (if applicable)
- Emergency availability

**Your First Visit**
- Bring insurance cards and ID
- Arrive early to complete paperwork
- List current medications
- Note any dental concerns or fears
- Ask about treatment philosophy

**Dental Insurance in Texas**
- Many employers offer dental insurance
- Individual plans available through marketplace
- Medicaid covers children's dental (CHIP)
- Adult Medicaid dental is limited
- Dental discount plans are an alternative to insurance\`
      }
    ],
    faqs: [
      {
        question: "How much does a dental visit cost without insurance?",
        answer: "A routine cleaning and exam in Navarro County typically costs $150-$300 without insurance. X-rays add $75-$150. Fillings run $150-$400 depending on size and material. Crowns cost $800-$1,500. Root canals range from $700-$1,200. Many practices offer payment plans and discounts for uninsured patients."
      },
      {
        question: "How often should I go to the dentist?",
        answer: "Most people should have dental checkups and cleanings every 6 months. Those with gum disease may need visits every 3-4 months. People at low risk for dental problems might extend to annual visits with their dentist's approval. Children should start dental visits by age 1 or when first teeth appear."
      },
      {
        question: "What should I do for a dental emergency?",
        answer: "For severe pain, swelling, or knocked-out teeth, call your dentist immediately—many have after-hours emergency lines. For a knocked-out permanent tooth, keep it moist (in milk or saliva) and get to a dentist within 30 minutes if possible. For after-hours emergencies, some Navarro County dentists offer emergency service, or visit an ER for severe infections."
      }
    ],
    relatedServices: ["orthodontist", "oral-surgeon", "pediatric-dentist", "teeth-whitening"],
    externalResources: [
      { name: "Texas State Board of Dental Examiners", url: "https://www.tsbde.texas.gov/" },
      { name: "ADA - Find a Dentist", url: "https://www.ada.org/en/find-a-dentist" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "chiropractor",
    title: "Chiropractor",
    category: "health_wellness",
    subcategory: "specialist",
    layout: 1,
    icon: "Activity",
    iconColor: "green",
    metaTitle: "Chiropractor in Navarro County, TX | Chiropractic Care Corsicana",
    metaDescription: "Chiropractic care in Corsicana and Navarro County. Back pain relief, spinal adjustments, neck pain, sciatica, and sports injury treatment.",
    metaKeywords: "chiropractor Corsicana, chiropractic Navarro County, back pain relief, spinal adjustment, neck pain treatment",
    heroContent: `Chiropractic care offers a drug-free approach to treating back pain, neck pain, headaches, and other musculoskeletal conditions. Navarro County chiropractors serve patients seeking relief from chronic pain, recovery from injuries, and improved overall function.`,
    localContext: `Many Navarro County residents work in physically demanding jobs—agriculture, oil and gas, construction, and manufacturing—that take a toll on the body. Others spend long hours commuting to Dallas-Fort Worth. Chiropractors here understand these common causes of back and neck problems and can recommend both treatment and preventive measures suited to local lifestyles.`,
    sections: [
      {
        type: "services",
        heading: "Chiropractic Services Available",
        content: \`**Core Chiropractic Care**
- Spinal adjustments/manipulation
- Extremity adjustments
- Postural analysis and correction
- Spinal decompression
- Flexion-distraction technique

**Common Conditions Treated**
- Lower back pain
- Neck pain
- Headaches and migraines
- Sciatica
- Herniated/bulging discs
- Whiplash injuries
- Shoulder, hip, and knee pain
- Carpal tunnel syndrome

**Additional Services**
- Massage therapy
- Physical therapy modalities
- Nutritional counseling
- Exercise rehabilitation
- Ergonomic assessment
- Work injury treatment
- Auto accident injuries\`
      },
      {
        type: "guide",
        heading: "What to Expect at a Chiropractic Visit",
        content: \`**First Visit**
- Health history review
- Physical examination
- Postural and movement assessment
- X-rays if needed
- Discussion of findings
- Initial treatment (often)
- Treatment plan recommendation

**Typical Treatment Session**
- Brief review of progress
- Specific adjustments as needed
- May include soft tissue work
- Therapeutic exercises
- Home care instructions
- Usually 15-30 minutes

**Treatment Frequency**
Initial care for acute conditions may require 2-3 visits per week. As symptoms improve, frequency typically reduces to weekly, then bi-weekly, then monthly maintenance. Your chiropractor will recommend a plan based on your specific condition.\`
      }
    ],
    faqs: [
      {
        question: "How much does a chiropractor cost in Navarro County?",
        answer: "Initial consultations and exams typically run $75-$150. Regular adjustment visits cost $40-$75. X-rays, if needed, add $75-$200. Many chiropractors accept insurance, including most PPOs and some Medicare plans. Many also offer affordable cash rates and package pricing for treatment plans."
      },
      {
        question: "Is chiropractic care safe?",
        answer: "Chiropractic care has an excellent safety record when performed by licensed practitioners. Serious complications are rare. Common side effects like temporary soreness or fatigue are typically mild and short-lived. Discuss any concerns with your chiropractor, especially if you have osteoporosis, spinal abnormalities, or take blood thinners."
      },
      {
        question: "How many visits will I need?",
        answer: "Treatment length varies by condition. Acute problems like a recent injury might resolve in 6-12 visits. Chronic conditions or long-standing postural issues may require more extensive care. Many patients choose periodic maintenance visits even after symptoms resolve. Your chiropractor will provide a specific recommendation after examination."
      }
    ],
    relatedServices: ["massage-therapist", "physical-therapist", "acupuncture", "personal-trainer"],
    externalResources: [
      { name: "Texas Board of Chiropractic Examiners", url: "https://www.tbce.state.tx.us/" },
      { name: "American Chiropractic Association", url: "https://www.acatoday.org/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // AGRICULTURE & RURAL
  // ============================================
  {
    slug: "veterinarian",
    title: "Veterinarian",
    category: "agriculture_rural",
    subcategory: "animal",
    layout: 2,
    icon: "Heart",
    iconColor: "red",
    metaTitle: "Veterinarian in Navarro County, TX | Pet & Animal Vet Corsicana",
    metaDescription: "Veterinary services in Corsicana and Navarro County. Small animal vet care, pet surgery, vaccinations, dental, and emergency animal care.",
    metaKeywords: "veterinarian Corsicana, vet Navarro County, animal hospital, pet care, dog vet, cat vet, pet vaccinations",
    heroContent: `Your pets are family members who deserve quality healthcare. Navarro County veterinarians provide comprehensive care for dogs, cats, and other companion animals, from routine wellness visits to emergency care and specialized treatments.`,
    localContext: `Navarro County pet owners have access to both small animal clinics in Corsicana and mixed-practice veterinarians who can treat pets alongside farm animals. Rural properties often have both companion animals and livestock, making versatile veterinary care valuable. Local vets are familiar with regional health concerns including heartworm (requiring year-round prevention in Texas), tick-borne diseases, and rattlesnake encounters.`,
    sections: [
      {
        type: "services",
        heading: "Veterinary Services Available",
        content: \`**Wellness Care**
- Annual exams
- Vaccinations (rabies, distemper, parvo, etc.)
- Parasite prevention (heartworm, flea, tick)
- Microchipping
- Nutritional counseling
- Senior pet care

**Medical Services**
- Illness diagnosis and treatment
- Laboratory testing
- Digital X-rays
- Ultrasound
- Dental cleanings and extractions
- Allergy treatment
- Chronic disease management

**Surgical Services**
- Spay and neuter
- Mass/tumor removal
- Orthopedic surgery
- Soft tissue surgery
- Emergency surgery
- Dental surgery

**Additional Services**
- Boarding
- Grooming
- Prescription diets
- Pharmacy
- End of life care
- Pet cremation services\`
      },
      {
        type: "guide",
        heading: "Pet Health Essentials for Navarro County",
        content: \`**Year-Round Prevention (Essential in Texas)**
- Heartworm prevention: Monthly, year-round—Texas mosquitoes transmit heartworm 12 months a year
- Flea and tick prevention: Year-round, especially important with our mild winters
- Intestinal parasite prevention: Regular deworming and fecal testing

**Vaccinations**
Core vaccines (all pets):
- Rabies (required by Texas law)
- Distemper/parvo combo (dogs)
- FVRCP (cats)

Lifestyle vaccines (based on risk):
- Bordetella (dogs in contact with other dogs)
- Leptospirosis (dogs with outdoor/water exposure)
- Rattlesnake vaccine (dogs in rural areas)
- Feline leukemia (outdoor cats)

**Common Local Health Concerns**
- Heartworm disease (prevalent in Texas)
- Tick diseases (Ehrlichia, Rocky Mountain Spotted Fever)
- Rattlesnake bites (especially rural areas)
- Foxtails and grass awns (seasonal)
- Heat-related illness (summer)\`
      }
    ],
    faqs: [
      {
        question: "How much does a vet visit cost in Navarro County?",
        answer: "Wellness exam visits typically cost $50-$80. Annual vaccines run $75-$150 depending on which are needed. Spay/neuter surgery costs $200-$500 depending on pet size and sex. Emergency visits start around $100-$150 for the exam plus treatment costs. Many vets offer wellness plans to spread costs throughout the year."
      },
      {
        question: "How often should my pet see the vet?",
        answer: "Healthy adult pets should have annual wellness exams. Puppies and kittens need visits every 3-4 weeks until 16 weeks old for vaccinations. Senior pets (7+ years) benefit from twice-yearly exams. Pets with chronic conditions may need more frequent monitoring."
      },
      {
        question: "What should I do if my pet has an emergency after hours?",
        answer: "Some Navarro County vets offer after-hours emergency service—check with your regular vet. For serious emergencies (trauma, difficulty breathing, suspected poisoning, bloat), the nearest 24-hour emergency hospital may be in the Dallas-Fort Worth area. Keep emergency vet contact information readily available."
      }
    ],
    relatedServices: ["large-animal-vet", "pet-groomer", "pet-boarding", "dog-trainer", "pet-store"],
    externalResources: [
      { name: "Texas State Board of Veterinary Medical Examiners", url: "https://www.veterinary.texas.gov/" },
      { name: "ASPCA Animal Poison Control", url: "https://www.aspca.org/pet-care/animal-poison-control" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "large-animal-vet",
    title: "Large Animal Vet",
    category: "agriculture_rural",
    subcategory: "animal",
    layout: 3,
    icon: "Heart",
    iconColor: "amber",
    metaTitle: "Large Animal Vet in Navarro County, TX | Livestock Veterinarian",
    metaDescription: "Large animal veterinary services in Navarro County. Cattle, horse, sheep, and goat vet care. Farm calls, herd health, reproduction, and emergency livestock care.",
    metaKeywords: "large animal vet Navarro County, cattle vet, horse vet, livestock veterinarian, farm vet Corsicana, equine vet",
    heroContent: `Agriculture is central to Navarro County's economy, and healthy livestock is essential for productive operations. Large animal veterinarians provide the herd health management, emergency care, and reproductive services that cattle ranchers, horse owners, and other livestock producers need.`,
    localContext: `Navarro County's agricultural sector includes significant cattle operations, horse properties, and smaller livestock operations raising sheep, goats, and pigs. Local large animal vets understand the specific challenges of Central Texas ranching—seasonal parasite pressure, heat stress, and diseases prevalent in our region. They provide both routine herd health and emergency farm calls throughout the county.`,
    sections: [
      {
        type: "services",
        heading: "Large Animal Veterinary Services",
        content: \`**Cattle Services**
- Herd health programs
- Vaccination protocols
- Pregnancy checking
- Calving assistance
- Castration and dehorning
- Treatment of sick animals
- Nutrition consulting
- Pre-purchase exams

**Equine Services**
- Wellness exams and vaccinations
- Dental floating
- Lameness evaluation
- Pre-purchase exams
- Emergency colic treatment
- Wound care
- Reproductive services
- Coggins testing

**Small Ruminant (Sheep/Goat)**
- Flock health programs
- Parasite management
- Foot rot treatment
- Kidding/lambing assistance
- Castration and disbudding

**Additional Services**
- Health certificates for transport
- Brand inspection coordination
- 4-H and FFA project animal care
- Euthanasia services\`
      },
      {
        type: "guide",
        heading: "Livestock Health Management in Navarro County",
        content: \`**Vaccination Schedules**
Cattle:
- Calves: Blackleg/7-way at branding/weaning, boosted at weaning
- Breeding females: Pre-breeding reproductive vaccines
- Bulls: Annual fertility testing

Horses:
- Core vaccines: Rabies, Tetanus, EEE/WEE, West Nile (annual)
- Risk-based: Influenza, Rhino, Strangles (as needed)
- Coggins test required for travel/events

**Parasite Control**
- Strategic deworming based on fecal testing
- Pasture rotation when possible
- Avoid overuse of dewormers (resistance concerns)

**Heat Stress Prevention**
Texas summers are brutal on livestock:
- Provide shade and ample water
- Handle cattle in early morning only
- Watch for signs of heat stress
- Consider summer breeding programs carefully\`
      }
    ],
    faqs: [
      {
        question: "How much does a large animal vet farm call cost?",
        answer: "Farm call fees in Navarro County typically run $50-$100 plus mileage, on top of treatment costs. Routine procedures like pregnancy checking cost $5-$15 per head. Emergency calls, especially after hours, cost significantly more. Many vets offer herd health programs with reduced per-head costs for scheduled visits."
      },
      {
        question: "How often should cattle be checked by a vet?",
        answer: "Most commercial cattle operations should have at least two scheduled vet visits per year: pre-breeding for cows and bulls, and pre-weaning for calves. Seedstock operations and horses typically need more frequent care. Sick animals need prompt attention—don't wait for scheduled visits."
      },
      {
        question: "Do large animal vets also treat small animals?",
        answer: "Many rural large animal vets are mixed-practice, treating both livestock and pets. This is convenient for farm families. However, some specialize exclusively in large animals or equine. Ask about their practice focus when selecting a vet."
      }
    ],
    relatedServices: ["veterinarian", "farrier", "feed-store", "cattle-hauling", "hay-service"],
    externalResources: [
      { name: "Texas Animal Health Commission", url: "https://www.tahc.texas.gov/" },
      { name: "Texas A&M AgriLife Extension - Beef", url: "https://beef.tamu.edu/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "feed-store",
    title: "Feed Store",
    category: "agriculture_rural",
    subcategory: "farm",
    layout: 4,
    icon: "Wheat",
    iconColor: "amber",
    metaTitle: "Feed Store in Navarro County, TX | Livestock Feed & Farm Supply",
    metaDescription: "Feed stores in Corsicana and Navarro County. Livestock feed, horse feed, pet food, hay, farm supplies, and ranch equipment for local agriculture.",
    metaKeywords: "feed store Corsicana, livestock feed Navarro County, horse feed, cattle feed, farm supply, hay supplier",
    heroContent: `Feed stores are the backbone of rural Navarro County, providing everything from livestock nutrition to fencing supplies, pet food, and gardening needs. Whether you're running a cattle operation, boarding horses, or raising backyard chickens, local feed stores offer products and expertise suited to Central Texas agriculture.`,
    localContext: `Navarro County's feed stores serve a diverse customer base—from large cattle operations to hobby farms to suburban pet owners. Local stores stock products appropriate for our regional conditions, including feeds formulated for Texas heat stress and supplements addressing local forage deficiencies. Many also serve as community gathering spots where farmers exchange information and advice.`,
    sections: [
      {
        type: "services",
        heading: "Products and Services Available",
        content: \`**Livestock Feed**
- Cattle feed and supplements (range cubes, protein tubs, minerals)
- Horse feed (performance, senior, complete feeds)
- Sheep and goat feed
- Pig feed
- Poultry feed (layer, broiler, game bird)
- Rabbit feed

**Pet Food**
- Premium dog and cat food
- Bird seed and supplies
- Fish and aquarium supplies
- Small animal food

**Hay and Forage**
- Coastal bermuda (square and round bales)
- Alfalfa
- Timothy (for horses)
- Hay delivery available (often)

**Farm Supplies**
- Fencing (wire, T-posts, panels)
- Water troughs and tanks
- Feeders
- Medications and vaccines
- Fly control
- Grooming supplies
- Tack and horse supplies

**Additional Products**
- Garden and lawn supplies
- Work clothing and boots
- Wildlife feed (deer corn, feeders)
- Propane exchange\`
      },
      {
        type: "guide",
        heading: "Choosing the Right Feed",
        content: \`**Cattle Nutrition Basics**
- Range cubes (20% protein) for winter supplementation
- Protein tubs for free-choice grazing supplement
- Complete feeds for confined cattle
- Mineral supplements (loose or block) year-round
- Consider selenium supplementation (Texas soils are often deficient)

**Horse Feed Selection**
- Match feed to workload (maintenance vs. performance)
- Senior feeds for older horses
- Complete feeds for horses with dental issues
- Limit grain, maximize quality forage
- Always introduce feed changes gradually

**Poultry Feed**
- Layer feed (16% protein) for laying hens
- Starter feed for chicks
- Grower feed for pullets
- Scratch grains as treat only (not complete nutrition)

**Feed Storage Tips**
- Store in cool, dry location
- Use within 60 days for vitamin potency
- Protect from rodents and moisture
- Check for mold before feeding\`
      }
    ],
    faqs: [
      {
        question: "Do feed stores offer delivery?",
        answer: "Many Navarro County feed stores offer delivery for large orders, especially hay and bulk feed. Delivery fees vary based on distance and order size. Some offer free delivery over certain amounts. Call ahead to arrange delivery and confirm pricing."
      },
      {
        question: "How do I know what feed my animals need?",
        answer: "Feed store staff can provide general guidance, but consult your veterinarian or agricultural extension agent for specific nutritional plans. Factors include animal age, production stage (growing, lactating, etc.), available forage quality, and health status. Many feed companies also have nutritionists available for consultation."
      },
      {
        question: "Can I buy hay by the bale or do I need to buy in bulk?",
        answer: "Most feed stores sell hay by the bale for small-quantity buyers. Prices are typically lower for larger quantities (pallet or trailer loads). Quality varies by cutting and storage—ask about current hay quality and test results if available. During shortages, availability may be limited."
      }
    ],
    relatedServices: ["farm-supply", "large-animal-vet", "hay-service", "tractor-repair", "farrier"],
    externalResources: [
      { name: "Texas A&M AgriLife Extension - Animal Science", url: "https://animalscience.tamu.edu/" },
      { name: "Texas Farm Bureau", url: "https://texasfarmbureau.org/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // EVENTS & ENTERTAINMENT
  // ============================================
  {
    slug: "wedding-venue",
    title: "Wedding Venue",
    category: "events_entertainment",
    subcategory: "wedding",
    layout: 5,
    icon: "Heart",
    iconColor: "rose",
    metaTitle: "Wedding Venues in Navarro County, TX | Event Spaces Corsicana",
    metaDescription: "Beautiful wedding venues in Corsicana and Navarro County. Barns, ranches, historic buildings, and waterfront locations for Texas weddings and events.",
    metaKeywords: "wedding venue Corsicana, wedding venue Navarro County, barn wedding, ranch wedding, event space Texas",
    heroContent: `Navarro County offers couples a variety of wedding venue options, from rustic barns and working ranches to historic buildings and lakeside settings. Whether you envision an intimate gathering or a grand celebration, local venues provide beautiful backdrops for your special day with the warmth of Texas hospitality.`,
    localContext: `The Corsicana area has become increasingly popular for weddings, offering more affordable venue options than Dallas-Fort Worth while remaining accessible to metroplex guests. Local venues showcase Central Texas charm—sprawling live oaks, rolling pastures, historic architecture, and proximity to Richland Chambers Reservoir. The mild fall and spring weather makes outdoor ceremonies possible for much of the year.`,
    sections: [
      {
        type: "guide",
        heading: "Types of Wedding Venues in Navarro County",
        content: \`**Barn & Ranch Venues**
- Rustic barn settings with modern amenities
- Working ranch properties
- Open-air pavilions
- Capacity typically 100-300 guests
- Often include outdoor ceremony sites

**Historic Venues**
- Downtown Corsicana historic buildings
- Restored churches and chapels
- Heritage homes and estates
- Unique character and photo opportunities

**Waterfront Venues**
- Richland Chambers lakefront properties
- Pond and creek settings
- Beautiful natural backdrops
- Popular for outdoor ceremonies

**Traditional Venues**
- Country clubs
- Hotel ballrooms
- Church fellowship halls
- Community centers

**Unique Options**
- Wineries and vineyards
- Gardens and parks
- Private estates
- Farms with agricultural themes\`
      },
      {
        type: "checklist",
        heading: "Questions to Ask Wedding Venues",
        content: \`**Basics**
- What is included in the venue rental?
- What is the guest capacity (ceremony vs. reception)?
- What are the available dates?
- What are rain/weather backup options?
- How long is the rental period?

**Vendors & Services**
- Is catering in-house or can we bring our own?
- Are there preferred vendor lists?
- Is there a venue coordinator included?
- What audio/visual equipment is available?
- Is there a bridal suite for getting ready?

**Logistics**
- What time can vendors arrive for setup?
- What are noise restrictions and end times?
- Is there adequate parking?
- Are there accommodations nearby for guests?
- What is the deposit and payment schedule?
- What is the cancellation policy?

**Restrictions**
- Are there decor restrictions?
- Is open flame (candles) allowed?
- Are sparklers or fireworks permitted?
- Are there pet policies?
- Alcohol policies and requirements?\`
      }
    ],
    faqs: [
      {
        question: "How much do wedding venues cost in Navarro County?",
        answer: "Venue costs in Navarro County range widely: $1,500-$3,500 for basic spaces, $4,000-$8,000 for mid-range venues with amenities, and $8,000-$15,000+ for premium properties. These are often significantly less than comparable Dallas-area venues. Most require deposits of 25-50% to secure your date."
      },
      {
        question: "How far in advance should I book a venue?",
        answer: "Popular venues book 12-18 months in advance for peak wedding season (spring and fall in Texas). Less popular dates (summer, winter, weekdays) may have more availability. If you have a specific venue in mind, begin inquiring as soon as you set your date."
      },
      {
        question: "What's included in typical venue rental packages?",
        answer: "Packages vary significantly. Basic rentals may include just the space for a set number of hours. Many venues include tables, chairs, and basic setup. Premium packages might include catering, day-of coordination, decorations, and more. Always get detailed written lists of what's included."
      }
    ],
    relatedServices: ["wedding-planner", "wedding-photographer", "catering", "florist", "dj"],
    externalResources: [
      { name: "Navarro County Tourism", url: "https://www.visitcorsicana.com/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "dj",
    title: "DJ Services",
    category: "events_entertainment",
    subcategory: "music",
    layout: 1,
    icon: "Music",
    iconColor: "purple",
    metaTitle: "DJ Services in Navarro County, TX | Wedding & Event DJ Corsicana",
    metaDescription: "Professional DJ services in Corsicana and Navarro County. Wedding DJs, party DJs, corporate events, quinceañeras, and special occasions.",
    metaKeywords: "DJ Corsicana, wedding DJ Navarro County, event DJ, party DJ, quinceañera DJ Texas",
    heroContent: `The right DJ makes or breaks an event. Beyond playing music, professional DJs serve as emcees, manage event flow, read the crowd, and keep energy high. Navarro County DJs bring experience with local venues and understand what works for Texas celebrations.`,
    localContext: `From Corsicana weddings to quinceañeras to company parties, Navarro County events benefit from DJs familiar with local venues and their unique acoustic properties. Many local DJs have working relationships with area wedding coordinators and venue managers, ensuring smooth events. They're also familiar with the musical preferences spanning our diverse community.`,
    sections: [
      {
        type: "services",
        heading: "DJ Services for Every Event",
        content: \`**Wedding DJ Services**
- Ceremony music
- Cocktail hour atmosphere
- Reception entertainment
- Emcee services
- Dance floor lighting
- Coordination with vendors
- First dance and special moments

**Party & Celebration DJs**
- Birthday parties
- Quinceañeras
- Sweet 16s
- Anniversary celebrations
- Holiday parties
- Family reunions

**Corporate & Professional**
- Company parties
- Awards ceremonies
- Grand openings
- Trade shows
- School events
- Fundraisers

**Equipment Options**
- Professional sound systems
- Wireless microphones
- Uplighting and effects lighting
- Dance floor lighting
- Photo booth add-ons
- Live music integration\`
      },
      {
        type: "guide",
        heading: "Choosing the Right DJ",
        content: \`**What to Look For**
- Experience with your type of event
- Professional equipment (backups available)
- Liability insurance
- Contract and clear pricing
- Positive reviews from local events
- Willingness to learn your preferences

**Questions to Ask**
- How do you handle music requests (and non-requests)?
- What is your backup plan for equipment failure?
- How do you dress for events?
- Will you personally DJ our event or might it be an associate?
- Can we see you in action at another event?
- How do you structure the evening/event flow?
- What happens if you're sick or have an emergency?

**Red Flags**
- No contract or vague pricing
- Unable to provide references
- Doesn't ask about your preferences
- Poor communication
- Unprofessional appearance or demeanor
- No backup equipment plan\`
      }
    ],
    faqs: [
      {
        question: "How much does a DJ cost in Navarro County?",
        answer: "DJ services in Navarro County typically range from $500-$1,500 for most events. Wedding DJs providing full services (ceremony through reception) often charge $800-$2,000. Basic party DJs might start around $300-$500 for shorter events. Premium DJs with extensive lighting and equipment can cost $2,000+. Always get detailed quotes including all services."
      },
      {
        question: "How far in advance should I book a DJ?",
        answer: "For weddings, book 6-12 months in advance, especially for popular dates. Good DJs book up quickly during wedding season (spring and fall). For other events, 2-3 months is typically sufficient, though last-minute bookings are sometimes possible. Earlier booking often provides better selection."
      },
      {
        question: "Can I give the DJ a playlist?",
        answer: "Most professional DJs welcome client input—must-play songs, do-not-play lists, and genre preferences. Good DJs will discuss your musical vision and work within your wishes while also reading the room. Be clear about expectations upfront, especially for weddings where you want specific songs for key moments."
      }
    ],
    relatedServices: ["wedding-venue", "photographer", "event-planner", "live-band", "karaoke"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // CONSTRUCTION & TRADES
  // ============================================
  {
    slug: "general-contractor",
    title: "General Contractor",
    category: "construction_trades",
    subcategory: "construction",
    layout: 2,
    icon: "Hammer",
    iconColor: "amber",
    metaTitle: "General Contractor in Navarro County, TX | Home Builder Corsicana",
    metaDescription: "Licensed general contractors in Corsicana and Navarro County. New home construction, remodeling, additions, and commercial building services.",
    metaKeywords: "general contractor Corsicana, home builder Navarro County, remodeling contractor, home addition, custom home builder",
    heroContent: `Whether you're building a new home, adding space, or remodeling your existing property, a qualified general contractor manages the complex process of bringing your vision to life. Navarro County contractors understand local building codes, soil conditions, and climate considerations essential for successful construction in Central Texas.`,
    localContext: `Building in Navarro County requires understanding our unique conditions. The expansive Blackland Prairie clay soil demands proper foundation engineering—many local builders now use post-tension slabs or pier systems as standard. Hot summers mean HVAC systems must be properly sized, and construction schedules often shift to complete exterior work before extreme heat. Local contractors have relationships with area subcontractors and suppliers, keeping projects on track.`,
    sections: [
      {
        type: "services",
        heading: "General Contractor Services",
        content: \`**New Construction**
- Custom home building
- Spec home construction
- Barndominium construction
- Agricultural buildings
- Commercial buildings
- Multi-family construction

**Remodeling**
- Whole-house renovation
- Kitchen remodeling
- Bathroom remodeling
- Basement/attic finishing
- Historic home restoration
- ADA accessibility modifications

**Additions**
- Room additions
- Second stories
- Garage additions
- Sunrooms and enclosed porches
- Mother-in-law suites
- Workshop/studio buildings

**Project Management**
- Permit acquisition
- Subcontractor coordination
- Material procurement
- Budget management
- Timeline oversight
- Quality control
- Warranty service\`
      },
      {
        type: "guide",
        heading: "Hiring a Contractor in Navarro County",
        content: \`**Credentials to Verify**
- Verify with Navarro County/city if licenses required for your project
- General liability insurance ($1M minimum recommended)
- Workers' compensation insurance
- BBB rating and complaint history
- References from completed local projects

**Getting Bids**
- Get 3+ written bids for significant projects
- Bids should be detailed and itemized
- Be wary of bids significantly lower than others
- Ask about allowances and how overages are handled

**Contract Essentials**
- Detailed scope of work
- Payment schedule tied to milestones
- Start and completion dates
- Change order procedures
- Warranty terms
- Insurance certificates
- Permit responsibilities
- Cleanup and debris removal

**Red Flags**
- Requires large upfront payments
- No written contract
- Cannot provide references
- Pressures you to decide quickly
- No physical business address
- Recently established (less than 3 years)
- Quotes without seeing the project\`
      }
    ],
    faqs: [
      {
        question: "How much does a general contractor charge?",
        answer: "General contractors typically charge 10-20% of project cost as their fee, or they mark up subcontractor and material costs. New home construction in Navarro County runs $150-$250+ per square foot depending on finishes. Remodeling costs $100-$300 per square foot. Always get detailed written estimates before committing."
      },
      {
        question: "Do I need a permit for my project?",
        answer: "In Corsicana city limits, permits are required for new construction, additions, structural modifications, electrical work, plumbing work, and HVAC replacement. In unincorporated Navarro County, requirements are less stringent but septic permits and some other regulations still apply. Your contractor should handle permit acquisition."
      },
      {
        question: "How long does construction take?",
        answer: "New home construction typically takes 6-12 months depending on size and complexity. Major remodels run 2-4 months. Kitchen or bathroom remodels take 4-8 weeks. Room additions average 2-3 months. Weather delays, material availability, and permit processing can extend timelines. Get realistic estimates in writing."
      }
    ],
    relatedServices: ["home-builder", "remodeling", "concrete", "framing", "roofing"],
    externalResources: [
      { name: "Texas Residential Construction Commission (information)", url: "https://www.tdi.texas.gov/" },
      { name: "Better Business Bureau - Dallas", url: "https://www.bbb.org/us/tx/dallas" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "concrete",
    title: "Concrete Work",
    category: "construction_trades",
    subcategory: "specialty",
    layout: 3,
    icon: "Square",
    iconColor: "gray",
    metaTitle: "Concrete Contractors in Navarro County, TX | Concrete Work Corsicana",
    metaDescription: "Professional concrete services in Corsicana and Navarro County. Driveways, patios, foundations, sidewalks, stamped concrete, and concrete repair.",
    metaKeywords: "concrete contractor Corsicana, concrete work Navarro County, driveway, patio, foundation, stamped concrete",
    heroContent: `Quality concrete work requires skill, proper preparation, and understanding of local conditions. Navarro County concrete contractors handle everything from residential driveways and patios to commercial foundations and agricultural structures, with expertise in working with our challenging soil conditions.`,
    localContext: `Concrete work in Navarro County's expansive clay soil presents unique challenges. Proper site preparation, adequate base material, and reinforcement are essential to prevent cracking and settling. Local contractors understand that our extreme temperature swings—from summer highs above 100°F to occasional winter freezes—require appropriate concrete mixes and finishing techniques. Timing pours to avoid rapid evaporation in summer heat is also critical.`,
    sections: [
      {
        type: "services",
        heading: "Concrete Services Available",
        content: \`**Residential Concrete**
- Driveways (plain, colored, stamped)
- Patios and pool decks
- Sidewalks and walkways
- Garage floors
- Foundations (with proper engineering)
- Retaining walls

**Agricultural/Rural**
- Barn floors
- Feed pads
- Livestock working facilities
- Shop floors
- Equipment pads
- Irrigation structures

**Commercial**
- Parking lots
- Loading docks
- Industrial floors
- Foundation work
- Curb and gutter
- ADA-compliant sidewalks

**Decorative Concrete**
- Stamped patterns
- Colored concrete
- Exposed aggregate
- Acid staining
- Concrete overlays
- Polished concrete

**Repair Services**
- Crack repair
- Leveling (mudjacking/foam)
- Resurfacing
- Expansion joint repair
- Spalling repair\`
      },
      {
        type: "guide",
        heading: "Concrete Work Considerations in Navarro County",
        content: \`**Soil Preparation**
Our clay soils require:
- Removal of organic material and topsoil
- Compacted fill or base material (4"+ crushed limestone)
- Proper drainage away from concrete
- Allowance for soil movement

**Reinforcement Options**
- Wire mesh: Basic reinforcement for light-duty applications
- Rebar: Stronger, required for driveways and high-load areas
- Fiber reinforcement: Reduces surface cracking
- Post-tension cables: For foundations (specialty work)

**Weather Considerations**
- Avoid pouring in extreme heat (rapid evaporation)
- Protect fresh concrete from rain
- Winter pours require precautions below 40°F
- Curing compounds essential in our climate

**Maintenance Tips**
- Seal concrete every 2-3 years
- Keep drainage clear
- Avoid deicing chemicals (rare need here)
- Address cracks promptly before they spread\`
      }
    ],
    faqs: [
      {
        question: "How much does concrete work cost in Navarro County?",
        answer: "Basic concrete (plain gray, broom finish) runs $8-$12 per square foot installed. Colored or stamped concrete costs $12-$18 per square foot. A typical 20x20 foot driveway (400 sq ft) costs $3,200-$4,800 for basic work, $4,800-$7,200 for decorative. Removal of old concrete adds $2-$4 per square foot. Always get itemized quotes."
      },
      {
        question: "How long does concrete take to cure?",
        answer: "Concrete reaches about 70% strength in 7 days and full strength at 28 days. You can typically walk on new concrete after 24-48 hours and drive on it after 7 days. However, heavy loads should wait 28 days. Proper curing (keeping it moist) is crucial, especially in Texas heat—your contractor should apply curing compound or water cure."
      },
      {
        question: "Why does concrete crack?",
        answer: "Some cracking is normal in concrete—control joints are placed to direct where cracks occur. Excessive or random cracking usually results from: poor soil preparation, inadequate base material, insufficient reinforcement, improper curing, extreme temperature changes, or tree root pressure. Our clay soils make proper preparation especially important."
      }
    ],
    relatedServices: ["foundation-repair", "general-contractor", "driveway-repair", "patio", "masonry"],
    externalResources: [
      { name: "American Concrete Institute", url: "https://www.concrete.org/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // BEAUTY & PERSONAL CARE
  // ============================================
  {
    slug: "hair-salon",
    title: "Hair Salon",
    category: "beauty_personal",
    subcategory: "hair",
    layout: 4,
    icon: "Scissors",
    iconColor: "pink",
    metaTitle: "Hair Salon in Navarro County, TX | Hair Stylists Corsicana",
    metaDescription: "Hair salons in Corsicana and Navarro County. Haircuts, color, highlights, styling, treatments, and special occasion hair for women and men.",
    metaKeywords: "hair salon Corsicana, hair stylist Navarro County, haircut, hair color, highlights, balayage",
    heroContent: `Finding the right hair salon means finding a stylist who understands your hair, your style, and your lifestyle. Navarro County salons range from quick-service shops to full-service styling studios, offering everything from basic cuts to complex color transformations and special occasion styling.`,
    localContext: `Corsicana's salon scene offers options for every budget and style preference. Downtown Corsicana features several established salons in the historic district, while newer shops have opened in various locations throughout the county. Many stylists have loyal followings built over years in the community, and word-of-mouth recommendations are the primary way most Navarro County residents find their stylists.`,
    sections: [
      {
        type: "services",
        heading: "Hair Services Available",
        content: \`**Cut & Style**
- Women's haircuts
- Men's haircuts
- Children's cuts
- Blowouts and styling
- Updos and formal styles
- Bang trims

**Color Services**
- All-over color
- Highlights and lowlights
- Balayage and ombre
- Color correction
- Gray coverage
- Fashion colors
- Glosses and toners

**Treatments**
- Deep conditioning
- Keratin treatments
- Brazilian blowouts
- Scalp treatments
- Hair repair treatments
- Olaplex treatments

**Texture Services**
- Perms and body waves
- Relaxers
- Texturizing

**Extensions**
- Tape-in extensions
- Sew-in extensions
- Clip-in styling
- Extension maintenance\`
      }
    ],
    faqs: [
      {
        question: "How much does a haircut cost in Navarro County?",
        answer: "Women's haircuts in Navarro County typically range from $25-$60 depending on the salon and stylist experience. Men's cuts run $15-$35. Children's cuts start around $15-$25. Color services vary widely—single-process color runs $60-$100, while highlights and balayage range from $80-$200+. Prices in local salons are generally lower than in the Dallas metroplex."
      },
      {
        question: "How do I find a good hair stylist?",
        answer: "Ask friends and family for recommendations—word of mouth is powerful in Navarro County. Look at stylists' work on social media. Book a consultation before committing to major changes. Be clear about your expectations, maintenance abilities, and budget. A good stylist will be honest about what's achievable with your hair type."
      },
      {
        question: "How often should I get a haircut?",
        answer: "For most styles, every 6-8 weeks maintains shape. Short cuts may need trimming every 4-6 weeks. Long hair can often go 8-12 weeks between cuts if just maintaining length. Color touch-ups for root coverage typically need attention every 4-6 weeks, while balayage and highlights can grow out more gracefully over 3-4 months."
      }
    ],
    relatedServices: ["barbershop", "nail-salon", "spa", "makeup-artist"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "barbershop",
    title: "Barbershop",
    category: "beauty_personal",
    subcategory: "hair",
    layout: 5,
    icon: "Scissors",
    iconColor: "slate",
    metaTitle: "Barbershop in Navarro County, TX | Men's Haircuts Corsicana",
    metaDescription: "Barbershops in Corsicana and Navarro County. Men's haircuts, beard trims, hot towel shaves, fades, and traditional barber services.",
    metaKeywords: "barbershop Corsicana, barber Navarro County, men's haircut, beard trim, fade, shave",
    heroContent: `The barbershop is more than a place to get a haircut—it's a community institution. Navarro County barbershops offer men quality cuts, beard services, and often a bit of friendly conversation, continuing a tradition that's been part of Texas towns for generations.`,
    localContext: `Corsicana has maintained its barbershop culture, with both traditional shops and modern style-focused barbers serving the community. Many local barbers have been cutting hair for decades, with customers who've been coming since childhood. Whether you want a classic cut or the latest fade, Navarro County barbershops deliver quality service at reasonable prices.`,
    sections: [
      {
        type: "services",
        heading: "Barber Services",
        content: \`**Haircuts**
- Classic cuts
- Fades (low, mid, high)
- Tapers
- Buzz cuts
- Scissor cuts
- Kids' cuts

**Beard Services**
- Beard trims
- Beard shaping
- Line-ups
- Hot towel shaves
- Straight razor shaves

**Additional Services**
- Edge-ups and line-ups
- Eyebrow grooming
- Ear and nose hair trimming
- Scalp treatments
- Hair designs and patterns\`
      }
    ],
    faqs: [
      {
        question: "How much does a haircut cost at Navarro County barbershops?",
        answer: "Men's haircuts typically cost $15-$30 at most Navarro County barbershops. Fades and detailed work may be at the higher end. Kids' cuts usually run $12-$20. Beard trims add $10-$20. Hot towel shaves range from $20-$35. Most barbers appreciate cash but many now accept cards."
      },
      {
        question: "Do I need an appointment or can I walk in?",
        answer: "Many traditional barbershops in Navarro County operate on a walk-in basis—first come, first served. Some busier shops and modern barbershops offer appointments, especially for specific barbers. Saturdays are typically busiest. If you have a preferred barber, calling ahead is a good idea."
      },
      {
        question: "How often should I get a haircut?",
        answer: "For a fresh look, most men's cuts look best with maintenance every 2-4 weeks. Fades grow out quickly and may need attention every 2 weeks to maintain crisp lines. Longer styles can often go 4-6 weeks. Find a schedule that works for your style, budget, and maintenance preferences."
      }
    ],
    relatedServices: ["hair-salon", "spa", "men's-grooming"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // EDUCATION & CHILDCARE
  // ============================================
  {
    slug: "daycare",
    title: "Daycare Center",
    category: "education_childcare",
    subcategory: "childcare",
    layout: 1,
    icon: "Baby",
    iconColor: "sky",
    metaTitle: "Daycare in Navarro County, TX | Childcare Centers Corsicana",
    metaDescription: "Licensed daycare centers in Corsicana and Navarro County. Quality childcare for infants, toddlers, and preschoolers with trained staff and educational programs.",
    metaKeywords: "daycare Corsicana, childcare Navarro County, preschool, infant care, toddler care, child care center",
    heroContent: `Finding quality childcare is one of the most important decisions parents make. Navarro County daycare centers offer safe, nurturing environments where children learn and grow while parents work with peace of mind. From infant care to pre-K programs, local providers meet the diverse needs of area families.`,
    localContext: `With many Navarro County parents commuting to Dallas-Fort Worth or working locally, reliable childcare is essential. Licensed centers throughout the county offer various options—from small home-based operations to larger facilities with multiple classrooms. Many centers accept childcare subsidies through the Texas Workforce Commission for qualifying families. The local 4C (Community Coordinated Child Care) agency can help families navigate childcare options and assistance programs.`,
    sections: [
      {
        type: "services",
        heading: "Childcare Options in Navarro County",
        content: \`**By Age Group**
- Infant care (6 weeks - 12 months)
- Toddler programs (1-2 years)
- Preschool (3-4 years)
- Pre-K (4-5 years)
- After-school care
- Summer programs

**Program Types**
- Full-day care (typically 6am-6pm)
- Part-time options
- Drop-in care (limited availability)
- Before and after school
- Summer and holiday camps

**Educational Approaches**
- Play-based learning
- Structured curriculum
- Montessori methods
- Faith-based programs
- Bilingual programs
- STEAM enrichment\`
      },
      {
        type: "guide",
        heading: "Choosing a Daycare in Navarro County",
        content: \`**What to Look For**
- Valid Texas childcare license (verify at HHSC website)
- Low staff-to-child ratios
- Clean, safe, age-appropriate environment
- Qualified, caring staff
- Strong communication with parents
- Curriculum appropriate for ages served
- Positive interactions between staff and children

**Questions to Ask**
- What are your teacher qualifications and turnover rate?
- What is your discipline policy?
- How do you handle illness and emergencies?
- What is included in tuition (meals, supplies)?
- What is your vacation and holiday schedule?
- Can I drop in unannounced to visit?
- What security measures are in place?

**Red Flags**
- Reluctance to allow visits or tours
- High staff turnover
- Uncleanliness or safety hazards
- Lack of structure or curriculum
- Poor communication
- Not willing to share licensing records\`
      }
    ],
    faqs: [
      {
        question: "How much does daycare cost in Navarro County?",
        answer: "Daycare costs in Navarro County typically range from $150-$250 per week for full-time care, depending on the child's age (infants cost more) and center type. This is generally 20-30% less than Dallas-area rates. Part-time rates vary. Texas Workforce Commission subsidies are available for qualifying families—contact the local workforce office for eligibility."
      },
      {
        question: "How do I know if a daycare is licensed?",
        answer: "All Texas daycare centers caring for more than 3 unrelated children must be licensed by HHSC (Health and Human Services Commission). You can verify any license and check inspection records at the HHSC website or by calling them directly. Licensed centers must post their license where parents can see it."
      },
      {
        question: "What should I look for during a daycare visit?",
        answer: "Observe how staff interact with children—they should be warm, engaged, and attentive. Look at the overall cleanliness and safety. Notice if children seem happy and engaged. Ask about daily routines and educational activities. Trust your instincts about the environment and staff. Visit during active hours to see the center in operation."
      }
    ],
    relatedServices: ["preschool", "babysitter", "after-school-care", "tutoring"],
    externalResources: [
      { name: "Texas HHSC - Search Child Care", url: "https://www.hhs.texas.gov/services/safety/child-care" },
      { name: "Texas Workforce Commission - Childcare", url: "https://www.twc.texas.gov/programs/childcare" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "tutoring",
    title: "Tutoring",
    category: "education_childcare",
    subcategory: "education",
    layout: 2,
    icon: "BookOpen",
    iconColor: "blue",
    metaTitle: "Tutoring in Navarro County, TX | Academic Tutors Corsicana",
    metaDescription: "Academic tutoring in Corsicana and Navarro County. Math tutoring, reading help, homework assistance, test prep, and all subjects for K-12 students.",
    metaKeywords: "tutoring Corsicana, tutor Navarro County, math tutor, reading tutor, test prep, homework help",
    heroContent: `Every student learns differently, and sometimes one-on-one attention makes all the difference. Navarro County tutors help students of all ages master challenging subjects, build confidence, and achieve their academic goals—whether that's passing algebra, preparing for the SAT, or developing strong reading skills.`,
    localContext: `Navarro County students attend schools in Corsicana ISD, Mildred ISD, Kerens ISD, Blooming Grove ISD, and other local districts. Tutors familiar with Texas curriculum standards and local school expectations can provide targeted support. Many parents seek tutoring help as STAAR testing approaches or when students need extra support with challenging coursework.`,
    sections: [
      {
        type: "services",
        heading: "Tutoring Services Available",
        content: \`**Subject Tutoring**
- Math (all levels through calculus)
- Reading and language arts
- Science (biology, chemistry, physics)
- Social studies and history
- Foreign languages
- Writing and essay skills

**Test Preparation**
- STAAR test prep
- SAT and ACT prep
- PSAT/National Merit
- College entrance essays
- TSI (Texas Success Initiative)
- GED preparation

**Grade Levels**
- Elementary school (K-5)
- Middle school (6-8)
- High school (9-12)
- College-level support

**Learning Support**
- Homework help
- Study skills development
- Organization strategies
- Learning disability support
- Gifted student enrichment
- Homeschool support\`
      },
      {
        type: "guide",
        heading: "Finding the Right Tutor",
        content: \`**What to Consider**
- Subject expertise and qualifications
- Experience with the student's grade level
- Teaching style and personality fit
- Availability and scheduling flexibility
- Location (in-home, online, or tutor's location)
- References from other families

**Types of Tutoring**
- **Private tutors:** One-on-one attention, customized to student
- **Learning centers:** Structured programs, multiple subjects
- **Online tutoring:** Convenient, wider tutor selection
- **Group tutoring:** More affordable, social learning
- **Peer tutoring:** Older students helping younger

**Red Flags**
- Guarantees specific grade improvements
- No clear qualifications or background
- Unwillingness to communicate with parents
- Rigid methods that don't adapt to student needs
- Lack of patience or poor rapport with student\`
      }
    ],
    faqs: [
      {
        question: "How much does tutoring cost in Navarro County?",
        answer: "Private tutoring in Navarro County typically costs $25-$50 per hour depending on subject, tutor qualifications, and student grade level. Test prep specialists may charge $50-$75+. Learning centers often charge monthly fees of $150-$400. Some certified teachers offer more affordable rates. Group sessions cost less per student than private tutoring."
      },
      {
        question: "How often should my child see a tutor?",
        answer: "For most students, 1-2 sessions per week provides good progress. Students significantly behind or preparing for important tests may benefit from more frequent sessions. Consistency matters more than intensity—regular weekly sessions typically produce better results than sporadic cramming."
      },
      {
        question: "How do I know if tutoring is working?",
        answer: "Look for improvements in grades, but also confidence and attitude toward learning. Good tutors set goals and track progress. Communicate regularly with the tutor about what's being worked on. Give it adequate time—significant improvement often takes 2-3 months of consistent work."
      }
    ],
    relatedServices: ["music-lessons", "test-prep", "daycare", "after-school-care"],
    externalResources: [
      { name: "Texas Education Agency", url: "https://tea.texas.gov/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // RETAIL
  // ============================================
  {
    slug: "furniture-store",
    title: "Furniture Store",
    category: "retail",
    subcategory: "home",
    layout: 3,
    icon: "Sofa",
    iconColor: "amber",
    metaTitle: "Furniture Stores in Navarro County, TX | Home Furnishings Corsicana",
    metaDescription: "Furniture stores in Corsicana and Navarro County. Living room, bedroom, dining furniture, mattresses, and home decor with delivery available.",
    metaKeywords: "furniture store Corsicana, furniture Navarro County, living room furniture, bedroom furniture, mattress, home decor",
    heroContent: `Whether you're furnishing a new home, updating a room, or looking for a single statement piece, Navarro County furniture stores offer options for every style and budget. From traditional to contemporary, local stores provide the furniture and home goods that make a house a home.`,
    localContext: `Corsicana has a long history in furniture manufacturing and retail, with some furniture stores operating for generations. Local stores offer competitive pricing compared to big-box retailers, often with better customer service, delivery, and the ability to see pieces in person before buying. Many offer financing options to help families furnish their homes within budget.`,
    sections: [
      {
        type: "services",
        heading: "What Furniture Stores Offer",
        content: \`**Living Room**
- Sofas and sectionals
- Recliners and chairs
- Coffee and end tables
- Entertainment centers
- Accent furniture

**Bedroom**
- Bedroom sets
- Mattresses and box springs
- Headboards and bed frames
- Dressers and nightstands
- Kids' furniture

**Dining**
- Dining sets
- Buffets and china cabinets
- Bar stools and counter seating
- Kitchen tables

**Office**
- Desks
- Office chairs
- Bookcases
- File cabinets

**Additional**
- Mattresses (see mattress stores)
- Outdoor furniture
- Home decor and accessories
- Rugs and lamps
- Delivery and setup services
- Financing options\`
      }
    ],
    faqs: [
      {
        question: "Do furniture stores offer delivery?",
        answer: "Most Navarro County furniture stores offer delivery, often free within a certain radius for purchases over a minimum amount (typically $500-$1,000). Some include setup and removal of old furniture. Ask about delivery timeframes—stock items may deliver within a week while special orders can take 6-12 weeks."
      },
      {
        question: "Is it better to buy furniture locally or online?",
        answer: "Local stores offer advantages: you can see and test furniture before buying, avoid shipping damage risks, get personalized service, and support local businesses. Pricing is often competitive with online retailers, especially when you factor in shipping costs. However, online may offer more selection for specific styles."
      },
      {
        question: "What should I know before buying furniture?",
        answer: "Measure your space carefully, including doorways for delivery. Consider your lifestyle (pets, kids, heavy use). Check construction quality—look at frame materials, cushion density, and fabric durability. Understand warranty terms. Don't rush—take time to compare options and prices."
      }
    ],
    relatedServices: ["mattress-store", "appliance-store", "interior-painting", "flooring"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // LODGING & TRAVEL
  // ============================================
  {
    slug: "hotel",
    title: "Hotel",
    category: "lodging_travel",
    subcategory: "lodging",
    layout: 4,
    icon: "Bed",
    iconColor: "indigo",
    metaTitle: "Hotels in Navarro County, TX | Accommodations in Corsicana",
    metaDescription: "Hotels and lodging in Corsicana and Navarro County. Comfortable accommodations for business travelers, families, and visitors to Central Texas.",
    metaKeywords: "hotel Corsicana, hotel Navarro County, lodging, motel, accommodations, places to stay",
    heroContent: `Whether you're visiting for business, attending an event, or exploring Central Texas, Navarro County offers comfortable accommodations to fit your needs and budget. From familiar chain hotels to local establishments, visitors find welcoming places to stay in and around Corsicana.`,
    localContext: `Navarro County's location along I-45 between Dallas and Houston makes it a convenient stopping point for travelers. Corsicana's historic downtown, proximity to Richland Chambers Reservoir, and various events draw visitors throughout the year. Hotels range from budget-friendly options to well-appointed properties with full amenities.`,
    sections: [
      {
        type: "services",
        heading: "Lodging Options in Navarro County",
        content: \`**Hotel Types**
- Chain hotels (various brands)
- Independent hotels
- Extended stay properties
- Boutique accommodations
- Budget motels

**Common Amenities**
- Complimentary breakfast
- Free WiFi
- Swimming pools
- Fitness centers
- Business centers
- Pet-friendly options
- Meeting rooms

**Location Considerations**
- I-45 corridor: Convenient highway access
- Downtown Corsicana: Near historic attractions
- Near Richland Chambers: Lake access
- Various exits: Easy access to different areas\`
      }
    ],
    faqs: [
      {
        question: "What hotels are in Corsicana?",
        answer: "Corsicana has several chain hotels including Hampton Inn, Best Western, Comfort Suites, and others, along with independent properties. Most are located along the I-45 corridor or near major roads. Prices typically range from $70-$150 per night depending on the property and season."
      },
      {
        question: "Are there pet-friendly hotels in Navarro County?",
        answer: "Yes, several Navarro County hotels accept pets, though policies and fees vary. Some charge $10-$50 per night pet fees, while others have weight or breed restrictions. Always call ahead to confirm pet policies and any requirements. Extended stays may have different pet policies than short stays."
      },
      {
        question: "What events bring visitors to Navarro County?",
        answer: "Major events include Derrick Days festival, various rodeos and livestock shows, fishing tournaments at Richland Chambers, Navarro College events, and sports tournaments. Hotels often fill up during large events—book early if visiting during festival weekends or major competitions."
      }
    ],
    relatedServices: ["bed-breakfast", "vacation-rental", "rv-park", "restaurant"],
    externalResources: [
      { name: "Visit Corsicana", url: "https://www.visitcorsicana.com/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // INDUSTRIAL & COMMERCIAL
  // ============================================
  {
    slug: "commercial-cleaning",
    title: "Commercial Cleaning",
    category: "industrial_commercial",
    subcategory: "commercial",
    layout: 5,
    icon: "Sparkles",
    iconColor: "cyan",
    metaTitle: "Commercial Cleaning in Navarro County, TX | Janitorial Services Corsicana",
    metaDescription: "Commercial cleaning services in Corsicana and Navarro County. Office cleaning, janitorial services, floor care, and facility maintenance for businesses.",
    metaKeywords: "commercial cleaning Corsicana, janitorial service Navarro County, office cleaning, floor care, building maintenance",
    heroContent: `A clean workplace is essential for employee health, customer impressions, and professional image. Navarro County commercial cleaning services help businesses maintain spotless offices, retail spaces, and industrial facilities with reliable, professional service.`,
    localContext: `From downtown Corsicana offices to manufacturing facilities, Navarro County businesses rely on professional cleaning services to maintain their premises. Local commercial cleaners understand the needs of different industries—from medical offices requiring strict sanitization to retail spaces needing frequent attention to high-traffic areas.`,
    sections: [
      {
        type: "services",
        heading: "Commercial Cleaning Services",
        content: \`**Regular Cleaning**
- Office cleaning (daily, weekly, monthly)
- Restroom sanitation
- Trash removal
- Dusting and surface cleaning
- Vacuum and mop floors
- Kitchen/breakroom cleaning

**Specialized Services**
- Floor stripping and waxing
- Carpet cleaning
- Window cleaning
- Post-construction cleanup
- Move-in/move-out cleaning
- Pressure washing

**Industry-Specific**
- Medical office cleaning (OSHA compliant)
- Restaurant and food service
- Retail store cleaning
- Industrial/warehouse
- School and childcare
- Church and worship facilities

**Additional Services**
- Day porter services
- Restroom supply stocking
- Odor control
- Green cleaning options
- Emergency cleaning\`
      }
    ],
    faqs: [
      {
        question: "How much does commercial cleaning cost?",
        answer: "Commercial cleaning rates depend on space size, cleaning frequency, and services needed. Small offices (under 2,000 sq ft) typically run $150-$400 monthly for regular cleaning. Larger facilities negotiate per-square-foot rates, often $0.05-$0.20/sq ft. Specialized services like floor care and window cleaning are usually priced separately."
      },
      {
        question: "How often should a business be cleaned?",
        answer: "High-traffic businesses (medical, retail, food service) often need daily cleaning. Professional offices typically use 2-3 times weekly service. Warehouses and industrial spaces may need weekly cleaning. The right frequency depends on foot traffic, industry requirements, and your standards. Most cleaning companies will assess and recommend."
      },
      {
        question: "Should I choose a cleaning company or hire an employee?",
        answer: "Cleaning companies handle hiring, training, insurance, supplies, and backup coverage—reducing your management burden. They're usually more cost-effective than full-time employees for most businesses. However, large facilities with constant cleaning needs might benefit from in-house staff. Consider your space size, budget, and management capacity."
      }
    ],
    relatedServices: ["janitorial", "carpet-cleaning", "window-cleaning", "pressure-washing"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "moving-company",
    title: "Moving Company",
    category: "industrial_commercial",
    subcategory: "storage",
    layout: 1,
    icon: "Truck",
    iconColor: "orange",
    metaTitle: "Moving Company in Navarro County, TX | Movers in Corsicana",
    metaDescription: "Professional moving services in Corsicana and Navarro County. Local and long-distance moving, packing services, and commercial relocation.",
    metaKeywords: "moving company Corsicana, movers Navarro County, local moving, packing service, relocation, furniture moving",
    heroContent: `Moving is stressful, but the right moving company makes it manageable. Navarro County movers help families and businesses relocate locally, across Texas, or across the country with professional care for your belongings and respect for your time.`,
    localContext: `With people moving to Navarro County from the Dallas-Fort Worth metroplex seeking more affordable living, and others relocating for jobs or family, local moving companies stay busy year-round. Movers familiar with Navarro County know the challenges—from tight turns in older Corsicana neighborhoods to long driveways on rural properties.`,
    sections: [
      {
        type: "services",
        heading: "Moving Services Available",
        content: \`**Residential Moving**
- Local moves (within Navarro County)
- Long-distance moves
- Apartment moves
- House moves
- Senior moves

**Packing Services**
- Full-service packing
- Fragile item packing
- Unpacking services
- Packing supplies

**Commercial Moving**
- Office relocation
- Retail store moves
- Medical/dental office
- Industrial equipment
- Computer and server moving

**Specialty Services**
- Piano and heavy item moving
- Gun safe moving
- Hot tub moving
- Storage solutions
- Junk removal
- Loading/unloading only\`
      },
      {
        type: "guide",
        heading: "Planning Your Move",
        content: \`**Choosing a Moving Company**
- Get multiple written estimates
- Verify licensing and insurance
- Check reviews and references
- Understand what's included
- Ask about additional charges
- Get everything in writing

**Before Moving Day**
- Declutter and donate unwanted items
- Obtain packing supplies early
- Label boxes by room
- Create inventory of valuable items
- Photograph electronics connections
- Plan child and pet care

**Moving Day Tips**
- Be present and available
- Keep essentials accessible
- Walk through with crew
- Inspect before signing
- Tip movers if service was good
- Verify nothing left behind\`
      }
    ],
    faqs: [
      {
        question: "How much does moving cost in Navarro County?",
        answer: "Local moves typically charge hourly rates: $80-$150/hour for a 2-person crew with truck, $100-$175 for 3-person crews. A typical 2-bedroom local move runs $300-$600. Long-distance moves are priced by weight and distance—moves within Texas might cost $1,500-$4,000 depending on size. Always get binding estimates in writing."
      },
      {
        question: "How far in advance should I book movers?",
        answer: "Book 2-4 weeks ahead for local moves, 4-8 weeks for long-distance. End of month, weekends, and summer are busiest—book earlier for these times. Some flexibility on moving date can save money since mid-week and mid-month often have better availability."
      },
      {
        question: "What should I not pack for a move?",
        answer: "Movers won't transport: hazardous materials (gasoline, propane, paint, chemicals), perishable food, plants (many states restrict), important documents and valuables (take these yourself), and items of extreme personal importance. Check with your mover about specific restrictions—policies vary."
      }
    ],
    relatedServices: ["storage-units", "junk-removal", "cleaning", "handyman"],
    externalResources: [
      { name: "Texas Department of Motor Vehicles - Movers", url: "https://www.txdmv.gov/motorists/consumer-protection/household-goods-movers" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // MORE HOME SERVICES
  // ============================================
  {
    slug: "handyman",
    title: "Handyman Services",
    category: "home_services",
    subcategory: "maintenance",
    layout: 2,
    icon: "Wrench",
    iconColor: "amber",
    metaTitle: "Handyman in Navarro County, TX | Home Repair Services Corsicana",
    metaDescription: "Handyman services in Corsicana and Navarro County. Home repairs, maintenance, installations, and odd jobs for residential and commercial properties.",
    metaKeywords: "handyman Corsicana, home repair Navarro County, home maintenance, odd jobs, fix-it service",
    heroContent: `From hanging pictures to fixing faucets to building shelves, handyman services tackle the endless list of small projects that homeowners don't have time for—or the tools to complete properly. Navarro County handymen offer skilled help for repairs, installations, and home improvements of all sizes.`,
    localContext: `Navarro County's mix of older homes and newer construction creates ongoing maintenance needs. Older Corsicana homes may need updates to electrical outlets, weatherstripping, or plumbing fixtures. Newer homes develop their own issues as materials settle. Local handymen familiar with both types can handle the variety of projects homeowners encounter.`,
    sections: [
      {
        type: "services",
        heading: "Handyman Services",
        content: \`**Interior Repairs**
- Drywall repair and patching
- Door adjustments and hardware
- Cabinet repairs
- Trim and molding installation
- Caulking and sealing
- Light fixture installation

**Exterior Work**
- Minor fence repairs
- Gutter cleaning and repairs
- Pressure washing
- Deck maintenance
- Screen repairs
- Weather stripping

**Installations**
- Ceiling fans
- Shelving
- Towel bars and bath hardware
- TV mounting
- Smoke detectors
- Smart home devices

**General Maintenance**
- Appliance hookups
- Furniture assembly
- Picture hanging
- Minor plumbing fixes
- Small painting projects
- Seasonal maintenance\`
      }
    ],
    faqs: [
      {
        question: "How much does a handyman charge in Navarro County?",
        answer: "Most Navarro County handymen charge $40-$75 per hour with 1-2 hour minimums for small jobs. Some offer flat rates for common tasks. Expect to pay $75-$200 for typical projects like ceiling fan installation, TV mounting, or minor repairs. Get quotes for larger projects. Rates are generally lower than specialized contractors."
      },
      {
        question: "What's the difference between a handyman and a contractor?",
        answer: "Handymen handle smaller repairs and general maintenance tasks. They typically don't need licenses for their work. Contractors specialize in specific trades (electrical, plumbing, HVAC) requiring licenses, and they handle larger projects with permits. If a project involves structural changes, new electrical circuits, or significant plumbing, you likely need a licensed contractor."
      },
      {
        question: "How do I find a reliable handyman?",
        answer: "Ask neighbors and friends for recommendations—word of mouth is valuable in a community like Navarro County. Check online reviews. Ask about insurance coverage. Start with a small project to test reliability before committing to larger work. Good handymen are often booked out, so plan ahead for non-emergency work."
      }
    ],
    relatedServices: ["electrician", "plumber", "drywall", "painting", "carpenter"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "garage-door",
    title: "Garage Door Service",
    category: "home_services",
    subcategory: "exterior",
    layout: 3,
    icon: "DoorOpen",
    iconColor: "slate",
    metaTitle: "Garage Door Service in Navarro County, TX | Repair & Installation Corsicana",
    metaDescription: "Garage door repair and installation in Corsicana and Navarro County. Broken springs, opener repair, new doors, and 24/7 emergency garage door service.",
    metaKeywords: "garage door repair Corsicana, garage door Navarro County, broken spring, garage door opener, garage door installation",
    heroContent: `Your garage door is likely the largest moving part of your home—and when it breaks, it's often an emergency. Navarro County garage door services handle everything from broken springs (the most common failure) to complete door replacement, with many offering same-day and emergency service.`,
    localContext: `Texas heat and temperature swings put stress on garage door components. Metal springs and tracks expand and contract with our temperature extremes, accelerating wear. Our humidity can also affect wooden doors and electronic components. Local garage door technicians understand these regional factors and stock parts suited to Texas conditions.`,
    sections: [
      {
        type: "services",
        heading: "Garage Door Services",
        content: \`**Repair Services**
- Spring replacement (most common repair)
- Cable repair and replacement
- Roller replacement
- Track realignment
- Panel replacement
- Weather seal replacement
- Safety sensor repair

**Opener Services**
- Opener repair
- New opener installation
- Remote programming
- Keypad installation
- Smart opener upgrades
- Battery backup installation

**Door Installation**
- New residential doors
- Insulated doors
- Custom doors
- Commercial doors
- Door replacement

**Emergency Service**
- 24/7 availability (many companies)
- Broken spring service
- Door off track
- Lock-out service
- Storm damage\`
      }
    ],
    faqs: [
      {
        question: "How much does garage door repair cost?",
        answer: "Spring replacement, the most common repair, typically costs $150-$300 for a single spring or $200-$400 for both. Opener repair runs $100-$200 for minor issues, or $300-$600 if the motor needs replacement. New opener installation costs $200-$500 including the unit. New garage doors range from $700-$2,500+ depending on size and style."
      },
      {
        question: "Can I replace a garage door spring myself?",
        answer: "Garage door springs are under extreme tension and can cause serious injury if mishandled. Torsion springs (on a rod above the door) are especially dangerous and should only be replaced by professionals. While extension springs (along the sides) are somewhat safer, professional repair is still strongly recommended for safety."
      },
      {
        question: "How long do garage door springs last?",
        answer: "Standard garage door springs are rated for about 10,000 cycles (one open and one close = one cycle). For a typical family using the door 4 times daily, that's about 7 years. Heavy use shortens lifespan. When one spring breaks, the other often follows soon—many technicians recommend replacing both at once."
      }
    ],
    relatedServices: ["electrician", "handyman", "home-security", "door-installation"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "lawn-care",
    title: "Lawn Care",
    category: "home_services",
    subcategory: "outdoor",
    layout: 4,
    icon: "Leaf",
    iconColor: "green",
    metaTitle: "Lawn Care in Navarro County, TX | Lawn Service Corsicana",
    metaDescription: "Professional lawn care in Corsicana and Navarro County. Mowing, edging, fertilization, weed control, and lawn maintenance for healthy Texas lawns.",
    metaKeywords: "lawn care Corsicana, lawn service Navarro County, lawn mowing, fertilizer, weed control, grass cutting",
    heroContent: `A healthy lawn enhances curb appeal and provides outdoor living space, but maintaining it in Central Texas takes knowledge and effort. Navarro County lawn care services keep grass looking great through our hot summers, handle weed and pest problems, and free up your weekends for more enjoyable activities.`,
    localContext: `Navarro County lawns face Texas-sized challenges: summer temperatures exceeding 100°F, periods of drought, invasive weeds, fire ants, and diseases that thrive in humidity. The dominant lawn grasses here—Bermuda, St. Augustine, and Zoysia—each have specific care needs. Local lawn care professionals understand the seasonal timing of fertilization, weed prevention, and maintenance that produces healthy lawns in our climate.`,
    sections: [
      {
        type: "services",
        heading: "Lawn Care Services",
        content: \`**Maintenance**
- Weekly/bi-weekly mowing
- Edging and trimming
- Blowing debris
- Leaf removal (seasonal)

**Fertilization & Treatment**
- Fertilization programs
- Pre-emergent weed control
- Post-emergent weed treatment
- Grub and insect control
- Disease treatment
- Fire ant treatment

**Lawn Health**
- Aeration (fall)
- Overseeding
- Soil testing
- pH adjustment
- Thatch removal

**Additional Services**
- Shrub trimming
- Bed maintenance
- Mulching
- Seasonal cleanup
- Irrigation checks\`
      }
    ],
    faqs: [
      {
        question: "How much does lawn care cost in Navarro County?",
        answer: "Basic mowing service for a typical quarter-acre lot runs $35-$60 per visit. Fertilization and weed control programs cost $50-$80 per application (usually 5-7 applications annually). Full-service programs including mowing and treatments run $150-$300 monthly during growing season. Prices vary by lot size and services included."
      },
      {
        question: "How often should grass be mowed in Texas?",
        answer: "During peak growing season (April-October), weekly mowing is typical. Never remove more than 1/3 of blade height at once. In extreme heat, mowing every 10-14 days may be better to reduce stress. Winter dormancy allows monthly or as-needed mowing. Adjust height seasonally—higher in summer, lower in spring and fall."
      },
      {
        question: "When should I fertilize my lawn in Navarro County?",
        answer: "For warm-season grasses (Bermuda, St. Augustine, Zoysia), fertilize from April through September. Apply pre-emergent weed control in late February/early March and again in early fall. Avoid fertilizing during extreme heat (over 95°F) or drought. A soil test helps determine exactly what your lawn needs."
      }
    ],
    relatedServices: ["landscaping", "irrigation", "pest-control", "tree-service"],
    externalResources: [
      { name: "Texas A&M AgriLife Extension - Lawns", url: "https://aggie-horticulture.tamu.edu/earthkind/lawn/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "cleaning",
    title: "House Cleaning",
    category: "home_services",
    subcategory: "maintenance",
    layout: 5,
    icon: "Sparkles",
    iconColor: "cyan",
    metaTitle: "House Cleaning in Navarro County, TX | Maid Service Corsicana",
    metaDescription: "Professional house cleaning in Corsicana and Navarro County. Regular maid service, deep cleaning, move-in/out cleaning, and residential cleaning services.",
    metaKeywords: "house cleaning Corsicana, maid service Navarro County, cleaning service, deep cleaning, home cleaning",
    heroContent: `Life in Navarro County keeps families busy—work, kids' activities, and community involvement leave little time for thorough housecleaning. Professional cleaning services help maintain a healthy, comfortable home without sacrificing your precious free time.`,
    localContext: `From ranch homes with mudrooms that see heavy use to historic Corsicana houses with lots of woodwork, Navarro County homes have varied cleaning needs. Local cleaning services understand these differences and adapt their approach accordingly. They're also familiar with challenges like the red clay dust that finds its way into everything and the allergens common to Central Texas.`,
    sections: [
      {
        type: "services",
        heading: "House Cleaning Services",
        content: \`**Regular Cleaning**
- Dusting and surface cleaning
- Vacuuming and mopping
- Kitchen cleaning
- Bathroom sanitizing
- Bedroom tidying
- Trash removal

**Deep Cleaning**
- Behind and under furniture
- Inside cabinets and drawers
- Baseboards and trim
- Light fixtures and fans
- Window sills and blinds
- Detailed bathroom cleaning

**Specialty Cleaning**
- Move-in/move-out cleaning
- Post-construction cleanup
- Spring cleaning
- Holiday preparation
- Party before/after

**Additional Services**
- Laundry and folding
- Dish washing
- Bed changing
- Organizing
- Inside refrigerator
- Inside oven\`
      }
    ],
    faqs: [
      {
        question: "How much does house cleaning cost in Navarro County?",
        answer: "Regular cleaning for a typical 2,000 sq ft home runs $100-$175 per visit. Deep cleaning costs $200-$350. Move-out cleaning averages $250-$400 depending on size and condition. Most services price by home size and service type. Regular customers (weekly or bi-weekly) typically get better rates than one-time cleanings."
      },
      {
        question: "How often should I have my house professionally cleaned?",
        answer: "Weekly cleaning keeps homes consistently fresh and reduces deep cleaning needs. Bi-weekly (every two weeks) is the most popular option, balancing cleanliness with cost. Monthly cleaning works for those who maintain well between visits. Consider lifestyle factors—homes with kids, pets, or multiple occupants often need more frequent service."
      },
      {
        question: "Should I clean before the cleaning service comes?",
        answer: "You don't need to clean, but picking up clutter helps cleaners work more efficiently on actual cleaning tasks. Clearing countertops, putting away dishes, and managing laundry means more time spent on surfaces and sanitation. Most services will work around clutter, but your results may be better when surfaces are accessible."
      }
    ],
    relatedServices: ["carpet-cleaning", "window-cleaning", "organizing", "junk-removal"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "pool-service",
    title: "Pool Service",
    category: "home_services",
    subcategory: "outdoor",
    layout: 1,
    icon: "Waves",
    iconColor: "cyan",
    metaTitle: "Pool Service in Navarro County, TX | Pool Cleaning & Repair Corsicana",
    metaDescription: "Swimming pool services in Corsicana and Navarro County. Pool cleaning, maintenance, repair, equipment service, and opening/closing for Texas pools.",
    metaKeywords: "pool service Corsicana, pool cleaning Navarro County, pool maintenance, pool repair, pool opening, pool closing",
    heroContent: `A backyard pool provides refreshing relief from Texas heat, but it requires consistent maintenance to stay clean, safe, and functional. Navarro County pool services handle the chemistry, cleaning, and equipment maintenance so you can simply enjoy your pool.`,
    localContext: `With our long swimming season (often April through October), Navarro County pools see heavy use. The hot climate increases evaporation and chemical demand, while afternoon thunderstorms can throw off water balance. Local pool professionals understand these regional factors and adjust maintenance schedules and chemical treatments accordingly.`,
    sections: [
      {
        type: "services",
        heading: "Pool Services Available",
        content: \`**Regular Maintenance**
- Weekly cleaning and skimming
- Chemical balancing
- Filter cleaning
- Brush walls and floor
- Empty skimmer baskets
- Check equipment operation

**Equipment Service**
- Pump repair and replacement
- Filter repair and replacement
- Heater service
- Salt cell maintenance
- Automation systems
- Leak detection

**Seasonal Services**
- Pool opening (spring)
- Pool closing (fall)
- Winterization
- Green-to-clean service
- Algae treatment

**Additional Services**
- Tile and surface cleaning
- Acid washing
- Pool resurfacing (referral)
- Equipment upgrades
- Energy efficiency improvements\`
      }
    ],
    faqs: [
      {
        question: "How much does pool service cost in Navarro County?",
        answer: "Weekly pool maintenance typically costs $125-$200 per month for standard residential pools. Chemical-only service runs $80-$120 monthly. One-time cleanings cost $150-$300. Equipment repairs vary widely—pump replacement runs $400-$800 including labor. Pool opening/closing service is $200-$400 each."
      },
      {
        question: "How often does my pool need professional service?",
        answer: "Weekly service is recommended for most pools to maintain proper chemistry and cleanliness. During peak summer, twice-weekly service may be beneficial for heavy-use pools. Some homeowners opt for bi-weekly service while handling skimming themselves between visits. Consistent service prevents problems that cost more to fix later."
      },
      {
        question: "Can I maintain my own pool?",
        answer: "Yes, with knowledge and commitment. You'll need a test kit, chemicals, skimmer, brush, and vacuum. Plan on 2-4 hours weekly during swimming season. The learning curve can be steep—water chemistry affects both swimmer comfort and equipment longevity. Many homeowners start with professional service to learn, then transition to DIY."
      }
    ],
    relatedServices: ["hot-tub-service", "landscaping", "outdoor-lighting", "deck-builder"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // MORE PROFESSIONAL SERVICES
  // ============================================
  {
    slug: "insurance-agent",
    title: "Insurance Agent",
    category: "professional_services",
    subcategory: "financial",
    layout: 2,
    icon: "Shield",
    iconColor: "blue",
    metaTitle: "Insurance Agent in Navarro County, TX | Insurance Services Corsicana",
    metaDescription: "Insurance agents in Corsicana and Navarro County. Home, auto, life, health, business, and farm insurance from local independent and captive agents.",
    metaKeywords: "insurance agent Corsicana, insurance Navarro County, home insurance, auto insurance, life insurance, farm insurance",
    heroContent: `Insurance protects what matters most—your family, home, vehicles, and livelihood. Navarro County insurance agents help you navigate complex coverage options and find policies that fit your needs and budget, from basic auto coverage to comprehensive farm and ranch insurance.`,
    localContext: `Insurance needs in Navarro County include considerations specific to our area: hail and wind coverage for our storm-prone region, flood insurance for properties near creeks and the reservoir, and farm/ranch coverage for agricultural operations. Local agents understand these regional factors and can recommend appropriate coverage levels and deductible structures.`,
    sections: [
      {
        type: "services",
        heading: "Insurance Products Available",
        content: \`**Personal Insurance**
- Auto insurance
- Homeowners insurance
- Renters insurance
- Umbrella/excess liability
- Motorcycle, boat, RV insurance
- Valuable items coverage

**Life & Health**
- Term life insurance
- Whole life insurance
- Health insurance
- Medicare supplements
- Disability insurance
- Long-term care insurance

**Commercial Insurance**
- Business owners policy (BOP)
- General liability
- Commercial property
- Workers' compensation
- Professional liability
- Commercial auto

**Farm & Ranch**
- Farm property coverage
- Livestock insurance
- Equipment coverage
- Crop insurance
- Farm liability
- Agribusiness coverage\`
      }
    ],
    faqs: [
      {
        question: "Should I use an independent agent or go direct to an insurance company?",
        answer: "Independent agents represent multiple companies and can compare options for you. Captive agents (State Farm, Allstate, etc.) represent one company and know their products deeply. Direct companies (GEICO, Progressive online) may offer lower rates but less personal service. For complex needs (farms, businesses, multiple policies), independent agents often provide the most value."
      },
      {
        question: "How often should I review my insurance?",
        answer: "Review policies annually or when major life changes occur: buying a home, marriage, having children, starting a business, major purchases, or reaching retirement. Premium increases are also good times to shop around. Local agents can do periodic reviews to ensure coverage keeps pace with your needs."
      },
      {
        question: "Do I need flood insurance in Navarro County?",
        answer: "Standard homeowners insurance does NOT cover flood damage. If you're in a FEMA-designated flood zone, your mortgage lender will require flood insurance. Even outside designated zones, flooding can occur—over 25% of flood claims come from low-risk areas. Navarro County properties near creeks, Richland Chambers, or low-lying areas should consider flood coverage."
      }
    ],
    relatedServices: ["financial-advisor", "accountant", "realtor", "mortgage-lender"],
    externalResources: [
      { name: "Texas Department of Insurance", url: "https://www.tdi.texas.gov/" },
      { name: "FEMA Flood Map Service", url: "https://msc.fema.gov/portal/home" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "home-inspector",
    title: "Home Inspector",
    category: "professional_services",
    subcategory: "real_estate",
    layout: 3,
    icon: "Search",
    iconColor: "amber",
    metaTitle: "Home Inspector in Navarro County, TX | Property Inspection Corsicana",
    metaDescription: "Licensed home inspectors in Corsicana and Navarro County. Pre-purchase inspections, seller inspections, and property assessments for real estate transactions.",
    metaKeywords: "home inspector Corsicana, home inspection Navarro County, property inspection, buyer inspection, house inspection",
    heroContent: `A professional home inspection reveals the true condition of a property—essential information for one of the largest purchases you'll ever make. Navarro County home inspectors examine houses from foundation to roof, identifying issues that could cost thousands to repair.`,
    localContext: `Home inspections in Navarro County must address our specific regional concerns: foundation issues related to expansive clay soils, older homes with potential electrical and plumbing updates needed, and roofs that have weathered Texas storms. Local inspectors know what to look for in both historic Corsicana homes and newer construction throughout the county.`,
    sections: [
      {
        type: "services",
        heading: "Home Inspection Services",
        content: \`**Standard Inspection**
- Foundation and structure
- Roof and attic
- Electrical systems
- Plumbing systems
- HVAC systems
- Interior components
- Exterior components
- Grounds and drainage

**Additional Inspections**
- Termite/WDI inspection (usually separate)
- Pool inspection
- Septic inspection
- Well water testing
- Mold testing
- Radon testing
- Sewer scope inspection

**Specialized Inspections**
- Pre-listing seller inspections
- New construction inspections
- 11-month warranty inspections
- Commercial property inspections
- Investment property inspections\`
      }
    ],
    faqs: [
      {
        question: "How much does a home inspection cost in Navarro County?",
        answer: "Standard home inspections in Navarro County typically cost $300-$500 depending on home size and age. Larger homes (over 3,000 sq ft) and older homes cost more. Add-on inspections like termite ($75-$100), pool ($100-$150), or septic ($300-$500) are additional. Don't skip the inspection to save money—the information is invaluable."
      },
      {
        question: "Should I attend the home inspection?",
        answer: "Yes, absolutely attend if possible. Walking through with the inspector helps you understand the home's systems, learn maintenance needs, and ask questions. A good inspector will explain findings and answer questions. Plan for 2-4 hours depending on home size. The written report provides details, but being there provides context."
      },
      {
        question: "What can cause a home to fail inspection?",
        answer: "Home inspections don't pass or fail—they report conditions. However, major issues like foundation problems, roof damage, electrical safety concerns, plumbing failures, or HVAC problems may affect your purchase decision or negotiations. Inspectors report what they find; you decide what matters for your situation."
      }
    ],
    relatedServices: ["realtor", "foundation-repair", "termite-control", "structural-engineer"],
    externalResources: [
      { name: "Texas Real Estate Commission - Home Inspectors", url: "https://www.trec.texas.gov/programs/inspector" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "notary",
    title: "Notary Public",
    category: "professional_services",
    subcategory: "business",
    layout: 4,
    icon: "Stamp",
    iconColor: "indigo",
    metaTitle: "Notary Public in Navarro County, TX | Notary Services Corsicana",
    metaDescription: "Notary services in Corsicana and Navarro County. Document notarization, mobile notary, real estate closings, and legal document authentication.",
    metaKeywords: "notary Corsicana, notary public Navarro County, mobile notary, document notarization, signing agent",
    heroContent: `Notary services provide essential authentication for legal documents, real estate transactions, and official paperwork. Navarro County notaries help residents and businesses complete important documents with proper witnessing and official seals.`,
    localContext: `Notary services are needed throughout Navarro County for real estate closings, loan documents, powers of attorney, vehicle titles, and countless other transactions. Mobile notary services are particularly valuable in rural areas where traveling to an office isn't convenient. Many local businesses, banks, and professional offices offer notary services, while dedicated mobile notaries bring the service to you.`,
    sections: [
      {
        type: "services",
        heading: "Notary Services Available",
        content: \`**Document Types**
- Real estate documents
- Loan and mortgage papers
- Powers of attorney
- Wills and trusts
- Vehicle title transfers
- Affidavits
- Medical directives
- Business documents

**Service Options**
- In-office notarization
- Mobile notary (they come to you)
- After-hours appointments
- Same-day service
- Loan signing agent services

**Additional Services**
- Witness services
- Document preparation (some notaries)
- Apostille services (referral)
- Translation services (some notaries)\`
      }
    ],
    faqs: [
      {
        question: "How much does notary service cost in Navarro County?",
        answer: "Texas caps notary fees at $6 per signature or $0.50 per page for certified copies. However, mobile notary services charge travel fees, typically $25-$75+ depending on distance and time. Loan signing agents (who handle complete mortgage closings) charge $75-$150+ per signing. Many banks and businesses offer free or low-cost notary services for customers."
      },
      {
        question: "What do I need to bring for notarization?",
        answer: "Bring valid government-issued photo ID (driver's license, passport, or state ID). The document being notarized (don't sign it beforehand—you sign in front of the notary). If the document requires additional signers, they must be present with their IDs. Some documents have specific requirements—check in advance."
      },
      {
        question: "Where can I find a notary in Navarro County?",
        answer: "Banks and credit unions often provide notary service for account holders. UPS stores and shipping centers offer notary services. Many attorneys, CPAs, and real estate offices have notaries on staff. Mobile notaries advertise locally and online. The Texas Secretary of State website has a notary locator."
      }
    ],
    relatedServices: ["attorney", "title-company", "mortgage-lender", "process-server"],
    externalResources: [
      { name: "Texas Secretary of State - Notary", url: "https://www.sos.state.tx.us/statdoc/notary.shtml" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "locksmith",
    title: "Locksmith",
    category: "professional_services",
    subcategory: "business",
    layout: 5,
    icon: "Key",
    iconColor: "amber",
    metaTitle: "Locksmith in Navarro County, TX | Lock Service Corsicana",
    metaDescription: "Professional locksmith services in Corsicana and Navarro County. Emergency lockout, lock repair, key replacement, and security upgrades for home and auto.",
    metaKeywords: "locksmith Corsicana, locksmith Navarro County, lockout service, key replacement, lock repair, car lockout",
    heroContent: `Locked out of your home or car? Need new locks for security? Navarro County locksmiths provide essential services for homes, businesses, and vehicles—from emergency lockouts to comprehensive security upgrades.`,
    localContext: `Whether you're locked out of your vehicle at the Corsicana Walmart or need to rekey locks after moving into a new home, local locksmiths serve all of Navarro County. Response times are typically faster than calling services from Dallas, and local locksmiths are familiar with the variety of lock types found in everything from historic downtown buildings to modern subdivisions.`,
    sections: [
      {
        type: "services",
        heading: "Locksmith Services",
        content: \`**Emergency Services**
- Home lockout
- Car lockout
- Business lockout
- Broken key extraction
- Lock repair
- 24/7 availability (many locksmiths)

**Residential Services**
- Lock installation
- Lock rekeying
- Deadbolt installation
- High-security lock upgrades
- Key duplication
- Safe services
- Smart lock installation

**Automotive Services**
- Car key replacement
- Transponder key programming
- Key fob replacement
- Ignition repair
- Car lock repair

**Commercial Services**
- Commercial lock installation
- Master key systems
- Access control systems
- High-security locks
- Panic bar installation
- Lock maintenance\`
      }
    ],
    faqs: [
      {
        question: "How much does a locksmith cost in Navarro County?",
        answer: "Service calls typically run $50-$100 plus labor and parts. Home lockouts average $75-$150. Car lockouts run $75-$200 depending on vehicle and key type. Rekeying locks costs $15-$25 per lock plus service call. New car keys range from $50 for basic keys to $200-$400 for transponder/key fob replacement. Prices are often higher for after-hours emergency service."
      },
      {
        question: "How do I know if a locksmith is legitimate?",
        answer: "Ask for a quote before they arrive and confirm it when they arrive. Legitimate locksmiths arrive in marked vehicles, show ID, and accept multiple payment methods. Be wary of extremely low phone quotes followed by much higher on-site prices. Check online reviews. Texas doesn't license locksmiths, so reputation matters."
      },
      {
        question: "Should I rekey or replace locks when moving?",
        answer: "You don't know who has keys to your new home—previous owners, their friends, contractors, cleaners. Rekeying (changing the lock mechanism so old keys don't work) costs less than replacement and is sufficient for functional locks. Replace locks that are damaged, outdated, or you want to upgrade to higher security."
      }
    ],
    relatedServices: ["home-security", "garage-door", "auto-repair", "handyman"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // MORE AUTOMOTIVE
  // ============================================
  {
    slug: "tire-shop",
    title: "Tire Shop",
    category: "automotive",
    subcategory: "tires",
    layout: 1,
    icon: "Circle",
    iconColor: "slate",
    metaTitle: "Tire Shop in Navarro County, TX | Tire Sales & Service Corsicana",
    metaDescription: "Tire shops in Corsicana and Navarro County. New tires, used tires, tire repair, mounting, balancing, rotation, and alignment services.",
    metaKeywords: "tire shop Corsicana, tires Navarro County, tire repair, tire rotation, wheel alignment, flat repair",
    heroContent: `Your tires are the only part of your vehicle that touches the road—they're essential for safety, handling, and fuel efficiency. Navarro County tire shops offer everything from budget-friendly options to premium performance tires, with professional installation and service.`,
    localContext: `Texas roads and Navarro County's mix of highways and rural routes demand quality tires. Hot summer pavement accelerates tire wear, while debris on country roads causes frequent punctures. Local tire shops stock sizes and types suited to the trucks, SUVs, and work vehicles common in our area, and they understand the tire needs of both daily commuters and agricultural operations.`,
    sections: [
      {
        type: "services",
        heading: "Tire Services Available",
        content: \`**Tire Sales**
- New tires (all brands and price points)
- Used tires
- Truck and SUV tires
- Trailer tires
- ATV and off-road tires
- Commercial truck tires

**Tire Services**
- Mounting and balancing
- Tire rotation
- Flat repair
- TPMS service
- Tire inspection
- Tire disposal

**Related Services**
- Wheel alignment
- Brake inspection
- Suspension check
- Oil changes (some shops)\`
      }
    ],
    faqs: [
      {
        question: "How much do new tires cost?",
        answer: "Tire prices vary widely by size, brand, and type. Budget tires start around $60-$80 each. Mid-range tires run $100-$150. Premium brands cost $150-$250+. Most Navarro County shops offer packages including mounting, balancing, and disposal, typically adding $60-$100 to the total. Don't forget alignment ($80-$120) when installing new tires."
      },
      {
        question: "How often should tires be rotated?",
        answer: "Most manufacturers recommend tire rotation every 5,000-7,500 miles—typically every other oil change. Regular rotation extends tire life by ensuring even wear. Many tire shops offer free rotation when you purchase tires from them. Front-wheel drive vehicles especially benefit from regular rotation."
      },
      {
        question: "Can a tire be repaired or does it need replacement?",
        answer: "Punctures in the tread area (not the sidewall) smaller than 1/4 inch can usually be repaired safely using a plug-patch combination. Sidewall damage, large punctures, and run-flat damage typically require replacement. Repairs should be done from inside the tire—plug-only repairs are temporary at best. A proper repair costs $20-$40."
      }
    ],
    relatedServices: ["wheel-alignment", "auto-repair", "brake-repair", "oil-change"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "auto-body",
    title: "Auto Body Shop",
    category: "automotive",
    subcategory: "body",
    layout: 2,
    icon: "Car",
    iconColor: "red",
    metaTitle: "Auto Body Shop in Navarro County, TX | Collision Repair Corsicana",
    metaDescription: "Auto body shops in Corsicana and Navarro County. Collision repair, dent removal, auto painting, and insurance claim repairs for all vehicles.",
    metaKeywords: "auto body Corsicana, collision repair Navarro County, auto painting, dent repair, body shop, insurance repair",
    heroContent: `Accidents happen, and when they do, you need an auto body shop you can trust to restore your vehicle properly. Navarro County body shops handle everything from minor dents to major collision repair, working with all insurance companies to get you back on the road.`,
    localContext: `With I-45 running through Navarro County and deer frequently crossing rural roads, collision repair is an ongoing need. Hail damage from spring storms keeps body shops busy seasonally. Local shops have experience with insurance claims from Texas insurers and maintain relationships that help smooth the repair process.`,
    sections: [
      {
        type: "services",
        heading: "Auto Body Services",
        content: \`**Collision Repair**
- Frame straightening
- Structural repair
- Panel replacement
- Bumper repair and replacement
- Airbag replacement coordination
- Complete collision restoration

**Paint Services**
- Full vehicle painting
- Spot painting
- Color matching
- Clear coat restoration
- Custom paint work

**Dent Repair**
- Paintless dent repair (PDR)
- Conventional dent repair
- Hail damage repair
- Door ding removal

**Additional Services**
- Auto glass replacement
- Insurance claim assistance
- Rental car coordination
- Detailing after repairs\`
      }
    ],
    faqs: [
      {
        question: "How long does collision repair take?",
        answer: "Repair time depends on damage severity. Minor dent repairs may take 1-3 days. Moderate damage requiring panel replacement and painting typically takes 1-2 weeks. Major collision repair with frame work can take 3-4 weeks or more. Parts availability affects timeline—some parts require ordering. Your shop should provide an estimated completion date."
      },
      {
        question: "Can I choose my own body shop for insurance repairs?",
        answer: "Yes, Texas law allows you to choose any licensed body shop for insurance repairs. While insurers may recommend preferred shops, you're not required to use them. However, preferred shops may offer benefits like guaranteed repairs and streamlined claims. Research any shop before committing."
      },
      {
        question: "Should I get multiple estimates for body work?",
        answer: "For insurance claims, your insurer typically sends an adjuster or uses a preferred shop for the initial estimate. You can get supplemental estimates if you disagree. For out-of-pocket repairs, getting 2-3 estimates helps ensure fair pricing. Be wary of estimates significantly lower than others—quality shops use quality parts and proper repair procedures."
      }
    ],
    relatedServices: ["auto-paint", "windshield-repair", "dent-repair", "auto-detailing", "auto-repair"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "oil-change",
    title: "Oil Change Service",
    category: "automotive",
    subcategory: "repair",
    layout: 3,
    icon: "Droplet",
    iconColor: "amber",
    metaTitle: "Oil Change in Navarro County, TX | Quick Lube Service Corsicana",
    metaDescription: "Oil change services in Corsicana and Navarro County. Quick oil changes, synthetic oil, filter replacement, and fluid services at convenient locations.",
    metaKeywords: "oil change Corsicana, quick lube Navarro County, synthetic oil, oil filter, fluid service",
    heroContent: `Regular oil changes are the most important maintenance for your engine's longevity. Navarro County oil change services offer quick, convenient service to keep your vehicle running smoothly—often while you wait.`,
    localContext: `Texas heat is hard on motor oil. High operating temperatures in summer break down oil faster, making regular changes even more important. Dusty rural roads also put extra load on oil filters. Local quick lube shops and service stations understand these conditions and can recommend appropriate change intervals and oil types for Navarro County driving.`,
    sections: [
      {
        type: "services",
        heading: "Oil Change Services",
        content: \`**Oil Change Options**
- Conventional oil change
- High-mileage oil
- Synthetic blend
- Full synthetic oil
- Diesel oil change

**Included Services**
- Oil filter replacement
- Fluid level checks
- Tire pressure check
- Visual inspection
- Windshield wash top-off

**Additional Services**
- Transmission fluid service
- Coolant flush
- Power steering flush
- Brake fluid service
- Air filter replacement
- Cabin filter replacement\`
      }
    ],
    faqs: [
      {
        question: "How much does an oil change cost in Navarro County?",
        answer: "Conventional oil changes typically run $30-$45. Synthetic blend costs $45-$60. Full synthetic oil changes run $60-$90. Diesel trucks cost more due to larger capacity. Prices include oil and filter. Quick lubes often run specials—check for coupons. Dealers and specialty shops may charge more but often include more thorough inspections."
      },
      {
        question: "How often should I change my oil?",
        answer: "Modern vehicles with synthetic oil can often go 7,500-10,000 miles between changes—check your owner's manual. Conventional oil typically needs changing every 3,000-5,000 miles. Severe driving conditions (towing, extreme heat, dusty roads—common in Navarro County) may warrant more frequent changes. When in doubt, more frequent changes won't hurt."
      },
      {
        question: "Is synthetic oil worth the extra cost?",
        answer: "For most modern vehicles, yes. Synthetic oil performs better in extreme temperatures, resists breakdown longer, and can extend change intervals. It's required for many newer vehicles. The longer intervals often offset the higher per-quart cost. For older vehicles with conventional oil, continuing with conventional is usually fine."
      }
    ],
    relatedServices: ["auto-repair", "tire-shop", "transmission", "brake-repair"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // FOOD & BEVERAGE
  // ============================================
  {
    slug: "catering",
    title: "Catering",
    category: "food_beverage",
    subcategory: "catering",
    layout: 4,
    icon: "Utensils",
    iconColor: "orange",
    metaTitle: "Catering in Navarro County, TX | Event Catering Services Corsicana",
    metaDescription: "Catering services in Corsicana and Navarro County. Wedding catering, corporate events, parties, BBQ catering, and full-service event food service.",
    metaKeywords: "catering Corsicana, catering Navarro County, wedding catering, BBQ catering, event food, party catering",
    heroContent: `Great food brings people together, and professional catering makes your event memorable while letting you enjoy it. Navarro County caterers serve everything from intimate dinner parties to large weddings, with menus ranging from Texas BBQ to elegant plated dinners.`,
    localContext: `Navarro County events often feature Texas-style hospitality and food. Local caterers specialize in the BBQ, Tex-Mex, and Southern comfort food that Central Texans love, while also offering diverse menu options for various tastes and dietary needs. Many caterers work regularly with local venues and event coordinators, streamlining the planning process.`,
    sections: [
      {
        type: "services",
        heading: "Catering Services Available",
        content: \`**Event Types**
- Wedding receptions
- Corporate events and meetings
- Holiday parties
- Graduation celebrations
- Family reunions
- Church and community events
- Funeral/memorial receptions
- Private dinner parties

**Service Styles**
- Buffet service
- Plated/seated dinners
- Family-style service
- Food stations
- Cocktail/appetizer service
- Box lunches
- Drop-off/pickup

**Cuisine Options**
- Texas BBQ
- Tex-Mex
- Southern/comfort food
- Italian
- American classics
- Vegetarian/vegan options
- Custom menus

**Additional Services**
- Bar service/bartenders
- Serving staff
- Table/chair/linen rental coordination
- Event planning assistance\`
      }
    ],
    faqs: [
      {
        question: "How much does catering cost in Navarro County?",
        answer: "Catering costs vary widely based on menu and service level. Budget catering (BBQ buffet, minimal service) starts around $15-$25 per person. Mid-range options with diverse menu and some service run $25-$45 per person. Full-service catering with premium menu, wait staff, and bar service costs $50-$100+ per person. Get detailed quotes for your specific needs."
      },
      {
        question: "How far in advance should I book a caterer?",
        answer: "For weddings and large events, book 6-12 months in advance to secure your preferred caterer and date. Corporate events and moderate-sized parties should book 4-8 weeks ahead. Last-minute catering is sometimes possible for smaller events, but menu options may be limited. Earlier booking allows more menu customization."
      },
      {
        question: "Do caterers provide equipment and serving staff?",
        answer: "Full-service caterers typically provide chafing dishes, serving utensils, and serving staff. Some include table linens, plates, and flatware; others coordinate rentals. Drop-off or pickup catering usually includes only food and basic serving containers. Clarify exactly what's included in your quote—hidden equipment or staffing costs can add up."
      }
    ],
    relatedServices: ["bbq-catering", "wedding-venue", "event-planner", "bartender"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "bakery",
    title: "Bakery",
    category: "food_beverage",
    subcategory: "retail",
    layout: 5,
    icon: "Cake",
    iconColor: "rose",
    metaTitle: "Bakery in Navarro County, TX | Fresh Baked Goods Corsicana",
    metaDescription: "Bakeries in Corsicana and Navarro County. Fresh bread, pastries, custom cakes, wedding cakes, cookies, and specialty baked goods.",
    metaKeywords: "bakery Corsicana, bakery Navarro County, custom cake, wedding cake, pastries, fresh bread, cookies",
    heroContent: `The aroma of fresh-baked bread and pastries is irresistible. Navarro County bakeries offer everything from daily bread and breakfast pastries to elaborate wedding cakes and custom creations for special occasions.`,
    localContext: `Corsicana has a sweet history—it was once home to the Collin Street Bakery's famous DeLuxe Fruitcake, known worldwide. Local bakeries continue the tradition of quality baking, serving the community with fresh goods and custom creations. From kolaches reflecting our Czech heritage to elaborate quinceañera cakes, local bakeries understand Navarro County tastes.`,
    sections: [
      {
        type: "services",
        heading: "Bakery Products and Services",
        content: \`**Daily Baked Goods**
- Fresh bread and rolls
- Pastries and danishes
- Kolaches and breakfast items
- Cookies and brownies
- Muffins and scones
- Cinnamon rolls

**Custom Cakes**
- Birthday cakes
- Wedding cakes
- Graduation cakes
- Anniversary cakes
- Quinceañera cakes
- Groom's cakes
- Baby shower cakes

**Specialty Items**
- Pies
- Cupcakes
- Cake pops
- Decorated cookies
- Cheesecakes
- Seasonal specials

**Services**
- Custom orders
- Cake tastings (for large orders)
- Delivery (many bakeries)
- Setup services for events\`
      }
    ],
    faqs: [
      {
        question: "How far in advance should I order a custom cake?",
        answer: "For wedding cakes, order 3-6 months ahead. Elaborate custom cakes for large events need 2-4 weeks notice. Standard birthday or celebration cakes typically need 1-2 weeks, though some bakeries can accommodate shorter timelines. During busy seasons (graduation, wedding season), order earlier. Always confirm lead times with your bakery."
      },
      {
        question: "How much do custom cakes cost?",
        answer: "Simple decorated cakes start around $3-$5 per serving. Custom design cakes run $4-$8 per serving. Wedding cakes typically cost $4-$12 per serving depending on complexity. Pricing is usually based on serving count and design difficulty. Fondant, multiple tiers, and intricate decorations add cost. Get quotes based on your specific design."
      },
      {
        question: "Do bakeries offer gluten-free or specialty diet options?",
        answer: "Many Navarro County bakeries now offer gluten-free, sugar-free, or vegan options, though availability varies. Some specialize in dietary restriction baking; others offer limited options. Call ahead to discuss your needs—specialty items often require advance ordering and may cost more due to ingredient costs and separate preparation requirements."
      }
    ],
    relatedServices: ["specialty-cakes", "wedding-cake", "catering", "coffee-shop"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // MORE HEALTH & WELLNESS
  // ============================================
  {
    slug: "massage-therapist",
    title: "Massage Therapist",
    category: "health_wellness",
    subcategory: "specialist",
    layout: 1,
    icon: "Hand",
    iconColor: "purple",
    metaTitle: "Massage Therapist in Navarro County, TX | Massage Therapy Corsicana",
    metaDescription: "Licensed massage therapists in Corsicana and Navarro County. Therapeutic massage, deep tissue, relaxation massage, sports massage, and pain relief.",
    metaKeywords: "massage therapist Corsicana, massage Navarro County, deep tissue massage, therapeutic massage, sports massage",
    heroContent: `Massage therapy offers both relaxation and therapeutic benefits—reducing stress, relieving muscle tension, improving circulation, and managing chronic pain. Navarro County's licensed massage therapists provide professional care for wellness, pain management, and injury recovery.`,
    localContext: `Many Navarro County residents work in physically demanding jobs or commute long distances, leading to muscle tension and stress that massage therapy can address. Local therapists work in various settings—spas, chiropractic offices, physical therapy clinics, and independent practices—offering diverse options for different needs and preferences.`,
    sections: [
      {
        type: "services",
        heading: "Massage Services Available",
        content: \`**Massage Types**
- Swedish/relaxation massage
- Deep tissue massage
- Sports massage
- Therapeutic massage
- Hot stone massage
- Prenatal massage
- Trigger point therapy
- Myofascial release

**Specialized Services**
- Pain management
- Injury recovery
- Stress relief
- Headache/migraine relief
- TMJ therapy
- Lymphatic drainage

**Settings**
- Day spas
- Wellness centers
- Chiropractic offices
- Physical therapy clinics
- Independent practitioners
- Mobile/in-home services\`
      }
    ],
    faqs: [
      {
        question: "How much does massage therapy cost in Navarro County?",
        answer: "Massage rates typically run $60-$90 for a 60-minute session. 90-minute sessions cost $90-$130. Spa settings may charge more; independent therapists or chiropractic offices may charge less. Some therapists offer package discounts for multiple sessions. Insurance rarely covers massage unless it's part of a prescribed treatment plan."
      },
      {
        question: "How often should I get a massage?",
        answer: "For general wellness and stress management, monthly sessions work well for many people. For chronic pain or specific conditions, more frequent sessions (weekly or bi-weekly) during initial treatment may be recommended, then reduced as improvement occurs. Listen to your body and your therapist's recommendations for your situation."
      },
      {
        question: "Is massage therapy covered by insurance?",
        answer: "Most health insurance doesn't cover massage therapy unless it's prescribed as part of treatment for a specific medical condition. Some auto insurance policies cover massage after accidents. HSA and FSA accounts often can be used for massage therapy with a prescription. Check your specific plan—coverage varies significantly."
      }
    ],
    relatedServices: ["chiropractor", "physical-therapist", "spa", "acupuncture"],
    externalResources: [
      { name: "Texas Department of Licensing - Massage Therapy", url: "https://www.tdlr.texas.gov/mas/mas.htm" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "personal-trainer",
    title: "Personal Trainer",
    category: "health_wellness",
    subcategory: "fitness",
    layout: 2,
    icon: "Dumbbell",
    iconColor: "green",
    metaTitle: "Personal Trainer in Navarro County, TX | Fitness Training Corsicana",
    metaDescription: "Personal trainers in Corsicana and Navarro County. One-on-one fitness training, weight loss programs, strength training, and fitness coaching.",
    metaKeywords: "personal trainer Corsicana, fitness trainer Navarro County, weight loss, strength training, fitness coaching",
    heroContent: `Whether you're starting your fitness journey, training for a specific goal, or breaking through a plateau, a personal trainer provides the expertise, motivation, and accountability to help you succeed. Navarro County personal trainers work with clients of all fitness levels.`,
    localContext: `Navarro County offers various fitness options, from traditional gyms to CrossFit-style training facilities. Personal trainers work in gym settings, private studios, and even outdoors taking advantage of our good weather. Many local trainers specialize in the needs of busy working adults, helping them fit effective workouts into demanding schedules.`,
    sections: [
      {
        type: "services",
        heading: "Personal Training Services",
        content: \`**Training Types**
- One-on-one personal training
- Small group training
- Online/virtual coaching
- In-home training
- Sport-specific training

**Focus Areas**
- Weight loss
- Muscle building/strength
- General fitness
- Athletic performance
- Senior fitness
- Post-rehabilitation
- Prenatal/postnatal fitness

**Services Included**
- Fitness assessment
- Custom program design
- Exercise instruction
- Progress tracking
- Nutritional guidance (basic)
- Motivation and accountability\`
      }
    ],
    faqs: [
      {
        question: "How much does a personal trainer cost in Navarro County?",
        answer: "Personal training in Navarro County typically costs $40-$75 per session, depending on trainer qualifications, session length, and location. Package rates reduce per-session cost—buying 10+ sessions might drop rates 10-20%. Small group training costs less per person. Premium trainers and specialized services may charge more."
      },
      {
        question: "How often should I train with a personal trainer?",
        answer: "For beginners, 2-3 sessions per week helps establish proper form and routine. As you progress, 1-2 weekly sessions maintain accountability while you train independently on other days. Some clients meet monthly for program updates. Your budget, goals, and self-motivation level determine the ideal frequency."
      },
      {
        question: "What qualifications should a personal trainer have?",
        answer: "Look for nationally recognized certifications (ACE, NASM, ACSM, NSCA are the most respected). CPR/AED certification is essential. Specialized certifications matter for specific needs (senior fitness, corrective exercise, etc.). College degrees in exercise science or related fields are a plus. Experience working with clients similar to you is valuable."
      }
    ],
    relatedServices: ["gym", "nutritionist", "yoga-instructor", "weight-loss-clinic"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // MORE CONSTRUCTION & TRADES
  // ============================================
  {
    slug: "welder",
    title: "Welding Service",
    category: "construction_trades",
    subcategory: "metal",
    layout: 3,
    icon: "Flame",
    iconColor: "orange",
    metaTitle: "Welding Service in Navarro County, TX | Metal Fabrication Corsicana",
    metaDescription: "Welding services in Corsicana and Navarro County. Custom fabrication, repair welding, agricultural equipment, gates, fences, and metal work.",
    metaKeywords: "welding Corsicana, welder Navarro County, metal fabrication, custom welding, pipe welding, repair welding",
    heroContent: `From repairing farm equipment to fabricating custom gates to structural steel work, professional welding serves countless needs in Navarro County. Local welders provide both mobile service for on-site repairs and shop facilities for fabrication projects.`,
    localContext: `In agricultural Navarro County, welding is essential. Farm equipment breaks down, trailer frames crack, fences need gates, and livestock handling facilities require metal work. Local welders understand these needs and often provide mobile service that brings the welding shop to your location—crucial when equipment can't be easily transported.`,
    sections: [
      {
        type: "services",
        heading: "Welding Services Available",
        content: \`**Repair Welding**
- Farm equipment repair
- Trailer repair
- Machinery repair
- Structural repairs
- Cast iron repair
- Aluminum repair

**Fabrication**
- Custom gates and fences
- Livestock equipment
- Trailer building
- Structural steel
- Handrails and stairs
- Custom projects

**Welding Types**
- MIG welding
- TIG welding
- Stick/arc welding
- Flux core welding
- Aluminum welding
- Stainless steel welding

**Additional Services**
- Mobile welding service
- Portable welding
- Metal cutting
- Blueprint fabrication
- Design assistance\`
      }
    ],
    faqs: [
      {
        question: "How much does welding service cost?",
        answer: "Shop welding rates typically run $50-$100 per hour depending on the type of work. Mobile welding service adds travel charges—often $50-$100 trip fee plus hourly rates. Fabrication projects are usually quoted per job based on complexity and materials. Simple repairs might cost $75-$150; complex fabrication runs hundreds to thousands."
      },
      {
        question: "Can you weld aluminum or stainless steel?",
        answer: "Not all welders work with aluminum or stainless—these require specialized equipment and skills. TIG welding is typically used for these materials. Ask specifically about experience with your material type. Aluminum welding is common for boat and trailer repairs; stainless is used for food equipment and decorative work."
      },
      {
        question: "Do you offer mobile welding service?",
        answer: "Many Navarro County welders offer mobile service, bringing welding equipment to your location. This is essential for farm equipment repairs, fence work, and items too large to transport. Mobile rates include travel time and setup. For small items, bringing work to a shop is usually more economical."
      }
    ],
    relatedServices: ["fabrication", "trailer-repair", "ironwork", "fence-builder"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "pole-barn",
    title: "Pole Barn Builder",
    category: "construction_trades",
    subcategory: "specialty",
    layout: 4,
    icon: "Warehouse",
    iconColor: "amber",
    metaTitle: "Pole Barn Builder in Navarro County, TX | Pole Buildings Corsicana",
    metaDescription: "Pole barn construction in Corsicana and Navarro County. Agricultural buildings, workshops, garages, storage buildings, and riding arenas.",
    metaKeywords: "pole barn Corsicana, pole building Navarro County, agricultural building, workshop, metal building, storage building",
    heroContent: `Pole barns offer versatile, cost-effective building solutions for storage, workshops, livestock shelters, and more. Navarro County pole barn builders construct structures sized from small storage buildings to large agricultural facilities, customized to your needs.`,
    localContext: `Navarro County's agricultural heritage makes pole barns common sights across the landscape. They shelter equipment, house livestock, provide workshop space, and serve as everything from hay storage to event venues. Local builders understand the soil conditions and wind loads that affect construction in our area, and they navigate the permitting process for unincorporated county land.`,
    sections: [
      {
        type: "services",
        heading: "Pole Barn Construction Services",
        content: \`**Building Types**
- Equipment storage
- Hay barns
- Livestock shelters
- Workshops and garages
- Horse barns and riding arenas
- Commercial storage
- Hobby buildings

**Features Available**
- Various sizes and configurations
- Metal or wood exterior
- Overhead and walk doors
- Windows and skylights
- Concrete floor options
- Electricity rough-in
- Lean-tos and additions

**Customization**
- Building design assistance
- Custom dimensions
- Interior layouts
- Insulation options
- Color choices
- Ventilation options\`
      }
    ],
    faqs: [
      {
        question: "How much does a pole barn cost in Navarro County?",
        answer: "Basic pole barns start around $12-$18 per square foot for simple open structures. Enclosed buildings with doors run $18-$30 per square foot. A 30x40 foot basic barn might cost $15,000-$25,000. Concrete floors, electrical, and custom features add to the cost. Get detailed quotes based on your specific needs and site conditions."
      },
      {
        question: "Do I need a permit for a pole barn in Navarro County?",
        answer: "In unincorporated Navarro County, permit requirements for agricultural buildings are minimal or none, but verify with the county. Within city limits like Corsicana, permits and inspections are typically required. Septic proximity, setbacks from property lines, and utility connections may have requirements regardless of location."
      },
      {
        question: "How long does pole barn construction take?",
        answer: "A basic pole barn (no concrete or electrical) can be completed in 1-2 weeks. Buildings with concrete floors and electrical take 3-4 weeks. Complex projects or large structures may take 6-8 weeks. Weather delays and material availability affect timelines. Your builder should provide a realistic schedule."
      }
    ],
    relatedServices: ["barn-builder", "steel-building", "concrete", "general-contractor", "electrician"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // MORE AGRICULTURE & RURAL
  // ============================================
  {
    slug: "pet-groomer",
    title: "Pet Grooming",
    category: "agriculture_rural",
    subcategory: "animal",
    layout: 5,
    icon: "Scissors",
    iconColor: "pink",
    metaTitle: "Pet Grooming in Navarro County, TX | Dog Groomers Corsicana",
    metaDescription: "Pet grooming services in Corsicana and Navarro County. Dog grooming, bathing, haircuts, nail trimming, and full-service pet salon care.",
    metaKeywords: "pet grooming Corsicana, dog groomer Navarro County, pet bath, dog haircut, nail trimming, pet salon",
    heroContent: `Regular grooming keeps pets healthy, comfortable, and looking great. Navarro County pet groomers offer services from basic baths to breed-specific styling, helping dogs and cats look and feel their best.`,
    localContext: `Texas weather creates grooming challenges—burrs and grass seeds in summer, mud in spring, and dry winter skin. Rural Navarro County dogs often need more frequent bathing after outdoor adventures. Local groomers understand these regional factors and can recommend grooming schedules appropriate for your pet's lifestyle.`,
    sections: [
      {
        type: "services",
        heading: "Pet Grooming Services",
        content: \`**Basic Services**
- Bath and dry
- Brush out
- Nail trimming
- Ear cleaning
- Sanitary trim

**Full Grooming**
- Full haircut (breed-specific or custom)
- De-matting
- De-shedding treatment
- Teeth brushing
- Paw pad care

**Specialty Services**
- Puppy's first groom
- Senior pet care
- Medicated baths
- Flea treatment baths
- Hot spot treatment
- Creative styling

**Cat Grooming**
- Bath and brush
- Lion cut
- Mat removal
- Nail trim\`
      }
    ],
    faqs: [
      {
        question: "How much does pet grooming cost in Navarro County?",
        answer: "Grooming prices vary by pet size, coat type, and services. Small dog basic bath runs $25-$40. Full groom for small dogs costs $40-$65; medium dogs $50-$80; large dogs $65-$100+. Extra-large or heavily matted dogs cost more. Nail trim only is typically $10-$15. Prices are generally lower than metropolitan areas."
      },
      {
        question: "How often should my dog be groomed?",
        answer: "Dogs with continuously growing hair (poodles, shih tzus, etc.) need grooming every 4-6 weeks. Double-coated breeds benefit from professional de-shedding every 8-12 weeks. Short-coated breeds may only need occasional baths. Between full grooms, regular brushing at home maintains coat health. Your groomer can recommend a schedule."
      },
      {
        question: "How do I prepare my pet for grooming?",
        answer: "Walk your dog before the appointment so they're calmer. Don't feed a large meal right before. Inform the groomer of any skin conditions, sensitivities, or behavioral issues. If possible, get puppies accustomed to handling paws, ears, and tail. Consistency with the same groomer helps pets become comfortable with the process."
      }
    ],
    relatedServices: ["veterinarian", "pet-boarding", "pet-store", "dog-trainer"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "excavator",
    title: "Excavation Service",
    category: "agriculture_rural",
    subcategory: "land",
    layout: 1,
    icon: "Tractor",
    iconColor: "amber",
    metaTitle: "Excavation Service in Navarro County, TX | Dirt Work Corsicana",
    metaDescription: "Excavation services in Corsicana and Navarro County. Land clearing, dirt work, grading, drainage, pad preparation, and pond construction.",
    metaKeywords: "excavation Corsicana, dirt work Navarro County, land clearing, grading, drainage, pond construction",
    heroContent: `From building pads to drainage solutions to pond construction, excavation work shapes the land for your needs. Navarro County excavation contractors have the heavy equipment and expertise to handle projects large and small.`,
    localContext: `Navarro County's clay soils present both challenges and opportunities for excavation work. The material compacts well for building pads but requires proper drainage planning. Local excavation contractors understand how our soil behaves in wet and dry conditions, and they know where rock formations and water tables affect digging depth and cost.`,
    sections: [
      {
        type: "services",
        heading: "Excavation Services",
        content: \`**Site Preparation**
- Building pad preparation
- Driveway grading
- Lot clearing
- Topsoil stripping and stockpiling
- Rough grading
- Fine grading

**Drainage Work**
- French drains
- Swales and channels
- Culvert installation
- Erosion control
- Retention areas

**Water Features**
- Pond construction
- Pond expansion
- Stock tank pads
- Dam repair
- Pond cleanout

**Land Clearing**
- Brush removal
- Tree clearing
- Stump removal
- Root raking
- Debris removal

**Utilities**
- Septic excavation
- Water line trenching
- Utility installation support\`
      }
    ],
    faqs: [
      {
        question: "How much does excavation work cost?",
        answer: "Excavation is typically charged hourly or by the job. Equipment rates run $150-$300+ per hour depending on machine size. A small skid steer might be $150/hour; a large excavator $250-$350/hour. Hauling fill or spoils adds cost. Pond construction might run $3,000-$10,000+ depending on size. Get project-specific quotes."
      },
      {
        question: "Do I need permits for excavation work?",
        answer: "In unincorporated Navarro County, excavation generally doesn't require permits unless it involves septic systems or impacts waterways. Within city limits, grading permits may be required. Ponds affecting streams may require state permits. Septic excavation always requires coordination with approved installers. Verify requirements for your specific project."
      },
      {
        question: "How do soil conditions affect excavation in Navarro County?",
        answer: "Our Blackland Prairie clay soil is extremely dense and sticky when wet, making excavation difficult after rain. When dry, it can be hard as concrete. Experienced local operators know to work in appropriate conditions. Clay also doesn't drain well—excavation projects must include proper drainage solutions. Rock formations exist in some areas, adding complexity and cost."
      }
    ],
    relatedServices: ["land-clearing", "dirt-work", "pond-construction", "septic", "drainage"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "farrier",
    title: "Farrier",
    category: "agriculture_rural",
    subcategory: "animal",
    layout: 2,
    icon: "Hammer",
    iconColor: "gray",
    metaTitle: "Farrier in Navarro County, TX | Horse Hoof Care & Shoeing",
    metaDescription: "Farrier services in Corsicana and Navarro County. Horse shoeing, hoof trimming, corrective shoeing, and equine hoof care from certified farriers.",
    metaKeywords: "farrier Corsicana, farrier Navarro County, horse shoeing, hoof trimming, corrective shoeing, horseshoe",
    heroContent: `Proper hoof care is essential for horse health and soundness. Navarro County farriers provide the shoeing and trimming services that keep horses comfortable, whether they're working ranch horses, performance athletes, or beloved companions.`,
    localContext: `Navarro County's horse community includes working ranches, recreational riders, and competitive equestrians. Local farriers serve this diverse clientele, traveling to farms and stables throughout the county. Understanding the wear patterns from Central Texas terrain—from rocky areas to soft sandy spots—helps farriers recommend appropriate shoeing or trimming schedules.`,
    sections: [
      {
        type: "services",
        heading: "Farrier Services",
        content: \`**Basic Services**
- Hoof trimming (barefoot maintenance)
- Full shoe reset
- New shoe fitting
- Pull shoes and trim

**Specialty Shoeing**
- Corrective shoeing
- Therapeutic shoeing
- Performance shoeing
- Draft horse shoeing
- Gaited horse shoeing

**Hoof Health**
- Abscess treatment
- White line disease treatment
- Hoof crack repair
- Thrush treatment
- Consultation with veterinarian

**Materials**
- Steel shoes
- Aluminum shoes
- Specialty shoes
- Pads and packing
- Glue-on shoes\`
      }
    ],
    faqs: [
      {
        question: "How much does a farrier charge in Navarro County?",
        answer: "Basic trim for barefoot horses typically costs $35-$50. Full reset (remove shoes, trim, replace same shoes) runs $80-$120. New shoes cost $120-$180 for a full set of steel shoes. Specialty or corrective shoeing costs more. Many farriers charge trip fees for single-horse visits; multi-horse appointments reduce per-horse cost."
      },
      {
        question: "How often does my horse need farrier care?",
        answer: "Most horses need hoof attention every 6-8 weeks. Shod horses may need resets every 6 weeks as shoes wear and hooves grow. Barefoot horses can sometimes stretch to 8-10 weeks depending on wear and growth rate. Young, old, and horses with hoof issues may need more frequent visits."
      },
      {
        question: "Should my horse be shod or go barefoot?",
        answer: "Many horses can go barefoot successfully, especially those with good hoof quality and moderate use on varied terrain. Horses worked regularly on hard or rocky ground, performance horses, and those with hoof issues often benefit from shoes. A good farrier can assess your horse's individual needs and make recommendations based on their work and hoof health."
      }
    ],
    relatedServices: ["large-animal-vet", "horse-trainer", "feed-store", "pet-boarding"],
    externalResources: [
      { name: "American Farrier's Association", url: "https://www.americanfarriers.org/" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // MORE EVENTS & ENTERTAINMENT
  // ============================================
  {
    slug: "photographer",
    title: "Photographer",
    category: "events_entertainment",
    subcategory: "media",
    layout: 3,
    icon: "Camera",
    iconColor: "purple",
    metaTitle: "Photographer in Navarro County, TX | Photography Services Corsicana",
    metaDescription: "Professional photographers in Corsicana and Navarro County. Portrait photography, family photos, event photography, senior pictures, and commercial work.",
    metaKeywords: "photographer Corsicana, photography Navarro County, portrait photographer, family photos, senior pictures, event photographer",
    heroContent: `Professional photography captures life's moments—from family milestones to professional headshots to special events. Navarro County photographers offer diverse styles and services, helping you preserve memories and present your best image.`,
    localContext: `Navarro County offers beautiful backdrops for photography—from the historic downtown Corsicana courthouse square to rolling ranch landscapes to the shores of Richland Chambers Reservoir. Local photographers know the best locations, optimal lighting times, and how to work with our unpredictable Texas weather to create stunning images.`,
    sections: [
      {
        type: "services",
        heading: "Photography Services",
        content: \`**Portrait Photography**
- Family portraits
- Senior pictures
- Children and baby photos
- Professional headshots
- Engagement photos
- Maternity photos
- Pet photography

**Event Photography**
- Weddings
- Parties and celebrations
- Corporate events
- School events
- Sports photography

**Commercial Photography**
- Product photography
- Real estate photography
- Business marketing images
- Food photography
- Agricultural photography

**Additional Services**
- Photo restoration
- Canvas prints
- Photo albums
- Digital file delivery
- Social media packages\`
      }
    ],
    faqs: [
      {
        question: "How much does a photographer cost in Navarro County?",
        answer: "Mini sessions (15-30 minutes) start around $100-$200. Standard portrait sessions (1-2 hours with multiple outfits/locations) run $200-$500. Wedding photography typically costs $1,500-$4,000 for full-day coverage. Commercial photography varies widely based on usage rights and complexity. Prices generally include digital images; prints are often additional."
      },
      {
        question: "How do I choose a photographer?",
        answer: "Review portfolios to find a style you like—photography styles vary significantly. Meet or talk with potential photographers to assess personality fit. Ask about their process, turnaround time, and what's included. Check reviews and references. For events, ensure they have backup equipment and a contingency plan."
      },
      {
        question: "How should I prepare for a photo session?",
        answer: "Coordinate outfits (solid colors often work best; avoid busy patterns). Get haircuts and touch-ups a week before, not the day of. Bring outfit changes and props. Eat beforehand so you're not hungry. For family sessions, schedule around little ones' best moods. Communicate your vision and any must-have shots to your photographer."
      }
    ],
    relatedServices: ["videographer", "wedding-photographer", "drone-photography", "photo-booth"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "florist",
    title: "Florist",
    category: "events_entertainment",
    subcategory: "wedding",
    layout: 4,
    icon: "Flower2",
    iconColor: "rose",
    metaTitle: "Florist in Navarro County, TX | Flower Shop Corsicana",
    metaDescription: "Florists in Corsicana and Navarro County. Fresh flowers, wedding flowers, funeral arrangements, event florals, and flower delivery.",
    metaKeywords: "florist Corsicana, flowers Navarro County, wedding flowers, flower delivery, funeral flowers, bouquets",
    heroContent: `Flowers mark life's moments—celebrations, expressions of love, sympathy, and everyday beauty. Navarro County florists create arrangements for weddings, events, and all occasions, with delivery service throughout the area.`,
    localContext: `Corsicana has maintained local florist shops that serve the community for all occasions. From downtown shops with decades of history to newer boutique florists, local flower shops provide personalized service that national delivery services can't match. They know local venues, work with area event planners, and understand regional flower preferences.`,
    sections: [
      {
        type: "services",
        heading: "Floral Services",
        content: \`**Occasion Arrangements**
- Birthday flowers
- Anniversary arrangements
- Sympathy and funeral flowers
- Get well arrangements
- Congratulations
- Just because

**Event Florals**
- Wedding flowers (bouquets, centerpieces, ceremony)
- Reception decorations
- Corporate events
- Party arrangements
- Church arrangements

**Products**
- Fresh cut flowers
- Potted plants
- Dish gardens
- Balloon bouquets
- Gift baskets
- Silk/artificial arrangements

**Services**
- Same-day delivery (usually available)
- Standing orders for businesses
- Event consultation
- Delivery throughout Navarro County\`
      }
    ],
    faqs: [
      {
        question: "How much do flowers cost?",
        answer: "Small arrangements start around $35-$50. Standard bouquets and arrangements run $60-$100. Premium and large arrangements cost $100-$200+. Wedding flowers vary widely—bridal bouquets $150-$300, bridesmaid bouquets $75-$150, centerpieces $50-$150 each. Funeral sprays and casket pieces range from $100-$400+. Delivery fees add $10-$20 locally."
      },
      {
        question: "How far in advance should I order flowers?",
        answer: "For standard arrangements and delivery, same-day or next-day orders are usually fine. For specific flowers or colors, order 2-3 days ahead. Wedding and event flowers should be ordered 2-4 months in advance, with final details confirmed 2 weeks before. Holiday weeks (Valentine's, Mother's Day) require earlier ordering."
      },
      {
        question: "Can I get flowers delivered on Sunday?",
        answer: "Most local florists don't deliver on Sundays. For Sunday delivery, order by Saturday morning for Saturday delivery, or check if your florist offers Sunday delivery for funerals or special circumstances. For Sunday events, flowers are typically delivered Saturday with instructions for care."
      }
    ],
    relatedServices: ["wedding-planner", "event-planner", "catering", "wedding-venue"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "party-rental",
    title: "Party Equipment Rental",
    category: "events_entertainment",
    subcategory: "rental",
    layout: 5,
    icon: "Tent",
    iconColor: "blue",
    metaTitle: "Party Rental in Navarro County, TX | Event Equipment Corsicana",
    metaDescription: "Party and event rentals in Corsicana and Navarro County. Tents, tables, chairs, linens, bounce houses, and event equipment for any occasion.",
    metaKeywords: "party rental Corsicana, event rental Navarro County, tent rental, table rental, chair rental, bounce house",
    heroContent: `From backyard birthday parties to elegant wedding receptions, event rentals provide the equipment that makes gatherings possible. Navarro County party rental companies supply everything from tables and chairs to tents, linens, and entertainment items.`,
    localContext: `Navarro County's event venues often need supplemental equipment, and private property events require everything from the ground up. Local rental companies deliver throughout the county, with familiarity that helps them navigate rural addresses and farm gates. They understand the local event scene and can recommend appropriate quantities and equipment for various occasions.`,
    sections: [
      {
        type: "services",
        heading: "Party Rental Equipment",
        content: \`**Furniture**
- Folding chairs
- Chiavari chairs
- Banquet tables
- Round tables
- Cocktail tables
- Lounge furniture

**Tents & Structures**
- Pop-up canopies
- Frame tents
- Pole tents
- Sidewalls and flooring
- Heaters and fans

**Linens & Decor**
- Table linens
- Chair covers
- Napkins
- Backdrops
- Decorative items

**Food Service**
- Chafing dishes
- Serving pieces
- China and flatware
- Glassware
- Beverage dispensers
- Coolers

**Entertainment**
- Bounce houses
- Inflatable slides
- Games
- Dance floors
- Audio equipment
- Lighting\`
      }
    ],
    faqs: [
      {
        question: "How much does party rental equipment cost?",
        answer: "Basic folding chairs rent for $1-$3 each. Banquet tables run $8-$15 each. Small pop-up tents start around $75-$150. Large frame tents cost $300-$1,000+ depending on size. Bounce houses rent for $150-$300 per day. Delivery and setup fees add to the base rental cost. Most rentals are for a weekend period."
      },
      {
        question: "How far in advance should I reserve rental equipment?",
        answer: "For weddings and large events, book 3-6 months ahead to ensure availability. Regular parties and smaller events should reserve 2-4 weeks out. Peak seasons (spring/fall wedding season, graduation) require earlier booking. Popular items like large tents and bounce houses book up quickly—don't wait until the last minute."
      },
      {
        question: "Do rental companies deliver and set up?",
        answer: "Most party rental companies offer delivery, setup, and pickup as part of their service, with fees based on location and order size. Some items (tables, chairs) may be delivered stacked for customer setup. Tents and complex items typically include professional setup. Confirm exactly what's included in your quote."
      }
    ],
    relatedServices: ["tent-rental", "event-venue", "catering", "event-planner", "bounce-house"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // BEAUTY & PERSONAL CARE
  // ============================================
  {
    slug: "hair-salon",
    title: "Hair Salon",
    category: "beauty_personal",
    subcategory: "hair",
    layout: 1,
    icon: "Scissors",
    iconColor: "pink",
    metaTitle: "Hair Salon in Navarro County, TX | Haircuts & Styling Corsicana",
    metaDescription: "Hair salons in Corsicana and Navarro County. Professional haircuts, coloring, styling, highlights, and treatments for men and women.",
    metaKeywords: "hair salon Corsicana, haircut Navarro County, hair color, highlights, hair styling, balayage",
    heroContent: `A great haircut transforms how you look and feel. Navarro County hair salons offer professional styling services from experienced stylists who stay current with trends while understanding the practical needs of their clients.`,
    localContext: `Corsicana and Navarro County salons range from family-friendly shops offering quick cuts to full-service salons providing color, treatments, and special occasion styling. Many local stylists have years of experience and loyal client bases, while newer salons bring fresh techniques and trends to the area. Texas heat and humidity are considerations local stylists understand well when recommending styles and products.`,
    sections: [
      {
        type: "services",
        heading: "Salon Services",
        content: \`**Haircuts**
- Women's haircuts
- Men's haircuts
- Children's haircuts
- Bang trims
- Specialty cuts

**Color Services**
- Single-process color
- Highlights and lowlights
- Balayage and ombre
- Color correction
- Gray coverage
- Fashion colors

**Treatments**
- Deep conditioning
- Keratin treatments
- Brazilian blowouts
- Scalp treatments
- Olaplex treatments

**Styling**
- Blowouts
- Updos
- Special occasion styling
- Wedding hair\`
      }
    ],
    faqs: [
      {
        question: "How much is a haircut at a local salon?",
        answer: "Women's haircuts in Navarro County range from $25-$60 depending on the salon and stylist experience. Men's cuts run $15-$35. Children's cuts are typically $12-$25. Color services vary widely—single-process color starts around $60-$85, highlights range from $75-$150+. Specialty treatments and balayage can run $100-$250."
      },
      {
        question: "How often should I get my hair cut?",
        answer: "For maintaining a specific style, every 4-6 weeks is typical. If you're growing your hair out, every 8-12 weeks for trims helps keep ends healthy. Short styles and men's cuts often need refreshing every 3-4 weeks. Your stylist can recommend the best schedule based on your hair type and style."
      },
      {
        question: "Should I wash my hair before a salon visit?",
        answer: "For a regular haircut, clean hair is ideal—wash the day of or the day before. For color appointments, check with your stylist; some prefer slightly dirty hair (24-48 hours unwashed) as natural oils can protect the scalp during processing. Always arrive with product-free hair if possible."
      }
    ],
    relatedServices: ["barbershop", "nail-salon", "spa", "makeup-artist"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "barbershop",
    title: "Barbershop",
    category: "beauty_personal",
    subcategory: "hair",
    layout: 2,
    icon: "Scissors",
    iconColor: "blue",
    metaTitle: "Barbershop in Navarro County, TX | Men's Haircuts Corsicana",
    metaDescription: "Barbershops in Corsicana and Navarro County. Traditional and modern men's haircuts, beard trims, fades, and hot towel shaves.",
    metaKeywords: "barbershop Corsicana, barber Navarro County, mens haircut, fade, beard trim, hot shave",
    heroContent: `A good barber knows your preferences before you sit down. Navarro County barbershops offer traditional and modern men's grooming services in comfortable settings where locals catch up while getting a fresh cut.`,
    localContext: `Barbershops have been community gathering spots in Corsicana for generations. Today's Navarro County barbers blend classic techniques with modern styles, from traditional tapered cuts to sharp fades. Many shops take walk-ins, while busier locations recommend appointments for popular barbers.`,
    sections: [
      {
        type: "services",
        heading: "Barbershop Services",
        content: \`**Haircuts**
- Traditional cuts
- Fades (low, mid, high)
- Tapers
- Buzz cuts
- Scissor cuts
- Style cuts

**Facial Hair**
- Beard trims
- Beard shaping
- Hot towel shaves
- Mustache trims
- Line-ups

**Additional**
- Eyebrow cleanup
- Ear and nose hair
- Hair designs/patterns
- Kids cuts
- Senior cuts\`
      }
    ],
    faqs: [
      {
        question: "How much does a barbershop haircut cost?",
        answer: "Standard men's haircuts in Navarro County run $15-$30 at most barbershops. Fades and more detailed work may cost $20-$35. Beard trims add $10-$20. Hot towel shaves range from $20-$40. Many shops offer senior and kids discounts. Pricing varies by shop and barber experience."
      },
      {
        question: "Do I need an appointment or can I walk in?",
        answer: "Most traditional barbershops in Navarro County accept walk-ins on a first-come, first-served basis. Wait times vary—Saturday mornings and after-work hours are typically busiest. Some shops and specific barbers take appointments. Calling ahead can save you wait time."
      },
      {
        question: "How often should men get haircuts?",
        answer: "For fades and short styles, every 2-3 weeks keeps the look sharp. Traditional cuts typically need trimming every 4-6 weeks. Buzz cuts can go longer between visits. Your barber can recommend a schedule based on how quickly your hair grows and your preferred style."
      }
    ],
    relatedServices: ["hair-salon", "spa"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "nail-salon",
    title: "Nail Salon",
    category: "beauty_personal",
    subcategory: "nails",
    layout: 3,
    icon: "Sparkles",
    iconColor: "pink",
    metaTitle: "Nail Salon in Navarro County, TX | Manicures & Pedicures Corsicana",
    metaDescription: "Nail salons in Corsicana and Navarro County. Professional manicures, pedicures, acrylics, gel nails, nail art, and dip powder services.",
    metaKeywords: "nail salon Corsicana, manicure Navarro County, pedicure, gel nails, acrylics, nail art",
    heroContent: `Well-maintained nails are a detail that makes a difference. Navarro County nail salons provide professional manicures, pedicures, and nail enhancements in relaxing environments designed to help you unwind while getting pampered.`,
    localContext: `From quick polish changes to elaborate nail art, Corsicana's nail salons cater to diverse preferences. Many clients make nail appointments part of their regular self-care routine, while others visit for special occasions. Local salons maintain strict sanitation standards and use quality products for beautiful, lasting results.`,
    sections: [
      {
        type: "services",
        heading: "Nail Services",
        content: \`**Manicures**
- Basic manicure
- Gel manicure
- Spa manicure
- French manicure
- Express manicure

**Pedicures**
- Basic pedicure
- Spa pedicure
- Gel pedicure
- Deluxe pedicure
- Express pedicure

**Enhancements**
- Acrylic nails
- Gel extensions
- Dip powder
- Nail tips
- Fiberglass wraps

**Specialty**
- Nail art
- Chrome nails
- Ombre nails
- Nail repair
- Soak-off removal\`
      }
    ],
    faqs: [
      {
        question: "How much do nail services cost?",
        answer: "Basic manicures start around $18-$25. Gel manicures run $30-$45. Basic pedicures are $25-$35, spa pedicures $40-$55. Full sets of acrylics cost $40-$65, with fills at $25-$40. Dip powder is typically $35-$50. Nail art adds $5-$20+ depending on complexity. Prices vary by salon."
      },
      {
        question: "How long do gel nails last?",
        answer: "Gel polish typically lasts 2-3 weeks without chipping. Gel extensions last 3-4 weeks before needing fills. Dip powder can last 3-4 weeks. Proper prep and quality products matter for longevity. Avoid using nails as tools and wear gloves for cleaning to maximize wear time."
      },
      {
        question: "Are acrylics or gel better for my nails?",
        answer: "Both have pros and cons. Acrylics are stronger and better for dramatic length but require more maintenance. Gel is lighter and more flexible but not as durable for very long styles. Dip powder offers durability without UV light. Your nail tech can recommend the best option based on your lifestyle and nail goals."
      }
    ],
    relatedServices: ["hair-salon", "spa", "waxing", "eyelash-extensions"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "spa",
    title: "Day Spa",
    category: "beauty_personal",
    subcategory: "spa",
    layout: 4,
    icon: "Flower2",
    iconColor: "purple",
    metaTitle: "Day Spa in Navarro County, TX | Spa Services Corsicana",
    metaDescription: "Day spas in Corsicana and Navarro County. Massage, facials, body treatments, and relaxation services for wellness and rejuvenation.",
    metaKeywords: "day spa Corsicana, spa Navarro County, facial, body treatment, spa packages, relaxation",
    heroContent: `Step away from daily stress and into a space dedicated to your well-being. Navarro County day spas offer a range of treatments designed to relax, rejuvenate, and restore—from therapeutic massages to luxurious facials and body treatments.`,
    localContext: `Day spas in Corsicana and Navarro County provide an escape without traveling far from home. Whether you're treating yourself, celebrating a special occasion, or simply need stress relief, local spas offer environments designed for relaxation and personalized services to meet your needs.`,
    sections: [
      {
        type: "services",
        heading: "Spa Services",
        content: \`**Massage**
- Swedish massage
- Deep tissue massage
- Hot stone massage
- Couples massage
- Prenatal massage

**Facials**
- Classic facial
- Anti-aging facial
- Acne treatment facial
- Hydrating facial
- Chemical peels

**Body Treatments**
- Body wraps
- Body scrubs
- Aromatherapy
- Detox treatments
- Cellulite treatments

**Packages**
- Spa day packages
- Couples packages
- Bridal packages
- Birthday specials\`
      }
    ],
    faqs: [
      {
        question: "How much do spa services cost?",
        answer: "One-hour massages typically range from $60-$100. Specialty massages (hot stone, deep tissue) run $80-$120. Basic facials start around $60-$80, with specialty facials $90-$150. Body treatments range from $70-$120. Spa packages offer value, typically $150-$300 for multiple services. Gratuity of 15-20% is standard."
      },
      {
        question: "What should I expect at my first spa visit?",
        answer: "Arrive 15-20 minutes early to complete paperwork and relax before your appointment. Wear comfortable clothes. You'll be given a robe and possibly slippers. Your therapist will discuss your preferences and any concerns. During treatments, communicate if pressure is too much or too little. Drink water before and after."
      },
      {
        question: "How often should I get spa treatments?",
        answer: "Massage is most beneficial monthly or bi-weekly for stress management. Facials are typically recommended every 4-6 weeks to align with skin cell turnover. However, spa visits can be as frequent or occasional as your budget and schedule allow—even occasional treatments provide benefits."
      }
    ],
    relatedServices: ["massage-therapist", "hair-salon", "nail-salon", "esthetician"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "med-spa",
    title: "Med Spa",
    category: "beauty_personal",
    subcategory: "spa",
    layout: 5,
    icon: "Sparkles",
    iconColor: "violet",
    metaTitle: "Med Spa in Navarro County, TX | Medical Aesthetics Corsicana",
    metaDescription: "Med spas in Corsicana and Navarro County. Botox, fillers, laser treatments, chemical peels, and medical-grade skincare services.",
    metaKeywords: "med spa Corsicana, Botox Navarro County, dermal fillers, laser treatment, medical aesthetics",
    heroContent: `Med spas bridge the gap between clinical treatments and spa relaxation, offering advanced aesthetic procedures in comfortable settings. Under medical supervision, Navarro County med spas provide treatments that address skin concerns, aging, and body contouring.`,
    localContext: `Medical aesthetics have become more accessible, with med spa services now available locally in Navarro County. These facilities operate under physician supervision and employ trained practitioners who can provide treatments previously only available in metropolitan areas. Results-driven treatments in a spa-like environment offer the best of both worlds.`,
    sections: [
      {
        type: "services",
        heading: "Med Spa Treatments",
        content: \`**Injectables**
- Botox/Dysport
- Dermal fillers (Juvederm, Restylane)
- Lip augmentation
- Kybella (double chin)

**Laser Treatments**
- Laser hair removal
- Photofacial/IPL
- Laser skin resurfacing
- Vein treatment
- Tattoo removal

**Skin Treatments**
- Medical-grade chemical peels
- Microneedling
- Dermaplaning
- Hydrafacials
- PRP therapy

**Body Contouring**
- CoolSculpting
- Body sculpting
- Cellulite treatment
- Skin tightening\`
      }
    ],
    faqs: [
      {
        question: "How much does Botox cost?",
        answer: "Botox is typically priced per unit, ranging from $10-$15 per unit in Navarro County. Most people need 20-60 units per treatment area. Forehead lines might require 20-30 units ($200-$450), crow's feet 20-30 units total, and frown lines 20-40 units. Many med spas offer package pricing."
      },
      {
        question: "Are med spa treatments safe?",
        answer: "Med spa treatments should be performed by licensed professionals under physician supervision. When administered properly, treatments like Botox and fillers have excellent safety records. Choose a reputable med spa with certified injectors and clear medical oversight. Ask about their training and experience."
      },
      {
        question: "How long do med spa results last?",
        answer: "Botox typically lasts 3-4 months. Dermal fillers last 6-18 months depending on the product and treatment area. Laser hair removal requires 6-8 sessions for long-term reduction. Skin treatments like chemical peels and microneedling provide cumulative benefits with a series of treatments."
      }
    ],
    relatedServices: ["spa", "esthetician", "laser-hair-removal", "cosmetic-dentist"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "tanning-salon",
    title: "Tanning Salon",
    category: "beauty_personal",
    subcategory: "beauty",
    layout: 1,
    icon: "Sun",
    iconColor: "orange",
    metaTitle: "Tanning Salon in Navarro County, TX | Indoor Tanning Corsicana",
    metaDescription: "Tanning salons in Corsicana and Navarro County. Indoor tanning beds, spray tans, and UV-free options for a sun-kissed glow year-round.",
    metaKeywords: "tanning salon Corsicana, indoor tanning Navarro County, spray tan, tanning bed, airbrush tan",
    heroContent: `Maintain a sun-kissed glow year-round with indoor tanning options. Navarro County tanning salons offer UV tanning beds and sunless alternatives to achieve the look you want, with guidance on safe tanning practices.`,
    localContext: `While Texas sunshine is plentiful, many Navarro County residents prefer the controlled environment of indoor tanning for consistent results. Local salons offer equipment ranging from basic beds to high-pressure units and spray tan options for those avoiding UV exposure.`,
    sections: [
      {
        type: "services",
        heading: "Tanning Options",
        content: \`**UV Tanning**
- Standard tanning beds
- High-pressure beds
- Stand-up booths
- Face tanners
- Various intensities

**Sunless Options**
- Spray tan booths
- Airbrush tanning
- Custom spray tans
- Express tans
- Bronzing treatments

**Add-ons**
- Tanning lotions
- Bronzers
- Moisturizers
- After-tan care\`
      }
    ],
    faqs: [
      {
        question: "How much does tanning cost?",
        answer: "Single tanning sessions run $5-$15 depending on bed type. Monthly unlimited packages range from $30-$80. Spray tans cost $25-$50 per session, with custom airbrush tans at $35-$75. Most salons offer package deals and memberships for regular tanners."
      },
      {
        question: "How often can I tan?",
        answer: "Wait at least 24-48 hours between UV tanning sessions to let your skin recover and develop color. Most people tan 2-3 times per week initially, reducing to once or twice weekly for maintenance. Spray tans typically last 5-10 days before needing a touch-up."
      },
      {
        question: "Is spray tanning safe for my skin?",
        answer: "Spray tanning uses DHA (dihydroxyacetone), which reacts with dead skin cells to create color—it doesn't penetrate living skin. It's considered safe and provides color without UV exposure. Avoid inhaling the spray and protect eyes during application."
      }
    ],
    relatedServices: ["spa", "nail-salon", "hair-salon"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "makeup-artist",
    title: "Makeup Artist",
    category: "beauty_personal",
    subcategory: "beauty",
    layout: 2,
    icon: "Palette",
    iconColor: "rose",
    metaTitle: "Makeup Artist in Navarro County, TX | Professional Makeup Corsicana",
    metaDescription: "Makeup artists in Corsicana and Navarro County. Wedding makeup, special event styling, lessons, and professional beauty services.",
    metaKeywords: "makeup artist Corsicana, bridal makeup Navarro County, wedding makeup, special event makeup",
    heroContent: `Professional makeup transforms how you look and feel for special occasions. Navarro County makeup artists create looks that photograph beautifully and last through emotional moments, from weddings to proms to professional headshots.`,
    localContext: `Finding the right makeup artist is essential for brides, prom-goers, and anyone wanting to look their best for important events. Navarro County artists work on-location or from studios, bringing professional products and techniques to create customized looks that suit your style and the occasion.`,
    sections: [
      {
        type: "services",
        heading: "Makeup Services",
        content: \`**Bridal**
- Bridal makeup
- Bridal party makeup
- Trial sessions
- On-location services
- Touch-up kits

**Special Events**
- Prom makeup
- Quinceañera makeup
- Photoshoot makeup
- Pageant makeup
- Event styling

**Other Services**
- Makeup lessons
- Personal shopping
- Headshot makeup
- Senior portrait makeup\`
      }
    ],
    faqs: [
      {
        question: "How much does professional makeup cost?",
        answer: "Special event makeup typically ranges from $50-$100. Bridal makeup runs $100-$200+, with trials an additional $50-$100. Bridesmaid/group pricing is often $50-$75 per person. Lessons run $75-$150 for personalized instruction. Travel fees may apply for on-location services."
      },
      {
        question: "Should I do a makeup trial before my wedding?",
        answer: "Yes, absolutely. A trial allows you to test the look, ensure the products work with your skin, and make adjustments before the big day. Schedule your trial 4-8 weeks before the wedding. Bring inspiration photos and wear a white or light-colored top to see how the makeup looks."
      },
      {
        question: "How early should I book a makeup artist for my wedding?",
        answer: "Book your makeup artist 6-12 months in advance, especially for popular wedding dates. Peak seasons (spring and fall in Texas) book up early. Many artists require deposits to hold your date. Confirm trial dates and final details in the weeks before your wedding."
      }
    ],
    relatedServices: ["hair-salon", "wedding-photographer", "wedding-planner"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "eyelash-extensions",
    title: "Eyelash Extensions",
    category: "beauty_personal",
    subcategory: "beauty",
    layout: 3,
    icon: "Eye",
    iconColor: "pink",
    metaTitle: "Eyelash Extensions in Navarro County, TX | Lash Services Corsicana",
    metaDescription: "Eyelash extension services in Corsicana and Navarro County. Classic, volume, and hybrid lash sets, fills, and lash lifts.",
    metaKeywords: "eyelash extensions Corsicana, lash extensions Navarro County, lash fill, volume lashes, lash lift",
    heroContent: `Wake up with beautiful lashes every day. Eyelash extensions eliminate the need for mascara and create a polished look with minimal effort. Navarro County lash artists apply individual extensions for natural or dramatic effects that last for weeks.`,
    localContext: `Lash services have become increasingly popular in Navarro County as more women discover the convenience and confidence boost of extensions. Local lash artists are trained in various techniques and use quality adhesives and lashes for beautiful, lasting results.`,
    sections: [
      {
        type: "services",
        heading: "Lash Services",
        content: \`**Full Sets**
- Classic lashes (1:1)
- Volume lashes (2-6:1)
- Hybrid lashes
- Mega volume

**Maintenance**
- 2-week fills
- 3-week fills
- Full set replacement
- Lash removal

**Other Services**
- Lash lifts
- Lash tints
- Brow lamination
- Brow tinting\`
      }
    ],
    faqs: [
      {
        question: "How much do eyelash extensions cost?",
        answer: "Classic full sets range from $100-$175. Volume sets run $150-$250. Hybrid sets fall between at $125-$200. Fills (every 2-3 weeks) cost $50-$90 for classic, $65-$120 for volume. Lash lifts are $60-$100 and last 6-8 weeks."
      },
      {
        question: "How long do lash extensions last?",
        answer: "Extensions last through your natural lash cycle—typically 4-6 weeks. However, fills are needed every 2-3 weeks to maintain a full look as natural lashes shed. With regular maintenance, you can keep extensions indefinitely. Proper aftercare extends the time between fills."
      },
      {
        question: "Can I wear mascara with extensions?",
        answer: "You won't need mascara with extensions—that's the point! If you must use it, only apply water-based mascara to the tips, never at the base. Oil-based products break down the adhesive. Most clients find mascara unnecessary with a proper lash set."
      }
    ],
    relatedServices: ["nail-salon", "hair-salon", "microblading", "esthetician"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "microblading",
    title: "Microblading",
    category: "beauty_personal",
    subcategory: "beauty",
    layout: 4,
    icon: "Feather",
    iconColor: "amber",
    metaTitle: "Microblading in Navarro County, TX | Permanent Brows Corsicana",
    metaDescription: "Microblading and permanent makeup in Corsicana and Navarro County. Semi-permanent eyebrows, powder brows, and brow shaping services.",
    metaKeywords: "microblading Corsicana, permanent brows Navarro County, eyebrow tattoo, powder brows, ombre brows",
    heroContent: `Microblading creates natural-looking, hair-like strokes that fill in sparse brows or reshape your eyebrow arch. This semi-permanent technique is ideal for those tired of daily brow makeup or anyone wanting to enhance their natural brows.`,
    localContext: `Microblading has become increasingly available in Navarro County, with trained artists offering this service locally. The procedure saves daily makeup time while providing natural-looking results that complement your features and skin tone.`,
    sections: [
      {
        type: "services",
        heading: "Brow Services",
        content: \`**Microblading**
- Hair-stroke technique
- Custom brow shaping
- Color matching
- Touch-up sessions

**Other Techniques**
- Powder brows
- Ombre brows
- Combination brows
- Nano brows

**Additional**
- Brow shaping
- Brow tinting
- Touch-up appointments
- Color corrections\`
      }
    ],
    faqs: [
      {
        question: "How much does microblading cost?",
        answer: "Initial microblading sessions range from $250-$500 in Navarro County. This typically includes a touch-up appointment 4-8 weeks later. Annual touch-ups to maintain color run $100-$200. Powder brows and combination techniques may be priced similarly or slightly higher."
      },
      {
        question: "How long does microblading last?",
        answer: "Microblading typically lasts 1-3 years, depending on skin type, sun exposure, and skincare products. Oily skin tends to fade faster. Annual touch-ups maintain the best results. The color will gradually fade over time—it won't suddenly disappear."
      },
      {
        question: "Does microblading hurt?",
        answer: "Most clients describe the sensation as a slight scratching feeling. Numbing cream is applied before and during the procedure to minimize discomfort. The initial appointment takes 2-3 hours, including shaping, numbing, and the procedure. Healing takes 4-6 weeks."
      }
    ],
    relatedServices: ["eyelash-extensions", "makeup-artist", "esthetician"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "waxing",
    title: "Waxing Service",
    category: "beauty_personal",
    subcategory: "beauty",
    layout: 5,
    icon: "Sparkles",
    iconColor: "yellow",
    metaTitle: "Waxing in Navarro County, TX | Hair Removal Corsicana",
    metaDescription: "Professional waxing services in Corsicana and Navarro County. Eyebrow, facial, body, and bikini waxing for smooth, lasting results.",
    metaKeywords: "waxing Corsicana, hair removal Navarro County, bikini wax, eyebrow wax, full body wax",
    heroContent: `Waxing provides longer-lasting hair removal than shaving, leaving skin smooth for weeks. Professional waxing services in Navarro County use quality products and proper technique for effective, comfortable hair removal on all body areas.`,
    localContext: `Navarro County salons and spas offer waxing services ranging from quick eyebrow appointments to full-body treatments. Experienced technicians use hard wax, soft wax, or sugar wax based on the treatment area and skin sensitivity for optimal results.`,
    sections: [
      {
        type: "services",
        heading: "Waxing Services",
        content: \`**Facial Waxing**
- Eyebrow wax
- Upper lip
- Chin
- Full face
- Sideburns

**Body Waxing**
- Arms
- Underarms
- Legs (half or full)
- Back
- Chest

**Bikini Waxing**
- Bikini line
- Extended bikini
- Brazilian
- Maintenance visits\`
      }
    ],
    faqs: [
      {
        question: "How much does waxing cost?",
        answer: "Eyebrow waxing runs $10-$20. Lip or chin wax is $8-$15. Full face waxing costs $35-$60. Bikini line starts around $25-$40, with Brazilian waxing at $45-$75. Leg waxing ranges from $40-$80 for full legs. Prices vary by salon."
      },
      {
        question: "How long should hair be for waxing?",
        answer: "Hair should be about 1/4 inch long—roughly 2-3 weeks of growth after shaving. Too short and the wax can't grip properly. Too long and it can be more painful. Your waxing technician may trim if hair is too long."
      },
      {
        question: "How long do waxing results last?",
        answer: "Waxing results typically last 3-6 weeks depending on individual hair growth cycles. Regular waxing can lead to finer, sparser regrowth over time. Some areas (like eyebrows) may need touch-ups more frequently than others."
      }
    ],
    relatedServices: ["spa", "nail-salon", "laser-hair-removal", "esthetician"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "tattoo-parlor",
    title: "Tattoo Parlor",
    category: "beauty_personal",
    subcategory: "body",
    layout: 1,
    icon: "Palette",
    iconColor: "slate",
    metaTitle: "Tattoo Parlor in Navarro County, TX | Tattoo Shop Corsicana",
    metaDescription: "Tattoo parlors in Corsicana and Navarro County. Custom tattoos, traditional, realistic, black work, and cover-ups by experienced artists.",
    metaKeywords: "tattoo Corsicana, tattoo shop Navarro County, custom tattoo, cover up tattoo, tattoo artist",
    heroContent: `Tattoos are permanent art—choose your artist carefully. Navarro County tattoo shops feature skilled artists working in various styles, from traditional Americana to photorealistic portraits, ensuring you can find the right person to bring your vision to life.`,
    localContext: `Tattoo culture has become mainstream, and Navarro County has talented artists creating custom work. Local shops maintain clean, licensed facilities and follow strict safety protocols. Whether it's your first tattoo or you're a collector, there's a local artist whose style matches your vision.`,
    sections: [
      {
        type: "services",
        heading: "Tattoo Services",
        content: \`**Tattoo Styles**
- Traditional/Americana
- Black and gray
- Realism/portraits
- Neo-traditional
- Tribal
- Lettering/script
- Watercolor

**Services**
- Custom designs
- Walk-in flash
- Cover-ups
- Touch-ups
- Reworks

**Consultations**
- Design consultation
- Placement advice
- Custom drawings\`
      }
    ],
    faqs: [
      {
        question: "How much do tattoos cost?",
        answer: "Most shops have a minimum charge of $50-$100 for small pieces. Hourly rates range from $100-$200+ depending on the artist's experience and demand. Small simple tattoos might cost $50-$150. Larger pieces run into hundreds or thousands of dollars. Get a quote for your specific design."
      },
      {
        question: "How do I choose a tattoo artist?",
        answer: "Look at artists' portfolios to find one whose style matches what you want. Check their Instagram or shop website. Read reviews. Visit the shop to see the environment. A good artist will gladly answer questions about their process. Don't choose based on price alone—this is permanent."
      },
      {
        question: "How should I care for a new tattoo?",
        answer: "Follow your artist's specific instructions. Generally: keep the bandage on for a few hours, gently wash with fragrance-free soap, apply thin layers of recommended ointment, keep it moisturized, avoid sun exposure and soaking, don't pick at scabs. Healing takes 2-4 weeks."
      }
    ],
    relatedServices: ["piercing"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "piercing",
    title: "Body Piercing",
    category: "beauty_personal",
    subcategory: "body",
    layout: 2,
    icon: "Circle",
    iconColor: "gray",
    metaTitle: "Body Piercing in Navarro County, TX | Piercing Studio Corsicana",
    metaDescription: "Professional piercing services in Corsicana and Navarro County. Ear, nose, and body piercings with quality jewelry and proper sterilization.",
    metaKeywords: "piercing Corsicana, body piercing Navarro County, ear piercing, nose piercing, professional piercer",
    heroContent: `Professional piercings heal better and look better. Trained piercers use proper technique, sterile equipment, and quality jewelry for safe piercings that heal well and last. Navarro County piercing studios maintain high standards for this permanent modification.`,
    localContext: `From simple ear piercings to more advanced body modifications, Navarro County has experienced piercers working in clean, licensed studios. Professional piercing is safer than mall kiosks or DIY approaches, with proper training, equipment, and aftercare guidance.`,
    sections: [
      {
        type: "services",
        heading: "Piercing Services",
        content: \`**Ear Piercings**
- Earlobe
- Helix/cartilage
- Tragus
- Daith
- Industrial
- Conch

**Facial Piercings**
- Nose (nostril)
- Septum
- Eyebrow
- Lip

**Body Piercings**
- Navel
- Nipple
- Surface piercings

**Jewelry**
- Initial piercing jewelry
- Upgrade options
- Custom pieces\`
      }
    ],
    faqs: [
      {
        question: "How much does a piercing cost?",
        answer: "Earlobe piercings typically run $25-$40 including basic jewelry. Cartilage and nose piercings range from $30-$60. More complex piercings (industrial, septum) may cost $50-$80. Quality jewelry upgrades add to the cost but improve healing and appearance."
      },
      {
        question: "How long does it take for piercings to heal?",
        answer: "Earlobes heal in 6-8 weeks. Cartilage takes 6-12 months. Nostril piercings heal in 4-6 months. Navel piercings take 6-12 months. Follow aftercare instructions carefully—rushing jewelry changes causes complications."
      },
      {
        question: "Why professional piercing vs. mall kiosks?",
        answer: "Professional piercers use single-use, hollow needles instead of reusable piercing guns. Needles cause less tissue damage and heal better. Studios maintain strict sterilization protocols. Piercers are trained in anatomy and proper placement. Quality jewelry prevents reactions."
      }
    ],
    relatedServices: ["tattoo-parlor"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "teeth-whitening",
    title: "Teeth Whitening",
    category: "beauty_personal",
    subcategory: "dental",
    layout: 3,
    icon: "Sparkles",
    iconColor: "white",
    metaTitle: "Teeth Whitening in Navarro County, TX | Professional Whitening Corsicana",
    metaDescription: "Teeth whitening services in Corsicana and Navarro County. Professional whitening, laser treatments, and take-home kits for a brighter smile.",
    metaKeywords: "teeth whitening Corsicana, professional whitening Navarro County, laser teeth whitening, bright smile",
    heroContent: `A bright smile makes a memorable impression. Professional teeth whitening delivers more dramatic, longer-lasting results than over-the-counter products. Navarro County providers offer in-office treatments and custom take-home kits for whiter teeth.`,
    localContext: `Coffee, tea, and Texas wine can stain teeth over time. Professional whitening addresses discoloration more effectively than drugstore strips. Local dental offices and some spas offer whitening services, with options ranging from single-visit treatments to gradual at-home systems.`,
    sections: [
      {
        type: "services",
        heading: "Whitening Options",
        content: \`**In-Office Whitening**
- LED/laser activated whitening
- Zoom whitening
- Single-visit results
- Professional strength gel

**Take-Home Systems**
- Custom trays
- Professional-grade gel
- Gradual whitening
- Maintenance kits

**Combination Plans**
- In-office + take-home
- Initial treatment + maintenance
- Package pricing\`
      }
    ],
    faqs: [
      {
        question: "How much does professional teeth whitening cost?",
        answer: "In-office LED/laser whitening runs $300-$600 for a single session. Custom take-home trays from a dentist cost $200-$400. Spa-based whitening (non-dental) ranges from $100-$250. Over-the-counter products are cheaper but less effective."
      },
      {
        question: "How long does teeth whitening last?",
        answer: "Results typically last 6 months to 2 years depending on diet and habits. Coffee, tea, red wine, and smoking cause faster staining. Touch-up treatments extend results. Take-home trays allow you to maintain your white smile as needed."
      },
      {
        question: "Is teeth whitening safe?",
        answer: "Professional whitening is safe when done properly. Some sensitivity is normal during and after treatment. Dentist-supervised whitening is safest as they can assess your dental health first. Whitening doesn't work on crowns, veneers, or fillings—they stay their original color."
      }
    ],
    relatedServices: ["dentist", "cosmetic-dentist"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "esthetician",
    title: "Esthetician",
    category: "beauty_personal",
    subcategory: "skin",
    layout: 4,
    icon: "Flower2",
    iconColor: "rose",
    metaTitle: "Esthetician in Navarro County, TX | Skincare Specialist Corsicana",
    metaDescription: "Licensed estheticians in Corsicana and Navarro County. Professional facials, skincare treatments, and personalized skin analysis.",
    metaKeywords: "esthetician Corsicana, skincare Navarro County, facial treatment, acne treatment, anti-aging",
    heroContent: `Estheticians are skincare specialists trained to analyze your skin and provide treatments tailored to your needs. From acne management to anti-aging, Navarro County estheticians help you achieve and maintain healthy, beautiful skin.`,
    localContext: `Texas climate—hot summers, low humidity, and intense sun—creates specific skincare challenges. Local estheticians understand these factors and recommend treatments and products suited to our environment. Regular professional care complements your at-home routine for optimal results.`,
    sections: [
      {
        type: "services",
        heading: "Esthetician Services",
        content: \`**Facials**
- Deep cleansing facial
- Hydrating facial
- Anti-aging facial
- Acne treatment facial
- Brightening facial
- Sensitive skin facial

**Specialized Treatments**
- Chemical peels
- Microdermabrasion
- Dermaplaning
- LED light therapy
- Extractions
- High-frequency treatment

**Consultations**
- Skin analysis
- Product recommendations
- Skincare routine planning
- Condition management\`
      }
    ],
    faqs: [
      {
        question: "How often should I get a professional facial?",
        answer: "For general maintenance, every 4-6 weeks aligns with your skin's renewal cycle. Acne-prone skin may benefit from more frequent treatments initially. Even quarterly facials provide benefits. Your esthetician can recommend a schedule based on your skin's needs and goals."
      },
      {
        question: "What's the difference between an esthetician and a dermatologist?",
        answer: "Estheticians are licensed skincare specialists who perform facials and non-invasive treatments. Dermatologists are medical doctors who diagnose and treat skin conditions and can prescribe medications. For medical concerns, see a dermatologist. For maintenance and cosmetic treatments, see an esthetician."
      },
      {
        question: "Will a facial cause breakouts?",
        answer: "Some people experience \"purging\" after a facial as impurities are brought to the surface. This is temporary and part of the skin clearing process. Let your esthetician know about any sensitivities beforehand. Avoid facials right before important events if you're trying a new treatment."
      }
    ],
    relatedServices: ["spa", "med-spa", "makeup-artist", "dermatologist"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "laser-hair-removal",
    title: "Laser Hair Removal",
    category: "beauty_personal",
    subcategory: "skin",
    layout: 5,
    icon: "Zap",
    iconColor: "violet",
    metaTitle: "Laser Hair Removal in Navarro County, TX | Permanent Hair Reduction",
    metaDescription: "Laser hair removal in Corsicana and Navarro County. Permanent hair reduction for face, underarms, legs, bikini, and body areas.",
    metaKeywords: "laser hair removal Corsicana, permanent hair removal Navarro County, hair reduction, laser treatment",
    heroContent: `Laser hair removal offers long-term reduction of unwanted hair, freeing you from constant shaving and waxing. Navarro County med spas and clinics use professional laser equipment to target hair follicles for lasting results on most skin types.`,
    localContext: `The convenience of laser hair removal appeals to busy Navarro County residents tired of regular shaving and waxing. Modern laser technology works on various skin tones—advances have made the treatment accessible to more people than ever. Local providers offer treatment packages for common areas.`,
    sections: [
      {
        type: "services",
        heading: "Treatment Areas",
        content: \`**Face**
- Upper lip
- Chin
- Sideburns
- Full face

**Body**
- Underarms
- Arms
- Back
- Chest
- Stomach

**Legs & Bikini**
- Bikini line
- Brazilian area
- Full legs
- Lower legs\`
      }
    ],
    faqs: [
      {
        question: "How much does laser hair removal cost?",
        answer: "Pricing is typically per treatment. Upper lip runs $75-$150 per session. Underarms cost $100-$200. Bikini line is $150-$250, full Brazilian $200-$400. Full legs run $300-$600. Most people need 6-8 sessions—packages offer significant savings."
      },
      {
        question: "How many treatments are needed?",
        answer: "Most people need 6-8 treatments spaced 4-8 weeks apart. Hair grows in cycles, and laser only affects actively growing hair. Multiple sessions catch hair in different growth phases. Maintenance sessions may be needed annually after the initial series."
      },
      {
        question: "Does laser hair removal work on all skin tones?",
        answer: "Modern lasers (especially Nd:YAG) work on a range of skin tones, though contrast between skin and hair color affects results. Light skin with dark hair responds best. Gray, blonde, and red hair are difficult to treat. Consult with a provider to assess your suitability."
      }
    ],
    relatedServices: ["med-spa", "waxing", "esthetician"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // EDUCATION & CHILDCARE
  // ============================================
  {
    slug: "daycare",
    title: "Daycare Center",
    category: "education_childcare",
    subcategory: "childcare",
    layout: 1,
    icon: "Baby",
    iconColor: "sky",
    metaTitle: "Daycare in Navarro County, TX | Childcare Center Corsicana",
    metaDescription: "Licensed daycare centers in Corsicana and Navarro County. Quality childcare, early learning programs, and safe environments for infants through pre-K.",
    metaKeywords: "daycare Corsicana, childcare Navarro County, licensed daycare, infant care, toddler care",
    heroContent: `Quality childcare provides peace of mind while you work, knowing your child is safe, engaged, and learning. Navarro County daycare centers offer nurturing environments with age-appropriate activities, qualified staff, and the structure children need to thrive.`,
    localContext: `Finding the right daycare is one of the most important decisions Navarro County parents make. Local centers range from home-based facilities to larger commercial operations, each offering different philosophies, schedules, and services. Texas requires licensing for centers caring for more than 3 unrelated children, and parents can verify licensing status online.`,
    sections: [
      {
        type: "guide",
        heading: "What to Look for in a Daycare",
        content: \`**Licensing & Safety**
- Current Texas HHS license
- Clean inspection history
- Staff background checks
- Safety protocols and training
- Secure entry/exit

**Staff Quality**
- Low child-to-staff ratios
- Trained and experienced caregivers
- Low staff turnover
- Warm interactions with children

**Environment**
- Clean, organized spaces
- Age-appropriate equipment
- Outdoor play area
- Separate areas for different ages

**Programs**
- Structured daily schedule
- Age-appropriate curriculum
- Meals and snacks provided
- Communication with parents\`
      }
    ],
    faqs: [
      {
        question: "How much does daycare cost in Navarro County?",
        answer: "Full-time daycare in Navarro County typically ranges from $600-$1,000 per month depending on the child's age (infants cost more), facility type, and services included. Home-based care may be less expensive. Some facilities offer part-time options. Ask about registration fees, supply fees, and late pickup charges."
      },
      {
        question: "How do I check a daycare's license and inspection history?",
        answer: "Texas Health and Human Services maintains a searchable database at hhs.texas.gov/childcare where you can verify licensing, view inspection reports, and see any violations or corrective actions. This should be your first step when evaluating any childcare facility."
      },
      {
        question: "What are the required staff-to-child ratios in Texas?",
        answer: "Texas requires specific ratios: 1:4 for infants (0-17 months), 1:5 for toddlers (18-23 months), 1:9 for 2-year-olds, 1:11 for 3-year-olds, 1:15 for 4-year-olds, and 1:18 for 5-year-olds. Better facilities often maintain lower ratios than the minimum requirements."
      }
    ],
    relatedServices: ["preschool", "babysitter", "nanny", "after-school-care"],
    externalResources: [
      { name: "Texas Child Care Licensing Search", url: "https://www.hhs.texas.gov/doing-business-hhs/provider-portals/protective-services-providers/child-care-licensing" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "preschool",
    title: "Preschool",
    category: "education_childcare",
    subcategory: "childcare",
    layout: 2,
    icon: "GraduationCap",
    iconColor: "blue",
    metaTitle: "Preschool in Navarro County, TX | Pre-K Programs Corsicana",
    metaDescription: "Preschools in Corsicana and Navarro County. Early childhood education, pre-K programs, and kindergarten preparation for ages 3-5.",
    metaKeywords: "preschool Corsicana, pre-K Navarro County, early childhood education, kindergarten prep",
    heroContent: `Preschool builds the foundation for lifelong learning. Quality early education programs in Navarro County prepare children academically and socially for kindergarten, developing curiosity, confidence, and essential skills through structured play and learning.`,
    localContext: `Navarro County offers various preschool options including church-based programs, private schools, and Corsicana ISD's pre-K program for eligible 4-year-olds. Each program has its own philosophy, schedule, and requirements. Starting preschool readies children for the academic environment they'll experience in kindergarten.`,
    sections: [
      {
        type: "services",
        heading: "Preschool Features",
        content: \`**Academic Preparation**
- Pre-reading skills (letters, sounds)
- Math concepts (counting, shapes)
- Science exploration
- Creative arts
- Music and movement

**Social Development**
- Sharing and cooperation
- Following instructions
- Classroom routines
- Peer relationships
- Emotional regulation

**Practical Skills**
- Independence
- Self-help skills
- Communication
- Problem-solving
- Listening skills\`
      }
    ],
    faqs: [
      {
        question: "When should my child start preschool?",
        answer: "Most preschool programs accept children ages 3-5. Some have 2-year-old programs. Texas pre-K is typically for 4-year-olds. Consider your child's developmental readiness, including potty training, ability to separate from parents, and basic communication skills. There's no single right age—each child is different."
      },
      {
        question: "What's the difference between preschool and daycare?",
        answer: "Preschool focuses on early education with structured curriculum preparing children for kindergarten—typically half-day programs for ages 3-5. Daycare primarily provides care while parents work, often full-day with less academic structure. Many facilities offer both elements, combining care with educational programming."
      },
      {
        question: "Does Corsicana ISD offer free pre-K?",
        answer: "Corsicana ISD offers free pre-K for eligible 4-year-olds. Eligibility requirements include income qualifications, being a homeless family, having limited English proficiency, being a child of active military, or being in foster care. Contact the district to determine eligibility and enrollment."
      }
    ],
    relatedServices: ["daycare", "tutoring", "after-school-care"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "after-school-care",
    title: "After School Care",
    category: "education_childcare",
    subcategory: "childcare",
    layout: 3,
    icon: "Clock",
    iconColor: "green",
    metaTitle: "After School Care in Navarro County, TX | After School Programs Corsicana",
    metaDescription: "After school care programs in Corsicana and Navarro County. Supervised activities, homework help, and care until parents finish work.",
    metaKeywords: "after school care Corsicana, after school program Navarro County, latchkey, homework help",
    heroContent: `After school programs bridge the gap between school dismissal and when parents finish work. Navarro County after school care provides supervised environments with homework help, snacks, and activities to keep children safe and engaged during afternoon hours.`,
    localContext: `Many Navarro County families need after school care to cover work hours. Programs operate at schools, community centers, churches, and childcare facilities. Some focus on homework completion while others emphasize enrichment activities or sports. Transportation from school is often included.`,
    sections: [
      {
        type: "services",
        heading: "After School Programs",
        content: \`**Typical Schedule**
- School pickup/bus arrival
- Snack time
- Homework help
- Free play/structured activities
- Quiet activities until pickup

**Activities**
- Homework assistance
- Arts and crafts
- Outdoor play
- Sports and games
- Reading time

**Services**
- Transportation from school
- Snacks (sometimes dinner)
- Full-day care on school holidays
- Summer program options\`
      }
    ],
    faqs: [
      {
        question: "How much does after school care cost?",
        answer: "After school programs in Navarro County typically run $200-$400 per month for full-week attendance. Drop-in rates are $15-$30 per day. Fees vary based on program type, pickup time, and included services. Some programs offer sibling discounts. School-based programs may be less expensive."
      },
      {
        question: "What hours do after school programs operate?",
        answer: "Most programs operate from school dismissal (typically 3:00-3:30 PM) until 5:30 or 6:00 PM. Some extend to 6:30 PM for parents with longer commutes. Check individual programs for their specific hours and late pickup policies and fees."
      },
      {
        question: "Do after school programs operate during school breaks?",
        answer: "Policies vary. Some programs offer full-day care during teacher workdays and school breaks at additional cost. Others close during these times. Summer programs may be separate. Check with programs about their holiday and summer schedules when enrolling."
      }
    ],
    relatedServices: ["daycare", "tutoring", "babysitter"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "babysitter",
    title: "Babysitting Service",
    category: "education_childcare",
    subcategory: "childcare",
    layout: 4,
    icon: "Heart",
    iconColor: "pink",
    metaTitle: "Babysitter in Navarro County, TX | Babysitting Service Corsicana",
    metaDescription: "Babysitters in Corsicana and Navarro County. Reliable childcare for date nights, events, and occasional care needs.",
    metaKeywords: "babysitter Corsicana, babysitting Navarro County, date night sitter, childcare, occasional care",
    heroContent: `Sometimes you need reliable childcare for an evening out, a work event, or an appointment. Babysitters provide flexible, in-home care for occasions when your regular childcare isn't available or you simply need a trusted adult to watch your children.`,
    localContext: `Finding a trustworthy babysitter in Navarro County often comes through personal recommendations, community connections, or local networks. Many families rely on a small group of trusted sitters they call on regularly. Local teenagers, college students, and experienced caregivers all provide babysitting services.`,
    sections: [
      {
        type: "guide",
        heading: "Finding a Good Babysitter",
        content: \`**Where to Find Sitters**
- Personal referrals from friends/family
- Church communities
- Local Facebook groups
- Care.com and similar services
- School recommendations

**What to Look For**
- Experience with your children's ages
- CPR/First Aid training
- Reliable transportation
- References you can check
- Background check willing

**Good Signs**
- Engages with your children
- Asks about routines and preferences
- Arrives on time
- Follows your instructions
- Communicates during care\`
      }
    ],
    faqs: [
      {
        question: "How much should I pay a babysitter?",
        answer: "Babysitting rates in Navarro County typically range from $10-$18 per hour depending on the sitter's age/experience, number of children, and time of day. Rate for one child averages $10-$15/hour. Add $2-$5/hour for additional children. Late night and holiday rates are often higher."
      },
      {
        question: "What should I tell a new babysitter?",
        answer: "Leave written information including: emergency contacts, your whereabouts and phone number, pediatrician info, any allergies or medical needs, house rules, bedtime routines, meal information, and any off-limits areas. Walk through safety items like locks, alarms, and first aid kit location."
      },
      {
        question: "What age can a teenager babysit in Texas?",
        answer: "Texas law doesn't specify a minimum babysitting age, leaving this to parental judgment. Generally, mature 12-year-olds can babysit for short periods. The American Red Cross offers babysitter training for ages 11 and up. Consider the sitter's maturity and the specific situation."
      }
    ],
    relatedServices: ["nanny", "daycare", "after-school-care"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "nanny",
    title: "Nanny Service",
    category: "education_childcare",
    subcategory: "childcare",
    layout: 5,
    icon: "User",
    iconColor: "indigo",
    metaTitle: "Nanny in Navarro County, TX | Nanny Service Corsicana",
    metaDescription: "Nanny services in Corsicana and Navarro County. Full-time and part-time nannies for personalized in-home childcare and family support.",
    metaKeywords: "nanny Corsicana, nanny service Navarro County, in-home childcare, private childcare",
    heroContent: `A nanny provides personalized in-home childcare, offering one-on-one attention, flexibility, and continuity that daycare can't match. For Navarro County families seeking dedicated care tailored to their schedule and parenting style, a nanny may be the ideal solution.`,
    localContext: `While nannies are less common in Navarro County than daycare centers, some families find the personalized care worth the investment. Nannies may be full-time employees or part-time caregivers, with arrangements varying from live-in situations to regular scheduled hours.`,
    sections: [
      {
        type: "services",
        heading: "Nanny Services",
        content: \`**Childcare Duties**
- Full-time supervision
- Meals and snacks
- Educational activities
- Outdoor play
- Naps and bedtime
- School pickup/dropoff

**Household Duties**
- Children's laundry
- Tidying play areas
- Meal prep for kids
- Running child-related errands
- Organizing kids' belongings

**Types of Nannies**
- Full-time (40+ hours/week)
- Part-time
- Live-in
- Live-out
- Nanny share\`
      }
    ],
    faqs: [
      {
        question: "How much does a nanny cost?",
        answer: "Full-time nannies in the Navarro County area typically earn $12-$18 per hour, translating to $500-$750 per week for 40 hours. Live-in nannies may have different compensation structures. You'll also need to pay employer taxes (Social Security, Medicare) and may offer benefits. Nanny agencies charge placement fees."
      },
      {
        question: "What's the difference between a nanny and a babysitter?",
        answer: "Nannies are regular employees working consistent schedules—often full-time—with defined duties and usually an employment contract. Babysitters provide occasional care as needed without ongoing commitment. Nannies often have professional training and experience; babysitters may be teenagers or casual caregivers."
      },
      {
        question: "Do I need to pay taxes for a nanny?",
        answer: "Yes, if you pay a household employee $2,600 or more annually (as of 2024), you must pay Social Security and Medicare taxes, and possibly unemployment tax. You'll need an EIN and must provide a W-2. This applies whether you call them a nanny, housekeeper, or any other title. Consult a tax professional."
      }
    ],
    relatedServices: ["babysitter", "daycare", "home-health-care"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "tutoring",
    title: "Tutoring",
    category: "education_childcare",
    subcategory: "education",
    layout: 1,
    icon: "BookOpen",
    iconColor: "green",
    metaTitle: "Tutoring in Navarro County, TX | Academic Tutors Corsicana",
    metaDescription: "Tutoring services in Corsicana and Navarro County. Math, reading, and subject tutoring for elementary through high school students.",
    metaKeywords: "tutoring Corsicana, tutor Navarro County, math tutor, reading tutor, homework help",
    heroContent: `Every student learns differently, and sometimes classroom instruction isn't enough. Tutoring provides personalized attention that helps students master challenging subjects, build confidence, and achieve their academic potential.`,
    localContext: `Navarro County tutors work with students from Corsicana ISD and surrounding districts, offering support from elementary basics through high school advanced courses. Whether your student needs help catching up, staying on grade level, or preparing for college, local tutors provide customized assistance.`,
    sections: [
      {
        type: "services",
        heading: "Tutoring Services",
        content: \`**Subject Tutoring**
- Math (all levels)
- Reading and phonics
- Writing and grammar
- Science
- History/social studies
- Foreign languages

**Test Preparation**
- SAT prep
- ACT prep
- STAAR test help
- College entrance exams
- GED preparation

**Specialized Support**
- Learning differences
- Study skills
- Organization
- Homework help
- Enrichment\`
      }
    ],
    faqs: [
      {
        question: "How much does tutoring cost?",
        answer: "Individual tutoring in Navarro County typically costs $25-$60 per hour depending on the tutor's qualifications and subject complexity. Test prep specialists may charge more. Small group tutoring can be less expensive per student. Some tutors offer package discounts. Learning centers charge monthly fees."
      },
      {
        question: "How often should my child be tutored?",
        answer: "Most students benefit from 1-2 sessions per week for consistent progress. More intensive needs might require more frequent sessions initially. Consistency matters more than frequency—regular weekly sessions are more effective than sporadic intensive ones. Discuss your child's needs with the tutor."
      },
      {
        question: "How do I find a good tutor?",
        answer: "Ask for recommendations from teachers or other parents. Verify qualifications and experience with your child's specific needs. Request references and check them. Look for tutors who explain their approach and communicate regularly about progress. A good personality fit with your child matters."
      }
    ],
    relatedServices: ["test-prep", "music-lessons", "language-school"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "music-lessons",
    title: "Music Lessons",
    category: "education_childcare",
    subcategory: "education",
    layout: 2,
    icon: "Music",
    iconColor: "purple",
    metaTitle: "Music Lessons in Navarro County, TX | Music Instruction Corsicana",
    metaDescription: "Music lessons in Corsicana and Navarro County. Piano, guitar, voice, drums, and instrument instruction for all ages and skill levels.",
    metaKeywords: "music lessons Corsicana, music teacher Navarro County, piano lessons, guitar lessons, voice lessons",
    heroContent: `Learning music develops discipline, creativity, and cognitive skills while providing a lifelong source of enjoyment. Navarro County music teachers offer instruction in various instruments and voice, welcoming students from beginners to advanced players.`,
    localContext: `Music instruction in Navarro County includes private teachers, music schools, and school band programs. Whether your interest is classical piano, rock guitar, or vocal performance, local instructors can help develop your abilities. Many teachers offer lessons at their studios, in students' homes, or online.`,
    sections: [
      {
        type: "services",
        heading: "Music Instruction",
        content: \`**Instruments**
- Piano/keyboard
- Guitar (acoustic, electric, bass)
- Voice/singing
- Drums and percussion
- Violin
- Wind instruments

**Lesson Types**
- Private lessons
- Group classes
- Online lessons
- In-home instruction
- Studio lessons

**Programs**
- Beginner instruction
- Intermediate development
- Advanced technique
- Music theory
- Performance preparation\`
      }
    ],
    faqs: [
      {
        question: "How much do music lessons cost?",
        answer: "Private music lessons in Navarro County typically run $20-$45 for a 30-minute lesson or $35-$75 for an hour. Prices vary by instrument, teacher experience, and lesson location. Group lessons cost less per student. Many teachers offer monthly packages. Book/material costs are usually additional."
      },
      {
        question: "What age should my child start music lessons?",
        answer: "Children can start piano and violin as young as 3-4 with Suzuki method instruction. Most instruments are appropriate to begin at ages 6-8 when children can focus for lesson periods. Guitar and drums typically start around age 7-8. Voice lessons often begin around age 8-10. Individual readiness varies."
      },
      {
        question: "Do I need to buy an instrument before starting lessons?",
        answer: "Discuss this with your teacher before buying. Many teachers can advise on appropriate instruments for beginners and may know of rental options or good deals. For piano, you'll need access to a keyboard or piano for practice. Some stores offer rent-to-own programs."
      }
    ],
    relatedServices: ["piano-lessons", "guitar-lessons", "dance-studio"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "piano-lessons",
    title: "Piano Lessons",
    category: "education_childcare",
    subcategory: "education",
    layout: 3,
    icon: "Music2",
    iconColor: "slate",
    metaTitle: "Piano Lessons in Navarro County, TX | Piano Teacher Corsicana",
    metaDescription: "Piano lessons in Corsicana and Navarro County. Classical, contemporary, and beginner piano instruction for children and adults.",
    metaKeywords: "piano lessons Corsicana, piano teacher Navarro County, learn piano, keyboard lessons",
    heroContent: `Piano is often the ideal first instrument—it teaches music theory visually, builds strong technique foundations, and translates to learning other instruments more easily. Navarro County piano teachers welcome students of all ages and abilities.`,
    localContext: `From young beginners to adults fulfilling a lifelong dream, piano students in Navarro County have access to qualified instructors. Many offer lessons in their home studios while some teach in students' homes or online. Recital opportunities help students gain performance experience.`,
    sections: [
      {
        type: "services",
        heading: "Piano Instruction",
        content: \`**Lesson Focus**
- Proper technique
- Music reading
- Theory basics
- Repertoire building
- Performance skills

**Styles**
- Classical piano
- Contemporary/pop
- Jazz basics
- Hymns and church music
- Musical theater

**Special Programs**
- Recital preparation
- Competition prep
- Music theory testing
- Adult beginner programs\`
      }
    ],
    faqs: [
      {
        question: "How long are piano lessons?",
        answer: "Young beginners (ages 5-7) typically start with 30-minute lessons. Elementary students often take 30-45 minute lessons. Intermediate and advanced students benefit from 45-60 minute lessons. Your teacher will recommend appropriate lesson length based on age and level."
      },
      {
        question: "Do I need a piano at home to take lessons?",
        answer: "Yes, regular practice is essential for progress. A keyboard with weighted keys (88 keys for serious students) can work for beginners. Acoustic pianos are preferred as students advance. Some families start with a keyboard to confirm interest before investing in a piano."
      },
      {
        question: "How long until my child can play songs?",
        answer: "Beginning students can learn simple songs within the first few weeks. Familiar melodies take 1-3 months. More complex pieces develop over 6-12 months. Progress depends on practice consistency, lesson frequency, and the individual student. Celebrate small victories along the way."
      }
    ],
    relatedServices: ["music-lessons", "guitar-lessons"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "guitar-lessons",
    title: "Guitar Lessons",
    category: "education_childcare",
    subcategory: "education",
    layout: 4,
    icon: "Music",
    iconColor: "amber",
    metaTitle: "Guitar Lessons in Navarro County, TX | Guitar Teacher Corsicana",
    metaDescription: "Guitar lessons in Corsicana and Navarro County. Acoustic, electric, and bass guitar instruction for beginners through advanced players.",
    metaKeywords: "guitar lessons Corsicana, guitar teacher Navarro County, learn guitar, bass lessons",
    heroContent: `Guitar is one of the most popular instruments for good reason—it's portable, versatile, and central to countless musical styles. Whether you want to strum campfire songs or shred heavy metal, Navarro County guitar teachers can help you reach your goals.`,
    localContext: `Texas has deep guitar roots across country, blues, and rock genres, and Navarro County players can learn from instructors experienced in various styles. Local teachers work with students from first-time strummers to gigging musicians looking to expand their skills.`,
    sections: [
      {
        type: "services",
        heading: "Guitar Instruction",
        content: \`**Instruments**
- Acoustic guitar
- Electric guitar
- Bass guitar
- Classical guitar

**Skills**
- Chord basics
- Strumming patterns
- Fingerpicking
- Lead guitar
- Music reading/tabs
- Theory application

**Styles**
- Country
- Rock
- Blues
- Pop
- Classical
- Metal/alternative\`
      }
    ],
    faqs: [
      {
        question: "Should I start on acoustic or electric guitar?",
        answer: "Both are valid starting points. Acoustic guitar builds finger strength and doesn't require an amp. Electric guitars are easier on fingers and better for rock/metal styles. Consider what music you want to play. Many players have both. Your teacher can advise based on your goals."
      },
      {
        question: "Do I need my own guitar for lessons?",
        answer: "Yes, you'll need a guitar for home practice. Beginning guitars suitable for learning run $100-$300. Don't buy the cheapest option—poorly made instruments are frustrating to play. Ask your teacher for recommendations before purchasing. Some teachers have loaners for the first lesson or two."
      },
      {
        question: "How long does it take to learn guitar?",
        answer: "Basic chords and simple songs can be learned in 1-3 months with regular practice. Playing songs confidently takes 6-12 months. Becoming an accomplished player takes years of dedicated practice. Progress depends on practice consistency—even 15-20 minutes daily makes a difference."
      }
    ],
    relatedServices: ["music-lessons", "piano-lessons"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "dance-studio",
    title: "Dance Studio",
    category: "education_childcare",
    subcategory: "education",
    layout: 5,
    icon: "HeartPulse",
    iconColor: "pink",
    metaTitle: "Dance Studio in Navarro County, TX | Dance Classes Corsicana",
    metaDescription: "Dance studios in Corsicana and Navarro County. Ballet, tap, jazz, hip-hop, and contemporary dance instruction for all ages.",
    metaKeywords: "dance studio Corsicana, dance classes Navarro County, ballet, jazz dance, hip hop dance",
    heroContent: `Dance develops grace, strength, discipline, and self-expression. Navarro County dance studios offer instruction in multiple styles, from classical ballet to high-energy hip-hop, for students of all ages and abilities.`,
    localContext: `Local dance studios in Corsicana provide classes, recital opportunities, and competitive teams for dedicated dancers. From toddler creative movement to adult fitness classes, dance is accessible to everyone. Many studios participate in regional competitions and hold annual recitals.`,
    sections: [
      {
        type: "services",
        heading: "Dance Instruction",
        content: \`**Dance Styles**
- Ballet
- Tap
- Jazz
- Hip-hop
- Contemporary
- Lyrical
- Pom/cheer

**Age Groups**
- Toddler/creative movement (2-4)
- Pre-dance (4-6)
- Youth classes
- Teen classes
- Adult classes

**Programs**
- Recreational classes
- Competitive teams
- Private lessons
- Recital preparation
- Summer intensives\`
      }
    ],
    faqs: [
      {
        question: "How much do dance classes cost?",
        answer: "Monthly tuition varies by class frequency. Single weekly classes run $45-$75/month. Multiple classes offer better value, with competitive dancers paying $150-$300+ monthly. Additional costs include costumes ($50-$150 for recital), shoes ($20-$60), and competition fees if applicable."
      },
      {
        question: "What age should my child start dance?",
        answer: "Many studios offer creative movement for ages 2-3 and pre-ballet/tap at age 4. Formal technique training typically begins around age 6-7 when children can follow more structured instruction. However, it's never too late to start—studios welcome beginners of all ages."
      },
      {
        question: "What should my child wear to dance class?",
        answer: "Most studios require leotards and tights for ballet, with specific shoes for each style (ballet slippers, tap shoes, jazz shoes). Recreational hip-hop classes often allow comfortable athletic wear. Studios provide dress code details at registration. Hair should be secured away from the face."
      }
    ],
    relatedServices: ["music-lessons", "martial-arts", "gym"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "martial-arts",
    title: "Martial Arts School",
    category: "education_childcare",
    subcategory: "education",
    layout: 1,
    icon: "Swords",
    iconColor: "red",
    metaTitle: "Martial Arts in Navarro County, TX | Karate Classes Corsicana",
    metaDescription: "Martial arts schools in Corsicana and Navarro County. Karate, taekwondo, jiu-jitsu, and self-defense classes for children and adults.",
    metaKeywords: "martial arts Corsicana, karate Navarro County, taekwondo, jiu-jitsu, self-defense classes",
    heroContent: `Martial arts training builds physical fitness, mental discipline, and self-confidence. Navarro County martial arts schools teach various styles to students of all ages, emphasizing respect, self-control, and practical self-defense skills.`,
    localContext: `From traditional karate dojos to modern MMA training facilities, Navarro County offers martial arts instruction for varied interests. Programs for children focus on discipline and confidence-building, while adult classes emphasize fitness, self-defense, and stress relief.`,
    sections: [
      {
        type: "services",
        heading: "Martial Arts Programs",
        content: \`**Disciplines**
- Karate
- Taekwondo
- Brazilian Jiu-Jitsu
- Judo
- Kung Fu
- MMA/mixed martial arts

**Programs**
- Kids classes (ages 4-7)
- Youth classes (ages 8-12)
- Teen programs
- Adult classes
- Family classes

**Special Focus**
- Self-defense courses
- Competition training
- Belt testing
- Summer camps\`
      }
    ],
    faqs: [
      {
        question: "How much do martial arts classes cost?",
        answer: "Monthly tuition at Navarro County martial arts schools typically ranges from $80-$150 for 2-3 classes per week. Some schools require contracts; others offer month-to-month options. Additional costs include uniforms ($30-$60), belt testing fees ($25-$75), and equipment as you advance."
      },
      {
        question: "What age can children start martial arts?",
        answer: "Many schools offer \"little ninja\" or similar programs for ages 3-5 focusing on basic motor skills, listening, and simple movements. Formal martial arts instruction typically begins at ages 5-6. Programs are structured for developmental appropriateness at each age level."
      },
      {
        question: "Which martial art is best for self-defense?",
        answer: "All martial arts teach self-defense aspects. Brazilian Jiu-Jitsu excels at ground control. Krav Maga focuses specifically on real-world defense. Taekwondo emphasizes powerful kicks. The \"best\" art depends on your goals, body type, and what school environment appeals to you. Try introductory classes at several schools."
      }
    ],
    relatedServices: ["gym", "personal-trainer", "yoga-instructor"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "driving-school",
    title: "Driving School",
    category: "education_childcare",
    subcategory: "education",
    layout: 2,
    icon: "Car",
    iconColor: "blue",
    metaTitle: "Driving School in Navarro County, TX | Driver Education Corsicana",
    metaDescription: "Driving schools in Corsicana and Navarro County. Driver education courses, behind-the-wheel training, and license preparation for teens and adults.",
    metaKeywords: "driving school Corsicana, driver education Navarro County, driving lessons, learners permit",
    heroContent: `Learning to drive safely is essential for independence. Navarro County driving schools provide the required classroom instruction and behind-the-wheel training teens need for their license, plus programs for adults who need to learn or refresh their driving skills.`,
    localContext: `Texas requires driver education for license applicants under 25. Navarro County driving schools offer TDLR-approved courses that satisfy state requirements, with both classroom and online options available. Behind-the-wheel training on local roads prepares new drivers for the specific driving conditions they'll encounter.`,
    sections: [
      {
        type: "services",
        heading: "Driver Education",
        content: \`**Teen Programs**
- Classroom instruction (32 hours)
- Behind-the-wheel training (14 hours)
- Observation hours (7 hours)
- Permit test preparation
- License test preparation

**Adult Programs**
- Adult driver education (6 hours)
- Behind-the-wheel training
- Defensive driving courses
- License renewal

**Additional Services**
- Parent-taught course materials
- License test scheduling
- Driving test vehicles\`
      }
    ],
    faqs: [
      {
        question: "How much does driver education cost?",
        answer: "Complete teen driver education packages in Navarro County range from $350-$500, including classroom instruction and required behind-the-wheel training. Adult courses are less expensive at $50-$100 for classroom only. Additional behind-the-wheel hours cost $40-$60 each if needed."
      },
      {
        question: "What age can my teen start driver education in Texas?",
        answer: "Teens can begin classroom instruction at age 14. They can obtain a learner permit at age 15. Behind-the-wheel training occurs after receiving the permit. A provisional license is available at 16 with completed driver education. Full unrestricted licenses are issued at 18."
      },
      {
        question: "Can I teach my teen to drive myself?",
        answer: "Texas allows parent-taught driver education for teens. You must purchase TDLR-approved course materials, be at least 21, have a valid license for 3+ years, and not have DWI convictions. You provide the 44+ hours of practice. Many families combine parent teaching with professional lessons."
      }
    ],
    relatedServices: ["auto-repair"],
    externalResources: [
      { name: "Texas DPS Driver License Information", url: "https://www.dps.texas.gov/section/driver-license" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "art-classes",
    title: "Art Classes",
    category: "education_childcare",
    subcategory: "education",
    layout: 3,
    icon: "Palette",
    iconColor: "orange",
    metaTitle: "Art Classes in Navarro County, TX | Art Instruction Corsicana",
    metaDescription: "Art classes in Corsicana and Navarro County. Drawing, painting, pottery, and creative arts instruction for children and adults.",
    metaKeywords: "art classes Corsicana, art lessons Navarro County, painting classes, drawing lessons, pottery",
    heroContent: `Art education develops creativity, observation skills, and self-expression at any age. Navarro County art instructors offer classes in drawing, painting, pottery, and other media for students from beginners to experienced artists.`,
    localContext: `From children's after-school programs to adult painting nights, art instruction is available throughout Navarro County. Local artists teach in studios, community centers, and private spaces, offering everything from structured technique courses to open creative sessions.`,
    sections: [
      {
        type: "services",
        heading: "Art Instruction",
        content: \`**Mediums**
- Drawing (pencil, charcoal)
- Painting (acrylic, oil, watercolor)
- Pottery and ceramics
- Sculpture
- Mixed media
- Digital art

**Class Types**
- Children's classes
- Teen programs
- Adult instruction
- Private lessons
- Group workshops
- Paint parties

**Focus Areas**
- Technique development
- Portfolio preparation
- Hobby exploration
- Therapeutic art\`
      }
    ],
    faqs: [
      {
        question: "How much do art classes cost?",
        answer: "Art classes in Navarro County typically run $15-$40 per class or $100-$200 for monthly programs (4-8 sessions). Paint parties and one-time workshops cost $30-$60 including materials. Private lessons run $40-$75 per hour. Materials may be included or additional depending on the program."
      },
      {
        question: "What age can children start art classes?",
        answer: "Many programs offer art exploration for ages 4-5. Formal instruction in techniques typically starts around age 6-7 when fine motor skills are more developed. Programs are designed for developmental stages—young children focus on creative exploration while older students learn specific techniques."
      },
      {
        question: "Do I need to bring my own supplies?",
        answer: "Most group classes include materials in the fee. Ongoing students may need to purchase their own supplies after introductory sessions. Private lessons may require you to provide materials. Ask about supply requirements when registering—instructors can recommend appropriate materials for beginners."
      }
    ],
    relatedServices: ["music-lessons", "photography-classes"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // RETAIL
  // ============================================
  {
    slug: "furniture-store",
    title: "Furniture Store",
    category: "retail",
    subcategory: "home",
    layout: 1,
    icon: "Armchair",
    iconColor: "brown",
    metaTitle: "Furniture Store in Navarro County, TX | Home Furniture Corsicana",
    metaDescription: "Furniture stores in Corsicana and Navarro County. Living room, bedroom, dining, and outdoor furniture with delivery and financing options.",
    metaKeywords: "furniture store Corsicana, furniture Navarro County, living room furniture, bedroom sets, mattress",
    heroContent: `Quality furniture transforms a house into a home. Navarro County furniture stores offer a range of styles and price points, from budget-friendly basics to premium furnishings, with local delivery and setup services.`,
    localContext: `Shopping for furniture locally in Navarro County means you can see and feel pieces before buying, receive faster delivery than online ordering, and support local businesses. From national chains to family-owned stores, you'll find options for every room and budget.`,
    sections: [
      {
        type: "services",
        heading: "Furniture Categories",
        content: \`**Living Room**
- Sofas and sectionals
- Recliners
- Coffee and end tables
- Entertainment centers
- Accent chairs

**Bedroom**
- Bedroom sets
- Mattresses
- Dressers and nightstands
- Headboards and frames

**Dining**
- Dining tables and chairs
- Bar stools
- Buffets and servers

**Other**
- Home office furniture
- Outdoor/patio furniture
- Kids' furniture
- Accent pieces\`
      }
    ],
    faqs: [
      {
        question: "Do furniture stores offer financing?",
        answer: "Most furniture stores offer financing options including 0% interest promotions for qualified buyers. Terms vary from 6 months to several years. Store credit cards, third-party financing, and layaway programs are common. Read all terms carefully, as deferred interest can be significant if not paid off in the promotional period."
      },
      {
        question: "How long does furniture delivery take?",
        answer: "In-stock items often deliver within 1-2 weeks. Special orders and custom pieces may take 6-12 weeks. Delivery fees in Navarro County typically run $50-$150 depending on distance and whether setup is included. Some stores offer free delivery on purchases over a certain amount."
      },
      {
        question: "Should I buy furniture online or in-store?",
        answer: "In-store shopping lets you test comfort, see actual colors/textures, and avoid shipping hassles. Local stores offer delivery and may resolve issues more easily. Online can offer more selection and sometimes lower prices. For major purchases like sofas, testing in person is recommended."
      }
    ],
    relatedServices: ["appliance-store", "mattress-store", "interior-painting"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "appliance-store",
    title: "Appliance Store",
    category: "retail",
    subcategory: "home",
    layout: 2,
    icon: "Refrigerator",
    iconColor: "slate",
    metaTitle: "Appliance Store in Navarro County, TX | Home Appliances Corsicana",
    metaDescription: "Appliance stores in Corsicana and Navarro County. Refrigerators, washers, dryers, stoves, dishwashers, and more with delivery and installation.",
    metaKeywords: "appliance store Corsicana, appliances Navarro County, refrigerator, washer dryer, stove",
    heroContent: `When appliances fail, you need a local source for quick replacement. Navarro County appliance stores stock major brands with same-day or next-day delivery options, installation services, and haul-away of old units.`,
    localContext: `Local appliance dealers in Navarro County offer advantages over big-box stores: personalized service, competitive pricing, delivery by employees who know the area, and relationships that matter when you need warranty service. Many have served the community for decades.`,
    sections: [
      {
        type: "services",
        heading: "Appliance Categories",
        content: \`**Kitchen**
- Refrigerators
- Ranges and ovens
- Dishwashers
- Microwaves
- Range hoods
- Freezers

**Laundry**
- Washing machines
- Dryers
- Stackable units
- All-in-one units

**Additional**
- HVAC units (some stores)
- Water heaters
- Small appliances
- Parts and accessories\`
      }
    ],
    faqs: [
      {
        question: "Do appliance stores install what they sell?",
        answer: "Most appliance stores offer delivery and basic installation. Standard connections (water, electric) are typically included or available for $50-$150. Gas connections usually require a licensed plumber. Old appliance haul-away is often available for $25-$50. Complex installations may require additional trades."
      },
      {
        question: "How long do appliances typically last?",
        answer: "Average lifespans: refrigerators 10-15 years, washers/dryers 10-12 years, dishwashers 8-10 years, ranges 15-20 years for gas, 13-15 for electric. Quality and usage affect lifespan. Consider efficiency improvements when replacing older units—new appliances use significantly less energy."
      },
      {
        question: "Should I buy extended warranties on appliances?",
        answer: "Extended warranties are generally not recommended for most appliances—repairs often cost less than warranty prices. However, for complex, computerized appliances (smart refrigerators, high-end washers), extended coverage may provide peace of mind. Check what the manufacturer's warranty covers first."
      }
    ],
    relatedServices: ["furniture-store", "hvac", "electrician", "plumber"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "mattress-store",
    title: "Mattress Store",
    category: "retail",
    subcategory: "home",
    layout: 3,
    icon: "BedDouble",
    iconColor: "indigo",
    metaTitle: "Mattress Store in Navarro County, TX | Mattresses Corsicana",
    metaDescription: "Mattress stores in Corsicana and Navarro County. Quality mattresses, adjustable bases, and bedding with delivery and old mattress removal.",
    metaKeywords: "mattress store Corsicana, mattress Navarro County, memory foam, adjustable bed, queen mattress",
    heroContent: `Sleep quality affects everything—your health, mood, and daily performance. Navarro County mattress stores help you find the right mattress for your body and sleep style, with options to test before you buy.`,
    localContext: `Shopping for a mattress in Navarro County lets you lie on options before purchasing—essential for such a personal decision. Local stores offer competitive pricing, fast delivery, and no-hassle removal of your old mattress. Sales associates can explain the differences between technologies.`,
    sections: [
      {
        type: "services",
        heading: "Mattress Options",
        content: \`**Mattress Types**
- Innerspring
- Memory foam
- Hybrid
- Latex
- Pillow top
- Adjustable firmness

**Sizes**
- Twin and Twin XL
- Full/Double
- Queen
- King
- California King

**Related Products**
- Adjustable bases
- Foundations/box springs
- Pillows
- Mattress protectors
- Bedding\`
      }
    ],
    faqs: [
      {
        question: "How much should I spend on a mattress?",
        answer: "Quality mattresses range from $500-$2,000 for queen size. Budget options under $500 may not last or provide adequate support. You spend roughly a third of your life in bed—a good mattress is worth the investment. Many stores offer 0% financing to spread the cost."
      },
      {
        question: "How often should I replace my mattress?",
        answer: "Most mattresses should be replaced every 7-10 years. Signs you need a new mattress include sagging, lumps, waking with pain or stiffness, sleeping better elsewhere, and visible wear. Rotating your mattress regularly can extend its life."
      },
      {
        question: "What's the best type of mattress?",
        answer: "There's no universal \"best\"—it depends on your sleep position, body type, and preferences. Side sleepers often prefer softer surfaces. Back sleepers need medium support. Stomach sleepers do better with firmer mattresses. Test different types and trust how your body feels."
      }
    ],
    relatedServices: ["furniture-store"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "thrift-store",
    title: "Thrift Store",
    category: "retail",
    subcategory: "general",
    layout: 4,
    icon: "ShoppingBag",
    iconColor: "green",
    metaTitle: "Thrift Store in Navarro County, TX | Secondhand Shop Corsicana",
    metaDescription: "Thrift stores in Corsicana and Navarro County. Affordable secondhand clothing, furniture, household items, and treasures.",
    metaKeywords: "thrift store Corsicana, secondhand Navarro County, consignment, used furniture, vintage",
    heroContent: `Thrift shopping offers treasure hunting at affordable prices. Navarro County thrift stores feature ever-changing inventory of clothing, furniture, household goods, and unique finds, with proceeds often supporting local charities.`,
    localContext: `From national chains to charity-run shops, Navarro County has thrift options for every budget-conscious shopper. Regular visitors know that inventory changes frequently, making each visit an adventure. Many stores accept donations, making it easy to declutter while supporting the community.`,
    sections: [
      {
        type: "services",
        heading: "What You'll Find",
        content: \`**Clothing**
- Men's, women's, children's
- Shoes and accessories
- Vintage and retro
- Professional attire

**Household**
- Furniture
- Kitchen items
- Decor
- Linens and bedding
- Small appliances

**Other**
- Books and media
- Toys and games
- Sporting goods
- Electronics
- Seasonal items\`
      }
    ],
    faqs: [
      {
        question: "When is the best time to shop thrift stores?",
        answer: "Mornings on restock days offer first pick of new items—ask staff which days they put out new merchandise. Avoid weekends if you prefer less crowded conditions. End-of-month and first-of-month can bring more donations as people move or declutter."
      },
      {
        question: "Can I donate items to thrift stores?",
        answer: "Most thrift stores accept donations during business hours. Items should be clean and in working condition. Some stores accept furniture and large items; others don't. Call ahead for furniture donations. Tax-deductible receipts are available at charitable thrift stores."
      },
      {
        question: "Are thrift store prices negotiable?",
        answer: "Most chain thrift stores have set prices, but independent and charity shops may negotiate, especially on furniture and higher-priced items. Ask politely if the price is firm. Some stores offer discount days or loyalty programs for additional savings."
      }
    ],
    relatedServices: ["furniture-store", "pawn-shop"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "pawn-shop",
    title: "Pawn Shop",
    category: "retail",
    subcategory: "general",
    layout: 5,
    icon: "Store",
    iconColor: "amber",
    metaTitle: "Pawn Shop in Navarro County, TX | Pawn & Buy/Sell Corsicana",
    metaDescription: "Pawn shops in Corsicana and Navarro County. Quick cash loans, buy/sell electronics, jewelry, tools, firearms, and more.",
    metaKeywords: "pawn shop Corsicana, pawn Navarro County, quick cash, sell jewelry, buy tools",
    heroContent: `Pawn shops offer quick access to cash and a marketplace for secondhand goods. Navarro County pawn shops provide short-term collateral loans and buy/sell electronics, jewelry, tools, firearms, and more at competitive prices.`,
    localContext: `Pawn shops have served Navarro County residents for generations, providing financial flexibility when banks can't help and affordable alternatives to retail prices on quality merchandise. Modern pawn shops are clean, professional operations regulated by state law.`,
    sections: [
      {
        type: "services",
        heading: "Pawn Shop Services",
        content: \`**Pawn Loans**
- Collateral-based loans
- No credit check
- Quick cash
- 30-day terms (renewable)

**Buy/Sell**
- Jewelry and gold
- Electronics
- Tools
- Firearms
- Musical instruments
- Sporting goods
- Collectibles

**Other Services**
- Jewelry evaluation
- Gold buying
- Layaway programs\`
      }
    ],
    faqs: [
      {
        question: "How do pawn loans work?",
        answer: "You bring an item of value as collateral. The pawn shop assesses its worth and offers a loan amount (typically 25-60% of resale value). You receive cash immediately. Loans are typically 30 days with interest. Pay back the loan plus interest to retrieve your item, or let it go if you can't pay."
      },
      {
        question: "What items do pawn shops accept?",
        answer: "Most pawn shops accept jewelry, gold, electronics, tools, firearms, musical instruments, and sporting goods. Items must be in working condition with good resale value. Some items (computers, appliances) may not be accepted or have limited value. Bring IDs and proof of ownership."
      },
      {
        question: "Do I need ID to pawn or sell items?",
        answer: "Yes, Texas law requires valid government-issued ID for all pawn and purchase transactions. Shops record your information and report transactions to law enforcement databases. This helps prevent traffic in stolen property and protects both buyers and sellers."
      }
    ],
    relatedServices: ["jewelry-store", "gun-shop", "thrift-store"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "jewelry-store",
    title: "Jewelry Store",
    category: "retail",
    subcategory: "specialty",
    layout: 1,
    icon: "Gem",
    iconColor: "amber",
    metaTitle: "Jewelry Store in Navarro County, TX | Jewelry Shop Corsicana",
    metaDescription: "Jewelry stores in Corsicana and Navarro County. Engagement rings, wedding bands, fine jewelry, watches, and repair services.",
    metaKeywords: "jewelry store Corsicana, jewelry Navarro County, engagement ring, wedding band, jewelry repair",
    heroContent: `Fine jewelry marks life's most meaningful moments—engagements, weddings, anniversaries, and milestones. Navarro County jewelry stores offer curated selections from classic to contemporary, with expert guidance and services like custom design and repair.`,
    localContext: `Local jewelers in Corsicana and Navarro County provide personalized service that chain stores can't match. Many have served the community for generations, building relationships with families across major life events. They offer repair services, custom work, and honest assessments.`,
    sections: [
      {
        type: "services",
        heading: "Jewelry Products & Services",
        content: \`**Fine Jewelry**
- Engagement rings
- Wedding bands
- Diamond jewelry
- Gemstone pieces
- Gold and silver jewelry
- Watches

**Services**
- Ring sizing
- Jewelry repair
- Watch battery/repair
- Custom design
- Appraisals
- Cleaning and inspection

**Occasions**
- Engagement/wedding
- Anniversary gifts
- Birthday presents
- Graduation gifts\`
      }
    ],
    faqs: [
      {
        question: "How much should I spend on an engagement ring?",
        answer: "The \"two months salary\" rule is outdated marketing. Spend what's comfortable for your budget while meeting your partner's expectations. Quality matters more than carat size—a well-cut smaller diamond can look better than a larger poorly cut stone. Local jewelers can help maximize your budget."
      },
      {
        question: "Can jewelry stores resize any ring?",
        answer: "Most rings can be resized, but some designs (eternity bands, tension settings, certain styles) are difficult or impossible to resize. Sizing up is usually easier than sizing down. Bring rings for assessment—a jeweler can advise what's possible and quote the cost."
      },
      {
        question: "How often should jewelry be cleaned and inspected?",
        answer: "Professional cleaning and inspection every 6-12 months is recommended for jewelry worn daily. This catches loose stones before they're lost and keeps pieces looking their best. Many jewelers offer free cleaning for items purchased from them."
      }
    ],
    relatedServices: ["pawn-shop", "watch-repair"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "gun-shop",
    title: "Gun Shop",
    category: "retail",
    subcategory: "specialty",
    layout: 2,
    icon: "Target",
    iconColor: "slate",
    metaTitle: "Gun Shop in Navarro County, TX | Firearms Dealer Corsicana",
    metaDescription: "Gun shops in Corsicana and Navarro County. Firearms, ammunition, accessories, and transfers with knowledgeable staff.",
    metaKeywords: "gun shop Corsicana, firearms Navarro County, gun store, ammunition, FFL transfer",
    heroContent: `Whether you're a first-time buyer, hunter, or experienced shooter, Navarro County gun shops provide quality firearms, ammunition, and accessories with knowledgeable staff who can answer questions and help you find the right firearm for your needs.`,
    localContext: `Firearm ownership is part of Texas culture, and Navarro County gun shops serve hunters, sport shooters, and those seeking home protection. Local dealers know the products they sell and can guide you through purchases and legal requirements.`,
    sections: [
      {
        type: "services",
        heading: "Products & Services",
        content: \`**Firearms**
- Handguns
- Rifles
- Shotguns
- Used firearms
- Consignment sales

**Ammunition & Accessories**
- Ammunition (all calibers)
- Holsters and cases
- Optics and scopes
- Cleaning supplies
- Gun safes

**Services**
- FFL transfers
- Trade-ins
- Consignment
- Special orders
- Basic gunsmithing\`
      }
    ],
    faqs: [
      {
        question: "What do I need to buy a gun in Texas?",
        answer: "You must be 21 to purchase a handgun, 18 for long guns (rifles/shotguns). You need a valid government ID showing Texas residency. Purchases from dealers require a federal background check (usually instant). No permit is required to purchase. Private sales between Texas residents don't require background checks."
      },
      {
        question: "What is an FFL transfer?",
        answer: "If you buy a gun online or out of state, it must be shipped to a licensed dealer (FFL) who conducts the background check and handles the legal transfer. Local gun shops charge $20-$50 for this service. Call ahead to confirm they'll accept your transfer and their fee."
      },
      {
        question: "Do I need a license to carry a handgun in Texas?",
        answer: "As of September 2021, Texas allows permitless carry (constitutional carry) for most adults 21 and older. You can carry openly or concealed without a license. However, the License to Carry (LTC) still offers benefits including reciprocity in other states."
      }
    ],
    relatedServices: ["sporting-goods", "hunting-lease"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "sporting-goods",
    title: "Sporting Goods",
    category: "retail",
    subcategory: "specialty",
    layout: 3,
    icon: "Dumbbell",
    iconColor: "green",
    metaTitle: "Sporting Goods in Navarro County, TX | Sports Equipment Corsicana",
    metaDescription: "Sporting goods stores in Corsicana and Navarro County. Athletic equipment, outdoor gear, hunting and fishing supplies, and team sports.",
    metaKeywords: "sporting goods Corsicana, sports equipment Navarro County, hunting gear, fishing tackle, outdoor",
    heroContent: `From team sports to outdoor adventures, Navarro County sporting goods stores equip athletes and enthusiasts of all levels. Find the gear you need for football, hunting, fishing, camping, and every activity in between.`,
    localContext: `Texas's outdoor heritage means sporting goods stores in Navarro County stock serious hunting and fishing gear alongside standard athletic equipment. Local stores understand the specific needs of area hunters and fishermen, stocking regionally appropriate tackle and gear.`,
    sections: [
      {
        type: "services",
        heading: "Product Categories",
        content: \`**Team Sports**
- Football
- Baseball/softball
- Basketball
- Soccer
- Volleyball
- Uniforms and apparel

**Outdoor**
- Hunting gear
- Fishing equipment
- Camping supplies
- Hiking gear
- Shooting sports

**Fitness**
- Exercise equipment
- Athletic footwear
- Workout apparel
- Fitness accessories\`
      }
    ],
    faqs: [
      {
        question: "Can sporting goods stores string tennis rackets or do repairs?",
        answer: "Some sporting goods stores offer equipment services like racket stringing, skate sharpening, or bike maintenance. Services vary by location—larger stores are more likely to have specialized services. Call ahead to confirm if your store offers specific services."
      },
      {
        question: "Do local stores match online prices?",
        answer: "Policies vary by store. Some match major online retailers; others don't. Ask before you buy. Consider that local purchase means immediate availability, easier returns, and supporting local business. Service and expertise often outweigh small price differences."
      },
      {
        question: "What hunting and fishing licenses do I need in Texas?",
        answer: "Texas requires hunting and fishing licenses for anyone over 17. Licenses are sold at sporting goods stores, online through Texas Parks & Wildlife, and at various retailers. You may need additional stamps or endorsements for specific activities. License year runs September 1 to August 31."
      }
    ],
    relatedServices: ["gun-shop", "hunting-lease", "gym"],
    externalResources: [
      { name: "Texas Parks & Wildlife Licenses", url: "https://tpwd.texas.gov/regulations/outdoor-annual/licenses" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "pet-store",
    title: "Pet Store",
    category: "retail",
    subcategory: "specialty",
    layout: 4,
    icon: "Dog",
    iconColor: "orange",
    metaTitle: "Pet Store in Navarro County, TX | Pet Supplies Corsicana",
    metaDescription: "Pet stores in Corsicana and Navarro County. Pet food, supplies, toys, and accessories for dogs, cats, birds, fish, and small animals.",
    metaKeywords: "pet store Corsicana, pet supplies Navarro County, dog food, cat food, pet accessories",
    heroContent: `Pets are family, and they deserve quality care. Navarro County pet stores stock premium foods, supplies, toys, and everything else you need to keep your furry, feathered, or finned friends healthy and happy.`,
    localContext: `From big-box pet retailers to local independent shops, Navarro County pet stores serve the area's many pet owners. Some specialize in quality nutrition and can help you choose the right food for your pet's needs. Others offer grooming services, training supplies, or fish and aquarium expertise.`,
    sections: [
      {
        type: "services",
        heading: "Pet Products",
        content: \`**Food & Nutrition**
- Premium dog food
- Cat food
- Bird seed
- Fish food
- Small animal food
- Raw and fresh options

**Supplies**
- Collars and leashes
- Beds and crates
- Bowls and feeders
- Litter and waste
- Grooming supplies

**Other**
- Toys
- Treats
- Aquariums and supplies
- Cages and habitats
- Health products\`
      }
    ],
    faqs: [
      {
        question: "Is premium pet food worth the extra cost?",
        answer: "Higher-quality foods often mean better nutrition, smaller portions needed, and fewer health issues over time. Look for foods with named meat as the first ingredient and minimal fillers. Staff at local pet stores can explain the differences and help choose appropriate options for your pet's age and needs."
      },
      {
        question: "Do pet stores offer grooming services?",
        answer: "Some pet stores, particularly larger chains, have in-store grooming salons. Services typically include baths, haircuts, nail trims, and ear cleaning. Prices vary by pet size and service. Independent pet stores may not offer grooming but can recommend local groomers."
      },
      {
        question: "Can I return opened pet food?",
        answer: "Policies vary by store. Many pet stores allow returns of opened food if your pet won't eat it—they'd rather help you find the right food than have a dissatisfied pet. Keep your receipt and check the store's return policy before purchasing."
      }
    ],
    relatedServices: ["veterinarian", "pet-groomer", "pet-boarding"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "nursery-garden",
    title: "Plant Nursery",
    category: "retail",
    subcategory: "garden",
    layout: 5,
    icon: "Flower2",
    iconColor: "green",
    metaTitle: "Plant Nursery in Navarro County, TX | Garden Center Corsicana",
    metaDescription: "Plant nurseries in Corsicana and Navarro County. Trees, shrubs, flowers, vegetable plants, and landscaping supplies for Texas gardens.",
    metaKeywords: "plant nursery Corsicana, garden center Navarro County, trees, shrubs, flowers, landscaping",
    heroContent: `Local plant nurseries know what grows in Navarro County's unique conditions. From native Texas plants to vegetables for your garden, nurseries stock plants suited to our Blackland Prairie climate and soil.`,
    localContext: `Navarro County's clay soil, hot summers, and variable rainfall make plant selection crucial. Local nurseries grow and source plants proven to thrive here, not generic stock from distant regions. Their staff can advise on soil amendments, watering schedules, and plant placement specific to our area.`,
    sections: [
      {
        type: "services",
        heading: "Nursery Products",
        content: \`**Plants**
- Trees (shade, fruit, ornamental)
- Shrubs
- Perennials
- Annuals
- Roses
- Native plants

**Garden**
- Vegetable starts
- Herbs
- Fruit plants
- Seeds
- Soil and amendments

**Supplies**
- Mulch
- Fertilizers
- Pest control
- Tools
- Containers\`
      }
    ],
    faqs: [
      {
        question: "When is the best time to plant in Navarro County?",
        answer: "Fall (September-November) is ideal for trees, shrubs, and perennials—roots establish before summer stress. Spring (after last frost, typically mid-March) is vegetable planting time. Summer planting is possible but requires extra watering. Avoid planting in the heat of July-August."
      },
      {
        question: "What plants do well in Navarro County's clay soil?",
        answer: "Many Texas natives thrive in clay: Texas sage, lantana, Mexican plum, cedar elm, and ornamental grasses. Roses and crape myrtles do well with proper care. Vegetables benefit from raised beds with amended soil. Staff at local nurseries know exactly what works here."
      },
      {
        question: "Do nurseries offer planting services?",
        answer: "Some nurseries offer delivery and planting services, especially for trees and large shrubs. This is convenient and ensures proper planting depth and technique. Prices vary based on plant size and location. Ask when purchasing—many include planting with the purchase of larger items."
      }
    ],
    relatedServices: ["landscaping", "lawn-care", "tree-service", "irrigation"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // LODGING & TRAVEL
  // ============================================
  {
    slug: "hotel",
    title: "Hotel",
    category: "lodging_travel",
    subcategory: "lodging",
    layout: 1,
    icon: "Building2",
    iconColor: "blue",
    metaTitle: "Hotels in Navarro County, TX | Hotel Accommodations Corsicana",
    metaDescription: "Hotels in Corsicana and Navarro County. Comfortable accommodations for business travelers, families, and visitors to the region.",
    metaKeywords: "hotel Corsicana, hotels Navarro County, accommodations, stay, lodging",
    heroContent: `Whether you're visiting for business, attending an event, or exploring the area, Navarro County hotels provide comfortable accommodations with modern amenities. Options range from budget-friendly to full-service properties.`,
    localContext: `Corsicana and Navarro County host visitors year-round—business travelers, families visiting loved ones, hunters in season, and tourists exploring Texas history. Hotels along I-45 offer convenient access, while properties in town put you closer to local restaurants and attractions.`,
    sections: [
      {
        type: "services",
        heading: "Hotel Amenities",
        content: \`**Common Amenities**
- Free WiFi
- Breakfast (many hotels)
- Pool
- Fitness center
- Business center
- Pet-friendly (some)

**Room Features**
- Comfortable beds
- Television
- Coffee maker
- Refrigerator
- Microwave
- Iron/ironing board

**Services**
- 24-hour front desk
- Meeting rooms (some)
- Laundry facilities
- Guest services\`
      }
    ],
    faqs: [
      {
        question: "What hotels are near I-45 in Corsicana?",
        answer: "Several national chain hotels are located near I-45 exits in Corsicana, providing easy highway access. Brands include Holiday Inn Express, Hampton Inn, Best Western, and budget options like Super 8 and Motel 6. Check current availability and rates directly with hotels or through booking sites."
      },
      {
        question: "Do Corsicana hotels allow pets?",
        answer: "Some hotels in Navarro County are pet-friendly, though policies and fees vary. Expect pet fees of $15-$50 per night. Weight limits and breed restrictions may apply. Always confirm pet policies when booking—not all properties that claim pet-friendly accept all animals."
      },
      {
        question: "Is there a hotel near Navarro College?",
        answer: "Hotels in Corsicana are a short drive from Navarro College's campus. During events like graduation or orientation, hotels fill quickly—book well in advance. Some properties offer discounts for visiting families; ask when reserving."
      }
    ],
    relatedServices: ["motel", "bed-breakfast", "vacation-rental"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "motel",
    title: "Motel",
    category: "lodging_travel",
    subcategory: "lodging",
    layout: 2,
    icon: "BedSingle",
    iconColor: "amber",
    metaTitle: "Motel in Navarro County, TX | Budget Lodging Corsicana",
    metaDescription: "Motels in Corsicana and Navarro County. Affordable overnight accommodations for travelers seeking budget-friendly stays.",
    metaKeywords: "motel Corsicana, budget motel Navarro County, cheap lodging, affordable stay",
    heroContent: `Motels offer straightforward, affordable lodging for travelers who need a clean room without premium prices. Navarro County motels along major routes provide convenient stops for those passing through or seeking budget-friendly accommodations.`,
    localContext: `I-45 and other routes through Navarro County make the area a natural stopping point for travelers. Local motels serve those who prioritize value and convenience over extensive amenities, offering clean rooms at lower price points than full-service hotels.`,
    sections: [
      {
        type: "services",
        heading: "What to Expect",
        content: \`**Basic Amenities**
- Clean room
- Private bathroom
- Television
- WiFi (usually)
- Parking at door

**May Include**
- Microwave and fridge
- Coffee maker
- Continental breakfast
- Pool (seasonal)

**Convenience**
- Drive-up access
- Flexible check-in
- Easy parking
- Quick stops\`
      }
    ],
    faqs: [
      {
        question: "What's the difference between a motel and hotel?",
        answer: "Motels typically feature exterior room entrances and drive-up access—originally designed for motorists. Hotels have interior hallways and more extensive amenities. Motels are generally less expensive with simpler accommodations. Both provide private rooms; the difference is style and service level."
      },
      {
        question: "Are motels safe?",
        answer: "Reputable chain motels maintain security standards including lighted parking, door locks, and security cameras. Read recent reviews before booking. Check that rooms have working locks and peepholes. Trust your instincts—if a property looks poorly maintained, find another option."
      },
      {
        question: "Can I pay cash at a motel?",
        answer: "Many motels accept cash, though you may need a credit or debit card for incidental holds. Cash-only properties exist but are less common than before. Prepaid cards may work at some locations. Call ahead to confirm payment policies if you prefer not to use credit."
      }
    ],
    relatedServices: ["hotel", "vacation-rental"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "bed-breakfast",
    title: "Bed & Breakfast",
    category: "lodging_travel",
    subcategory: "lodging",
    layout: 3,
    icon: "Coffee",
    iconColor: "rose",
    metaTitle: "Bed & Breakfast in Navarro County, TX | B&B Corsicana",
    metaDescription: "Bed and breakfasts in Corsicana and Navarro County. Charming accommodations with home-cooked breakfast and personal hospitality.",
    metaKeywords: "bed breakfast Corsicana, B&B Navarro County, inn, boutique lodging, romantic getaway",
    heroContent: `Bed and breakfasts offer a more personal alternative to standard hotels—unique accommodations, home-cooked breakfasts, and hosts who share local knowledge. Navarro County B&Bs provide charm and hospitality in historic and comfortable settings.`,
    localContext: `Corsicana's historic downtown and surrounding areas include charming properties that have been converted to bed and breakfasts. These accommodations appeal to couples seeking romantic getaways, visitors wanting a more personal experience, and those interested in local history and character.`,
    sections: [
      {
        type: "services",
        heading: "B&B Experience",
        content: \`**Accommodations**
- Unique, decorated rooms
- Private bathrooms (most)
- Quality linens
- Personal touches
- Historic settings

**Breakfast**
- Home-cooked breakfast
- Fresh ingredients
- Dietary accommodations
- Social or private dining

**Hospitality**
- Personal attention
- Local recommendations
- Flexible services
- Host knowledge\`
      }
    ],
    faqs: [
      {
        question: "What's included in a B&B stay?",
        answer: "Room rate typically includes overnight accommodation and a full breakfast. Many B&Bs also offer afternoon refreshments, evening wine, or snacks. WiFi is standard. Some include extras like bicycles, garden access, or parlor use. Ask about specific inclusions when booking."
      },
      {
        question: "Are B&Bs appropriate for families with children?",
        answer: "Some B&Bs welcome families while others focus on adult guests seeking quiet retreats. Properties with antiques and breakable items may not suit young children. Ask the innkeeper directly—they'll tell you honestly if their property is a good fit for your family."
      },
      {
        question: "Do I have to be social at a B&B?",
        answer: "While B&Bs are often more social than hotels, you're not obligated to be chatty. Breakfast may be communal or private depending on the property. Innkeepers respect guests' privacy. If you prefer solitude, mention it when booking and choose a property with private breakfast options."
      }
    ],
    relatedServices: ["hotel", "vacation-rental", "cabin-rental"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "vacation-rental",
    title: "Vacation Rental",
    category: "lodging_travel",
    subcategory: "lodging",
    layout: 4,
    icon: "Home",
    iconColor: "sky",
    metaTitle: "Vacation Rental in Navarro County, TX | VRBO Airbnb Corsicana",
    metaDescription: "Vacation rentals in Corsicana and Navarro County. Houses, cabins, and private accommodations for family visits and extended stays.",
    metaKeywords: "vacation rental Corsicana, Airbnb Navarro County, VRBO, rental house, extended stay",
    heroContent: `Vacation rentals offer the space and privacy of a home away from home. Navarro County vacation rentals range from lake houses to in-town homes, providing kitchens, multiple bedrooms, and room to spread out for families and groups.`,
    localContext: `Near Richland Chambers Reservoir and throughout Navarro County, vacation rentals provide alternatives to hotels for visitors wanting more space or longer stays. These properties appeal to families visiting for reunions, hunters needing seasonal accommodations, and those relocating who need temporary housing.`,
    sections: [
      {
        type: "services",
        heading: "Vacation Rental Features",
        content: \`**Property Types**
- Houses
- Cabins
- Lake properties
- Farm stays
- Guest cottages

**Amenities**
- Full kitchen
- Multiple bedrooms
- Living spaces
- Laundry facilities
- Outdoor areas
- Parking

**Benefits**
- Space for groups
- Home-like comfort
- Cost-effective for families
- Privacy
- Extended stay options\`
      }
    ],
    faqs: [
      {
        question: "How do I find vacation rentals in Navarro County?",
        answer: "Search platforms like Airbnb, VRBO, and Booking.com for vacation rentals in Corsicana and Navarro County. Look at Richland Chambers Lake for waterfront properties. Read reviews carefully and communicate with hosts before booking. Some local property managers list rentals on their own websites."
      },
      {
        question: "Are vacation rentals cheaper than hotels?",
        answer: "For groups and families, vacation rentals often provide better value—you get multiple bedrooms and a kitchen for less than multiple hotel rooms. For solo travelers or couples, hotels may be more economical. Compare total costs including cleaning fees and service charges."
      },
      {
        question: "What should I know before booking a vacation rental?",
        answer: "Read the full listing including house rules, check-in procedures, and cancellation policies. Note cleaning fees added to nightly rates. Verify the location meets your needs. Check what's provided (linens, towels, kitchen supplies). Communicate with hosts about any special needs or questions."
      }
    ],
    relatedServices: ["hotel", "bed-breakfast", "cabin-rental", "rv-park"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "rv-park",
    title: "RV Park / Campground",
    category: "lodging_travel",
    subcategory: "lodging",
    layout: 5,
    icon: "Caravan",
    iconColor: "green",
    metaTitle: "RV Park in Navarro County, TX | Campground Corsicana",
    metaDescription: "RV parks and campgrounds in Corsicana and Navarro County. Full hookups, tent camping, and outdoor accommodations near lakes and attractions.",
    metaKeywords: "RV park Corsicana, campground Navarro County, camping, RV hookups, Richland Chambers",
    heroContent: `RV parks and campgrounds let you enjoy the outdoors while still having access to essential amenities. Navarro County offers camping options from full-service RV parks to rustic sites, with Richland Chambers Reservoir providing popular waterfront camping.`,
    localContext: `Richland Chambers Reservoir draws RVers and campers seeking lakeside recreation. Other parks throughout Navarro County serve travelers passing through on I-45 or those wanting affordable long-term accommodations. Texas Parks & Wildlife operates several facilities in the region.`,
    sections: [
      {
        type: "services",
        heading: "Campground Amenities",
        content: \`**RV Sites**
- Full hookups (water, electric, sewer)
- 30/50 amp electric
- Pull-through sites
- Back-in sites
- WiFi (many parks)

**Facilities**
- Restrooms and showers
- Laundry facilities
- Dump station
- Picnic areas
- Camp store (some)

**Activities**
- Fishing access
- Boat ramps
- Swimming areas
- Nature trails
- Recreation halls\`
      }
    ],
    faqs: [
      {
        question: "How much do RV parks cost in Navarro County?",
        answer: "Nightly rates at Navarro County RV parks typically range from $25-$50 depending on amenities and location. Weekly rates offer discounts ($150-$250), and monthly rates provide significant savings ($400-$700). Premium spots with lake views or special features cost more. Call ahead for current rates."
      },
      {
        question: "Do I need reservations for campgrounds?",
        answer: "Reservations are recommended, especially for weekends and holidays. Lake-area parks fill quickly during summer. State parks often require reservations through the Texas Parks & Wildlife reservation system. Some private parks accept walk-ins if space is available."
      },
      {
        question: "Are there tent camping options in Navarro County?",
        answer: "Yes, several parks offer tent sites with access to facilities like restrooms and water. Richland Chambers Reservoir has designated camping areas. Prices are lower than RV sites—typically $15-$25 per night. Primitive camping may also be available at some locations."
      }
    ],
    relatedServices: ["vacation-rental", "cabin-rental", "pool-service"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "cabin-rental",
    title: "Cabin Rental",
    category: "lodging_travel",
    subcategory: "lodging",
    layout: 1,
    icon: "TreePine",
    iconColor: "brown",
    metaTitle: "Cabin Rental in Navarro County, TX | Lake Cabins Corsicana",
    metaDescription: "Cabin rentals in Corsicana and Navarro County. Lakeside cabins, rural getaways, and cozy accommodations for hunting and relaxation.",
    metaKeywords: "cabin rental Corsicana, lake cabin Navarro County, hunting cabin, rural getaway",
    heroContent: `Cabin rentals offer rustic charm with modern comfort. Navarro County cabin options include lakeside retreats at Richland Chambers, hunting cabins on rural properties, and cozy getaways perfect for unplugging and enjoying nature.`,
    localContext: `Richland Chambers Reservoir provides excellent lakeside cabin opportunities. Hunting lease properties often include cabin accommodations for lease holders and their guests. These rentals appeal to those seeking escape from city life while staying close enough for weekend trips.`,
    sections: [
      {
        type: "services",
        heading: "Cabin Types",
        content: \`**Lake Cabins**
- Waterfront properties
- Fishing access
- Boat docks (some)
- Lake views
- Swimming access

**Hunting Cabins**
- Rural locations
- Hunter accommodations
- Gear storage
- Multiple bunks
- Game processing area (some)

**Getaway Cabins**
- Quiet locations
- Porches and decks
- Fire pits
- Nature setting
- Modern amenities\`
      }
    ],
    faqs: [
      {
        question: "What should I bring to a cabin rental?",
        answer: "Cabins vary in what's provided. Most include basic kitchen equipment, linens, and towels. Bring your own food and drinks, toiletries, and appropriate clothing. For hunting cabins, verify what's provided. Check with the owner about specific amenities and what you need to supply."
      },
      {
        question: "Are cabin rentals pet-friendly?",
        answer: "Some cabins welcome pets while others don't. Pet policies vary widely—some charge extra fees, have size limits, or restrict where pets can go on the property. Always confirm pet policies before booking, and be honest about your pet to avoid issues on arrival."
      },
      {
        question: "How far in advance should I book a lake cabin?",
        answer: "For peak times (summer weekends, holidays, hunting season), book 2-3 months ahead. Off-peak times may have last-minute availability. Popular properties book quickly for any weekend. Weekday stays are often easier to secure and may be discounted."
      }
    ],
    relatedServices: ["vacation-rental", "rv-park", "hunting-lease"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "travel-agent",
    title: "Travel Agent",
    category: "lodging_travel",
    subcategory: "travel",
    layout: 2,
    icon: "Plane",
    iconColor: "sky",
    metaTitle: "Travel Agent in Navarro County, TX | Travel Planning Corsicana",
    metaDescription: "Travel agents in Corsicana and Navarro County. Expert travel planning, vacation packages, cruises, and group travel arrangements.",
    metaKeywords: "travel agent Corsicana, travel agency Navarro County, vacation planning, cruise agent",
    heroContent: `Travel agents bring expertise and personal service to vacation planning. Navarro County travel professionals handle complex itineraries, find deals you won't find online, and provide support before, during, and after your trip.`,
    localContext: `Despite online booking options, travel agents remain valuable for complex trips, cruises, group travel, and destinations requiring expertise. Local travel agents in Navarro County serve clients seeking personalized service and the peace of mind that comes from having an expert handle the details.`,
    sections: [
      {
        type: "services",
        heading: "Travel Services",
        content: \`**Trip Types**
- Cruises
- All-inclusive resorts
- International travel
- Honeymoons
- Family vacations
- Group trips

**Services**
- Itinerary planning
- Flight booking
- Hotel reservations
- Rental cars
- Travel insurance
- Documentation guidance

**Specialties**
- Destination weddings
- Disney vacations
- Adventure travel
- Corporate travel\`
      }
    ],
    faqs: [
      {
        question: "Do travel agents cost extra?",
        answer: "Many travel agents earn commissions from suppliers and don't charge clients directly. Some charge planning fees for complex itineraries or specialized services. Agents often access rates and perks not available online, potentially saving you money. Ask about fees upfront—many clients find the service worthwhile even with fees."
      },
      {
        question: "Why use a travel agent instead of booking online?",
        answer: "Travel agents offer expertise, save you research time, catch details you might miss, and advocate for you if problems arise. For cruises, group travel, destination weddings, or unfamiliar destinations, an agent's knowledge is invaluable. If a flight is cancelled, you have someone in your corner."
      },
      {
        question: "What if something goes wrong during my trip?",
        answer: "A good travel agent is available to help when issues arise—missed connections, hotel problems, or emergencies. They can rebook flights, contact suppliers, and solve problems while you're traveling. This support is a major advantage over booking everything yourself online."
      }
    ],
    relatedServices: ["airport-shuttle", "hotel"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "airport-shuttle",
    title: "Airport Shuttle",
    category: "lodging_travel",
    subcategory: "travel",
    layout: 3,
    icon: "Bus",
    iconColor: "blue",
    metaTitle: "Airport Shuttle in Navarro County, TX | DFW Transport Corsicana",
    metaDescription: "Airport shuttle services from Corsicana and Navarro County. Transportation to DFW Airport, Dallas Love Field, and Houston airports.",
    metaKeywords: "airport shuttle Corsicana, DFW shuttle Navarro County, airport transportation, airport taxi",
    heroContent: `Getting to the airport shouldn't be stressful. Airport shuttle services from Navarro County provide reliable transportation to DFW, Dallas Love Field, and Houston-area airports so you can start your trip relaxed.`,
    localContext: `Corsicana sits roughly equidistant between Dallas-Fort Worth and Houston airports, making reliable transportation essential for travelers. Shuttle services, private drivers, and rideshare options connect Navarro County residents to major airports without the hassle of parking.`,
    sections: [
      {
        type: "services",
        heading: "Transportation Options",
        content: \`**Airport Destinations**
- DFW International (~65 miles)
- Dallas Love Field (~55 miles)
- Houston IAH (~180 miles)
- Houston Hobby (~165 miles)

**Service Types**
- Shared shuttles
- Private car service
- Sedan/SUV options
- Group transportation
- Meet and greet service

**Features**
- Advance reservations
- Flight monitoring
- Door-to-door service
- Early/late departures
- Luggage handling\`
      }
    ],
    faqs: [
      {
        question: "How much does airport shuttle service cost from Corsicana?",
        answer: "Shuttle service from Corsicana to DFW typically runs $75-$150 for private car service, with shared shuttles sometimes less. Houston airports cost more due to distance ($150-$250+). Prices vary by vehicle type and service level. Book in advance for best rates."
      },
      {
        question: "How far in advance should I book airport transportation?",
        answer: "Book at least 24-48 hours ahead for guaranteed service. Early morning or late night departures may require more advance notice. Holiday periods book up quickly. Last-minute service may be available but isn't guaranteed, and rush fees may apply."
      },
      {
        question: "Can I use rideshare apps from Corsicana to the airport?",
        answer: "Uber and Lyft operate in the Corsicana area, though driver availability varies, especially at early morning hours. Rates to DFW can be $80-$120+. For reliability on important travel days, scheduled private car service may be worth the premium."
      }
    ],
    relatedServices: ["taxi", "charter-bus", "travel-agent"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "taxi",
    title: "Taxi Service",
    category: "lodging_travel",
    subcategory: "travel",
    layout: 4,
    icon: "Car",
    iconColor: "yellow",
    metaTitle: "Taxi Service in Navarro County, TX | Cab Service Corsicana",
    metaDescription: "Taxi services in Corsicana and Navarro County. Local transportation, airport runs, and reliable cab service when you need a ride.",
    metaKeywords: "taxi Corsicana, cab Navarro County, taxi service, transportation, local rides",
    heroContent: `When you need a ride, local taxi services provide reliable transportation throughout Navarro County. From medical appointments to nights out, taxis offer convenient point-to-point transportation without the hassle of parking.`,
    localContext: `While rideshare apps have limited coverage in Navarro County, local taxi services fill the gap with reliable transportation. These operators know the area, serve clients who can't drive, and provide essential mobility for many community members.`,
    sections: [
      {
        type: "services",
        heading: "Taxi Services",
        content: \`**Trip Types**
- Local transportation
- Medical appointments
- Airport runs
- Restaurant/entertainment
- Shopping trips
- Errands

**Features**
- Call for pickup
- Advance scheduling
- Door-to-door service
- Cash or card (most)
- Wait service available

**Special Services**
- Senior transportation
- Regular client accounts
- Large group vehicles
- Package delivery (some)\`
      }
    ],
    faqs: [
      {
        question: "How do I call a taxi in Corsicana?",
        answer: "Call local taxi companies directly—numbers are listed in local directories and online. Rideshare apps like Uber and Lyft have limited availability in the area. For reliable service, especially for important appointments, call ahead to schedule your pickup time."
      },
      {
        question: "How much does a taxi cost in Navarro County?",
        answer: "Local taxi rates typically include a base fare plus per-mile charges. Short in-town trips run $8-$20. Cross-town or longer trips cost more. Ask for an estimate when you call. Airport runs are quoted separately. Tipping 15-20% is customary."
      },
      {
        question: "Can I schedule a taxi in advance?",
        answer: "Yes, most local taxi services accept advance reservations, especially for medical appointments or airport trips. Call the day before or earlier for important trips. Scheduled pickups are more reliable than on-demand calls, particularly during busy periods."
      }
    ],
    relatedServices: ["airport-shuttle", "charter-bus"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "charter-bus",
    title: "Charter Bus Service",
    category: "lodging_travel",
    subcategory: "travel",
    layout: 5,
    icon: "Bus",
    iconColor: "slate",
    metaTitle: "Charter Bus in Navarro County, TX | Bus Rental Corsicana",
    metaDescription: "Charter bus services in Corsicana and Navarro County. Group transportation for events, field trips, church groups, and team travel.",
    metaKeywords: "charter bus Corsicana, bus rental Navarro County, group transportation, motor coach",
    heroContent: `Charter buses make group travel easy and economical. Navarro County organizations, churches, schools, and event planners use charter services for field trips, sporting events, church outings, and special occasions.`,
    localContext: `Group trips from Navarro County—whether to Dallas sporting events, Austin destinations, or other Texas attractions—benefit from charter bus transportation. Professional drivers handle navigation and parking while your group travels together comfortably.`,
    sections: [
      {
        type: "services",
        heading: "Charter Services",
        content: \`**Vehicle Types**
- Mini buses (15-30 passengers)
- Motor coaches (40-56 passengers)
- School buses (for appropriate trips)
- Executive coaches

**Trip Types**
- School field trips
- Church group outings
- Sports team travel
- Corporate events
- Wedding transportation
- Casino trips

**Features**
- Professional drivers
- Air conditioning
- Restrooms (large coaches)
- Entertainment systems
- WiFi (some coaches)\`
      }
    ],
    faqs: [
      {
        question: "How much does it cost to charter a bus?",
        answer: "Charter bus pricing depends on distance, duration, and vehicle size. Local half-day trips might start around $500-$800. Full-day out-of-town trips run $1,000-$2,000+. Large motor coaches for longer distances cost more. Get quotes from multiple companies for your specific trip."
      },
      {
        question: "How far in advance should we book a charter bus?",
        answer: "Book 4-6 weeks ahead for most trips. Major events (graduations, proms, popular game days) require earlier booking—sometimes months ahead. Last-minute availability depends on the company's schedule. Earlier booking ensures better vehicle selection."
      },
      {
        question: "What's included in charter bus rental?",
        answer: "Standard rental includes the vehicle, driver, fuel, and insurance. Drivers are typically on the clock for the entire trip (not just drive time). Gratuity for the driver is separate—15-20% is customary. Ask what's included and what costs extra when getting quotes."
      }
    ],
    relatedServices: ["taxi", "airport-shuttle", "party-bus"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // INDUSTRIAL & COMMERCIAL
  // ============================================
  {
    slug: "machine-shop",
    title: "Machine Shop",
    category: "industrial_commercial",
    subcategory: "industrial",
    layout: 1,
    icon: "Cog",
    iconColor: "slate",
    metaTitle: "Machine Shop in Navarro County, TX | Precision Machining Corsicana",
    metaDescription: "Machine shops in Corsicana and Navarro County. Custom machining, fabrication, repair, and precision manufacturing services.",
    metaKeywords: "machine shop Corsicana, machining Navarro County, CNC, fabrication, precision parts",
    heroContent: `Machine shops transform raw materials into precise components and repair critical equipment. Navarro County machine shops serve industrial operations, oilfield needs, agricultural equipment, and custom fabrication requirements with skilled machinists and quality equipment.`,
    localContext: `Manufacturing, agriculture, and oilfield operations in Navarro County require machining support for equipment repairs, custom parts, and fabrication. Local machine shops provide faster turnaround than sending work to distant cities, with the capability to handle both standard and emergency jobs.`,
    sections: [
      {
        type: "services",
        heading: "Machining Services",
        content: \`**Machining Operations**
- Turning (lathe work)
- Milling
- Drilling and boring
- Grinding
- Threading
- CNC machining

**Fabrication**
- Welding
- Metal cutting
- Forming and bending
- Assembly
- Prototype work

**Industries Served**
- Agriculture
- Oil and gas
- Manufacturing
- Construction
- Automotive\`
      }
    ],
    faqs: [
      {
        question: "What can a machine shop make or repair?",
        answer: "Machine shops can create custom parts from metal, repair worn or broken components, fabricate brackets and fixtures, and manufacture prototypes. Common work includes shaft repair, bushing replacement, custom bolts and fittings, and agricultural equipment repairs. If it's metal and needs precision work, a machine shop can likely help."
      },
      {
        question: "How much does machine shop work cost?",
        answer: "Pricing depends on complexity, materials, and time required. Simple repairs might cost $50-$150. Custom parts range from $100 to several thousand depending on specifications. Machine time typically runs $50-$100+ per hour. Get a quote for your specific project."
      },
      {
        question: "How long does machine shop work take?",
        answer: "Simple repairs might be same-day or next-day. Custom parts typically take 1-2 weeks depending on complexity and shop workload. Rush work is often available for emergencies at premium pricing. Discuss timeline when requesting quotes."
      }
    ],
    relatedServices: ["welder", "fabrication", "tractor-repair"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "cnc-machining",
    title: "CNC Machining",
    category: "industrial_commercial",
    subcategory: "industrial",
    layout: 2,
    icon: "Factory",
    iconColor: "blue",
    metaTitle: "CNC Machining in Navarro County, TX | CNC Services Corsicana",
    metaDescription: "CNC machining services in Corsicana and Navarro County. Computer-controlled precision manufacturing for complex parts and production runs.",
    metaKeywords: "CNC machining Corsicana, CNC Navarro County, precision manufacturing, CNC turning, CNC milling",
    heroContent: `CNC (Computer Numerical Control) machining produces complex parts with exceptional precision and repeatability. Navarro County CNC shops serve clients needing accurate components, from single prototypes to production quantities.`,
    localContext: `Modern manufacturing requires CNC capability for parts that manual machining can't efficiently produce. Local CNC shops provide this precision manufacturing without sending work out of the region, supporting Navarro County's industrial and agricultural operations.`,
    sections: [
      {
        type: "services",
        heading: "CNC Capabilities",
        content: \`**Operations**
- CNC milling
- CNC turning
- Multi-axis machining
- Thread cutting
- Drilling
- Boring

**Materials**
- Steel and stainless
- Aluminum
- Brass and bronze
- Plastics
- Exotic alloys

**Services**
- Prototype development
- Production runs
- Reverse engineering
- CAD/CAM support
- Quality inspection\`
      }
    ],
    faqs: [
      {
        question: "What's the advantage of CNC over manual machining?",
        answer: "CNC machines produce identical parts repeatedly with tight tolerances. They can create complex geometries impossible by hand. While setup takes time, running multiple parts is efficient. For precision work or quantities beyond a few pieces, CNC is typically faster and more accurate."
      },
      {
        question: "What files do I need for CNC work?",
        answer: "Most shops work from CAD files (STEP, IGES, or native formats like SolidWorks). Detailed drawings with dimensions and tolerances are always helpful. If you don't have CAD files, shops can often create models from drawings or sample parts for an additional fee."
      },
      {
        question: "What tolerances can CNC machining achieve?",
        answer: "Standard CNC work holds ±0.005\" tolerances easily. Precision work achieves ±0.001\" or tighter. Tighter tolerances increase cost due to extra time, inspection, and potential scrap. Specify only the tolerances you actually need for the application."
      }
    ],
    relatedServices: ["machine-shop", "fabrication"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "commercial-cleaning",
    title: "Commercial Cleaning",
    category: "industrial_commercial",
    subcategory: "commercial",
    layout: 3,
    icon: "SprayCan",
    iconColor: "cyan",
    metaTitle: "Commercial Cleaning in Navarro County, TX | Office Cleaning Corsicana",
    metaDescription: "Commercial cleaning services in Corsicana and Navarro County. Office cleaning, retail maintenance, and professional janitorial services.",
    metaKeywords: "commercial cleaning Corsicana, office cleaning Navarro County, janitorial, business cleaning",
    heroContent: `A clean workplace promotes productivity, health, and professional image. Commercial cleaning services in Navarro County keep offices, retail spaces, and commercial buildings maintained with professional cleaning tailored to business needs.`,
    localContext: `Navarro County businesses—from downtown Corsicana offices to retail spaces and industrial facilities—rely on commercial cleaning to maintain professional environments. Local cleaning companies understand the needs of different business types and provide flexible scheduling to minimize disruption.`,
    sections: [
      {
        type: "services",
        heading: "Commercial Cleaning Services",
        content: \`**Regular Cleaning**
- Office cleaning
- Restroom sanitation
- Trash removal
- Vacuuming and mopping
- Surface dusting and wiping
- Break room cleaning

**Additional Services**
- Window cleaning
- Carpet cleaning
- Floor waxing
- Deep cleaning
- Post-construction cleanup

**Industries**
- Office buildings
- Retail stores
- Medical offices
- Churches
- Schools
- Industrial facilities\`
      }
    ],
    faqs: [
      {
        question: "How much does commercial cleaning cost?",
        answer: "Commercial cleaning is typically priced per square foot or by the hour. Small offices (under 2,000 sq ft) might cost $100-$300 per cleaning. Larger spaces are often quoted per square foot ($0.05-$0.20). Frequency, scope of work, and special requirements affect pricing. Get quotes for your specific needs."
      },
      {
        question: "How often should a business be cleaned?",
        answer: "Most offices need cleaning 2-3 times per week. High-traffic retail may need daily cleaning. Medical facilities require daily service with specific protocols. Some small offices maintain weekly service. Frequency depends on foot traffic, industry requirements, and budget."
      },
      {
        question: "Are commercial cleaning companies insured?",
        answer: "Reputable commercial cleaners carry liability insurance and bonding. This protects your business if accidents occur or items are damaged. Ask for proof of insurance before hiring. Worker's compensation coverage is also important—you could be liable if an uninsured worker is injured on your property."
      }
    ],
    relatedServices: ["janitorial", "carpet-cleaning", "window-cleaning", "pressure-washing"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "janitorial",
    title: "Janitorial Service",
    category: "industrial_commercial",
    subcategory: "commercial",
    layout: 4,
    icon: "Brush",
    iconColor: "green",
    metaTitle: "Janitorial Service in Navarro County, TX | Janitor Corsicana",
    metaDescription: "Janitorial services in Corsicana and Navarro County. Daily facility maintenance, cleaning, and sanitation for commercial buildings.",
    metaKeywords: "janitorial Corsicana, janitor Navarro County, facility maintenance, building cleaning",
    heroContent: `Janitorial services provide ongoing facility maintenance to keep commercial buildings clean, safe, and welcoming. Navarro County janitorial companies offer daily or scheduled service tailored to each facility's needs.`,
    localContext: `From schools and churches to office buildings and industrial facilities, Navarro County properties require consistent janitorial maintenance. Local service providers understand the specific needs of different facility types and provide reliable, ongoing service.`,
    sections: [
      {
        type: "services",
        heading: "Janitorial Services",
        content: \`**Daily Tasks**
- Restroom cleaning and restocking
- Trash collection
- Floor care
- Surface cleaning
- Break room maintenance
- Entry area upkeep

**Periodic Tasks**
- Deep cleaning
- Floor stripping and waxing
- Carpet cleaning
- Window cleaning
- Light fixture cleaning

**Special Services**
- Event setup and cleanup
- Emergency cleaning
- Move-in/move-out cleaning
- Supply management\`
      }
    ],
    faqs: [
      {
        question: "What's the difference between janitorial and commercial cleaning?",
        answer: "The terms overlap significantly. Janitorial often implies ongoing, routine maintenance (daily/weekly service) while commercial cleaning may refer to periodic deep cleaning. In practice, most companies offer both. Discuss your specific needs with providers rather than worrying about terminology."
      },
      {
        question: "Can janitorial services work during business hours?",
        answer: "Many businesses prefer after-hours cleaning to avoid disruption, but daytime service is possible. Day porters handle light cleaning, restroom checks, and spill response during operating hours. Discuss your preferences and schedule constraints with prospective providers."
      },
      {
        question: "Do janitorial companies provide supplies?",
        answer: "Most janitorial contracts include supplies like cleaning chemicals, paper products, and trash bags. Some businesses prefer to provide their own supplies for cost control. Clarify supply arrangements in your contract—unexpected supply charges can add up."
      }
    ],
    relatedServices: ["commercial-cleaning", "carpet-cleaning"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "storage-units",
    title: "Storage Units",
    category: "industrial_commercial",
    subcategory: "storage",
    layout: 5,
    icon: "Warehouse",
    iconColor: "amber",
    metaTitle: "Storage Units in Navarro County, TX | Self Storage Corsicana",
    metaDescription: "Storage units in Corsicana and Navarro County. Self-storage facilities for household items, vehicles, and business inventory.",
    metaKeywords: "storage units Corsicana, self storage Navarro County, mini storage, boat storage, RV storage",
    heroContent: `Whether you're moving, decluttering, or need space for business inventory, self-storage provides secure, accessible space. Navarro County storage facilities offer units in various sizes with features to protect your belongings.`,
    localContext: `Storage needs in Navarro County range from household overflow to boat and RV storage. Facilities throughout the area provide options from small closet-sized units to large vehicle storage, with access hours and security features to meet different needs.`,
    sections: [
      {
        type: "services",
        heading: "Storage Options",
        content: \`**Unit Sizes**
- Small (5x5, 5x10)
- Medium (10x10, 10x15)
- Large (10x20, 10x30)
- Vehicle/RV/boat storage
- Outdoor parking spots

**Features**
- Drive-up access
- Climate control (some)
- 24-hour access (some)
- Security cameras
- Gate codes
- On-site management

**Special Storage**
- Climate-controlled units
- Vehicle storage
- Boat and RV
- Business inventory
- Document storage\`
      }
    ],
    faqs: [
      {
        question: "How much do storage units cost in Navarro County?",
        answer: "Prices vary by size and features. Small 5x10 units typically run $40-$70/month. 10x10 units cost $60-$100. Larger 10x20 units range $100-$160. Climate-controlled units cost more. RV and boat storage varies by covered vs. uncovered. Look for move-in specials and first-month discounts."
      },
      {
        question: "Do I need climate-controlled storage?",
        answer: "Climate control protects items sensitive to temperature and humidity extremes—wood furniture, electronics, documents, artwork, and clothing. Texas heat can damage many items in non-climate units. For short-term storage of durable goods, standard units are fine. Long-term or valuable item storage benefits from climate control."
      },
      {
        question: "Can I access my storage unit anytime?",
        answer: "Access hours vary by facility. Some offer 24-hour access; others have specific gate hours (typically 6am-10pm). On-site offices usually have limited hours but may not be required for unit access. Verify access hours before signing a lease, especially if you need early morning or late night access."
      }
    ],
    relatedServices: ["moving-company", "junk-removal"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "moving-company",
    title: "Moving Company",
    category: "industrial_commercial",
    subcategory: "storage",
    layout: 1,
    icon: "Truck",
    iconColor: "blue",
    metaTitle: "Moving Company in Navarro County, TX | Movers Corsicana",
    metaDescription: "Moving companies in Corsicana and Navarro County. Local and long-distance moving, packing services, and professional relocation assistance.",
    metaKeywords: "moving company Corsicana, movers Navarro County, local moving, packing service, relocation",
    heroContent: `Moving is stressful, but professional movers make it manageable. Navarro County moving companies handle local moves within the area and long-distance relocations, with options from basic loading help to full-service packing and unpacking.`,
    localContext: `Whether relocating within Corsicana, moving to Navarro County from elsewhere, or heading to a new city, local moving companies understand the logistics. They navigate narrow streets, older homes with tight doorways, and long rural driveways that out-of-area movers might struggle with.`,
    sections: [
      {
        type: "services",
        heading: "Moving Services",
        content: \`**Moving Types**
- Local moves
- Long-distance moves
- Apartment moves
- House moves
- Office relocation
- Senior moves

**Services**
- Loading and unloading
- Furniture disassembly/reassembly
- Packing services
- Unpacking services
- Specialty item handling
- Storage options

**Specialty Items**
- Piano moving
- Gun safe moving
- Antiques
- Hot tubs
- Large appliances\`
      }
    ],
    faqs: [
      {
        question: "How much does hiring movers cost?",
        answer: "Local moving rates typically run $80-$150 per hour for a 2-person crew with truck. A typical local move (3-bedroom house) takes 4-8 hours. Long-distance moves are priced by weight and distance. Packing services, specialty items, and difficult access add to costs. Get written quotes from multiple companies."
      },
      {
        question: "How far in advance should I book movers?",
        answer: "Book 2-4 weeks ahead for most moves. Month-end and summer (peak moving season) require earlier booking—sometimes 4-6 weeks. Last-minute moves are possible but limit your options and may cost more. Get quotes early even if your date isn't confirmed."
      },
      {
        question: "Should I tip movers?",
        answer: "Tipping isn't required but is appreciated for good service. Standard tips range from $20-$50 per mover for a full-day move, or $10-$20 for shorter jobs. Consider the difficulty of the move, care taken with your belongings, and overall service quality when deciding."
      }
    ],
    relatedServices: ["storage-units", "junk-removal", "packing-services"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "freight-shipping",
    title: "Freight Shipping",
    category: "industrial_commercial",
    subcategory: "logistics",
    layout: 2,
    icon: "Container",
    iconColor: "slate",
    metaTitle: "Freight Shipping in Navarro County, TX | Shipping Services Corsicana",
    metaDescription: "Freight shipping services in Corsicana and Navarro County. LTL and FTL shipping, logistics, and commercial transportation services.",
    metaKeywords: "freight shipping Corsicana, shipping Navarro County, LTL freight, trucking, logistics",
    heroContent: `Businesses need reliable freight shipping to move products, materials, and equipment. Navarro County's location along I-45 provides excellent access to freight networks connecting Texas and beyond.`,
    localContext: `Navarro County's position between Dallas-Fort Worth and Houston makes it strategically located for freight operations. Local businesses have access to major carriers and freight services, while the area's manufacturing and agricultural industries generate significant shipping needs.`,
    sections: [
      {
        type: "services",
        heading: "Freight Services",
        content: \`**Shipping Options**
- LTL (Less Than Truckload)
- FTL (Full Truckload)
- Flatbed
- Temperature-controlled
- Expedited shipping
- Specialized freight

**Services**
- Pickup and delivery
- Freight quotes
- Tracking
- Insurance
- Warehousing (some)
- Cross-docking

**Industries**
- Manufacturing
- Agriculture
- Retail
- Construction
- Oil and gas\`
      }
    ],
    faqs: [
      {
        question: "What's the difference between LTL and FTL shipping?",
        answer: "LTL (Less Than Truckload) combines multiple shipments on one truck—you pay for the space your freight uses. FTL (Full Truckload) dedicates an entire truck to your shipment. LTL is cost-effective for smaller shipments; FTL is better for large loads or time-sensitive freight."
      },
      {
        question: "How are freight costs calculated?",
        answer: "Freight rates depend on weight, dimensions, distance, freight class, and accessorial services needed. Freight class considers density, handling, and value. Get quotes specifying exact dimensions and weight—estimates based on incomplete information are unreliable."
      },
      {
        question: "Do I need a freight broker?",
        answer: "Freight brokers help businesses find carriers and negotiate rates, which is valuable for companies shipping occasionally. Regular shippers may develop direct carrier relationships. Brokers earn commissions but often secure better rates than businesses can negotiate alone."
      }
    ],
    relatedServices: ["warehousing", "courier", "moving-company"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "warehousing",
    title: "Warehousing",
    category: "industrial_commercial",
    subcategory: "logistics",
    layout: 3,
    icon: "Warehouse",
    iconColor: "brown",
    metaTitle: "Warehousing in Navarro County, TX | Warehouse Space Corsicana",
    metaDescription: "Warehousing services in Corsicana and Navarro County. Inventory storage, distribution, and fulfillment services for businesses.",
    metaKeywords: "warehousing Corsicana, warehouse Navarro County, distribution, fulfillment, storage",
    heroContent: `Warehousing provides businesses with space to store inventory, stage shipments, and manage distribution. Navarro County warehouse facilities serve companies needing flexible storage and logistics support.`,
    localContext: `Navarro County's central Texas location and I-45 access make it viable for warehousing and distribution operations. Businesses can store inventory closer to customers in both Dallas-Fort Worth and Houston markets while benefiting from lower real estate costs than major metro areas.`,
    sections: [
      {
        type: "services",
        heading: "Warehouse Services",
        content: \`**Storage Options**
- Bulk storage
- Racked storage
- Climate-controlled
- Outside storage
- Short and long term

**Services**
- Receiving and inspection
- Inventory management
- Pick and pack
- Shipping coordination
- Cross-docking
- Kitting and assembly

**Specialized**
- Food-grade storage
- Hazmat (licensed facilities)
- High-value goods
- Overflow capacity\`
      }
    ],
    faqs: [
      {
        question: "How is warehousing priced?",
        answer: "Warehousing is typically priced per pallet position per month ($8-$25) or per square foot ($0.40-$1.00/sq ft/month). Additional charges apply for handling (receiving, shipping, picking). Long-term contracts may offer better rates. Get detailed quotes including all handling and accessorial fees."
      },
      {
        question: "Do I need my own warehouse or should I use a 3PL?",
        answer: "Third-party logistics (3PL) warehousing makes sense for smaller operations, seasonal businesses, or those testing new markets. Your own warehouse becomes economical at higher volumes. Consider fixed costs, flexibility needs, and management bandwidth when deciding."
      },
      {
        question: "What's the minimum quantity for warehouse services?",
        answer: "Minimums vary by provider. Some accept just a few pallets; others require larger commitments. Smaller quantities work well with shared warehousing or fulfillment centers. Dedicated warehouse space typically requires higher minimums to be cost-effective for both parties."
      }
    ],
    relatedServices: ["freight-shipping", "storage-units", "moving-company"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "commercial-hvac",
    title: "Commercial HVAC",
    category: "industrial_commercial",
    subcategory: "commercial",
    layout: 4,
    icon: "Wind",
    iconColor: "blue",
    metaTitle: "Commercial HVAC in Navarro County, TX | Commercial AC Corsicana",
    metaDescription: "Commercial HVAC services in Corsicana and Navarro County. Installation, repair, and maintenance for business heating and cooling systems.",
    metaKeywords: "commercial HVAC Corsicana, commercial AC Navarro County, rooftop unit, commercial heating",
    heroContent: `Commercial HVAC systems are larger, more complex, and more critical than residential units. Navarro County commercial HVAC contractors specialize in the equipment and techniques needed to keep businesses comfortable year-round.`,
    localContext: `Texas summers push commercial cooling systems to their limits. Retail stores, restaurants, offices, and industrial facilities in Navarro County need HVAC contractors who understand commercial equipment—from rooftop units to split systems to complex building automation.`,
    sections: [
      {
        type: "services",
        heading: "Commercial HVAC Services",
        content: \`**Equipment Types**
- Rooftop units (RTUs)
- Split systems
- Chillers
- Boilers
- VRF systems
- Building automation

**Services**
- Installation
- Repair and service
- Preventive maintenance
- Emergency service
- Retrofits and upgrades
- Energy audits

**Industries**
- Retail and office
- Restaurants
- Healthcare
- Industrial
- Churches and schools\`
      }
    ],
    faqs: [
      {
        question: "How often should commercial HVAC be serviced?",
        answer: "Commercial systems should be inspected and maintained quarterly—before and during both heating and cooling seasons. High-use environments may need monthly maintenance. Regular service prevents breakdowns, extends equipment life, and maintains efficiency. Most contractors offer maintenance agreements."
      },
      {
        question: "How long do commercial HVAC systems last?",
        answer: "Commercial rooftop units typically last 15-20 years with proper maintenance. Chillers and boilers can last 20-30 years. However, efficiency declines over time—equipment more than 15 years old may be worth replacing for energy savings alone."
      },
      {
        question: "What's a commercial HVAC maintenance agreement?",
        answer: "Maintenance agreements provide scheduled inspections and service for a monthly or annual fee. They typically include filter changes, coil cleaning, and system checks. Many include discounts on repairs and priority service. Agreements help with budgeting and prevent costly breakdowns."
      }
    ],
    relatedServices: ["hvac", "commercial-electrical", "commercial-plumbing"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "commercial-plumbing",
    title: "Commercial Plumbing",
    category: "industrial_commercial",
    subcategory: "commercial",
    layout: 5,
    icon: "Wrench",
    iconColor: "cyan",
    metaTitle: "Commercial Plumbing in Navarro County, TX | Commercial Plumber Corsicana",
    metaDescription: "Commercial plumbing services in Corsicana and Navarro County. Installation, repair, and maintenance for business plumbing systems.",
    metaKeywords: "commercial plumbing Corsicana, commercial plumber Navarro County, business plumbing, grease trap",
    heroContent: `Commercial plumbing involves larger pipes, more complex systems, and different codes than residential work. Navarro County commercial plumbers handle everything from retail restrooms to restaurant kitchens to industrial facilities.`,
    localContext: `Restaurants, retail stores, and commercial facilities in Navarro County need plumbers who understand commercial systems—backflow prevention, grease traps, commercial water heaters, and compliance requirements. Local commercial plumbers respond to the unique needs of area businesses.`,
    sections: [
      {
        type: "services",
        heading: "Commercial Plumbing Services",
        content: \`**Services**
- New construction plumbing
- Tenant improvements
- Repairs and emergency service
- Drain cleaning
- Water heater service
- Backflow prevention

**Specialty Work**
- Grease trap service
- Water line replacement
- Sewer line repair
- Fixture installation
- Code compliance

**Industries**
- Restaurants
- Retail
- Healthcare
- Industrial
- Schools and churches\`
      }
    ],
    faqs: [
      {
        question: "How often should grease traps be cleaned?",
        answer: "Most restaurants need grease trap cleaning every 1-3 months depending on volume. Some high-volume kitchens need weekly service. Regular cleaning prevents clogs, odors, and code violations. Many jurisdictions require documentation of cleaning schedules."
      },
      {
        question: "What's backflow prevention and why does my business need it?",
        answer: "Backflow prevention devices stop contaminated water from flowing backward into the public water supply. Commercial facilities need annual backflow testing for code compliance. Your plumber can install and certify appropriate devices for your business type."
      },
      {
        question: "How quickly can commercial plumbers respond to emergencies?",
        answer: "Many commercial plumbers offer 24/7 emergency service, understanding that plumbing problems can shut down a business. Response times vary—ask about emergency availability when choosing a plumber. Having a relationship with a plumber before emergencies helps ensure quick response."
      }
    ],
    relatedServices: ["plumber", "commercial-hvac", "drain-cleaning"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "commercial-electrical",
    title: "Commercial Electrical",
    category: "industrial_commercial",
    subcategory: "commercial",
    layout: 1,
    icon: "Zap",
    iconColor: "yellow",
    metaTitle: "Commercial Electrical in Navarro County, TX | Commercial Electrician Corsicana",
    metaDescription: "Commercial electrical services in Corsicana and Navarro County. Installation, repair, and maintenance for business electrical systems.",
    metaKeywords: "commercial electrician Corsicana, commercial electrical Navarro County, business electrical, panel upgrade",
    heroContent: `Commercial electrical work requires different skills and licensing than residential. Navarro County commercial electricians handle the higher voltages, three-phase power, and specialized systems that businesses require.`,
    localContext: `From retail lighting to manufacturing power needs, commercial facilities in Navarro County need electricians who understand commercial codes and systems. Local commercial electricians work with businesses to maintain safe, efficient electrical infrastructure.`,
    sections: [
      {
        type: "services",
        heading: "Commercial Electrical Services",
        content: \`**Services**
- New construction wiring
- Tenant improvements
- Panel upgrades
- Lighting installation
- Generator installation
- Power quality

**Specialty Work**
- Three-phase systems
- Motor controls
- Emergency power
- Parking lot lighting
- Sign installation
- Data and communication

**Industries**
- Retail and office
- Manufacturing
- Restaurants
- Healthcare
- Warehouses\`
      }
    ],
    faqs: [
      {
        question: "What's the difference between commercial and residential electrical work?",
        answer: "Commercial work involves higher voltages (277/480V vs 120/240V), three-phase power, different code requirements, and more complex systems. Commercial electricians have additional training and licensing. Don't hire a residential-only electrician for commercial work."
      },
      {
        question: "How often should commercial electrical systems be inspected?",
        answer: "Annual inspections are recommended for most commercial facilities. High-use environments, manufacturing, and older buildings may need more frequent checks. Thermographic scanning can identify hot spots before they cause failures. Insurance may require or discount for regular inspections."
      },
      {
        question: "What's involved in a commercial panel upgrade?",
        answer: "Commercial panel upgrades may require coordination with the utility, new service entrance equipment, and permit inspections. Cost depends on the amperage increase and complexity. Plan for several hours to a full day without power. Budget $2,000-$10,000+ depending on scope."
      }
    ],
    relatedServices: ["electrician", "commercial-hvac", "generator"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "industrial-painting",
    title: "Industrial Painting",
    category: "industrial_commercial",
    subcategory: "industrial",
    layout: 2,
    icon: "PaintBucket",
    iconColor: "orange",
    metaTitle: "Industrial Painting in Navarro County, TX | Industrial Coatings Corsicana",
    metaDescription: "Industrial painting services in Corsicana and Navarro County. Protective coatings, tank painting, structural steel, and facility painting.",
    metaKeywords: "industrial painting Corsicana, industrial coating Navarro County, tank painting, structural steel",
    heroContent: `Industrial painting protects equipment, structures, and facilities from corrosion, wear, and the elements. Navarro County industrial painting contractors apply protective coatings to tanks, structural steel, and industrial facilities.`,
    localContext: `Oilfield equipment, agricultural structures, water tanks, and industrial facilities throughout Navarro County need protective coatings to extend their service life. Local industrial painters understand the environmental conditions and coating requirements specific to our region.`,
    sections: [
      {
        type: "services",
        heading: "Industrial Painting Services",
        content: \`**Applications**
- Tanks and vessels
- Structural steel
- Piping systems
- Equipment and machinery
- Floors and containment
- Building exteriors

**Coatings**
- Epoxy systems
- Polyurethane
- Zinc-rich primers
- High-temperature coatings
- Chemical-resistant coatings
- Anti-corrosion systems

**Preparation**
- Surface preparation
- Sandblasting
- Pressure washing
- Rust removal
- Substrate repair\`
      }
    ],
    faqs: [
      {
        question: "How long do industrial coatings last?",
        answer: "Properly applied industrial coatings last 10-20+ years depending on the system, surface preparation, and environmental exposure. Surface prep is critical—80% of coating failures relate to inadequate preparation. Quality coatings cost more initially but provide better long-term value."
      },
      {
        question: "What's involved in painting a water tank?",
        answer: "Tank painting requires draining, cleaning, surface preparation (often sandblasting), and applying appropriate coatings for the tank's contents. Interior and exterior systems differ. Work is typically done by certified contractors following AWWA or API standards. Plan for the tank to be out of service for days to weeks."
      },
      {
        question: "Why is surface preparation so important?",
        answer: "Coatings bond to the surface, not the contaminants on it. Paint over rust, oil, or mill scale will fail prematurely. Proper preparation removes contaminants and creates a surface profile for coating adhesion. Industrial specs often require specific preparation standards (SSPC, NACE)."
      }
    ],
    relatedServices: ["sandblasting", "exterior-painting", "pressure-washing"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "sandblasting",
    title: "Sandblasting",
    category: "industrial_commercial",
    subcategory: "industrial",
    layout: 3,
    icon: "Wind",
    iconColor: "slate",
    metaTitle: "Sandblasting in Navarro County, TX | Media Blasting Corsicana",
    metaDescription: "Sandblasting and media blasting services in Corsicana and Navarro County. Surface preparation, rust removal, and coating removal.",
    metaKeywords: "sandblasting Corsicana, media blasting Navarro County, abrasive blasting, rust removal",
    heroContent: `Sandblasting (abrasive blasting) removes rust, paint, and surface contaminants to prepare materials for coating or restore them to bare metal. Navarro County sandblasting services work on everything from automotive parts to structural steel.`,
    localContext: `From farm equipment to oilfield components to automotive restoration, many items in Navarro County benefit from sandblasting. Local services offer both mobile blasting and shop-based work, using various media appropriate for different materials and applications.`,
    sections: [
      {
        type: "services",
        heading: "Sandblasting Services",
        content: \`**Applications**
- Rust removal
- Paint stripping
- Surface preparation
- Cleaning and restoration
- Etching and texturing
- Weld preparation

**Media Types**
- Sand
- Glass bead
- Aluminum oxide
- Crusite/slag
- Soda (gentle)
- Walnut shell (delicate)

**Work Types**
- Shop blasting
- Mobile blasting
- Wet blasting
- Automotive parts
- Equipment
- Structural steel\`
      }
    ],
    faqs: [
      {
        question: "How much does sandblasting cost?",
        answer: "Small parts (automotive components) might cost $50-$200. Larger items like trailers or equipment run $200-$1,000+. Structural steel is often priced per square foot ($2-$8). Mobile blasting adds travel costs. Get quotes for your specific items—size, condition, and surface profile requirements affect price."
      },
      {
        question: "What's the difference between sandblasting media types?",
        answer: "Different media suit different applications. Sand is aggressive for heavy rust and paint removal. Glass bead is gentler, good for finishing and cleaning. Soda won't warp metal and is safe near glass. Walnut shell won't damage softer surfaces. Your blaster should recommend appropriate media."
      },
      {
        question: "Can anything be sandblasted?",
        answer: "Most metals, concrete, and stone can be blasted with appropriate media. Thin sheet metal can warp from heat and impact. Soft materials may be damaged. Wood requires careful technique. Discuss your item with the blaster—they'll advise whether blasting is appropriate and which media to use."
      }
    ],
    relatedServices: ["industrial-painting", "auto-body", "powder-coating"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "crane-service",
    title: "Crane Service",
    category: "industrial_commercial",
    subcategory: "industrial",
    layout: 4,
    icon: "Construction",
    iconColor: "yellow",
    metaTitle: "Crane Service in Navarro County, TX | Crane Rental Corsicana",
    metaDescription: "Crane services in Corsicana and Navarro County. Crane rental, heavy lifting, HVAC placement, and construction crane services.",
    metaKeywords: "crane service Corsicana, crane rental Navarro County, heavy lifting, HVAC crane, tree crane",
    heroContent: `When you need to lift heavy loads safely, professional crane services are essential. Navarro County crane operators provide equipment and expertise for construction, HVAC installation, tree removal, and industrial lifting needs.`,
    localContext: `Construction projects, HVAC replacements, and industrial operations in Navarro County frequently require crane services. Local crane operators know the area, hold proper certifications, and provide equipment sized appropriately for various jobs.`,
    sections: [
      {
        type: "services",
        heading: "Crane Services",
        content: \`**Equipment Types**
- Mobile cranes
- Boom trucks
- All-terrain cranes
- Hydraulic cranes
- Knuckle boom

**Applications**
- Construction lifting
- HVAC unit placement
- Steel erection
- Equipment setting
- Sign installation
- Tree removal

**Services**
- Operated crane rental
- Lift planning
- Rigging
- Heavy hauling (some)\`
      }
    ],
    faqs: [
      {
        question: "How much does crane rental cost?",
        answer: "Crane costs depend on equipment size, duration, and complexity. Small boom truck lifts might start at $300-$500 for a few hours. Larger mobile cranes run $1,500-$5,000+ per day. Complex lifts requiring planning and rigging cost more. Get quotes specifying exact lift requirements."
      },
      {
        question: "Do I need a crane for my HVAC replacement?",
        answer: "Rooftop HVAC units typically require cranes for removal and replacement. Crane costs add $500-$2,000 to HVAC projects but are necessary for units that can't be carried up stairs. Your HVAC contractor coordinates crane service—it's usually included in their quote."
      },
      {
        question: "How far in advance should I book a crane?",
        answer: "Book 1-2 weeks ahead for standard jobs. Complex lifts requiring planning may need more lead time. Construction projects should schedule cranes during project planning. Rush service may be available but costs more and isn't guaranteed."
      }
    ],
    relatedServices: ["general-contractor", "hvac", "steel-building"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "forklift-service",
    title: "Forklift Service",
    category: "industrial_commercial",
    subcategory: "industrial",
    layout: 5,
    icon: "Truck",
    iconColor: "orange",
    metaTitle: "Forklift Service in Navarro County, TX | Forklift Repair Corsicana",
    metaDescription: "Forklift services in Corsicana and Navarro County. Forklift repair, maintenance, rental, and service for warehouse and industrial equipment.",
    metaKeywords: "forklift service Corsicana, forklift repair Navarro County, forklift rental, lift truck",
    heroContent: `Forklifts are essential for warehouses, manufacturing, and many businesses. Navarro County forklift service providers offer repair, maintenance, and rental options to keep your material handling equipment running.`,
    localContext: `Distribution centers, manufacturing facilities, and retail operations in Navarro County depend on forklifts. Local service providers offer repairs, preventive maintenance, and rental equipment when your lifts are down or you need additional capacity.`,
    sections: [
      {
        type: "services",
        heading: "Forklift Services",
        content: \`**Repair Services**
- Engine/motor repair
- Transmission service
- Hydraulic repair
- Electrical systems
- Brake service
- Tire replacement

**Maintenance**
- Preventive maintenance
- OSHA inspections
- Safety checks
- Fluid services
- Filter replacement

**Rental**
- Short-term rental
- Long-term lease
- Rent-to-own
- Various capacities
- Electric and propane\`
      }
    ],
    faqs: [
      {
        question: "How often do forklifts need maintenance?",
        answer: "Forklifts should be inspected daily by operators and serviced every 200-250 hours of use or every three months, whichever comes first. OSHA requires annual inspections by certified technicians. Regular maintenance prevents breakdowns and extends equipment life."
      },
      {
        question: "Should we buy, rent, or lease forklifts?",
        answer: "Buying makes sense for high-utilization equipment in stable operations. Rental works for short-term needs, peak seasons, or backup equipment. Leasing spreads costs and includes maintenance. Consider utilization, cash flow, and maintenance capabilities when deciding."
      },
      {
        question: "What does forklift rental cost?",
        answer: "Daily rental runs $100-$300 depending on capacity and type. Weekly rates are $300-$800. Monthly rental is $500-$1,500+. Electric lifts cost more but have lower operating costs. Delivery and pickup fees apply. Long-term rentals offer better daily rates."
      }
    ],
    relatedServices: ["warehousing", "machine-shop"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // MORE HOME SERVICES
  // ============================================
  {
    slug: "water-heater",
    title: "Water Heater Service",
    category: "home_services",
    subcategory: "plumbing",
    layout: 1,
    icon: "Flame",
    iconColor: "orange",
    metaTitle: "Water Heater Service in Navarro County, TX | Water Heater Repair Corsicana",
    metaDescription: "Water heater installation and repair in Corsicana and Navarro County. Tank and tankless water heaters, repair, and emergency service.",
    metaKeywords: "water heater Corsicana, water heater repair Navarro County, tankless water heater, hot water",
    heroContent: `Hot water is essential for daily comfort. When your water heater fails, you need fast, reliable service. Navarro County plumbers install and repair all types of water heaters, from traditional tanks to modern tankless units.`,
    localContext: `Hard water in Navarro County affects water heater lifespan. Mineral buildup reduces efficiency and can cause premature failure. Local plumbers understand these conditions and can recommend appropriate equipment and maintenance to maximize your water heater's service life.`,
    sections: [
      {
        type: "services",
        heading: "Water Heater Services",
        content: \`**Equipment Types**
- Tank water heaters (gas/electric)
- Tankless water heaters
- Heat pump water heaters
- Point-of-use heaters
- Commercial water heaters

**Services**
- New installation
- Replacement
- Repair
- Maintenance
- Emergency service
- Efficiency upgrades

**Maintenance**
- Anode rod inspection
- Tank flushing
- Thermostat testing
- Safety valve checks\`
      }
    ],
    faqs: [
      {
        question: "How long do water heaters last?",
        answer: "Tank water heaters typically last 8-12 years. Tankless units can last 20+ years with proper maintenance. Hard water, high usage, and lack of maintenance shorten lifespan. If your tank is over 10 years old and having problems, replacement is usually more economical than repair."
      },
      {
        question: "Should I get a tankless water heater?",
        answer: "Tankless heaters cost more upfront ($1,500-$3,500 installed vs $800-$1,500 for tank) but offer endless hot water and lower energy bills. They're ideal for high-usage households. However, they require gas line or electrical upgrades and may not keep up with simultaneous demands without proper sizing."
      },
      {
        question: "Why is my water heater making noise?",
        answer: "Popping or rumbling usually indicates sediment buildup—the water heater boiling water trapped under sediment. Flushing the tank may help. Whining or screeching suggests a failing valve. Knocking could be water hammer in pipes. New or worsening noises warrant professional inspection."
      }
    ],
    relatedServices: ["plumber", "water-softener", "hvac"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "water-softener",
    title: "Water Softener Installation",
    category: "home_services",
    subcategory: "plumbing",
    layout: 2,
    icon: "Droplets",
    iconColor: "blue",
    metaTitle: "Water Softener in Navarro County, TX | Water Treatment Corsicana",
    metaDescription: "Water softener installation and service in Corsicana and Navarro County. Hard water solutions, water treatment, and filtration systems.",
    metaKeywords: "water softener Corsicana, water treatment Navarro County, hard water, water filtration",
    heroContent: `Hard water causes scale buildup, spots on dishes, dry skin, and shortened appliance life. Water softeners remove minerals that cause hardness, protecting your plumbing and improving water quality throughout your home.`,
    localContext: `Navarro County has notably hard water due to our limestone geology. Many homeowners notice white buildup on fixtures, cloudy glassware, and stiff laundry—all signs of hard water. Local water treatment specialists can test your water and recommend appropriate softening solutions.`,
    sections: [
      {
        type: "services",
        heading: "Water Treatment Services",
        content: \`**Systems**
- Salt-based water softeners
- Salt-free conditioners
- Whole-house filtration
- Reverse osmosis
- Iron and sulfur removal
- UV treatment

**Services**
- Water testing
- System sizing
- Installation
- Maintenance
- Salt delivery
- Repairs

**Benefits**
- Reduced scale buildup
- Better soap efficiency
- Softer skin and hair
- Longer appliance life
- Cleaner dishes\`
      }
    ],
    faqs: [
      {
        question: "How much does a water softener cost?",
        answer: "Basic water softeners start around $500-$1,000 for equipment. Quality whole-house units run $1,200-$2,500. Installation adds $200-$500. Premium systems with advanced features cost $2,500-$4,000+. Ongoing costs include salt ($5-$10/month) and periodic maintenance."
      },
      {
        question: "What's the difference between water softeners and conditioners?",
        answer: "Traditional softeners use salt to exchange calcium and magnesium ions, actually removing hardness minerals. Salt-free conditioners change mineral structure to reduce scaling without removing minerals. Softeners are more effective but require salt; conditioners are maintenance-free but less effective for very hard water."
      },
      {
        question: "How do I know if I need a water softener?",
        answer: "Signs of hard water include: white scale on fixtures and showerheads, spots on dishes and glassware, dry skin and hair, stiff laundry, soap that doesn't lather well, and shortened water heater life. A water test can measure exact hardness levels—anything over 7 grains per gallon is considered hard."
      }
    ],
    relatedServices: ["plumber", "water-filtration", "water-heater"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "water-filtration",
    title: "Water Filtration",
    category: "home_services",
    subcategory: "plumbing",
    layout: 3,
    icon: "Filter",
    iconColor: "cyan",
    metaTitle: "Water Filtration in Navarro County, TX | Water Filter Systems Corsicana",
    metaDescription: "Water filtration systems in Corsicana and Navarro County. Whole-house filters, reverse osmosis, and drinking water purification.",
    metaKeywords: "water filtration Corsicana, water filter Navarro County, reverse osmosis, drinking water filter",
    heroContent: `Clean, safe drinking water is fundamental. Water filtration systems remove contaminants, improve taste, and provide peace of mind about what you're drinking. Navarro County water treatment specialists install systems tailored to local water conditions.`,
    localContext: `While Navarro County municipal water meets safety standards, many residents prefer additional filtration for taste, odor, or specific contaminants. Rural well water may have different concerns. Local water treatment companies can test your water and recommend appropriate filtration.`,
    sections: [
      {
        type: "services",
        heading: "Filtration Options",
        content: \`**Whole-House Systems**
- Sediment filters
- Carbon filters
- Multi-stage systems
- Iron removal
- Sulfur removal

**Drinking Water**
- Reverse osmosis
- Under-sink filters
- Countertop filters
- Refrigerator filters
- Pitcher filters

**Specialty**
- UV disinfection
- Arsenic removal
- Nitrate removal
- Well water treatment\`
      }
    ],
    faqs: [
      {
        question: "What type of water filter do I need?",
        answer: "It depends on what's in your water. Carbon filters remove chlorine, taste, and odor. Reverse osmosis removes most contaminants including minerals. Sediment filters catch particles. Specialty filters target specific problems. Start with a water test to identify what needs filtering."
      },
      {
        question: "How much does reverse osmosis cost?",
        answer: "Under-sink RO systems cost $150-$500 for equipment plus installation. Whole-house RO is much more expensive at $3,000-$10,000+. Under-sink RO is usually sufficient for drinking and cooking water. Filters need annual replacement ($50-$150/year)."
      },
      {
        question: "How often do water filters need replacement?",
        answer: "Standard filters need replacement every 3-6 months depending on water quality and usage. RO membranes last 2-3 years. Whole-house sediment filters may need monthly changes in poor-quality well water. Mark your calendar or set reminders—overdue filters lose effectiveness."
      }
    ],
    relatedServices: ["water-softener", "plumber", "well-drilling"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "ceiling-fan-installation",
    title: "Ceiling Fan Installation",
    category: "home_services",
    subcategory: "electrical",
    layout: 4,
    icon: "Fan",
    iconColor: "slate",
    metaTitle: "Ceiling Fan Installation in Navarro County, TX | Fan Install Corsicana",
    metaDescription: "Ceiling fan installation in Corsicana and Navarro County. Professional installation, replacement, and electrical box upgrades.",
    metaKeywords: "ceiling fan installation Corsicana, fan install Navarro County, ceiling fan electrician",
    heroContent: `Ceiling fans improve comfort and reduce energy costs by circulating air year-round. Professional installation ensures your fan operates safely and efficiently. Navarro County electricians install new fans and replace existing fixtures.`,
    localContext: `In Texas heat, ceiling fans are essential—they make rooms feel 4-6 degrees cooler and reduce AC costs. Many Navarro County homes have ceiling fans, but older installations may have improper support. Professional installation ensures proper electrical boxes and secure mounting.`,
    sections: [
      {
        type: "services",
        heading: "Ceiling Fan Services",
        content: \`**Installation**
- New fan installation
- Fan replacement
- Light kit addition
- Remote control upgrade
- Smart fan installation

**Electrical Work**
- Ceiling box upgrade
- Wiring installation
- Switch installation
- Wall control wiring
- Circuit addition

**Maintenance**
- Balance and adjustment
- Motor service
- Blade replacement
- Remote programming\`
      }
    ],
    faqs: [
      {
        question: "How much does ceiling fan installation cost?",
        answer: "Basic fan installation (existing wiring and proper box) runs $75-$150. If a ceiling box upgrade is needed, add $100-$200. Running new wiring for a first-time installation costs $200-$400+. The fan itself is separate—budget $50-$500 depending on quality and features."
      },
      {
        question: "Can I install a ceiling fan myself?",
        answer: "If you're replacing an existing fan with proper support, basic DIY is possible with electrical knowledge. However, new installations or ceiling box upgrades should be done by an electrician. Fans are heavy and motors require proper support—improper installation risks the fan falling."
      },
      {
        question: "What size ceiling fan do I need?",
        answer: "Room size determines fan size: under 75 sq ft needs 29-36\" fan; 75-144 sq ft needs 36-42\"; 144-225 sq ft needs 44-50\"; 225-400 sq ft needs 50-54\"; over 400 sq ft may need multiple fans or 60\"+ industrial style. Blade height should be 7-9 feet from floor."
      }
    ],
    relatedServices: ["electrician", "lighting-installation", "hvac"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "lighting-installation",
    title: "Lighting Installation",
    category: "home_services",
    subcategory: "electrical",
    layout: 5,
    icon: "Lightbulb",
    iconColor: "yellow",
    metaTitle: "Lighting Installation in Navarro County, TX | Electrician Corsicana",
    metaDescription: "Lighting installation in Corsicana and Navarro County. Indoor and outdoor lighting, recessed lights, LED upgrades, and fixture installation.",
    metaKeywords: "lighting installation Corsicana, light fixture Navarro County, recessed lighting, LED lights",
    heroContent: `Proper lighting transforms spaces—improving function, aesthetics, and home value. Navarro County electricians install all types of lighting, from simple fixture swaps to complete lighting designs with recessed lights and smart controls.`,
    localContext: `Many Navarro County homes have dated lighting that doesn't meet modern needs. Local electricians help homeowners upgrade to energy-efficient LED fixtures, add task lighting where needed, and improve home security with exterior lighting.`,
    sections: [
      {
        type: "services",
        heading: "Lighting Services",
        content: \`**Indoor Lighting**
- Fixture installation
- Recessed/can lights
- Under-cabinet lighting
- Pendant lights
- Chandeliers
- Dimmer switches

**Outdoor Lighting**
- Landscape lighting
- Security lighting
- Motion sensors
- Pathway lights
- Porch and entry lights

**Upgrades**
- LED conversions
- Smart lighting
- Lighting controls
- Whole-house systems\`
      }
    ],
    faqs: [
      {
        question: "How much does recessed lighting cost?",
        answer: "Recessed lights typically cost $150-$300 per light installed, including materials. Price per light decreases when installing multiple lights in the same area. Insulated ceilings or retrofit installations may cost more. A room might need 4-6 lights, so budget $600-$1,500 for a typical room."
      },
      {
        question: "Should I upgrade to LED lighting?",
        answer: "Yes, LED bulbs use 75% less energy than incandescent and last 15-25 times longer. While LED bulbs cost more initially, the energy savings and reduced replacement make them economical. Many LED fixtures also run cooler, reducing cooling costs in Texas summers."
      },
      {
        question: "Can I replace a light fixture myself?",
        answer: "Simple fixture swaps (same type of fixture, existing wiring) are DIY-friendly if you're comfortable working with electricity. Always turn off the breaker and verify power is off. New installations, wiring changes, or adding fixtures should be done by a licensed electrician."
      }
    ],
    relatedServices: ["electrician", "outdoor-lighting", "ceiling-fan-installation"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "electrical-panel-upgrade",
    title: "Electrical Panel Upgrade",
    category: "home_services",
    subcategory: "electrical",
    layout: 1,
    icon: "Zap",
    iconColor: "amber",
    metaTitle: "Electrical Panel Upgrade in Navarro County, TX | Panel Replacement Corsicana",
    metaDescription: "Electrical panel upgrades in Corsicana and Navarro County. Service upgrades, breaker panel replacement, and electrical capacity increases.",
    metaKeywords: "electrical panel upgrade Corsicana, breaker panel Navarro County, service upgrade, 200 amp",
    heroContent: `Your electrical panel is the heart of your home's electrical system. Older homes may need panel upgrades for safety, to support modern electrical demands, or before major renovations. Navarro County electricians evaluate and upgrade panels to meet current needs.`,
    localContext: `Many older Navarro County homes have 100-amp or even 60-amp service—insufficient for modern appliances, HVAC systems, and electric vehicles. Panel upgrades increase capacity and replace outdated or recalled equipment for improved safety and functionality.`,
    sections: [
      {
        type: "services",
        heading: "Panel Services",
        content: \`**Upgrades**
- 100-amp to 200-amp upgrade
- 200-amp to 400-amp upgrade
- Panel replacement
- Subpanel installation
- Meter base upgrade

**Safety Updates**
- Federal Pacific replacement
- Zinsco replacement
- AFCI protection
- GFCI protection
- Surge protection

**Related Work**
- Service entrance upgrade
- Grounding improvement
- Circuit additions
- Whole-house rewiring\`
      }
    ],
    faqs: [
      {
        question: "How much does a panel upgrade cost?",
        answer: "Panel replacement (same amperage) costs $1,500-$2,500. Upgrading from 100-amp to 200-amp runs $2,500-$4,500 including utility coordination. Costs vary based on panel location, required work on the meter base, and local permit requirements. Get quotes from licensed electricians."
      },
      {
        question: "How do I know if I need a panel upgrade?",
        answer: "Signs include: frequently tripping breakers, using multiple power strips, lights dimming when appliances run, warm or buzzing panel, or panel brands on recall lists (Federal Pacific, Zinsco). Adding an EV charger, hot tub, or major appliances may require increased capacity."
      },
      {
        question: "What panel brands have safety concerns?",
        answer: "Federal Pacific (Stab-Lok), Zinsco, and certain Challenger panels have known defects and are recommended for replacement. These panels may not trip during overloads, creating fire risks. If your home has one of these panels, consult an electrician about replacement."
      }
    ],
    relatedServices: ["electrician", "generator", "ev-charger"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "duct-cleaning",
    title: "Duct Cleaning",
    category: "home_services",
    subcategory: "climate",
    layout: 2,
    icon: "Wind",
    iconColor: "slate",
    metaTitle: "Duct Cleaning in Navarro County, TX | Air Duct Cleaning Corsicana",
    metaDescription: "Duct cleaning services in Corsicana and Navarro County. HVAC duct cleaning, dryer vent cleaning, and indoor air quality improvement.",
    metaKeywords: "duct cleaning Corsicana, air duct cleaning Navarro County, HVAC cleaning, dryer vent",
    heroContent: `Duct cleaning removes accumulated dust, debris, and contaminants from your HVAC system, potentially improving air quality and system efficiency. Navarro County duct cleaning services use specialized equipment to clean supply and return air ducts.`,
    localContext: `Texas dust finds its way everywhere, including HVAC ducts. Combined with pollen, pet dander, and occasional mold growth, ducts can become reservoirs for indoor air contaminants. Professional cleaning may help allergy sufferers and those with respiratory concerns.`,
    sections: [
      {
        type: "services",
        heading: "Duct Cleaning Services",
        content: \`**Duct Services**
- Supply duct cleaning
- Return duct cleaning
- Trunk line cleaning
- Vent register cleaning
- HVAC component cleaning

**Related Services**
- Dryer vent cleaning
- Mold remediation
- Sanitizing treatment
- Filter replacement
- Duct sealing

**Equipment**
- High-powered vacuums
- Rotating brushes
- Air whips
- Camera inspection\`
      }
    ],
    faqs: [
      {
        question: "How much does duct cleaning cost?",
        answer: "Whole-house duct cleaning typically costs $300-$500 for average homes. Very large homes or systems with extensive ductwork may cost more. Be wary of extremely low-price offers ($99 or less)—these often result in upselling or incomplete cleaning. Get quotes in writing."
      },
      {
        question: "How often should ducts be cleaned?",
        answer: "The EPA doesn't recommend routine duct cleaning but suggests it when: visible mold is present, ducts are infested with vermin, or ducts are clogged with debris. Consider cleaning after renovations that generate dust, when moving into a new home, or if household members have unexplained respiratory issues."
      },
      {
        question: "Does duct cleaning improve energy efficiency?",
        answer: "Heavily clogged ducts may restrict airflow, making your system work harder. However, for normally dirty ducts, efficiency improvements from cleaning are minimal. The main benefit is potential air quality improvement. Regular filter changes matter more for efficiency than periodic duct cleaning."
      }
    ],
    relatedServices: ["hvac", "air-quality", "insulation"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "air-quality",
    title: "Indoor Air Quality",
    category: "home_services",
    subcategory: "climate",
    layout: 3,
    icon: "Leaf",
    iconColor: "green",
    metaTitle: "Indoor Air Quality in Navarro County, TX | Air Quality Testing Corsicana",
    metaDescription: "Indoor air quality services in Corsicana and Navarro County. Air purifiers, UV lights, humidifiers, and air quality testing.",
    metaKeywords: "indoor air quality Corsicana, air purifier Navarro County, air quality testing, UV air",
    heroContent: `We spend most of our time indoors, where air can be 2-5 times more polluted than outdoor air. Indoor air quality systems remove pollutants, control humidity, and create healthier home environments.`,
    localContext: `Navarro County homes face various air quality challenges: pollen and allergens, Texas dust, humidity control issues, and tight construction that traps pollutants. Local HVAC professionals can assess your air quality and recommend appropriate solutions.`,
    sections: [
      {
        type: "services",
        heading: "Air Quality Solutions",
        content: \`**Air Cleaning**
- Air purifiers
- HEPA filtration
- Electronic air cleaners
- UV germicidal lights
- Activated carbon filters

**Humidity Control**
- Whole-house humidifiers
- Dehumidifiers
- Humidity monitoring
- Moisture control

**Services**
- Air quality testing
- Radon testing
- Mold testing
- System assessment
- Ventilation solutions\`
      }
    ],
    faqs: [
      {
        question: "How much do whole-house air purifiers cost?",
        answer: "Whole-house air purifiers installed in your HVAC system range from $500-$3,000 depending on technology. Media filters are least expensive. Electronic air cleaners cost more but are more effective. UV systems add $500-$1,500. Operating costs include filter replacement and electricity."
      },
      {
        question: "Do UV lights in HVAC systems really work?",
        answer: "UV-C light kills or inactivates bacteria, mold, and viruses when properly installed. Coil-mounted UV lights keep evaporator coils clean and reduce microbial growth. In-duct UV systems can reduce airborne pathogens. Effectiveness depends on proper sizing and installation."
      },
      {
        question: "What MERV rating filter should I use?",
        answer: "MERV 8-11 filters offer good filtration for most homes without restricting airflow. MERV 13+ filters capture smaller particles but may reduce airflow in systems not designed for them. Higher ratings aren't always better—check your system's specifications. Change filters every 1-3 months."
      }
    ],
    relatedServices: ["hvac", "duct-cleaning", "mold-remediation"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "gutter",
    title: "Gutter Installation & Repair",
    category: "home_services",
    subcategory: "exterior",
    layout: 4,
    icon: "Home",
    iconColor: "brown",
    metaTitle: "Gutter Installation in Navarro County, TX | Gutter Repair Corsicana",
    metaDescription: "Gutter installation and repair in Corsicana and Navarro County. Seamless gutters, gutter guards, downspout extensions, and gutter cleaning.",
    metaKeywords: "gutter installation Corsicana, gutter repair Navarro County, seamless gutters, gutter guards",
    heroContent: `Properly functioning gutters protect your home's foundation, siding, and landscaping from water damage. Navarro County gutter contractors install, repair, and maintain gutter systems suited to our climate and rainfall patterns.`,
    localContext: `Texas can deliver heavy rains that overwhelm undersized gutters. Navarro County homes need properly designed gutter systems to handle sudden downpours and direct water away from foundations—critical in an area where clay soil and foundation issues are common.`,
    sections: [
      {
        type: "services",
        heading: "Gutter Services",
        content: \`**Installation**
- Seamless aluminum gutters
- Steel gutters
- Copper gutters
- Downspouts
- Splash blocks

**Protection**
- Gutter guards
- Leaf screens
- Gutter covers
- Downspout screens

**Maintenance**
- Gutter cleaning
- Repair and patching
- Realignment
- Downspout clearing
- Drainage solutions\`
      }
    ],
    faqs: [
      {
        question: "How much do new gutters cost?",
        answer: "Seamless aluminum gutters typically cost $5-$10 per linear foot installed. An average home with 150-200 feet of gutter runs $750-$2,000 for standard 5\" gutters. Larger 6\" gutters and premium materials cost more. Gutter guards add $5-$15 per foot."
      },
      {
        question: "Should I get gutter guards?",
        answer: "Gutter guards reduce cleaning frequency but don't eliminate maintenance entirely. They work best for keeping out large debris like leaves. Fine particles still accumulate. Consider guards if you have many trees, hate gutter cleaning, or have multi-story homes where cleaning is dangerous."
      },
      {
        question: "How often should gutters be cleaned?",
        answer: "Clean gutters at least twice yearly—spring and fall. Homes with many trees may need quarterly cleaning. Watch for overflow during rain, plants growing in gutters, or birds nesting—all signs cleaning is overdue. Regular cleaning prevents damage and extends gutter life."
      }
    ],
    relatedServices: ["roofing", "pressure-washing", "exterior-painting"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "garage-door",
    title: "Garage Door Service",
    category: "home_services",
    subcategory: "exterior",
    layout: 5,
    icon: "DoorOpen",
    iconColor: "slate",
    metaTitle: "Garage Door Service in Navarro County, TX | Garage Door Repair Corsicana",
    metaDescription: "Garage door installation and repair in Corsicana and Navarro County. Garage door openers, spring replacement, and emergency service.",
    metaKeywords: "garage door repair Corsicana, garage door Navarro County, garage door opener, spring replacement",
    heroContent: `The garage door is the largest moving part of your home and is used thousands of times per year. When it breaks, you need fast, reliable service. Navarro County garage door technicians handle installations, repairs, and emergency service.`,
    localContext: `Texas heat affects garage door components, especially springs under constant tension. Navarro County garage door companies understand local conditions and stock parts for common problems. Many offer same-day service for situations leaving cars trapped or homes unsecured.`,
    sections: [
      {
        type: "services",
        heading: "Garage Door Services",
        content: \`**Doors**
- New door installation
- Door replacement
- Insulated doors
- Steel doors
- Wood doors
- Custom doors

**Openers**
- Opener installation
- Opener repair
- Belt/chain drive
- Smart openers
- Battery backup

**Repairs**
- Spring replacement
- Cable repair
- Track alignment
- Panel replacement
- Weatherstripping
- Safety sensor adjustment\`
      }
    ],
    faqs: [
      {
        question: "How much does garage door spring replacement cost?",
        answer: "Spring replacement typically costs $150-$350 for a single spring, $200-$450 for both springs. Always replace both springs together—when one breaks, the other is likely to follow soon. Never attempt DIY spring replacement—springs under tension are extremely dangerous."
      },
      {
        question: "How long do garage door openers last?",
        answer: "Garage door openers typically last 10-15 years depending on usage and quality. Signs of failure include slow operation, reversing unexpectedly, or intermittent function. Modern openers have improved security features, battery backup, and smartphone control that may make early upgrade worthwhile."
      },
      {
        question: "Why won't my garage door close?",
        answer: "Common causes: blocked or misaligned safety sensors (check for obstructions and blinking lights), limit switch issues (door reverses immediately), or remote/wall button problems. If the motor runs but the door doesn't move, a spring may be broken. For safety sensor issues, clean lenses and check alignment."
      }
    ],
    relatedServices: ["electrician", "locksmith", "home-inspector"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // MORE PROFESSIONAL SERVICES
  // ============================================
  {
    slug: "family-lawyer",
    title: "Family Lawyer",
    category: "professional_services",
    subcategory: "legal",
    layout: 1,
    icon: "Scale",
    iconColor: "blue",
    metaTitle: "Family Lawyer in Navarro County, TX | Family Law Attorney Corsicana",
    metaDescription: "Family lawyers in Corsicana and Navarro County. Divorce, child custody, adoption, and family law services with local court experience.",
    metaKeywords: "family lawyer Corsicana, divorce attorney Navarro County, child custody, family law",
    heroContent: `Family legal matters are deeply personal and emotionally challenging. A family lawyer guides you through divorce, custody disputes, and other family issues with legal expertise and compassionate understanding. Navarro County family attorneys know local courts and judges.`,
    localContext: `Navarro County family law cases are heard in the district courts in Corsicana. Local family lawyers have experience with area judges, understand the local legal community, and can guide clients through what to expect in our court system.`,
    sections: [
      {
        type: "services",
        heading: "Family Law Services",
        content: \`**Divorce**
- Contested divorce
- Uncontested divorce
- Property division
- Spousal support
- Collaborative divorce
- Mediation

**Children**
- Child custody
- Child support
- Visitation/possession
- Modification
- Paternity

**Other**
- Adoption
- Prenuptial agreements
- Protective orders
- Guardianship
- Name changes\`
      }
    ],
    faqs: [
      {
        question: "How much does a divorce cost in Texas?",
        answer: "Uncontested divorces with agreements on all issues can cost $1,500-$3,500 in attorney fees. Contested divorces requiring negotiation or trial can cost $5,000-$25,000+. Court filing fees in Navarro County add $300-$400. Mediation can help reduce costs compared to litigation."
      },
      {
        question: "How is child custody decided in Texas?",
        answer: "Texas courts decide custody based on the child's best interests, considering factors including parental abilities, child's preferences (if 12+), stability, and any history of family violence. Most cases result in one parent as primary custodian with the other having specified access periods."
      },
      {
        question: "How long does divorce take in Texas?",
        answer: "Texas requires a 60-day waiting period from filing to final divorce. Uncontested divorces can finalize shortly after 60 days. Contested divorces take 6-12 months or longer depending on issues involved. Complex property or custody disputes extend timelines significantly."
      }
    ],
    relatedServices: ["attorney", "criminal-lawyer", "estate-attorney"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "criminal-lawyer",
    title: "Criminal Defense Lawyer",
    category: "professional_services",
    subcategory: "legal",
    layout: 2,
    icon: "Shield",
    iconColor: "slate",
    metaTitle: "Criminal Defense Lawyer in Navarro County, TX | Criminal Attorney Corsicana",
    metaDescription: "Criminal defense lawyers in Corsicana and Navarro County. DWI, assault, drug charges, and felony defense with local court experience.",
    metaKeywords: "criminal lawyer Corsicana, DWI attorney Navarro County, criminal defense, felony lawyer",
    heroContent: `Facing criminal charges is frightening. A criminal defense lawyer protects your rights, builds your defense, and works to achieve the best possible outcome. Navarro County criminal attorneys have daily experience in local courts and understand how cases are handled here.`,
    localContext: `Criminal cases in Navarro County are prosecuted by the District Attorney's office and heard in county and district courts. Local criminal defense attorneys know the prosecutors, understand their negotiating tendencies, and can effectively advocate for their clients in our court system.`,
    sections: [
      {
        type: "services",
        heading: "Criminal Defense Services",
        content: \`**DWI/DUI**
- First offense DWI
- Repeat DWI
- Intoxication assault
- License suspension
- ALR hearings

**Felonies**
- Drug charges
- Assault/family violence
- Theft crimes
- Weapons charges
- White collar crimes

**Other Charges**
- Misdemeanors
- Traffic violations
- Juvenile offenses
- Expunctions
- Probation violations\`
      }
    ],
    faqs: [
      {
        question: "Should I hire a lawyer for a first DWI?",
        answer: "Yes. Even first DWI carries serious consequences: jail time, fines, license suspension, and a permanent criminal record. A skilled attorney may be able to get charges reduced, identify problems with the stop or testing, or achieve dismissal. The costs of conviction far exceed attorney fees."
      },
      {
        question: "What happens if I can't afford a lawyer?",
        answer: "If you can't afford an attorney, you can request a court-appointed lawyer. Navarro County provides appointed counsel for defendants who qualify financially. However, you may want to explore payment plans with private attorneys who can dedicate more time and resources to your case."
      },
      {
        question: "Will a criminal charge show up on background checks?",
        answer: "Arrests may show up even without conviction. Convictions appear on background checks for employers, landlords, and licensing boards. Some charges can be expunged (erased) or sealed from records if the case was dismissed or you completed deferred adjudication. Ask your attorney about expunction eligibility."
      }
    ],
    relatedServices: ["attorney", "bail-bonds", "family-lawyer"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "personal-injury-lawyer",
    title: "Personal Injury Lawyer",
    category: "professional_services",
    subcategory: "legal",
    layout: 3,
    icon: "Heart",
    iconColor: "red",
    metaTitle: "Personal Injury Lawyer in Navarro County, TX | Injury Attorney Corsicana",
    metaDescription: "Personal injury lawyers in Corsicana and Navarro County. Car accidents, work injuries, medical malpractice, and wrongful death claims.",
    metaKeywords: "personal injury lawyer Corsicana, car accident attorney Navarro County, injury claim, slip and fall",
    heroContent: `If you've been injured due to someone else's negligence, you deserve fair compensation. Personal injury lawyers fight for your rights against insurance companies and at-fault parties, handling your claim while you focus on recovery.`,
    localContext: `I-45 and other highways through Navarro County see regular accidents. Local personal injury attorneys handle cases ranging from car accidents to workplace injuries to premises liability. Most work on contingency—you don't pay unless they win your case.`,
    sections: [
      {
        type: "services",
        heading: "Personal Injury Cases",
        content: \`**Motor Vehicle**
- Car accidents
- Truck accidents
- Motorcycle accidents
- Pedestrian accidents
- Rideshare accidents

**Other Injuries**
- Slip and fall
- Work injuries
- Dog bites
- Product liability
- Medical malpractice

**Damages**
- Medical expenses
- Lost wages
- Pain and suffering
- Disability
- Wrongful death\`
      }
    ],
    faqs: [
      {
        question: "How much do personal injury lawyers charge?",
        answer: "Most personal injury lawyers work on contingency—they take a percentage (typically 33-40%) of your settlement or verdict, plus costs. You pay nothing upfront and nothing if you don't recover. This arrangement makes legal help accessible when you're already dealing with injury expenses."
      },
      {
        question: "How long do I have to file an injury claim in Texas?",
        answer: "Texas has a two-year statute of limitations for most personal injury claims, running from the date of injury. Some exceptions apply. Waiting too long means losing your right to sue. Contact an attorney promptly—evidence and witness memories fade over time."
      },
      {
        question: "Should I accept the insurance company's first offer?",
        answer: "Initial offers are typically low. Insurance companies profit by paying as little as possible. An attorney can evaluate whether an offer fairly compensates your damages, negotiate for more, or take your case to trial if needed. Never sign releases before consulting a lawyer."
      }
    ],
    relatedServices: ["attorney", "chiropractor", "physical-therapist"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "estate-attorney",
    title: "Estate Planning Attorney",
    category: "professional_services",
    subcategory: "legal",
    layout: 4,
    icon: "FileText",
    iconColor: "amber",
    metaTitle: "Estate Planning Attorney in Navarro County, TX | Wills & Trusts Corsicana",
    metaDescription: "Estate planning attorneys in Corsicana and Navarro County. Wills, trusts, powers of attorney, and probate services for asset protection.",
    metaKeywords: "estate planning Corsicana, wills Navarro County, trusts, probate attorney, power of attorney",
    heroContent: `Estate planning protects your assets and ensures your wishes are followed. Whether you need a simple will or complex trust planning, estate attorneys help you provide for loved ones and minimize complications after you're gone.`,
    localContext: `Navarro County residents with farms, ranches, or family businesses have particular estate planning needs. Local estate attorneys understand Texas property laws, community property rules, and how to structure plans that work for our area's common situations.`,
    sections: [
      {
        type: "services",
        heading: "Estate Planning Services",
        content: \`**Documents**
- Wills
- Living trusts
- Medical power of attorney
- Financial power of attorney
- Living wills/directives

**Planning**
- Asset protection
- Business succession
- Tax planning
- Charitable giving
- Special needs planning

**Administration**
- Probate
- Trust administration
- Estate settlement
- Will contests\`
      }
    ],
    faqs: [
      {
        question: "How much does a will cost?",
        answer: "Simple wills typically cost $200-$500. More complex estate plans with trusts, powers of attorney, and other documents run $1,500-$5,000+. While online templates exist, an attorney ensures your documents meet Texas requirements and work together as intended."
      },
      {
        question: "Do I need a trust or just a will?",
        answer: "Trusts can avoid probate, provide privacy, and offer more control over asset distribution. However, they cost more and require maintenance. For many Navarro County families, a proper will with transfer-on-death designations for accounts meets their needs. An attorney can advise based on your situation."
      },
      {
        question: "What happens if I die without a will in Texas?",
        answer: "Texas intestacy laws determine who inherits your property. This may not match your wishes—especially for unmarried partners, stepchildren, or specific bequests. Your estate will go through probate, possibly with court-appointed administrators. A will is the only way to ensure your intentions are followed."
      }
    ],
    relatedServices: ["attorney", "financial-advisor", "accountant"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "business-attorney",
    title: "Business Attorney",
    category: "professional_services",
    subcategory: "legal",
    layout: 5,
    icon: "Briefcase",
    iconColor: "blue",
    metaTitle: "Business Attorney in Navarro County, TX | Business Lawyer Corsicana",
    metaDescription: "Business attorneys in Corsicana and Navarro County. Business formation, contracts, employment law, and litigation for local businesses.",
    metaKeywords: "business attorney Corsicana, business lawyer Navarro County, contracts, LLC formation",
    heroContent: `Every business needs legal guidance at some point. Business attorneys help with formation, contracts, employment issues, and disputes. Having a lawyer who understands your business can prevent problems and resolve issues efficiently.`,
    localContext: `Small businesses drive Navarro County's economy. Local business attorneys serve everyone from sole proprietors to established companies, understanding the legal challenges businesses face in our community and providing practical, cost-effective counsel.`,
    sections: [
      {
        type: "services",
        heading: "Business Legal Services",
        content: \`**Formation**
- Entity selection
- LLC formation
- Corporation setup
- Partnership agreements
- Operating agreements

**Contracts**
- Contract drafting
- Contract review
- Lease negotiations
- Vendor agreements
- Employment contracts

**Ongoing Counsel**
- Employment law
- Regulatory compliance
- Collections
- Business disputes
- Litigation defense\`
      }
    ],
    faqs: [
      {
        question: "Do I need an LLC for my small business?",
        answer: "LLCs provide liability protection, separating personal assets from business debts. For most small businesses, an LLC is appropriate and affordable to form ($300 filing fee plus attorney fees). Sole proprietorships are simpler but offer no liability protection. An attorney can advise on what's right for your situation."
      },
      {
        question: "How much does a business attorney cost?",
        answer: "Simple tasks like LLC formation run $500-$1,500. Contract review might cost $200-$500. Ongoing representation varies widely. Some attorneys offer flat fees for routine matters or monthly retainers for ongoing access. Discuss fee structures upfront to find an arrangement that works."
      },
      {
        question: "When should I consult a business attorney?",
        answer: "Before signing significant contracts, when forming or changing business structure, if you're hiring employees, when buying or selling a business, and when disputes arise. Early consultation prevents costly problems. Building a relationship with an attorney before emergencies makes getting help easier."
      }
    ],
    relatedServices: ["attorney", "accountant", "insurance-agent"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "tax-preparer",
    title: "Tax Preparation",
    category: "professional_services",
    subcategory: "financial",
    layout: 1,
    icon: "Calculator",
    iconColor: "green",
    metaTitle: "Tax Preparation in Navarro County, TX | Tax Preparer Corsicana",
    metaDescription: "Tax preparation services in Corsicana and Navarro County. Individual and business tax returns, IRS representation, and year-round tax help.",
    metaKeywords: "tax preparer Corsicana, tax preparation Navarro County, income tax, tax return, CPA",
    heroContent: `Accurate tax preparation maximizes your refund or minimizes your liability while ensuring IRS compliance. Navarro County tax preparers handle individual and business returns, from simple W-2 filings to complex situations with self-employment, investments, and business income.`,
    localContext: `Agricultural income, mineral rights, and small business ownership create complex tax situations for many Navarro County residents. Local tax preparers understand these specific needs and the tax implications of activities common in our area.`,
    sections: [
      {
        type: "services",
        heading: "Tax Services",
        content: \`**Individual**
- W-2 returns
- Self-employment
- Investments and dividends
- Rental income
- Farm income
- Multi-state returns

**Business**
- Sole proprietor (Schedule C)
- LLC and partnership returns
- S-Corporation returns
- C-Corporation returns
- Nonprofit returns

**Additional**
- Tax planning
- IRS representation
- Amended returns
- Prior year returns
- Audit support\`
      }
    ],
    faqs: [
      {
        question: "How much does tax preparation cost?",
        answer: "Simple individual returns (W-2, standard deduction) cost $100-$200. Itemized returns run $200-$400. Self-employment adds $100-$200. Business returns range from $300-$1,000+. Free options exist (VITA sites) for qualifying taxpayers. Prices vary by preparer and complexity."
      },
      {
        question: "When should I receive my W-2 and 1099 forms?",
        answer: "W-2s must be sent by January 31. 1099 forms are also due by January 31 in most cases. If you haven't received forms by mid-February, contact the payer. You can file with your last pay stub if necessary, though this requires care to ensure accuracy."
      },
      {
        question: "What's the difference between a CPA and other tax preparers?",
        answer: "CPAs (Certified Public Accountants) have passed rigorous exams and meet continuing education requirements. Enrolled Agents are IRS-licensed tax specialists. Other preparers may have varying credentials. All can prepare returns; CPAs and EAs can represent you before the IRS in audits and disputes."
      }
    ],
    relatedServices: ["accountant", "bookkeeper", "financial-advisor"],
    externalResources: [
      { name: "IRS Free File", url: "https://www.irs.gov/filing/free-file-do-your-federal-taxes-for-free" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "bookkeeper",
    title: "Bookkeeper",
    category: "professional_services",
    subcategory: "financial",
    layout: 2,
    icon: "BookOpen",
    iconColor: "slate",
    metaTitle: "Bookkeeper in Navarro County, TX | Bookkeeping Services Corsicana",
    metaDescription: "Bookkeeping services in Corsicana and Navarro County. QuickBooks, payroll, accounts payable/receivable, and financial record keeping.",
    metaKeywords: "bookkeeper Corsicana, bookkeeping Navarro County, QuickBooks, payroll, accounts",
    heroContent: `Accurate bookkeeping is essential for business success, tax preparation, and financial decision-making. Navarro County bookkeepers help small businesses maintain organized financial records without the cost of a full-time employee.`,
    localContext: `Many Navarro County small businesses and self-employed individuals need bookkeeping support but can't justify full-time staff. Local bookkeepers provide flexible services—from monthly reconciliation to full-service financial management—tailored to each client's needs.`,
    sections: [
      {
        type: "services",
        heading: "Bookkeeping Services",
        content: \`**Basic Bookkeeping**
- Transaction entry
- Bank reconciliation
- Credit card reconciliation
- Account maintenance
- Monthly reports

**Advanced Services**
- Accounts receivable
- Accounts payable
- Payroll processing
- Financial statements
- Cash flow management

**Software**
- QuickBooks (Online/Desktop)
- Xero
- FreshBooks
- Wave
- Custom solutions\`
      }
    ],
    faqs: [
      {
        question: "How much does bookkeeping cost?",
        answer: "Bookkeeping costs vary by transaction volume and services needed. Basic monthly bookkeeping runs $200-$500 for small businesses. More active businesses or those needing payroll, A/P, and A/R management pay $500-$1,500+. Some bookkeepers charge hourly ($25-$75/hour)."
      },
      {
        question: "What's the difference between bookkeeping and accounting?",
        answer: "Bookkeeping focuses on day-to-day transaction recording and categorization. Accounting involves analyzing financial data, preparing tax returns, and providing strategic advice. Bookkeepers maintain records; accountants interpret them. Many businesses need both, often from different providers."
      },
      {
        question: "Should I use QuickBooks or another software?",
        answer: "QuickBooks dominates small business bookkeeping because of its features and accountant familiarity. QuickBooks Online works well for most small businesses. However, industry-specific software may serve specialized needs better. Your bookkeeper can recommend what works best for your business."
      }
    ],
    relatedServices: ["accountant", "tax-preparer", "payroll-service"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "financial-advisor",
    title: "Financial Advisor",
    category: "professional_services",
    subcategory: "financial",
    layout: 3,
    icon: "TrendingUp",
    iconColor: "green",
    metaTitle: "Financial Advisor in Navarro County, TX | Investment Advisor Corsicana",
    metaDescription: "Financial advisors in Corsicana and Navarro County. Retirement planning, investment management, and wealth building strategies.",
    metaKeywords: "financial advisor Corsicana, investment Navarro County, retirement planning, wealth management",
    heroContent: `Planning for retirement, managing investments, and building wealth require expertise most people don't have time to develop. Financial advisors create personalized strategies to help you reach your financial goals and secure your future.`,
    localContext: `Navarro County residents have diverse financial planning needs—from young families starting out to retirees managing nest eggs to farmers planning succession. Local financial advisors understand our community and provide accessible advice without big-city minimums.`,
    sections: [
      {
        type: "services",
        heading: "Financial Planning Services",
        content: \`**Planning**
- Retirement planning
- Investment management
- Education funding
- Estate planning
- Tax planning
- Insurance analysis

**Investments**
- Portfolio management
- 401(k) advice
- IRA rollovers
- Asset allocation
- Risk assessment

**Life Stages**
- Young families
- Mid-career
- Pre-retirement
- Retirement income
- Wealth transfer\`
      }
    ],
    faqs: [
      {
        question: "How do financial advisors get paid?",
        answer: "Advisors may charge fees (flat, hourly, or percentage of assets), commissions on products sold, or combinations. Fee-only advisors charge only for advice, avoiding commission conflicts. Understand how your advisor is compensated before engaging—it affects the advice you receive."
      },
      {
        question: "How much money do I need to work with an advisor?",
        answer: "Some advisors have high minimums ($250,000+), but many serve clients with more modest assets. Fee-only advisors often work on an hourly or flat-fee basis regardless of assets. Don't assume you need significant wealth to get help—ask about minimums and fee structures."
      },
      {
        question: "What's the difference between a financial advisor and a financial planner?",
        answer: "Terms overlap significantly. Certified Financial Planner (CFP) is a specific credential indicating comprehensive training and fiduciary responsibility. \"Financial advisor\" is a general term that includes various credentials and compensation models. Ask about qualifications and fiduciary status."
      }
    ],
    relatedServices: ["accountant", "insurance-agent", "estate-attorney"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "payroll-service",
    title: "Payroll Services",
    category: "professional_services",
    subcategory: "financial",
    layout: 4,
    icon: "Wallet",
    iconColor: "blue",
    metaTitle: "Payroll Service in Navarro County, TX | Payroll Processing Corsicana",
    metaDescription: "Payroll services in Corsicana and Navarro County. Payroll processing, tax deposits, W-2s, and employee management for small businesses.",
    metaKeywords: "payroll service Corsicana, payroll Navarro County, payroll processing, payroll taxes",
    heroContent: `Payroll involves complex calculations, strict deadlines, and serious penalties for mistakes. Payroll services handle the details—calculating pay, withholding taxes, making deposits, and filing reports—so you can focus on running your business.`,
    localContext: `Many Navarro County small businesses start handling payroll themselves, then realize how time-consuming and risky it is. Local payroll services offer affordable solutions that ensure compliance, save time, and avoid costly errors.`,
    sections: [
      {
        type: "services",
        heading: "Payroll Services",
        content: \`**Processing**
- Payroll calculation
- Direct deposit
- Check printing
- Pay stub delivery
- Wage garnishments

**Tax Services**
- Tax withholding
- Tax deposits
- Quarterly filings
- Year-end W-2/1099
- State filings

**Additional**
- Time tracking
- PTO management
- New hire reporting
- Workers' comp
- HR support\`
      }
    ],
    faqs: [
      {
        question: "How much does payroll service cost?",
        answer: "Basic payroll services cost $20-$50 base fee plus $2-$10 per employee per pay period. Full-service options with tax filing run $50-$150+ monthly for small businesses. Pricing varies by features, number of employees, and pay frequency. Compare total costs including all fees."
      },
      {
        question: "What payroll taxes do employers pay?",
        answer: "Employers pay 6.2% Social Security and 1.45% Medicare (matching employee withholding), plus federal (FUTA) and state (TWC) unemployment taxes. Texas has no state income tax to withhold. Deposits are due monthly or semi-weekly depending on liability levels."
      },
      {
        question: "When are payroll taxes due?",
        answer: "Deposit schedules depend on your tax liability. Most small businesses deposit monthly (by the 15th of the following month). Larger employers deposit semi-weekly. Quarterly Form 941 is due by month-end following the quarter. W-2s are due to employees by January 31. Penalties for late deposits are significant."
      }
    ],
    relatedServices: ["bookkeeper", "accountant", "hr-consultant"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "insurance-agent",
    title: "Insurance Agent",
    category: "professional_services",
    subcategory: "financial",
    layout: 5,
    icon: "Shield",
    iconColor: "blue",
    metaTitle: "Insurance Agent in Navarro County, TX | Insurance Corsicana",
    metaDescription: "Insurance agents in Corsicana and Navarro County. Home, auto, life, business, and health insurance with personalized local service.",
    metaKeywords: "insurance agent Corsicana, insurance Navarro County, home insurance, auto insurance, life insurance",
    heroContent: `Insurance protects what matters most—your family, home, vehicle, and business. Local insurance agents understand Navarro County's specific risks and help you find appropriate coverage at competitive rates, with personal service when you need to file a claim.`,
    localContext: `Navarro County's mix of urban and rural properties, agricultural operations, and hail-prone weather creates specific insurance needs. Local agents understand these factors and represent carriers familiar with our area's claims history.`,
    sections: [
      {
        type: "services",
        heading: "Insurance Products",
        content: \`**Personal**
- Homeowners
- Auto
- Life
- Umbrella
- Renters
- Flood

**Business**
- General liability
- Commercial property
- Workers' compensation
- Commercial auto
- Professional liability

**Specialty**
- Farm and ranch
- Mobile home
- Motorcycle/RV
- Boat
- Health/Medicare\`
      }
    ],
    faqs: [
      {
        question: "Should I use an independent agent or a captive agent?",
        answer: "Independent agents represent multiple companies and can shop for the best rates. Captive agents work for one company but know their products deeply. Both can provide good service. Consider independent agents for comparison shopping, captive agents if you prefer a specific company."
      },
      {
        question: "How can I lower my insurance premiums?",
        answer: "Bundle policies (home + auto), increase deductibles, maintain good credit, ask about discounts (security systems, good driver, etc.), and shop rates every few years. However, don't sacrifice needed coverage to save money—the cheapest policy isn't always the best value."
      },
      {
        question: "Do I need flood insurance in Navarro County?",
        answer: "Standard homeowners insurance doesn't cover flooding. While not all of Navarro County is in a flood zone, flash flooding can occur anywhere. If your mortgage requires flood insurance, you need it. Even if not required, consider it—flood damage is devastating and policies are relatively affordable."
      }
    ],
    relatedServices: ["realtor", "accountant", "auto-repair"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  // ============================================
  // MORE HEALTH & WELLNESS
  // ============================================
  {
    slug: "family-doctor",
    title: "Family Doctor",
    category: "health_wellness",
    subcategory: "medical",
    layout: 1,
    icon: "Stethoscope",
    iconColor: "blue",
    metaTitle: "Family Doctor in Navarro County, TX | Primary Care Corsicana",
    metaDescription: "Family doctors in Corsicana and Navarro County. Primary care for all ages, preventive care, chronic disease management, and same-day sick visits.",
    metaKeywords: "family doctor Corsicana, primary care Navarro County, physician, doctor, healthcare",
    heroContent: `A family doctor provides comprehensive primary care for all ages—from newborns to seniors. They know your medical history, coordinate care, and are your first contact for health concerns. Having a regular doctor improves health outcomes.`,
    localContext: `Navarro County has primary care providers in Corsicana and surrounding communities. Family medicine clinics accept most insurance plans and offer services ranging from wellness checks to chronic disease management to same-day sick visits.`,
    sections: [
      {
        type: "services",
        heading: "Primary Care Services",
        content: \`**Preventive Care**
- Annual physicals
- Well-child visits
- Immunizations
- Health screenings
- Cancer screenings

**Acute Care**
- Same-day sick visits
- Minor injuries
- Infections
- Allergies
- Flu and cold

**Chronic Care**
- Diabetes management
- Hypertension
- Heart disease
- Thyroid disorders
- Arthritis\`
      }
    ],
    faqs: [
      {
        question: "Are family doctors taking new patients?",
        answer: "Most Navarro County family medicine practices accept new patients, though some popular doctors have waitlists. Call practices directly to check availability and whether they accept your insurance. New patient appointments may take 2-4 weeks to schedule; established patients often get quicker access."
      },
      {
        question: "What's the difference between a family doctor and internist?",
        answer: "Family doctors treat patients of all ages, from children to elderly. Internists (internal medicine doctors) focus on adults only. Both provide comprehensive primary care. If you need a doctor for your whole family, including children, choose family medicine."
      },
      {
        question: "Can I see a doctor without insurance?",
        answer: "Yes. Many clinics offer self-pay rates, often with discounts for paying at the time of service. Federally qualified health centers provide care on sliding fee scales. Urgent care and telehealth options also serve uninsured patients. Don't skip necessary care—ask about payment options."
      }
    ],
    relatedServices: ["pediatrician", "urgent-care", "pharmacy"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "pediatrician",
    title: "Pediatrician",
    category: "health_wellness",
    subcategory: "medical",
    layout: 2,
    icon: "Baby",
    iconColor: "sky",
    metaTitle: "Pediatrician in Navarro County, TX | Children's Doctor Corsicana",
    metaDescription: "Pediatricians in Corsicana and Navarro County. Well-child care, immunizations, sick visits, and specialized care for infants through adolescents.",
    metaKeywords: "pediatrician Corsicana, children's doctor Navarro County, kids doctor, baby doctor",
    heroContent: `Children have unique healthcare needs that differ from adults. Pediatricians specialize in caring for infants, children, and adolescents, understanding their development and the conditions that affect young patients.`,
    localContext: `Navarro County families have access to pediatric care in Corsicana. Pediatricians work closely with schools, daycares, and families to keep children healthy, offering well-child visits, immunizations, and treatment for childhood illnesses.`,
    sections: [
      {
        type: "services",
        heading: "Pediatric Services",
        content: \`**Well-Child Care**
- Newborn care
- Developmental screenings
- Growth monitoring
- Immunizations
- School and sports physicals

**Sick Visits**
- Fever and infections
- Ear infections
- Rashes
- Respiratory illness
- GI problems

**Specialized Care**
- ADHD evaluation
- Asthma management
- Allergies
- Behavioral concerns
- Chronic conditions\`
      }
    ],
    faqs: [
      {
        question: "How often should my child see the pediatrician?",
        answer: "Newborns have frequent visits (several in the first months). First year: 2 weeks, 2, 4, 6, 9, and 12 months. Ages 1-3: every 6-12 months. After age 3: annual well-child visits. Additional visits are scheduled for illnesses, concerns, or ongoing conditions. Follow your pediatrician's recommendations."
      },
      {
        question: "When should I take my child to the pediatrician vs. urgent care?",
        answer: "See your pediatrician for routine care, minor illnesses, and non-emergency concerns—they know your child's history. Urgent care works for after-hours minor issues. Go to the ER for serious emergencies: difficulty breathing, severe allergic reactions, high fevers in infants, or significant injuries."
      },
      {
        question: "What immunizations does my child need for school?",
        answer: "Texas requires specific vaccines for school entry, including DTaP, polio, MMR, hepatitis B, and varicella. Requirements vary by age and school level. Your pediatrician tracks immunizations and provides the records schools require. Religious or medical exemptions require specific documentation."
      }
    ],
    relatedServices: ["family-doctor", "daycare", "pharmacy"],
    externalResources: [
      { name: "Texas Immunization Requirements", url: "https://www.dshs.texas.gov/immunize/school/default.shtm" }
    ],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "urgent-care",
    title: "Urgent Care",
    category: "health_wellness",
    subcategory: "medical",
    layout: 3,
    icon: "Clock",
    iconColor: "red",
    metaTitle: "Urgent Care in Navarro County, TX | Walk-In Clinic Corsicana",
    metaDescription: "Urgent care clinics in Corsicana and Navarro County. Walk-in treatment for minor emergencies, injuries, and illnesses without appointments.",
    metaKeywords: "urgent care Corsicana, walk-in clinic Navarro County, after hours doctor, minor emergency",
    heroContent: `Urgent care bridges the gap between your regular doctor and the emergency room. For non-life-threatening illnesses and injuries that can't wait for a regular appointment, urgent care provides convenient, walk-in treatment.`,
    localContext: `Urgent care centers in Navarro County offer extended hours and weekend availability, providing an alternative to ER visits for minor issues. Most accept insurance and offer self-pay rates, making them accessible for various situations.`,
    sections: [
      {
        type: "services",
        heading: "Urgent Care Services",
        content: \`**Common Conditions**
- Cold and flu
- Sore throat
- Ear infections
- Urinary infections
- Allergies
- Rashes

**Minor Injuries**
- Sprains and strains
- Minor cuts
- Burns
- Fractures
- Bites and stings

**Services**
- X-rays
- Lab tests
- Stitches
- Splinting
- Injections
- Physicals\`
      }
    ],
    faqs: [
      {
        question: "When should I go to urgent care vs. the ER?",
        answer: "Go to urgent care for non-life-threatening issues: minor injuries, common illnesses, simple fractures. Go to the ER for: chest pain, difficulty breathing, severe bleeding, head injuries, stroke symptoms, or anything life-threatening. When in doubt, call ahead—urgent care can advise if they can help."
      },
      {
        question: "How much does urgent care cost?",
        answer: "With insurance, expect $25-$75 copays depending on your plan. Self-pay visits typically run $100-$200 for the visit, plus additional costs for labs, X-rays, or procedures. This is significantly less than ER visits, which can be thousands of dollars."
      },
      {
        question: "Do I need an appointment for urgent care?",
        answer: "Most urgent cares accept walk-ins, which is their purpose. However, many now offer online check-in or reservation systems that reduce wait times. Check-in online, then arrive when it's close to your turn. Wait times vary—evenings and weekends are typically busiest."
      }
    ],
    relatedServices: ["family-doctor", "pharmacy", "chiropractor"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "chiropractor",
    title: "Chiropractor",
    category: "health_wellness",
    subcategory: "specialist",
    layout: 4,
    icon: "Activity",
    iconColor: "green",
    metaTitle: "Chiropractor in Navarro County, TX | Chiropractic Care Corsicana",
    metaDescription: "Chiropractors in Corsicana and Navarro County. Spinal adjustments, back pain treatment, and wellness care for pain relief and improved function.",
    metaKeywords: "chiropractor Corsicana, chiropractic Navarro County, back pain, spinal adjustment, neck pain",
    heroContent: `Chiropractic care focuses on the spine and musculoskeletal system, using manual adjustments to restore proper alignment and relieve pain. Navarro County chiropractors treat back pain, neck pain, headaches, and other conditions without surgery or drugs.`,
    localContext: `Many Navarro County residents seek chiropractic care for work-related injuries, vehicle accident recovery, and chronic pain management. Local chiropractors work with other healthcare providers and insurance companies to provide coordinated care.`,
    sections: [
      {
        type: "services",
        heading: "Chiropractic Services",
        content: \`**Conditions**
- Back pain
- Neck pain
- Headaches/migraines
- Sciatica
- Whiplash
- Sports injuries

**Treatments**
- Spinal adjustments
- Soft tissue therapy
- Therapeutic exercises
- Spinal decompression
- Electrical stimulation
- Ultrasound therapy

**Wellness**
- Posture correction
- Ergonomic advice
- Wellness care
- Preventive treatment\`
      }
    ],
    faqs: [
      {
        question: "Does chiropractic treatment hurt?",
        answer: "Most adjustments are painless. You may hear popping sounds (like knuckle cracking) as joints are adjusted. Some patients experience mild soreness after initial treatments, similar to starting a new exercise. Chiropractors adjust technique based on patient comfort and condition."
      },
      {
        question: "Does insurance cover chiropractic care?",
        answer: "Many health insurance plans cover chiropractic care, though visit limits may apply. Medicare covers chiropractic for specific conditions. Auto insurance covers treatment for accident injuries. Workers' comp covers work-related injuries. Check your plan's specifics and any referral requirements."
      },
      {
        question: "How often do I need chiropractic treatment?",
        answer: "Initial treatment for acute conditions might be 2-3 times weekly for several weeks, then tapering. Chronic conditions may need ongoing maintenance. Some people benefit from regular wellness visits (monthly or as needed). Your chiropractor will recommend a treatment plan based on your condition."
      }
    ],
    relatedServices: ["physical-therapist", "massage-therapist", "personal-injury-lawyer"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "physical-therapist",
    title: "Physical Therapist",
    category: "health_wellness",
    subcategory: "specialist",
    layout: 5,
    icon: "HeartPulse",
    iconColor: "red",
    metaTitle: "Physical Therapist in Navarro County, TX | Physical Therapy Corsicana",
    metaDescription: "Physical therapists in Corsicana and Navarro County. Rehabilitation, injury recovery, pain management, and movement restoration.",
    metaKeywords: "physical therapist Corsicana, physical therapy Navarro County, PT, rehabilitation, injury",
    heroContent: `Physical therapy helps you recover from injuries, surgeries, and conditions that affect movement. Therapists use exercises, manual therapy, and education to restore function, reduce pain, and prevent future problems.`,
    localContext: `Navarro County physical therapy clinics help patients recover from orthopedic surgeries, sports injuries, work injuries, and stroke. Physical therapists work with physicians and insurance companies to provide rehabilitation that gets you back to normal activities.`,
    sections: [
      {
        type: "services",
        heading: "Physical Therapy Services",
        content: \`**Orthopedic**
- Post-surgical rehab
- Joint replacement
- Sports injuries
- Sprains and strains
- Fracture recovery

**Neurological**
- Stroke recovery
- Brain injury
- Balance disorders
- Parkinson's
- MS treatment

**Other**
- Back and neck pain
- Work injuries
- Chronic pain
- Pediatric PT
- Vestibular therapy\`
      }
    ],
    faqs: [
      {
        question: "Do I need a referral for physical therapy?",
        answer: "Texas allows direct access to physical therapists without a physician referral for up to 10 consecutive treatment days. After that, or for certain conditions, a referral is needed. Your insurance may have its own referral requirements. Check with both your insurance and the PT clinic."
      },
      {
        question: "How long is physical therapy treatment?",
        answer: "Treatment length varies by condition. Simple sprains might need 4-6 visits over a few weeks. Post-surgical rehab typically runs 8-12 weeks. Chronic conditions may need longer treatment. Therapists establish goals and timelines, adjusting as you progress."
      },
      {
        question: "What should I wear to physical therapy?",
        answer: "Wear comfortable, loose clothing that allows movement and provides access to the treatment area. Athletic wear works well. For leg/knee treatment, shorts are helpful. For shoulder issues, tank tops or loose shirts work best. Closed-toe athletic shoes are appropriate for most sessions."
      }
    ],
    relatedServices: ["chiropractor", "massage-therapist", "orthopedic-surgeon"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "optometrist",
    title: "Optometrist",
    category: "health_wellness",
    subcategory: "specialist",
    layout: 1,
    icon: "Eye",
    iconColor: "blue",
    metaTitle: "Optometrist in Navarro County, TX | Eye Doctor Corsicana",
    metaDescription: "Optometrists in Corsicana and Navarro County. Eye exams, glasses, contacts, and treatment for eye conditions and vision problems.",
    metaKeywords: "optometrist Corsicana, eye doctor Navarro County, eye exam, glasses, contacts",
    heroContent: `Optometrists provide comprehensive eye care—from prescribing glasses and contacts to detecting and treating eye diseases. Regular eye exams protect your vision and can reveal other health conditions like diabetes and high blood pressure.`,
    localContext: `Navarro County optometrists offer complete eye care services including exams, corrective lenses, and treatment for common eye conditions. Many offices include optical shops for convenient glasses selection and fitting.`,
    sections: [
      {
        type: "services",
        heading: "Eye Care Services",
        content: \`**Exams**
- Comprehensive eye exams
- Contact lens fitting
- Pediatric eye exams
- Vision screenings
- Pre-operative exams

**Corrective Lenses**
- Glasses prescriptions
- Contact lens prescriptions
- Specialty contacts
- Sunglasses

**Treatment**
- Dry eye treatment
- Glaucoma management
- Diabetic eye exams
- Eye infections
- Foreign body removal\`
      }
    ],
    faqs: [
      {
        question: "How often should I get an eye exam?",
        answer: "Adults with no vision problems should have exams every 1-2 years. Those with glasses/contacts, over 60, or with health conditions like diabetes should have annual exams. Children should have exams before starting school and regularly thereafter. Your optometrist will recommend appropriate frequency."
      },
      {
        question: "Does insurance cover eye exams?",
        answer: "Vision insurance typically covers annual exams with copays of $10-$40, plus allowances for glasses or contacts. Medical insurance may cover exams for medical conditions (diabetes, glaucoma) differently than routine vision. Understand what your plan covers before your appointment."
      },
      {
        question: "What's the difference between an optometrist and ophthalmologist?",
        answer: "Optometrists (OD) provide primary eye care: exams, glasses/contacts, and treat many conditions. Ophthalmologists (MD) are medical doctors who perform surgery and treat complex eye diseases. Most people see optometrists for routine care and are referred to ophthalmologists when surgery or specialized treatment is needed."
      }
    ],
    relatedServices: ["family-doctor", "pediatrician"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "therapist",
    title: "Therapist / Counselor",
    category: "health_wellness",
    subcategory: "mental_health",
    layout: 2,
    icon: "MessageCircle",
    iconColor: "purple",
    metaTitle: "Therapist in Navarro County, TX | Counseling Corsicana",
    metaDescription: "Therapists and counselors in Corsicana and Navarro County. Individual, couples, and family counseling for mental health and life challenges.",
    metaKeywords: "therapist Corsicana, counselor Navarro County, mental health, counseling, therapy",
    heroContent: `Everyone faces challenges that can benefit from professional support. Therapists and counselors provide a safe space to work through depression, anxiety, relationship issues, grief, and other life challenges. Seeking help is a sign of strength.`,
    localContext: `Mental health services are available in Navarro County through private practices, community mental health centers, and telehealth. Finding the right therapist matters—many offer free consultations to ensure a good fit.`,
    sections: [
      {
        type: "services",
        heading: "Counseling Services",
        content: \`**Individual Therapy**
- Depression
- Anxiety
- Trauma/PTSD
- Grief and loss
- Life transitions
- Stress management

**Relationship**
- Couples counseling
- Marriage therapy
- Family therapy
- Pre-marital counseling
- Divorce support

**Specialized**
- Child and adolescent
- Faith-based counseling
- LGBTQ+ affirming
- Career counseling\`
      }
    ],
    faqs: [
      {
        question: "How do I find the right therapist?",
        answer: "Look for someone specializing in your concerns with credentials you're comfortable with (LPC, LMFT, LCSW, PhD). Many offer free phone consultations. The relationship matters—a good fit means you feel comfortable and understood. It's okay to try different therapists before committing."
      },
      {
        question: "Does insurance cover therapy?",
        answer: "Most health insurance covers mental health services, though copays and session limits vary. Some therapists don't accept insurance but provide superbills for out-of-network reimbursement. Community mental health centers offer sliding-scale fees. Ask about costs and payment options upfront."
      },
      {
        question: "How long does therapy take?",
        answer: "It depends on your concerns and goals. Some issues resolve in 6-12 sessions; others benefit from longer-term work. You're in control—discuss goals and progress with your therapist regularly. Therapy ends when you've achieved your goals and developed skills to maintain progress."
      }
    ],
    relatedServices: ["psychiatrist", "marriage-counselor", "addiction-counselor"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "gym",
    title: "Gym / Fitness Center",
    category: "health_wellness",
    subcategory: "fitness",
    layout: 3,
    icon: "Dumbbell",
    iconColor: "orange",
    metaTitle: "Gym in Navarro County, TX | Fitness Center Corsicana",
    metaDescription: "Gyms and fitness centers in Corsicana and Navarro County. Workout facilities, group classes, personal training, and membership options.",
    metaKeywords: "gym Corsicana, fitness center Navarro County, workout, exercise, health club",
    heroContent: `Regular exercise improves health, energy, and mood. Navarro County gyms offer the equipment, classes, and motivation to reach your fitness goals, from casual exercisers to serious athletes.`,
    localContext: `Fitness options in Navarro County range from national chains to locally-owned gyms, each with different equipment, classes, and atmospheres. Some focus on general fitness while others specialize in areas like strength training, group fitness, or CrossFit-style workouts.`,
    sections: [
      {
        type: "services",
        heading: "Gym Facilities",
        content: \`**Equipment**
- Cardio machines
- Free weights
- Weight machines
- Functional training
- Stretching areas

**Classes**
- Group fitness
- Spinning/cycling
- Yoga and pilates
- HIIT classes
- Zumba

**Services**
- Personal training
- Fitness assessments
- Locker rooms
- Showers
- Childcare (some)\`
      }
    ],
    faqs: [
      {
        question: "How much does a gym membership cost?",
        answer: "Basic gym memberships in Navarro County run $20-$50/month. Premium facilities with more amenities and classes cost $50-$100+. Many gyms offer no-contract options, though contracts may have lower monthly rates. Watch for enrollment fees and cancellation policies."
      },
      {
        question: "What should I look for in a gym?",
        answer: "Consider location (you'll go more if it's convenient), hours, equipment you'll use, cleanliness, atmosphere, and whether classes are included. Tour during the time you'd typically work out to see how crowded it is. Try a guest pass before committing."
      },
      {
        question: "Do I need personal training?",
        answer: "Personal training isn't required but can help beginners learn proper form, those with specific goals create effective programs, and anyone needing accountability. Even a few sessions to learn the basics can be valuable. Trainers cost $40-$80+ per session, though packages offer discounts."
      }
    ],
    relatedServices: ["personal-trainer", "yoga-instructor", "nutritionist", "martial-arts"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "nutritionist",
    title: "Nutritionist / Dietitian",
    category: "health_wellness",
    subcategory: "fitness",
    layout: 4,
    icon: "Apple",
    iconColor: "green",
    metaTitle: "Nutritionist in Navarro County, TX | Dietitian Corsicana",
    metaDescription: "Nutritionists and registered dietitians in Corsicana and Navarro County. Personalized nutrition plans, weight management, and medical nutrition therapy.",
    metaKeywords: "nutritionist Corsicana, dietitian Navarro County, nutrition counseling, weight loss, diet",
    heroContent: `Nutrition affects every aspect of health. Registered dietitians and nutritionists create personalized eating plans for weight management, medical conditions, sports performance, and general wellness. Evidence-based guidance helps you make lasting changes.`,
    localContext: `Navarro County residents can access nutrition services through healthcare facilities, private practices, and telehealth. Registered dietitians work with individuals and families to address specific health goals and conditions.`,
    sections: [
      {
        type: "services",
        heading: "Nutrition Services",
        content: \`**Weight Management**
- Weight loss programs
- Healthy weight gain
- Metabolic assessment
- Behavior modification
- Long-term maintenance

**Medical Nutrition**
- Diabetes management
- Heart disease
- Digestive disorders
- Food allergies
- Kidney disease

**Specialty**
- Sports nutrition
- Pediatric nutrition
- Eating disorders
- Pregnancy nutrition
- Senior nutrition\`
      }
    ],
    faqs: [
      {
        question: "What's the difference between a nutritionist and dietitian?",
        answer: "Registered Dietitians (RD or RDN) have completed accredited education, supervised practice, and passed a national exam—they're the clinical gold standard. \"Nutritionist\" is less regulated and may indicate various training levels. For medical conditions, seek an RD. Both can help with general wellness and weight management."
      },
      {
        question: "Does insurance cover nutrition counseling?",
        answer: "Insurance often covers medical nutrition therapy when provided by an RD for conditions like diabetes, kidney disease, or eating disorders. Coverage for weight loss or general wellness varies. Medicare covers certain nutrition services. Check your plan's specifics and get referrals if required."
      },
      {
        question: "How often do I need to see a nutritionist?",
        answer: "Initial consultations establish goals and create plans. Follow-up frequency depends on your situation—weekly visits help with accountability for major changes; monthly check-ins work for maintenance. Many people benefit from ongoing support even after reaching initial goals."
      }
    ],
    relatedServices: ["personal-trainer", "weight-loss-clinic", "family-doctor"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "assisted-living",
    title: "Assisted Living",
    category: "health_wellness",
    subcategory: "senior",
    layout: 5,
    icon: "Home",
    iconColor: "rose",
    metaTitle: "Assisted Living in Navarro County, TX | Senior Living Corsicana",
    metaDescription: "Assisted living facilities in Corsicana and Navarro County. Senior housing with care services, meals, activities, and 24-hour support.",
    metaKeywords: "assisted living Corsicana, senior living Navarro County, elderly care, retirement home",
    heroContent: `Assisted living provides seniors who need some help with daily activities a supportive environment while maintaining independence. Residents receive meals, housekeeping, medication management, and personal care assistance in a community setting.`,
    localContext: `Navarro County has assisted living options ranging from smaller residential facilities to larger communities. Families can choose settings that match their loved one's needs and preferences while staying close to home.`,
    sections: [
      {
        type: "services",
        heading: "Assisted Living Services",
        content: \`**Care Services**
- Medication management
- Bathing and dressing help
- Mobility assistance
- Health monitoring
- 24-hour staff

**Amenities**
- Private apartments
- Meals and dining
- Housekeeping
- Laundry service
- Transportation

**Activities**
- Social programs
- Exercise classes
- Outings and events
- Spiritual services
- Entertainment\`
      }
    ],
    faqs: [
      {
        question: "How much does assisted living cost?",
        answer: "Assisted living in Texas averages $3,500-$5,500/month depending on location, room type, and care level needed. Costs increase with higher care needs. Medicare doesn't cover assisted living; Medicaid has limited programs. Long-term care insurance and VA benefits may help cover costs."
      },
      {
        question: "What's the difference between assisted living and nursing homes?",
        answer: "Assisted living provides help with daily activities but not skilled medical care. Nursing homes (skilled nursing facilities) provide 24-hour medical care for those needing rehabilitation or complex medical management. Assisted living residents are generally more independent; nursing home residents need more intensive care."
      },
      {
        question: "How do I choose an assisted living facility?",
        answer: "Visit multiple facilities. Observe cleanliness, staff interactions, and resident engagement. Talk to residents and families. Ask about staff ratios, care levels available, and what's included in costs. Check state inspection reports. Trust your instincts about the environment and culture."
      }
    ],
    relatedServices: ["nursing-home", "senior-care", "home-health-care"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "senior-care",
    title: "Senior Home Care",
    category: "health_wellness",
    subcategory: "senior",
    layout: 1,
    icon: "Heart",
    iconColor: "pink",
    metaTitle: "Senior Home Care in Navarro County, TX | In-Home Care Corsicana",
    metaDescription: "Senior home care services in Corsicana and Navarro County. In-home caregivers, companionship, and assistance for aging in place.",
    metaKeywords: "senior home care Corsicana, in-home care Navarro County, elderly care, caregiver, aging in place",
    heroContent: `Many seniors prefer to age in their own homes. Home care services provide assistance with daily activities, companionship, and monitoring while allowing seniors to maintain their independence and familiar surroundings.`,
    localContext: `Navarro County families seeking to keep loved ones at home can access home care agencies and independent caregivers. Services range from a few hours of companion care to round-the-clock assistance, matching care levels to individual needs.`,
    sections: [
      {
        type: "services",
        heading: "Home Care Services",
        content: \`**Personal Care**
- Bathing and hygiene
- Dressing assistance
- Medication reminders
- Mobility help
- Toileting assistance

**Companion Care**
- Companionship
- Conversation
- Light housekeeping
- Meal preparation
- Errands and shopping

**Specialized**
- Dementia care
- Respite care
- Post-hospital care
- Overnight care
- Live-in care\`
      }
    ],
    faqs: [
      {
        question: "How much does in-home care cost?",
        answer: "Home care in Texas typically costs $18-$28 per hour depending on care level and agency vs. private hire. Full-time care (40+ hours weekly) runs $3,000-$5,000/month. Live-in care costs more. Medicare doesn't cover non-medical home care; Medicaid has limited programs. Long-term care insurance may help."
      },
      {
        question: "Should I hire through an agency or directly?",
        answer: "Agencies handle screening, payroll, and backup coverage if a caregiver is sick—easier but more expensive. Direct hiring costs less but makes you the employer responsible for taxes, insurance, and finding substitutes. Consider your capacity to manage employment relationships."
      },
      {
        question: "How many hours of care does my loved one need?",
        answer: "Start by assessing what help is needed: personal care, meal prep, medication reminders, companionship, or supervision. Some need just a few hours daily; others require 24-hour care. A care assessment from an agency can help determine appropriate care levels. Needs often increase over time."
      }
    ],
    relatedServices: ["assisted-living", "home-health-care", "hospice"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  },

  {
    slug: "home-health-care",
    title: "Home Health Care",
    category: "health_wellness",
    subcategory: "medical",
    layout: 2,
    icon: "Stethoscope",
    iconColor: "blue",
    metaTitle: "Home Health Care in Navarro County, TX | Medical Home Care Corsicana",
    metaDescription: "Home health care services in Corsicana and Navarro County. Skilled nursing, physical therapy, and medical care in your home.",
    metaKeywords: "home health care Corsicana, home nursing Navarro County, skilled nursing, home PT",
    heroContent: `Home health care provides skilled medical services in your home—nursing, therapy, and other clinical care. Often following hospitalization or for chronic conditions, home health helps patients recover and manage health without facility stays.`,
    localContext: `Home health agencies serve Navarro County residents who need medical care but prefer to receive it at home. These Medicare-certified services are typically ordered by physicians and covered by insurance when medically necessary.`,
    sections: [
      {
        type: "services",
        heading: "Home Health Services",
        content: \`**Skilled Nursing**
- Wound care
- IV therapy
- Medication management
- Disease education
- Vital sign monitoring

**Therapy**
- Physical therapy
- Occupational therapy
- Speech therapy
- Rehabilitation

**Other Services**
- Medical social work
- Home health aides
- Nutrition counseling
- Chronic disease management\`
      }
    ],
    faqs: [
      {
        question: "What's the difference between home health and home care?",
        answer: "Home health provides skilled medical services (nursing, therapy) ordered by a physician—covered by Medicare when medically necessary. Home care provides non-medical assistance (personal care, companionship, housekeeping)—typically not covered by Medicare. Different needs may require one or both."
      },
      {
        question: "Does Medicare cover home health care?",
        answer: "Yes, Medicare covers home health when: you're homebound, need skilled nursing or therapy, a doctor orders services, and care is from a Medicare-certified agency. Coverage includes nursing, therapy, and some home health aide services. No copays for covered services."
      },
      {
        question: "How do I get home health care started?",
        answer: "Your physician orders home health based on medical need. The agency contacts you to schedule an assessment and begin services. Medicare requires periodic reauthorization. You can request specific agencies or ask your doctor for recommendations."
      }
    ],
    relatedServices: ["senior-care", "physical-therapist", "hospice", "family-doctor"],
    externalResources: [],
    claimedBusinessId: null,
    status: "active"
  }
];

// Export for seeding
export default servicePages;
