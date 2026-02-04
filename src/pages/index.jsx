import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Cart from "./Cart";

import Checkout from "./Checkout";

import OrderConfirmation from "./OrderConfirmation";

import VendorDashboard from "./VendorDashboard";

import VendorOrders from "./VendorOrders";

import MyOrders from "./MyOrders";

import ProductDetail from "./ProductDetail";

import Wishlist from "./Wishlist";

import Messages from "./Messages";

import Support from "./Support";

import AdminDashboard from "./AdminDashboard";

import AdminProducts from "./AdminProducts";

import AdminOrders from "./AdminOrders";

import AdminUsers from "./AdminUsers";

import Security from "./Security";

import Marketplace from "./Marketplace";

import MyStores from "./MyStores";

import AddStore from "./AddStore";

import EditStore from "./EditStore";

import StoreDetail from "./StoreDetail";

import StoreManagement from "./StoreManagement";

import AddProduct from "./AddProduct";

import AddService from "./AddService";

import AdminStores from "./AdminStores";

import StoreCMS from "./StoreCMS";

import StorePageEditor from "./StorePageEditor";

import StoreNavEditor from "./StoreNavEditor";

import Store from "./Store";

import StoreView from "./StoreView";

import ProductView from "./ProductView";

import MigrateStoreSlugs from "./MigrateStoreSlugs";

import MigrateStorePageSlugs from "./MigrateStorePageSlugs";

import MigrateEntitySlugs from "./MigrateEntitySlugs";

import AdminSupport from "./AdminSupport";

import ServiceView from "./ServiceView";

import EditService from "./EditService";

import EditProduct from "./EditProduct";

import Jobs from "./Jobs";

import JobDetail from "./JobDetail";

import AddJob from "./AddJob";

import EditJob from "./EditJob";

import MyJobs from "./MyJobs";

import BulletinBoard from "./BulletinBoard";

import BulletinPostDetail from "./BulletinPostDetail";

import AddBulletinPost from "./AddBulletinPost";

import EditBulletinPost from "./EditBulletinPost";

import MyBulletinPosts from "./MyBulletinPosts";

import LostAndFound from "./LostAndFound";

import LostAndFoundDetail from "./LostAndFoundDetail";

import AddLostAndFound from "./AddLostAndFound";

import EditLostAndFound from "./EditLostAndFound";

import MyLostAndFound from "./MyLostAndFound";

import FoodTrucks from "./FoodTrucks";

import FoodTruckDetail from "./FoodTruckDetail";

import TruckStopDetail from "./TruckStopDetail";

import MyFoodTrucks from "./MyFoodTrucks";

import AddFoodTruck from "./AddFoodTruck";

import EditFoodTruck from "./EditFoodTruck";

import MyTruckStops from "./MyTruckStops";

import AddTruckStop from "./AddTruckStop";

import EditTruckStop from "./EditTruckStop";

import Events from "./Events";

import EventDetail from "./EventDetail";

import AdminFoodTrucks from "./AdminFoodTrucks";

import AdminTowns from "./AdminTowns";

import Restaurants from "./Restaurants";

import RestaurantDetail from "./RestaurantDetail";

import MyRestaurants from "./MyRestaurants";

import AddRestaurant from "./AddRestaurant";

import EditRestaurant from "./EditRestaurant";

import AdminRestaurants from "./AdminRestaurants";

import AdminNavigation from "./AdminNavigation";

import MyProfile from "./MyProfile";

import ServiceDirectory from "./ServiceDirectory";

import TownSquare from "./TownSquare";

import BusinessDirectory from "./BusinessDirectory";

import AuthCallback from "./AuthCallback";

// Community Resources
import CommunityResources from "./CommunityResources";
import CommunityResourceDetail from "./CommunityResourceDetail";
import AddCommunityResource from "./AddCommunityResource";
import EditCommunityResource from "./EditCommunityResource";
import MyCommunityResources from "./MyCommunityResources";

