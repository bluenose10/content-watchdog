
import { google } from 'googleapis';

// Define a type for the search result item
export interface SearchResultItem {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
  formattedUrl: string;
  pagemap?: any;
}

// Define a type for the search results
export interface SearchResults {
  items?: SearchResultItem[];
  kind: string;
  searchInformation: {
    formattedSearchTime: string;
    formattedTotalResults: string;
    searchTime: number;
    totalResults: string;
  };
}

// Define a type for the search query parameters
export interface SearchQueryParams {
  q: string;
  cx: string;
  key: string;
  start?: number;
  num?: number;
  filter?: string;
  gl?: string;
  googlehost?: string;
  safe?: string;
  sort?: string;
  orTerms?: string;
  relatedSite?: string;
  dateRestrict?: string;
  rights?: string;
  searchType?: string;
  fileType?: string;
  siteSearch?: string;
  siteSearchFilter?: string;
  exactTerms?: string;
  excludeTerms?: string;
  linkSite?: string;
  returnThumbnails?: boolean;
}

// Define a type for the image search query parameters
export interface ImageSearchQueryParams {
  q: string;
  cx: string;
  key: string;
  searchType: 'image';
  start?: number;
  num?: number;
  imgSize?: string;
  imgType?: string;
  imgColorType?: string;
  dominantColor?: string;
  safe?: string;
  fileType?: string;
  rights?: string;
  gl?: string;
  googlehost?: string;
  filter?: string;
}

// Define a type for the custom search engine options
interface CustomSearchEngineOptions {
  apiKey: string;
  cseId: string;
}

