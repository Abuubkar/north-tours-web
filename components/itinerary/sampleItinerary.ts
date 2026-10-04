import { sampleTour } from '@/components/tour-card/sampleTours';
import { drawItinerary, ITINERARY_MAP_FRAME, MINI_MAP_FRAME } from '@/lib/utils/itinerary';

/* The sample tour's itinerary drawn for stories (the side map's frame and the mini maps'). */

export const sampleDays = sampleTour.itinerary;

export const sampleSideDrawing = drawItinerary(sampleTour.stops, sampleTour.itinerary, ITINERARY_MAP_FRAME);

export const sampleMiniDrawing = drawItinerary(sampleTour.stops, sampleTour.itinerary, MINI_MAP_FRAME);
