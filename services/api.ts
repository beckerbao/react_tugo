import { Platform } from 'react-native';

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
        responseText // Include the raw response for debugging
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
};