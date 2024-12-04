export function generateUnAuthenticatedHeader() {
  const headerContainer = document.createElement('div');
  headerContainer.classList.add(
    'flex',
    'justify-between',
    'items-center',
    'w-full',
  );

  const logoContainer = document.createElement('a');
  logoContainer.href = '/';
  logoContainer.setAttribute('aria-label', 'View top page');
  logoContainer.classList.add('block', 'w-1/3', 'md:w-1/6', 'lg:mb-4');
  const logoImage = document.createElement('img');
  logoImage.src = '../../../../../images/Logo.svg';
  logoImage.alt = 'CrediBid logo';
  logoContainer.appendChild(logoImage);

  const pcNavigation = document.createElement('nav');
  pcNavigation.classList.add(
    'hidden',
    'lg:block',
    'font-display',
    'font-semibold',
    'text-base',
  );
  const loginLink = document.createElement('a');
  loginLink.setAttribute('aria-label', 'To login page');
  loginLink.href = '/auth/login/';
  loginLink.classList.add(
    'px-8',
    'py-3',
    'bg-white',
    'text-blue',
    'rounded-md',
    'mr-6',
    'font-semibold',
    'hover:underline',
  );
  loginLink.textContent = 'Log in';
  const signupLink = document.createElement('a');
  signupLink.setAttribute('aria-label', 'To sign up page');
  signupLink.href = '/auth/register/';
  signupLink.classList.add('btn-blue', 'px-8', 'py-4', 'lg:text-base');
  signupLink.textContent = 'Sign up';

  const mobileNavigation = document.createElement('nav');
  mobileNavigation.classList.add('lg:hidden');
  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.id = 'menu-btn';
  checkBox.classList.add('menu-btn', 'hidden', 'peer');
  const checkBoxLabel = document.createElement('label');
  checkBoxLabel.htmlFor = 'menu-btn';
  checkBoxLabel.classList.add(
    'menu-icon',
    'inline-block',
    'relative',
    'cursor-pointer',
    'w-12',
    'h-12',
    'flex',
    'justify-center',
    'items-center',
    'bg-white',
    'rounded-full',
  );
  const hamburgerMenuIcon = document.createElement('span');
  hamburgerMenuIcon.classList.add(
    'navicon',
    'bg-blue',
    'relative',
    'h-[2px]',
    'w-[24px]',
    'block',
    'duration-[395ms]',
    'ease-custom-ease',
    'delay-[100.8ms]',
    'custom-before',
    'custom-after',
  );
  const menuBox = document.createElement('ul');
  menuBox.classList.add(
    'menu-box',
    'peer-checked:visible',
    'peer-checked:right-0',
    'shadow-custom',
    'duration-[375ms]',
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
  const menuBoxLogin = document.createElement('li');
  menuBoxLogin.classList.add('text-center');
  const menuBoxLoginLink = document.createElement('a');
  menuBoxLoginLink.setAttribute('aria-label', 'To login page');
  menuBoxLoginLink.href = '/auth/login/';
  menuBoxLoginLink.textContent = 'Log in';
  menuBoxLoginLink.classList.add(
    'menu-item',
    'text-blue',
    'inline-block',
    'py-3',
    'px-6',
    'font-semibold',
    'text-xl',
    'mb-7',
  );
  const menuBoxSignup = document.createElement('li');
  menuBoxSignup.classList.add('text-center');
  const menuBoxSignupLink = document.createElement('a');
  menuBoxSignupLink.setAttribute('aria-label', 'To sign up page');
  menuBoxSignupLink.href = '/auth/register/';
  menuBoxSignupLink.textContent = 'Sign up';
  menuBoxSignupLink.classList.add(
    'menu-item',
    'text-white',
    'bg-blue',
    'rounded-md',
    'inline-block',
    'py-3',
    'px-6',
    'font-semibold',
    'text-xl',
  );

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

  pcNavigation.append(loginLink, signupLink);
  checkBoxLabel.appendChild(hamburgerMenuIcon);
  menuBoxLogin.appendChild(menuBoxLoginLink);
  menuBoxSignup.appendChild(menuBoxSignupLink);
  itemContainer.append(menuBoxLogin, menuBoxSignup);
  footer.append(termsOfUse, privacyPolicy);
  menuBox.append(itemContainer, footer);
  mobileNavigation.append(checkBox, checkBoxLabel, menuBox);
  headerContainer.append(logoContainer, pcNavigation, mobileNavigation);

  return headerContainer;
}
