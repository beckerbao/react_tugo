import { Platform } from 'react-native';
import { PostsResponse } from '@/types/api';

const API_BASE_URL = 'https://api.review.tugo.com.vn/api/v1';

// Types for API responses
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface Hero {
  image: string;
  subtitle: string;
  title: string;
}

export interface PopularDestination {
  id: number;
  image: string;
  name: string;
}

export interface PopularTour {
  duration: string;
  image: string;
  name: string;
  price: number;
  rating: number;
  review_count: number;
  type: string;
  tour_id: number;
}

export interface SpecialOffer {
  button_text: string;
  description: string;
  title: string;
}

export interface HomepageData {
  hero: Hero;
  popular_destinations: PopularDestination[];
  popular_tours: PopularTour[];
  special_offers: SpecialOffer[];
}

export interface TourHighlight {
  title: string;
  description: string;
}

export interface TourItinerary {
  day: string;
  title: string;
  description: string;
}

export interface TourPhotoGallery {
  name: string;
  image: string;
}

export interface TourIncluded {
  title: string;
  description: string;
}

export interface TourDetail {
  id: number;
  name: string;
  duration: string;
  type: string;
  price: number;
  image: string;
  highlights: TourHighlight[];
  itinerary: TourItinerary[];
  photo_gallery: TourPhotoGallery[];
  whats_included: TourIncluded[];
}

export interface SearchResult {
  destination_id: number;
  image: string;
  name: string;
  subtitle: string;
}

export interface DestinationTour {
  duration: string;
  image: string;
  name: string;
  price: number;
  rating: number;
  review_count: number;
  tour_id: number;
  type: string;
}

export interface DestinationDetail {
  destination_id: string;
  destination_name: string;
  destination_image: string;
  tours: DestinationTour[];
}

export interface BookingRequest {
  tour_id: number;
  tour_name: string;
  full_name: string;
  phone: string;
  departure_date: string;
}

// Error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public response?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API client configuration
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': `TravelApp/${Platform.OS}`,
};

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // Get the raw response text first
    const responseText = await response.text();

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new ApiError(
        'Failed to parse response as JSON',
        response.status,
        'PARSE_ERROR',
        responseText
      );
    }

    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred',
        response.status,
        data.code,
        JSON.stringify(data)
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message === 'Network request failed') {
      throw new ApiError(
        'Network connection failed. Please check your internet connection.',
        0,
        'NETWORK_ERROR'
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      0,
      'UNKNOWN_ERROR'
    );
  }
}

// API endpoints
export const api = {
  homepage: {
    getData: () => fetchApi<ApiResponse<HomepageData>>('/homepage'),
  },
  posts: {
    getAll: (page = 1, pageSize = 10) => 
      fetchApi<ApiResponse<PostsResponse>>(`/posts?page=${page}&page_size=${pageSize}&type=general`),
  },
  tours: {
    getDetail: (tourId: number) => 
      fetchApi<ApiResponse<TourDetail>>(`/tour/detail?tour_id=${tourId}`),
  },
  booking: {
    submit: (data: BookingRequest) => 
      fetchApi<ApiResponse<any>>('/booking/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  search: {
    destinations: (query: string) =>
      fetchApi<ApiResponse<SearchResult[]>>(`/search?query=${encodeURIComponent(query)}`),
  },
  destination: {
    getTours: (destinationId: string | number) =>
      fetchApi<ApiResponse<DestinationDetail>>(`/destination/tours?destination_id=${destinationId}`),
  },
};