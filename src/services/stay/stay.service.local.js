import { storageService } from "../async-storage.service"
import { loadFromStorage, makeId, saveToStorage } from "../util.service"
import { userService } from "../user"

const STORAGE_KEY = "stayDB"
const PAGE_SIZE = 6

export const stayService = {
  query,
  getById,
  save,
  remove,
  addStayMsg,
}

const gStays = [
  {
    _id: "s101",
    name: "Ribeira Charming Duplex",
    type: "",
    avgRating: 4.88,
    bedCount: 2,
    imgUrls: [
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747032872/1_nehz8n.avif",
      "https://a0.muscache.com/im/pictures/prohost-api/Hosting-48729525/original/a380d857-f48a-42fa-aa8c-dc817c37a885.jpeg?im_w=720",
      "https://a0.muscache.com/im/pictures/prohost-api/Hosting-48729525/original/2039c695-7161-43b9-be49-d311eaac0d70.jpeg?im_w=720",
      "https://a0.muscache.com/im/pictures/prohost-api/Hosting-48729525/original/604ecd1b-87c4-4bc9-a976-4ba281a09ee5.jpeg?im_w=720",
    ],
    price: 184,
    summary: "Near Jerusalem Beach, Tel Aviv",
    capacity: 8,
    amenities: ["TV", "Wifi", "Kitchen"],
    labels: ["Trending", "OMG!"],
    host: {
      _id: "u101",
      fullname: "Davit Pok",
      imgUrl: "https://a0.muscache.com/im/pictures/fab79f25.jpg",
    },
    loc: {
      country: "Israel",
      countryCode: "PT",
      city: "Tel Aviv-Yafo",
      address: "17 Kombo st",
      lat: 41.1413,
      lng: -8.61308,
    },
    reviews: [
      {
        id: "r011",
        txt: "Host gave great recommendations for food and activities.",
        rate: 5,
        by: {
          _id: "u211",
          fullname: "Lucas Robinson",
          imgUrl: "https://randomuser.me/api/portraits/men/11.jpg",
          location: "Toronto, Canada",
        },
        date: "April 2022",
      },
      {
        id: "r012",
        txt: "The decor was beautiful and made us feel at home.",
        rate: 5,
        by: {
          _id: "u212",
          fullname: "Charlotte Adams",
          imgUrl: "https://randomuser.me/api/portraits/women/12.jpg",
          location: "Barcelona, Spain",
        },
        date: "November 2020",
      },
      {
        id: "r013",
        txt: "A bit noisy at night, but overall great.",
        rate: 3,
        by: {
          _id: "u213",
          fullname: "Jack Nelson",
          imgUrl: "https://randomuser.me/api/portraits/men/13.jpg",
          location: "New York, USA",
        },
        date: "June 2021",
      },
      {
        id: "r014",
        txt: "Perfect spot for a weekend getaway.",
        rate: 5,
        by: {
          _id: "u214",
          fullname: "Amelia Evans",
          imgUrl: "https://randomuser.me/api/portraits/women/14.jpg",
          location: "Paris, France",
        },
        date: "February 2023",
      },
      {
        id: "r015",
        txt: "Fast Wi-Fi and a great workspace.",
        rate: 4,
        by: {
          _id: "u215",
          fullname: "Henry King",
          imgUrl: "https://randomuser.me/api/portraits/men/15.jpg",
          location: "Berlin, Germany",
        },
        date: "September 2020",
      },
      {
        id: "r016",
        txt: "Amazing hospitality and spotless rooms.",
        rate: 5,
        by: {
          _id: "u216",
          fullname: "Zoe Green",
          imgUrl: "https://randomuser.me/api/portraits/women/16.jpg",
          location: "Lisbon, Portugal",
        },
        date: "December 2021",
      },
      {
        id: "r017",
        txt: "A little smaller than expected but very nice.",
        rate: 4,
        by: {
          _id: "u217",
          fullname: "Oscar Lee",
          imgUrl: "https://randomuser.me/api/portraits/men/17.jpg",
          location: "Rome, Italy",
        },
        date: "May 2022",
      },
      {
        id: "r018",
        txt: "Would definitely stay here again!",
        rate: 5,
        by: {
          _id: "u218",
          fullname: "Lily Scott",
          imgUrl: "https://randomuser.me/api/portraits/women/18.jpg",
          location: "Amsterdam, Netherlands",
        },
        date: "October 2021",
      },
      {
        id: "r019",
        txt: "Close to transport and restaurants.",
        rate: 4,
        by: {
          _id: "u219",
          fullname: "Leo Moore",
          imgUrl: "https://randomuser.me/api/portraits/men/19.jpg",
          location: "Bangkok, Thailand",
        },
        date: "March 2020",
      },
      {
        id: "r020",
        txt: "Felt like home. Super comfy bed.",
        rate: 5,
        by: {
          _id: "u220",
          fullname: "Grace Bailey",
          imgUrl: "https://randomuser.me/api/portraits/women/20.jpg",
          location: "London, UK",
        },
        date: "July 2023",
      },
    ],
    likedByUsers: [],
  },
  {
    _id: "s102",
    name: "Urban Studio Retreat",
    type: "Apartment",
    avgRating: 4.72,
    bedCount: 1,
    imgUrls: [
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747032872/2_ywv1u9.avif",
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747032872/2_ywv1u9.avif",
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747032872/2_ywv1u9.avif",
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747032872/2_ywv1u9.avif",
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747032872/2_ywv1u9.avif",
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747032872/2_ywv1u9.avif",
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747032872/2_ywv1u9.avif",
    ],
    price: 110,
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet orci consequat, rutrum tellus sed, efficitur purus. Cras et orci in nisi dapibus tristique id in tellus. Aenean tempus ipsum in ligula viverra tristique. Nunc malesuada turpis maximus, sagittis nisl quis, pulvinar dolor. Aenean scelerisque, lacus vitae bibendum vulputate, neque quam feugiat quam, eget tincidunt arcu enim vel dolor. Phasellus quis euismod augue, vel pharetra ligula. Nunc vulputate lectus id purus vehicula, ac sagittis arcu fermentum. Mauris eu massa hendrerit, elementum metus sed, suscipit dolor. Praesent eget feugiat odio. Maecenas tincidunt pharetra vestibulum. Ut non sollicitudin turpis, a mollis dui. Vivamus non interdum ante. ",
    capacity: 2,
    amenities: ["AC", "Wifi", "Elevator"],
    labels: ["City vibes"],
    host: {
      _id: "u102",
      fullname: "Lina Mor",
      imgUrl: "https://i.pravatar.cc/100?img=10",
      isSuperhost: true,
    },
    loc: {
      country: "Germany",
      countryCode: "DE",
      city: "Berlin",
      address: "23 Mitte Ave",
      lat: 52.52,
      lng: 13.405,
    },
    reviews: [
      {
        id: "r025",
        txt: "The patio was a highlight. Loved the view.",
        rate: 4,
        by: {
          _id: "u225",
          fullname: "Sebastian James",
          imgUrl: "https://randomuser.me/api/portraits/men/25.jpg",
          location: "Toronto, Canada",
        },
        date: "January 2024",
      },
      {
        id: "r026",
        txt: "A well maintained apartment with a sense of home in a prime location. Clean and thoughtful about the details.",
        rate: 4,
        by: {
          _id: "u226",
          fullname: "Adi",
          imgUrl: "https://randomuser.me/api/portraits/women/26.jpg",
          location: "Jerusalem, Israel",
        },
        date: "April 2025",
      },
      {
        id: "r027",
        txt: "Great location and very safe neighborhood.",
        rate: 5,
        by: {
          _id: "u227",
          fullname: "Matthew Cook",
          imgUrl: "https://randomuser.me/api/portraits/men/27.jpg",
          location: "New York, USA",
        },
        date: "February 2022",
      },
      {
        id: "r028",
        txt: "Very stylish interior and cozy vibes.",
        rate: 5,
        by: {
          _id: "u228",
          fullname: "Ava Foster",
          imgUrl: "https://randomuser.me/api/portraits/women/28.jpg",
          location: "Amsterdam, Netherlands",
        },
        date: "October 2021",
      },
      {
        id: "r029",
        txt: "Parking was a bit tricky but manageable.",
        rate: 3,
        by: {
          _id: "u229",
          fullname: "Wyatt Bell",
          imgUrl: "https://randomuser.me/api/portraits/men/29.jpg",
          location: "Rome, Italy",
        },
        date: "August 2023",
      },
    ],
    likedByUsers: [],
  },
  {
    _id: "s103",
    name: "Tropical Bungalow Hideout",
    type: "Cabin",
    avgRating: 5.0,
    bedCount: 1,
    imgUrls: [
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747032872/3_v40rnl.avif",
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747032872/3_v40rnl.avif",
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747032872/3_v40rnl.avif",
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747032872/3_v40rnl.avif",
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747032872/3_v40rnl.avif",
    ],
    price: 205,
    summary: "Relax in a lush tropical escape.",
    capacity: 4,
    amenities: ["Pool", "BBQ", "Wifi"],
    labels: ["Tropical", "Trending"],
    host: {
      _id: "u103",
      fullname: "Jon Doe",
      imgUrl: "https://i.pravatar.cc/100?img=12",
    },
    loc: {
      country: "Thailand",
      countryCode: "TH",
      city: "Phuket",
      address: "101 Beach Dr",
      lat: 7.88,
      lng: 98.39,
    },
    reviews: [
      {
        id: "r021",
        txt: "Check-in process was seamless.",
        rate: 5,
        by: {
          _id: "u221",
          fullname: "Daniel Murphy",
          imgUrl: "https://randomuser.me/api/portraits/men/21.jpg",
          location: "Tel Aviv, Israel",
        },
        date: "March 2022",
      },
      {
        id: "r022",
        txt: "A little dusty in some areas but still great.",
        rate: 3,
        by: {
          _id: "u222",
          fullname: "Ella Cooper",
          imgUrl: "https://randomuser.me/api/portraits/women/22.jpg",
          location: "Barcelona, Spain",
        },
        date: "December 2020",
      },
      {
        id: "r023",
        txt: "Excellent experience from start to finish.",
        rate: 5,
        by: {
          _id: "u223",
          fullname: "Logan Richardson",
          imgUrl: "https://randomuser.me/api/portraits/men/23.jpg",
          location: "London, UK",
        },
        date: "May 2023",
      },
    ],
    likedByUsers: [],
  },
  {
    _id: "s104",
    name: "Mountain Cabin Escape",
    type: "Cabin",
    avgRating: 4.933333,
    bedCount: 5,
    imgUrls: [
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747046117/4_nfjp4e.avif",
    ],
    price: 95,
    summary: "Quiet retreat in the snowy mountains.",
    capacity: 6,
    amenities: ["Fireplace", "Kitchen", "TV"],
    labels: ["Play", "Top of the world"],
    host: {
      _id: "u104",
      fullname: "Alex Smith",
      imgUrl: "https://i.pravatar.cc/100?img=15",
    },
    loc: {
      country: "Canada",
      countryCode: "CA",
      city: "Whistler",
      address: "89 Peak Rd",
      lat: 50.12,
      lng: -122.95,
    },
    reviews: [
      {
        id: "r001",
        txt: "Amazing stay! Super clean and well located.",
        rate: 5,
        by: {
          _id: "u201",
          fullname: "Liam Carter",
          imgUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        },
      },
      {
        id: "r002",
        txt: "The host was very helpful and responsive.",
        rate: 4,
        by: {
          _id: "u202",
          fullname: "Sophie Martin",
          imgUrl: "https://randomuser.me/api/portraits/women/2.jpg",
        },
      },
      {
        id: "r003",
        txt: "Lovely atmosphere and stylish design.",
        rate: 5,
        by: {
          _id: "u203",
          fullname: "Ethan Brown",
          imgUrl: "https://randomuser.me/api/portraits/men/3.jpg",
        },
      },
      {
        id: "r004",
        txt: "The kitchen was well equipped and spacious.",
        rate: 4,
        by: {
          _id: "u204",
          fullname: "Isabella Clarke",
          imgUrl: "https://randomuser.me/api/portraits/women/4.jpg",
        },
      },
    ],
    likedByUsers: [],
  },
  {
    _id: "s105",
    name: "Minimal Loft Studio",
    type: "Apartment",
    avgRating: 4.81,
    bedCount: 1,
    imgUrls: [
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747046118/7_pzmqnb.avif",
    ],
    price: 70,
    summary: "Bright and modern loft with open space.",
    capacity: 3,
    amenities: ["Wifi", "Kitchen"],
    labels: ["Trending"],
    host: {
      _id: "u105",
      fullname: "Maya Lin",
      imgUrl: "https://i.pravatar.cc/100?img=25",
    },
    loc: {
      country: "USA",
      countryCode: "US",
      city: "New York",
      address: "456 Flatiron St",
      lat: 40.741,
      lng: -73.989,
    },
    reviews: [
      {
        id: "r030",
        txt: "Great location and host was super helpful.",
        rate: 3,
        by: {
          _id: "u200",
          fullname: "Liam Brown",
          imgUrl: "https://randomuser.me/api/portraits/women/30.jpg",
          location: "Tel Aviv, Israel",
        },
        date: "March 2024",
      },
      {
        id: "r031",
        txt: "Great location and host was super helpful.",
        rate: 3,
        by: {
          _id: "u201",
          fullname: "Ava Smith",
          imgUrl: "https://randomuser.me/api/portraits/men/33.jpg",
          location: "Sydney, Australia",
        },
        date: "May 2020",
      },
      {
        id: "r032",
        txt: "Just what we needed for our trip!",
        rate: 5,
        by: {
          _id: "u202",
          fullname: "Emma Brown",
          imgUrl: "https://randomuser.me/api/portraits/women/95.jpg",
          location: "Cape Town, South Africa",
        },
        date: "April 2021",
      },
      {
        id: "r033",
        txt: "Exceeded our expectations.",
        rate: 3,
        by: {
          _id: "u203",
          fullname: "Noah White",
          imgUrl: "https://randomuser.me/api/portraits/men/48.jpg",
          location: "Tokyo, Japan",
        },
        date: "October 2023",
      },
    ],
    likedByUsers: [],
  },
  {
    _id: "s106",
    name: "Eco-Friendly Treehouse",
    type: "House",
    avgRating: 4.95,
    bedCount: 4,
    imgUrls: [
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747046118/9_b3te7l.avif",
    ],
    price: 200,
    summary: "Live among the trees in this sustainable stay.",
    capacity: 2,
    amenities: ["Compost toilet", "Solar power"],
    labels: ["Eco", "Play"],
    host: {
      _id: "u106",
      fullname: "Leo Rain",
      imgUrl: "https://i.pravatar.cc/100?img=30",
    },
    loc: {
      country: "Costa Rica",
      countryCode: "CR",
      city: "Monteverde",
      address: "Tree Trail 9",
      lat: 10.31,
      lng: -84.82,
    },
    reviews: [
      {
        id: "r034",
        txt: "Very clean and comfortable.",
        rate: 3,
        by: {
          _id: "u204",
          fullname: "Mia White",
          imgUrl: "https://randomuser.me/api/portraits/women/56.jpg",
          location: "Barcelona, Spain",
        },
        date: "November 2021",
      },
      {
        id: "r035",
        txt: "We had a lovely time staying here.",
        rate: 5,
        by: {
          _id: "u205",
          fullname: "Ava Thomas",
          imgUrl: "https://randomuser.me/api/portraits/men/95.jpg",
          location: "Bangkok, Thailand",
        },
        date: "January 2022",
      },
      {
        id: "r036",
        txt: "Exceeded our expectations.",
        rate: 5,
        by: {
          _id: "u206",
          fullname: "Olivia Jackson",
          imgUrl: "https://randomuser.me/api/portraits/men/19.jpg",
          location: "Paris, France",
        },
        date: "July 2024",
      },
      {
        id: "r037",
        txt: "Just what we needed for our trip!",
        rate: 4,
        by: {
          _id: "u207",
          fullname: "Liam Anderson",
          imgUrl: "https://randomuser.me/api/portraits/women/83.jpg",
          location: "Tokyo, Japan",
        },
        date: "November 2022",
      },
      {
        id: "r038",
        txt: "Exceeded our expectations.",
        rate: 4,
        by: {
          _id: "u208",
          fullname: "Mia Martin",
          imgUrl: "https://randomuser.me/api/portraits/men/85.jpg",
          location: "Bangkok, Thailand",
        },
        date: "August 2021",
      },
    ],
    likedByUsers: [],
  },
  {
    _id: "s107",
    name: "Beachfront Paradise",
    type: "Villa",
    avgRating: 4.91,
    bedCount: 4,
    imgUrls: [
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747046118/5_uc2wgk.avif",
    ],
    price: 300,
    summary: "Step directly onto the sand from your patio.",
    capacity: 5,
    amenities: ["Pool", "Wifi", "Kitchen"],
    labels: ["Tropical", "Top of the world"],
    host: {
      _id: "u107",
      fullname: "Sophie Tran",
      imgUrl: "https://i.pravatar.cc/100?img=31",
    },
    loc: {
      country: "Greece",
      countryCode: "GR",
      city: "Santorini",
      address: "1 Beach Dr",
      lat: 36.3932,
      lng: 25.4615,
    },
    reviews: [
      {
        id: "r039",
        txt: "Nice, cozy, and well-equipped.",
        rate: 5,
        by: {
          _id: "u209",
          fullname: "Amelia Harris",
          imgUrl: "https://randomuser.me/api/portraits/women/88.jpg",
          location: "New York, USA",
        },
        date: "October 2022",
      },
      {
        id: "r040",
        txt: "Very clean and comfortable.",
        rate: 3,
        by: {
          _id: "u210",
          fullname: "Emma Martin",
          imgUrl: "https://randomuser.me/api/portraits/women/78.jpg",
          location: "Sydney, Australia",
        },
        date: "July 2021",
      },
    ],
    likedByUsers: [],
  },
  {
    _id: "s108",
    name: "Lakeview Cottage",
    type: "House",
    avgRating: 4.8,
    bedCount: 5,
    imgUrls: [
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747046118/8_d1qefk.avif",
    ],
    price: 120,
    summary: "Rustic charm with modern amenities.",
    capacity: 4,
    amenities: ["BBQ", "Lake Access", "Fireplace"],
    labels: ["Play", "Relax"],
    host: {
      _id: "u108",
      fullname: "Rachel Green",
      imgUrl: "https://i.pravatar.cc/100?img=32",
    },
    loc: {
      country: "Switzerland",
      countryCode: "CH",
      city: "Lucerne",
      address: "45 Lakeside Way",
      lat: 47.0502,
      lng: 8.3093,
    },
    reviews: [
      {
        id: "r041",
        txt: "Just what we needed for our trip!",
        rate: 5,
        by: {
          _id: "u211",
          fullname: "Emma Anderson",
          imgUrl: "https://randomuser.me/api/portraits/men/48.jpg",
          location: "Cape Town, South Africa",
        },
        date: "September 2024",
      },
      {
        id: "r042",
        txt: "Highly recommended to anyone visiting the area.",
        rate: 4,
        by: {
          _id: "u212",
          fullname: "Sophia Smith",
          imgUrl: "https://randomuser.me/api/portraits/women/83.jpg",
          location: "Bangkok, Thailand",
        },
        date: "January 2023",
      },
      {
        id: "r043",
        txt: "The view was breathtaking.",
        rate: 4,
        by: {
          _id: "u213",
          fullname: "Mia Harris",
          imgUrl: "https://randomuser.me/api/portraits/men/54.jpg",
          location: "Cape Town, South Africa",
        },
        date: "September 2023",
      },
      {
        id: "r044",
        txt: "Exceeded our expectations.",
        rate: 3,
        by: {
          _id: "u214",
          fullname: "Ava White",
          imgUrl: "https://randomuser.me/api/portraits/women/21.jpg",
          location: "New York, USA",
        },
        date: "October 2021",
      },
      {
        id: "r045",
        txt: "Amazing place! Would love to come back.",
        rate: 5,
        by: {
          _id: "u215",
          fullname: "Emma Thomas",
          imgUrl: "https://randomuser.me/api/portraits/men/4.jpg",
          location: "London, UK",
        },
        date: "December 2021",
      },
      {
        id: "r046",
        txt: "Great location and host was super helpful.",
        rate: 4,
        by: {
          _id: "u216",
          fullname: "Emma Brown",
          imgUrl: "https://randomuser.me/api/portraits/women/47.jpg",
          location: "Tokyo, Japan",
        },
        date: "December 2022",
      },
      {
        id: "r047",
        txt: "Amazing place! Would love to come back.",
        rate: 5,
        by: {
          _id: "u217",
          fullname: "Noah Taylor",
          imgUrl: "https://randomuser.me/api/portraits/men/16.jpg",
          location: "Toronto, Canada",
        },
        date: "September 2024",
      },
      {
        id: "r048",
        txt: "Exceeded our expectations.",
        rate: 3,
        by: {
          _id: "u218",
          fullname: "Emma Jackson",
          imgUrl: "https://randomuser.me/api/portraits/women/61.jpg",
          location: "Paris, France",
        },
        date: "August 2023",
      },
      {
        id: "r049",
        txt: "Just what we needed for our trip!",
        rate: 3,
        by: {
          _id: "u219",
          fullname: "Mia Smith",
          imgUrl: "https://randomuser.me/api/portraits/women/23.jpg",
          location: "Rome, Italy",
        },
        date: "February 2021",
      },
      {
        id: "r050",
        txt: "Highly recommended to anyone visiting the area.",
        rate: 3,
        by: {
          _id: "u220",
          fullname: "Amelia Smith",
          imgUrl: "https://randomuser.me/api/portraits/men/34.jpg",
          location: "New York, USA",
        },
        date: "April 2025",
      },
      {
        id: "r051",
        txt: "Exceeded our expectations.",
        rate: 4,
        by: {
          _id: "u221",
          fullname: "Noah Brown",
          imgUrl: "https://randomuser.me/api/portraits/men/82.jpg",
          location: "Sydney, Australia",
        },
        date: "June 2022",
      },
      {
        id: "r052",
        txt: "Great location and host was super helpful.",
        rate: 5,
        by: {
          _id: "u222",
          fullname: "Liam Taylor",
          imgUrl: "https://randomuser.me/api/portraits/women/42.jpg",
          location: "Berlin, Germany",
        },
        date: "July 2023",
      },
      {
        id: "r053",
        txt: "Amazing place! Would love to come back.",
        rate: 3,
        by: {
          _id: "u223",
          fullname: "Ava White",
          imgUrl: "https://randomuser.me/api/portraits/women/58.jpg",
          location: "Bangkok, Thailand",
        },
        date: "December 2020",
      },
    ],
    likedByUsers: [],
  },
  {
    _id: "s109",
    name: "Old Town Gem",
    type: "Apartment",
    avgRating: 4.85,
    bedCount: 6,
    imgUrls: [
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747046118/6_mvt1lt.avif",
    ],
    price: 90,
    summary: "Live like a local in the city’s historic core.",
    capacity: 2,
    amenities: ["Kitchen", "Wifi"],
    labels: ["Trending"],
    host: {
      _id: "u109",
      fullname: "Marcus Klein",
      imgUrl: "https://i.pravatar.cc/100?img=33",
    },
    loc: {
      country: "Czech Republic",
      countryCode: "CZ",
      city: "Prague",
      address: "12 Castle St",
      lat: 50.0755,
      lng: 14.4378,
    },
    reviews: [
      {
        id: "r054",
        txt: "Perfect for a family getaway.",
        rate: 5,
        by: {
          _id: "u224",
          fullname: "Liam Smith",
          imgUrl: "https://randomuser.me/api/portraits/women/31.jpg",
          location: "Lisbon, Portugal",
        },
        date: "June 2024",
      },
      {
        id: "r055",
        txt: "Perfect for a family getaway.",
        rate: 4,
        by: {
          _id: "u225",
          fullname: "Emma Brown",
          imgUrl: "https://randomuser.me/api/portraits/men/72.jpg",
          location: "London, UK",
        },
        date: "February 2022",
      },
      {
        id: "r056",
        txt: "We had a lovely time staying here.",
        rate: 3,
        by: {
          _id: "u226",
          fullname: "Isabella Thomas",
          imgUrl: "https://randomuser.me/api/portraits/men/86.jpg",
          location: "Los Angeles, California",
        },
        date: "February 2022",
      },
      {
        id: "r057",
        txt: "Very clean and comfortable.",
        rate: 5,
        by: {
          _id: "u227",
          fullname: "Emma White",
          imgUrl: "https://randomuser.me/api/portraits/women/42.jpg",
          location: "Berlin, Germany",
        },
        date: "September 2021",
      },
      {
        id: "r058",
        txt: "Perfect for a family getaway.",
        rate: 5,
        by: {
          _id: "u228",
          fullname: "Sophia Martin",
          imgUrl: "https://randomuser.me/api/portraits/women/66.jpg",
          location: "Tokyo, Japan",
        },
        date: "August 2022",
      },
    ],
    likedByUsers: [],
  },
  {
    _id: "s110",
    name: "Bohemian Rooftop Loft",
    type: "Loft",
    avgRating: 4.77,
    bedCount: 3,
    imgUrls: [
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747046118/10_dlefhg.avif",
    ],
    price: 105,
    summary: "Artful living with a rooftop view.",
    capacity: 2,
    amenities: ["Wifi", "Air Conditioning", "Coffee Maker"],
    labels: ["Top of the world"],
    host: {
      _id: "u110",
      fullname: "Ella Voss",
      imgUrl: "https://i.pravatar.cc/100?img=34",
    },
    loc: {
      country: "Spain",
      countryCode: "ES",
      city: "Barcelona",
      address: "99 Gracia Rd",
      lat: 41.3851,
      lng: 2.1734,
    },
    reviews: [
      {
        id: "r059",
        txt: "Nice, cozy, and well-equipped.",
        rate: 4,
        by: {
          _id: "u229",
          fullname: "Ava Jackson",
          imgUrl: "https://randomuser.me/api/portraits/men/84.jpg",
          location: "Tokyo, Japan",
        },
        date: "October 2023",
      },
      {
        id: "r060",
        txt: "Exceeded our expectations.",
        rate: 5,
        by: {
          _id: "u230",
          fullname: "Liam Brown",
          imgUrl: "https://randomuser.me/api/portraits/women/70.jpg",
          location: "Amsterdam, Netherlands",
        },
        date: "January 2021",
      },
      {
        id: "r061",
        txt: "Nice, cozy, and well-equipped.",
        rate: 4,
        by: {
          _id: "u231",
          fullname: "Ava Brown",
          imgUrl: "https://randomuser.me/api/portraits/women/99.jpg",
          location: "Sydney, Australia",
        },
        date: "August 2020",
      },
      {
        id: "r062",
        txt: "Exceeded our expectations.",
        rate: 4,
        by: {
          _id: "u232",
          fullname: "Liam Anderson",
          imgUrl: "https://randomuser.me/api/portraits/men/74.jpg",
          location: "Tokyo, Japan",
        },
        date: "September 2022",
      },
      {
        id: "r063",
        txt: "Exceeded our expectations.",
        rate: 4,
        by: {
          _id: "u233",
          fullname: "James Anderson",
          imgUrl: "https://randomuser.me/api/portraits/women/75.jpg",
          location: "Rome, Italy",
        },
        date: "December 2023",
      },
      {
        id: "r064",
        txt: "Highly recommended to anyone visiting the area.",
        rate: 3,
        by: {
          _id: "u234",
          fullname: "Mia Johnson",
          imgUrl: "https://randomuser.me/api/portraits/men/86.jpg",
          location: "Bangkok, Thailand",
        },
        date: "September 2022",
      },
      {
        id: "r065",
        txt: "Very clean and comfortable.",
        rate: 5,
        by: {
          _id: "u235",
          fullname: "Amelia Jackson",
          imgUrl: "https://randomuser.me/api/portraits/men/56.jpg",
          location: "Rome, Italy",
        },
        date: "September 2024",
      },
      {
        id: "r066",
        txt: "Amazing place! Would love to come back.",
        rate: 3,
        by: {
          _id: "u236",
          fullname: "Ava Smith",
          imgUrl: "https://randomuser.me/api/portraits/men/57.jpg",
          location: "New York, USA",
        },
        date: "July 2024",
      },
      {
        id: "r067",
        txt: "Highly recommended to anyone visiting the area.",
        rate: 4,
        by: {
          _id: "u237",
          fullname: "Liam Harris",
          imgUrl: "https://randomuser.me/api/portraits/women/99.jpg",
          location: "Toronto, Canada",
        },
        date: "February 2024",
      },
      {
        id: "r068",
        txt: "Highly recommended to anyone visiting the area.",
        rate: 3,
        by: {
          _id: "u238",
          fullname: "James Johnson",
          imgUrl: "https://randomuser.me/api/portraits/women/2.jpg",
          location: "Toronto, Canada",
        },
        date: "August 2022",
      },
      {
        id: "r069",
        txt: "Highly recommended to anyone visiting the area.",
        rate: 3,
        by: {
          _id: "u239",
          fullname: "Sophia Smith",
          imgUrl: "https://randomuser.me/api/portraits/men/53.jpg",
          location: "Tel Aviv, Israel",
        },
        date: "August 2021",
      },
      {
        id: "r070",
        txt: "Perfect for a family getaway.",
        rate: 3,
        by: {
          _id: "u240",
          fullname: "James Smith",
          imgUrl: "https://randomuser.me/api/portraits/women/28.jpg",
          location: "Paris, France",
        },
        date: "March 2022",
      },
      {
        id: "r071",
        txt: "Very clean and comfortable.",
        rate: 5,
        by: {
          _id: "u241",
          fullname: "Amelia Anderson",
          imgUrl: "https://randomuser.me/api/portraits/women/43.jpg",
          location: "Amsterdam, Netherlands",
        },
        date: "January 2022",
      },
      {
        id: "r072",
        txt: "Just what we needed for our trip!",
        rate: 3,
        by: {
          _id: "u242",
          fullname: "Noah Harris",
          imgUrl: "https://randomuser.me/api/portraits/men/51.jpg",
          location: "Lisbon, Portugal",
        },
        date: "July 2023",
      },
      {
        id: "r073",
        txt: "Perfect for a family getaway.",
        rate: 3,
        by: {
          _id: "u243",
          fullname: "Emma Anderson",
          imgUrl: "https://randomuser.me/api/portraits/men/58.jpg",
          location: "Sydney, Australia",
        },
        date: "July 2021",
      },
      {
        id: "r074",
        txt: "Just what we needed for our trip!",
        rate: 3,
        by: {
          _id: "u244",
          fullname: "James Thomas",
          imgUrl: "https://randomuser.me/api/portraits/men/23.jpg",
          location: "Bangkok, Thailand",
        },
        date: "August 2021",
      },
      {
        id: "r075",
        txt: "The view was breathtaking.",
        rate: 4,
        by: {
          _id: "u245",
          fullname: "Sophia Smith",
          imgUrl: "https://randomuser.me/api/portraits/women/70.jpg",
          location: "Cape Town, South Africa",
        },
        date: "March 2024",
      },
      {
        id: "r076",
        txt: "Highly recommended to anyone visiting the area.",
        rate: 5,
        by: {
          _id: "u246",
          fullname: "James Thomas",
          imgUrl: "https://randomuser.me/api/portraits/men/31.jpg",
          location: "New York, USA",
        },
        date: "August 2024",
      },
      {
        id: "r077",
        txt: "Highly recommended to anyone visiting the area.",
        rate: 4,
        by: {
          _id: "u247",
          fullname: "James Taylor",
          imgUrl: "https://randomuser.me/api/portraits/women/43.jpg",
          location: "Tokyo, Japan",
        },
        date: "February 2021",
      },
      {
        id: "r078",
        txt: "Exceeded our expectations.",
        rate: 5,
        by: {
          _id: "u248",
          fullname: "Noah Martin",
          imgUrl: "https://randomuser.me/api/portraits/women/19.jpg",
          location: "Tel Aviv, Israel",
        },
        date: "December 2024",
      },
      {
        id: "r079",
        txt: "Great location and host was super helpful.",
        rate: 3,
        by: {
          _id: "u249",
          fullname: "Sophia Jackson",
          imgUrl: "https://randomuser.me/api/portraits/men/59.jpg",
          location: "Tel Aviv, Israel",
        },
        date: "May 2023",
      },
    ],
    likedByUsers: [],
  },
]

