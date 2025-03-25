import { Post } from '@/types/post'
import { Province, City } from '@/types/location'
import { Comment } from '@/types/comment'
import { Notification } from '@/types/notification'
import { AuthUser } from '@/types/auth'

// Mock users
export const mockUsers: AuthUser[] = [
  {
    id: 1,
    username: 'johndoe',
    email: 'john@example.com',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    createdAt: '2023-01-15T10:30:00Z',
    followedProvinces: [1, 3],
    followedCities: [1, 5],
  },
  {
    id: 2,
    username: 'janedoe',
    email: 'jane@example.com',
    profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
    createdAt: '2023-02-22T14:15:00Z',
    followedProvinces: [2, 4],
    followedCities: [3, 7],
  },
  {
    id: 3,
    username: 'mark_smith',
    email: 'mark@example.com',
    profilePic: null,
    createdAt: '2023-03-10T09:45:00Z',
    followedProvinces: [1, 5],
    followedCities: [2, 8],
  },
]

// Mock provinces
export const provinces: Province[] = [
  {
    id: 1,
    name: 'Metro Manila',
    description:
      'The National Capital Region and largest urban area in the Philippines',
    image_url:
      'https://images.unsplash.com/photo-1573832035811-218f5113ffdc?q=80&w=1000',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Cebu',
    description:
      'Province in Central Visayas known for beaches and historical sites',
    image_url:
      'https://images.unsplash.com/photo-1597435877855-0cdf75885cd8?q=80&w=1000',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Davao',
    description: 'Major province in Mindanao and home to Mount Apo',
    image_url:
      'https://images.unsplash.com/photo-1673709897735-d5940be03b93?q=80&w=1000',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'Batangas',
    description: 'Province near Manila known for beaches and diving spots',
    image_url:
      'https://images.unsplash.com/photo-1629447236518-d2f70561a33a?q=80&w=1000',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 5,
    name: 'Palawan',
    description:
      'Island province known for pristine beaches and natural wonders',
    image_url:
      'https://images.unsplash.com/photo-1565180742034-32a5b941691c?q=80&w=1000',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
]

// Mock cities by province name
export const cities: Record<string, City[]> = {
  'Metro Manila': [
    {
      id: 1,
      province_id: 1,
      name: 'Manila',
      description: 'Capital city of the Philippines',
      image_url: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      province_id: 1,
      name: 'Makati',
      description: 'Financial center of the Philippines',
      image_url: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
    {
      id: 3,
      province_id: 1,
      name: 'Quezon City',
      description: 'Largest city in Metro Manila',
      image_url: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
  ],
  Cebu: [
    {
      id: 4,
      province_id: 2,
      name: 'Cebu City',
      description: 'Capital of Cebu province',
      image_url: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
    {
      id: 5,
      province_id: 2,
      name: 'Mandaue',
      description: 'Industrial hub of Cebu',
      image_url: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
  ],
  Davao: [
    {
      id: 6,
      province_id: 3,
      name: 'Davao City',
      description: 'Largest city in Mindanao',
      image_url: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
  ],
  Batangas: [
    {
      id: 7,
      province_id: 4,
      name: 'Batangas City',
      description: 'Capital of Batangas province',
      image_url: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
    {
      id: 8,
      province_id: 4,
      name: 'Lipa',
      description: 'Major city in Batangas',
      image_url: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
  ],
  Palawan: [
    {
      id: 9,
      province_id: 5,
      name: 'Puerto Princesa',
      description: 'Capital of Palawan',
      image_url: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
    {
      id: 10,
      province_id: 5,
      name: 'El Nido',
      description: 'Famous tourist destination',
      image_url: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
  ],
}

// Mock posts
export const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Best food spots in Manila',
    content:
      "I've found some amazing places to eat in the city. Let me share my top 5 favorite restaurants in Manila...",
    user: mockUsers[0],
    province: 'Metro Manila',
    province_id: 1,
    city: 'Manila',
    city_id: 1,
    votes: 42,
    comment_count: 15,
    created_at: '2023-06-15T08:30:00Z',
    updated_at: '2023-06-15T08:30:00Z',
    timeAgo: '3 days ago',
  },
  {
    id: 2,
    title: 'Hidden beaches in Palawan',
    content:
      "During my recent trip to Palawan, I discovered some lesser-known beaches that aren't crowded with tourists...",
    image_url:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3',
    user: mockUsers[1],
    province: 'Palawan',
    province_id: 5,
    city: 'El Nido',
    city_id: 10,
    votes: 78,
    comment_count: 23,
    created_at: '2023-06-14T14:45:00Z',
    updated_at: '2023-06-14T14:45:00Z',
    timeAgo: '4 days ago',
  },
  {
    id: 3,
    title: 'Traffic situation in Makati',
    content:
      "Has anyone else noticed the increased traffic in Makati lately? I think it's due to the new construction...",
    user: mockUsers[2],
    province: 'Metro Manila',
    province_id: 1,
    city: 'Makati',
    city_id: 2,
    votes: 31,
    comment_count: 42,
    created_at: '2023-06-16T10:15:00Z',
    updated_at: '2023-06-16T10:15:00Z',
    timeAgo: '2 days ago',
  },
  {
    id: 4,
    title: "Cebu's best diving spots",
    content:
      'For diving enthusiasts, I recommend checking out these amazing diving spots around Cebu...',
    image_url:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3',
    user: mockUsers[0],
    province: 'Cebu',
    province_id: 2,
    city: 'Cebu City',
    city_id: 4,
    votes: 56,
    comment_count: 18,
    created_at: '2023-06-13T09:20:00Z',
    updated_at: '2023-06-13T09:20:00Z',
    timeAgo: '5 days ago',
  },
  {
    id: 5,
    title: "Exploring Davao's local cuisine",
    content:
      'During my visit to Davao, I was amazed by the local food scene. Here are some must-try dishes...',
    user: mockUsers[1],
    province: 'Davao',
    province_id: 3,
    city: 'Davao City',
    city_id: 6,
    votes: 47,
    comment_count: 12,
    created_at: '2023-06-17T16:40:00Z',
    updated_at: '2023-06-17T16:40:00Z',
    timeAgo: '1 day ago',
  },
]

// Mock comments
export const mockComments: Comment[] = [
  {
    id: 1,
    post_id: 1,
    user_id: 2,
    content:
      'I agree with your recommendations! I would also add Cafe Adriatico to the list.',
    votes: 8,
    created_at: '2023-06-15T10:45:00Z',
    updated_at: '2023-06-15T10:45:00Z',
    is_deleted: false,
    user: mockUsers[1],
    timeAgo: '3 days ago',
  },
  {
    id: 2,
    post_id: 1,
    user_id: 3,
    content:
      "Have you tried that new restaurant near Intramuros? I heard it's amazing.",
    votes: 5,
    created_at: '2023-06-15T14:30:00Z',
    updated_at: '2023-06-15T14:30:00Z',
    is_deleted: false,
    user: mockUsers[2],
    timeAgo: '3 days ago',
    replies: [
      {
        id: 3,
        post_id: 1,
        user_id: 1,
        parent_id: 2,
        content:
          'Yes, I went there last week! The food is excellent but a bit pricey.',
        votes: 3,
        created_at: '2023-06-15T18:20:00Z',
        updated_at: '2023-06-15T18:20:00Z',
        is_deleted: false,
        user: mockUsers[0],
        timeAgo: '3 days ago',
      },
    ],
  },
  {
    id: 4,
    post_id: 2,
    user_id: 3,
    content:
      'Those beaches look incredible! Could you share the exact locations?',
    votes: 12,
    created_at: '2023-06-14T16:10:00Z',
    updated_at: '2023-06-14T16:10:00Z',
    is_deleted: false,
    user: mockUsers[2],
    timeAgo: '4 days ago',
  },
  {
    id: 5,
    post_id: 2,
    user_id: 1,
    content: "I'm planning a trip to Palawan next month. This is very helpful!",
    votes: 7,
    created_at: '2023-06-14T18:05:00Z',
    updated_at: '2023-06-14T18:05:00Z',
    is_deleted: false,
    user: mockUsers[0],
    timeAgo: '4 days ago',
  },
]

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: 1,
    user_id: 1,
    type: 'post_like',
    sender_id: 2,
    sender_username: 'janedoe',
    sender_profile_pic: 'https://randomuser.me/api/portraits/women/2.jpg',
    post_id: 1,
    post_title: 'Best food spots in Manila',
    is_read: false,
    created_at: '2023-06-17T09:30:00Z',
    timeAgo: '1 day ago',
  },
  {
    id: 2,
    user_id: 1,
    type: 'comment',
    sender_id: 3,
    sender_username: 'mark_smith',
    post_id: 1,
    post_title: 'Best food spots in Manila',
    comment_id: 2,
    is_read: true,
    created_at: '2023-06-16T15:45:00Z',
    timeAgo: '2 days ago',
  },
  {
    id: 3,
    user_id: 1,
    type: 'follow',
    sender_id: 2,
    sender_username: 'janedoe',
    sender_profile_pic: 'https://randomuser.me/api/portraits/women/2.jpg',
    is_read: false,
    created_at: '2023-06-15T11:20:00Z',
    timeAgo: '3 days ago',
  },
  {
    id: 4,
    user_id: 1,
    type: 'system',
    content: 'Welcome to ComTok! Complete your profile to get started.',
    is_read: true,
    created_at: '2023-06-10T08:00:00Z',
    timeAgo: '8 days ago',
  },
  {
    id: 5,
    user_id: 1,
    type: 'reply',
    sender_id: 3,
    sender_username: 'mark_smith',
    post_id: 2,
    comment_id: 4,
    is_read: false,
    created_at: '2023-06-17T14:15:00Z',
    timeAgo: '1 day ago',
  },
]
