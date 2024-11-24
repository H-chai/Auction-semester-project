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
      this.filtering.openFilter();
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

    displayListings: async (
      page = 1,
      sort = 'created',
      sortOrder = 'desc',
      active = true,
    ) => {
      try {
        const listings = await this.listing.get24Listings(
          24,
          page,
          sort,
          sortOrder,
          active,
        );
        const { data } = listings;
        console.log(data);
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
    currentSortBy: 'created',
    currentSortOrder: 'desc',
    currentFilter: true,

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

    removeCheckedAttribute: () => {
      const checkBoxes = document.getElementsByName('sort');
      checkBoxes.forEach((input) => {
        input.removeAttribute('checked');
      });
    },

    descending: () => {
      const newestButton = document.getElementById('newest');
      newestButton.addEventListener('click', () => {
        this.filtering.removeCheckedAttribute();
        this.events.displayListings(
          1,
          this.filtering.currentSortBy,
          this.filtering.currentSortOrder,
          this.filtering.currentFilter,
        );
        newestButton.setAttribute('checked', 'checked');
      });
    },

    ascending: () => {
      const oldestButton = document.getElementById('oldest');
      oldestButton.addEventListener('click', () => {
        this.filtering.removeCheckedAttribute();
        this.filtering.currentSortOrder = 'asc';
        this.events.displayListings(
          1,
          this.filtering.currentSortBy,
          this.filtering.currentSortOrder,
          this.filtering.currentFilter,
        );
        oldestButton.setAttribute('checked', 'checked');
      });
    },

    endingSoon: () => {
      const endingSoonButton = document.getElementById('endingSoon');
      endingSoonButton.addEventListener('click', () => {
        this.filtering.removeCheckedAttribute();
        this.filtering.currentSortBy = 'endsAt';
        this.filtering.currentSortOrder = 'asc';
        this.events.displayListings(
          1,
          this.filtering.currentSortBy,
          this.filtering.currentSortOrder,
          this.filtering.currentFilter,
        );
        endingSoonButton.setAttribute('checked', 'checked');
      });
    },

    resentUpdate: () => {
      const resentUpdateButton = document.getElementById('updated');
      resentUpdateButton.addEventListener('click', () => {
        this.filtering.removeCheckedAttribute();
        this.filtering.currentSortBy = 'updated';
        this.filtering.currentSortOrder = 'desc';
        this.events.displayListings(
          1,
          this.filtering.currentSortBy,
          this.filtering.currentSortOrder,
          this.filtering.currentFilter,
        );
        resentUpdateButton.setAttribute('checked', 'checked');
      });
    },

    openFilter: () => {
      const filterBy = document.querySelector('.filter-by');
      const filterOptions = document.querySelector('.filtering-list');
      filterBy.addEventListener('click', () => {
        if (filterOptions.classList.contains('hidden')) {
          filterOptions.classList.toggle('hidden');
        } else {
          filterOptions.classList.add('hidden');
        }
      });
      const labels = document.querySelectorAll('.filtering-list label');
      [...labels].forEach((item) => {
        item.addEventListener('click', () => {
          filterOptions.classList.add('hidden');
        });
      });

      this.filtering.showAll();
      this.filtering.showActive();
    },

    showAll: () => {
      const showAll = document.getElementById('showAll');
      const showActive = document.getElementById('showActive');
      showAll.addEventListener('click', () => {
        this.filtering.currentFilter = false;
        this.events.displayListings(
          1,
          this.filtering.currentSortBy,
          this.filtering.currentSortOrder,
          this.filtering.currentFilter,
        );
        showActive.removeAttribute('checked');
        showAll.setAttribute('checked', 'checked');
      });
    },

    showActive: () => {
      const showActive = document.getElementById('showActive');
      const showAll = document.getElementById('showAll');
      showActive.addEventListener('click', () => {
        this.filtering.currentFilter = true;
        this.events.displayListings(
          1,
          this.filtering.currentSortBy,
          this.filtering.currentSortOrder,
          this.filtering.currentFilter,
        );
        showAll.removeAttribute('checked');
        showActive.setAttribute('checked', 'checked');
      });
    },
  };
}
