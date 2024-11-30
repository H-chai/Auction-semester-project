import AuctionAPI from '../../../api';

const api = new AuctionAPI();
const listings = await api.listing.get24Listings();

export function getLatestImages() {
  const { data } = listings;
  const mediaArray = data.map((listing) => listing.media[0]);
  const filterMediaArray = mediaArray.filter((media) => media !== undefined);
  const urlArray = filterMediaArray.map((media) => media.url);
  const latestImageArray = urlArray.slice(0, 3);

  return latestImageArray;
}
