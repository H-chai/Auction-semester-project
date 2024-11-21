import { calcTimeDiff } from '../utils/calcTimeDiff';
import { getCurrentBid } from '../utils/getCurrentBid';

export function generateCurrentBidHTML(listing) {
  const bidAmount = getCurrentBid(listing);
  const timeDiff = calcTimeDiff(listing);
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  const bidding = document.createElement('li');
  const biddingTitle = document.createElement('p');
  biddingTitle.classList.add('text-xs', 'text-gray', 'font-medium', 'mb-1');

  if (days >= 0) {
    if (bidAmount) {
      biddingTitle.textContent = 'Current bid';
      const amount = document.createElement('p');
      amount.classList.add('text-xl', 'font-semibold', 'lg:text-2xl');
      amount.textContent = bidAmount;
      const unitText = document.createElement('span');
      unitText.textContent = 'credits';
      unitText.classList.add('text-xs', 'font-semibold', 'ml-1');

      amount.appendChild(unitText);
      bidding.append(biddingTitle, amount);

      return bidding;
    } else {
      biddingTitle.textContent = 'Current bid';
      const amount = document.createElement('p');
      amount.classList.add('text-xl', 'font-semibold', 'lg:text-2xl');
      const unitText = document.createElement('span');
      unitText.textContent = 'No bids yet';
      unitText.classList.add('text-base', 'font-semibold');

      amount.appendChild(unitText);
      bidding.append(biddingTitle, amount);

      return bidding;
    }
  } else {
    if (bidAmount) {
      biddingTitle.textContent = 'Final bid';
      const amount = document.createElement('p');
      amount.classList.add('text-xl', 'font-semibold', 'lg:text-2xl');
      amount.textContent = bidAmount;
      const unitText = document.createElement('span');
      unitText.textContent = 'credits';
      unitText.classList.add('text-xs', 'font-semibold', 'ml-1');

      amount.appendChild(unitText);
      bidding.append(biddingTitle, amount);

      return bidding;
    } else {
      biddingTitle.textContent = 'Final bid';
      const amount = document.createElement('p');
      amount.classList.add('text-xl', 'font-semibold', 'lg:text-2xl');
      const unitText = document.createElement('span');
      unitText.textContent = 'No bids placed';
      unitText.classList.add('text-base', 'font-semibold');

      amount.appendChild(unitText);
      bidding.append(biddingTitle, amount);

      return bidding;
    }
  }
}
