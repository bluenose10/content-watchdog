
export const APP_NAME = "InfluenceGuard";
export const APP_DESCRIPTION = "Protect your content across the internet";

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    description: "For individuals just getting started",
    price: 0,
    stripePriceId: "", // Free plan doesn't need a Stripe ID
    features: [
      "Up to 5 search results per query",
      "Basic content monitoring",
      "Manual searches only",
      "Email support"
    ],
    limitations: [
      "Limited to 5 searches per month",
      "No automated monitoring",
      "No detailed analytics"
    ],
    cta: "Start Free"
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious content creators",
    price: 49.99,
    stripePriceId: "price_XXXXXXXXXX", // Replace with your actual Pro plan Price ID from Stripe
    features: [
      "Unlimited search results",
      "Advanced content monitoring",
      "10 automated monitoring sessions",
      "Export results in multiple formats",
      "Priority email support"
    ],
    limitations: [],
    cta: "Upgrade to Pro",
    popular: true
  },
  {
    id: "business",
    name: "Business",
    description: "For teams and businesses",
    price: 149.00,
    stripePriceId: "price_XXXXXXXXXX", // Replace with your actual Business plan Price ID from Stripe
    features: [
      "Everything in Pro",
      "Unlimited automated monitoring",
      "Team access (up to 5 members)",
      "Detailed analytics dashboard",
      "Integration with other platforms",
      "Priority phone & email support"
    ],
    limitations: [],
    cta: "Contact Sales"
  }
];

export const FEATURES = [
  {
    title: "Advanced Search",
    description: "Find your content across the web using our powerful search algorithms"
  },
  {
    title: "Real-time Alerts",
    description: "Get notified instantly when your content appears on unauthorized sites"
  },
  {
    title: "Automated Protection",
    description: "Set up automatic monitoring to continuously protect your content"
  },
  {
    title: "Match Level System",
    description: "Prioritize results with High, Medium, or Low match indicators showing content relevance"
  },
  {
    title: "DMCA Assistance",
    description: "Generate pre-filled DMCA takedown notices with a single click"
  }
];

export const SEARCH_TYPES = [
  { id: "name", label: "Name or Username" },
  { id: "hashtag", label: "Hashtag" },
  { id: "image", label: "Image Upload" }
];

export const MOCK_SEARCH_RESULTS = [
  {
    id: "1",
    title: "Content found on example.com",
    url: "https://example.com/content1",
    thumbnail: "https://placehold.co/600x400/png",
    source: "example.com",
    matchLevel: "High",
    date: "2023-05-15T10:30:00Z"
  },
  {
    id: "2",
    title: "Your image reposted on socialsite.com",
    url: "https://socialsite.com/post/12345",
    thumbnail: "https://placehold.co/600x400/png",
    source: "socialsite.com",
    matchLevel: "Medium",
    date: "2023-05-14T08:45:00Z"
  },
  {
    id: "3",
    title: "Content shared on blogplatform.com",
    url: "https://blogplatform.com/article/your-content",
    thumbnail: "https://placehold.co/600x400/png",
    source: "blogplatform.com",
    matchLevel: "High",
    date: "2023-05-12T16:20:00Z"
  },
  {
    id: "4",
    title: "Image used on commercialsite.com",
    url: "https://commercialsite.com/products/inspired-by",
    thumbnail: "https://placehold.co/600x400/png",
    source: "commercialsite.com",
    matchLevel: "Low",
    date: "2023-05-11T09:15:00Z"
  },
  {
    id: "5",
    title: "Content appearing on aggregator.com",
    url: "https://aggregator.com/trending/content",
    thumbnail: "https://placehold.co/600x400/png",
    source: "aggregator.com",
    matchLevel: "Medium",
    date: "2023-05-10T14:50:00Z"
  },
  {
    id: "6",
    title: "Your username mentioned on forum.com",
    url: "https://forum.com/discussion/789",
    thumbnail: "https://placehold.co/600x400/png",
    source: "forum.com",
    matchLevel: "Low",
    date: "2023-05-09T11:30:00Z"
  },
  {
    id: "7",
    title: "Content shared without attribution on contentmill.com",
    url: "https://contentmill.com/viral/123",
    thumbnail: "https://placehold.co/600x400/png",
    source: "contentmill.com",
    matchLevel: "High",
    date: "2023-05-08T17:20:00Z"
  },
  {
    id: "8",
    title: "Image used in advertisement on adsite.com",
    url: "https://adsite.com/campaign/spring",
    thumbnail: "https://placehold.co/600x400/png",
    source: "adsite.com",
    matchLevel: "Medium",
    date: "2023-05-07T12:40:00Z"
  },
  {
    id: "9",
    title: "Content repurposed on mediaoutlet.com",
    url: "https://mediaoutlet.com/article/567",
    thumbnail: "https://placehold.co/600x400/png",
    source: "mediaoutlet.com",
    matchLevel: "Medium",
    date: "2023-05-06T08:15:00Z"
  },
  {
    id: "10",
    title: "Image used in product on ecommerce.com",
    url: "https://ecommerce.com/products/item-345",
    thumbnail: "https://placehold.co/600x400/png",
    source: "ecommerce.com",
    matchLevel: "High",
    date: "2023-05-05T15:30:00Z"
  }
];
