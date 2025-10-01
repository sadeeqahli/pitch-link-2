import { mutation, query } from "convex/server";
import { v } from "convex/values";

// Get all pitches for the current owner
export const getPitches = query({
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
    
    // Get all pitches for this owner
    const pitches = await ctx.db
      .query("pitches")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
      
    return pitches;
  },
});

// Get a specific pitch by ID
export const getPitch = query({
  args: {
    pitchId: v.id("pitches"),
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
    
    // Get the pitch
    const pitch = await ctx.db.get(args.pitchId);
    if (!pitch) {
      throw new Error("Pitch not found");
    }
    
    // Verify the pitch belongs to this owner
    if (pitch.ownerId !== user._id) {
      throw new Error("Unauthorized");
    }
    
    return pitch;
  },
});

// Create a new pitch
export const createPitch = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    pricePerHour: v.number(),
    description: v.optional(v.string()),
    amenities: v.optional(v.array(v.string())),
    photos: v.optional(v.array(v.string())),
    isActive: v.boolean(),
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
    
    // Create the pitch
    const pitchId = await ctx.db.insert("pitches", {
      ownerId: user._id,
      name: args.name,
      location: args.location,
      pricePerHour: args.pricePerHour,
      description: args.description,
      amenities: args.amenities,
      photos: args.photos,
      isActive: args.isActive,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return pitchId;
  },
});

// Update an existing pitch
export const updatePitch = mutation({
  args: {
    pitchId: v.id("pitches"),
    name: v.optional(v.string()),
    location: v.optional(v.string()),
    pricePerHour: v.optional(v.number()),
    description: v.optional(v.string()),
    amenities: v.optional(v.array(v.string())),
    photos: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
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
    
    // Get the pitch
    const pitch = await ctx.db.get(args.pitchId);
    if (!pitch) {
      throw new Error("Pitch not found");
    }
    
    // Verify the pitch belongs to this owner
    if (pitch.ownerId !== user._id) {
      throw new Error("Unauthorized");
    }
    
    // Update the pitch
    await ctx.db.patch(args.pitchId, {
      ...args,
      updatedAt: Date.now(),
    });
    
    return args.pitchId;
  },
});

// Delete a pitch
export const deletePitch = mutation({
  args: {
    pitchId: v.id("pitches"),
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
    
    // Get the pitch
    const pitch = await ctx.db.get(args.pitchId);
    if (!pitch) {
      throw new Error("Pitch not found");
    }
    
    // Verify the pitch belongs to this owner
    if (pitch.ownerId !== user._id) {
      throw new Error("Unauthorized");
    }
    
    // Delete the pitch
    await ctx.db.delete(args.pitchId);
    
    return args.pitchId;
  },
});