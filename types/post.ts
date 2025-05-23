import { PLATFORM_TYPE } from "@/constants";

export type GetPostsParams = {
  platform: (typeof PLATFORM_TYPE)[keyof typeof PLATFORM_TYPE];
  publicationStartDate?: string;
  publicationEndDate?: string;
};

export type Post = {
  id: string;
  ownerID: string;
  platform: string;
  status: string;
  publicationTime: string;
  socialCredentialID: string;
  socialCredential: {
    metadata: {
      avatar_url: string;
      name: string;
      [key: string]: any;
    };
  };
  publishedPost: any;
  metadata: {
    type: string;
    content: string;
    assets: {
      type: string;
      url: string;
    }[];
    [key: string]: any;
  };
  recurringPostId?: string;
  recurringPost?: any;
};
