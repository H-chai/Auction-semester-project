import { generateTimeLeftHTML } from './generateTimeLeftHTML';

export function generateListingCard(listing) {
  const cardContainer = document.createElement('a');
  cardContainer.classList.add(
    'border',
    'border-outline-light',
    'rounded-md',
    'px-4',
    'py-6',
    'transition',
    'duration-300',
    'ease-linear',
    'group',
    'hover:shadow-[0_0_24px_rgba(33,33,33,0.1)]',
    'lg:pb-8',
  );
  cardContainer.id = listing.id;
  cardContainer.href = `/listing/?id=${listing.id}`;

  const figure = document.createElement('figure');
  figure.classList.add('aspect-video', 'overflow-hidden', 'rounded-md', 'mb-3');
  const listingImage = document.createElement('img');
  listingImage.classList.add(
    'object-cover',
    'object-center',
    'aspect-video',
    'w-full',
    'rounded-md',
    'transition',
    'duration-300',
    'ease-linear',
    'group-hover:scale-105',
  );
  if (listing.media?.[0]) {
    listingImage.src = listing.media[0].url;
    listingImage.alt = listing.media[0].alt;
  } else {
    listingImage.src = '../../../../images/noImageAvailable.svg';
    listingImage.alt = 'No image available';
  }
  figure.appendChild(listingImage);

  const listingTitle = document.createElement('h1');
  listingTitle.textContent = listing.title;
  listingTitle.classList.add(
    'font-display',
    'font-bold',
    'text-2xl',
    'mb-2',
    'lg:pb-3',
    'lg:mb-4',
    'lg:border-b',
    'lg:border-outline-light',
    'lg:text-3xl',
  );

  const listingInfo = document.createElement('ul');
  listingInfo.classList.add(
    'flex',
    'justify-between',
    'items-center',
    'lg:px-2',
  );

  const bidding = document.createElement('li');
  const currentBid = document.createElement('p');
  currentBid.classList.add('text-xs', 'text-gray', 'font-medium', 'mb-1');
  currentBid.textContent = 'Current bid';
  const currentBidNumber = document.createElement('p');
  currentBidNumber.classList.add('text-xl', 'font-semibold', 'lg:text-2xl');
  // Get currentBid amount
  currentBidNumber.textContent = '100';
  const credits = document.createElement('span');
  credits.textContent = 'credits';
  credits.classList.add('text-xs', 'font-semibold', 'ml-1');

  // const ending = document.createElement('li');
  // const endingTitle = document.createElement('p');
  // endingTitle.classList.add('text-xs', 'text-gray', 'font-medium', 'mb-1');
  // endingTitle.textContent = 'Ending in';
  // const endingIn = document.createElement('p');
  // endingIn.classList.add('text-xl', 'font-semibold', 'lg:text-2xl');
  // // Get ending in
  // const timeLeft = calcTimeDiff(listing);
  // endingIn.textContent = timeLeft;
  // const daysLeft = document.createElement('span');
  // daysLeft.textContent = 'days left';
  // daysLeft.classList.add('text-xs', 'font-semibold', 'ml-1');

  currentBidNumber.appendChild(credits);
  bidding.append(currentBid, currentBidNumber);
  // endingIn.appendChild(daysLeft);
  // ending.append(endingTitle, endingIn);
  const ending = generateTimeLeftHTML(listing);
  listingInfo.append(bidding, ending);

  cardContainer.append(figure, listingTitle, listingInfo);

  return cardContainer;
}
