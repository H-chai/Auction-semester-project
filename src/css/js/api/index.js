import { API_AUCTION, API_AUTH } from './constants';
import { headers } from './headers';

export default class AuctionAPI {
  static apiAuthBase = API_AUTH;
  static apiAuctionBase = API_AUCTION;

  static paths = {
    register: `${AuctionAPI.apiAuthBase}/register`,
    login: `${AuctionAPI.apiAuthBase}/login`,
    listings: `${AuctionAPI.apiAuctionBase}/listings`,
    profiles: `${AuctionAPI.apiAuctionBase}/profiles`,
  };

  static responseHandler = {
    handleResponse: async (response, errorMessage, output = 'json') => {
      if (response.ok) {
        if (response.status === 204) {
          return null;
        }
        return await response[output]();
      }

      const errorData = await response[output]();
      const errorDetail = errorData.errors[0].message || 'Unknown error';
      throw new Error(`${errorMessage}: ${errorDetail}`);
    },
  };

  auth = {
    register: async ({ name, email, password }) => {
      const body = JSON.stringify({ name, email, password });
      const response = await fetch(AuctionAPI.paths.register, {
        headers: headers(true),
        method: 'POST',
        body,
      });

      const data = await AuctionAPI.responseHandler.handleResponse(
        response,
        'Could not register this account. Please try again.',
      );
      return data;
    },

    login: async () => {},
  };
}
