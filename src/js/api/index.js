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
    search: `${AuctionAPI.apiAuctionBase}/listings/search`,
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

  static set credits(credits) {
    localStorage.setItem('credits', credits);
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
      const profile = await this.profile.getProfile(name);
      const userCredit = profile.data.credits;
      AuctionAPI.credits = userCredit;

      return data;
    },
  };

  profile = {
    getProfile: async (name) => {
      const response = await fetch(`${AuctionAPI.paths.profiles}/${name}`, {
        headers: headers(),
        method: 'GET',
      });
      const data = await AuctionAPI.responseHandler.handleResponse(response);
      return data;
    },

    updateProfile: async (name, { bio, banner, avatar }) => {
      const body = JSON.stringify({ bio, banner, avatar });
      const response = await fetch(`${AuctionAPI.paths.profiles}/${name}`, {
        headers: headers(true),
        method: 'PUT',
        body,
      });
      await AuctionAPI.responseHandler.handleResponse(response);
      window.location.href = `/profile/?name=${name}`;
    },
  };

  listing = {
    get24Listings: async (
      limit = 24,
      page = 1,
      sort = 'created',
      sortOrder = 'desc',
      active = 'true',
    ) => {
      const url = new URL(AuctionAPI.paths.listings);
      url.searchParams.append('limit', limit);
      url.searchParams.append('page', page);
      url.searchParams.append('_seller', true);
      url.searchParams.append('_bids', true);
      url.searchParams.append('_active', active);
      url.searchParams.append('sort', sort);
      url.searchParams.append('sortOrder', sortOrder);

      const response = await fetch(url.toString(), {
        headers: headers(),
        method: 'GET',
      });
      const data = await AuctionAPI.responseHandler.handleResponse(response);

      return data;
    },

    getAllListings: async () => {
      const response = await fetch(AuctionAPI.paths.listings, {
        headers: headers(),
        method: 'GET',
      });
      const data = await AuctionAPI.responseHandler.handleResponse(response);

      return data;
    },

    getSingleListing: async (id) => {
      const url = new URL(`${AuctionAPI.paths.listings}/${id}`);
      url.searchParams.append('_seller', true);
      url.searchParams.append('_bids', true);
      const response = await fetch(url.toString(), {
        headers: headers(),
        method: 'GET',
      });

      const data = await AuctionAPI.responseHandler.handleResponse(response);

      return data;
    },

    getUsersListings: async (
      limit = 24,
      page = 1,
      sort = 'created',
      sortOrder = 'desc',
      active = 'true',
      name,
    ) => {
      const url = new URL(`${AuctionAPI.paths.profiles}/${name}/listings`);
      url.searchParams.append('limit', limit);
      url.searchParams.append('page', page);
      url.searchParams.append('_seller', true);
      url.searchParams.append('_bids', true);
      url.searchParams.append('_active', active);
      url.searchParams.append('sort', sort);
      url.searchParams.append('sortOrder', sortOrder);
      const response = await fetch(url.toString(), {
        headers: headers(),
        method: 'GET',
      });
      const data = await AuctionAPI.responseHandler.handleResponse(response);
      return data;
    },

    create: async ({ title, description, media, endsAt }) => {
      const body = JSON.stringify({ title, description, media, endsAt });
      const response = await fetch(AuctionAPI.paths.listings, {
        headers: headers(true),
        method: 'POST',
        body,
      });
      const { data } =
        await AuctionAPI.responseHandler.handleResponse(response);
      return data;
    },

    update: async (id, { title, description, media }) => {
      const body = JSON.stringify({ title, description, media });
      const response = await fetch(`${AuctionAPI.paths.listings}/${id}`, {
        headers: headers(true),
        method: 'PUT',
        body,
      });
      await AuctionAPI.responseHandler.handleResponse(response);
      window.location.href = `/listing/?id=${id}`;
    },

    delete: async (id) => {
      const response = await fetch(`${AuctionAPI.paths.listings}/${id}`, {
        headers: headers(true),
        method: 'DELETE',
      });
      await AuctionAPI.responseHandler.handleResponse(response);
      const username = localStorage.getItem('username');
      window.location.href = `/profile/?name=${username}`;
    },

    search: async (
      query,
      limit = 24,
      page = 1,
      sort = 'created',
      sortOrder = 'desc',
    ) => {
      const url = new URL(AuctionAPI.paths.search);
      url.searchParams.append('limit', limit);
      url.searchParams.append('page', page);
      url.searchParams.append('sort', sort);
      url.searchParams.append('sortOrder', sortOrder);
      url.searchParams.append('q', query);
      const response = await fetch(url.toString(), {
        headers: headers(true),
        method: 'GET',
      });
      const data = await AuctionAPI.responseHandler.handleResponse(response);
      return data;
    },
  };

  bid = {
    bid: async (id, { amount }) => {
      const body = JSON.stringify({ amount });
      const response = await fetch(`${AuctionAPI.paths.listings}/${id}/bids`, {
        headers: headers(true),
        method: 'POST',
        body,
      });
      const { data } =
        await AuctionAPI.responseHandler.handleResponse(response);
      return data;
    },
  };
}
