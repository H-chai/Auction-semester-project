import AuctionAPI from '../api';

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
    listingFeed: async () => {},

    register: async () => {
      const form = document.forms['signup'];
      form.addEventListener('submit', this.events.register);
    },

    login: async () => {},

    listing: async () => {},

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
  };
}
