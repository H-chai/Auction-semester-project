var X = Object.defineProperty;
var Z = (c, r, e) =>
  r in c
    ? X(c, r, { enumerable: !0, configurable: !0, writable: !0, value: e })
    : (c[r] = e);
var S = (c, r, e) => Z(c, typeof r != 'symbol' ? r + '' : r, e);
(function () {
  const r = document.createElement('link').relList;
  if (r && r.supports && r.supports('modulepreload')) return;
  for (const t of document.querySelectorAll('link[rel="modulepreload"]')) n(t);
  new MutationObserver((t) => {
    for (const s of t)
      if (s.type === 'childList')
        for (const a of s.addedNodes)
          a.tagName === 'LINK' && a.rel === 'modulepreload' && n(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(t) {
    const s = {};
    return (
      t.integrity && (s.integrity = t.integrity),
      t.referrerPolicy && (s.referrerPolicy = t.referrerPolicy),
      t.crossOrigin === 'use-credentials'
        ? (s.credentials = 'include')
        : t.crossOrigin === 'anonymous'
          ? (s.credentials = 'omit')
          : (s.credentials = 'same-origin'),
      s
    );
  }
  function n(t) {
    if (t.ep) return;
    t.ep = !0;
    const s = e(t);
    fetch(t.href, s);
  }
})();
const _ = '42d1daed-d7a5-4f39-b3da-5f11248409c0',
  J = 'https://v2.api.noroff.dev',
  ee = `${J}/auth`,
  te = `${J}/auction`;
function P(c) {
  const r = new Headers();
  return (
    r.append('X-Noroff-API-Key', _),
    localStorage.token &&
      r.append('Authorization', `Bearer ${localStorage.token}`),
    c && r.append('Content-type', 'application/json'),
    r
  );
}
const g = class g {
  constructor() {
    S(this, 'auth', {
      register: async ({ name: r, email: e, password: n }) => {
        const t = JSON.stringify({ name: r, email: e, password: n }),
          s = await fetch(g.paths.register, {
            headers: P(!0),
            method: 'POST',
            body: t,
          });
        return await g.responseHandler.handleResponse(s);
      },
      login: async ({ email: r, password: e }) => {
        const n = JSON.stringify({ email: r, password: e }),
          t = await fetch(g.paths.login, {
            headers: P(!0),
            method: 'POST',
            body: n,
          }),
          { data: s } = await g.responseHandler.handleResponse(t),
          { accessToken: a, name: i } = s;
        (g.token = a), (g.username = i);
        const u = (await this.profile.getProfile(i)).data.credits;
        return (g.credits = u), s;
      },
    });
    S(this, 'profile', {
      getProfile: async (r) => {
        const e = await fetch(`${g.paths.profiles}/${r}`, {
          headers: P(),
          method: 'GET',
        });
        return await g.responseHandler.handleResponse(e);
      },
      updateProfile: async (r, { bio: e, banner: n, avatar: t }) => {
        const s = JSON.stringify({ bio: e, banner: n, avatar: t }),
          a = await fetch(`${g.paths.profiles}/${r}`, {
            headers: P(!0),
            method: 'PUT',
            body: s,
          });
        await g.responseHandler.handleResponse(a),
          (window.location.href = `/profile/?name=${r}`);
      },
    });
    S(this, 'listing', {
      get24Listings: async (
        r = 24,
        e = 1,
        n = 'created',
        t = 'desc',
        s = 'true',
      ) => {
        const a = new URL(g.paths.listings);
        a.searchParams.append('limit', r),
          a.searchParams.append('page', e),
          a.searchParams.append('_seller', !0),
          a.searchParams.append('_bids', !0),
          a.searchParams.append('_active', s),
          a.searchParams.append('sort', n),
          a.searchParams.append('sortOrder', t);
        const i = await fetch(a.toString(), { headers: P(), method: 'GET' });
        return await g.responseHandler.handleResponse(i);
      },
      getAllListings: async () => {
        const r = await fetch(g.paths.listings, {
          headers: P(),
          method: 'GET',
        });
        return await g.responseHandler.handleResponse(r);
      },
      getSingleListing: async (r) => {
        const e = new URL(`${g.paths.listings}/${r}`);
        e.searchParams.append('_seller', !0),
          e.searchParams.append('_bids', !0);
        const n = await fetch(e.toString(), { headers: P(), method: 'GET' });
        return await g.responseHandler.handleResponse(n);
      },
      getUsersListings: async (
        r = 24,
        e = 1,
        n = 'created',
        t = 'desc',
        s = 'true',
        a,
      ) => {
        const i = new URL(`${g.paths.profiles}/${a}/listings`);
        i.searchParams.append('limit', r),
          i.searchParams.append('page', e),
          i.searchParams.append('_seller', !0),
          i.searchParams.append('_bids', !0),
          i.searchParams.append('_active', s),
          i.searchParams.append('sort', n),
          i.searchParams.append('sortOrder', t);
        const o = await fetch(i.toString(), { headers: P(), method: 'GET' });
        return await g.responseHandler.handleResponse(o);
      },
      create: async ({ title: r, description: e, media: n, endsAt: t }) => {
        const s = JSON.stringify({
            title: r,
            description: e,
            media: n,
            endsAt: t,
          }),
          a = await fetch(g.paths.listings, {
            headers: P(!0),
            method: 'POST',
            body: s,
          }),
          { data: i } = await g.responseHandler.handleResponse(a);
        return i;
      },
      update: async (r, { title: e, description: n, media: t }) => {
        const s = JSON.stringify({ title: e, description: n, media: t }),
          a = await fetch(`${g.paths.listings}/${r}`, {
            headers: P(!0),
            method: 'PUT',
            body: s,
          });
        await g.responseHandler.handleResponse(a),
          (window.location.href = `/listing/?id=${r}`);
      },
      delete: async (r) => {
        const e = await fetch(`${g.paths.listings}/${r}`, {
          headers: P(!0),
          method: 'DELETE',
        });
        await g.responseHandler.handleResponse(e);
        const n = localStorage.getItem('username');
        window.location.href = `/profile/?name=${n}`;
      },
      search: async (r, e = 24, n = 1, t = 'created', s = 'desc') => {
        const a = new URL(g.paths.search);
        a.searchParams.append('limit', e),
          a.searchParams.append('page', n),
          a.searchParams.append('_seller', !0),
          a.searchParams.append('_bids', !0),
          a.searchParams.append('sort', t),
          a.searchParams.append('sortOrder', s),
          a.searchParams.append('q', r);
        const i = await fetch(a.toString(), { headers: P(!0), method: 'GET' });
        return await g.responseHandler.handleResponse(i);
      },
    });
    S(this, 'bid', {
      bid: async (r, { amount: e }) => {
        const n = JSON.stringify({ amount: e }),
          t = await fetch(`${g.paths.listings}/${r}/bids`, {
            headers: P(!0),
            method: 'POST',
            body: n,
          }),
          { data: s } = await g.responseHandler.handleResponse(t);
        return s;
      },
    });
  }
  static set token(r) {
    localStorage.setItem('token', r);
  }
  static set username(r) {
    localStorage.setItem('username', r);
  }
  static set credits(r) {
    localStorage.setItem('credits', r);
  }
};
S(g, 'apiAuthBase', ee),
  S(g, 'apiAuctionBase', te),
  S(g, 'paths', {
    register: `${g.apiAuthBase}/register`,
    login: `${g.apiAuthBase}/login`,
    listings: `${g.apiAuctionBase}/listings`,
    profiles: `${g.apiAuctionBase}/profiles`,
    search: `${g.apiAuctionBase}/listings/search`,
  }),
  S(g, 'responseHandler', {
    handleResponse: async (r, e, n = 'json') => {
      if (r.ok) return r.status === 204 ? null : await r[n]();
      const s = (await r[n]()).errors[0].message || 'Unknown error';
      throw new Error(`${s}`);
    },
  });
let D = g;
function ne() {
  const c = document.createElement('div');
  c.classList.add('flex', 'justify-between', 'items-center', 'w-full');
  const r = document.createElement('a');
  (r.href = '/'),
    r.setAttribute('aria-label', 'View top page'),
    r.classList.add('block', 'w-1/3', 'md:w-1/6', 'lg:mb-4');
  const e = document.createElement('img');
  (e.src = '/images/Logo.svg'), (e.alt = 'CrediBid logo'), r.appendChild(e);
  const n = document.createElement('nav');
  n.classList.add(
    'hidden',
    'lg:flex',
    'gap-6',
    'items-center',
    'font-display',
    'font-semibold',
  );
  const t = document.createElement('div');
  t.classList.add('update', 'mb-4');
  const s = document.createElement('a');
  (s.href = '/listing/create/'),
    s.setAttribute('aria-label', 'To create listing page'),
    s.classList.add('btn-orange'),
    (s.textContent = 'Create Listing');
  const a = document.createElement('div');
  a.classList.add('relative', 'group');
  const i = document.createElement('img');
  i.setAttribute('aria-label', "User's avatar"),
    i.classList.add(
      'user-avatar',
      'w-12',
      'h-12',
      'rounded-full',
      'cursor-pointer',
      'mb-4',
      'object-cover',
    );
  const o = document.createElement('div');
  o.classList.add(
    'absolute',
    'z-10',
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
  const u = document.createElement('ul'),
    d = document.createElement('li');
  d.classList.add('mb-4');
  const f = document.createElement('a');
  f.setAttribute('aria-label', 'View profile page'),
    f.classList.add(
      'flex',
      'items-center',
      'text-black',
      'cursor-pointer',
      'hover:text-blue',
    );
  const b = localStorage.getItem('username');
  f.href = `/profile/?name=${b}`;
  const h = document.createElement('i');
  h.classList.add('fa-regular', 'fa-user', 'text-sm', 'mr-2');
  const y = document.createElement('span');
  y.classList.add('whitespace-nowrap'), (y.textContent = 'Profile');
  const p = document.createElement('li'),
    m = document.createElement('button');
  m.setAttribute('aria-label', 'Log out'),
    m.classList.add(
      'logout-button',
      'flex',
      'items-center',
      'text-black',
      'hover:text-blue',
    );
  const l = document.createElement('i');
  l.classList.add('fa-solid', 'fa-right-from-bracket', 'text-sm', 'mr-2');
  const w = document.createElement('span');
  w.classList.add('whitespace-nowrap'),
    (w.textContent = 'Log out'),
    f.append(h, y),
    m.append(l, w),
    d.appendChild(f),
    p.appendChild(m),
    u.append(d, p),
    o.appendChild(u),
    a.append(i, o),
    n.append(t, s, a);
  const L = document.createElement('nav');
  L.classList.add('lg:hidden');
  const x = document.createElement('input');
  (x.type = 'checkbox'),
    (x.id = 'menu-btn'),
    x.classList.add('menu-btn', 'hidden', 'peer');
  const v = document.createElement('label');
  (v.htmlFor = 'menu-btn'),
    v.classList.add(
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
  const C = document.createElement('span');
  C.classList.add(
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
  const E = document.createElement('ul');
  E.classList.add(
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
  const I = document.createElement('div'),
    T = document.createElement('li'),
    B = document.createElement('a');
  B.setAttribute('aria-label', 'View profile page'),
    (B.href = `/profile/?name=${b}`),
    B.classList.add(
      'menu-item',
      'duration-[250ms]',
      'flex',
      'justify-center',
      'items-center',
      'text-blue',
      'py-3',
      'px-6',
      'font-semibold',
      'text-xl',
      'w-fit',
      'mx-auto',
      'mb-3',
    );
  const q = document.createElement('i');
  q.classList.add('fa-regular', 'fa-user', 'mr-2');
  const U = document.createElement('span');
  U.textContent = 'Profile';
  const j = document.createElement('li'),
    R = document.createElement('button');
  R.setAttribute('aria-label', 'Log out'),
    R.classList.add(
      'logout-button',
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
  const F = document.createElement('i');
  F.classList.add('fa-solid', 'fa-right-from-bracket', 'mr-2');
  const H = document.createElement('span');
  H.textContent = 'Log out';
  const k = document.createElement('div');
  k.classList.add('text-xs', 'text-black', 'flex', 'justify-center', 'gap-6');
  const $ = document.createElement('li');
  $.textContent = 'Terms of Use';
  const O = document.createElement('li');
  return (
    (O.textContent = 'Privacy Policy'),
    B.append(q, U),
    T.appendChild(B),
    R.append(F, H),
    j.appendChild(R),
    I.append(T, j),
    k.append($, O),
    E.append(I, k),
    v.appendChild(C),
    L.append(x, v, E),
    c.append(r, n, L),
    c
  );
}
function z(c) {
  const r = c.endsAt,
    e = new Date(r).getTime(),
    n = new Date().getTime();
  return e - n;
}
function se(c) {
  const r = c.bids || [];
  if (r.length > 0) {
    const e = r.map((t) => t.amount);
    return Math.max(...e);
  } else return 0;
}
function K(c) {
  const r = se(c),
    e = z(c),
    n = Math.floor(e / (1e3 * 60 * 60 * 24)),
    t = document.createElement('li'),
    s = document.createElement('p');
  if (
    (s.classList.add(
      'text-xs',
      'text-gray',
      'font-medium',
      'mb-1',
      'lg:text-sm',
    ),
    n >= 0)
  )
    if (r) {
      s.textContent = 'Current bid';
      const a = document.createElement('p');
      a.classList.add('text-2xl', 'font-semibold', 'lg:text-3xl'),
        (a.textContent = r);
      const i = document.createElement('span');
      return (
        (i.textContent = 'credits'),
        i.classList.add('text-xs', 'font-semibold', 'ml-1', 'lg:text-base'),
        a.appendChild(i),
        t.append(s, a),
        t
      );
    } else {
      s.textContent = 'Current bid';
      const a = document.createElement('p');
      a.classList.add('text-2xl', 'font-semibold', 'lg:text-2xl');
      const i = document.createElement('span');
      return (
        (i.textContent = 'No bids yet'),
        i.classList.add('text-base', 'font-semibold'),
        a.appendChild(i),
        t.append(s, a),
        t
      );
    }
  else if (r) {
    s.textContent = 'Final bid';
    const a = document.createElement('p');
    a.classList.add('text-2xl', 'font-semibold', 'lg:text-2xl'),
      (a.textContent = r);
    const i = document.createElement('span');
    return (
      (i.textContent = 'credits'),
      i.classList.add('text-xs', 'font-semibold', 'ml-1'),
      a.appendChild(i),
      t.append(s, a),
      t
    );
  } else {
    s.textContent = 'Final bid';
    const a = document.createElement('p');
    a.classList.add('text-2xl', 'font-semibold', 'lg:text-2xl');
    const i = document.createElement('span');
    return (
      (i.textContent = 'No bids placed'),
      i.classList.add('text-base', 'font-semibold'),
      a.appendChild(i),
      t.append(s, a),
      t
    );
  }
}
function W(c) {
  const r = z(c),
    e = Math.floor(r / (1e3 * 60 * 60 * 24)),
    n = Math.floor(r / (1e3 * 60 * 60)),
    t = Math.floor((r % (1e3 * 60 * 60)) / (1e3 * 60)),
    s = document.createElement('li'),
    a = document.createElement('p');
  if (
    (a.classList.add(
      'text-xs',
      'text-gray',
      'font-medium',
      'mb-1',
      'lg:text-sm',
    ),
    e > 0)
  ) {
    a.textContent = 'Ending in';
    const i = document.createElement('p');
    i.classList.add('text-2xl', 'font-semibold', 'lg:text-3xl'),
      (i.textContent = e);
    const o = document.createElement('span');
    return (
      (o.textContent = 'days left'),
      o.classList.add('text-xs', 'font-semibold', 'ml-1', 'lg:text-base'),
      i.appendChild(o),
      s.append(a, i),
      s
    );
  } else if (e === 0) {
    a.textContent = 'Ending in';
    const i = document.createElement('p');
    i.classList.add('text-2xl', 'font-semibold', 'lg:text-3xl', 'inline-block'),
      (i.textContent = n);
    const o = document.createElement('span');
    (o.textContent = 'h'),
      o.classList.add('text-xs', 'font-semibold', 'ml-1', 'lg:text-base'),
      i.appendChild(o);
    const u = document.createElement('p');
    u.classList.add(
      'text-2xl',
      'font-semibold',
      'lg:text-3xl',
      'inline-block',
      'ml-2',
    ),
      (u.textContent = t);
    const d = document.createElement('span');
    return (
      (d.textContent = 'm'),
      d.classList.add('text-xs', 'font-semibold', 'ml-1', 'lg:text-base'),
      u.appendChild(d),
      s.append(a, i, u),
      s
    );
  } else {
    a.textContent = 'Bid closed';
    const i = document.createElement('div');
    i.classList.add('h-[32px]', 'flex', 'items-center', 'justify-center');
    const o = document.createElement('span');
    return (
      o.classList.add('h-[2px]', 'w-[20px]', 'block', 'bg-light-gray'),
      i.appendChild(o),
      s.append(a, i),
      s
    );
  }
}
function V(c) {
  var o;
  const r = document.createElement('a');
  r.setAttribute('aria-label', 'View this listing page'),
    r.classList.add(
      'border',
      'border-outline-light',
      'rounded-md',
      'px-4',
      'pt-6',
      'pb-8',
      'transition',
      'duration-300',
      'ease-linear',
      'group',
      'hover:shadow-[0_0_24px_rgba(33,33,33,0.1)]',
      'lg:pb-8',
    ),
    (r.id = c.id),
    (r.href = `/listing/?id=${c.id}`);
  const e = document.createElement('figure');
  e.classList.add('aspect-square', 'overflow-hidden', 'rounded-md', 'mb-3');
  const n = document.createElement('img');
  n.classList.add(
    'object-cover',
    'object-center',
    'aspect-square',
    'w-full',
    'rounded-md',
    'transition',
    'duration-300',
    'ease-linear',
    'group-hover:scale-105',
  ),
    (o = c.media) != null && o[0]
      ? ((n.src = c.media[0].url), (n.alt = c.media[0].alt))
      : ((n.src = '/images/noImageAvailable.svg'),
        (n.alt = 'No image available')),
    e.appendChild(n);
  const t = document.createElement('h1');
  (t.textContent = c.title),
    t.classList.add(
      'font-display',
      'font-bold',
      'text-2xl',
      'mb-4',
      'break-words',
      'pb-3',
      'border-b',
      'border-outline-light',
      'lg:text-3xl',
    );
  const s = document.createElement('ul');
  s.classList.add('flex', 'justify-between', 'items-center', 'lg:px-2');
  const a = K(c),
    i = W(c);
  return s.append(a, i), r.append(e, t, s), r;
}
function ae() {
  const c = document.createElement('div');
  c.classList.add('flex', 'justify-between', 'items-center', 'w-full');
  const r = document.createElement('a');
  (r.href = '/'),
    r.setAttribute('aria-label', 'View top page'),
    r.classList.add('block', 'w-1/3', 'md:w-1/6', 'lg:mb-4');
  const e = document.createElement('img');
  (e.src = '/images/Logo.svg'), (e.alt = 'CrediBid logo'), r.appendChild(e);
  const n = document.createElement('nav');
  n.classList.add(
    'hidden',
    'lg:block',
    'font-display',
    'font-semibold',
    'text-base',
  );
  const t = document.createElement('a');
  t.setAttribute('aria-label', 'To login page'),
    (t.href = '/auth/login/'),
    t.classList.add(
      'px-8',
      'py-3',
      'bg-white',
      'text-blue',
      'rounded-md',
      'mr-6',
      'font-semibold',
      'hover:underline',
    ),
    (t.textContent = 'Log in');
  const s = document.createElement('a');
  s.setAttribute('aria-label', 'To sign up page'),
    (s.href = '/auth/register/'),
    s.classList.add('btn-blue', 'px-8', 'py-4', 'lg:text-base'),
    (s.textContent = 'Sign up');
  const a = document.createElement('nav');
  a.classList.add('lg:hidden');
  const i = document.createElement('input');
  (i.type = 'checkbox'),
    (i.id = 'menu-btn'),
    i.classList.add('menu-btn', 'hidden', 'peer');
  const o = document.createElement('label');
  (o.htmlFor = 'menu-btn'),
    o.classList.add(
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
  const u = document.createElement('span');
  u.classList.add(
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
  const d = document.createElement('ul');
  d.classList.add(
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
  const f = document.createElement('div'),
    b = document.createElement('li');
  b.classList.add('text-center');
  const h = document.createElement('a');
  h.setAttribute('aria-label', 'To login page'),
    (h.href = '/auth/login/'),
    (h.textContent = 'Log in'),
    h.classList.add(
      'menu-item',
      'text-blue',
      'inline-block',
      'py-3',
      'px-6',
      'font-semibold',
      'text-xl',
      'mb-7',
    );
  const y = document.createElement('li');
  y.classList.add('text-center');
  const p = document.createElement('a');
  p.setAttribute('aria-label', 'To sign up page'),
    (p.href = '/auth/register/'),
    (p.textContent = 'Sign up'),
    p.classList.add(
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
  const m = document.createElement('div');
  m.classList.add('text-xs', 'text-black', 'flex', 'justify-center', 'gap-6');
  const l = document.createElement('li');
  l.textContent = 'Terms of Use';
  const w = document.createElement('li');
  return (
    (w.textContent = 'Privacy Policy'),
    n.append(t, s),
    o.appendChild(u),
    b.appendChild(h),
    y.appendChild(p),
    f.append(b, y),
    m.append(l, w),
    d.append(f, m),
    a.append(i, o, d),
    c.append(r, n, a),
    c
  );
}
const re = new D();
async function ie() {
  return await re.listing.get24Listings();
}
async function oe() {
  const c = await ie(),
    { data: r } = c;
  return r
    .map((a) => a.media[0])
    .filter((a) => a !== void 0)
    .map((a) => a.url)
    .slice(0, 3);
}
function le(c) {
  const r = document.createElement('div');
  r.classList.add('md:w-4/5', 'md:mx-auto', 'lg:w-full');
  const e = document.createElement('div');
  e.classList.add('lg:flex', 'lg:items-start', 'lg:gap-20');
  const n = document.createElement('div');
  n.classList.add('lg:w-1/2', 'flex', 'flex-col', 'items-center');
  const t = document.createElement('div');
  t.classList.add('main-image', 'mb-6', 'w-full');
  const s = document.createElement('img'),
    a = c.media;
  a != null && a[0]
    ? ((s.src = a[0].url), (s.alt = a[0].alt))
    : ((s.src = '/images/noImageAvailable.svg'),
      (s.alt = 'No image available')),
    s.classList.add(
      'aspect-square',
      'rounded-md',
      'object-cover',
      'object-center',
      'w-full',
      'md:aspect-4/3',
    ),
    t.appendChild(s);
  const i = document.createElement('div');
  i.classList.add('flex', 'items-center', 'flex-wrap', 'gap-2', 'mb-6'),
    a.forEach((k) => {
      const $ = document.createElement('button');
      $.setAttribute('aria-label', 'View the listing image');
      const O = document.createElement('img');
      O.classList.add(
        'w-14',
        'opacity-70',
        'aspect-square',
        'rounded-md',
        'object-cover',
        'object-center',
        'md:aspect-4/3',
        'lg:w-20',
      ),
        (O.src = k.url),
        (O.alt = k.alt),
        $.appendChild(O),
        i.appendChild($),
        $.addEventListener('click', () => {
          t.innerHTML = `<img src=${k.url} alt=${k.alt} class="aspect-square rounded-md object-cover object-center w-full md:aspect-4/3">`;
        });
    }),
    n.append(t, i);
  const o = document.createElement('div');
  o.classList.add('lg:w-1/2');
  const u = document.createElement('div');
  u.classList.add(
    'update',
    'font-semibold',
    'font-display',
    'mb-3',
    'text-end',
    'lg:hidden',
  );
  const d = document.createElement('h1');
  (d.textContent = c.title),
    d.classList.add(
      'text-2xl',
      'font-display',
      'font-bold',
      'mb-2',
      'break-words',
    );
  const f = document.createElement('p');
  (f.textContent = c.description), f.classList.add('text-base', 'mb-6');
  const b = document.createElement('ul');
  b.classList.add('flex', 'justify-between', 'items-center', 'mb-6');
  const h = K(c),
    y = W(c);
  b.append(h, y);
  const p = document.createElement('form');
  (p.name = 'bid'), p.classList.add('flex', 'gap-2', 'mb-3');
  const m = document.createElement('label');
  (m.htmlFor = 'bidding'), m.classList.add('w-3/5');
  const l = document.createElement('input');
  (l.name = 'amount'),
    (l.id = 'bidding'),
    (l.type = 'number'),
    (l.placeholder = 'Enter your bid amount'),
    (l.required = !0),
    l.classList.add(
      'border',
      'border-outline',
      'rounded-md',
      'p-4',
      'placeholder-light-gray',
      'w-full',
    );
  const w = document.createElement('button');
  (w.textContent = 'Place a bid'),
    w.setAttribute('aria-label', 'Place a bid'),
    w.classList.add('btn-blue', 'py-4', 'w-2/5', 'lg:text-base'),
    (w.type = 'submit');
  const L = localStorage.getItem('username');
  c.seller.name === L &&
    ((l.disabled = !0),
    (l.style.cursor = 'not-allowed'),
    (l.placeholder = 'Bidding disabled'),
    (w.disabled = !0),
    (w.style.cursor = 'not-allowed')),
    m.appendChild(l),
    p.append(m, w);
  const x = document.createElement('p');
  (x.textContent = 'Your current credits:'), x.classList.add('text-sm', 'mb-8');
  const v = document.createElement('span');
  (v.textContent = localStorage.getItem('credits')),
    v.classList.add('font-bold', 'ml-1', 'text-base'),
    x.appendChild(v),
    L ||
      ((l.disabled = !0),
      (l.style.cursor = 'not-allowed'),
      (w.disabled = !0),
      (w.style.cursor = 'not-allowed'),
      (x.textContent = 'Please log in to place a bid on this listing.'),
      x.classList.add('font-medium'));
  const C = document.createElement('div');
  C.classList.add('mb-10');
  const E = document.createElement('p');
  (E.textContent = 'Owner'),
    E.classList.add('text-sm', 'font-medium', 'text-gray', 'mb-2');
  const I = document.createElement('div');
  I.classList.add('flex', 'items-center', 'gap-2', 'justify-start');
  const T = document.createElement('img');
  (T.alt = c.seller.avatar.alt),
    (T.src = c.seller.avatar.url),
    T.classList.add('w-7', 'h-7', 'rounded-full');
  const B = document.createElement('a');
  B.setAttribute('aria-label', "View owner's profile page"),
    (B.textContent = c.seller.name),
    (B.href = `/profile/?name=${c.seller.name}`),
    B.classList.add(
      'font-semibold',
      'text-sm',
      'underline',
      'lg:text-base',
      'lg:font-medium',
    ),
    I.append(T, B),
    C.append(E, I);
  const q = document.createElement('div'),
    U = document.createElement('p');
  (U.textContent = 'Bid history'),
    U.classList.add('text-sm', 'font-medium', 'text-gray');
  const j = document.createElement('ul'),
    R = c.bids;
  if (R.length > 0)
    R.forEach((k) => {
      const $ = document.createElement('li');
      $.classList.add(
        'flex',
        'items-center',
        'justify-between',
        'py-4',
        'border-b',
        'border-outline-light',
      );
      const O = document.createElement('div');
      O.classList.add('flex', 'items-center', 'gap-2');
      const Q = document.createElement('img');
      (Q.src = k.bidder.avatar.url),
        Q.classList.add('w-7', 'h-7', 'rounded-full');
      const N = document.createElement('a');
      N.setAttribute('aria-label', "View bidder's profile page"),
        (N.textContent = k.bidder.name),
        (N.href = `/profile/?name=${k.bidder.name}`),
        N.classList.add(
          'font-semibold',
          'text-sm',
          'underline',
          'lg:text-base',
          'lg:font-medium',
        ),
        O.append(Q, N);
      const M = document.createElement('p');
      (M.textContent = k.amount),
        M.classList.add('lg:text-lg', 'lg:font-medium');
      const G = document.createElement('i');
      G.classList.add('fa-solid', 'fa-coins', 'ml-1.5'),
        M.appendChild(G),
        $.append(O, M),
        j.appendChild($);
    }),
      q.append(U, j);
  else {
    const k = document.createElement('p');
    (k.textContent = 'No bid placed yet'),
      k.classList.add('mt-2', 'font-medium', 'text-sm'),
      q.append(U, k);
  }
  o.append(u, d, f, b, p, x, C, q);
  const F = document.createElement('a');
  F.setAttribute('aria-label', 'Top page'),
    (F.href = '/'),
    (F.textContent = 'See all listings'),
    F.classList.add(
      'inline-block',
      'underline',
      'font-display',
      'font-medium',
      'text-base',
      'mt-8',
      'lg:mt-14',
    );
  const H = document.createElement('i');
  return (
    H.classList.add('fa-solid', 'fa-arrow-left', 'mr-1'),
    F.prepend(H),
    e.append(n, o),
    r.append(e, F),
    r
  );
}
function ce() {
  const c = document.createElement('div');
  c.classList.add(
    'border',
    'border-outline-light',
    'rounded-md',
    'px-4',
    'py-6',
    'animate-pulse',
    'lg:pb-8',
  );
  const r = document.createElement('div');
  r.classList.add(
    'aspect-square',
    'bg-gray-300',
    'rounded-md',
    'mb-3',
    'bg-outline-light',
  );
  const e = document.createElement('div');
  e.classList.add(
    'bg-outline-light',
    'h-6',
    'w-full',
    'rounded',
    'mb-2',
    'lg:pb-3',
    'lg:mb-4',
    'lg:border-b',
    'lg:border-outline-light',
  );
  const n = document.createElement('div');
  n.classList.add('flex', 'justify-between', 'items-center');
  const t = document.createElement('div');
  t.classList.add('bg-outline-light', 'h-4', 'w-1/4', 'rounded');
  const s = document.createElement('div');
  return (
    s.classList.add('bg-outline-light', 'h-4', 'w-1/4', 'rounded'),
    n.append(t, s),
    c.append(r, e, n),
    c
  );
}
function de() {
  const c = document.createElement('ul');
  c.classList.add(
    'flex',
    'justify-between',
    'items-center',
    'px-6',
    'py-3',
    'text-blue',
  );
  const r = document.createElement('li');
  r.classList.add('flex', 'justify-center'),
    (r.innerHTML =
      '<a href="/" aria-label="View top page"><i class="fa-solid fa-house text-2xl"></i></a>');
  const e = document.createElement('li');
  e.classList.add('flex', 'justify-center'),
    (e.innerHTML =
      '<a href="/listing/create/" aria-label="Create a new listing"><i class="fa-regular fa-square-plus text-2xl"></i></a>');
  const n = localStorage.getItem('username'),
    t = document.createElement('li');
  t.classList.add('flex', 'justify-center');
  const s = document.createElement('a');
  s.setAttribute('aria-label', 'View profile page'),
    (s.href = `/profile/?name=${n}`);
  const a = document.createElement('img');
  return (
    a.classList.add(
      'user-avatar',
      'w-8',
      'h-8',
      'rounded-full',
      'object-cover',
    ),
    s.appendChild(a),
    t.appendChild(s),
    c.append(r, e, t),
    c
  );
}
const A = class A extends D {
  constructor() {
    super();
    S(this, 'views', {
      listingFeed: async () => {
        this.events.headerToggle(),
          this.events.footerToggle(),
          this.events.listing.imageSlider(),
          await this.events.listing.displayListings(),
          this.filtering.openSorting(),
          this.filtering.openFilter(),
          this.events.logout(),
          document.forms.search.addEventListener(
            'submit',
            this.events.listing.search,
          ),
          this.loader.hideLoading();
      },
      register: async () => {
        document.forms.signup.addEventListener('submit', this.events.register);
      },
      login: async () => {
        document.forms.login.addEventListener('submit', this.events.login);
      },
      listing: async () => {
        this.events.headerToggle(),
          this.events.footerToggle(),
          await this.events.listing.displaySingleListing(),
          this.events.logout(),
          this.loader.hideLoading();
      },
      listingCreate: async () => {
        this.events.headerToggle(),
          this.events.footerToggle(),
          this.events.logout(),
          document.forms.createListing.addEventListener(
            'submit',
            this.events.listing.create,
          ),
          this.events.listing.addImage(),
          this.loader.hideLoading();
      },
      listingUpdate: async () => {
        this.events.headerToggle(),
          this.events.footerToggle(),
          this.events.logout(),
          this.events.listing.update(),
          this.events.listing.delete(),
          this.events.listing.addImage(),
          this.loader.hideLoading();
      },
      profile: async () => {
        this.events.headerToggle(),
          this.events.footerToggle(),
          this.events.profile.displayProfile(),
          this.events.profile.displayUpdateProfileButton(),
          this.filtering.openSorting(),
          this.filtering.openFilter(),
          this.events.logout(),
          this.loader.hideLoading();
      },
      profileUpdate: async () => {
        this.events.headerToggle(),
          this.events.footerToggle(),
          this.events.logout(),
          this.events.profile.updateProfile(),
          this.loader.hideLoading();
      },
    });
    S(this, 'events', {
      register: async (e) => {
        const n = A.form.formSubmit(e),
          { name: t, email: s } = n;
        try {
          await this.auth.register(n),
            alert(`Thank you for registering!
Username: ${t}
Email: ${s}
You've received 1000 credits to get started.`),
            (window.location.href = '/auth/login/');
        } catch (a) {
          alert(`Could not register this account.
${a.message}.
Please try again.`);
        }
      },
      login: async (e) => {
        const n = A.form.formSubmit(e);
        try {
          await this.auth.login(n),
            alert('You have successfully logged in!'),
            (window.location.href = '/');
        } catch (t) {
          alert(`Could not log in with this account.
${t.message}.
Please try again.`);
        }
      },
      headerToggle: () => {
        const e = localStorage.getItem('token'),
          n = document.querySelector('header');
        if (e) {
          const t = ne();
          n.appendChild(t), this.avatar.userAvatar();
        } else {
          const t = ae();
          n.appendChild(t);
        }
      },
      footerToggle: () => {
        const e = localStorage.getItem('token'),
          n = document.querySelector('.authenticated-footer');
        if (e) {
          const t = de();
          n.appendChild(t), this.avatar.userAvatar();
        } else return 0;
      },
      logout: () => {
        document.querySelectorAll('.logout-button').forEach((n) => {
          n.addEventListener('click', (t) => {
            t.preventDefault(),
              localStorage.removeItem('token'),
              localStorage.removeItem('username'),
              localStorage.removeItem('credits'),
              alert('You have successfully logged out.'),
              (window.location.href = '/');
          });
        });
      },
      listing: {
        displaySkeleton: (e) => {
          const n = document.querySelector('.listings-container');
          n.innerHTML = '';
          const t = document.createDocumentFragment();
          for (let s = 0; s < e; s++) {
            const a = ce();
            t.appendChild(a);
          }
          n.appendChild(t);
        },
        displayListings: async (e = 1, n = 'created', t = 'desc', s = !0) => {
          try {
            const a = document.querySelector('.listings-container'),
              i = await this.listing.get24Listings(24, e, n, t, s),
              { data: o, meta: u } = i,
              { currentPage: d, pageCount: f } = u,
              b = `${window.location.pathname}?page=${e}`;
            window.history.replaceState({}, '', b),
              this.pagination.homePagination(d, f),
              (a.innerHTML = ''),
              o.forEach((h) => {
                const y = V(h);
                a.appendChild(y);
              });
          } catch (a) {
            alert(a.message);
          }
        },
        displaySingleListing: async () => {
          try {
            const n = new URLSearchParams(window.location.search).get('id'),
              t = await this.listing.getSingleListing(n),
              { data: s } = t,
              a = document.querySelector('.listing-item-container');
            a.innerHTML = '';
            const i = le(s);
            a.appendChild(i),
              s.seller.name === A.user &&
                document.querySelectorAll('.update').forEach((b) => {
                  const h = document.createElement('a');
                  (h.textContent = 'Update Listing'),
                    h.classList.add('btn-green'),
                    h.setAttribute('aria-label', 'Update listing'),
                    h.addEventListener('click', () => {
                      window.location.href = `/listing/update/?id=${n}`;
                    }),
                    b.appendChild(h);
                }),
              document.forms.bid.addEventListener('submit', this.events.bid);
            const u = document.querySelector('meta[name="description"]'),
              d = s.description;
            d
              ? u.setAttribute('content', d)
              : u.setAttribute('content', s.title);
          } catch (e) {
            alert(e.message);
          }
        },
        imageSlider: async () => {
          const e = document.querySelector('.image-slider-container');
          e.innerHTML = '';
          const n = await oe();
          for (let t = 0; t < 3; t++) {
            const s = document.createElement('img');
            (s.src = n[t]),
              s.classList.add(
                `img-${t}`,
                'absolute',
                'top-0',
                'bottom-0',
                'right-0',
                'left-0',
                'm-auto',
                'h-full',
                'opacity-0',
                'md:object-contain',
              ),
              e.appendChild(s);
          }
        },
        create: async (e) => {
          e.preventDefault();
          const n = A.form.formSubmit(e),
            { title: t, description: s, endingDate: a, endingTime: i } = n,
            o = document.querySelectorAll('.image-list'),
            u = [],
            d = [];
          o.forEach((p) => {
            const m = p.querySelector('input[name="mediaUrl"]').value,
              l = p.querySelector('input[name="mediaAlt"]').value;
            u.push(m), d.push(l);
          });
          const f = u.map((p, m) => ({ url: p, alt: d[m] })),
            b = `${a}T${i}:00.000Z`,
            y = new Date(b).toISOString();
          try {
            await this.listing.create({
              title: t,
              description: s,
              media: f,
              endsAt: y,
            }),
              alert('You have created a new listing!'),
              (window.location.href = '/');
          } catch (p) {
            alert(`Could not create the listing.
${p.message}.
Please try again.`);
          }
        },
        update: async () => {
          const n = new URLSearchParams(window.location.search).get('id'),
            t = await this.listing.getSingleListing(n),
            { data: s } = t,
            a = document.getElementById('title');
          a.value = s.title;
          const i = document.getElementById('description');
          i.value = s.description;
          const o = s.media,
            u = document.getElementById('img-url');
          u.value = o[0].url;
          const d = document.getElementById('img-alt');
          if (((d.value = o[0].alt), o.length > 1))
            for (let l = 1; l < o.length; l++) {
              const w = document.createElement('div');
              w.classList.add(
                'image-list',
                'flex',
                'justify-between',
                'items-center',
                'gap-2',
                'lg:gap-4',
              );
              const L = document.createElement('label');
              (L.htmlFor = `img-url-${l + 1}`),
                L.classList.add(
                  'url-label',
                  'font-display',
                  'font-semibold',
                  'lg:w-1/2',
                ),
                (L.textContent = 'Image url');
              const x = document.createElement('input');
              (x.type = 'url'),
                (x.name = 'mediaUrl'),
                (x.id = `img-url-${l + 1}`),
                x.classList.add(
                  'border',
                  'border-outline',
                  'p-4',
                  'block',
                  'w-full',
                  'rounded-md',
                  'mt-1',
                  'mb-4',
                ),
                (x.value = o[l].url),
                L.appendChild(x);
              const v = document.createElement('label');
              (v.htmlFor = `img-alt-${l + 1}`),
                v.classList.add('font-display', 'font-semibold', 'lg:w-1/2'),
                (v.textContent = 'Image alt');
              const C = document.createElement('input');
              (C.type = 'alt'),
                (C.name = 'mediaAlt'),
                (C.id = `img-alt-${l + 1}`),
                C.classList.add(
                  'border',
                  'border-outline',
                  'p-4',
                  'block',
                  'w-full',
                  'rounded-md',
                  'mt-1',
                  'mb-4',
                ),
                (C.value = o[l].alt),
                v.appendChild(C);
              const E = document.createElement('button');
              (E.type = 'button'),
                E.setAttribute('aria-label', 'Remove image'),
                (E.innerHTML =
                  '<i class="fa-regular fa-circle-xmark text-xl text-blue"></i>'),
                E.addEventListener('click', () => {
                  E.closest('.image-list').remove();
                }),
                w.append(L, v, E);
              const I = document.querySelector('.add-img');
              document.forms.updateListing.insertBefore(w, I);
            }
          const f = s.endsAt,
            b = new Date(f),
            h = b.toISOString().split('T')[0],
            y = b.toLocaleTimeString('en-US', {
              hour12: !1,
              hour: '2-digit',
              minute: '2-digit',
            }),
            p = document.getElementById('endingDate');
          p.value = h;
          const m = document.getElementById('endingTime');
          m.value = y;
          try {
            document.forms.updateListing.addEventListener('submit', (w) => {
              w.preventDefault();
              const L = A.form.formSubmit(w),
                { title: x, description: v } = L,
                C = document.querySelectorAll('.image-list'),
                E = [],
                I = [];
              C.forEach((B) => {
                const q = B.querySelector('input[name="mediaUrl"]').value,
                  U = B.querySelector('input[name="mediaAlt"]').value;
                E.push(q), I.push(U);
              });
              const T = E.map((B, q) => ({ url: B, alt: I[q] }));
              this.listing.update(n, { title: x, description: v, media: T });
            });
          } catch (l) {
            alert(`Could not update the listing.
${l.message}.
Please try again.`);
          }
        },
        delete: async () => {
          document
            .querySelector('.delete-btn')
            .addEventListener('click', () => {
              const t = new URLSearchParams(window.location.search).get('id');
              try {
                window.confirm('Are you sure you want to delete this?') &&
                  this.listing.delete(t);
              } catch (s) {
                alert(`Could not delete the listing.
${s.message}.
Please try again.`);
              }
            });
        },
        displaySearchResult: async (e, n = 1, t = 'created', s = 'desc') => {
          try {
            const a = await this.listing.search(e, 24, n, t, s),
              { data: i, meta: o } = a,
              { currentPage: u, pageCount: d } = o,
              f = `${window.location.pathname}?page=${n}&query=${e}`;
            window.history.replaceState({}, '', f),
              this.pagination.homePagination(u, d);
            const b = document.querySelector('.listings-container');
            (b.innerHTML = ''),
              i.forEach((h) => {
                const y = V(h);
                b.appendChild(y);
              });
          } catch (a) {
            alert(a.message);
          }
        },
        search: async (e) => {
          e.preventDefault();
          const t = A.form.formSubmit(e).search,
            s = document.querySelector('.result');
          s.textContent = '';
          const a = await this.listing.search(t),
            { meta: i } = a,
            o = i.totalCount,
            u = document.getElementById('search');
          try {
            (this.currentQuery = t), this.events.listing.displaySearchResult(t);
            const d = document.querySelector('.sorting-list');
            d.classList.add('hidden');
            const f = document.querySelector('.filtering-list');
            f.classList.add('hidden');
            const b = t.charAt(0).toUpperCase() + t.substring(1).toLowerCase(),
              h = document.createElement('p');
            (h.textContent = b),
              h.classList.add(
                'font-semibold',
                'text-center',
                'text-lg',
                'mt-6',
                'border',
                'border-outline-light',
                'px-4',
                'bg-off-white',
                'rounded-full',
                'inline-block',
                'lg:mt-10',
                'lg:text-2xl',
              );
            const y = document.createElement('span');
            (y.textContent = ` (${o})`),
              y.classList.add(
                'font-normal',
                'text-lg',
                'leading-8',
                'font-display',
              );
            const p = document.getElementById('newest');
            p.checked = !0;
            const m = document.getElementById('showActive'),
              l = document.getElementById('showAll');
            (m.disabled = !0),
              (l.disabled = !0),
              (m.checked = !1),
              (l.checked = !0),
              f.querySelectorAll('input, label').forEach((v) => {
                v.style.cursor = 'not-allowed';
              });
            const L = document.createElement('button');
            L.setAttribute('aria-label', 'Clear search'),
              L.classList.add('ml-3'),
              (L.innerHTML =
                '<i class="fa-solid fa-xmark text-gray text-sm"></i>'),
              h.append(y, L),
              s.append(h),
              document
                .querySelector('.search-form')
                .insertAdjacentElement('afterend', s),
              L.addEventListener('click', () => {
                (u.value = ''),
                  h.remove(),
                  (this.currentQuery = ''),
                  (m.disabled = !1),
                  (l.disabled = !1),
                  (m.checked = !0),
                  (l.checked = !1),
                  f.classList.add('hidden'),
                  f.querySelectorAll('input, label').forEach((E) => {
                    E.style.cursor = 'pointer';
                  }),
                  this.events.listing.displayListings(),
                  this.filtering.removeCheckedAttribute();
                const C = document.getElementById('newest');
                (C.checked = !0), d.classList.add('hidden');
              });
          } catch (d) {
            alert('Something went wrong while searching: ' + d.message);
          }
        },
        addImage: () => {
          let e = 1;
          document.querySelector('.add-img').addEventListener('click', () => {
            e++;
            const t = document.createElement('div');
            t.classList.add(
              'image-list',
              'flex',
              'justify-between',
              'items-center',
              'gap-2',
              'lg:gap-4',
            );
            const s = document.createElement('label');
            s.classList.add(
              'url-label',
              'font-display',
              'font-semibold',
              'lg:w-1/2',
            ),
              (s.textContent = 'Image url');
            const a = document.createElement('input');
            (a.type = 'url'),
              (a.name = 'mediaUrl'),
              a.classList.add(
                'border',
                'border-outline',
                'p-4',
                'block',
                'w-full',
                'rounded-md',
                'mt-1',
                'mb-4',
              ),
              (a.required = !0),
              s.appendChild(a);
            const i = document.createElement('label');
            i.classList.add('font-display', 'font-semibold', 'lg:w-1/2'),
              (i.textContent = 'Image alt');
            const o = document.createElement('input');
            (o.type = 'alt'),
              (o.name = 'mediaAlt'),
              o.classList.add(
                'border',
                'border-outline',
                'p-4',
                'block',
                'w-full',
                'rounded-md',
                'mt-1',
                'mb-4',
              ),
              (o.required = !0),
              i.appendChild(o),
              window.location.pathname === '/listing/update/'
                ? ((s.htmlFor = `img-url-${e}-update`),
                  (i.htmlFor = `img-alt-${e}-update`),
                  (a.id = `img-url-${e}-update`),
                  (o.id = `img-alt-${e}-update`))
                : ((s.htmlFor = `img-url-${e}`),
                  (i.htmlFor = `img-alt-${e}`),
                  (a.id = `img-url-${e}`),
                  (o.id = `img-alt-${e}`));
            const d = document.createElement('button');
            if (
              ((d.type = 'button'),
              d.setAttribute('aria-label', 'Remove image'),
              (d.innerHTML =
                '<i class="fa-regular fa-circle-xmark text-xl text-blue"></i>'),
              d.addEventListener('click', () => {
                d.closest('.image-list').remove();
              }),
              t.append(s, i, d),
              document.querySelectorAll('.image-list').length < 8)
            ) {
              const b = document.querySelector('.add-img');
              document.querySelector('form').insertBefore(t, b);
            } else
              alert(`You have reached the limit!
You can upload a maximum of 8 images.`);
          });
        },
      },
      profile: {
        displayProfile: async (e = 1, n = 'created', t = 'desc', s = !0) => {
          const i = new URLSearchParams(window.location.search).get('name');
          try {
            const o = await this.profile.getProfile(i),
              { data: u } = o,
              d = document.querySelector('.header-authenticated');
            (d.style.backgroundImage = `url(${u.banner.url})`),
              (d.style.backgroundRepeat = 'no repeat'),
              (d.style.backgroundSize = 'cover'),
              (d.style.backgroundPosition = 'center');
            const f = document.querySelector('.avatar');
            (f.src = u.avatar.url), (f.alt = u.avatar.alt);
            const b = document.querySelector('.username');
            b.textContent = u.name;
            const h = document.querySelector('.bio');
            h.textContent = u.bio;
            const y = document.querySelector('.credits');
            y.textContent = u.credits;
            const p = document.querySelector('.item-count');
            p.textContent = u._count.listings;
            const m = await this.listing.getUsersListings(24, e, n, t, s, i),
              l = m.data,
              w = m.meta,
              L = document.querySelector('.listings-container');
            (L.innerHTML = ''),
              l.forEach((T) => {
                const B = V(T);
                L.appendChild(B);
              });
            const { currentPage: x, pageCount: v } = w,
              C = `${window.location.pathname}?name=${i}&page=${e}`;
            window.history.replaceState({}, '', C),
              this.pagination.homePagination(x, v);
            const E = document.querySelector('meta[name="description"]'),
              I = u.name;
            E.setAttribute('content', `Profile page of ${I}`);
          } catch (o) {
            A.user
              ? alert(o.message)
              : (alert(`You need to log in to access this profile.
Please log in or create an account to continue.`),
                (window.location.href = '/'));
          }
        },
        displayUpdateProfileButton: () => {
          const n = new URLSearchParams(window.location.search).get('name'),
            t = document.querySelector('.update-btn-container');
          t.classList.add('absolute', '-top-1/2', 'lg:top-0', 'right-0');
          const s = document.createElement('a');
          s.classList.add('btn-green', 'font-display', 'font-semibold'),
            (s.textContent = 'Update Profile'),
            s.setAttribute('aria-label', 'To update profile page'),
            (s.href = '/profile/update/'),
            n === A.user && t.appendChild(s);
        },
        updateProfile: async () => {
          const { data: e } = await this.profile.getProfile(A.user),
            n = document.getElementById('bio');
          n.value = e.bio;
          const t = document.getElementById('banner-url');
          t.value = e.banner.url;
          const s = document.getElementById('banner-alt');
          s.value = e.banner.alt;
          const a = document.getElementById('avatar-url');
          a.value = e.avatar.url;
          const i = document.getElementById('avatar-alt');
          i.value = e.avatar.alt;
          try {
            document.forms.updateProfile.addEventListener('submit', (u) => {
              u.preventDefault();
              const d = A.form.formSubmit(u),
                {
                  bio: f,
                  bannerUrl: b,
                  bannerAlt: h,
                  avatarUrl: y,
                  avatarAlt: p,
                } = d,
                m = { url: b, alt: h },
                l = { url: y, alt: p };
              this.profile.updateProfile(A.user, {
                bio: f,
                banner: m,
                avatar: l,
              });
            });
          } catch (o) {
            alert(`Could not update your profile.
${o.message}.
Please try again.`);
          }
        },
      },
      bid: async (e) => {
        const n = A.form.formSubmit(e),
          s = new URLSearchParams(window.location.search).get('id');
        try {
          await this.bid.bid(s, { amount: Number(n.amount) });
          const a = localStorage.getItem('credits'),
            i = Number(a) - Number(n.amount);
          localStorage.setItem('credits', i),
            alert('Success! Your bid has been placed. Good luck!'),
            (window.location.href = `/listing/?id=${s}`);
        } catch (a) {
          alert(`Could not bid on this listing.
${a.message}.
Please try again.`);
        }
      },
    });
    S(this, 'avatar', {
      userAvatar: async () => {
        const e = localStorage.getItem('username'),
          n = await this.profile.getProfile(e),
          { data: t } = n;
        document.querySelectorAll('.user-avatar').forEach((a) => {
          (a.src = t.avatar.url), (a.alt = t.avatar.alt);
        });
      },
    });
    S(this, 'currentSortBy', 'created');
    S(this, 'currentSortOrder', 'desc');
    S(this, 'currentFilter', !0);
    S(
      this,
      'currentQuery',
      new URLSearchParams(window.location.search).get('query') || '',
    );
    S(this, 'filtering', {
      openSorting: () => {
        const e = document.querySelector('.sort-by'),
          n = document.querySelector('.sorting-list');
        e.addEventListener('click', () => {
          n.classList.contains('hidden')
            ? n.classList.toggle('hidden')
            : n.classList.add('hidden');
        }),
          [...document.querySelectorAll('.sorting-list label')].forEach((s) => {
            s.addEventListener('click', () => {
              n.classList.add('hidden');
            });
          }),
          this.filtering.descending(),
          this.filtering.ascending(),
          this.filtering.endingSoon(),
          this.filtering.resentUpdate();
      },
      removeCheckedAttribute: () => {
        document.getElementsByName('sort').forEach((n) => {
          n.checked = !1;
        });
      },
      descending: () => {
        const e = document.getElementById('newest'),
          n = window.location.pathname;
        e.addEventListener('click', () => {
          this.filtering.removeCheckedAttribute(),
            this.currentQuery
              ? ((this.currentSortOrder = 'desc'),
                (this.currentSortBy = 'created'),
                this.events.listing.displaySearchResult(
                  this.currentQuery,
                  1,
                  this.currentSortBy,
                  this.currentSortOrder,
                ))
              : !this.currentQuery && n === '/'
                ? ((this.currentSortOrder = 'desc'),
                  (this.currentSortBy = 'created'),
                  this.events.listing.displayListings(
                    1,
                    this.currentSortBy,
                    this.currentSortOrder,
                    this.currentFilter,
                  ))
                : n === '/profile/' &&
                  ((this.currentSortOrder = 'desc'),
                  this.events.profile.displayProfile(
                    1,
                    this.currentSortBy,
                    this.currentSortOrder,
                    this.currentFilter,
                  )),
            (e.checked = !0);
        });
      },
      ascending: () => {
        const e = document.getElementById('oldest'),
          n = window.location.pathname;
        e.addEventListener('click', () => {
          this.filtering.removeCheckedAttribute(),
            this.currentQuery
              ? ((this.currentSortOrder = 'asc'),
                (this.currentSortBy = 'created'),
                this.events.listing.displaySearchResult(
                  this.currentQuery,
                  1,
                  this.currentSortBy,
                  this.currentSortOrder,
                ))
              : !this.currentQuery && n === '/'
                ? ((this.currentSortOrder = 'asc'),
                  (this.currentSortBy = 'created'),
                  this.events.listing.displayListings(
                    1,
                    this.currentSortBy,
                    this.currentSortOrder,
                    this.currentFilter,
                  ))
                : n === '/profile/' &&
                  ((this.currentSortOrder = 'asc'),
                  this.events.profile.displayProfile(
                    1,
                    this.currentSortBy,
                    this.currentSortOrder,
                    this.currentFilter,
                  )),
            (e.checked = !0);
        });
      },
      endingSoon: () => {
        const e = document.getElementById('endingSoon'),
          n = window.location.pathname;
        e.addEventListener('click', () => {
          this.filtering.removeCheckedAttribute(),
            this.currentQuery
              ? ((this.currentSortBy = 'endsAt'),
                (this.currentSortOrder = 'asc'),
                this.events.listing.displaySearchResult(
                  this.currentQuery,
                  1,
                  this.currentSortBy,
                  this.currentSortOrder,
                ))
              : !this.currentQuery && n === '/'
                ? ((this.currentSortBy = 'endsAt'),
                  (this.currentSortOrder = 'asc'),
                  this.events.listing.displayListings(
                    1,
                    this.currentSortBy,
                    this.currentSortOrder,
                    this.currentFilter,
                  ))
                : n === '/profile/' &&
                  ((this.currentSortBy = 'endsAt'),
                  (this.currentSortOrder = 'asc'),
                  this.events.profile.displayProfile(
                    1,
                    this.currentSortBy,
                    this.currentSortOrder,
                    this.currentFilter,
                  )),
            (e.checked = !0);
        });
      },
      resentUpdate: () => {
        const e = document.getElementById('updated'),
          n = window.location.pathname;
        e.addEventListener('click', () => {
          this.filtering.removeCheckedAttribute(),
            this.currentQuery
              ? ((this.currentSortBy = 'updated'),
                (this.currentSortOrder = 'desc'),
                this.events.listing.displaySearchResult(
                  this.currentQuery,
                  1,
                  this.currentSortBy,
                  this.currentSortOrder,
                ))
              : !this.currentQuery && n === '/'
                ? ((this.currentSortBy = 'updated'),
                  (this.currentSortOrder = 'desc'),
                  this.events.listing.displayListings(
                    1,
                    this.currentSortBy,
                    this.currentSortOrder,
                    this.currentFilter,
                  ))
                : n === '/profile/' &&
                  ((this.currentSortBy = 'updated'),
                  (this.currentSortOrder = 'desc'),
                  this.events.profile.displayProfile(
                    1,
                    this.currentSortBy,
                    this.currentSortOrder,
                    this.currentFilter,
                  )),
            (e.checked = !0);
        });
      },
      openFilter: () => {
        const e = document.querySelector('.filter-by'),
          n = document.querySelector('.filtering-list');
        e.addEventListener('click', () => {
          n.classList.contains('hidden')
            ? n.classList.toggle('hidden')
            : n.classList.add('hidden');
        }),
          [...document.querySelectorAll('.filtering-list label')].forEach(
            (s) => {
              s.addEventListener('click', () => {
                n.classList.add('hidden');
              });
            },
          ),
          this.filtering.showAll(),
          this.filtering.showActive();
      },
      showAll: () => {
        const e = document.getElementById('showAll'),
          n = document.getElementById('showActive'),
          t = window.location.pathname;
        e.addEventListener('click', () => {
          t === '/'
            ? ((this.currentFilter = !1),
              this.events.listing.displayListings(
                1,
                this.currentSortBy,
                this.currentSortOrder,
                this.currentFilter,
              ))
            : t === '/profile/' &&
              ((this.currentFilter = !1),
              this.events.profile.displayProfile(
                1,
                this.currentSortBy,
                this.currentSortOrder,
                this.currentFilter,
              )),
            (n.checked = !1),
            (e.checked = !0);
        });
      },
      showActive: () => {
        const e = document.getElementById('showActive'),
          n = document.getElementById('showAll'),
          t = window.location.pathname;
        e.addEventListener('click', () => {
          t === '/'
            ? ((this.currentFilter = !0),
              this.events.listing.displayListings(
                1,
                this.currentSortBy,
                this.currentSortOrder,
                this.currentFilter,
              ))
            : t === '/profile/' &&
              ((this.currentFilter = !0),
              this.events.profile.displayProfile(
                1,
                this.currentSortBy,
                this.currentSortOrder,
                this.currentFilter,
              )),
            (n.checked = !1),
            (e.checked = !0);
        });
      },
    });
    S(this, 'pagination', {
      homePagination: (e, n) => {
        const t = document.querySelector('.pagination');
        t.innerHTML = '';
        const s = window.location.pathname,
          a = document.querySelector('.listings-feed'),
          i = document.querySelector('.user-listings-feed'),
          o = () => {
            const p = document.createElement('span');
            return (p.textContent = '...'), p;
          },
          u = (p, m) => {
            const l = document.createElement('button');
            return (
              l.setAttribute('aria-label', `To page ${p}`),
              (l.textContent = p),
              (l.dataset.page = m),
              l.classList.add(
                'w-8',
                'h-8',
                'rounded-full',
                'text-blue',
                'bg-white',
                'font-medium',
                'border',
                'border-blue',
              ),
              e === m &&
                (l.classList.add('current-page', 'text-white', 'bg-blue'),
                l.classList.remove('text-blue', 'bg-white')),
              l.addEventListener('click', () => {
                this.currentQuery
                  ? (this.events.listing.displaySearchResult(
                      this.currentQuery,
                      m,
                      this.currentSortBy,
                      this.currentSortOrder,
                      this.currentFilter,
                    ),
                    a.scrollIntoView({ behavior: 'smooth', block: 'start' }))
                  : s === '/'
                    ? (this.events.listing.displayListings(
                        m,
                        this.currentSortBy,
                        this.currentSortOrder,
                        this.currentFilter,
                      ),
                      a.scrollIntoView({ behavior: 'smooth', block: 'start' }))
                    : s === '/profile/' &&
                      (this.events.profile.displayProfile(
                        m,
                        this.currentSortBy,
                        this.currentSortOrder,
                        this.currentFilter,
                      ),
                      i.scrollIntoView({ behavior: 'smooth', block: 'start' }));
              }),
              l
            );
          };
        if (n <= 5)
          for (let p = 1; p < n + 1; p++) {
            const m = u(p, p);
            t.appendChild(m);
          }
        if (n > 5) {
          if (e <= 3) {
            for (let m = 1; m < 4; m++) {
              const l = u(m, m);
              t.appendChild(l);
            }
            t.appendChild(o());
            const p = u(n, n);
            t.appendChild(p);
          }
          if (e > 3 && e <= n - 3) {
            const p = u(1, 1);
            t.appendChild(p), t.appendChild(o());
            for (let l = e - 1; l < e + 2; l++) {
              const w = u(l, l);
              t.appendChild(w);
            }
            t.appendChild(o());
            const m = u(n, n);
            t.appendChild(m);
          }
          if (e > 3 && e > n - 3) {
            const p = u(1, 1);
            t.appendChild(p), t.appendChild(o());
            for (let m = n - 2; m <= n; m++) {
              const l = u(m, m);
              t.appendChild(l);
            }
          }
        }
        const d = document.createElement('button');
        d.classList.add(
          'w-8',
          'h-8',
          'rounded-full',
          'text-blue',
          'bg-white',
          'font-medium',
          'border',
          'border-blue',
        ),
          d.setAttribute('aria-label', 'Previous page'),
          e === 1 &&
            ((d.disabled = !0),
            (d.style.cursor = 'not-allowed'),
            (d.style.opacity = '0.4')),
          d.addEventListener('click', () => {
            this.currentQuery
              ? (this.events.listing.displaySearchResult(
                  this.currentQuery,
                  e - 1,
                  this.currentSortBy,
                  this.currentSortOrder,
                  this.currentFilter,
                ),
                a.scrollIntoView({ behavior: 'smooth', block: 'start' }))
              : s === '/'
                ? (this.events.listing.displayListings(
                    e - 1,
                    this.currentSortBy,
                    this.currentSortOrder,
                    this.currentFilter,
                  ),
                  a.scrollIntoView({ behavior: 'smooth', block: 'start' }))
                : s === '/profile/' &&
                  (this.events.profile.displayProfile(
                    e - 1,
                    this.currentSortBy,
                    this.currentSortOrder,
                    this.currentFilter,
                  ),
                  i.scrollIntoView({ behavior: 'smooth', block: 'start' }));
          });
        const f = document.createElement('i');
        f.classList.add('fa-solid', 'fa-angle-left'), d.appendChild(f);
        const b = document.querySelector('[data-page="1"]');
        t.insertBefore(d, b);
        const h = document.createElement('button');
        h.classList.add(
          'w-8',
          'h-8',
          'rounded-full',
          'text-blue',
          'bg-white',
          'font-medium',
          'border',
          'border-blue',
        ),
          h.setAttribute('aria-label', 'Next page'),
          (e === n || n === 0) &&
            ((h.disabled = !0),
            (h.style.cursor = 'not-allowed'),
            (h.style.opacity = '0.4')),
          h.addEventListener('click', () => {
            this.currentQuery
              ? (this.events.listing.displaySearchResult(
                  this.currentQuery,
                  e + 1,
                  this.currentSortBy,
                  this.currentSortOrder,
                  this.currentFilter,
                ),
                a.scrollIntoView({ behavior: 'smooth', block: 'start' }))
              : s === '/'
                ? (this.events.listing.displayListings(
                    e + 1,
                    this.currentSortBy,
                    this.currentSortOrder,
                    this.currentFilter,
                  ),
                  a.scrollIntoView({ behavior: 'smooth', block: 'start' }))
                : s === '/profile/' &&
                  (this.events.profile.displayProfile(
                    e + 1,
                    this.currentSortBy,
                    this.currentSortOrder,
                    this.currentFilter,
                  ),
                  i.scrollIntoView({ behavior: 'smooth', block: 'start' }));
          });
        const y = document.createElement('i');
        return (
          y.classList.add('fa-solid', 'fa-angle-right'),
          h.appendChild(y),
          t.appendChild(h),
          t
        );
      },
    });
    S(this, 'loader', {
      hideLoading: () => {
        const e = document.querySelector('.loader');
        e.classList.add('hidden'), e.classList.remove('flex');
      },
    });
    this.router();
  }
  async router(e = window.location.pathname) {
    switch (e) {
      case '/':
        this.events.listing.displaySkeleton(24), await this.views.listingFeed();
        break;
      case '/auth/register/':
        await this.views.register();
        break;
      case '/auth/login/':
        await this.views.login();
        break;
      case '/listing/':
        await this.views.listing();
        break;
      case '/listing/create/':
        await this.views.listingCreate();
        break;
      case '/listing/update/':
        await this.views.listingUpdate();
        break;
      case '/profile/':
        this.events.listing.displaySkeleton(4), await this.views.profile();
        break;
      case '/profile/update/':
        await this.views.profileUpdate();
        break;
    }
  }
  static get user() {
    return localStorage.getItem('username');
  }
};
S(A, 'form', {
  formSubmit(e) {
    e.preventDefault();
    const n = e.target,
      t = new FormData(n);
    return Object.fromEntries(t.entries());
  },
});
let Y = A;
new Y();