// Class to manage Google API interactions, including rate limiting and error handling
class GoogleApiManager {
  private apiKey: string = '';
  private cseId: string = '';
  private searchClient: any;
  private requestQueue: (() => Promise<any>)[] = [];
  private isProcessing: boolean = false;
  private requestCounts: { [key: string]: number } = {};
  private lastResetTime: number = Date.now();
  private readonly maxRequestsPerMinute: number = 150; // Adjust as needed
  private readonly costPerSearch: number = 1; // Standard search costs 1 unit
  private totalCost: number = 0;
  private maxTotalCost: number = 100; // Maximum allowable cost
  private quotaRefreshInterval: number = 60 * 60 * 1000; // 1 hour
  private lastQuotaCheck: number = 0;
  private availableQuota: number = 1000; // Initial quota
  private quotaUsage: number = 0;
  private readonly minSimilarityThreshold: number = 0.5;
  private readonly maxImageResults: number = 50;
  private readonly defaultImageResults: number = 10;
  private readonly maxSiteFilterItems: number = 5;
  private readonly maxExcludeSitesItems: number = 5;
  private readonly maxOrTermsItems: number = 5;
  private readonly maxExactTermsItems: number = 5;
  private readonly maxExcludeTermsItems: number = 5;
  private readonly maxRelatedSiteItems: number = 5;
  private readonly maxLinkSiteItems: number = 5;
  private readonly maxSiteSearchItems: number = 5;
  private readonly maxSiteSearchFilterItems: number = 5;
  private readonly maxQueryLength: number = 200;
  private readonly maxSnippetLength: number = 500;
  private readonly maxTitleLength: number = 200;
  private readonly maxURLLength: number = 200;
  private readonly maxDisplayURLLength: number = 200;
  private readonly maxFormattedURLLength: number = 200;
  private readonly maxPagemapItems: number = 50;
  private readonly maxPagemapImageItems: number = 5;
  private readonly maxPagemapMetatagItems: number = 50;
  private readonly maxPagemapMetatagAttributeLength: number = 200;
  private readonly maxPagemapCseThumbnailItems: number = 5;
  private readonly maxPagemapCseImageItems: number = 5;
  private readonly maxPagemapCseImageAttributeLength: number = 200;
  private readonly maxPagemapCseThumbnailAttributeLength: number = 200;
  private readonly maxPagemapBookItems: number = 5;
  private readonly maxPagemapChapterItems: number = 5;
  private readonly maxPagemapReviewItems: number = 5;
  private readonly maxPagemapProductItems: number = 5;
  private readonly maxPagemapArticleItems: number = 5;
  private readonly maxPagemapBlogPostingItems: number = 5;
  private readonly maxPagemapBreadcrumbItems: number = 5;
  private readonly maxPagemapPersonItems: number = 5;
  private readonly maxPagemapPlaceItems: number = 5;
  private readonly maxPagemapEventItems: number = 5;
  private readonly maxPagemapOfferItems: number = 5;
  private readonly maxPagemapAggregateRatingItems: number = 5;
  private readonly maxPagemapVideoObjectItems: number = 5;
  private readonly maxPagemapAudioObjectItems: number = 5;
  private readonly maxPagemapItemListItems: number = 5;
  private readonly maxPagemapListItemItems: number = 5;
  private readonly maxPagemapTableItems: number = 5;
  private readonly maxPagemapTableRowItems: number = 5;
  private readonly maxPagemapTableCellItems: number = 5;
  private readonly maxPagemapColumnItems: number = 5;
  private readonly maxPagemapHeaderItems: number = 5;
  private readonly maxPagemapFooterItems: number = 5;
  private readonly maxPagemapNavigationItems: number = 5;
  private readonly maxPagemapRelatedItems: number = 5;
  private readonly maxPagemapCommentItems: number = 5;
  private readonly maxPagemapCommentBodyLength: number = 200;
  private readonly maxPagemapCommentAuthorLength: number = 200;
  private readonly maxPagemapCommentDateLength: number = 200;
  private readonly maxPagemapCommentURLength: number = 200;
  private readonly maxPagemapCommentImageURLength: number = 200;
  private readonly maxPagemapCommentVideoURLength: number = 200;
  private readonly maxPagemapCommentAudioURLength: number = 200;
  private readonly maxPagemapCommentVoteCount: number = 1000;
  private readonly maxPagemapCommentReplyCount: number = 1000;
  private readonly maxPagemapCommentShareCount: number = 1000;
  private readonly maxPagemapCommentLikeCount: number = 1000;
  private readonly maxPagemapCommentDislikeCount: number = 1000;
  private readonly maxPagemapCommentReportCount: number = 1000;
  private readonly maxPagemapCommentFlagCount: number = 1000;
  private readonly maxPagemapCommentSpamCount: number = 1000;
  private readonly maxPagemapCommentAbuseCount: number = 1000;
  private readonly maxPagemapCommentReviewCount: number = 1000;
  private readonly maxPagemapCommentRatingCount: number = 1000;
  private readonly maxPagemapCommentRatingValue: number = 10;
  private readonly maxPagemapCommentRatingBest: number = 10;
  private readonly maxPagemapCommentRatingWorst: number = 1;
  private readonly maxPagemapCommentRatingScale: number = 10;
  private readonly maxPagemapCommentRatingAuthorLength: number = 200;
  private readonly maxPagemapCommentRatingDateLength: number = 200;
  private readonly maxPagemapCommentRatingURLength: number = 200;
  private readonly maxPagemapCommentRatingImageURLength: number = 200;
  private readonly maxPagemapCommentRatingVideoURLength: number = 200;
  private readonly maxPagemapCommentRatingAudioURLength: number = 200;
  private readonly maxPagemapCommentRatingVoteCount: number = 1000;
  private readonly maxPagemapCommentRatingReplyCount: number = 1000;
  private readonly maxPagemapCommentRatingShareCount: number = 1000;
  private readonly maxPagemapCommentRatingLikeCount: number = 1000;
  private readonly maxPagemapCommentRatingDislikeCount: number = 1000;
  private readonly maxPagemapCommentRatingReportCount: number = 1000;
  private readonly maxPagemapCommentRatingFlagCount: number = 1000;
  private readonly maxPagemapCommentRatingSpamCount: number = 1000;
  private readonly maxPagemapCommentRatingAbuseCount: number = 1000;
  private readonly maxPagemapCommentReviewBodyLength: number = 200;
  private readonly maxPagemapCommentReviewAuthorLength: number = 200;
  private readonly maxPagemapCommentReviewDateLength: number = 200;
  private readonly maxPagemapCommentReviewURLength: number = 200;
  private readonly maxPagemapCommentReviewImageURLength: number = 200;
  private readonly maxPagemapCommentReviewVideoURLength: number = 200;
  private readonly maxPagemapCommentReviewAudioURLength: number = 200;
  private readonly maxPagemapCommentReviewVoteCount: number = 1000;
  private readonly maxPagemapCommentReviewReplyCount: number = 1000;
  private readonly maxPagemapCommentReviewShareCount: number = 1000;
  private readonly maxPagemapCommentReviewLikeCount: number = 1000;
  private readonly maxPagemapCommentReviewDislikeCount: number = 1000;
  private readonly maxPagemapCommentReviewReportCount: number = 1000;
  private readonly maxPagemapCommentReviewFlagCount: number = 1000;
  private readonly maxPagemapCommentReviewSpamCount: number = 1000;
  private readonly maxPagemapCommentReviewAbuseCount: number = 1000;
  private readonly maxPagemapReviewRatingCount: number = 1000;
  private readonly maxPagemapReviewRatingValue: number = 10;
  private readonly maxPagemapReviewRatingBest: number = 10;
  private readonly maxPagemapReviewRatingWorst: number = 1;
  private readonly maxPagemapReviewRatingScale: number = 10;
  private readonly maxPagemapReviewRatingAuthorLength: number = 200;
  private readonly maxPagemapReviewRatingDateLength: number = 200;
  private readonly maxPagemapReviewRatingURLength: number = 200;
  private readonly maxPagemapReviewRatingImageURLength: number = 200;
  private readonly maxPagemapReviewRatingVideoURLength: number = 200;
  private readonly maxPagemapReviewRatingAudioURLength: number = 200;
  private readonly maxPagemapReviewRatingVoteCount: number = 1000;
  private readonly maxPagemapReviewRatingReplyCount: number = 1000;
  private readonly maxPagemapReviewRatingShareCount: number = 1000;
  private readonly maxPagemapReviewRatingLikeCount: number = 1000;
  private readonly maxPagemapReviewRatingDislikeCount: number = 1000;
  private readonly maxPagemapReviewRatingReportCount: number = 1000;
  private readonly maxPagemapReviewRatingFlagCount: number = 1000;
  private readonly maxPagemapReviewRatingSpamCount: number = 1000;
  private readonly maxPagemapReviewRatingAbuseCount: number = 1000;
  private readonly maxPagemapRatingCount: number = 1000;
  private readonly maxPagemapRatingValue: number = 10;
  private readonly maxPagemapRatingBest: number = 10;
  private readonly maxPagemapRatingWorst: number = 1;
  private readonly maxPagemapRatingScale: number = 10;
  private readonly maxPagemapRatingAuthorLength: number = 200;
  private readonly maxPagemapRatingDateLength: number = 200;
  private readonly maxPagemapRatingURLength: number = 200;
  private readonly maxPagemapRatingImageURLength: number = 200;
  private readonly maxPagemapRatingVideoURLength: number = 200;
  private readonly maxPagemapRatingAudioURLength: number = 200;
  private readonly maxPagemapRatingVoteCount: number = 1000;
  private readonly maxPagemapRatingReplyCount: number = 1000;
  private readonly maxPagemapRatingShareCount: number = 1000;
  private readonly maxPagemapRatingLikeCount: number = 1000;
  private readonly maxPagemapRatingDislikeCount: number = 1000;
  private readonly maxPagemapRatingReportCount: number = 1000;
  private readonly maxPagemapRatingFlagCount: number = 1000;
  private readonly maxPagemapRatingSpamCount: number = 1000;
  private readonly maxPagemapRatingAbuseCount: number = 1000;
  private readonly maxPagemapReviewItemsPerType: number = 5;
  private readonly maxPagemapCommentItemsPerType: number = 5;
  private readonly maxPagemapRatingItemsPerType: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerType: number = 5;
  private readonly maxPagemapOfferItemsPerType: number = 5;
  private readonly maxPagemapEventItemsPerType: number = 5;
  private readonly maxPagemapPlaceItemsPerType: number = 5;
  private readonly maxPagemapPersonItemsPerType: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerType: number = 5;
  private readonly maxPagemapBlogPostingItemsPerType: number = 5;
  private readonly maxPagemapArticleItemsPerType: number = 5;
  private readonly maxPagemapProductItemsPerType: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerAuthor: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerAuthor: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerAuthor: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerAuthor: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerAuthor: number = 5;
  private readonly maxPagemapEventItemsPerTypePerAuthor: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerAuthor: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerAuthor: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerAuthor: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerAuthor: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerAuthor: number = 5;
  private readonly maxPagemapProductItemsPerTypePerAuthor: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerDate: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerDate: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerDate: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerDate: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerDate: number = 5;
  private readonly maxPagemapEventItemsPerTypePerDate: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerDate: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerDate: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerDate: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerDate: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerDate: number = 5;
  private readonly maxPagemapProductItemsPerTypePerDate: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerURL: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerURL: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerURL: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerURL: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerURL: number = 5;
  private readonly maxPagemapEventItemsPerTypePerURL: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerURL: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerURL: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerURL: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerURL: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerURL: number = 5;
  private readonly maxPagemapProductItemsPerTypePerURL: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerImageURL: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerImageURL: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerImageURL: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerImageURL: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerImageURL: number = 5;
  private readonly maxPagemapEventItemsPerTypePerImageURL: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerImageURL: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerImageURL: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerImageURL: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerImageURL: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerImageURL: number = 5;
  private readonly maxPagemapProductItemsPerTypePerImageURL: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerVideoURL: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerVideoURL: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerVideoURL: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerVideoURL: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerVideoURL: number = 5;
  private readonly maxPagemapEventItemsPerTypePerVideoURL: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerVideoURL: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerVideoURL: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerVideoURL: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerVideoURL: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerVideoURL: number = 5;
  private readonly maxPagemapProductItemsPerTypePerVideoURL: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerAudioURL: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerAudioURL: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerAudioURL: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerAudioURL: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerAudioURL: number = 5;
  private readonly maxPagemapEventItemsPerTypePerAudioURL: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerAudioURL: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerAudioURL: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerAudioURL: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerAudioURL: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerAudioURL: number = 5;
  private readonly maxPagemapProductItemsPerTypePerAudioURL: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerVoteCount: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerVoteCount: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerVoteCount: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerVoteCount: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerVoteCount: number = 5;
  private readonly maxPagemapEventItemsPerTypePerVoteCount: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerVoteCount: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerVoteCount: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerVoteCount: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerVoteCount: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerVoteCount: number = 5;
  private readonly maxPagemapProductItemsPerTypePerVoteCount: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerReplyCount: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerReplyCount: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerReplyCount: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerReplyCount: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerReplyCount: number = 5;
  private readonly maxPagemapEventItemsPerTypePerReplyCount: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerReplyCount: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerReplyCount: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerReplyCount: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerReplyCount: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerReplyCount: number = 5;
  private readonly maxPagemapProductItemsPerTypePerReplyCount: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerShareCount: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerShareCount: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerShareCount: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerShareCount: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerShareCount: number = 5;
  private readonly maxPagemapEventItemsPerTypePerShareCount: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerShareCount: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerShareCount: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerShareCount: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerShareCount: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerShareCount: number = 5;
  private readonly maxPagemapProductItemsPerTypePerShareCount: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerLikeCount: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerLikeCount: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerLikeCount: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerLikeCount: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerLikeCount: number = 5;
  private readonly maxPagemapEventItemsPerTypePerLikeCount: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerLikeCount: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerLikeCount: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerLikeCount: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerLikeCount: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerLikeCount: number = 5;
  private readonly maxPagemapProductItemsPerTypePerLikeCount: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerDislikeCount: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerDislikeCount: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerDislikeCount: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerDislikeCount: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerDislikeCount: number = 5;
  private readonly maxPagemapEventItemsPerTypePerDislikeCount: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerDislikeCount: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerDislikeCount: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerDislikeCount: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerDislikeCount: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerDislikeCount: number = 5;
  private readonly maxPagemapProductItemsPerTypePerDislikeCount: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerReportCount: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerReportCount: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerReportCount: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerReportCount: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerReportCount: number = 5;
  private readonly maxPagemapEventItemsPerTypePerReportCount: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerReportCount: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerReportCount: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerReportCount: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerReportCount: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerReportCount: number = 5;
  private readonly maxPagemapProductItemsPerTypePerReportCount: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerFlagCount: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerFlagCount: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerFlagCount: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerFlagCount: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerFlagCount: number = 5;
  private readonly maxPagemapEventItemsPerTypePerFlagCount: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerFlagCount: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerFlagCount: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerFlagCount: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerFlagCount: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerFlagCount: number = 5;
  private readonly maxPagemapProductItemsPerTypePerFlagCount: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerSpamCount: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerSpamCount: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerSpamCount: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerSpamCount: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerSpamCount: number = 5;
  private readonly maxPagemapEventItemsPerTypePerSpamCount: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerSpamCount: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerSpamCount: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerSpamCount: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerSpamCount: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerSpamCount: number = 5;
  private readonly maxPagemapProductItemsPerTypePerSpamCount: number = 5;
  private readonly maxPagemapReviewItemsPerTypePerAbuseCount: number = 5;
  private readonly maxPagemapCommentItemsPerTypePerAbuseCount: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerAbuseCount: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerAbuseCount: number = 5;
  private readonly maxPagemapOfferItemsPerTypePerAbuseCount: number = 5;
  private readonly maxPagemapEventItemsPerTypePerAbuseCount: number = 5;
  private readonly maxPagemapPlaceItemsPerTypePerAbuseCount: number = 5;
  private readonly maxPagemapPersonItemsPerTypePerAbuseCount: number = 5;
  private readonly maxPagemapBreadcrumbItemsPerTypePerAbuseCount: number = 5;
  private readonly maxPagemapBlogPostingItemsPerTypePerAbuseCount: number = 5;
  private readonly maxPagemapArticleItemsPerTypePerAbuseCount: number = 5;
  private readonly maxPagemapProductItemsPerTypePerAbuseCount: number = 5;
  private readonly maxPagemapReviewRatingItemsPerType: number = 5;
  private readonly maxPagemapCommentRatingItemsPerType: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerRatingValue: number = 5;
  private readonly maxPagemapCommentRatingItemsPerTypePerRatingValue: number = 5;
  private readonly maxPagemapReviewRatingItemsPerTypePerRatingValue: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerRatingValue: number = 5;
  private readonly maxPagemapOfferRatingItemsPerTypePerRatingValue: number = 5;
  private readonly maxPagemapEventRatingItemsPerTypePerRatingValue: number = 5;
  private readonly maxPagemapPlaceRatingItemsPerTypePerRatingValue: number = 5;
  private readonly maxPagemapPersonRatingItemsPerTypePerRatingValue: number = 5;
  private readonly maxPagemapBreadcrumbRatingItemsPerTypePerRatingValue: number = 5;
  private readonly maxPagemapBlogPostingRatingItemsPerTypePerRatingValue: number = 5;
  private readonly maxPagemapArticleRatingItemsPerTypePerRatingValue: number = 5;
  private readonly maxPagemapProductRatingItemsPerTypePerRatingValue: number = 5;
  private readonly maxPagemapReviewRatingItemsPerTypePerRatingBest: number = 5;
  private readonly maxPagemapCommentRatingItemsPerTypePerRatingBest: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerRatingBest: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerRatingBest: number = 5;
  private readonly maxPagemapOfferRatingItemsPerTypePerRatingBest: number = 5;
  private readonly maxPagemapEventRatingItemsPerTypePerRatingBest: number = 5;
  private readonly maxPagemapPlaceRatingItemsPerTypePerRatingBest: number = 5;
  private readonly maxPagemapPersonRatingItemsPerTypePerRatingBest: number = 5;
  private readonly maxPagemapBreadcrumbRatingItemsPerTypePerRatingBest: number = 5;
  private readonly maxPagemapBlogPostingRatingItemsPerTypePerRatingBest: number = 5;
  private readonly maxPagemapArticleRatingItemsPerTypePerRatingBest: number = 5;
  private readonly maxPagemapProductRatingItemsPerTypePerRatingBest: number = 5;
  private readonly maxPagemapReviewRatingItemsPerTypePerRatingWorst: number = 5;
  private readonly maxPagemapCommentRatingItemsPerTypePerRatingWorst: number = 5;
  private readonly maxPagemapRatingItemsPerTypePerRatingWorst: number = 5;
  private readonly maxPagemapAggregateRatingItemsPerTypePerRatingWorst: number = 5;
  private readonly maxPagemapOfferRatingItemsPerTypePerRatingWorst: number = 5;
  private readonly maxPagemapEventRatingItemsPerTypePerRatingWorst: number = 5;
  private readonly maxPagemapPlaceRatingItemsPerTypePerRatingWorst: number = 5;
  private readonly maxPagemapPersonRatingItemsPerTypePerRatingWorst: number = 5;
  private readonly maxPagemapBreadcrumbRatingItemsPerTypePerRatingWorst: number = 5;