window.cs = stayService
_createStays()

async function query(filterBy = {}) {
  var stays = await storageService.query(STORAGE_KEY)
  const totalCount = gStays.length
  const pageIdx = +filterBy.pageIdx || 0


  if (filterBy.country) {
    const regExp = new regExp(filterBy.country, 'i')
    stays = stays.filter(stay => regExp.text(stay.loc.country))
  }
  if (filterBy.label) {
    stays = stays.filter((stay) => stay.labels?.includes(filterBy.label))
  }

  // return stays
  return {
    stays, totalCount, totalPages: Math.ceil(totalCount / PAGE_SIZE), pageIdx
  }
}

// async function query(filterBy = { country: "" }) {
// console.log(filterBy)
//   var stays = await storageService.query(STORAGE_KEY)

//   if (filterBy.country) {
//     const regex = new RegExp(filterBy.country, "i")
//     stays = stays.filter(
//       (stay) => regex.test(stay.loc?.country) || regex.test(stay.loc?.city)
//     )
//   }
//   // if (minPrice) {
//   //   stays = stays.filter(stay => stay.price >= minPrice)
//   // }
//   // if (sortField === 'name') {
//   //   stays.sort((stay1, stay2) =>
//   //     stay1[sortField].localeCompare(stay2[sortField]) * +sortDir)
//   // }
//   // if (sortField === 'price') {
//   //   stays.sort((stay1, stay2) =>
//   //     (stay1[sortField] - stay2[sortField]) * +sortDir)
//   // }

