export function generateAuthenticatedFooter() {
  const footerContainer = document.createElement('ul');
  footerContainer.classList.add(
    'flex',
    'justify-between',
    'items-center',
    'px-6',
    'py-3',
    'text-blue',
  );

  const home = document.createElement('li');
  home.classList.add('flex', 'justify-center');
  home.innerHTML = `<a href="/" aria-label="View top page"><i class="fa-solid fa-house text-2xl"></i></a>`;

  const create = document.createElement('li');
  create.classList.add('flex', 'justify-center');
  create.innerHTML = `<a href="/listing/create/" aria-label="Create a new listing"><i class="fa-regular fa-square-plus text-2xl"></i></a>`;

  const username = localStorage.getItem('username');
  const profile = document.createElement('li');
  profile.classList.add('flex', 'justify-center');
  const profileLink = document.createElement('a');
  profileLink.setAttribute('aria-label', 'View profile page');
  profileLink.href = `/profile/?name=${username}`;
  const avatar = document.createElement('img');
  avatar.classList.add(
    'user-avatar',
    'w-8',
    'h-8',
    'rounded-full',
    'object-cover',
  );

  profileLink.appendChild(avatar);
  profile.appendChild(profileLink);

  footerContainer.append(home, create, profile);

  return footerContainer;
}
