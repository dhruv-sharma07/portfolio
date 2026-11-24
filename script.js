const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const main = document.querySelector('main');
const rooms = document.querySelector('#rooms');
const roomPages = new Map(Array.from(rooms.querySelectorAll('[data-room-page]'), page => [page.id, page]));
const headerLinks = document.querySelectorAll('#primary-nav a');
const skipLink = document.querySelector('.skip-link');
const curtain = document.querySelector('.door-transition');
const curtainPanel = curtain.firstElementChild;
const doorSection = document.querySelector('#projects');
const doorStage = doorSection.querySelector('.door-stage');
let currentRoom = '';
let lastDoor;
let doorRun;

const themePull = document.querySelector('.theme-pull');
const themeKey = 'dhruv-portfolio-theme';
let savedTheme;
try {
  savedTheme = localStorage.getItem(themeKey);
} catch {}

function applyTheme(dark) {
  root.dataset.theme = dark ? 'dark' : 'light';
  themePull.setAttribute('aria-pressed', String(dark));
}

applyTheme(savedTheme === 'dark');
themePull.hidden = false;
let pullStart;
themePull.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  pullStart = event.clientY;
  themePull.setPointerCapture(event.pointerId);
});
themePull.addEventListener('pointermove', event => {
  if (pullStart === undefined || !themePull.hasPointerCapture(event.pointerId)) return;
  const distance = Math.min(Math.max(event.clientY - pullStart, 0), 48);
  themePull.style.setProperty('--pull-distance', `${distance}px`);
  themePull.classList.toggle('is-pulling', distance > 3 && !reducedMotion.matches);
});
themePull.addEventListener('lostpointercapture', () => {
  pullStart = undefined;
  themePull.classList.remove('is-pulling');
});
themePull.addEventListener('click', () => {
  applyTheme(root.dataset.theme !== 'dark');
  try {
    localStorage.setItem(themeKey, root.dataset.theme);
  } catch {}
  themePull.classList.remove('is-pulling', 'is-swinging');
  requestAnimationFrame(() => themePull.classList.add('is-swinging'));
});
themePull.addEventListener('animationend', () => themePull.classList.remove('is-swinging'));

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
menu.hidden = false;
root.classList.add('has-menu');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  menu.setAttribute('aria-expanded', String(open));
}

menu.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    setMenu(false);
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) setMenu(false);
});

const clock = document.querySelector('#local-clock');
const timeFormat = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true });
function updateClock() {
  clock.textContent = `${timeFormat.format(new Date()).toUpperCase()} IST`;
}
updateClock();
setInterval(updateClock, 15000);

function updateNavigation(section) {
  headerLinks.forEach(link => {
    const active = link.hash === `#${section}` || 
      (link.hash === '#my-story' && ['experience', 'education', 'my-story'].includes(section)) ||
      (link.hash === '#web-development' && ['nyayabot', 'wardrobe-ai', 'vestiar', 'web-development'].includes(section)) ||
      (link.hash === '#app-development' && ['eduplay', 'app-development'].includes(section)) ||
      (link.hash === '#ui-ux-design' && section === 'ui-ux-design') ||
      (link.hash === '#graphic-design' && section === 'graphic-design');
    if (active) link.setAttribute('aria-current', roomPages.has(section) ? 'page' : 'location');
    else link.removeAttribute('aria-current');
  });
}

