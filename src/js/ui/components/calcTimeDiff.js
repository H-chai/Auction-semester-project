export function calcTimeDiff(listing) {
  const endsAt = listing.endsAt;
  const endDate = new Date(endsAt).getTime();
  const loadDate = new Date().getTime();
  const diff = endDate - loadDate;

  return diff;
}
