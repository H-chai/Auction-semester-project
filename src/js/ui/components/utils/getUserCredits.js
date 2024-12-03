import AuctionAPI from '../../../api';

const api = new AuctionAPI();
const loggedInUser = localStorage.getItem('username');
const userProfile = await api.profile.getProfile(loggedInUser);

export function getUserCredits() {
  const { data } = userProfile;

  return data.credits;
}
