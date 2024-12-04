export function generateSkeletonCard() {
  const skeletonCard = document.createElement('div');
  skeletonCard.classList.add(
    'border',
    'border-outline-light',
    'rounded-md',
    'px-4',
    'py-6',
    'animate-pulse',
    'lg:pb-8',
  );

  const skeletonFigure = document.createElement('div');
  skeletonFigure.classList.add(
    'aspect-square',
    'bg-gray-300',
    'rounded-md',
    'mb-3',
    'bg-outline-light',
  );

  const skeletonTitle = document.createElement('div');
  skeletonTitle.classList.add(
    'bg-outline-light',
    'h-6',
    'w-full',
    'rounded',
    'mb-2',
    'lg:pb-3',
    'lg:mb-4',
    'lg:border-b',
    'lg:border-outline-light',
  );

  const skeletonInfo = document.createElement('div');
  skeletonInfo.classList.add('flex', 'justify-between', 'items-center');

  const skeletonBid = document.createElement('div');
  skeletonBid.classList.add('bg-outline-light', 'h-4', 'w-1/4', 'rounded');

  const skeletonEnding = document.createElement('div');
  skeletonEnding.classList.add('bg-outline-light', 'h-4', 'w-1/4', 'rounded');

  skeletonInfo.append(skeletonBid, skeletonEnding);
  skeletonCard.append(skeletonFigure, skeletonTitle, skeletonInfo);

  return skeletonCard;
}
