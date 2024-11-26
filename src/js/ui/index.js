import AuctionAPI from '../api';
import { generateAuthenticatedHeader } from './components/headers/authenticatedHeader';
import { generateListingCard } from './components/listing/listingCard';
import { generateUnAuthenticatedHeader } from './components/headers/unAuthenticatedHeader';
import { getLatestImages } from './components/utils/getLatestImages';
import { generateSingleListingHTML } from './components/listing/generateSingleListingHTML';

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
      this.events.listing.imageSlider();
      this.events.listing.displayListings();
      this.filtering.openSorting();
      this.filtering.openFilter();
      this.events.logout();
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
      this.events.listing.displaySingleListing();
      this.events.logout();
    },

    listingCreate: async () => {
      this.events.headerToggle();
      this.events.logout();
      const form = document.forms['createListing'];
      form.addEventListener('submit', this.events.listing.create);
    },

    listingUpdate: async () => {
      this.events.headerToggle();
      this.events.logout();
    },

    profile: async () => {
      this.events.headerToggle();
      this.events.profile.displayProfile();
      this.filtering.openSorting();
      this.filtering.openFilter();
      this.events.logout();
    },

    profileUpdate: async () => {
      this.events.headerToggle();
      this.events.logout();
    },
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

    logout: () => {
      const logoutButton = document.querySelectorAll('.logout-button');
      logoutButton.forEach((button) => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('credits');

          alert('You have successfully logged out.');
          window.location.href = '/';
        });
      });
    },

    listing: {
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
          const { data, meta } = listings;

          const { currentPage, pageCount } = meta;
          const newUrl = `${window.location.pathname}?page=${page}`;
          window.history.replaceState({}, '', newUrl);
          this.pagination.homePagination(currentPage, pageCount);
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });

          const listingsContainer = document.querySelector(
            '.listings-container',
          );
          listingsContainer.innerHTML = '';
          data.forEach((listing) => {
            const listingCard = generateListingCard(listing);
            listingsContainer.appendChild(listingCard);
          });
        } catch (error) {
          alert(error.message);
        }
      },

      displaySingleListing: async () => {
        try {
          const params = new URLSearchParams(window.location.search);
          const listingId = params.get('id');
          const listing = await this.listing.getSingleListing(listingId);
          const { data } = listing;

          const listingContainer = document.querySelector(
            '.listing-item-container',
          );
          listingContainer.innerHTML = '';
          const listingHTML = generateSingleListingHTML(data);
          listingContainer.appendChild(listingHTML);
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

      create: async (event) => {
        event.preventDefault();
        const data = AuctionApp.form.formSubmit(event);
        console.log(data);
        const {
          title,
          description,
          endingDate,
          endingTime,
          mediaUrl,
          mediaAlt,
        } = data;
        const media = [{ url: mediaUrl, alt: mediaAlt }];
        const dateCombined = `${endingDate}T${endingTime}:00.000Z`;
        const date = new Date(dateCombined);
        const endsAt = date.toISOString();
        console.log(title);
        console.log(description);
        console.log(endingDate);
        console.log(endingTime);
        console.log(mediaUrl);
        console.log(mediaAlt);
        try {
          await this.listing.create({ title, description, media, endsAt });
          alert('You have created a new listing!');
        } catch (error) {
          alert(
            `Could not create the listing.\n${error.message}.\nPlease try again.`,
          );
        }
      },
    },

    profile: {
      displayProfile: async (
        page = 1,
        sort = 'created',
        sortOrder = 'desc',
        active = true,
      ) => {
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name');

        try {
          const profile = await this.profile.getProfile(name);
          const { data } = profile;
          const header = document.querySelector('.header-authenticated');
          header.style.backgroundImage = `url(${data.banner.url})`;
          header.style.backgroundRepeat = 'no repeat';
          header.style.backgroundSize = 'cover';
          header.style.backgroundPosition = 'center';
          const avatar = document.querySelector('.avatar');
          avatar.src = data.avatar.url;
          avatar.alt = data.avatar.alt;
          const updateButton = document.querySelector('.profile-update-btn');
          const loggedInUser = localStorage.getItem('username');
          if (name === loggedInUser) {
            updateButton.classList.add('block');
          } else {
            updateButton.classList.add('hidden');
          }
          const username = document.querySelector('.username');
          username.textContent = data.name;
          const bio = document.querySelector('.bio');
          bio.textContent = data.bio;
          const credits = document.querySelector('.credits');
          credits.textContent = data.credits;
          const itemCount = document.querySelector('.item-count');
          itemCount.textContent = data._count.listings;

          const userListings = await this.listing.getUsersListings(
            24,
            page,
            sort,
            sortOrder,
            active,
            name,
          );
          const listings = userListings.data;
          const meta = userListings.meta;

          const listingContainer = document.querySelector(
            '.user-listings-container',
          );
          listingContainer.innerHTML = '';
          listings.forEach((listing) => {
            const listingCard = generateListingCard(listing);
            listingContainer.appendChild(listingCard);
          });

          const { currentPage, pageCount } = meta;
          console.log(currentPage);
          console.log(pageCount);
          const newUrl = `${window.location.pathname}?name=${name}&page=${page}`;
          window.history.replaceState({}, '', newUrl);
          this.pagination.homePagination(currentPage, pageCount);
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        } catch (error) {
          alert(error.message);
        }
      },
    },
  };

  currentSortBy = 'created';
  currentSortOrder = 'desc';
  currentFilter = true;

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

    removeCheckedAttribute: () => {
      const checkBoxes = document.getElementsByName('sort');
      checkBoxes.forEach((input) => {
        input.removeAttribute('checked');
      });
    },

    descending: () => {
      const newestButton = document.getElementById('newest');
      const path = window.location.pathname;
      newestButton.addEventListener('click', () => {
        this.filtering.removeCheckedAttribute();

        if (path === '/') {
          this.currentSortOrder = 'desc';
          this.events.listing.displayListings(
            1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        } else if (path === '/profile/') {
          this.currentSortOrder = 'desc';
          this.events.profile.displayProfile(
            1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        }

        newestButton.setAttribute('checked', 'checked');
      });
    },

    ascending: () => {
      const oldestButton = document.getElementById('oldest');
      const path = window.location.pathname;
      oldestButton.addEventListener('click', () => {
        this.filtering.removeCheckedAttribute();

        if (path === '/') {
          this.currentSortOrder = 'asc';
          this.events.listing.displayListings(
            1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        } else if (path === '/profile/') {
          this.currentSortOrder = 'asc';
          this.events.profile.displayProfile(
            1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        }

        oldestButton.setAttribute('checked', 'checked');
      });
    },

    endingSoon: () => {
      const endingSoonButton = document.getElementById('endingSoon');
      const path = window.location.pathname;
      endingSoonButton.addEventListener('click', () => {
        this.filtering.removeCheckedAttribute();

        if (path === '/') {
          this.currentSortBy = 'endsAt';
          this.currentSortOrder = 'asc';
          this.events.listing.displayListings(
            1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        } else if (path === '/profile/') {
          this.currentSortBy = 'endsAt';
          this.currentSortOrder = 'asc';
          this.events.profile.displayProfile(
            1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        }

        endingSoonButton.setAttribute('checked', 'checked');
      });
    },

    resentUpdate: () => {
      const resentUpdateButton = document.getElementById('updated');
      const path = window.location.pathname;
      resentUpdateButton.addEventListener('click', () => {
        this.filtering.removeCheckedAttribute();

        if (path === '/') {
          this.currentSortBy = 'updated';
          this.currentSortOrder = 'desc';
          this.events.listing.displayListings(
            1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        } else if (path === '/profile/') {
          this.currentSortBy = 'updated';
          this.currentSortOrder = 'desc';
          this.events.profile.displayProfile(
            1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        }

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
      const path = window.location.pathname;
      showAll.addEventListener('click', () => {
        if (path === '/') {
          this.currentFilter = false;
          this.events.listing.displayListings(
            1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        } else if (path === '/profile/') {
          this.currentFilter = false;
          this.events.profile.displayProfile(
            1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        }

        showActive.removeAttribute('checked');
        showAll.setAttribute('checked', 'checked');
      });
    },

    showActive: () => {
      const showActive = document.getElementById('showActive');
      const showAll = document.getElementById('showAll');
      const path = window.location.pathname;
      showActive.addEventListener('click', () => {
        if (path === '/') {
          this.currentFilter = true;
          this.events.listing.displayListings(
            1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        } else if (path === '/profile/') {
          this.currentFilter = true;
          this.events.profile.displayProfile(
            1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        }

        showAll.removeAttribute('checked');
        showActive.setAttribute('checked', 'checked');
      });
    },
  };

  pagination = {
    homePagination: (currentPage, pageCount) => {
      const pagination = document.querySelector('.pagination');
      pagination.innerHTML = '';
      const path = window.location.pathname;

      const createEllipsis = () => {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        return ellipsis;
      };

      const createButton = (pageNumber, pageData) => {
        const button = document.createElement('button');
        button.textContent = pageNumber;
        button.dataset.page = pageData;
        button.classList.add(
          'w-8',
          'h-8',
          'rounded-full',
          'text-blue',
          'bg-white',
          'font-medium',
          'border',
          'border-blue',
        );
        if (currentPage === pageData) {
          button.classList.add('current-page', 'text-white', 'bg-blue');
          button.classList.remove('text-blue', 'bg-white');
        }

        button.addEventListener('click', () => {
          if (path === '/') {
            this.events.listing.displayListings(
              pageData,
              this.currentSortBy,
              this.currentSortOrder,
              this.currentFilter,
            );
          } else if (path === '/profile/') {
            this.events.profile.displayProfile(
              pageData,
              this.currentSortBy,
              this.currentSortOrder,
              this.currentFilter,
            );
          }
        });
        return button;
      };

      if (pageCount <= 5) {
        for (let i = 1; i < pageCount + 1; i++) {
          const pageButton = createButton(i, i);
          pagination.appendChild(pageButton);
        }
      }
      if (pageCount > 5) {
        if (currentPage <= 3) {
          for (let i = 1; i < 4; i++) {
            const pageButton = createButton(i, i);
            pagination.appendChild(pageButton);
          }
          pagination.appendChild(createEllipsis());
          const lastPageButton = createButton(pageCount, pageCount);
          pagination.appendChild(lastPageButton);
        }

        if (currentPage > 3 && currentPage <= pageCount - 3) {
          const firstPageButton = createButton(1, 1);
          pagination.appendChild(firstPageButton);
          pagination.appendChild(createEllipsis());

          for (let i = currentPage - 1; i < currentPage + 2; i++) {
            const pageButton = createButton(i, i);
            pagination.appendChild(pageButton);
          }

          pagination.appendChild(createEllipsis());
          const lastPageButton = createButton(pageCount, pageCount);
          pagination.appendChild(lastPageButton);
        }

        if (currentPage > 3 && currentPage > pageCount - 3) {
          const firstPageButton = createButton(1, 1);
          pagination.appendChild(firstPageButton);
          pagination.appendChild(createEllipsis());

          for (let i = pageCount - 2; i <= pageCount; i++) {
            const pageButton = createButton(i, i);
            pagination.appendChild(pageButton);
          }
        }
      }

      const previousButton = document.createElement('button');
      previousButton.classList.add(
        'w-8',
        'h-8',
        'rounded-full',
        'text-blue',
        'bg-white',
        'font-medium',
        'border',
        'border-blue',
      );
      if (currentPage === 1) {
        previousButton.disabled = true;
        previousButton.style.cursor = 'not-allowed';
        previousButton.style.opacity = '0.4';
      }
      previousButton.addEventListener('click', () => {
        if (path === '/') {
          this.events.listing.displayListings(
            currentPage - 1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        } else if (path === '/profile/') {
          this.events.profile.displayProfile(
            currentPage - 1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        }
      });
      const previousIcon = document.createElement('i');
      previousIcon.classList.add('fa-solid', 'fa-angle-left');
      previousButton.appendChild(previousIcon);
      const firstButton = document.querySelector('[data-page="1"]');
      pagination.insertBefore(previousButton, firstButton);

      const nextButton = document.createElement('button');
      nextButton.classList.add(
        'w-8',
        'h-8',
        'rounded-full',
        'text-blue',
        'bg-white',
        'font-medium',
        'border',
        'border-blue',
      );
      if (currentPage === pageCount || pageCount === 0) {
        nextButton.disabled = true;
        nextButton.style.cursor = 'not-allowed';
        nextButton.style.opacity = '0.4';
      }
      nextButton.addEventListener('click', () => {
        if (path === '/') {
          this.events.listing.displayListings(
            currentPage + 1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        } else if (path === '/profile/') {
          this.events.profile.displayProfile(
            currentPage + 1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
        }
      });
      const nextIcon = document.createElement('i');
      nextIcon.classList.add('fa-solid', 'fa-angle-right');
      nextButton.appendChild(nextIcon);
      pagination.appendChild(nextButton);

      return pagination;
    },
  };
}
