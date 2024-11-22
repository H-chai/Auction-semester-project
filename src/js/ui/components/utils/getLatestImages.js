import AuctionAPI from '../../../api';

const api = new AuctionAPI();
const listings = await api.listing.get24Listings();

export function getLatestImages() {
  const { data } = listings;
  //console.log(data);
  const mediaArray = data.map((listing) => listing.media[0]);
  //console.log(mediaArray);
  const filterMediaArray = mediaArray.filter((media) => media !== undefined);
  //console.log(filterMediaArray);
  const urlArray = filterMediaArray.map((media) => media.url);
  const latestImageArray = urlArray.slice(0, 3);
  //console.log(latestImageArray);

  return latestImageArray;
}
