import { calcTimeDiff } from '../utils/calcTimeDiff';

export function generateTimeLeftHTML(listing) {
  const timeDiff = calcTimeDiff(listing);
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  const ending = document.createElement('li');
  const endingTitle = document.createElement('p');
  endingTitle.classList.add(
    'text-xs',
    'text-gray',
    'font-medium',
    'mb-1',
    'lg:text-sm',
  );

  if (days > 0) {
    endingTitle.textContent = 'Ending in';
    const daysNumber = document.createElement('p');
    daysNumber.classList.add('text-2xl', 'font-semibold', 'lg:text-3xl');
    daysNumber.textContent = days;
    const unitText = document.createElement('span');
    unitText.textContent = 'days left';
    unitText.classList.add('text-xs', 'font-semibold', 'ml-1', 'lg:text-base');

    daysNumber.appendChild(unitText);
    ending.append(endingTitle, daysNumber);

    return ending;
  } else if (days === 0) {
    endingTitle.textContent = 'Ending in';
    const hourLeft = document.createElement('p');
    hourLeft.classList.add(
      'text-2xl',
      'font-semibold',
      'lg:text-3xl',
      'inline-block',
    );
    hourLeft.textContent = hours;
    const hourUnit = document.createElement('span');
    hourUnit.textContent = 'h';
    hourUnit.classList.add('text-xs', 'font-semibold', 'ml-1', 'lg:text-base');
    hourLeft.appendChild(hourUnit);

    const minutesLeft = document.createElement('p');
    minutesLeft.classList.add(
      'text-2xl',
      'font-semibold',
      'lg:text-3xl',
      'inline-block',
      'ml-2',
    );
    minutesLeft.textContent = minutes;
    const minutesUnit = document.createElement('span');
    minutesUnit.textContent = 'm';
    minutesUnit.classList.add(
      'text-xs',
      'font-semibold',
      'ml-1',
      'lg:text-base',
    );
    minutesLeft.appendChild(minutesUnit);

    ending.append(endingTitle, hourLeft, minutesLeft);

    return ending;
  } else {
    endingTitle.textContent = 'Bid closed';
    const lineContainer = document.createElement('div');
    lineContainer.classList.add(
      'h-[32px]',
      'flex',
      'items-center',
      'justify-center',
    );
    const daysNumber = document.createElement('span');
    daysNumber.classList.add('h-[2px]', 'w-[20px]', 'block', 'bg-light-gray');
    lineContainer.appendChild(daysNumber);

    ending.append(endingTitle, lineContainer);

    return ending;
  }
}
