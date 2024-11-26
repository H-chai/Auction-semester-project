import { generateCurrentBidHTML } from './generateCurrentBidHTML';
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
  figure.classList.add(
    'aspect-square',
    'overflow-hidden',
    'rounded-md',
    'mb-3',
  );
  const listingImage = document.createElement('img');
  listingImage.classList.add(
    'object-cover',
    'object-center',
    'aspect-square',
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

  const bidding = generateCurrentBidHTML(listing);
  const ending = generateTimeLeftHTML(listing);
  listingInfo.append(bidding, ending);

  cardContainer.append(figure, listingTitle, listingInfo);

  return cardContainer;
}
