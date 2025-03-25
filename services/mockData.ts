import { Post } from '@/types/post'
import { Province, City } from '@/types/location'

export const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Any recommendations for restaurants in Makati?',
    content:
      'Looking for good but affordable restaurants around Makati for a dinner with friends this weekend. Any suggestions?',
    user: {
      id: 1,
      username: 'manilafoodie',
      profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    province: 'Metro Manila',
    city: 'Makati',
    votes: 24,
    commentCount: 12,
    timeAgo: '2h ago',
  },
  {
    id: 2,
    title: 'Traffic alert: Accident on EDSA Guadalupe',
    content:
      'Heavy traffic on northbound EDSA near Guadalupe due to a collision between a bus and car. Avoid the area if possible, traffic backed up to Magallanes.',
    imageUrl:
      'https://images.unsplash.com/photo-1597075095359-fc435c036ef7?q=80&w=1000',
    user: {
      id: 2,
      username: 'trafficupdates',
      profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    province: 'Metro Manila',
    city: 'Makati',
    votes: 56,
    commentCount: 8,
    timeAgo: '45m ago',
  },
  {
    id: 3,
    title: 'Best hiking spots in Batangas?',
    content:
      'Planning a weekend trip and looking for good hiking trails in Batangas province. Any recommendations for beginners with nice views?',
    user: {
      id: 3,
      username: 'hikingpinoy',
      profilePic: null,
    },
    province: 'Batangas',
    city: 'General',
    votes: 18,
    commentCount: 22,
    timeAgo: '6h ago',
  },
  {
    id: 4,
    title: 'Lost dog in Cebu City - please help!',
    content:
      'My Shih Tzu went missing near Ayala Center Cebu yesterday afternoon. She has a red collar with my contact info. Please message if you see her!',
    imageUrl:
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000',
    user: {
      id: 4,
      username: 'cebuanimal',
      profilePic: 'https://randomuser.me/api/portraits/women/22.jpg',
    },
    province: 'Cebu',
    city: 'Cebu City',
    votes: 43,
    commentCount: 5,
    timeAgo: '3h ago',
  },
  {
    id: 5,
    title: 'New mall opening in Davao City!',
    content:
      'The new SM Lanang Premier expansion is opening next month with new restaurants and a larger cinema. Anyone else excited about this?',
    user: {
      id: 5,
      username: 'davaoenio',
      profilePic: null,
    },
    province: 'Davao',
    city: 'Davao City',
    votes: 37,
    commentCount: 15,
    timeAgo: '1d ago',
  },
  {
    id: 6,
    title: 'Where to find the best lechon in Cebu?',
    content:
      'Visiting Cebu next week and want to try authentic lechon. Where do the locals recommend going? Is CnT still the best?',
    user: {
      id: 6,
      username: 'foodtrip',
      profilePic: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    province: 'Cebu',
    city: 'Cebu City',
    votes: 29,
    commentCount: 18,
    timeAgo: '4h ago',
  },
  {
    id: 7,
    title: 'Boracay travel tips for first-timers?',
    content:
      'Planning my first trip to Boracay next month. Any advice on which station to stay at, recommended activities, and places to eat?',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000',
    user: {
      id: 7,
      username: 'travelph',
      profilePic: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
    province: 'Aklan',
    city: 'Malay',
    votes: 62,
    commentCount: 27,
    timeAgo: '1d ago',
  },
]

export const provinces: Province[] = [
  {
    id: 1,
    name: 'Metro Manila',
    description:
      'The National Capital Region and largest urban area in the Philippines',
    image:
      'https://images.unsplash.com/photo-1573832035811-218f5113ffdc?q=80&w=1000',
    memberCount: 125000,
    postCount: 45600,
  },
  {
    id: 2,
    name: 'Cebu',
    description:
      'Province in Central Visayas known for beaches and historical sites',
    image:
      'https://images.unsplash.com/photo-1597435877855-0cdf75885cd8?q=80&w=1000',
    memberCount: 87300,
    postCount: 31200,
  },
  {
    id: 3,
    name: 'Davao',
    description: 'Major province in Mindanao and home to Mount Apo',
    image:
      'https://images.unsplash.com/photo-1673709897735-d5940be03b93?q=80&w=1000',
    memberCount: 65400,
    postCount: 24800,
  },
  {
    id: 4,
    name: 'Batangas',
    description: 'Province near Manila known for beaches and diving spots',
    image:
      'https://images.unsplash.com/photo-1629447236518-d2f70561a33a?q=80&w=1000',
    memberCount: 45600,
    postCount: 18900,
  },
  {
    id: 5,
    name: 'Palawan',
    description:
      'Island province known for pristine beaches and natural wonders',
    image:
      'https://images.unsplash.com/photo-1565180742034-32a5b941691c?q=80&w=1000',
    memberCount: 58700,
    postCount: 22400,
  },
  {
    id: 6,
    name: 'Ilocos Norte',
    description: 'Northern province known for heritage sites and windmills',
    image:
      'https://images.unsplash.com/photo-1541776059735-1befc8ba3e40?q=80&w=1000',
    memberCount: 32100,
    postCount: 14300,
  },
  {
    id: 7,
    name: 'Aklan',
    description: 'Province in Western Visayas, home to Boracay Island',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000',
    memberCount: 39800,
    postCount: 17500,
  },
  {
    id: 8,
    name: 'Laguna',
    description:
      'Province south of Manila known for hot springs and waterfalls',
    image:
      'https://images.unsplash.com/photo-1600583696773-472aafd3dd6c?q=80&w=1000',
    memberCount: 41200,
    postCount: 16800,
  },
]

export const cities: { [province: string]: City[] } = {
  'Metro Manila': [
    { id: 1, name: 'Manila', memberCount: 42500, postCount: 15800 },
    { id: 2, name: 'Makati', memberCount: 36700, postCount: 13200 },
    { id: 3, name: 'Quezon City', memberCount: 48300, postCount: 17500 },
    { id: 4, name: 'Taguig', memberCount: 32400, postCount: 11800 },
    { id: 5, name: 'Pasig', memberCount: 28900, postCount: 10200 },
  ],
  Cebu: [
    { id: 6, name: 'Cebu City', memberCount: 39800, postCount: 14600 },
    { id: 7, name: 'Mandaue', memberCount: 24500, postCount: 8900 },
    { id: 8, name: 'Lapu-Lapu', memberCount: 21300, postCount: 7600 },
    { id: 9, name: 'Talisay', memberCount: 18600, postCount: 6500 },
  ],
  Davao: [
    { id: 10, name: 'Davao City', memberCount: 35700, postCount: 13200 },
    { id: 11, name: 'Tagum', memberCount: 18400, postCount: 6700 },
    { id: 12, name: 'Digos', memberCount: 14900, postCount: 5400 },
  ],
  Batangas: [
    { id: 13, name: 'Batangas City', memberCount: 19800, postCount: 7300 },
    { id: 14, name: 'Lipa', memberCount: 17200, postCount: 6400 },
    { id: 15, name: 'Nasugbu', memberCount: 12100, postCount: 4500 },
    { id: 16, name: 'Calatagan', memberCount: 9400, postCount: 3500 },
  ],
}
