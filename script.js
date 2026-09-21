const progress = document.querySelector('#scrollProgress');
const menuToggle = document.querySelector('#menuToggle');
const siteNav = document.querySelector('#siteNav');

window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`;
}, { passive: true });

menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});
siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => siteNav.classList.remove('open')));

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const heroArt = document.querySelector('#heroArt');
heroArt.addEventListener('mousemove', event => {
  const x = (event.clientX / window.innerWidth - 0.5) * 16;
  const y = (event.clientY / window.innerHeight - 0.5) * 10;
  heroArt.style.setProperty('--mx', `${x}px`); heroArt.style.setProperty('--my', `${y}px`);
});
heroArt.addEventListener('mouseleave', () => { heroArt.style.setProperty('--mx', '0px'); heroArt.style.setProperty('--my', '0px'); });

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.filter.active').classList.remove('active'); button.classList.add('active');
  document.querySelectorAll('.project').forEach(project => { project.classList.toggle('is-hidden', button.dataset.filter !== 'all' && project.dataset.type !== button.dataset.filter); });
}));

const overlay = document.querySelector('#terminalOverlay');
const terminalInput = document.querySelector('#terminalInput');
const output = document.querySelector('#terminalOutput');
document.querySelector('#terminalTrigger').addEventListener('click', () => { overlay.hidden = false; terminalInput.focus(); });
document.querySelector('#terminalClose').addEventListener('click', () => { overlay.hidden = true; });
overlay.addEventListener('click', event => { if (event.target === overlay) overlay.hidden = true; });
document.querySelector('#terminalForm').addEventListener('submit', event => {
  event.preventDefault();
  const command = terminalInput.value.trim().toLowerCase(); terminalInput.value = '';
  const responses = { help: 'Commands: about, skills, projects, contact, clear', about: 'Srimathi S - Software Engineering student and aspiring full-stack developer.', skills: 'Java | Python | JavaScript | React | Node | Express | Flask | MySQL | MongoDB', projects: 'CampusCred | AI Resume Analyzer | Grocery Shop Website', contact: 'srimathisaminathan02@gmail.com | +91 6374164867 | Salem, India' };
  if (command === 'clear') { output.innerHTML = ''; return; }
  const response = responses[command] || `Command not found: ${command}. Type help.`;
  output.insertAdjacentHTML('beforeend', `<p><span style="color:#c6f24a">$ ${command}</span><br>${response}</p>`); output.scrollTop = output.scrollHeight;
});
