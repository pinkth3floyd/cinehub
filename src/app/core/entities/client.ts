// Client-side entity imports (no database connection)
// This file is safe to import on the client side

// Export all schemas for use in other parts of the application
export * from "./user/schema";
export * from "./movies/schema";
export * from "./movies/relationships";
export * from "./reviews/schema";
export * from "./genre/schema";
export * from "./type/schema";
export * from "./year/schema";
export * from "./tags/schema";
export * from "./systemsettings/schema";

// Export all actions
export * from "./user/actions";
export * from "./movies/actions";
export * from "./reviews/actions";
export * from "./genre/actions";
export * from "./type/actions";
export * from "./year/actions";
export * from "./tags/actions";
export * from "./systemsettings/actions";
