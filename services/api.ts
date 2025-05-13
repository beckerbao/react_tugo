import { Platform } from 'react-native';
import { PostsResponse } from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import uuid from 'react-native-uuid';

// Use a proper URL format with protocol
const API_BASE_URL = 'http://localhost:9090/api/v1';

// Validate URL format
function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

if (!validateUrl(API_BASE_URL)) {
  throw new Error('Invalid API_BASE_URL format');
}

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
  destination_i