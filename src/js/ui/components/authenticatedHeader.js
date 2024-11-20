export function generateAuthenticatedHeader() {
  const headerContainer = document.createElement('div');
  headerContainer.classList.add(
    'flex',
    'justify-between',
    'items-center',
    'w-full',
  );

  const logoContainer = document.createElement('a');
  logoContainer.href = '/';
  logoContainer.classList.add('block', 'w-1/3', 'md:w-1/6', 'lg:mb-4');
  const logoImage = document.createElement('img');
  logoImage.src = '../../../../images/Logo.svg';
  logoImage.alt = 'CrediBid logo';
  logoContainer.appendChild(logoImage);

  const pcNavigation = document.createElement('nav');
  pcNavigation.classList.add(
    'hidden',
    'lg:flex',
    'gap-6',
    'items-center',
    'font-display',
    'font-semibold',
  );
  const createLink = document.createElement('a');
  createLink.href = '../../../../listing/create/';
  createLink.classList.add(
    'creating-btn',
    'px-8',
    'py-3',
    'mb-4',
    'bg-orange',
    'text-black',
    'rounded-md',
    'relative',
    'transition',
    'duration-500',
    'hover:text-orange',
  );
  createLink.textContent = 'Create Listing';
  const userIconContainer = document.createElement('div');
  userIconContainer.classList.add('relative', 'group');
  const userIconImage = document.createElement('img');
  userIconImage.src = '../../../../images/image copy.png';
  userIconImage.alt = 'User Avatar';
  userIconImage.classList.add(
    'w-12',
    'h-12',
    'rounded-full',
    'cursor-pointer',
    'mb-4',
  );
  const dropDownMenu = document.createElement('div');
  dropDownMenu.classList.add(
    'absolute',
    'top-full',
    'right-0',
    'bg-white',
    'px-16',
    'py-10',
    'rounded-md',
    'opacity-0',
    'pointer-events-none',
    'transition-all',
    'duration-300',
    'ease-linear',
    'border',
    'border-outline-light',
    'group-hover:opacity-100',
    'group-hover:pointer-events-auto',
  );
  const menuList = document.createElement('ul');
  const listItemProfile = document.createElement('li');
  listItemProfile.classList.add('mb-4');
  const profileLink = document.createElement('a');
  profileLink.classList.add(
    'my-page',
    'flex',
    'items-center',
    'text-black',
    'cursor-pointer',
    'hover:text-blue',
  );
  const profileIcon = document.createElement('i');
  profileIcon.classList.add('fa-regular', 'fa-user', 'text-sm', 'mr-2');
  const profileLinkText = document.createElement('span');
  profileLinkText.classList.add('whitespace-nowrap');
  profileLinkText.textContent = 'Profile';
  const listItemLogout = document.createElement('li');
  const logoutButton = document.createElement('button');
  logoutButton.classList.add(
    'flex',
    'items-center',
    'text-black',
    'hover:text-blue',
  );
  const logoutIcon = document.createElement('i');
  logoutIcon.classList.add(
    'fa-solid',
    'fa-right-from-bracket',
    'text-sm',
    'mr-2',
  );
  const logoutButtonText = document.createElement('span');
  logoutButtonText.classList.add('whitespace-nowrap');
  logoutButtonText.textContent = 'Log out';

  profileLink.append(profileIcon, profileLinkText);
  logoutButton.append(logoutIcon, logoutButtonText);
  listItemProfile.appendChild(profileLink);
  listItemLogout.appendChild(logoutButton);
  menuList.append(listItemProfile, listItemLogout);
  dropDownMenu.appendChild(menuList);
  userIconContainer.append(userIconImage, dropDownMenu);
  pcNavigation.append(createLink, userIconContainer);

  const mobileNavigation = document.createElement('nav');
  mobileNavigation.classList.add('lg:hidden');
  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.id = 'menu-btn';
  checkBox.classList.add('menu-btn', 'hidden');
  const checkBoxLabel = document.createElement('label');
  checkBoxLabel.htmlFor = 'menu-btn';
  checkBoxLabel.classList.add(
    'menu-icon',
    'inline-block',
    'relative',
    'cursor-pointer',
    'py-6',
    'px-3',
  );
  const hamburgerMenuIcon = document.createElement('span');
  hamburgerMenuIcon.classList.add(
    'navicon',
    'bg-blue',
    'relative',
    'h-[2px]',
    'w-[28px]',
    'block',
  );
  const menuBox = document.createElement('ul');
  menuBox.classList.add(
    'menu-box',
    'bg-off-white',
    'fixed',
    'top-0',
    '-right-full',
    'invisible',
    'm-0',
    'py-20',
    'list-none',
    'h-full',
    'w-4/5',
    'font-display',
    'z-40',
    'flex',
    'flex-col',
    'justify-between',
  );
  const itemContainer = document.createElement('div');
  const menuBoxProfile = document.createElement('li');
  const menuBoxProfileLink = document.createElement('a');
  menuBoxProfileLink.classList.add(
    'my-page',
    'flex',
    'justify-center',
    'items-center',
    'text-blue',
    'menu-item',
    'py-3',
    'px-6',
    'font-semibold',
    'text-xl',
    'w-fit',
    'mx-auto',
    'mb-3',
  );
  const menuBoxProfileIcon = document.createElement('i');
  menuBoxProfileIcon.classList.add('fa-regular', 'fa-user', 'mr-2');
  const menuBoxProfileLinkText = document.createElement('span');
  menuBoxProfileLinkText.textContent = 'Profile';
  const menuBoxLogout = document.createElement('li');
  const menuBoxLogoutButton = document.createElement('button');
  menuBoxLogoutButton.classList.add(
    'my-page',
    'flex',
    'justify-center',
    'items-center',
    'text-blue',
    'menu-item',
    'py-3',
    'px-6',
    'font-semibold',
    'text-xl',
    'w-fit',
    'mx-auto',
  );
  const menuBoxLogoutIcon = document.createElement('i');
  menuBoxLogoutIcon.classList.add('fa-solid', 'fa-right-from-bracket', 'mr-2');
  const menuBoxLogoutButtonText = document.createElement('span');
  menuBoxLogoutButtonText.textContent = 'Log out';

  const footer = document.createElement('div');
  footer.classList.add(
    'text-xs',
    'text-black',
    'flex',
    'justify-center',
    'gap-6',
  );
  const termsOfUse = document.createElement('li');
  termsOfUse.textContent = 'Terms of Use';
  const privacyPolicy = document.createElement('li');
  privacyPolicy.textContent = 'Privacy Policy';

  menuBoxProfileLink.append(menuBoxProfileIcon, menuBoxProfileLinkText);
  menuBoxProfile.appendChild(menuBoxProfileLink);
  menuBoxLogoutButton.append(menuBoxLogoutIcon, menuBoxLogoutButtonText);
  menuBoxLogout.appendChild(menuBoxLogoutButton);
  itemContainer.append(menuBoxProfile, menuBoxLogout);
  footer.append(termsOfUse, privacyPolicy);
  menuBox.append(itemContainer, footer);
  checkBoxLabel.appendChild(hamburgerMenuIcon);
  mobileNavigation.append(checkBox, checkBoxLabel, menuBox);

  headerContainer.append(logoContainer, pcNavigation, mobileNavigation);

  return headerContainer;
}