// Churches
import Churches from "./Churches";
import ChurchDetail from "./ChurchDetail";
import AddChurch from "./AddChurch";
import EditChurch from "./EditChurch";
import MyChurches from "./MyChurches";

// Sports Teams
import SportsTeams from "./SportsTeams";
import SportsTeamDetail from "./SportsTeamDetail";
import AddSportsTeam from "./AddSportsTeam";
import EditSportsTeam from "./EditSportsTeam";
import MySportsTeams from "./MySportsTeams";

// Schools
import Schools from "./Schools";
import SchoolDetail from "./SchoolDetail";
import AddSchool from "./AddSchool";
import EditSchool from "./EditSchool";
import MySchools from "./MySchools";
import AdminSchools from "./AdminSchools";

// Attractions & Landmarks
import Attractions from "./Attractions";
import AttractionDetail from "./AttractionDetail";
import AddAttraction from "./AddAttraction";
import EditAttraction from "./EditAttraction";

// Real Estate
import Realty from "./Realty";
import RealtyDetail from "./RealtyDetail";
import AddRealtyListing from "./AddRealtyListing";
import EditRealtyListing from "./EditRealtyListing";
import MyRealtyListings from "./MyRealtyListings";

// SEO Landing Pages
import PublicServices from "./PublicServices";
import EmergencyServices from "./EmergencyServices";
import Utilities from "./Utilities";
import GovernmentOffices from "./GovernmentOffices";
import HealthServices from "./HealthServices";
import AboutNavarroCounty from "./AboutNavarroCounty";
import AboutCounty from "./AboutCounty";
import Home from "./Home";

// Monetization Pages
import ClaimListing from "./ClaimListing";

// Service Pages (Monetizable)
import NotaryServices from "./services/NotaryServices";
import LocksmithServices from "./services/LocksmithServices";
import PlumberServices from "./services/PlumberServices";
import ElectricianServices from "./services/ElectricianServices";
import HvacServices from "./services/HvacServices";
import RoofingServices from "./services/RoofingServices";
import PestControlServices from "./services/PestControlServices";
import LandscapingServices from "./services/LandscapingServices";
import AutoRepairServices from "./services/AutoRepairServices";
import TowingServices from "./services/TowingServices";
import CleaningServices from "./services/CleaningServices";
import PhotographyServices from "./services/PhotographyServices";
import CateringServices from "./services/CateringServices";
import DjServices from "./services/DjServices";
import WeddingVenueServices from "./services/WeddingVenueServices";

// Admin Site Settings
import AdminSiteSettings from "./AdminSiteSettings";

// Town Detail Page
import TownDetail from "./TownDetail";

// Admin Moderation Pages
import AdminChurches from "./AdminChurches";
import AdminCommunityResources from "./AdminCommunityResources";
import AdminSportsTeams from "./AdminSportsTeams";
import AdminClaimRequests from "./AdminClaimRequests";

// Legal & Policy Pages
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import CookiePolicy from "./CookiePolicy";
import PressPartnerships from "./PressPartnerships";

// Admin Analytics
import AdminAnalytics from "./AdminAnalytics";

// Custom Pages CMS
import AdminPages from "./AdminPages";
import EditPage from "./EditPage";
import CustomPage from "./CustomPage";

