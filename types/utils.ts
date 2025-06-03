import { PLATFORM_TYPE } from "@/constants";
import { Post } from "./post";

export interface SuccessResponse<Data> {
  data: Data;
  message: string;
}

export interface Statistical {
  postsByPlatform: {
    [key in (typeof PLATFORM_TYPE)[keyof typeof PLATFORM_TYPE]]: number;
  };
  recentPosts: Post[];
  postsByTimeRange: {
    [key: string]: number;
  };
  postByStatusResult: {
    [key: string]: {
      [key: string]: number;
    };
  };
  engagementData: {
    [key: string]: {
      [key: string]: number;
    };
  };
  overallMetrics: {
    totalPosts: number;
    totalEngagements: string;
    scheduledPosts: number;
    averageReach: string;
  };
}
