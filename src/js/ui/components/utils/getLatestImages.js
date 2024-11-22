import AuctionAPI from '../../../api';

const api = new AuctionAPI();
const allListings = await api.listing.getAllListings();

export function getLatestImages() {
  const { data } = allListings;
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
