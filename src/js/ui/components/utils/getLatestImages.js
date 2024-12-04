import AuctionAPI from '../../../api';

const api = new AuctionAPI();

async function fetchListings() {
  const listings = await api.listing.get24Listings();
  return listings;
}

export async function getLatestImages() {
  const listings = await fetchListings();
  const { data } = listings;
  const mediaArray = data.map((listing) => listing.media[0]);
  const filterMediaArray = mediaArray.filter((media) => media !== undefined);
  const urlArray = filterMediaArray.map((media) => ({
    url: media.url,
    alt: media.alt,
  }));

  const latestImageArray = urlArray.slice(0, 3);

  return latestImageArray;
}