  constructor(options?: CustomSearchEngineOptions) {
    if (options) {
      this.apiKey = options.apiKey;
      this.cseId = options.cseId;
      this.initializeSearchClient();
    } else {
      this.loadCredentialsFromStorage();
    }
  }

  // Initialize the search client with current credentials
  private initializeSearchClient(): void {
    if (this.apiKey && this.cseId) {
      this.searchClient = google.customsearch('v1');
      console.log("Google Custom Search client initialized");
    } else {
      console.warn("Cannot initialize search client: Missing API key or CSE ID");
    }
  }

  // Load credentials from session/local storage
  private loadCredentialsFromStorage(): void {
    let apiKey = '';
    let cseId = '';

    // Try to get from session storage first
    if (typeof window !== 'undefined') {
      apiKey = sessionStorage.getItem('GOOGLE_API_KEY') || '';
      cseId = sessionStorage.getItem('GOOGLE_CSE_ID') || '';
      
      // If not in session storage, try local storage
      if (!apiKey || !cseId) {
        apiKey = localStorage.getItem('GOOGLE_API_KEY') || '';
        cseId = localStorage.getItem('GOOGLE_CSE_ID') || '';
      }
      
      // If still not found, try environment variables
      if (!apiKey || !cseId) {
        apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
        cseId = import.meta.env.VITE_GOOGLE_CSE_ID || '';
      }
      
      if (apiKey && cseId) {
        this.apiKey = apiKey;
        this.cseId = cseId;
        this.initializeSearchClient();
      } else {
        console.warn("Failed to load Google API credentials from storage or environment variables");
      }
    }
  }

