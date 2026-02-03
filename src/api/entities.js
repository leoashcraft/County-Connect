import { localClient } from './localClient';

// Export entity methods from local client
export const Store = localClient.entities.Store;

export const Product = localClient.entities.Product;

export const Service = localClient.entities.Service;

export const ProductVariation = localClient.entities.ProductVariation;

export const Cart = localClient.entities.Cart;

export const Coupon = localClient.entities.Coupon;

export const Order = localClient.entities.Order;

export const Quote = localClient.entities.Quote;

export const Brand = localClient.entities.Brand;

export const Follow = localClient.entities.Follow;

export const Wishlist = localClient.entities.Wishlist;

export const WishlistCollection = localClient.entities.WishlistCollection;

export const Review = localClient.entities.Review;

export const Message = localClient.entities.Message;

export const BlogPost = localClient.entities.BlogPost;

export const SupportTicket = localClient.entities.SupportTicket;

export const Refund = localClient.entities.Refund;

export const NewsletterSubscriber = localClient.entities.NewsletterSubscriber;

export const StoreInvitation = localClient.entities.StoreInvitation;

export const StorePage = localClient.entities.StorePage;

export const StoreNavigationItem = localClient.entities.StoreNavigationItem;

export const Job = localClient.entities.Job;

export const BulletinPost = localClient.entities.BulletinPost;

export const LostAndFound = localClient.entities.LostAndFound;

export const FoodTruck = localClient.entities.FoodTruck;

export const TruckStop = localClient.entities.TruckStop;

export const Event = localClient.entities.Event;

export const Town = localClient.entities.Town;

export const Restaurant = localClient.entities.Restaurant;

export const MenuSection = localClient.entities.MenuSection;

export const MenuItem = localClient.entities.MenuItem;

export const OperatingHours = localClient.entities.OperatingHours;

export const SiteSetting = localClient.entities.SiteSetting;

// Town Square Chat entities
export const ChatChannel = localClient.entities.ChatChannel;

export const ChatMessage = localClient.entities.ChatMessage;

export const ChatRole = localClient.entities.ChatRole;

export const ChatModerationAction = localClient.entities.ChatModerationAction;

// Community Resources
export const CommunityResource = localClient.entities.CommunityResource;

// Churches
export const Church = localClient.entities.Church;

// Sports Teams
export const SportsTeam = localClient.entities.SportsTeam;

// Schools
export const School = localClient.entities.School;

// Daycares
export const Daycare = localClient.entities.Daycare;

// Attractions & Landmarks
export const Attraction = localClient.entities.Attraction;

// Real Estate Listings
export const RealtyListing = localClient.entities.RealtyListing;

// Claim Requests
export const ClaimRequest = localClient.entities.ClaimRequest;

// Custom Pages (Site CMS)
export const Page = localClient.entities.Page;

// Custom Navigation Items
export const NavigationItem = localClient.entities.NavigationItem;

// Entity Pages (mini-websites for restaurants, churches, attractions, etc.)
export const EntityPage = localClient.entities.EntityPage;

// Entity Navigation Items (for entity mini-websites)
export const EntityNavigationItem = localClient.entities.EntityNavigationItem;

// Photo Galleries for entities
export const EntityPhoto = localClient.entities.EntityPhoto;

// Export local auth
export const User = localClient.auth;

// Export User entity for admin operations (listing users, etc.)
export const UserEntity = localClient.entities.User;