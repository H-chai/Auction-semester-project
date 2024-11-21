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

  static set token(accessToken) {
    localStorage.setItem('token', accessToken);
  }

  static set username(user) {
    localStorage.setItem('username', user);
  }

  auth = {
    register: async ({ name, email, password }) => {
      const body = JSON.stringify({ name, email, password });
      const response = await fetch(AuctionAPI.paths.register, {
        headers: headers(true),
        method: 'POST',
        body,
      });
      const data = await AuctionAPI.responseHandler.handleResponse(response);

      return data;
    },

    login: async ({ email, password }) => {
      const body = JSON.stringify({ email, password });
      const response = await fetch(AuctionAPI.paths.login, {
        headers: headers(true),
        method: 'POST',
        body,
      });
      const { data } =
        await AuctionAPI.responseHandler.handleResponse(response);
      const { accessToken: token, name: name } = data;
      AuctionAPI.token = token;
      AuctionAPI.username = name;

      return data;
    },
  };

  profile = {
    getUserName: () => {
      try {
        return JSON.parse(localStorage.getItem('username'));
      } catch (error) {
        return error;
      }
    },

    getProfile: async function getProfile(name) {
      const response = await fetch(`${AuctionAPI.paths.profiles}/${name}`, {
        headers: headers(true),
        method: 'GET',
      });
      const data = await AuctionAPI.responseHandler.handleResponse(response);
      return data;
    },
  };

  listing = {
    getListings: async (limit = 24, page = 1) => {
      const url = new URL(AuctionAPI.paths.listings);
      url.searchParams.append('limit', limit);
      url.searchParams.append('page', page);
      url.searchParams.append('_seller', true);
      url.searchParams.append('_bids', true);

      const response = await fetch(url.toString(), {
        headers: headers(),
        method: 'GET',
      });
      const data = await AuctionAPI.responseHandler.handleResponse(response);

      return data;
    },
  };
}
