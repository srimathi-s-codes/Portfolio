// Premium Portfolio Interactions

class PortfolioApp {
  constructor() {
    this.init();
    this.threeManager = new ThreeManager();
  }

  init() {
    this.initSectionObserver();
    this.initScrollProgress();
    this.initNavigation();
    this.initFormHandling();
    this.initCardTilt();
    this.initTypingEffect();
    this.handleInitialLoad();
    this.initMobileMenu();
  }

  initTypingEffect() {
    const textElement = document.getElementById('typing-text');
    if (!textElement) return;

    const words = ["Web Developer", "Data Analyst", "CSBS Student", "Java Full Stack Developer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        textElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        textElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 2000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
      } else {
        setTimeout(type, isDeleting ? 50 : 100);
      }
    };

    type();
  }

  handleInitialLoad() {
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    setTimeout(() => {
      const firstSection = document.querySelector('.section');
      if (firstSection) firstSection.classList.add('visible');
    }, 1000);
  }

  initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + "%";
    });
  }

  initSectionObserver() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });

          if (id === 'projects') {
            const cards = entry.target.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
              card.style.transitionDelay = `${index * 0.1}s`;
            });
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  initCardTilt() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  initFormHandling() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const originalText = btn.textContent;

      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'Message Sent! ✓';
        btn.style.background = '#22c55e';
        form.reset();

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const sideNav = document.getElementById('sideNav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle) return;

    // Toggle menu on button click
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      sideNav.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        sideNav.classList.remove('open');
        document.body.classList.remove('nav-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!sideNav.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('open');
        sideNav.classList.remove('open');
        document.body.classList.remove('nav-open');
      }
    });

    // Close menu on window resize if above tablet size
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        menuToggle.classList.remove('open');
        sideNav.classList.remove('open');
        document.body.classList.remove('nav-open');
      }
    });
  }
}

class ThreeManager {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.orbContainer = document.getElementById('threejs-orb');
    if (!this.container) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    this.mouse = { x: 0, y: 0 };
    this.init();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.z = 5;

    this.createParticles();
    this.createHeroOrb();
    this.addEventListeners();
    this.animate();
  }

  createParticles() {
    // Multi-layered starfield
    this.stars = [];
    const starLayers = [
      { count: 3000, size: 0.015, color: '#ffffff', opacity: 0.8 }, // Close stars
      { count: 5000, size: 0.008, color: '#94a3b8', opacity: 0.5 }, // Distant stars
      { count: 2000, size: 0.02, color: '#6366f1', opacity: 0.4 }  // Blue stars
    ];

    starLayers.forEach(layer => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(layer.count * 3);

      for (let i = 0; i < layer.count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        size: layer.size,
        color: layer.color,
        transparent: true,
        opacity: layer.opacity,
        blending: THREE.AdditiveBlending
      });

      const points = new THREE.Points(geometry, material);
      this.scene.add(points);
      this.stars.push(points);
    });

    // Milky Way concentrated band
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaCount = 4000;
    const nebulaPositions = new Float32Array(nebulaCount * 3);
    const nebulaColors = new Float32Array(nebulaCount * 3);
    const colorPalette = [new THREE.Color('#a855f7'), new THREE.Color('#6366f1'), new THREE.Color('#f59e0b')];

    for (let i = 0; i < nebulaCount; i++) {
      // Create a slightly curved, concentrated band
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 4 + Math.sin(x * 0.2) * 2;
      const z = (Math.random() - 0.5) * 5;

      nebulaPositions[i * 3] = x;
      nebulaPositions[i * 3 + 1] = y;
      nebulaPositions[i * 3 + 2] = z;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      nebulaColors[i * 3] = color.r;
      nebulaColors[i * 3 + 1] = color.g;
      nebulaColors[i * 3 + 2] = color.b;
    }

    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

    const nebulaMaterial = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });

    this.nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    this.scene.add(this.nebula);

    this.scrollSpeed = 0;
    window.addEventListener('scroll', () => {
      this.scrollSpeed = 0.05;
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => this.scrollSpeed = 0, 100);
    });
  }

  createHeroOrb() {
    if (!this.orbContainer) return;

    this.orbScene = new THREE.Scene();
    this.orbCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.orbRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    const size = this.orbContainer.offsetWidth;
    this.orbRenderer.setSize(size, size);
    this.orbContainer.appendChild(this.orbRenderer.domElement);

    this.orbCamera.position.z = 2.5;

    const geometry = new THREE.IcosahedronGeometry(1, 15);
    this.orbMaterial = new THREE.MeshPhongMaterial({
      color: '#a855f7',
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      emissive: '#6366f1',
      emissiveIntensity: 0.5
    });

    this.orb = new THREE.Mesh(geometry, this.orbMaterial);
    this.orbScene.add(this.orb);

    const light = new THREE.PointLight(0xff00ff, 2, 10);
    light.position.set(2, 2, 2);
    this.orbScene.add(light);

    const secondaryLight = new THREE.PointLight(0x00ffff, 2, 10);
    secondaryLight.position.set(-2, -2, 2);
    this.orbScene.add(secondaryLight);

    this.orbScene.add(new THREE.AmbientLight(0x404040));

    // Interaction: Morph on click
    this.orbContainer.addEventListener('mousedown', () => {
      this.morphOrb();
    });
  }

  morphOrb() {
    const colors = ['#f59e0b', '#10b981', '#ef4444', '#a855f7', '#6366f1'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    this.orbMaterial.color.set(randomColor);
    this.orbMaterial.emissive.set(randomColor);

    const scale = 1.2;
    this.orb.scale.set(scale, scale, scale);
    setTimeout(() => this.orb.scale.set(1, 1, 1), 200);
  }

  addEventListeners() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      if (this.orbContainer) {
        const size = this.orbContainer.offsetWidth;
        this.orbRenderer.setSize(size, size);
      }
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.0005;

    // Animate all star layers
    this.stars.forEach((points, index) => {
      points.rotation.y += 0.0002 * (index + 1);

      // Apply warp speed effect on scroll
      if (this.scrollSpeed > 0) {
        points.position.z += this.scrollSpeed * (index + 1);
        if (points.position.z > 5) points.position.z = -10;
      }
    });

    // Animate nebula
    if (this.nebula) {
      this.nebula.rotation.y += 0.0003;
      this.nebula.rotation.z += 0.0001;

      // Subtle "twinkle" effect for nebula
      this.nebula.material.opacity = 0.2 + Math.sin(time) * 0.1;
    }

    // Mouse repulsion for stars
    this.stars.forEach(points => {
      const positions = points.geometry.attributes.position.array;
      const mouseX = this.mouse.x * 7.5;
      const mouseY = this.mouse.y * 7.5;

      for (let i = 0; i < positions.length; i += 3) {
        const px = positions[i];
        const py = positions[i + 1];

        const dx = mouseX - px;
        const dy = mouseY - py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1.5) {
          const force = (1.5 - dist) / 1.5;
          positions[i] -= dx * force * 0.01;
          positions[i + 1] -= dy * force * 0.01;
        }
      }
      points.geometry.attributes.position.needsUpdate = true;
    });

    this.renderer.render(this.scene, this.camera);

    // Animate orb
    if (this.orb) {
      this.orb.rotation.y += 0.005;
      this.orb.rotation.z += 0.002;
      this.orb.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.05);
      this.orbRenderer.render(this.orbScene, this.orbCamera);
    }
  }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});