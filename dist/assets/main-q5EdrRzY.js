(function () {
  const e = document.createElement('link').relList;
  if (e && e.supports && e.supports('modulepreload')) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) n(s);
  new MutationObserver((s) => {
    for (const a of s)
      if (a.type === 'childList')
        for (const r of a.addedNodes)
          r.tagName === 'LINK' && r.rel === 'modulepreload' && n(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(s) {
    const a = {};
    return (
      s.integrity && (a.integrity = s.integrity),
      s.referrerPolicy && (a.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === 'use-credentials'
        ? (a.credentials = 'include')
        : s.crossOrigin === 'anonymous'
          ? (a.credentials = 'omit')
          : (a.credentials = 'same-origin'),
      a
    );
  }
  function n(s) {
    if (s.ep) return;
    s.ep = !0;
    const a = t(s);
    fetch(s.href, a);
  }
})();
const K = '42d1daed-d7a5-4f39-b3da-5f11248409c0',
  Y = 'https://v2.api.noroff.dev',
  W = `${Y}/auth`,
  X = `${Y}/auction`;
function $(d) {
  const e = new Headers();
  return (
    e.append('X-Noroff-API-Key', K),
    sessionStorage.token &&
      e.append('Authorization', `Bearer ${sessionStorage.token}`),
    d && e.append('Content-type', 'application/json'),
    e
  );
}
class g {
  static apiAuthBase = W;
  static apiAuctionBase = X;
  static paths = {
    register: `${g.apiAuthBase}/register`,
    login: `${g.apiAuthBase}/login`,
    listings: `${g.apiAuctionBase}/listings`,
    profiles: `${g.apiAuctionBase}/profiles`,
    search: `${g.apiAuctionBase}/listings/search`,
  };
  static responseHandler = {
    handleResponse: async (e, t, n = 'json') => {
      if (e.ok) return e.status === 204 ? null : await e[n]();
      const a = (await e[n]()).errors[0].message || 'Unknown error';
      throw new Error(`${a}`);
    },
  };
  static set token(e) {
    sessionStorage.setItem('token', e);
  }
  static set username(e) {
    sessionStorage.setItem('username', e);
  }
  static set credits(e) {
    sessionStorage.setItem('credits', e);
  }
  auth = {
    register: async ({ name: e, email: t, password: n }) => {
      const s = JSON.stringify({ name: e, email: t, password: n }),
        a = await fetch(g.paths.register, {
          headers: $(!0),
          method: 'POST',
          body: s,
        });
      return await g.responseHandler.handleResponse(a);
    },
    login: async ({ email: e, password: t }) => {
      const n = JSON.stringify({ email: e, password: t }),
        s = await fetch(g.paths.login, {
          headers: $(!0),
          method: 'POST',
          body: n,
        }),
        { data: a } = await g.responseHandler.handleResponse(s),
        { accessToken: r, name: i } = a;
      (g.token = r), (g.username = i);
      const l = (await this.profile.getProfile(i)).data.credits;
      return (g.credits = l), a;
    },
  };
  profile = {
    getProfile: async (e) => {
      const t = await fetch(`${g.paths.profiles}/${e}`, {
        headers: $(),
        method: 'GET',
      });
      return await g.responseHandler.handleResponse(t);
    },
    updateProfile: async (e, { bio: t, banner: n, avatar: s }) => {
      const a = JSON.stringify({ bio: t, banner: n, avatar: s }),
        r = await fetch(`${g.paths.profiles}/${e}`, {
          headers: $(!0),
          method: 'PUT',
          body: a,
        });
      await g.responseHandler.handleResponse(r),
        (window.location.href = `/profile/?name=${e}`);
    },
  };
  listing = {
    get24Listings: async (
      e = 24,
      t = 1,
      n = 'created',
      s = 'desc',
      a = 'true',
    ) => {
      const r = new URL(g.paths.listings);
      r.searchParams.append('limit', e),
        r.searchParams.append('page', t),
        r.searchParams.append('_seller', !0),
        r.searchParams.append('_bids', !0),
        r.searchParams.append('_active', a),
        r.searchParams.append('sort', n),
        r.searchParams.append('sortOrder', s);
      const i = await fetch(r.toString(), { headers: $(), method: 'GET' });
      return await g.responseHandler.handleResponse(i);
    },
    getSingleListing: async (e) => {
      const t = new URL(`${g.paths.listings}/${e}`);
      t.searchParams.append('_seller', !0), t.searchParams.append('_bids', !0);
      const n = await fetch(t.toString(), { headers: $(), method: 'GET' });
      return await g.responseHandler.handleResponse(n);
    },
    getUsersListings: async (
      e = 24,
      t = 1,
      n = 'created',
      s = 'desc',
      a = 'true',
      r,
    ) => {
      const i = new URL(`${g.paths.profiles}/${r}/listings`);
      i.searchParams.append('limit', e),
        i.searchParams.append('page', t),
        i.searchParams.append('_seller', !0),
        i.searchParams.append('_bids', !0),
        i.searchParams.append('_active', a),
        i.searchParams.append('sort', n),
        i.searchParams.append('sortOrder', s);
      const o = await fetch(i.toString(), { headers: $(), method: 'GET' });
      return await g.responseHandler.handleResponse(o);
    },
    create: async ({ title: e, description: t, media: n, endsAt: s }) => {
      const a = JSON.stringify({
          title: e,
          description: t,
          media: n,
          endsAt: s,
        }),
        r = await fetch(g.paths.listings, {
          headers: $(!0),
          method: 'POST',
          body: a,
        }),
        { data: i } = await g.responseHandler.handleResponse(r);
      return i;
    },
    update: async (e, { title: t, description: n, media: s }) => {
      const a = JSON.stringify({ title: t, description: n, media: s }),
        r = await fetch(`${g.paths.listings}/${e}`, {
          headers: $(!0),
          method: 'PUT',
          body: a,
        });
      await g.responseHandler.handleResponse(r),
        (window.location.href = `/listing/?id=${e}`);
    },
    delete: async (e) => {
      const t = await fetch(`${g.paths.listings}/${e}`, {
        headers: $(!0),
        method: 'DELETE',
      });
      await g.responseHandler.handleResponse(t);
      const n = sessionStorage.getItem('username');
      window.location.href = `/profile/?name=${n}`;
    },
    search: async (e, t = 24, n = 1, s = 'created', a = 'desc') => {
      const r = new URL(g.paths.search);
      r.searchParams.append('limit', t),
        r.searchParams.append('page', n),
        r.searchParams.append('_seller', !0),
        r.searchParams.append('_bids', !0),
        r.searchParams.append('sort', s),
        r.searchParams.append('sortOrder', a),
        r.searchParams.append('q', e);
      const i = await fetch(r.toString(), { headers: $(!0), method: 'GET' });
      return await g.responseHandler.handleResponse(i);
    },
  };
  bid = {
    bid: async (e, { amount: t }) => {
      const n = JSON.stringify({ amount: t }),
        s = await fetch(`${g.paths.listings}/${e}/bids`, {
          headers: $(!0),
          method: 'POST',
          body: n,
        }),
        { data: a } = await g.responseHandler.handleResponse(s);
      return a;
    },
  };
}
function Z() {
  const d = document.createElement('div');
  d.classList.add('flex', 'justify-between', 'items-center', 'w-full');
  const e = document.createElement('a');
  (e.href = '/'),
    e.setAttribute('aria-label', 'View top page'),
    e.classList.add('block', 'w-1/3', 'md:w-1/6');
  const t = document.createElement('img');
  (t.src = '../../../../../images/Logo.svg'),
    (t.alt = 'CrediBid logo'),
    e.appendChild(t);
  const n = document.createElement('nav');
  n.classList.add(
    'hidden',
    'lg:flex',
    'gap-6',
    'items-center',
    'font-display',
    'font-semibold',
  );
  const s = document.createElement('div');
  s.classList.add('update', 'mb-4');
  const a = document.createElement('a');
  (a.href = '/listing/create/'),
    a.setAttribute('aria-label', 'To create listing page'),
    a.classList.add('btn-orange'),
    (a.textContent = 'Create Listing');
  const r = document.createElement('div');
  r.classList.add('relative', 'group');
  const i = document.createElement('img');
  i.setAttribute('aria-label', "User's avatar"),
    i.classList.add(
      'user-avatar',
      'w-12',
      'h-12',
      'rounded-full',
      'cursor-pointer',
      'object-cover',
    );
  const o = document.createElement('div');
  o.classList.add(
    'absolute',
    'top-full',
    'right-0',
    'z-10',
    'pt-4',
    'opacity-0',
    'pointer-events-none',
    'group-hover:opacity-100',
    'group-hover:pointer-events-auto',
  );
  const l = document.createElement('div');
  l.classList.add(
    'translate-y-4',
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
    'group-hover:translate-y-0',
  );
  const h = document.createElement('ul'),
    f = document.createElement('li');
  f.classList.add('mb-4');
  const m = document.createElement('a');
  m.setAttribute('aria-label', 'View profile page'),
    m.classList.add(
      'flex',
      'items-center',
      'text-black',
      'cursor-pointer',
      'hover:text-blue',
    );
  const w = sessionStorage.getItem('username');
  m.href = `/profile/?name=${w}`;
  const p = document.createElement('i');
  p.classList.add('fa-regular', 'fa-user', 'text-sm', 'mr-2');
  const u = document.createElement('span');
  u.classList.add('whitespace-nowrap'), (u.textContent = 'Profile');
  const c = document.createElement('li'),
    b = document.createElement('button');
  b.setAttribute('aria-label', 'Log out'),
    b.classList.add(
      'logout-button',
      'flex',
      'items-center',
      'text-black',
      'hover:text-blue',
    );
  const y = document.createElement('i');
  y.classList.add('fa-solid', 'fa-right-from-bracket', 'text-sm', 'mr-2');
  const E = document.createElement('span');
  E.classList.add('whitespace-nowrap'),
    (E.textContent = 'Log out'),
    m.append(p, u),
    b.append(y, E),
    f.appendChild(m),
    c.appendChild(b),
    h.append(f, c),
    l.appendChild(h),
    o.appendChild(l),
    r.append(i, o),
    n.append(s, a, r);
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
  const k = document.createElement('span');
  k.classList.add(
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
  const I = document.createElement('ul');
  I.classList.add(
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
  const C = document.createElement('div'),
    T = document.createElement('li'),
    P = document.createElement('a');
  P.setAttribute('aria-label', 'View profile page'),
    (P.href = `/profile/?name=${w}`),
    P.classList.add(
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
  const F = document.createElement('i');
  F.classList.add('fa-regular', 'fa-user', 'mr-2');
  const A = document.createElement('span');
  A.textContent = 'Profile';
  const R = document.createElement('li'),
    O = document.createElement('button');
  O.setAttribute('aria-label', 'Log out'),
    O.classList.add(
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
  const N = document.createElement('i');
  N.classList.add('fa-solid', 'fa-right-from-bracket', 'mr-2');
  const j = document.createElement('span');
  j.textContent = 'Log out';
  const S = document.createElement('div');
  S.classList.add('text-xs', 'text-black', 'flex', 'justify-center', 'gap-6');
  const q = document.createElement('li');
  q.textContent = 'Terms of Use';
  const U = document.createElement('li');
  return (
    (U.textContent = 'Privacy Policy'),
    P.append(F, A),
    T.appendChild(P),
    O.append(N, j),
    R.appendChild(O),
    C.append(T, R),
    S.append(q, U),
    I.append(C, S),
    v.appendChild(k),
    L.append(x, v, I),
    d.append(e, n, L),
    d
  );
}
function G(d) {
  const e = d.endsAt,
    t = new Date(e).getTime(),
    n = new Date().getTime();
  return t - n;
}
function _(d) {
  const e = d.bids || [];
  if (e.length > 0) {
    const t = e.map((s) => s.amount);
    return Math.max(...t);
  } else return 0;
}
function J(d) {
  const e = _(d),
    t = G(d),
    n = Math.floor(t / (1e3 * 60 * 60 * 24)),
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
    n >= 0)
  )
    if (e) {
      a.textContent = 'Current bid';
      const r = document.createElement('p');
      r.classList.add('text-2xl', 'font-semibold', 'lg:text-3xl'),
        (r.textContent = e);
      const i = document.createElement('span');
      return (
        (i.textContent = 'credits'),
        i.classList.add('text-xs', 'font-semibold', 'ml-1', 'lg:text-base'),
        r.appendChild(i),
        s.append(a, r),
        s
      );
    } else {
      a.textContent = 'Current bid';
      const r = document.createElement('p');
      r.classList.add('text-2xl', 'font-semibold', 'lg:text-2xl');
      const i = document.createElement('span');
      return (
        (i.textContent = 'No bids yet'),
        i.classList.add('text-base', 'font-semibold'),
        r.appendChild(i),
        s.append(a, r),
        s
      );
    }
  else if (e) {
    a.textContent = 'Final bid';
    const r = document.createElement('p');
    r.classList.add('text-2xl', 'font-semibold', 'lg:text-2xl'),
      (r.textContent = e);
    const i = document.createElement('span');
    return (
      (i.textContent = 'credits'),
      i.classList.add('text-xs', 'font-semibold', 'ml-1'),
      r.appendChild(i),
      s.append(a, r),
      s
    );
  } else {
    a.textContent = 'Final bid';
    const r = document.createElement('p');
    r.classList.add('text-2xl', 'font-semibold', 'lg:text-2xl');
    const i = document.createElement('span');
    return (
      (i.textContent = 'No bids placed'),
      i.classList.add('text-base', 'font-semibold'),
      r.appendChild(i),
      s.append(a, r),
      s
    );
  }
}
function z(d) {
  const e = G(d),
    t = Math.floor(e / (1e3 * 60 * 60 * 24)),
    n = Math.floor(e / (1e3 * 60 * 60)),
    s = Math.floor((e % (1e3 * 60 * 60)) / (1e3 * 60)),
    a = document.createElement('li'),
    r = document.createElement('p');
  if (
    (r.classList.add(
      'text-xs',
      'text-gray',
      'font-medium',
      'mb-1',
      'lg:text-sm',
    ),
    t > 0)
  ) {
    r.textContent = 'Ending in';
    const i = document.createElement('p');
    i.classList.add('text-2xl', 'font-semibold', 'lg:text-3xl'),
      (i.textContent = t);
    const o = document.createElement('span');
    return (
      (o.textContent = 'days left'),
      o.classList.add('text-xs', 'font-semibold', 'ml-1', 'lg:text-base'),
      i.appendChild(o),
      a.append(r, i),
      a
    );
  } else if (t === 0) {
    r.textContent = 'Ending in';
    const i = document.createElement('p');
    i.classList.add('text-2xl', 'font-semibold', 'lg:text-3xl', 'inline-block'),
      (i.textContent = n);
    const o = document.createElement('span');
    (o.textContent = 'h'),
      o.classList.add('text-xs', 'font-semibold', 'ml-1', 'lg:text-base'),
      i.appendChild(o);
    const l = document.createElement('p');
    l.classList.add(
      'text-2xl',
      'font-semibold',
      'lg:text-3xl',
      'inline-block',
      'ml-2',
    ),
      (l.textContent = s);
    const h = document.createElement('span');
    return (
      (h.textContent = 'm'),
      h.classList.add('text-xs', 'font-semibold', 'ml-1', 'lg:text-base'),
      l.appendChild(h),
      a.append(r, i, l),
      a
    );
  } else {
    r.textContent = 'Bid closed';
    const i = document.createElement('div');
    i.classList.add('h-[32px]', 'flex', 'items-center', 'justify-center');
    const o = document.createElement('span');
    return (
      o.classList.add('h-[2px]', 'w-[20px]', 'block', 'bg-light-gray'),
      i.appendChild(o),
      a.append(r, i),
      a
    );
  }
}
function Q(d) {
  const e = document.createElement('a');
  e.setAttribute('aria-label', 'View this listing page'),
    e.classList.add(
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
    (e.id = d.id),
    (e.href = `/listing/?id=${d.id}`);
  const t = document.createElement('figure');
  t.classList.add('aspect-square', 'overflow-hidden', 'rounded-md', 'mb-3');
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
    d.media?.[0]
      ? ((n.src = d.media[0].url), (n.alt = d.media[0].alt))
      : ((n.src = '../../../../../images/noImageAvailable.svg'),
        (n.alt = 'No image available')),
    t.appendChild(n);
  const s = document.createElement('h1');
  (s.textContent = d.title),
    s.classList.add(
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
  const a = document.createElement('ul');
  a.classList.add('flex', 'justify-between', 'items-center', 'lg:px-2');
  const r = J(d),
    i = z(d);
  return (
    a.append(r, i),
    e.append(t, s, a),
    e.addEventListener('click', () => {
      const l = new URLSearchParams(window.location.search).get('page');
      sessionStorage.setItem('page', l);
    }),
    e
  );
}
function ee() {
  const d = document.createElement('div');
  d.classList.add('flex', 'justify-between', 'items-center', 'w-full');
  const e = document.createElement('a');
  (e.href = '/'),
    e.setAttribute('aria-label', 'View top page'),
    e.classList.add('block', 'w-1/3', 'md:w-1/6');
  const t = document.createElement('img');
  (t.src = '../../../../../images/Logo.svg'),
    (t.alt = 'CrediBid logo'),
    e.appendChild(t);
  const n = document.createElement('nav');
  n.classList.add(
    'hidden',
    'lg:block',
    'font-display',
    'font-semibold',
    'text-base',
  );
  const s = document.createElement('a');
  s.setAttribute('aria-label', 'To login page'),
    (s.href = '/auth/login/'),
    s.classList.add(
      'px-8',
      'py-3',
      'bg-white',
      'text-blue',
      'rounded-md',
      'mr-6',
      'font-semibold',
      'hover:underline',
    ),
    (s.textContent = 'Log in');
  const a = document.createElement('a');
  a.setAttribute('aria-label', 'To sign up page'),
    (a.href = '/auth/register/'),
    a.classList.add('btn-blue', 'px-8', 'py-4', 'lg:text-base'),
    (a.textContent = 'Sign up');
  const r = document.createElement('nav');
  r.classList.add('lg:hidden');
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
  const l = document.createElement('span');
  l.classList.add(
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
  const h = document.createElement('ul');
  h.classList.add(
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
    m = document.createElement('li');
  m.classList.add('text-center');
  const w = document.createElement('a');
  w.setAttribute('aria-label', 'To login page'),
    (w.href = '/auth/login/'),
    (w.textContent = 'Log in'),
    w.classList.add(
      'menu-item',
      'text-blue',
      'inline-block',
      'py-3',
      'px-6',
      'font-semibold',
      'text-xl',
      'mb-7',
    );
  const p = document.createElement('li');
  p.classList.add('text-center');
  const u = document.createElement('a');
  u.setAttribute('aria-label', 'To sign up page'),
    (u.href = '/auth/register/'),
    (u.textContent = 'Sign up'),
    u.classList.add(
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
  const c = document.createElement('div');
  c.classList.add('text-xs', 'text-black', 'flex', 'justify-center', 'gap-6');
  const b = document.createElement('li');
  b.textContent = 'Terms of Use';
  const y = document.createElement('li');
  return (
    (y.textContent = 'Privacy Policy'),
    n.append(s, a),
    o.appendChild(l),
    m.appendChild(w),
    p.appendChild(u),
    f.append(m, p),
    c.append(b, y),
    h.append(f, c),
    r.append(i, o, h),
    d.append(e, n, r),
    d
  );
}
const te = new g();
async function ne() {
  return await te.listing.get24Listings();
}
async function se() {
  const d = await ne(),
    { data: e } = d;
  return e
    .map((r) => r.media[0])
    .filter((r) => r !== void 0)
    .map((r) => ({ url: r.url, alt: r.alt }))
    .slice(0, 3);
}
function ae(d) {
  const e = document.createElement('div');
  e.classList.add('md:w-4/5', 'md:mx-auto', 'lg:w-full');
  const t = document.createElement('div');
  t.classList.add('lg:flex', 'lg:items-start', 'lg:gap-20');
  const n = document.createElement('div');
  n.classList.add('lg:w-1/2', 'flex', 'flex-col', 'items-center');
  const s = document.createElement('div');
  s.classList.add('main-image', 'mb-6', 'w-full');
  const a = document.createElement('img'),
    r = d.media;
  r?.[0]
    ? ((a.src = r[0].url), (a.alt = r[0].alt))
    : ((a.src = '../../../../../images/noImageAvailable.svg'),
      (a.alt = 'No image available')),
    a.classList.add(
      'aspect-square',
      'rounded-md',
      'object-cover',
      'object-center',
      'w-full',
      'md:aspect-4/3',
    ),
    s.appendChild(a);
  const i = document.createElement('div');
  i.classList.add('flex', 'items-center', 'flex-wrap', 'gap-2', 'mb-6'),
    r.forEach((S) => {
      const q = document.createElement('button');
      q.setAttribute('aria-label', 'View the listing image');
      const U = document.createElement('img');
      U.classList.add(
        'w-14',
        'opacity-70',
        'aspect-square',
        'rounded-md',
        'object-cover',
        'object-center',
        'md:aspect-4/3',
        'lg:w-20',
      ),
        (U.src = S.url),
        (U.alt = S.alt),
        q.appendChild(U),
        i.appendChild(q),
        q.addEventListener('click', () => {
          s.innerHTML = `<img src="${S.url}" class="aspect-square rounded-md object-cover object-center w-full md:aspect-4/3" alt="${S.alt}" >`;
        });
    }),
    n.append(s, i);
  const o = document.createElement('div');
  o.classList.add('lg:w-1/2');
  const l = document.createElement('div');
  l.classList.add(
    'update',
    'font-semibold',
    'font-display',
    'mb-3',
    'text-end',
    'lg:hidden',
  );
  const h = document.createElement('h1');
  (h.textContent = d.title),
    h.classList.add(
      'text-2xl',
      'font-display',
      'font-bold',
      'mb-2',
      'break-words',
    );
  const f = document.createElement('p');
  (f.textContent = d.description), f.classList.add('text-base', 'mb-6');
  const m = document.createElement('ul');
  m.classList.add('flex', 'justify-between', 'items-center', 'mb-6');
  const w = J(d),
    p = z(d);
  m.append(w, p);
  const u = document.createElement('form');
  (u.name = 'bid'), u.classList.add('flex', 'gap-2', 'mb-3');
  const c = document.createElement('label');
  (c.htmlFor = 'bidding'), c.classList.add('w-3/5');
  const b = document.createElement('input');
  (b.name = 'amount'),
    (b.id = 'bidding'),
    (b.type = 'number'),
    (b.placeholder = 'Enter your bid amount'),
    (b.required = !0),
    b.classList.add(
      'border',
      'border-outline',
      'rounded-md',
      'p-4',
      'placeholder-light-gray',
      'w-full',
    );
  const y = document.createElement('button');
  (y.textContent = 'Place a bid'),
    y.setAttribute('aria-label', 'Place a bid'),
    y.classList.add('btn-blue', 'py-4', 'w-2/5', 'lg:text-base'),
    (y.type = 'submit');
  const E = sessionStorage.getItem('username');
  d.seller.name === E &&
    ((b.disabled = !0),
    (b.style.cursor = 'not-allowed'),
    (b.placeholder = 'Bidding disabled'),
    (y.disabled = !0),
    (y.style.cursor = 'not-allowed')),
    c.appendChild(b),
    u.append(c, y);
  const L = document.createElement('p');
  (L.textContent = 'Your current credits:'), L.classList.add('text-sm', 'mb-8');
  const x = document.createElement('span');
  (x.textContent = sessionStorage.getItem('credits')),
    x.classList.add('font-bold', 'ml-1', 'text-base'),
    L.appendChild(x),
    E ||
      ((b.disabled = !0),
      (b.style.cursor = 'not-allowed'),
      (y.disabled = !0),
      (y.style.cursor = 'not-allowed'),
      (L.textContent = 'Please log in to place a bid on this listing.'),
      L.classList.add('font-medium'));
  const v = document.createElement('div');
  v.classList.add('mb-10');
  const k = document.createElement('p');
  (k.textContent = 'Owner'),
    k.classList.add('text-sm', 'font-medium', 'text-gray', 'mb-2');
  const I = document.createElement('div');
  I.classList.add('flex', 'items-center', 'gap-2', 'justify-start');
  const C = document.createElement('img');
  (C.alt = d.seller.avatar.alt),
    (C.src = d.seller.avatar.url),
    C.classList.add('w-7', 'h-7', 'rounded-full');
  const T = document.createElement('a');
  T.setAttribute('aria-label', "View owner's profile page"),
    (T.textContent = d.seller.name),
    (T.href = `/profile/?name=${d.seller.name}`),
    T.classList.add(
      'font-semibold',
      'text-sm',
      'underline',
      'lg:text-base',
      'lg:font-medium',
    ),
    I.append(C, T),
    v.append(k, I);
  const P = document.createElement('div'),
    F = document.createElement('p');
  (F.textContent = 'Bid history'),
    F.classList.add('text-sm', 'font-medium', 'text-gray');
  const A = document.createElement('ul'),
    R = d.bids;
  if (R.length > 0)
    R.forEach((S) => {
      const q = document.createElement('li');
      q.classList.add(
        'flex',
        'items-center',
        'justify-between',
        'py-4',
        'border-b',
        'border-outline-light',
      );
      const U = document.createElement('div');
      U.classList.add('flex', 'items-center', 'gap-2');
      const M = document.createElement('img');
      (M.alt = S.bidder.avatar.alt || "Bidder's avatar"),
        (M.src = S.bidder.avatar.url),
        M.classList.add('w-7', 'h-7', 'rounded-full');
      const H = document.createElement('a');
      H.setAttribute('aria-label', "View bidder's profile page"),
        (H.textContent = S.bidder.name),
        (H.href = `/profile/?name=${S.bidder.name}`),
        H.classList.add(
          'font-semibold',
          'text-sm',
          'underline',
          'lg:text-base',
          'lg:font-medium',
        ),
        U.append(M, H);
      const D = document.createElement('p');
      (D.textContent = S.amount),
        D.classList.add('lg:text-lg', 'lg:font-medium');
      const V = document.createElement('i');
      V.classList.add('fa-solid', 'fa-coins', 'ml-1.5'),
        D.appendChild(V),
        q.append(U, D),
        A.appendChild(q);
    }),
      P.append(F, A);
  else {
    const S = document.createElement('p');
    (S.textContent = 'No bid placed yet'),
      S.classList.add('mt-2', 'font-medium', 'text-sm'),
      P.append(F, S);
  }
  o.append(l, h, f, m, u, L, v), E && o.appendChild(P);
  const O = document.createElement('a');
  O.setAttribute('aria-label', 'Top page');
  const N = sessionStorage.getItem('page');
  (O.href = `/?page=${N}`),
    (O.textContent = 'Back to listings'),
    O.classList.add(
      'inline-block',
      'underline',
      'font-display',
      'font-medium',
      'text-base',
      'mt-8',
      'lg:mt-14',
    );
  const j = document.createElement('i');
  return (
    j.classList.add('fa-solid', 'fa-arrow-left', 'mr-1'),
    O.prepend(j),
    t.append(n, o),
    e.append(t, O),
    e
  );
}
function re() {
  const d = document.createElement('div');
  d.classList.add(
    'border',
    'border-outline-light',
    'rounded-md',
    'px-4',
    'py-6',
    'animate-pulse',
    'lg:pb-8',
  );
  const e = document.createElement('div');
  e.classList.add(
    'aspect-square',
    'bg-gray-300',
    'rounded-md',
    'mb-3',
    'bg-outline-light',
  );
  const t = document.createElement('div');
  t.classList.add(
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
  const s = document.createElement('div');
  s.classList.add('bg-outline-light', 'h-4', 'w-1/4', 'rounded');
  const a = document.createElement('div');
  return (
    a.classList.add('bg-outline-light', 'h-4', 'w-1/4', 'rounded'),
    n.append(s, a),
    d.append(e, t, n),
    d
  );
}
function ie() {
  const d = document.createElement('ul');
  d.classList.add(
    'flex',
    'justify-between',
    'items-center',
    'px-6',
    'py-3',
    'text-blue',
  );
  const e = document.createElement('li');
  e.classList.add('flex', 'justify-center'),
    (e.innerHTML =
      '<a href="/" aria-label="View top page"><i class="fa-solid fa-house text-2xl"></i></a>');
  const t = document.createElement('li');
  t.classList.add('flex', 'justify-center'),
    (t.innerHTML =
      '<a href="/listing/create/" aria-label="Create a new listing"><i class="fa-regular fa-square-plus text-2xl"></i></a>');
  const n = sessionStorage.getItem('username'),
    s = document.createElement('li');
  s.classList.add('flex', 'justify-center');
  const a = document.createElement('a');
  a.setAttribute('aria-label', 'View profile page'),
    (a.href = `/profile/?name=${n}`);
  const r = document.createElement('img');
  return (
    r.classList.add(
      'user-avatar',
      'w-8',
      'h-8',
      'rounded-full',
      'object-cover',
    ),
    a.appendChild(r),
    s.appendChild(a),
    d.append(e, t, s),
    d
  );
}
class B extends g {
  constructor() {
    super(), this.router();
  }
  async router(e = window.location.pathname) {
    const n = new URLSearchParams(window.location.search).get('page') || 1;
    switch (e) {
      case '/':
        this.events.listing.displaySkeleton(24),
          await this.views.listingFeed(n);
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
  static form = {
    formSubmit(e) {
      e.preventDefault();
      const t = e.target,
        n = new FormData(t);
      return Object.fromEntries(n.entries());
    },
  };
  static get user() {
    return sessionStorage.getItem('username');
  }
  views = {
    listingFeed: async (e) => {
      this.events.headerToggle(),
        this.events.footerToggle(),
        this.events.listing.imageSlider(),
        await this.events.listing.displayListings(e),
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
  };
  events = {
    register: async (e) => {
      const t = B.form.formSubmit(e),
        { name: n, email: s } = t;
      try {
        await this.auth.register(t),
          alert(`Thank you for registering!
Username: ${n}
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
      const t = B.form.formSubmit(e);
      try {
        await this.auth.login(t),
          alert('You have successfully logged in!'),
          (window.location.href = '/');
      } catch (n) {
        alert(`Could not log in with this account.
${n.message}.
Please try again.`);
      }
    },
    headerToggle: () => {
      const e = sessionStorage.getItem('token'),
        t = document.querySelector('header');
      if (e) {
        const n = Z();
        t.appendChild(n), this.avatar.userAvatar();
      } else {
        const n = ee();
        t.appendChild(n);
      }
    },
    footerToggle: () => {
      const e = sessionStorage.getItem('token'),
        t = document.querySelector('.authenticated-footer');
      if (e) {
        const n = ie();
        t.appendChild(n), this.avatar.userAvatar();
      } else return 0;
    },
    logout: () => {
      document.querySelectorAll('.logout-button').forEach((t) => {
        t.addEventListener('click', (n) => {
          n.preventDefault(),
            sessionStorage.removeItem('token'),
            sessionStorage.removeItem('username'),
            sessionStorage.removeItem('credits'),
            sessionStorage.removeItem('page'),
            alert('You have successfully logged out.'),
            (window.location.href = '/');
        });
      });
    },
    listing: {
      displaySkeleton: (e) => {
        const t = document.querySelector('.listings-container');
        t.innerHTML = '';
        const n = document.createDocumentFragment();
        for (let s = 0; s < e; s++) {
          const a = re();
          n.appendChild(a);
        }
        t.appendChild(n);
      },
      displayListings: async (e = 1, t = 'created', n = 'desc', s = !0) => {
        try {
          const a = document.querySelector('.listings-container'),
            r = await this.listing.get24Listings(24, e, t, n, s),
            { data: i, meta: o } = r,
            { currentPage: l, pageCount: h } = o,
            f = `${window.location.pathname}?page=${e}`;
          window.history.replaceState({}, '', f),
            this.pagination.homePagination(l, h),
            (a.innerHTML = ''),
            i.forEach((m) => {
              const w = Q(m);
              a.appendChild(w);
            });
        } catch (a) {
          alert(`Could not display listings.
${a.message}.
Please come back again later.`);
        }
      },
      displaySingleListing: async () => {
        try {
          const t = new URLSearchParams(window.location.search).get('id'),
            n = await this.listing.getSingleListing(t),
            { data: s } = n,
            a = document.querySelector('.listing-item-container');
          a.innerHTML = '';
          const r = ae(s);
          a.appendChild(r),
            s.seller.name === B.user &&
              document.querySelectorAll('.update').forEach((f) => {
                const m = document.createElement('a');
                (m.textContent = 'Update Listing'),
                  m.classList.add('btn-green'),
                  m.setAttribute('aria-label', 'Update listing'),
                  m.addEventListener('click', () => {
                    window.location.href = `/listing/update/?id=${t}`;
                  }),
                  f.appendChild(m);
              }),
            document.forms.bid.addEventListener('submit', this.events.bid);
          const o = document.querySelector('meta[name="description"]'),
            l = s.description;
          l ? o.setAttribute('content', l) : o.setAttribute('content', s.title);
        } catch (e) {
          alert(`Could not display the listing.
${e.message}.
Please try again later.`);
        }
      },
      imageSlider: async () => {
        const e = document.querySelector('.image-slider-container');
        e.innerHTML = '';
        const t = await se();
        for (let n = 0; n < 3; n++) {
          const s = document.createElement('img');
          (s.src = t[n].url),
            (s.alt = t[n].alt || `Image ${n + 1}`),
            s.classList.add(
              `img-${n}`,
              'absolute',
              'top-0',
              'bottom-0',
              'right-0',
              'left-0',
              'm-auto',
              'max-h-[80%]',
              'max-w-[90%]',
              'opacity-0',
              'md:object-contain',
              'md:w-full',
            ),
            e.appendChild(s);
        }
      },
      create: async (e) => {
        e.preventDefault();
        const t = B.form.formSubmit(e),
          { title: n, description: s, endingDate: a, endingTime: r } = t,
          i = document.querySelectorAll('.image-list'),
          o = [],
          l = [];
        i.forEach((p) => {
          const u = p.querySelector('input[name="mediaUrl"]').value,
            c = p.querySelector('input[name="mediaAlt"]').value;
          o.push(u), l.push(c);
        });
        const h = o.map((p, u) => ({ url: p, alt: l[u] })),
          f = `${a}T${r}:00.000Z`,
          w = new Date(f).toISOString();
        try {
          await this.listing.create({
            title: n,
            description: s,
            media: h,
            endsAt: w,
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
        const t = new URLSearchParams(window.location.search).get('id'),
          n = await this.listing.getSingleListing(t),
          { data: s } = n,
          a = document.getElementById('title');
        a.value = s.title;
        const r = document.getElementById('description');
        r.value = s.description;
        const i = s.media,
          o = document.getElementById('img-url');
        o.value = i[0].url;
        const l = document.getElementById('img-alt');
        if (((l.value = i[0].alt), i.length > 1))
          for (let c = 1; c < i.length; c++) {
            const b = document.createElement('div');
            b.classList.add(
              'image-list',
              'flex',
              'justify-between',
              'items-center',
              'gap-2',
              'lg:gap-4',
            );
            const y = document.createElement('label');
            (y.htmlFor = `img-url-${c + 1}`),
              y.classList.add(
                'url-label',
                'font-display',
                'font-semibold',
                'lg:w-1/2',
              ),
              (y.textContent = 'Image url');
            const E = document.createElement('input');
            (E.type = 'url'),
              (E.name = 'mediaUrl'),
              (E.id = `img-url-${c + 1}`),
              E.classList.add(
                'border',
                'border-outline',
                'p-4',
                'block',
                'w-full',
                'rounded-md',
                'mt-1',
                'mb-4',
              ),
              (E.value = i[c].url),
              y.appendChild(E);
            const L = document.createElement('label');
            (L.htmlFor = `img-alt-${c + 1}`),
              L.classList.add('font-display', 'font-semibold', 'lg:w-1/2'),
              (L.textContent = 'Image alt');
            const x = document.createElement('input');
            (x.type = 'alt'),
              (x.name = 'mediaAlt'),
              (x.id = `img-alt-${c + 1}`),
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
              (x.value = i[c].alt),
              L.appendChild(x);
            const v = document.createElement('button');
            (v.type = 'button'),
              v.setAttribute('aria-label', 'Remove image'),
              (v.innerHTML =
                '<i class="fa-regular fa-circle-xmark text-xl text-blue"></i>'),
              v.addEventListener('click', () => {
                v.closest('.image-list').remove();
              }),
              b.append(y, L, v);
            const k = document.querySelector('.add-img');
            document.forms.updateListing.insertBefore(b, k);
          }
        const h = s.endsAt,
          f = new Date(h),
          m = f.toISOString().split('T')[0],
          w = f.toLocaleTimeString('en-US', {
            hour12: !1,
            hour: '2-digit',
            minute: '2-digit',
          }),
          p = document.getElementById('endingDate');
        p.value = m;
        const u = document.getElementById('endingTime');
        u.value = w;
        try {
          document.forms.updateListing.addEventListener('submit', (b) => {
            b.preventDefault();
            const y = B.form.formSubmit(b),
              { title: E, description: L } = y,
              x = document.querySelectorAll('.image-list'),
              v = [],
              k = [];
            x.forEach((C) => {
              const T = C.querySelector('input[name="mediaUrl"]').value,
                P = C.querySelector('input[name="mediaAlt"]').value;
              v.push(T), k.push(P);
            });
            const I = v.map((C, T) => ({ url: C, alt: k[T] }));
            this.listing.update(t, { title: E, description: L, media: I });
          });
        } catch (c) {
          alert(`Could not update the listing.
${c.message}.
Please try again.`);
        }
      },
      delete: async () => {
        document.querySelector('.delete-btn').addEventListener('click', () => {
          const n = new URLSearchParams(window.location.search).get('id');
          try {
            window.confirm('Are you sure you want to delete this?') &&
              this.listing.delete(n);
          } catch (s) {
            alert(`Could not delete the listing.
${s.message}.
Please try again.`);
          }
        });
      },
      displaySearchResult: async (e, t = 1, n = 'created', s = 'desc') => {
        try {
          const a = await this.listing.search(e, 24, t, n, s),
            { data: r, meta: i } = a,
            { currentPage: o, pageCount: l } = i,
            h = `${window.location.pathname}?page=${t}&query=${e}`;
          window.history.replaceState({}, '', h),
            this.pagination.homePagination(o, l);
          const f = document.querySelector('.listings-container');
          (f.innerHTML = ''),
            r.forEach((m) => {
              const w = Q(m);
              f.appendChild(w);
            });
        } catch (a) {
          alert(`Could not search listings.
${a.message}.
Please try again later.`);
        }
      },
      search: async (e) => {
        e.preventDefault();
        const n = B.form.formSubmit(e).search,
          s = document.querySelector('.result');
        s.textContent = '';
        const a = await this.listing.search(n),
          { meta: r } = a,
          i = r.totalCount,
          o = document.getElementById('search');
        try {
          (this.currentQuery = n), this.events.listing.displaySearchResult(n);
          const l = document.querySelector('.sorting-list');
          l.classList.add('hidden');
          const h = document.querySelector('.filtering-list');
          h.classList.add('hidden');
          const f = n.charAt(0).toUpperCase() + n.substring(1).toLowerCase(),
            m = document.createElement('p');
          (m.textContent = f),
            m.classList.add(
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
          const w = document.createElement('span');
          (w.textContent = ` (${i})`),
            w.classList.add(
              'font-normal',
              'text-lg',
              'leading-8',
              'font-display',
            );
          const p = document.getElementById('newest');
          p.checked = !0;
          const u = document.getElementById('showActive'),
            c = document.getElementById('showAll');
          (u.disabled = !0),
            (c.disabled = !0),
            (u.checked = !1),
            (c.checked = !0),
            h.querySelectorAll('input, label').forEach((L) => {
              L.style.cursor = 'not-allowed';
            });
          const y = document.createElement('button');
          y.setAttribute('aria-label', 'Clear search'),
            y.classList.add('ml-3'),
            (y.innerHTML =
              '<i class="fa-solid fa-xmark text-gray text-sm"></i>'),
            m.append(w, y),
            s.append(m),
            document
              .querySelector('.search-form')
              .insertAdjacentElement('afterend', s),
            y.addEventListener('click', () => {
              (o.value = ''),
                m.remove(),
                (this.currentQuery = ''),
                (u.disabled = !1),
                (c.disabled = !1),
                (u.checked = !0),
                (c.checked = !1),
                h.classList.add('hidden'),
                h.querySelectorAll('input, label').forEach((v) => {
                  v.style.cursor = 'pointer';
                }),
                this.events.listing.displayListings(),
                this.filtering.removeCheckedAttribute();
              const x = document.getElementById('newest');
              (x.checked = !0), l.classList.add('hidden');
            });
        } catch (l) {
          alert(`Something went wrong while searching.
${l.message}.
Please try again later.`);
        }
      },
      addImage: () => {
        let e = 1;
        document.querySelector('.add-img').addEventListener('click', () => {
          e++;
          const n = document.createElement('div');
          n.classList.add(
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
          const r = document.createElement('label');
          r.classList.add('font-display', 'font-semibold', 'lg:w-1/2'),
            (r.textContent = 'Image alt');
          const i = document.createElement('input');
          (i.type = 'alt'),
            (i.name = 'mediaAlt'),
            i.classList.add(
              'border',
              'border-outline',
              'p-4',
              'block',
              'w-full',
              'rounded-md',
              'mt-1',
              'mb-4',
            ),
            (i.required = !0),
            r.appendChild(i),
            window.location.pathname === '/listing/update/'
              ? ((s.htmlFor = `img-url-${e}-update`),
                (r.htmlFor = `img-alt-${e}-update`),
                (a.id = `img-url-${e}-update`),
                (i.id = `img-alt-${e}-update`))
              : ((s.htmlFor = `img-url-${e}`),
                (r.htmlFor = `img-alt-${e}`),
                (a.id = `img-url-${e}`),
                (i.id = `img-alt-${e}`));
          const l = document.createElement('button');
          if (
            ((l.type = 'button'),
            l.setAttribute('aria-label', 'Remove image'),
            (l.innerHTML =
              '<i class="fa-regular fa-circle-xmark text-xl text-blue"></i>'),
            l.addEventListener('click', () => {
              l.closest('.image-list').remove();
            }),
            n.append(s, r, l),
            document.querySelectorAll('.image-list').length < 8)
          ) {
            const f = document.querySelector('.add-img');
            document.querySelector('form').insertBefore(n, f);
          } else
            alert(`You have reached the limit!
You can upload a maximum of 8 images.`);
        });
      },
    },
    profile: {
      displayProfile: async (e = 1, t = 'created', n = 'desc', s = !0) => {
        const r = new URLSearchParams(window.location.search).get('name');
        try {
          const i = await this.profile.getProfile(r),
            { data: o } = i,
            l = document.querySelector('.header-authenticated');
          (l.style.backgroundImage = `url(${o.banner.url})`),
            (l.style.backgroundRepeat = 'no repeat'),
            (l.style.backgroundSize = 'cover'),
            (l.style.backgroundPosition = 'center');
          const h = document.querySelector('.avatar');
          (h.src = o.avatar.url), (h.alt = o.avatar.alt);
          const f = document.querySelector('.username');
          f.textContent = o.name;
          const m = document.querySelector('.bio');
          m.textContent = o.bio;
          const w = document.querySelector('.credits');
          w.textContent = o.credits;
          const p = document.querySelector('.item-count');
          p.textContent = o._count.listings;
          const u = await this.listing.getUsersListings(24, e, t, n, s, r),
            c = u.data,
            b = u.meta,
            y = document.querySelector('.listings-container');
          (y.innerHTML = ''),
            c.forEach((I) => {
              const C = Q(I);
              y.appendChild(C);
            });
          const { currentPage: E, pageCount: L } = b,
            x = `${window.location.pathname}?name=${r}&page=${e}`;
          window.history.replaceState({}, '', x),
            this.pagination.homePagination(E, L);
          const v = document.querySelector('meta[name="description"]'),
            k = o.name;
          v.setAttribute('content', `Profile page of ${k}`);
        } catch (i) {
          B.user
            ? alert(`Could not display profile page.
${i.message}.
Please try again later.`)
            : (alert(`You need to log in to access this profile.
Please log in or create an account to continue.`),
              (window.location.href = '/'));
        }
      },
      displayUpdateProfileButton: () => {
        const t = new URLSearchParams(window.location.search).get('name'),
          n = document.querySelector('.update-btn-container');
        n.classList.add('absolute', '-top-1/2', 'lg:top-0', 'right-0');
        const s = document.createElement('a');
        s.classList.add('btn-green', 'font-display', 'font-semibold'),
          (s.textContent = 'Update Profile'),
          s.setAttribute('aria-label', 'To update profile page'),
          (s.href = '/profile/update/'),
          t === B.user && n.appendChild(s);
      },
      updateProfile: async () => {
        const { data: e } = await this.profile.getProfile(B.user),
          t = document.getElementById('bio');
        t.value = e.bio;
        const n = document.getElementById('banner-url');
        n.value = e.banner.url;
        const s = document.getElementById('banner-alt');
        s.value = e.banner.alt;
        const a = document.getElementById('avatar-url');
        a.value = e.avatar.url;
        const r = document.getElementById('avatar-alt');
        r.value = e.avatar.alt;
        try {
          document.forms.updateProfile.addEventListener('submit', (o) => {
            o.preventDefault();
            const l = B.form.formSubmit(o),
              {
                bio: h,
                bannerUrl: f,
                bannerAlt: m,
                avatarUrl: w,
                avatarAlt: p,
              } = l,
              u = { url: f, alt: m },
              c = { url: w, alt: p };
            this.profile.updateProfile(B.user, {
              bio: h,
              banner: u,
              avatar: c,
            });
          });
        } catch (i) {
          alert(`Could not update your profile.
${i.message}.
Please try again.`);
        }
      },
    },
    bid: async (e) => {
      const t = B.form.formSubmit(e),
        s = new URLSearchParams(window.location.search).get('id');
      try {
        await this.bid.bid(s, { amount: Number(t.amount) });
        const a = sessionStorage.getItem('credits'),
          r = Number(a) - Number(t.amount);
        sessionStorage.setItem('credits', r),
          alert('Success! Your bid has been placed. Good luck!'),
          (window.location.href = `/listing/?id=${s}`);
      } catch (a) {
        alert(`Could not bid on this listing.
${a.message}.
Please try again.`);
      }
    },
  };
  avatar = {
    userAvatar: async () => {
      const e = sessionStorage.getItem('username'),
        t = await this.profile.getProfile(e),
        { data: n } = t;
      document.querySelectorAll('.user-avatar').forEach((a) => {
        (a.src = n.avatar.url), (a.alt = n.avatar.alt);
      });
    },
  };
  currentSortBy = 'created';
  currentSortOrder = 'desc';
  currentFilter = !0;
  currentQuery = new URLSearchParams(window.location.search).get('query') || '';
  filtering = {
    openSorting: () => {
      const e = document.querySelector('.sort-by'),
        t = document.querySelector('.sorting-list');
      e.addEventListener('click', () => {
        t.classList.contains('hidden')
          ? t.classList.toggle('hidden')
          : t.classList.add('hidden');
      }),
        [...document.querySelectorAll('.sorting-list label')].forEach((s) => {
          s.addEventListener('click', () => {
            t.classList.add('hidden');
          });
        }),
        this.filtering.descending(),
        this.filtering.ascending(),
        this.filtering.endingSoon(),
        this.filtering.resentUpdate();
    },
    removeCheckedAttribute: () => {
      document.getElementsByName('sort').forEach((t) => {
        t.checked = !1;
      });
    },
    descending: () => {
      const e = document.getElementById('newest'),
        t = window.location.pathname;
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
            : !this.currentQuery && t === '/'
              ? ((this.currentSortOrder = 'desc'),
                (this.currentSortBy = 'created'),
                this.events.listing.displayListings(
                  1,
                  this.currentSortBy,
                  this.currentSortOrder,
                  this.currentFilter,
                ))
              : t === '/profile/' &&
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
        t = window.location.pathname;
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
            : !this.currentQuery && t === '/'
              ? ((this.currentSortOrder = 'asc'),
                (this.currentSortBy = 'created'),
                this.events.listing.displayListings(
                  1,
                  this.currentSortBy,
                  this.currentSortOrder,
                  this.currentFilter,
                ))
              : t === '/profile/' &&
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
        t = window.location.pathname;
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
            : !this.currentQuery && t === '/'
              ? ((this.currentSortBy = 'endsAt'),
                (this.currentSortOrder = 'asc'),
                this.events.listing.displayListings(
                  1,
                  this.currentSortBy,
                  this.currentSortOrder,
                  this.currentFilter,
                ))
              : t === '/profile/' &&
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
        t = window.location.pathname;
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
            : !this.currentQuery && t === '/'
              ? ((this.currentSortBy = 'updated'),
                (this.currentSortOrder = 'desc'),
                this.events.listing.displayListings(
                  1,
                  this.currentSortBy,
                  this.currentSortOrder,
                  this.currentFilter,
                ))
              : t === '/profile/' &&
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
        t = document.querySelector('.filtering-list');
      e.addEventListener('click', () => {
        t.classList.contains('hidden')
          ? t.classList.toggle('hidden')
          : t.classList.add('hidden');
      }),
        [...document.querySelectorAll('.filtering-list label')].forEach((s) => {
          s.addEventListener('click', () => {
            t.classList.add('hidden');
          });
        }),
        this.filtering.showAll(),
        this.filtering.showActive();
    },
    showAll: () => {
      const e = document.getElementById('showAll'),
        t = document.getElementById('showActive'),
        n = window.location.pathname;
      e.addEventListener('click', () => {
        n === '/'
          ? ((this.currentFilter = !1),
            this.events.listing.displayListings(
              1,
              this.currentSortBy,
              this.currentSortOrder,
              this.currentFilter,
            ))
          : n === '/profile/' &&
            ((this.currentFilter = !1),
            this.events.profile.displayProfile(
              1,
              this.currentSortBy,
              this.currentSortOrder,
              this.currentFilter,
            )),
          (t.checked = !1),
          (e.checked = !0);
      });
    },
    showActive: () => {
      const e = document.getElementById('showActive'),
        t = document.getElementById('showAll'),
        n = window.location.pathname;
      e.addEventListener('click', () => {
        n === '/'
          ? ((this.currentFilter = !0),
            this.events.listing.displayListings(
              1,
              this.currentSortBy,
              this.currentSortOrder,
              this.currentFilter,
            ))
          : n === '/profile/' &&
            ((this.currentFilter = !0),
            this.events.profile.displayProfile(
              1,
              this.currentSortBy,
              this.currentSortOrder,
              this.currentFilter,
            )),
          (t.checked = !1),
          (e.checked = !0);
      });
    },
  };
  pagination = {
    homePagination: (e, t) => {
      const n = document.querySelector('.pagination');
      n.innerHTML = '';
      const s = window.location.pathname,
        a = document.querySelector('.listings-feed'),
        r = document.querySelector('.user-listings-feed'),
        i = () => {
          const p = document.createElement('span');
          return (p.textContent = '...'), p;
        },
        o = (p, u) => {
          const c = document.createElement('button');
          return (
            c.setAttribute('aria-label', `To page ${p}`),
            (c.textContent = p),
            (c.dataset.page = u),
            c.classList.add(
              'w-8',
              'h-8',
              'rounded-full',
              'text-blue',
              'bg-white',
              'font-medium',
              'border',
              'border-blue',
            ),
            e === u &&
              (c.classList.add('current-page', 'text-white', 'bg-blue'),
              c.classList.remove('text-blue', 'bg-white')),
            c.addEventListener('click', () => {
              this.currentQuery
                ? (this.events.listing.displaySearchResult(
                    this.currentQuery,
                    u,
                    this.currentSortBy,
                    this.currentSortOrder,
                    this.currentFilter,
                  ),
                  a.scrollIntoView({ behavior: 'smooth', block: 'start' }))
                : s === '/'
                  ? (this.events.listing.displayListings(
                      u,
                      this.currentSortBy,
                      this.currentSortOrder,
                      this.currentFilter,
                    ),
                    a.scrollIntoView({ behavior: 'smooth', block: 'start' }))
                  : s === '/profile/' &&
                    (this.events.profile.displayProfile(
                      u,
                      this.currentSortBy,
                      this.currentSortOrder,
                      this.currentFilter,
                    ),
                    r.scrollIntoView({ behavior: 'smooth', block: 'start' }));
            }),
            c
          );
        };
      if (t <= 5)
        for (let p = 1; p < t + 1; p++) {
          const u = o(p, p);
          n.appendChild(u);
        }
      if (t > 5) {
        if (e <= 3) {
          for (let u = 1; u < 4; u++) {
            const c = o(u, u);
            n.appendChild(c);
          }
          n.appendChild(i());
          const p = o(t, t);
          n.appendChild(p);
        }
        if (e > 3 && e <= t - 3) {
          const p = o(1, 1);
          n.appendChild(p), n.appendChild(i());
          for (let c = e - 1; c < e + 2; c++) {
            const b = o(c, c);
            n.appendChild(b);
          }
          n.appendChild(i());
          const u = o(t, t);
          n.appendChild(u);
        }
        if (e > 3 && e > t - 3) {
          const p = o(1, 1);
          n.appendChild(p), n.appendChild(i());
          for (let u = t - 2; u <= t; u++) {
            const c = o(u, u);
            n.appendChild(c);
          }
        }
      }
      const l = document.createElement('button');
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
        l.setAttribute('aria-label', 'Previous page'),
        e === 1 &&
          ((l.disabled = !0),
          (l.style.cursor = 'not-allowed'),
          (l.style.opacity = '0.4')),
        l.addEventListener('click', () => {
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
                r.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        });
      const h = document.createElement('i');
      h.classList.add('fa-solid', 'fa-angle-left'), l.appendChild(h);
      const f = document.querySelector('[data-page="1"]');
      n.insertBefore(l, f);
      const m = document.createElement('button');
      m.classList.add(
        'w-8',
        'h-8',
        'rounded-full',
        'text-blue',
        'bg-white',
        'font-medium',
        'border',
        'border-blue',
      ),
        m.setAttribute('aria-label', 'Next page'),
        (e === t || t === 0) &&
          ((m.disabled = !0),
          (m.style.cursor = 'not-allowed'),
          (m.style.opacity = '0.4')),
        m.addEventListener('click', () => {
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
                r.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        });
      const w = document.createElement('i');
      return (
        w.classList.add('fa-solid', 'fa-angle-right'),
        m.appendChild(w),
        n.appendChild(m),
        n
      );
    },
  };
  loader = {
    hideLoading: () => {
      const e = document.querySelector('.loader');
      e.classList.add('hidden'), e.classList.remove('flex');
    },
  };
}
new B();