//   // stays = stays.map(({ _id, name, price, host, imgUrls }) => ({ _id, name, price, host, imgUrls }))
//   return stays
// }

function getById(stayId) {
  return storageService.get(STORAGE_KEY, stayId)
}

async function remove(stayId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, stayId)
}

async function save(stay) {
  var savedStay
  if (stay._id) {
    const stayToSave = {
      _id: stay._id,
      price: stay.price,
    }
    savedStay = await storageService.put(STORAGE_KEY, stayToSave)
  } else {
    const stayToSave = {
      name: stay.name,
      price: stay.price,
      // Later, owner is set by the backend
      owner: userService.getLoggedInUser(),
      msgs: [],
    }
    savedStay = await storageService.post(STORAGE_KEY, stayToSave)
  }
  return savedStay
}

async function addStayMsg(stayId, txt) {
  // Later, this is all done by the backend
  const stay = await getById(stayId)

  const msg = {
    id: makeId(),
    by: userService.getLoggedInUser(),
    txt,
  }
  stay.msgs.push(msg)
  await storageService.put(STORAGE_KEY, stay)

  return msg
}

function _createStays() {
  let stays = loadFromStorage(STORAGE_KEY)
  if (!stays || !stays.length) {
    saveToStorage(STORAGE_KEY, gStays)
  }
}