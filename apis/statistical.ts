import http from "@/utils/http";

import { Statistical, SuccessResponse } from "@/types/utils";

const STATISTICAL_URI = "/statistical";

const statisticalApis = {
  getStatistical: () => http.get<SuccessResponse<Statistical>>(STATISTICAL_URI),
};

export default statisticalApis;
