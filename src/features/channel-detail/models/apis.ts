import {
  FetchWithoutAuthStore,
  FetchWithToken,
} from "@/shared/apis/fetchExtended";
import {
  ChannelResponse,
  ChannelCreateRequest,
  ChannelUpdateRequest,
} from "@/shared/generated/oms/types/Channel";

/**
 * SAP 채널 목록 조회
 */
export const getSAPChannelList = async (params: string) => {
  const rawResponse = await FetchWithoutAuthStore(
    `/master-stores/online-stores?${params}`,
    "GET",
  );
  return rawResponse;
};

/**
 * 채널 생성
 */
export const postChannelDetail = async (data: ChannelCreateRequest) => {
  const rawResponse = (await FetchWithToken(
    `/channels`,
    "POST",
    data,
  )) as ChannelResponse;
  return rawResponse;
};

/**
 * 채널 상세 조회
 */
export const getChannelDetail = async (id: string) => {
  const rawResponse = (await FetchWithToken(
    `/channels/${id}`,
    "GET",
  )) as ChannelResponse;

  return rawResponse;
};

/**
 * 채널 수정
 */
export const patchChannelDetail = async ({
  id,
  data,
}: {
  id: string;
  data: ChannelUpdateRequest;
}) => {
  const rawResponse = (await FetchWithToken(
    `/channels/${id}`,
    "PATCH",
    data,
  )) as ChannelResponse;

  return rawResponse;
};
