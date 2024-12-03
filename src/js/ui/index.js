import AuctionAPI from '../api';
import { generateAuthenticatedHeader } from './components/headers/authenticatedHeader';
import { generateListingCard } from './components/listing/listingCard';
import { generateUnAuthenticatedHeader } from './components/headers/unAuthenticatedHeader';
import { getLatestImages } from './components/utils/getLatestImages';
import { generateSingleListingHTML } from './components/listing/generateSingleListingHTML';
import { generateSkeletonCard } from './components/listing/generateSkeletonCard';

export default class AuctionApp extends AuctionAPI {
  constructor() {
    super();
    this.router();
  }

  async router(pathname = window.location.pathname) {
    switch (pathname) {
      case '/':
        this.events.listing.displaySkeleton(24);
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
        this.events.listing.displaySkeleton(4);
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

  static get user() {
    return localStorage.getItem('username');
  }

  views = {
    listingFeed: async () => {
      this.events.headerToggle();
      this.events.listing.imageSlider();
      this.events.listing.displayListings();
      this.filtering.openSorting();
      this.filtering.openFilter();
      this.events.logout();
      const form = document.forms['search'];
      form.addEventListener('submit', this.events.listing.search);
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
      this.events.listing.addImage();
    },

    listingUpdate: async () => {
      this.events.headerToggle();
      this.events.logout();
      this.events.listing.update();
      this.events.listing.delete();
      this.events.listing.addImage();
    },

    profile: async () => {
      this.events.headerToggle();
      this.events.profile.displayProfile();
      this.events.profile.displayUpdateProfileButton();
      this.filtering.openSorting();
      this.filtering.openFilter();
      this.events.logout();
    },

    profileUpdate: async () => {
      this.events.headerToggle();
      this.events.logout();
      this.events.profile.updateProfile();
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
      displaySkeleton: (count) => {
        const listingsContainer = document.querySelector('.listings-container');
        listingsContainer.innerHTML = '';
        const skeletonFragment = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
          const skeletonCard = generateSkeletonCard();
          skeletonFragment.appendChild(skeletonCard);
        }
        listingsContainer.appendChild(skeletonFragment);
      },

      displayListings: async (
        page = 1,
        sort = 'created',
        sortOrder = 'desc',
        active = true,
      ) => {
        try {
          const listingsContainer = document.querySelector(
            '.listings-container',
          );

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
          console.log(data);
          const listingContainer = document.querySelector(
            '.listing-item-container',
          );
          listingContainer.innerHTML = '';
          const listingHTML = generateSingleListingHTML(data);
          listingContainer.appendChild(listingHTML);
          if (data.seller.name === AuctionApp.user) {
            const update = document.querySelectorAll('.update');
            update.forEach((div) => {
              const updateBtn = document.createElement('a');
              updateBtn.textContent = 'Update Listing';
              updateBtn.classList.add('btn-green');
              updateBtn.addEventListener('click', () => {
                window.location.href = `/listing/update/?id=${listingId}`;
              });
              div.appendChild(updateBtn);
            });
          }
          const form = document.forms['bid'];
          form.addEventListener('submit', this.events.bid);
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

        const { title, description, endingDate, endingTime } = data;

        const imageList = document.querySelectorAll('.image-list');
        const urlArray = [];
        const altArray = [];
        imageList.forEach((list) => {
          const url = list.querySelector('input[name="mediaUrl"]').value;
          const alt = list.querySelector('input[name="mediaAlt"]').value;
          urlArray.push(url);
          altArray.push(alt);
        });

        const media = urlArray.map((url, index) => ({
          url: url,
          alt: altArray[index],
        }));

        console.log(media);
        const dateCombined = `${endingDate}T${endingTime}:00.000Z`;
        const date = new Date(dateCombined);
        const endsAt = date.toISOString();
        try {
          await this.listing.create({ title, description, media, endsAt });
          alert('You have created a new listing!');
          window.location.href = '/';
        } catch (error) {
          alert(
            `Could not create the listing.\n${error.message}.\nPlease try again.`,
          );
        }
      },

      update: async () => {
        const params = new URLSearchParams(window.location.search);
        const listingId = params.get('id');
        const listing = await this.listing.getSingleListing(listingId);
        const { data } = listing;
        console.log(data);

        const title = document.getElementById('title');
        title.value = data.title;
        const description = document.getElementById('description');
        description.value = data.description;

        const medias = data.media;
        console.log(medias);
        console.log(medias.length);
        const imgUrl = document.getElementById('img-url');
        imgUrl.value = medias[0].url;
        const imgAlt = document.getElementById('img-alt');
        imgAlt.value = medias[0].alt;

        if (medias.length > 1) {
          for (let i = 1; i < medias.length; i++) {
            const imageList = document.createElement('div');
            imageList.classList.add(
              'image-list',
              'lg:flex',
              'lg:justify-between',
              'lg:items-center',
              'lg:gap-4',
            );
            const urlLabel = document.createElement('label');
            urlLabel.htmlFor = `img-url-${i + 1}`;
            urlLabel.classList.add(
              'url-label',
              'font-display',
              'font-semibold',
              'lg:w-1/2',
            );
            urlLabel.textContent = `Image url`;
            const urlInput = document.createElement('input');
            urlInput.type = 'url';
            urlInput.name = 'mediaUrl';
            urlInput.id = `img-url-${i + 1}`;
            urlInput.classList.add(
              'border',
              'border-outline',
              'p-4',
              'block',
              'w-full',
              'rounded-md',
              'mt-1',
              'mb-4',
            );
            urlInput.value = medias[i].url;
            urlLabel.appendChild(urlInput);

            const altLabel = document.createElement('label');
            altLabel.htmlFor = `img-alt-${i + 1}`;
            altLabel.classList.add('font-display', 'font-semibold', 'lg:w-1/2');
            altLabel.textContent = `Image alt`;
            const altInput = document.createElement('input');
            altInput.type = 'alt';
            altInput.name = 'mediaAlt';
            altInput.id = `img-alt-${i + 1}`;
            altInput.classList.add(
              'border',
              'border-outline',
              'p-4',
              'block',
              'w-full',
              'rounded-md',
              'mt-1',
              'mb-4',
            );
            altInput.value = medias[i].alt;
            altLabel.appendChild(altInput);

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.innerHTML = `<i class="fa-regular fa-circle-xmark text-xl text-blue"></i>`;
            removeButton.addEventListener('click', () => {
              const parentContent = removeButton.closest('.image-list');
              parentContent.remove();
            });

            imageList.append(urlLabel, altLabel, removeButton);
            const addImageButton = document.querySelector('.add-img');
            const updateForm = document.forms['updateListing'];
            updateForm.insertBefore(imageList, addImageButton);
          }
        }

        const isoString = data.endsAt;
        const end = new Date(isoString);
        const date = end.toISOString().split('T')[0];
        const time = end.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        });
        const endingDate = document.getElementById('endingDate');
        endingDate.value = date;
        const endingTime = document.getElementById('endingTime');
        endingTime.value = time;

        try {
          const form = document.forms['updateListing'];
          form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = AuctionApp.form.formSubmit(event);
            const { title, description } = formData;

            const imageList = document.querySelectorAll('.image-list');
            const urlArray = [];
            const altArray = [];
            imageList.forEach((list) => {
              const url = list.querySelector('input[name="mediaUrl"]').value;
              const alt = list.querySelector('input[name="mediaAlt"]').value;
              urlArray.push(url);
              altArray.push(alt);
            });
            const media = urlArray.map((url, index) => ({
              url: url,
              alt: altArray[index],
            }));

            this.listing.update(listingId, {
              title,
              description,
              media,
            });
          });
        } catch (error) {
          alert(
            `Could not update the listing.\n${error.message}.\nPlease try again.`,
          );
        }
      },