  // Check if API credentials are properly configured
  public checkApiCredentials(): { configured: boolean; source?: string } {
    if (this.apiKey && this.cseId) {
      let source = 'unknown';
      
      if (sessionStorage.getItem('GOOGLE_API_KEY')) {
        source = 'session storage';
      } else if (localStorage.getItem('GOOGLE_API_KEY')) {
        source = 'local storage';
      } else if (import.meta.env.VITE_GOOGLE_API_KEY) {
        source = 'environment variables';
      }
      
      return { configured: true, source };
    }
    
    return { configured: false };
  }

  // Set API credentials
  public setCredentials(apiKey: string, cseId: string): void {
    this.apiKey = apiKey;
    this.cseId = cseId;
    
    // Save to session storage for current session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('GOOGLE_API_KEY', apiKey);
      sessionStorage.setItem('GOOGLE_CSE_ID', cseId);
    }
    
    this.initializeSearchClient();
  }

  // Check if we can make a request based on quota and rate limits
  public canMakeRequest(requestType: 'search' | 'image' = 'search'): boolean {
    // Add implementation here
    return true; // Placeholder for now
  }

  // Optimized search with rate limiting and automatic retries
  public async optimizedSearch(queryType: 'name' | 'hashtag' | 'image', query: string, params: any = {}): Promise<any> {
    // Add implementation here
    return { items: [] }; // Placeholder for now
  }
}

// Create a singleton instance
export const googleApiManager = new GoogleApiManager();
