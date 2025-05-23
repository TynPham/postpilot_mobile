import { GetPostsParams, Post } from "@/types/post";
import { SuccessResponse } from "@/types/utils";
import http from "@/utils/http";

const POST_URI = "/posts";

const postApis = {
  getPosts(params?: GetPostsParams) {
    return http.get<SuccessResponse<Post[]>>(POST_URI, { params });
  },
};

export default postApis;
