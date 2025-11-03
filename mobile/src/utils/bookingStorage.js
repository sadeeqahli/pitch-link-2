// Shared booking storage for the app
export const bookingsStorage = {
  bookings: [
    {
      id: "1",
      player_name: "John Doe",
      pitch_name: "Main Football Pitch",
      booking_date: "2023-06-15",
      start_time: "14:00",
      end_time: "16:00",
      total_amount: "8000",
      payment_status: "confirmed",
      player_phone: "+234 801 234 5678",
      player_email: "johndoe@example.com",
      pitch_location: "123 Sports Avenue, Lagos"
    },
    {
      id: "2",
      player_name: "Jane Smith",
      pitch_name: "Basketball Court",
      booking_date: "2023-06-15",
      start_time: "10:00",
      end_time: "12:00",
      total_amount: "4000",
      payment_status: "pending",
      player_phone: "+234 802 345 6789",
      player_email: "janesmith@example.com",
      pitch_location: "456 Court Street, Lagos"
    },
    {
      id: "3",
      player_name: "Mike Johnson",
      pitch_name: "Tennis Court",
      booking_date: "2023-06-14",
      start_time: "18:00",
      end_time: "20:00",
      total_amount: "6000",
      payment_status: "completed",
      player_phone: "+234 803 456 7890",
      player_email: "mikejohnson@example.com",
      pitch_location: "789 Tennis Road, Lagos"
    },
    {
      id: "4",
      player_name: "Sarah Wilson",
      pitch_name: "Volleyball Court",
      booking_date: "2023-06-14",
      start_time: "09:00",
      end_time: "11:00",
      total_amount: "3500",
      payment_status: "confirmed",
      player_phone: "+234 804 567 8901",
      player_email: "sarahwilson@example.com",
      pitch_location: "321 Beach Road, Lagos"
    },
    {
      id: "5",
      player_name: "David Brown",
      pitch_name: "Main Football Pitch",
      booking_date: "2023-06-13",
      start_time: "15:00",
      end_time: "17:00",
      total_amount: "8000",
      payment_status: "completed",
      player_phone: "+234 805 678 9012",
      player_email: "davidbrown@example.com",
      pitch_location: "123 Sports Avenue, Lagos"
    },
  ],
  
  getAllBookings() {
    return this.bookings;
  },
  
  addBooking(booking) {
    // Generate a new ID
    const newId = Date.now().toString();
    const newBooking = {
      ...booking,
      id: newId,
      payment_status: "confirmed"
    };
    this.bookings.unshift(newBooking); // Add to the beginning of the array
    return newBooking;
  }
};