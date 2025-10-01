import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users (both players and owners)
  users: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    role: v.union(v.literal("player"), v.literal("owner")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),
  
  // Pitches
  pitches: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    location: v.string(),
    pricePerHour: v.number(),
    description: v.optional(v.string()),
    amenities: v.optional(v.array(v.string())),
    photos: v.optional(v.array(v.string())),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerId"]),
  
  // Bookings
  bookings: defineTable({
    pitchId: v.id("pitches"),
    playerId: v.id("users"),
    ownerId: v.id("users"),
    date: v.string(), // YYYY-MM-DD
    startTime: v.string(), // HH:MM
    endTime: v.string(), // HH:MM
    totalAmount: v.number(),
    status: v.union(
      v.literal("pending"), 
      v.literal("confirmed"), 
      v.literal("cancelled"),
      v.literal("completed")
    ),
    paymentStatus: v.union(
      v.literal("pending"), 
      v.literal("completed"), 
      v.literal("failed"),
      v.literal("refunded")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_pitch", ["pitchId"])
    .index("by_player", ["playerId"])
    .index("by_owner", ["ownerId"])
    .index("by_date", ["date"])
    .index("by_status", ["status"])
    .index("by_payment_status", ["paymentStatus"]),
  
  // Payments
  payments: defineTable({
    bookingId: v.id("bookings"),
    amount: v.number(),
    method: v.union(v.literal("card"), v.literal("bank_transfer"), v.literal("flutterwave")),
    status: v.union(
      v.literal("pending"), 
      v.literal("completed"), 
      v.literal("failed"),
      v.literal("refunded")
    ),
    transactionId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_booking", ["bookingId"]),
  
  // Analytics
  analytics: defineTable({
    ownerId: v.id("users"),
    date: v.string(), // YYYY-MM-DD
    revenue: v.number(),
    bookingsCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_date", ["date"]),
});