function displayPage(section, moveFocus = false) {
  const previousRoom = currentRoom;
  const room = roomPages.get(section);
  currentRoom = room ? section : '';
  main.hidden = Boolean(room);
  rooms.hidden = !room;
  roomPages.forEach((page, key) => { page.hidden = key !== currentRoom; });
  skipLink.hash = room ? '#rooms' : '#main';
  updateNavigation(section || 'home');

  if (room) {
    if (previousRoom !== currentRoom) window.scrollTo({ top: 0, behavior: 'instant' });
    if (moveFocus) room.querySelector('h2').focus({ preventScroll: true });
  } else if (previousRoom || moveFocus) {
    const target = document.getElementById(section || 'home');
    target?.scrollIntoView({ behavior: previousRoom || reducedMotion.matches ? 'instant' : 'smooth' });
    if (section === 'projects' && previousRoom && lastDoor) {
      const bounds = lastDoor.getBoundingClientRect();
      if (bounds.bottom > window.innerHeight || bounds.top < 0) lastDoor.scrollIntoView({ block: 'center', behavior: 'instant' });
      lastDoor.focus({ preventScroll: true });
    } else if (moveFocus && target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }
  requestStoryUpdate();
}

function navigate(section) {
  if (location.hash !== `#${section}`) history.pushState(null, '', `#${section}`);
  displayPage(section, true);
}

function endDoorRun(run) {
  if (doorRun !== run) return;
  run.door.classList.remove('is-opening');
  run.zoom?.cancel();
  run.cover?.cancel();
  run.reveal?.cancel();
  curtain.hidden = true;
  doorRun = undefined;
}

async function openDoor(door) {
  if (doorRun) endDoorRun(doorRun);
  lastDoor = door;
  const section = door.dataset.room;
  if (reducedMotion.matches || !curtainPanel.animate) {
    navigate(section);
    return;
  }

  const run = { door };
  doorRun = run;
  const frame = door.querySelector('.door-frame').getBoundingClientRect();
  const centerX = frame.left + frame.width * .69;
  const centerY = frame.top + frame.height * .57;
  const stageBounds = doorStage.getBoundingClientRect();
  const stageOrigin = `${centerX - stageBounds.left}px ${centerY - stageBounds.top}px`;
  const offsetX = window.innerWidth / 2 - centerX;
  const offsetY = window.innerHeight / 2 - centerY;
  curtain.style.setProperty('--door-origin', `${centerX}px ${centerY}px`);
  curtain.hidden = false;
  door.classList.add('is-opening');
  run.zoom = doorStage.animate([
    { transform: 'none', transformOrigin: stageOrigin },
    { transform: 'none', transformOrigin: stageOrigin, offset: .2 },
    { transform: `translate(${offsetX}px, ${offsetY}px) scale(5)`, transformOrigin: stageOrigin }
  ], { duration: 575, easing: 'cubic-bezier(.48, .04, .32, 1)', fill: 'forwards' });
  run.cover = curtainPanel.animate([
    { opacity: 0, transform: 'scale(.1)' },
    { opacity: 0, transform: 'scale(.22)', offset: .5 },
    { opacity: 1, transform: 'scale(1.01)' }
  ], { duration: 575, easing: 'cubic-bezier(.35, .05, .35, 1)', fill: 'forwards' });

  try {
    await run.cover.finished;
    if (doorRun !== run) return;
    navigate(section);
    run.reveal = curtainPanel.animate([{ opacity: 1, transform: 'scale(1.01)' }, { opacity: 0, transform: 'scale(1.01)' }], { duration: 320, easing: 'ease-out', fill: 'forwards' });
    await run.reveal.finished;
  } catch {
  } finally {
    endDoorRun(run);
  }
}

document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const section = link.hash.slice(1);
  setMenu(false);
  if (link === skipLink) {
    event.preventDefault();
    const target = currentRoom ? roomPages.get(currentRoom).querySelector('h2') : main;
    target.setAttribute('tabindex', '-1');
    target.focus();
    return;
  }
  if (roomPages.has(section) || currentRoom || doorRun) {
    event.preventDefault();
    if (link.dataset.room) {
      openDoor(link);
    } else {
      if (doorRun) endDoorRun(doorRun);
      navigate(section);
    }
  } else {
    updateNavigation(section);
  }
});

window.addEventListener('hashchange', () => {
  if (doorRun) endDoorRun(doorRun);
  displayPage(location.hash.slice(1));
});

