import AuctionAPI from '../api';
import { generateAuthenticatedHeader } from './components/headers/authenticatedHeader';
import { generateListingCard } from './components/listing/listingCard';
import { generateUnAuthenticatedHeader } from './components/headers/unAuthenticatedHeader';
import { getLatestImages } from './components/utils/getLatestImages';

export default class AuctionApp extends AuctionAPI {
  constructor() {
    super();
    this.router();
  }

  async router(pathname = window.location.pathname) {
    switch (pathname) {
      case '/':
        await this.views.listingFeed();
        break;
      case '/auth/register/':
        await this.views.register();
        break;
      case '/auth/login/':
        await this.views.login();
        break;
      case '/listing/':
        await this.views.listing();
        break;
      case '/listing/create/':
        await this.views.listingCreate();
        break;
      case '/listing/update/':
        await this.views.listingUpdate();
        break;
      case '/profile/':
        await this.views.profile();
        break;
      case '/profile/update/':
        await this.views.profileUpdate();
        break;
    }
  }

  static form = {
    formSubmit(event) {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      return Object.fromEntries(formData.entries());
    },
  };

  views = {
    listingFeed: async () => {
      this.events.headerToggle();
      this.events.imageSlider();
      this.events.displayListings();
      this.filtering.openSorting();
    },

    register: async () => {
      const form = document.forms['signup'];
      form.addEventListener('submit', this.events.register);
    },

    login: async () => {
      const form = document.forms['login'];
      form.addEventListener('submit', this.events.login);
    },

    listing: async () => {
      this.events.headerToggle();
    },

    listingCreate: async () => {},

    listingUpdate: async () => {},

    profile: async () => {},

    profileUpdate: async () => {},
  };

  events = {
    register: async (event) => {
      const data = AuctionApp.form.formSubmit(event);
      const { name, email } = data;
      try {
        await this.auth.register(data);
        alert(
          `Thank you for registering!\nUsername: ${name}\nEmail: ${email}\nYou've received 1000 credits to get started.`,
        );
        window.location.href = '/auth/login/';
      } catch (error) {
        alert(
          `Could not register this account.\n${error.message}.\nPlease try again.`,
        );
      }
    },

    login: async (event) => {
      const data = AuctionApp.form.formSubmit(event);
      try {
        await this.auth.login(data);
        alert('You have successfully logged in!');
        window.location.href = '/';
      } catch (error) {
        alert(
          `Could not log in with this account.\n${error.message}.\nPlease try again.`,
        );
      }
    },

    headerToggle: () => {
      const isLoggedIn = localStorage.getItem('token');
      const header = document.querySelector('header');

      if (isLoggedIn) {
        const authenticatedHeader = generateAuthenticatedHeader();
        header.appendChild(authenticatedHeader);
      } else {
        const unAuthenticatedHeader = generateUnAuthenticatedHeader();
        header.appendChild(unAuthenticatedHeader);
      }
    },

    displayListings: async (page = 1, sort = 'created', sortOrder = 'desc') => {
      try {
        const listings = await this.listing.get24Listings(
          24,
          page,
          sort,
          sortOrder,
        );
        const { data } = listings;
        const listingsContainer = document.querySelector('.listings-container');
        listingsContainer.innerHTML = '';
        data.forEach((listing) => {
          const listingCard = generateListingCard(listing);
          listingsContainer.appendChild(listingCard);
        });
      } catch (error) {
        alert(error.message);
      }
    },

    imageSlider: () => {
      const imageSliderContainer = document.querySelector(
        '.image-slider-container',
      );
      imageSliderContainer.innerHTML = '';
      const latestURLs = getLatestImages();
      console.log(latestURLs);
      for (let i = 0; i < 3; i++) {
        const img = document.createElement('img');
        img.src = latestURLs[i];
        img.classList.add(
          `img-${i}`,
          'absolute',
          'top-0',
          'bottom-0',
          'right-0',
          'left-0',
          'm-auto',
          'h-full',
          'opacity-0',
          'md:object-contain',
        );
        imageSliderContainer.appendChild(img);
      }
    },
  };

  filtering = {
    openSorting: () => {
      const sortBy = document.querySelector('.sort-by');
      const sortOptions = document.querySelector('.sorting-list');
      sortBy.addEventListener('click', () => {
        if (sortOptions.classList.contains('hidden')) {
          sortOptions.classList.toggle('hidden');
        } else {
          sortOptions.classList.add('hidden');
        }
      });
      const labels = document.querySelectorAll('.sorting-list label');
      [...labels].forEach((item) => {
        item.addEventListener('click', () => {
          sortOptions.classList.add('hidden');
        });
      });

      this.filtering.descending();
      this.filtering.ascending();
      this.filtering.endingSoon();
      this.filtering.resentUpdate();
    },

    descending: () => {
      const oldestButton = document.getElementById('newest');
      oldestButton.addEventListener('click', () => {
        this.events.displayListings(1, 'created', 'desc');
      });
    },

    ascending: () => {
      const oldestButton = document.getElementById('oldest');
      oldestButton.addEventListener('click', () => {
        this.events.displayListings(1, 'created', 'asc');
      });
    },

    endingSoon: () => {
      const oldestButton = document.getElementById('endingSoon');
      oldestButton.addEventListener('click', () => {
        this.events.displayListings(1, 'endsAt', 'asc');
      });
    },

    resentUpdate: () => {
      const oldestButton = document.getElementById('updated');
      oldestButton.addEventListener('click', () => {
        this.events.displayListings(1, 'updated', 'desc');
      });
    },
  };
}
