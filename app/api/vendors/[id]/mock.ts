// Mock data for vendors when the database isn't available
export const getMockVendor = (id: string) => {
  return {
    id,
    businessName: 'Perfect Shots Photography',
    category: 'PHOTOGRAPHY',
    location: 'New York, NY',
    minPrice: 500,
    maxPrice: 3000,
    rating: 4.8,
    description: 'Professional photography services for all types of events. We capture your special moments with artistic vision and technical excellence.',
    profileImg: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',
    services: [
      {
        id: 's1',
        title: 'Basic Wedding Package',
        description: '6 hours of coverage, 1 photographer, 200 edited digital photos, online gallery',
        price: 1200,
      },
      {
        id: 's2',
        title: 'Premium Wedding Package',
        description: '10 hours of coverage, 2 photographers, engagement session, 500 edited digital photos, online gallery, wedding album',
        price: 2500,
      },
      {
        id: 's3',
        title: 'Corporate Event Coverage',
        description: '4 hours of coverage, 1 photographer, 100 edited digital photos, online gallery',
        price: 800,
      }
    ],
    reviews: [
      {
        id: 'r1',
        rating: 5,
        reviewText: 'Amazing work! The photos were gorgeous and the photographer was so professional.',
        user: {
          fullName: 'John Smith',
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'r2',
        rating: 4,
        reviewText: 'Great photos, very happy with the results. Would recommend!',
        user: {
          fullName: 'Jane Doe',
        },
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ],
  };
}; 