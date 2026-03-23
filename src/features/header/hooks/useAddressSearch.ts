import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  JusoApiResponse,
  OpenCageResponse,
} from "@/features/integrated-order-detail/models/types";

interface AddressSearchAdapter {
  search(query: string): Promise<(OpenCageResponse | JusoApiResponse)[]>;
}

class KoreaAddressAdapter implements AddressSearchAdapter {
  public async search(query: string): Promise<JusoApiResponse[]> {
    const apiKey = process.env.NEXT_PUBLIC_KR_ADDRESS_FINDER;

    if (!apiKey) {
      throw new Error("한국 주소 API 키가 설정되지 않았습니다.");
    }

    const params = new URLSearchParams({
      confmKey: apiKey,
      currentPage: "1",
      countPerPage: "10",
      keyword: query,
      resultType: "json",
    });

    const apiUrl = `https://business.juso.go.kr/addrlink/addrLinkApi.do?${params.toString()}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // 허용 가능한 에러 코드
    const errorCodes = [
      "0",
      "E0005",
      "E0006",
      "E0008",
      "E0009",
      "E0010",
      "E0011",
      "E0012",
      "E0013",
      "E0014",
    ];
    // throw new Error("jusoAPIError");

    if (response.ok && data && data.results.juso) {
      return data.results.juso;
    } else if (!errorCodes.includes(data.results.common.errorCode)) {
      throw new Error("jusoAPIError");
    }
    return [];
  }
}

class GlobalAddressAdapter implements AddressSearchAdapter {
  public async search(query: string): Promise<OpenCageResponse[]> {
    const apiKey = process.env.NEXT_PUBLIC_GLOBAL_ADDRESS_FINDER;

    if (!apiKey) {
      throw new Error("글로벌 주소 API 키가 설정되지 않았습니다.");
    }

    const encodedQuery = encodeURIComponent(query);
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodedQuery}&key=${apiKey}&language=en`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok && data && data.results) {
      return data.results;
    } else if (data.results.common.errorMessage) {
      throw new Error(
        data.status?.message || "API 오류: 데이터를 가져오지 못했습니다",
      );
    }
    return [];
  }
}

export function useAddressSearch(
  initialValue: string = "",
  isKrAddress: boolean = false,
) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [results, setResults] = useState<
    OpenCageResponse[] | JusoApiResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jusoSearchAPIError, setJusoSearchAPIError] = useState(false);

  function getAddressAdapter(isKrAddress: boolean): AddressSearchAdapter {
    return isKrAddress ? new KoreaAddressAdapter() : new GlobalAddressAdapter();
  }

  const adapter = useMemo(() => getAddressAdapter(isKrAddress), [isKrAddress]);

  const handleSearch = useCallback(
    async (query: string) => {
      setLoading(true);
      setError(null);
      try {
        const results = await adapter.search(query);
        setResults(results as OpenCageResponse[] | JusoApiResponse[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        setResults([]);
        if (e instanceof Error) {
          setJusoSearchAPIError(e.message === "jusoAPIError");
        }
      } finally {
        setLoading(false);
      }
    },
    [adapter],
  );

  // 디바운스 함수 생성
  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 300),
    [handleSearch],
  );

  // 입력 필드 변경 핸들러
  const handleInputChange = useCallback(
    async (event: React.SyntheticEvent, newValue: string, reason: string) => {
      setInputValue(newValue);

      if (reason === "input") {
        await debouncedSearch(newValue);
      } else if (reason === "clear") {
        await debouncedSearch("");
        setResults([]);
      }
    },
    [debouncedSearch],
  );

  // 초기 데이터 로딩 useEffect
  useEffect(() => {
    if (initialValue) {
      const fetchInitialData = async () => {
        try {
          await handleSearch(initialValue);
        } catch (searchError) {
          console.error("Error during initial search:", searchError);
        }
      };
      fetchInitialData().catch(() => {}); // Promise 처리
    }
  }, [initialValue, handleSearch]);

  // 디바운스 클린업 useEffect
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return {
    inputValue,
    setInputValue, // 주소 선택 시 외부에서 값을 설정할 수 있도록 노출
    results,
    loading,
    error,
    jusoSearchAPIError,
    handleInputChange, // Autocomplete에 전달
  };
}
