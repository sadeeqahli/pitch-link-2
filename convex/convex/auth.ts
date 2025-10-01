import { mutation, query } from "./_generated/server";
import { v } from "./_generated/dataModel";

// Sign up a new user (pitch owner)
export const signUp = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
      
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    
    // Create the user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      role: "owner",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Set the user identity
    await ctx.auth.setUserIdentity({
      userId,
      name: args.name,
      email: args.email,
    });
    
    return userId;
  },
});

// Sign in an existing user
export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // In a real implementation, you would verify the password
    // This is a simplified version for demonstration
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
      
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    // Set the user identity
    await ctx.auth.setUserIdentity({
      userId: user._id,
      name: user.name,
      email: user.email,
    });
    
    return user._id;
  },
});

// Get current user
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .unique();
      
    return user;
  },
});

// Sign out
export const signOut = mutation({
  handler: async (ctx) => {
    await ctx.auth.clearUserIdentity();
  },
});