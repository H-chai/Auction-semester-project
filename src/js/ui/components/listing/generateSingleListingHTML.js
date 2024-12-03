import { generateCurrentBidHTML } from './generateCurrentBidHTML';
import { generateTimeLeftHTML } from './generateTimeLeftHTML';

export function generateSingleListingHTML(listing) {
  console.log(listing);
  const listingSection = document.createElement('div');
  listingSection.classList.add('md:w-4/5', 'md:mx-auto', 'lg:w-full');
  const listingContainer = document.createElement('div');
  listingContainer.classList.add('lg:flex', 'lg:items-start', 'lg:gap-20');

  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('lg:w-1/2', 'flex', 'flex-col', 'items-center');
  const mainImage = document.createElement('div');
  mainImage.classList.add('main-image', 'mb-6');
  const listingImage = document.createElement('img');
  const medias = listing.media;
  console.log(medias);
  if (medias?.[0]) {
    listingImage.src = medias[0].url;
    listingImage.alt = medias[0].alt;
  } else {
    listingImage.src = '/images/noImageAvailable.svg';
    listingImage.alt = 'No image available';
  }
  listingImage.classList.add(
    'aspect-square',
    'rounded-md',
    'object-cover',
    'object-center',
    'w-full',
    'md:aspect-4/3',
  );
  mainImage.appendChild(listingImage);
  const imageList = document.createElement('div');
  imageList.classList.add('flex', 'items-center', 'flex-wrap', 'gap-2', 'mb-6');
  medias.forEach((media) => {
    const imageButton = document.createElement('button');
    const subImage = document.createElement('img');
    subImage.classList.add(
      'w-14',
      'opacity-70',
      'aspect-square',
      'rounded-md',
      'object-cover',
      'object-center',
      'md:aspect-4/3',
      'lg:w-20',
    );
    subImage.src = media.url;
    subImage.alt = media.alt;
    imageButton.appendChild(subImage);
    imageList.appendChild(imageButton);
    imageButton.addEventListener('click', () => {
      mainImage.innerHTML = `<img src=${media.url} alt=${media.alt} class="aspect-square rounded-md object-cover object-center w-full md:aspect-4/3">`;
    });
  });

  imageWrapper.append(mainImage, imageList);

  const listingDetail = document.createElement('div');
  listingDetail.classList.add('lg:w-1/2');

  const update = document.createElement('div');
  update.classList.add(
    'update',
    'font-semibold',
    'font-display',
    'mb-3',
    'text-end',
    'lg:hidden',
  );
  const title = document.createElement('h1');
  title.textContent = listing.title;
  title.classList.add(
    'text-2xl',
    'font-display',
    'font-bold',
    'mb-2',
    'break-words',
  );
  const description = document.createElement('p');
  description.textContent = listing.description;
  description.classList.add('text-base', 'mb-6');

  const bidAndTime = document.createElement('ul');
  bidAndTime.classList.add('flex', 'justify-between', 'items-center', 'mb-6');
  const currentBid = generateCurrentBidHTML(listing);
  const ending = generateTimeLeftHTML(listing);
  bidAndTime.append(currentBid, ending);

  const form = document.createElement('form');
  form.name = 'bid';
  form.classList.add('flex', 'gap-2', 'mb-3');
  const label = document.createElement('label');
  label.htmlFor = 'bidding';
  label.classList.add('w-3/5');
  const input = document.createElement('input');
  input.name = 'amount';
  input.id = 'bidding';
  input.type = 'number';
  input.placeholder = 'Enter your bid amount';
  input.required = true;
  input.classList.add(
    'border',
    'border-outline',
    'rounded-md',
    'p-4',
    'placeholder-light-gray',
    'w-full',
  );
  const button = document.createElement('button');
  button.textContent = 'Place a bid';
  button.classList.add('btn-blue', 'py-4', 'w-2/5', 'lg:text-base');
  button.type = 'submit';
  const loggedInUser = localStorage.getItem('username');
  if (listing.seller.name === loggedInUser) {
    input.disabled = true;
    input.style.cursor = 'not-allowed';
    input.placeholder = 'Bidding disabled';
    button.disabled = true;
    button.style.cursor = 'not-allowed';
  }

  label.appendChild(input);
  form.append(label, button);

  const credits = document.createElement('p');
  credits.textContent = 'Your current credits:';
  credits.classList.add('text-sm', 'mb-8');
  const userCredits = document.createElement('span');
  const creditsAmount = localStorage.getItem('credits');
  userCredits.textContent = creditsAmount;
  userCredits.classList.add('font-bold', 'ml-1', 'text-base');
  credits.appendChild(userCredits);

  if (!loggedInUser) {
    input.disabled = true;
    input.style.cursor = 'not-allowed';
    button.disabled = true;
    button.style.cursor = 'not-allowed';
    credits.textContent = 'Please log in to place a bid on this listing.';
    credits.classList.add('font-medium');
  }

  const owner = document.createElement('div');
  owner.classList.add('mb-10');
  const ownerTitle = document.createElement('p');
  ownerTitle.textContent = 'Owner';
  ownerTitle.classList.add('text-sm', 'font-medium', 'text-gray', 'mb-2');
  const ownerInfo = document.createElement('div');
  ownerInfo.classList.add('flex', 'items-center', 'gap-2', 'justify-start');
  const ownerAvatar = document.createElement('img');
  ownerAvatar.src = listing.seller.avatar.url;
  ownerAvatar.classList.add('w-7', 'h-7', 'rounded-full');
  const ownerName = document.createElement('a');
  ownerName.textContent = listing.seller.name;
  ownerName.href = `/profile/?name=${listing.seller.name}`;
  ownerName.classList.add(
    'font-semibold',
    'text-sm',
    'underline',
    'lg:text-base',
    'lg:font-medium',
  );

  ownerInfo.append(ownerAvatar, ownerName);
  owner.append(ownerTitle, ownerInfo);

  const history = document.createElement('div');
  const historyTitle = document.createElement('p');
  historyTitle.textContent = 'Bid history';
  historyTitle.classList.add('text-sm', 'font-medium', 'text-gray');

  const historyList = document.createElement('ul');
  const historyArray = listing.bids;
  if (historyArray.length > 0) {
    historyArray.forEach((bid) => {
      const listItem = document.createElement('li');
      listItem.classList.add(
        'flex',
        'items-center',
        'justify-between',
        'py-4',
        'border-b',
        'border-outline-light',
      );
      const bidder = document.createElement('div');
      bidder.classList.add('flex', 'items-center', 'gap-2');
      const bidderAvatar = document.createElement('img');
      bidderAvatar.src = bid.bidder.avatar.url;
      bidderAvatar.classList.add('w-7', 'h-7', 'rounded-full');
      const bidderName = document.createElement('a');
      bidderName.textContent = bid.bidder.name;
      bidderName.href = `/profile/?name=${bid.bidder.name}`;
      bidderName.classList.add(
        'font-semibold',
        'text-sm',
        'underline',
        'lg:text-base',
        'lg:font-medium',
      );

      bidder.append(bidderAvatar, bidderName);

      const amount = document.createElement('p');
      amount.textContent = bid.amount;
      amount.classList.add('lg:text-lg', 'lg:font-medium');
      const creditIcon = document.createElement('i');
      creditIcon.classList.add('fa-solid', 'fa-coins', 'ml-1.5');
      amount.appendChild(creditIcon);

      listItem.append(bidder, amount);

      historyList.appendChild(listItem);
    });

    history.append(historyTitle, historyList);
  } else {
    const text = document.createElement('p');
    text.textContent = 'No bid placed yet';
    text.classList.add('mt-2', 'font-medium', 'text-sm');
    history.append(historyTitle, text);
  }
  listingDetail.append(
    update,
    title,
    description,
    bidAndTime,
    form,
    credits,
    owner,
    history,
  );

  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.textContent = 'See all listings';
  homeLink.classList.add(
    'inline-block',
    'underline',
    'font-display',
    'font-medium',
    'text-base',
    'mt-8',
    'lg:mt-14',
  );
  const backIcon = document.createElement('i');
  backIcon.classList.add('fa-solid', 'fa-arrow-left', 'mr-1');
  homeLink.prepend(backIcon);

  listingContainer.append(imageWrapper, listingDetail);
  listingSection.append(listingContainer, homeLink);

  return listingSection;
}