// Service Pages CMS (Monetization)
import AdminServicePages from "./AdminServicePages";
import EditServicePage from "./EditServicePage";
import ServicePageView from "./ServicePageView";
import ServiceInquiry from "./ServiceInquiry";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {

    Dashboard: Dashboard,

    Cart: Cart,

    Checkout: Checkout,
    
    OrderConfirmation: OrderConfirmation,
    
    VendorDashboard: VendorDashboard,
    
    VendorOrders: VendorOrders,
    
    MyOrders: MyOrders,
    
    ProductDetail: ProductDetail,
    
    Wishlist: Wishlist,
    
    Messages: Messages,
    
    Support: Support,
    
    AdminDashboard: AdminDashboard,
    
    AdminProducts: AdminProducts,

    AdminOrders: AdminOrders,

    AdminUsers: AdminUsers,

    Security: Security,
    
    Marketplace: Marketplace,
    
    MyStores: MyStores,
    
    AddStore: AddStore,
    
    EditStore: EditStore,
    
    StoreDetail: StoreDetail,
    
    StoreManagement: StoreManagement,
    
    AddProduct: AddProduct,
    
    AddService: AddService,
    
    AdminStores: AdminStores,
    
    StoreCMS: StoreCMS,
    
    StorePageEditor: StorePageEditor,
    
    StoreNavEditor: StoreNavEditor,
    
    Store: Store,
    
    StoreView: StoreView,
    
    ProductView: ProductView,
    
    MigrateStoreSlugs: MigrateStoreSlugs,
    
    MigrateStorePageSlugs: MigrateStorePageSlugs,

    MigrateEntitySlugs: MigrateEntitySlugs,
    
    AdminSupport: AdminSupport,
    
    ServiceView: ServiceView,
    
    EditService: EditService,
    
    EditProduct: EditProduct,

    Jobs: Jobs,

    JobDetail: JobDetail,

    AddJob: AddJob,

    EditJob: EditJob,

    MyJobs: MyJobs,

    BulletinBoard: BulletinBoard,

    BulletinPostDetail: BulletinPostDetail,

    AddBulletinPost: AddBulletinPost,

    EditBulletinPost: EditBulletinPost,

    MyBulletinPosts: MyBulletinPosts,

    LostAndFound: LostAndFound,

    LostAndFoundDetail: LostAndFoundDetail,

    AddLostAndFound: AddLostAndFound,

    EditLostAndFound: EditLostAndFound,

    MyLostAndFound: MyLostAndFound,

    FoodTrucks: FoodTrucks,

    FoodTruckDetail: FoodTruckDetail,

    TruckStopDetail: TruckStopDetail,

    MyFoodTrucks: MyFoodTrucks,

    AddFoodTruck: AddFoodTruck,

    EditFoodTruck: EditFoodTruck,

    MyTruckStops: MyTruckStops,

    AddTruckStop: AddTruckStop,

    EditTruckStop: EditTruckStop,

    Events: Events,

    EventDetail: EventDetail,

    AdminFoodTrucks: AdminFoodTrucks,

    AdminTowns: AdminTowns,

    Restaurants: Restaurants,

    RestaurantDetail: RestaurantDetail,

    MyRestaurants: MyRestaurants,

    AddRestaurant: AddRestaurant,

    EditRestaurant: EditRestaurant,

    AdminRestaurants: AdminRestaurants,

    AdminNavigation: AdminNavigation,

    MyProfile: MyProfile,

    ServiceDirectory: ServiceDirectory,

    TownSquare: TownSquare,

    BusinessDirectory: BusinessDirectory,

    // Community Resources
    CommunityResources: CommunityResources,
    CommunityResourceDetail: CommunityResourceDetail,
    AddCommunityResource: AddCommunityResource,
    EditCommunityResource: EditCommunityResource,
    MyCommunityResources: MyCommunityResources,

    // Churches
    Churches: Churches,
    ChurchDetail: ChurchDetail,
    AddChurch: AddChurch,
    EditChurch: EditChurch,
    MyChurches: MyChurches,

    // Sports Teams
    SportsTeams: SportsTeams,
    SportsTeamDetail: SportsTeamDetail,
    AddSportsTeam: AddSportsTeam,
    EditSportsTeam: EditSportsTeam,
    MySportsTeams: MySportsTeams,

    // Schools
    Schools: Schools,
    SchoolDetail: SchoolDetail,
    AddSchool: AddSchool,
    EditSchool: EditSchool,
    MySchools: MySchools,
    AdminSchools: AdminSchools,

    // Attractions & Landmarks
    Attractions: Attractions,
    AttractionDetail: AttractionDetail,
    AddAttraction: AddAttraction,
    EditAttraction: EditAttraction,

    // Real Estate
    Realty: Realty,
    RealtyDetail: RealtyDetail,
    AddRealtyListing: AddRealtyListing,
    EditRealtyListing: EditRealtyListing,
    MyRealtyListings: MyRealtyListings,

    // SEO Landing Pages
    PublicServices: PublicServices,
    EmergencyServices: EmergencyServices,
    Utilities: Utilities,
    GovernmentOffices: GovernmentOffices,
    HealthServices: HealthServices,
    AboutNavarroCounty: AboutNavarroCounty,
    AboutCounty: AboutCounty,
    Home: Home,

    // Monetization Pages
    ClaimListing: ClaimListing,

    // Service Pages
    NotaryServices: NotaryServices,
    LocksmithServices: LocksmithServices,
    PlumberServices: PlumberServices,
    ElectricianServices: ElectricianServices,
    HvacServices: HvacServices,
    RoofingServices: RoofingServices,
    PestControlServices: PestControlServices,
    LandscapingServices: LandscapingServices,
    AutoRepairServices: AutoRepairServices,
    TowingServices: TowingServices,
    CleaningServices: CleaningServices,
    PhotographyServices: PhotographyServices,
    CateringServices: CateringServices,
    DjServices: DjServices,
    WeddingVenueServices: WeddingVenueServices,

    // Admin Site Settings
    AdminSiteSettings: AdminSiteSettings,

    // Admin Moderation Pages
    AdminChurches: AdminChurches,
    AdminCommunityResources: AdminCommunityResources,
    AdminSportsTeams: AdminSportsTeams,
    AdminClaimRequests: AdminClaimRequests,

    // Town Detail Page
    TownDetail: TownDetail,

    // Legal & Policy Pages
    PrivacyPolicy: PrivacyPolicy,
    TermsOfService: TermsOfService,
    CookiePolicy: CookiePolicy,
    PressPartnerships: PressPartnerships,

    // Admin Analytics
    AdminAnalytics: AdminAnalytics,

    // Custom Pages CMS
    AdminPages: AdminPages,
    EditPage: EditPage,
    CustomPage: CustomPage,

    // Service Pages CMS (Monetization)
    AdminServicePages: AdminServicePages,
    EditServicePage: EditServicePage,
    ServicePageView: ServicePageView,
    ServiceInquiry: ServiceInquiry,

}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);

    return (
        <Routes>
            {/* Auth callback route without Layout */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* All other routes with Layout */}
            <Route path="*" element={
                <Layout currentPageName={currentPage}>
                    <Routes>

                            <Route path="/" element={<Home />} />

                        <Route path="/Home" element={<Home />} />

                        <Route path="/Dashboard" element={<Dashboard />} />

                        <Route path="/Cart" element={<Cart />} />
                
                <Route path="/Checkout" element={<Checkout />} />
                
                <Route path="/OrderConfirmation" element={<OrderConfirmation />} />
                
                <Route path="/VendorDashboard" element={<VendorDashboard />} />
                
                <Route path="/VendorOrders" element={<VendorOrders />} />
                
                <Route path="/MyOrders" element={<MyOrders />} />
                
                <Route path="/ProductDetail" element={<ProductDetail />} />
                
                <Route path="/Wishlist" element={<Wishlist />} />
                
                <Route path="/Messages" element={<Messages />} />
                
                <Route path="/Support" element={<Support />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/AdminProducts" element={<AdminProducts />} />

                <Route path="/AdminOrders" element={<AdminOrders />} />

                <Route path="/AdminUsers" element={<AdminUsers />} />
                
                <Route path="/Security" element={<Security />} />
                
                <Route path="/Marketplace" element={<Marketplace />} />

                <Route path="/ServiceDirectory" element={<ServiceDirectory />} />

                <Route path="/TownSquare" element={<TownSquare />} />

                <Route path="/BusinessDirectory" element={<BusinessDirectory />} />

                <Route path="/MyStores" element={<MyStores />} />
                
                <Route path="/AddStore" element={<AddStore />} />
                
                <Route path="/EditStore" element={<EditStore />} />
                
                <Route path="/StoreDetail" element={<StoreDetail />} />
                
                <Route path="/StoreManagement" element={<StoreManagement />} />
                
                <Route path="/AddProduct" element={<AddProduct />} />
                
                <Route path="/AddService" element={<AddService />} />
                
                <Route path="/AdminStores" element={<AdminStores />} />
                
                <Route path="/StoreCMS" element={<StoreCMS />} />
                
                <Route path="/StorePageEditor" element={<StorePageEditor />} />
                
                <Route path="/StoreNavEditor" element={<StoreNavEditor />} />
                
                <Route path="/Store" element={<Store />} />
                
                <Route path="/StoreView" element={<StoreView />} />
                
                <Route path="/ProductView" element={<ProductView />} />
                
                <Route path="/MigrateStoreSlugs" element={<MigrateStoreSlugs />} />
                
                <Route path="/MigrateStorePageSlugs" element={<MigrateStorePageSlugs />} />

                <Route path="/MigrateEntitySlugs" element={<MigrateEntitySlugs />} />
                
                <Route path="/AdminSupport" element={<AdminSupport />} />
                
                <Route path="/ServiceView" element={<ServiceView />} />
                
                <Route path="/EditService" element={<EditService />} />
                
                <Route path="/EditProduct" element={<EditProduct />} />

                <Route path="/Jobs" element={<Jobs />} />

                <Route path="/JobDetail" element={<JobDetail />} />

                <Route path="/AddJob" element={<AddJob />} />

                <Route path="/EditJob" element={<EditJob />} />

                <Route path="/MyJobs" element={<MyJobs />} />

                <Route path="/BulletinBoard" element={<BulletinBoard />} />

                <Route path="/BulletinPostDetail" element={<BulletinPostDetail />} />

                <Route path="/AddBulletinPost" element={<AddBulletinPost />} />

                <Route path="/EditBulletinPost" element={<EditBulletinPost />} />

                <Route path="/MyBulletinPosts" element={<MyBulletinPosts />} />

                <Route path="/LostAndFound" element={<LostAndFound />} />

                <Route path="/LostAndFoundDetail" element={<LostAndFoundDetail />} />

                <Route path="/AddLostAndFound" element={<AddLostAndFound />} />

                <Route path="/EditLostAndFound" element={<EditLostAndFound />} />

                <Route path="/MyLostAndFound" element={<MyLostAndFound />} />

                <Route path="/FoodTrucks" element={<FoodTrucks />} />

                <Route path="/FoodTruckDetail" element={<FoodTruckDetail />} />
                <Route path="/food-truck/:townSlug/:truckSlug" element={<FoodTruckDetail />} />

                <Route path="/TruckStopDetail" element={<TruckStopDetail />} />

                <Route path="/MyFoodTrucks" element={<MyFoodTrucks />} />

                <Route path="/AddFoodTruck" element={<AddFoodTruck />} />

                <Route path="/EditFoodTruck" element={<EditFoodTruck />} />

                <Route path="/MyTruckStops" element={<MyTruckStops />} />

                <Route path="/AddTruckStop" element={<AddTruckStop />} />

                <Route path="/EditTruckStop" element={<EditTruckStop />} />

                <Route path="/Events" element={<Events />} />

                <Route path="/EventDetail" element={<EventDetail />} />

                <Route path="/AdminFoodTrucks" element={<AdminFoodTrucks />} />

                <Route path="/AdminTowns" element={<AdminTowns />} />

                <Route path="/Restaurants" element={<Restaurants />} />

                <Route path="/RestaurantDetail" element={<RestaurantDetail />} />
                <Route path="/restaurant/:townSlug/:restaurantSlug" element={<RestaurantDetail />} />

                <Route path="/MyRestaurants" element={<MyRestaurants />} />

                <Route path="/AddRestaurant" element={<AddRestaurant />} />

                <Route path="/EditRestaurant" element={<EditRestaurant />} />

                <Route path="/AdminRestaurants" element={<AdminRestaurants />} />

                <Route path="/AdminNavigation" element={<AdminNavigation />} />

                <Route path="/MyProfile" element={<MyProfile />} />

                {/* Community Resources */}
                <Route path="/CommunityResources" element={<CommunityResources />} />
                <Route path="/CommunityResourceDetail" element={<CommunityResourceDetail />} />
                <Route path="/resource/:townSlug/:resourceSlug" element={<CommunityResourceDetail />} />
                <Route path="/AddCommunityResource" element={<AddCommunityResource />} />
                <Route path="/EditCommunityResource" element={<EditCommunityResource />} />
                <Route path="/MyCommunityResources" element={<MyCommunityResources />} />

                {/* Churches */}
                <Route path="/Churches" element={<Churches />} />
                <Route path="/ChurchDetail" element={<ChurchDetail />} />
                <Route path="/church/:townSlug/:churchSlug" element={<ChurchDetail />} />
                <Route path="/AddChurch" element={<AddChurch />} />
                <Route path="/EditChurch" element={<EditChurch />} />
                <Route path="/MyChurches" element={<MyChurches />} />

                {/* Sports Teams */}
                <Route path="/SportsTeams" element={<SportsTeams />} />
                <Route path="/SportsTeamDetail" element={<SportsTeamDetail />} />
                <Route path="/sports-team/:townSlug/:teamSlug" element={<SportsTeamDetail />} />
                <Route path="/AddSportsTeam" element={<AddSportsTeam />} />
                <Route path="/EditSportsTeam" element={<EditSportsTeam />} />
                <Route path="/MySportsTeams" element={<MySportsTeams />} />

                {/* Schools */}
                <Route path="/Schools" element={<Schools />} />
                <Route path="/SchoolDetail" element={<SchoolDetail />} />
                <Route path="/school/:townSlug/:schoolSlug" element={<SchoolDetail />} />
                <Route path="/AddSchool" element={<AddSchool />} />
                <Route path="/EditSchool" element={<EditSchool />} />
                <Route path="/MySchools" element={<MySchools />} />
                <Route path="/AdminSchools" element={<AdminSchools />} />

                {/* Attractions & Landmarks */}
                <Route path="/Attractions" element={<Attractions />} />
                <Route path="/AttractionDetail" element={<AttractionDetail />} />
                <Route path="/attraction/:townSlug/:attractionSlug" element={<AttractionDetail />} />
                <Route path="/AddAttraction" element={<AddAttraction />} />
                <Route path="/EditAttraction" element={<EditAttraction />} />

                {/* Real Estate */}
                <Route path="/Realty" element={<Realty />} />
                <Route path="/RealtyDetail" element={<RealtyDetail />} />
                <Route path="/real-estate/:townSlug/:listingSlug" element={<RealtyDetail />} />
                <Route path="/AddRealtyListing" element={<AddRealtyListing />} />
                <Route path="/EditRealtyListing" element={<EditRealtyListing />} />
                <Route path="/MyRealtyListings" element={<MyRealtyListings />} />

                {/* SEO Landing Pages - supports both generic and county-specific URLs */}
                <Route path="/PublicServices" element={<PublicServices />} />
                <Route path="/public-services-:countySlug-county" element={<PublicServices />} />
                <Route path="/EmergencyServices" element={<EmergencyServices />} />
                <Route path="/Utilities" element={<Utilities />} />
                <Route path="/GovernmentOffices" element={<GovernmentOffices />} />
                <Route path="/HealthServices" element={<HealthServices />} />
                <Route path="/AboutNavarroCounty" element={<AboutCounty />} />
                <Route path="/AboutCounty" element={<AboutCounty />} />
                <Route path="/about-:countySlug-county" element={<AboutCounty />} />

                {/* Monetization Pages */}
                <Route path="/ClaimListing" element={<ClaimListing />} />

                {/* Service Pages (SEO + Monetization) */}
                <Route path="/notary" element={<NotaryServices />} />
                <Route path="/NotaryServices" element={<NotaryServices />} />
                <Route path="/locksmith" element={<LocksmithServices />} />
                <Route path="/LocksmithServices" element={<LocksmithServices />} />
                <Route path="/plumber" element={<PlumberServices />} />
                <Route path="/PlumberServices" element={<PlumberServices />} />
                <Route path="/electrician" element={<ElectricianServices />} />
                <Route path="/ElectricianServices" element={<ElectricianServices />} />
                <Route path="/hvac" element={<HvacServices />} />
                <Route path="/HvacServices" element={<HvacServices />} />
                <Route path="/roofing" element={<RoofingServices />} />
                <Route path="/RoofingServices" element={<RoofingServices />} />
                <Route path="/pest-control" element={<PestControlServices />} />
                <Route path="/PestControlServices" element={<PestControlServices />} />
                <Route path="/landscaping" element={<LandscapingServices />} />
                <Route path="/LandscapingServices" element={<LandscapingServices />} />
                <Route path="/auto-repair" element={<AutoRepairServices />} />
                <Route path="/AutoRepairServices" element={<AutoRepairServices />} />
                <Route path="/towing" element={<TowingServices />} />
                <Route path="/TowingServices" element={<TowingServices />} />
                <Route path="/cleaning" element={<CleaningServices />} />
                <Route path="/CleaningServices" element={<CleaningServices />} />
                <Route path="/photography" element={<PhotographyServices />} />
                <Route path="/PhotographyServices" element={<PhotographyServices />} />
                <Route path="/catering" element={<CateringServices />} />
                <Route path="/CateringServices" element={<CateringServices />} />
                <Route path="/dj" element={<DjServices />} />
                <Route path="/DjServices" element={<DjServices />} />
                <Route path="/wedding-venues" element={<WeddingVenueServices />} />
                <Route path="/WeddingVenueServices" element={<WeddingVenueServices />} />

                {/* Admin Site Settings */}
                <Route path="/AdminSiteSettings" element={<AdminSiteSettings />} />

                {/* Admin Moderation Pages */}
                <Route path="/AdminChurches" element={<AdminChurches />} />
                <Route path="/AdminCommunityResources" element={<AdminCommunityResources />} />
                <Route path="/AdminSportsTeams" element={<AdminSportsTeams />} />
                <Route path="/AdminClaimRequests" element={<AdminClaimRequests />} />

                {/* Legal & Policy Pages */}
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/TermsOfService" element={<TermsOfService />} />
                <Route path="/CookiePolicy" element={<CookiePolicy />} />
                <Route path="/PressPartnerships" element={<PressPartnerships />} />

                {/* Admin Analytics */}
                <Route path="/AdminAnalytics" element={<AdminAnalytics />} />

                {/* Custom Pages CMS */}
                <Route path="/AdminPages" element={<AdminPages />} />
                <Route path="/EditPage" element={<EditPage />} />

                {/* Service Pages CMS (Monetization) */}
                <Route path="/AdminServicePages" element={<AdminServicePages />} />
                <Route path="/EditServicePage" element={<EditServicePage />} />
                <Route path="/ServiceInquiry" element={<ServiceInquiry />} />
                
                {/* Dynamic Service Page Renderer */}
                <Route path="/service/:serviceSlug" element={<ServicePageView />} />

                {/* Custom Page Renderer - Catches page slugs and service page slugs */}
                {/* CustomPage checks if slug is a Page first, then falls back to ServicePageView */}
                <Route path="/:pageSlug" element={<CustomPage />} />

                    </Routes>
                </Layout>
            } />
        </Routes>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}