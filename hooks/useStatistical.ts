import statisticalApis from "@/apis/statistical";
import { useQuery } from "@tanstack/react-query";

export const useStatisticalQuery = () => {
  return useQuery({
    queryKey: ["statistical"],
    queryFn: statisticalApis.getStatistical,
  });
};