      delete: async () => {
        const deleteBtn = document.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
          const params = new URLSearchParams(window.location.search);
          const listingId = params.get('id');
          try {
            const isConfirm = window.confirm(
              'Are you sure you want to delete this?',
            );
            if (isConfirm) {
              this.listing.delete(listingId);
            }
          } catch (error) {
            alert(
              `Could not delete the listing.\n${error.message}.\nPlease try again.`,
            );
          }
        });
      },

      displaySearchResult: async (
        query,
        page = 1,
        sort = 'created',
        sortOrder = 'desc',
      ) => {
        try {
          const listings = await this.listing.search(
            query,
            24,
            page,
            sort,
            sortOrder,
          );
          const { data, meta } = listings;
          const { currentPage, pageCount } = meta;
          const newUrl = `${window.location.pathname}?page=${page}&query=${query}`;
          window.history.replaceState({}, '', newUrl);
          this.pagination.homePagination(currentPage, pageCount);
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

      search: async (event) => {
        event.preventDefault();
        const data = AuctionApp.form.formSubmit(event);
        const query = data.search;
        const result = document.querySelector('.result');
        result.textContent = '';
        const listings = await this.listing.search(query);
        const { meta } = listings;
        const totalCount = meta.totalCount;
        const searchInput = document.getElementById('search');
        try {
          this.currentQuery = query;
          this.events.listing.displaySearchResult(query);
          const sortOptions = document.querySelector('.sorting-list');
          sortOptions.classList.add('hidden');
          const filterOptions = document.querySelector('.filtering-list');
          filterOptions.classList.add('hidden');
          const newQuery =
            query.charAt(0).toUpperCase() + query.substring(1).toLowerCase();
          const resultText = document.createElement('p');
          resultText.textContent = newQuery;
          resultText.classList.add(
            'font-semibold',
            'text-center',
            'text-lg',
            'mt-6',
            'border',
            'border-outline-light',
            'px-4',
            'bg-off-white',
            'rounded-full',
            'inline-block',
            'lg:mt-10',
            'lg:text-2xl',
          );
          const resultNumber = document.createElement('span');
          resultNumber.textContent = ` (${totalCount})`;
          resultNumber.classList.add(
            'font-normal',
            'text-lg',
            'leading-8',
            'font-display',
          );

          const newestButton = document.getElementById('newest');
          newestButton.checked = true;

          const showActive = document.getElementById('showActive');
          const showAll = document.getElementById('showAll');
          showActive.disabled = true;
          showAll.disabled = true;
          showActive.checked = false;
          showAll.checked = true;
          const notAvailable = filterOptions.querySelectorAll('input, label');
          notAvailable.forEach((element) => {
            element.style.cursor = 'not-allowed';
          });

          const clearButton = document.createElement('button');
          clearButton.classList.add('ml-3');
          clearButton.innerHTML = `<i class="fa-solid fa-xmark text-gray text-sm"></i>`;
          resultText.append(resultNumber, clearButton);
          result.append(resultText);
          const form = document.querySelector('.search-form');
          form.insertAdjacentElement('afterend', result);

          clearButton.addEventListener('click', () => {
            searchInput.value = '';
            resultText.remove();
            this.currentQuery = '';

            showActive.disabled = false;
            showAll.disabled = false;
            showActive.checked = true;
            showAll.checked = false;
            filterOptions.classList.add('hidden');
            const notAvailable = filterOptions.querySelectorAll('input, label');
            notAvailable.forEach((element) => {
              element.style.cursor = 'pointer';
            });
            this.events.listing.displayListings();

            this.filtering.removeCheckedAttribute();
            const newestButton = document.getElementById('newest');
            newestButton.checked = true;
            sortOptions.classList.add('hidden');
          });
        } catch (error) {
          alert('Something went wrong while searching: ' + error.message);
        }
      },

      addImage: () => {
        let counter = 1;
        const addImgBtn = document.querySelector('.add-img');

        addImgBtn.addEventListener('click', () => {
          counter++;
          const imageList = document.createElement('div');
          imageList.classList.add(
            'image-list',
            'lg:flex',
            'lg:justify-between',
            'lg:items-center',
            'lg:gap-4',
          );
          const urlLabel = document.createElement('label');
          urlLabel.classList.add(
            'url-label',
            'font-display',
            'font-semibold',
            'lg:w-1/2',
          );
          urlLabel.textContent = `Image url`;
          const urlInput = document.createElement('input');
          urlInput.type = 'url';
          urlInput.name = 'mediaUrl';
          urlInput.classList.add(
            'border',
            'border-outline',
            'p-4',
            'block',
            'w-full',
            'rounded-md',
            'mt-1',
            'mb-4',
          );
          urlInput.required = true;
          urlLabel.appendChild(urlInput);

          const altLabel = document.createElement('label');
          altLabel.classList.add('font-display', 'font-semibold', 'lg:w-1/2');
          altLabel.textContent = `Image alt`;
          const altInput = document.createElement('input');
          altInput.type = 'alt';
          altInput.name = 'mediaAlt';
          altInput.classList.add(
            'border',
            'border-outline',
            'p-4',
            'block',
            'w-full',
            'rounded-md',
            'mt-1',
            'mb-4',
          );
          altInput.required = true;
          altLabel.appendChild(altInput);

          const path = window.location.pathname;
          console.log(path);
          if (path === '/listing/update/') {
            urlLabel.htmlFor = `img-url-${counter}-update`;
            altLabel.htmlFor = `img-alt-${counter}-update`;
            urlInput.id = `img-url-${counter}-update`;
            altInput.id = `img-alt-${counter}-update`;
          } else {
            urlLabel.htmlFor = `img-url-${counter}`;
            altLabel.htmlFor = `img-alt-${counter}`;
            urlInput.id = `img-url-${counter}`;
            altInput.id = `img-alt-${counter}`;
          }

          const removeButton = document.createElement('button');
          removeButton.type = 'button';
          removeButton.innerHTML = `<i class="fa-regular fa-circle-xmark text-xl text-blue"></i>`;
          removeButton.addEventListener('click', () => {
            const parentContent = removeButton.closest('.image-list');
            parentContent.remove();
          });

          imageList.append(urlLabel, altLabel, removeButton);

          const addImageButton = document.querySelector('.add-img');
          const form = document.querySelector('form');
          form.insertBefore(imageList, addImageButton);
        });
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
            '.listings-container',
          );
          listingContainer.innerHTML = '';
          listings.forEach((listing) => {
            const listingCard = generateListingCard(listing);
            listingContainer.appendChild(listingCard);
          });

          const { currentPage, pageCount } = meta;
          const newUrl = `${window.location.pathname}?name=${name}&page=${page}`;
          window.history.replaceState({}, '', newUrl);
          this.pagination.homePagination(currentPage, pageCount);
        } catch (error) {
          if (!AuctionApp.user) {
            alert(
              'You need to log in to access this profile.\nPlease log in or create an account to continue.',
            );
            window.location.href = '/';
          } else {
            alert(error.message);
          }
        }
      },

      displayUpdateProfileButton: () => {
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name');
        const updateButtonContainer = document.querySelector(
          '.update-btn-container',
        );
        updateButtonContainer.classList.add(
          'absolute',
          '-top-1/2',
          'lg:top-0',
          'right-0',
        );
        const updateButton = document.createElement('a');
        updateButton.classList.add(
          'btn-green',
          'font-display',
          'font-semibold',
        );
        updateButton.textContent = 'Update Profile';
        updateButton.href = '/profile/update/';
        if (name === AuctionApp.user) {
          updateButtonContainer.appendChild(updateButton);
        }
      },

      updateProfile: async () => {
        const { data } = await this.profile.getProfile(AuctionApp.user);
        const bio = document.getElementById('bio');
        bio.value = data.bio;
        const bannerUrl = document.getElementById('banner-url');
        bannerUrl.value = data.banner.url;
        const bannerAlt = document.getElementById('banner-alt');
        bannerAlt.value = data.banner.alt;
        const avatarUrl = document.getElementById('avatar-url');
        avatarUrl.value = data.avatar.url;
        const avatarAlt = document.getElementById('avatar-alt');
        avatarAlt.value = data.avatar.alt;

        try {
          const form = document.forms['updateProfile'];
          form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = AuctionApp.form.formSubmit(event);
            const { bio, bannerUrl, bannerAlt, avatarUrl, avatarAlt } =
              formData;
            const banner = { url: bannerUrl, alt: bannerAlt };
            const avatar = { url: avatarUrl, alt: avatarAlt };
            this.profile.updateProfile(AuctionApp.user, {
              bio,
              banner,
              avatar,
            });
          });
        } catch (error) {
          alert(
            `Could not update your profile.\n${error.message}.\nPlease try again.`,
          );
        }
      },
    },

    bid: async (event) => {
      const formData = AuctionApp.form.formSubmit(event);
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      try {
        await this.bid.bid(id, { amount: Number(formData.amount) });
        console.log(localStorage.getItem('credits'));
        const { data } = await this.profile.getProfile(
          localStorage.getItem('username'),
        );
        localStorage.setItem('credits', data.credits);
        alert('Success! Your bid has been placed. Good luck!');
        window.location.href = `/listing/?id=${id}`;
      } catch (error) {
        alert(
          `Could not bid on this listing.\n${error.message}.\nPlease try again.`,
        );
      }
    },
  };

  currentSortBy = 'created';
  currentSortOrder = 'desc';
  currentFilter = true;
  currentQuery = new URLSearchParams(window.location.search).get('query') || '';

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
        input.checked = false;
      });
    },

    descending: () => {
      const newestButton = document.getElementById('newest');
      const path = window.location.pathname;
      newestButton.addEventListener('click', () => {
        this.filtering.removeCheckedAttribute();
        if (this.currentQuery) {
          this.currentSortOrder = 'desc';
          this.currentSortBy = 'created';
          this.events.listing.displaySearchResult(
            this.currentQuery,
            1,
            this.currentSortBy,
            this.currentSortOrder,
          );
        } else if (!this.currentQuery && path === '/') {
          this.currentSortOrder = 'desc';
          this.currentSortBy = 'created';
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

        newestButton.checked = true;
      });
    },

    ascending: () => {
      const oldestButton = document.getElementById('oldest');
      const path = window.location.pathname;
      oldestButton.addEventListener('click', () => {
        this.filtering.removeCheckedAttribute();
        if (this.currentQuery) {
          this.currentSortOrder = 'asc';
          this.currentSortBy = 'created';
          this.events.listing.displaySearchResult(
            this.currentQuery,
            1,
            this.currentSortBy,
            this.currentSortOrder,
          );
        } else if (!this.currentQuery && path === '/') {
          this.currentSortOrder = 'asc';
          this.currentSortBy = 'created';
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

        oldestButton.checked = true;
      });
    },

    endingSoon: () => {
      const endingSoonButton = document.getElementById('endingSoon');
      const path = window.location.pathname;
      endingSoonButton.addEventListener('click', () => {
        this.filtering.removeCheckedAttribute();
        if (this.currentQuery) {
          this.currentSortBy = 'endsAt';
          this.currentSortOrder = 'asc';
          this.events.listing.displaySearchResult(
            this.currentQuery,
            1,
            this.currentSortBy,
            this.currentSortOrder,
          );
        } else if (!this.currentQuery && path === '/') {
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

        endingSoonButton.checked = true;
      });
    },

    resentUpdate: () => {
      const resentUpdateButton = document.getElementById('updated');
      const path = window.location.pathname;
      resentUpdateButton.addEventListener('click', () => {
        this.filtering.removeCheckedAttribute();
        if (this.currentQuery) {
          this.currentSortBy = 'updated';
          this.currentSortOrder = 'desc';
          this.events.listing.displaySearchResult(
            this.currentQuery,
            1,
            this.currentSortBy,
            this.currentSortOrder,
          );
        } else if (!this.currentQuery && path === '/') {
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

        resentUpdateButton.checked = true;
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
        showActive.checked = false;
        showAll.checked = true;
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

        showAll.checked = false;
        showActive.checked = true;
      });
    },
  };

  pagination = {
    homePagination: (currentPage, pageCount) => {
      const pagination = document.querySelector('.pagination');
      pagination.innerHTML = '';
      const path = window.location.pathname;
      const listingContainer = document.querySelector('.listings-feed');
      const userListingContainer = document.querySelector(
        '.user-listings-feed',
      );

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
          if (this.currentQuery) {
            this.events.listing.displaySearchResult(
              this.currentQuery,
              pageData,
              this.currentSortBy,
              this.currentSortOrder,
              this.currentFilter,
            );
            listingContainer.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          } else if (path === '/') {
            this.events.listing.displayListings(
              pageData,
              this.currentSortBy,
              this.currentSortOrder,
              this.currentFilter,
            );
            listingContainer.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          } else if (path === '/profile/') {
            this.events.profile.displayProfile(
              pageData,
              this.currentSortBy,
              this.currentSortOrder,
              this.currentFilter,
            );
            userListingContainer.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
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
        if (this.currentQuery) {
          this.events.listing.displaySearchResult(
            this.currentQuery,
            currentPage - 1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
          listingContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        } else if (path === '/') {
          this.events.listing.displayListings(
            currentPage - 1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
          listingContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        } else if (path === '/profile/') {
          this.events.profile.displayProfile(
            currentPage - 1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
          userListingContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
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
        if (this.currentQuery) {
          this.events.listing.displaySearchResult(
            this.currentQuery,
            currentPage + 1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
          listingContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        } else if (path === '/') {
          this.events.listing.displayListings(
            currentPage + 1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
          listingContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        } else if (path === '/profile/') {
          this.events.profile.displayProfile(
            currentPage + 1,
            this.currentSortBy,
            this.currentSortOrder,
            this.currentFilter,
          );
          userListingContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
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