const roleText = document.querySelector('#role-text');
const bookPage = roleText.parentElement;
const roleToggle = document.querySelector('.role-toggle');
const roles = ['Web Development', 'Android Apps (Kotlin)', 'Full-Stack Systems', 'UI/UX Design'];
let roleIndex = 0;
let roleTimer;
let roleAnimation;
let rolePaused = false;
let roleInView = true;

roleToggle.addEventListener('click', () => {
  rolePaused = !rolePaused;
  roleToggle.setAttribute('aria-pressed', String(rolePaused));
  roleToggle.title = rolePaused ? 'Resume role animation' : 'Pause role animation';
  roleToggle.querySelector('use').setAttribute('href', rolePaused ? '#icon-play' : '#icon-pause');
  if (rolePaused) roleAnimation?.cancel();
  startRoleTimer();
});

function startRoleTimer() {
  clearTimeout(roleTimer);
  if (reducedMotion.matches || rolePaused || !roleInView || document.hidden || main.hidden || !bookPage.animate) return;
  roleTimer = setTimeout(flipRole, 3600);
}

async function flipRole() {
  if (reducedMotion.matches || rolePaused || !roleInView || document.hidden || main.hidden) return;
  try {
    roleAnimation = bookPage.animate([
      { transform: 'rotateX(0deg)', opacity: 1 },
      { transform: 'rotateX(91deg)', opacity: 0 }
    ], { duration: 230, easing: 'ease-in', fill: 'forwards' });
    await roleAnimation.finished;
    roleIndex = (roleIndex + 1) % roles.length;
    roleText.textContent = roles[roleIndex];
    roleAnimation.cancel();
    roleAnimation = bookPage.animate([
      { transform: 'rotateX(-88deg)', opacity: .6 },
      { transform: 'rotateX(0deg)', opacity: 1 }
    ], { duration: 400, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    await roleAnimation.finished;
  } catch {} finally {
    startRoleTimer();
  }
}

const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .06 }) : null;

function setMotion() {
  root.classList.toggle('has-motion', !reducedMotion.matches);
  roleToggle.hidden = reducedMotion.matches || !bookPage.animate;
  if (reducedMotion.matches) roleAnimation?.cancel();
  startRoleTimer();
}

if (revealObserver) {
  document.querySelectorAll('[data-reveal]').forEach(element => {
    element.classList.add('is-ready');
    revealObserver.observe(element);
  });
  const heroObserver = new IntersectionObserver(entries => {
    roleInView = entries.some(entry => entry.isIntersecting);
    startRoleTimer();
  });
  heroObserver.observe(bookPage);
}
reducedMotion.addEventListener('change', setMotion);
document.addEventListener('visibilitychange', startRoleTimer);

const story = document.querySelector('#experience');
const milestones = Array.from(story.querySelectorAll('[data-year]'));
const storyYear = document.querySelector('#story-year');
const storyCount = document.querySelector('#story-count');
let storyIndex = -1;
let storyFrame;

function requestStoryUpdate() {
  if (!storyFrame) storyFrame = requestAnimationFrame(updateStory);
}

