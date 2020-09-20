import { URLS } from '../constants/env-constants';
import { HttpProxy } from '../proxies/http-proxy';
import RequestState from '../state/country-req-state';

export default class FetchCountries {
  static async invoke(reqState: RequestState): Promise<void> {
    const countryName = reqState.getCountryName();

    const url = `${URLS.getCountries}${countryName}`;
    const response = await HttpProxy.get(url, {});
    reqState.setCountryListResponse(response.data);
  }
}
