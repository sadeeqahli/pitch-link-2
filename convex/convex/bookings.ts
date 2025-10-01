import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all bookings for the current owner
export const getBookings = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    // Get the user to verify they're an owner
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .unique();
      
    if (!user || user.role !== "owner") {
      throw new Error("Unauthorized");
    }
    
    // Get all bookings for this owner
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
      
    return bookings;
  },
});

// Get a specific booking by ID
export const getBooking = query({
  args: {
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    // Get the user to verify they're an owner
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .unique();
      
    if (!user || user.role !== "owner") {
      throw new Error("Unauthorized");
    }
    
    // Get the booking
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    // Verify the booking belongs to this owner
    if (booking.ownerId !== user._id) {
      throw new Error("Unauthorized");
    }
    
    return booking;
  },
});

// Update booking status
export const updateBookingStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.union(
      v.literal("pending"), 
      v.literal("confirmed"), 
      v.literal("cancelled"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    // Get the user to verify they're an owner
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .unique();
      
    if (!user || user.role !== "owner") {
      throw new Error("Unauthorized");
    }
    
    // Get the booking
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    // Verify the booking belongs to this owner
    if (booking.ownerId !== user._id) {
      throw new Error("Unauthorized");
    }
    
    // Update the booking status
    await ctx.db.patch(args.bookingId, {
      status: args.status,
      updatedAt: Date.now(),
    });
    
    return args.bookingId;
  },
});

// Get bookings with filters
export const getFilteredBookings = query({
  args: {
    filter: v.union(
      v.literal("all"),
      v.literal("today"),
      v.literal("upcoming"),
      v.literal("pending")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    // Get the user to verify they're an owner
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .unique();
      
    if (!user || user.role !== "owner") {
      throw new Error("Unauthorized");
    }
    
    let bookings;
    
    switch (args.filter) {
      case "today":
        const today = new Date().toISOString().split("T")[0];
        bookings = await ctx.db
          .query("bookings")
          .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
          .filter((q) => q.eq(q.field("date"), today))
          .collect();
        break;
      case "upcoming":
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];
        bookings = await ctx.db
          .query("bookings")
          .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
          .filter((q) => q.gte(q.field("date"), tomorrowStr))
          .collect();
        break;
      case "pending":
        bookings = await ctx.db
          .query("bookings")
          .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
          .filter((q) => q.eq(q.field("status"), "pending"))
          .collect();
        break;
      case "all":
      default:
        bookings = await ctx.db
          .query("bookings")
          .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
          .collect();
        break;
    }
    
    return bookings;
  },
});