function updateStory() {
  storyFrame = undefined;
  if (main.hidden) return;
  const viewport = window.innerHeight;
  const index = milestones.reduce((active, milestone, position) => milestone.getBoundingClientRect().top < viewport * .57 ? position : active, 0);
  if (index !== storyIndex) {
    milestones[storyIndex]?.classList.remove('is-current');
    milestones[index].classList.add('is-current');
    storyYear.textContent = milestones[index].dataset.year;
    storyCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(milestones.length).padStart(2, '0')}`;
    story.style.setProperty('--story-progress', (index + 1) / milestones.length);
    if (storyIndex !== -1 && !reducedMotion.matches) storyYear.animate?.([{ opacity: .4, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }], { duration: 270, easing: 'ease-out' });
    storyIndex = index;
  }

  const sections = [document.querySelector('#home'), doorSection, story, document.querySelector('#contact')];
  const active = sections.reduce((selected, section) => section.getBoundingClientRect().top < viewport * .32 ? section : selected, sections[0]);
  updateNavigation(active.id);
}

window.addEventListener('scroll', requestStoryUpdate, { passive: true });
window.addEventListener('resize', requestStoryUpdate);

const copyEmail = document.querySelector('#copy-email');
const copyStatus = document.querySelector('#copy-status');
if (navigator.clipboard?.writeText) {
  copyEmail.hidden = false;
  let resetCopy;
  copyEmail.addEventListener('click', async () => {
    const label = copyEmail.querySelector('span');
    clearTimeout(resetCopy);
    try {
      await navigator.clipboard.writeText(document.querySelector('#email-link').pathname);
      label.textContent = 'Copied!';
      copyStatus.textContent = 'Email address copied.';
    } catch {
      label.textContent = 'Couldn’t copy';
      copyStatus.textContent = 'Could not copy the email address. Use Start a conversation to open your email app.';
    }
    resetCopy = setTimeout(() => {
      label.textContent = 'Copy email';
      copyStatus.textContent = '';
    }, 2400);
  });
}

displayPage(location.hash.slice(1));
setMotion();

/* ===================================================================
   MAGNIFICATION DOCK (MACOS FLUID SPRING DOCK IMPLEMENTATION)
   =================================================================== */
function initMagnificationDock() {
  const dock = document.getElementById('magnificationDock');
  if (!dock) return;

  const items = Array.from(dock.querySelectorAll('.dock-item'));
  const baseItemSize = 50;
  const magnification = 72;
  const distance = 180;

  const itemStates = items.map(item => ({
    element: item,
    currentSize: baseItemSize,
    targetSize: baseItemSize,
    velocity: 0
  }));

  let mouseX = Infinity;
  let isHovered = false;
  let animFrameId = null;

  dock.addEventListener('mousemove', e => {
    isHovered = true;
    mouseX = e.clientX;
    startAnimation();
  });

  dock.addEventListener('mouseleave', () => {
    isHovered = false;
    mouseX = Infinity;
    startAnimation();
  });

  function updateTargets() {
    itemStates.forEach(state => {
      if (!isHovered || mouseX === Infinity) {
        state.targetSize = baseItemSize;
        return;
      }

      const rect = state.element.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const mouseDist = Math.abs(mouseX - itemCenterX);

      if (mouseDist < distance) {
        const factor = Math.cos((mouseDist / distance) * (Math.PI / 2));
        state.targetSize = baseItemSize + (magnification - baseItemSize) * factor;
      } else {
        state.targetSize = baseItemSize;
      }
    });
  }

  function springStep() {
    updateTargets();

    let isMoving = false;
    const stiffness = 0.24;
    const damping = 0.72;

    itemStates.forEach(state => {
      const force = (state.targetSize - state.currentSize) * stiffness;
      state.velocity = (state.velocity + force) * damping;
      state.currentSize += state.velocity;

      if (Math.abs(state.targetSize - state.currentSize) > 0.05 || Math.abs(state.velocity) > 0.05) {
        isMoving = true;
      } else {
        state.currentSize = state.targetSize;
        state.velocity = 0;
      }

      state.element.style.width = `${state.currentSize}px`;
      state.element.style.height = `${state.currentSize}px`;
    });

    if (isMoving || isHovered) {
      animFrameId = requestAnimationFrame(springStep);
    } else {
      animFrameId = null;
    }
  }

  function startAnimation() {
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(springStep);
    }
  }

  itemStates.forEach(state => {
    state.element.style.width = `${baseItemSize}px`;
    state.element.style.height = `${baseItemSize}px`;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMagnificationDock);
} else {
  initMagnificationDock();
}
