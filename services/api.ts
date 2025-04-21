import { Platform } from 'react-native';
import { PostsResponse } from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import uuid from 'react-native-uuid';

// const API_BASE_URL = 'https://api.review.tugo.com.vn/api/v1';
// const API_BASE_URL = 'http://localhost:9090/api/v1';
// const API_BASE_URL = 'http://192.168.2.102:9090/api/v1';
// const API_BASE_URL = 'http://192.168.31.118:9090/api/v1';
const API_BASE_URL = 'http://192.168.0.177:9090/api/v1';
// const API_BASE_URL = process.env.API_KD!;

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
    // Lấy token từ Supabase session hoặc từ anonymous_device_id
    const session = (await supabase.auth.getSession()).data.session;
    let token = '';

    if (session?.access_token) {
      token = session.access_token;
    } else {
      let anonymousId = await AsyncStorage.getItem('@anonymous_device_id');
      
      if (!anonymousId) {
        anonymousId = uuid.v4() as string;
        await AsyncStorage.setItem('@anonymous_device_id', anonymousId);
      }

      token = `anonymous:${anonymousId}`;
    } 

    console.log('Token:', token);

    console.log('API BASE URL:', API_BASE_URL);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
        Authorization: `Bearer ${token}`, // ✅ thêm dòng này
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

    // Assuming your API wraps successful responses like { status: 'success', data: ... }                                                                                                      
    // Adjust this logic if your API structure is different                                                                                                                                    
    if (!response.ok || (data.status && data.status !== 'success' && data.status !== 200)) {                                                                                                   
      // Try to get a meaningful message from the response body                                                                                                                               
      const errorMessage = data?.message || data?.error || 'An error occurred';                                                                                                               
      throw new ApiError(                                                                                                                                                                     
        errorMessage,                                                                                                                                                                         
        response.status,                                                                                                                                                                      
        data?.code, // Optional error code from API                                                                                                                                           
        JSON.stringify(data) // Include full response data for debugging                                                                                                                      
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
    getAll: async ({ page = 1, page_size = 20 }: { page?: number; page_size?: number }) => {
      return fetchApi<ApiResponse<PostsResponse>>(`/posts?page=${page}&page_size=${page_size}`)

      // if (!res.ok) {
      //   throw new Error(`Failed to fetch posts: ${res.status}`);
      // }

      // const json = await res.json();
      // console.log(json);
      // return json; // ✅ PHẢI CÓ return này
    },
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
  // Add the new vouchers endpoint                                                                                                                                                             
  vouchers: {
    // Update the expected type parameter for fetchApi.
    // fetchApi returns the `data` field of ApiResponse, which is UserVoucher[] here.
    getUserVouchers: (userId: string) =>
      fetchApi<ApiResponse<UserVoucher[]>>(`/user-vouchers?user_id=${userId}`),
    // Add the new claim voucher endpoint
    claimVoucher: (userId: string, voucherId: number) =>
      fetchApi<ApiResponse<any>>(`/voucher/claim?user_id=${userId}`, { // Use any for now, refine if success response has specific data
        method: 'POST',
        body: JSON.stringify({ voucher_id: voucherId }),
      }),
    useVoucher: (userId: string, voucherId: number) =>                                                                                                                                         
      fetchApi<ApiResponse<any>>(`/voucher/use?user_id=${userId}`, {                                                                                                                           
        method: 'POST',                                                                                                                                                                        
        body: JSON.stringify({ voucher_id: voucherId }),                                                                                                                                       
      }), 
  },
  reactions: {
    sendReaction: (postId: number, type: 'like' | 'love') =>
      fetchApi<ApiResponse<any>>('/reactions', {
        method: 'POST',
        body: JSON.stringify({
          post_id: postId,
          reaction_type: type,
        }),
      }),
  },
  auth: {
    requestReset: (payload: { email: string }) =>
      fetchApi<ApiResponse<null>>('/auth/request-reset', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    resetPassword: (payload: { token: string; new_password: string }) =>
      fetchApi<ApiResponse<null>>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  }
};

// Define the structure of a single voucher from the API based on the new response
export interface UserVoucher {
  id: number;
  voucher_name: string;
  term_condition: string; // Represents the discount/offer details
  valid_until: string;
  code: string;
  available_for: string;
  claim_status: 'claimed' | 'not_claimed';
  status: 'active' | 'expired' | 'used'; // Assuming 'used' might be a status
  usage_status: 'used' | 'not_used';
  // Add any other relevant fields from your API if needed
}

// UserVouchersResponse is no longer needed as the data is directly an array in the ApiResponse
