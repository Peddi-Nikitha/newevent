// Mock data for events when the database isn't available
export const getMockEvent = (id: string) => {
  return {
    id,
    eventType: 'WEDDING',
    location: 'New York, NY',
    date: new Date().toISOString(),
    budget: 25000,
    progress: 65,
    user: {
      fullName: 'John Customer',
      email: 'customer@example.com',
    },
    vendors: [
      {
        id: 'v1',
        businessName: 'Perfect Shots Photography',
        category: 'PHOTOGRAPHY',
        location: 'New York, NY',
        profileImg: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',
        agreedPrice: 2500,
        status: 'CONFIRMED',
        service: 'Premium Wedding Package'
      },
      {
        id: 'v2',
        businessName: 'Delicious Bites Catering',
        category: 'CATERING',
        location: 'New York, NY',
        profileImg: 'https://images.unsplash.com/photo-1555244162-803834f70033',
        agreedPrice: 6000,
        status: 'PAID',
        service: 'Buffet Style - Standard'
      },
      {
        id: 'v3',
        businessName: 'Elite Sound Entertainment',
        category: 'MUSIC',
        location: 'New York, NY',
        profileImg: 'https://images.unsplash.com/photo-1571266028253-6c4c86f9b2b2',
        agreedPrice: 1200,
        status: 'PENDING',
        service: 'Basic DJ Package'
      }
    ],
  };
}; 