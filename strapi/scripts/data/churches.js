/**
 * Churches in Navarro County
 * Extracted from navarro-county-complete-seed.js
 */

export const churches = [
  // === CORSICANA CHURCHES ===
  {
    name: "First Baptist Church Corsicana",
    denomination: "baptist",
    address: "301 N 15th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2651",
    website: "https://www.fbccorsicana.com",
    lat: 32.0981,
    lng: -96.4687,
    service_times: [
      { day: "Sunday", time: "9:00 AM", type: "Sunday School" },
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "First United Methodist Church Corsicana",
    denomination: "methodist",
    address: "220 N 15th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2631",
    website: "https://www.fumccorsicana.org",
    lat: 32.0956,
    lng: -96.4687,
    service_times: [
      { day: "Sunday", time: "8:30 AM", type: "Traditional" },
      { day: "Sunday", time: "11:00 AM", type: "Traditional" }
    ],
    status: "active"
  },
  {
    name: "Immaculate Conception Catholic Church",
    denomination: "catholic",
    address: "3000 W State Highway 22, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-6765",
    website: "https://iccorsicana.org",
    lat: 32.0847,
    lng: -96.5139,
    service_times: [
      { day: "Saturday", time: "5:00 PM", type: "Mass" },
      { day: "Sunday", time: "8:00 AM", type: "Mass (Spanish)" },
      { day: "Sunday", time: "10:30 AM", type: "Mass" }
    ],
    status: "active"
  },
  {
    name: "Westminster Presbyterian Church",
    denomination: "presbyterian",
    address: "312 N 13th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-3781",
    lat: 32.0977,
    lng: -96.4707,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Grace Bible Church",
    denomination: "non_denominational",
    address: "2309 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-2609",
    lat: 32.0878,
    lng: -96.4856,
    service_times: [
      { day: "Sunday", time: "9:30 AM", type: "Sunday School" },
      { day: "Sunday", time: "10:45 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Northside Church of Christ",
    denomination: "church_of_christ",
    address: "1801 N Business 45, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-7077",
    lat: 32.1123,
    lng: -96.4692,
    service_times: [
      { day: "Sunday", time: "9:30 AM", type: "Bible Class" },
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Jackson Street Church of Christ",
    denomination: "church_of_christ",
    address: "500 S Jackson St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-4252",
    lat: 32.0889,
    lng: -96.4634,
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "St. John's Episcopal Church",
    denomination: "episcopal",
    address: "101 N 14th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-5425",
    lat: 32.0949,
    lng: -96.4697,
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Holy Eucharist" }
    ],
    status: "active"
  },
  {
    name: "First Assembly of God",
    denomination: "assembly_of_god",
    address: "3120 W State Highway 22, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-6000",
    lat: 32.0847,
    lng: -96.5159,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" },
      { day: "Wednesday", time: "7:00 PM", type: "Service" }
    ],
    status: "active"
  },
  {
    name: "Calvary Baptist Church",
    denomination: "baptist",
    address: "308 E 11th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-4367",
    lat: 32.0916,
    lng: -96.4619,
    service_times: [
      { day: "Sunday", time: "10:45 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Trinity Lutheran Church",
    denomination: "lutheran",
    address: "324 N 15th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-4921",
    lat: 32.0983,
    lng: -96.4687,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Faith Lutheran Church",
    denomination: "lutheran",
    address: "3824 TX-22, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-8795",
    lat: 32.0847,
    lng: -96.5259,
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Cowboy Church of Corsicana",
    denomination: "non_denominational",
    address: "5864 W State Hwy 31, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-8000",
    lat: 32.0757,
    lng: -96.5639,
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Highpoint Church",
    denomination: "non_denominational",
    address: "3100 N 45th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-4673",
    website: "https://highpointcorsicana.com",
    lat: 32.1157,
    lng: -96.4449,
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Central Independent Baptist Church",
    denomination: "baptist",
    address: "1500 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-3936",
    website: "https://www.centralcorsicana.com",
    lat: 32.0878,
    lng: -96.4796,
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Angus Baptist Church",
    denomination: "baptist",
    address: "6155 S IH 45 E, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 875-2771",
    lat: 32.0347,
    lng: -96.4189,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Bethany Baptist Church",
    denomination: "baptist",
    address: "1900 Mulberry Dr, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-2285",
    lat: 32.1033,
    lng: -96.4419,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Bethlehem Baptist Church",
    denomination: "baptist",
    address: "409 N 3rd St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2591",
    lat: 32.0968,
    lng: -96.4802,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Memorial Baptist Church",
    denomination: "baptist",
    address: "1700 N 45th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-6464",
    lat: 32.1057,
    lng: -96.4449,
    service_times: [
      { day: "Sunday", time: "10:45 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Northside Baptist Church",
    denomination: "baptist",
    address: "2800 N Beaton St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-5601",
    lat: 32.1147,
    lng: -96.4692,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Grace Community Church",
    denomination: "baptist",
    address: "227 N Beaton St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-8455",
    lat: 32.0961,
    lng: -96.4692,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "13th Avenue Christian Church",
    denomination: "other",
    address: "605 E 13th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2817",
    lat: 32.0932,
    lng: -96.4599,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Calvary Worship Center",
    denomination: "pentecostal",
    address: "1364 N Beaton St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 875-1084",
    lat: 32.1027,
    lng: -96.4692,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Bethel Temple Church",
    denomination: "pentecostal",
    address: "701 N 24th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-3291",
    lat: 32.0978,
    lng: -96.4580,
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Bethel Seventh-day Adventist Church",
    denomination: "other",
    address: "717 E 13th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2817",
    lat: 32.0932,
    lng: -96.4589,
    service_times: [
      { day: "Saturday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Believers Bible Church",
    denomination: "other",
    address: "2400 Bowie Dr, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-2888",
    lat: 32.1083,
    lng: -96.4559,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Unity Baptist Church",
    denomination: "baptist",
    address: "406 S 34th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-2861",
    lat: 32.0899,
    lng: -96.4549,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Mt. Zion Baptist Church",
    denomination: "baptist",
    address: "1408 Elm St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-6555",
    lat: 32.0948,
    lng: -96.4762,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Bethel AME Church",
    denomination: "other",
    address: "615 N 5th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2833",
    lat: 32.0978,
    lng: -96.4779,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Second Avenue Missionary Baptist Church",
    denomination: "baptist",
    address: "300 E 2nd Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2817",
    website: "https://secondavenuembc.org",
    lat: 32.0858,
    lng: -96.4639,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Iglesia Bautista Nueva Esperanza",
    denomination: "baptist",
    address: "1109 W 3rd Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-9112",
    lat: 32.0869,
    lng: -96.4756,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" },
      { day: "Sunday", time: "6:00 PM", type: "Service" }
    ],
    status: "active"
  },
  {
    name: "New Life Fellowship",
    denomination: "non_denominational",
    address: "2801 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 875-0770",
    lat: 32.0878,
    lng: -96.4916,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },

  // === KERENS CHURCHES ===
  {
    name: "First Baptist Church Kerens",
    denomination: "baptist",
    address: "300 E Highway 31, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2262",
    lat: 32.1311,
    lng: -96.2281,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "First United Methodist Church Kerens",
    denomination: "methodist",
    address: "201 N Colket Ave, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2283",
    lat: 32.1321,
    lng: -96.2301,
    service_times: [
      { day: "Sunday", time: "10:50 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Kerens Presbyterian Church",
    denomination: "presbyterian",
    address: "202 S Colket Ave, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2481",
    lat: 32.1301,
    lng: -96.2301,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "First Assembly of God Kerens",
    denomination: "assembly_of_god",
    address: "101 E Highway 31, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2731",
    lat: 32.1311,
    lng: -96.2271,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },

  // === BLOOMING GROVE CHURCHES ===
  {
    name: "First Baptist Church Blooming Grove",
    denomination: "baptist",
    address: "301 E Fordyce St, Blooming Grove, TX 76626",
    town: "Blooming Grove",
    phone: "(903) 695-2501",
    lat: 32.0889,
    lng: -96.7189,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "First United Methodist Church Blooming Grove",
    denomination: "methodist",
    address: "108 W Main St, Blooming Grove, TX 76626",
    town: "Blooming Grove",
    phone: "(903) 695-2484",
    lat: 32.0879,
    lng: -96.7199,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Blooming Grove Church of Christ",
    denomination: "church_of_christ",
    address: "200 E Main St, Blooming Grove, TX 76626",
    town: "Blooming Grove",
    phone: "(903) 695-2511",
    lat: 32.0889,
    lng: -96.7179,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },

  // === RICE CHURCHES ===
  {
    name: "First Baptist Church Rice",
    denomination: "baptist",
    address: "404 N Houston St, Rice, TX 75155",
    town: "Rice",
    phone: "(903) 326-4361",
    lat: 32.2439,
    lng: -96.5019,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Rice United Methodist Church",
    denomination: "methodist",
    address: "309 S Houston St, Rice, TX 75155",
    town: "Rice",
    phone: "(903) 326-4211",
    lat: 32.2419,
    lng: -96.5019,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },

  // === DAWSON CHURCHES ===
  {
    name: "First Baptist Church Dawson",
    denomination: "baptist",
    address: "200 W Main St, Dawson, TX 76639",
    town: "Dawson",
    phone: "(254) 578-1228",
    lat: 31.9019,
    lng: -96.7139,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "First United Methodist Church Dawson",
    denomination: "methodist",
    address: "104 S Main St, Dawson, TX 76639",
    town: "Dawson",
    phone: "(254) 578-1211",
    lat: 31.9009,
    lng: -96.7129,
    service_times: [
      { day: "Sunday", time: "10:45 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Dawson Church of Christ",
    denomination: "church_of_christ",
    address: "305 E Main St, Dawson, TX 76639",
    town: "Dawson",
    phone: "(254) 578-1244",
    lat: 31.9019,
    lng: -96.7109,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },

  // === FROST CHURCHES ===
  {
    name: "First Baptist Church Frost",
    denomination: "baptist",
    address: "100 N Main St, Frost, TX 76641",
    town: "Frost",
    phone: "(903) 682-3181",
    lat: 32.0769,
    lng: -96.8079,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Frost United Methodist Church",
    denomination: "methodist",
    address: "201 S Main St, Frost, TX 76641",
    town: "Frost",
    phone: "(903) 682-3221",
    lat: 32.0759,
    lng: -96.8079,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },

  // === MILDRED CHURCHES ===
  {
    name: "Mildred Baptist Church",
    denomination: "baptist",
    address: "5502 S US Hwy 287, Corsicana, TX 75109",
    town: "Mildred",
    phone: "(903) 874-7928",
    lat: 32.0247,
    lng: -96.4789,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  }
];
