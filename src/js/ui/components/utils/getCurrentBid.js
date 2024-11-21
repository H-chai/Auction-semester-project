export function getCurrentBid(listing) {
  const bids = listing.bids || [];

  if (bids.length > 0) {
    const bidsAmount = bids.map((bid) => bid.amount);
    const highestBid = Math.max(...bidsAmount);

    return highestBid;
  } else {
    return 0;
  }
}
