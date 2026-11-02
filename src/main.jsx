import React, { createContext, useContext, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowUpRightFromSquare, faArrowRight, faMoon, faSun, faBars, faXmark, faLocationDot, faCalendar, faPerson, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './style.css';

const ThemeContext = createContext(null);
const useTheme = () => useContext(ThemeContext);

function GridCanvas() {
  const { theme } = useTheme();
  useEffect(() => {
    const canvas = document.querySelector('#grid-canvas');
    const ctx = canvas.getContext('2d');
    let raf = 0, width = 0, height = 0, dpr = 1, t = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const gap = 42;
      const accent = theme === 'dark' ? '135,59,255' : '247,37,133';
      const wave = (Math.sin(t * .45) + 1) / 2;
      ctx.lineWidth = 0.65;
      for (let x = 0; x <= width; x += gap) {
        const strength = (Math.sin(x * .009 + t) + 1) / 2;
        ctx.strokeStyle = `rgba(${accent},${0.075 + strength * .045 + wave * .018})`;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y <= height; y += gap) {
        const strength = (Math.sin(y * .012 - t * .7) + 1) / 2;
        ctx.strokeStyle = `rgba(${accent},${0.07 + strength * .04})`;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
      t += .0035;
      if (!document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    const onVisibility = () => { cancelAnimationFrame(raf); if (!document.hidden) draw(); };
    window.addEventListener('resize', resize); document.addEventListener('visibilitychange', onVisibility);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', onVisibility); };
  }, [theme]);
  return <canvas id="grid-canvas" aria-hidden="true" />;
}

const navItems = [
  ['/', 'Main'], ['/biodata', 'Biodata'], ['/family', 'Family'], ['/hobi', 'Hobi'], ['/pendidikan', 'Pendidikan'], ['/sosial-media', 'Sosial Media']
];
function Navbar() {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMenuOpen(false), [location.pathname]);
  return <header className="site-header">
    <NavLink to="/" className="wordmark" aria-label="Kembali ke Main">MRF<span>.</span></NavLink>
    <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
      {navItems.map(([path, label]) => <NavLink key={path} to={path} end={path === '/'} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>)}
    </nav>
    <div className="header-actions">
      <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Ganti tema">
        <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} /><span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Buka navigasi"><FontAwesomeIcon icon={menuOpen ? faXmark : faBars} /></button>
    </div>
  </header>;
}

function PageShell({ children, eyebrow, title, intro, className = '' }) {
  return <motion.main className={`page-wrap ${className}`} initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} transition={{duration:.32, ease:'easeOut'}}>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    {title && <h1 className="page-title">{title}</h1>}
    {intro && <p className="page-intro">{intro}</p>}
    {children}
  </motion.main>;
}

function Home() {
  return <PageShell className="home-page">
    <section className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow"><span className="status-dot"/> PORTOFOLIO PERSONAL <span className="eyebrow-year">— 2026</span></p>
        <h1 className="hero-name">Muhammad<br/><em>Rizky</em> Fadilla<span className="hero-period">.</span></h1>
        <p className="hero-description">Ruang kecil untuk mengenal diri, hal-hal yang disukai, dan arah yang ingin dituju.</p>
        <div className="hero-actions"><NavLink to="/biodata" className="button-primary">Kenali Saya <FontAwesomeIcon icon={faArrowRight}/></NavLink><NavLink to="/family" className="text-link">Halaman keluarga <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></NavLink></div>
        <div className="hero-index"><span>01 / 06</span><span>PEMATANG SIANTAR, INDONESIA</span></div>
      </div>
      <div className="hero-visual">
        <div className="photo-frame"><img src="/images/rizky.jpg" alt="Foto Muhammad Rizky Fadilla"/><div className="photo-caption"><span>MUHAMMAD RIZKY FADILLA</span><span>PERSONAL ARCHIVE / 001</span></div></div>
        <div className="vertical-note">A PERSONAL PROFILE — EST. 2010</div>
        <div className="hero-stamp">MRF<br/><span>10</span></div>
      </div>
    </section>
    <section className="home-lower"><div><p className="eyebrow">SEDIKIT TENTANG SAYA</p><p className="lower-statement">Suka bergerak, belajar dari pengalaman, dan terus mencari hal baru untuk dicoba.</p></div><NavLink to="/hobi" className="round-link" aria-label="Lihat hobi"><FontAwesomeIcon icon={faArrowUpRightFromSquare}/></NavLink></section>
  </PageShell>;
}

function Biodata() {
  const rows = [['Nama lengkap', 'Muhammad Rizky Fadilla'], ['Jenis kelamin', 'Laki-laki'], ['Tempat lahir', 'Pematang Siantar'], ['Tanggal lahir', '28 Juni 2010'], ['Hobi', 'Futsal'], ['Cita-cita', 'TNI']];
  return <PageShell eyebrow="02 — PROFIL" title={<>Mengenal lebih<br/><em>dekat.</em></>} intro="Beberapa informasi dasar tentang saya, disusun apa adanya.">
    <div className="bio-layout"><div className="bio-photo"><img src="/images/rizky.jpg" alt="Muhammad Rizky Fadilla"/><span>PROFILE / MRF-01</span></div><div className="bio-table">{rows.map(([label, value], i) => <div className="bio-row" key={label}><span className="bio-number">0{i+1}</span><span className="bio-label">{label}</span><strong>{value}</strong></div>)}</div></div>
  </PageShell>;
}

function Family() {
  return <PageShell eyebrow="03 — RUANG KELUARGA" title={<>Tempat pulang,<br/><em>selalu.</em></>} intro="Ada hal-hal sederhana yang terasa berarti karena dijalani bersama. Keluarga adalah salah satunya." className="family-page">
    <div className="family-intro"><span className="family-mark">FAMILY<br/>ARCHIVE — 01</span><p>Di balik setiap langkah, ada doa dan dukungan yang tak selalu terlihat. Halaman ini menjadi ruang kecil untuk menghargai mereka yang punya tempat istimewa dalam perjalanan hidup.</p></div>
    <div className="family-gallery">
      <motion.figure className="family-photo father" whileHover={{y:-7, rotateY:-2}} transition={{duration:.35}}><img src="/images/keluarga-ayah.jpg" alt="Foto ayah"/><figcaption><span>01 / FIGURE</span><strong>Ayah</strong><small>Sosok yang menjadi bagian dari cerita keluarga.</small></figcaption></motion.figure>
      <motion.figure className="family-photo mother" whileHover={{y:-7, rotateY:2}} transition={{duration:.35}}><img src="/images/keluarga-ibu.jpg" alt="Foto ibu"/><figcaption><span>02 / FIGURE</span><strong>Ibu</strong><small>Bagian penting dari rumah dan perjalanan.</small></figcaption></motion.figure>
    </div>
    <div className="family-quote"><span>“</span><p>Rumah bukan hanya tempat untuk kembali, tetapi juga tentang orang-orang yang selalu punya ruang di hati.</p><small>— CATATAN KECIL</small></div>
  </PageShell>;
}

function Hobby() {
  return <PageShell eyebrow="04 — MINAT" title={<>Energi di<br/><em>lapangan.</em></>} intro="Futsal menjadi hobi yang saya pilih. Ada keseruan tersendiri saat bergerak dan bermain bersama tim.">
    <div className="hobby-feature"><div className="hobby-image"><img src="/images/hobi-futsal.jpg" alt="Futsal"/><span className="image-tag">HOBI / 01</span></div><div className="hobby-note"><p className="eyebrow">DI LUAR RUTINITAS</p><h2>Futsal<span>.</span></h2><p>Permainan yang menggabungkan gerak, fokus, dan kerja sama. Salah satu cara untuk menikmati waktu sekaligus tetap aktif.</p><div className="hobby-meta"><span>01</span><span>SPORT & MOVEMENT</span></div></div></div>
    <div className="aspiration-strip"><div><p className="eyebrow">CITA-CITA</p><h3>Menjadi bagian dari <em>TNI.</em></h3></div><img src="/images/cita-tentara.jpg" alt="Ilustrasi cita-cita menjadi TNI"/></div>
  </PageShell>;
}

const schools = [
  {n:'01', level:'SEKOLAH DASAR', name:'MIS Madani Al-Islamiyah School', image:'/images/school-tk.jpg', map:'https://maps.app.goo.gl/N1n81fiBkX21RjSS7'},
  {n:'02', level:'SEKOLAH MENENGAH PERTAMA', name:'MTsN Pematangsiantar', image:'/images/school-smp.jpg', map:'https://maps.app.goo.gl/1TCG5PCp2GYi9nET6'},
  {n:'03', level:'SEKOLAH MENENGAH KEJURUAN', name:'SMK S Teladan Pematangsiantar', image:'/images/school-smk.jpg', map:'https://maps.app.goo.gl/LQsuRvULNtxtLKaz5?g_st=iw'}
];
function Education() {
  return <PageShell eyebrow="05 — PENDIDIKAN" title={<>Jejak<br/><em>belajar.</em></>} intro="Tiga tempat yang tercatat dalam perjalanan pendidikan saya.">
    <div className="school-list">{schools.map(s => <article className="school-item" key={s.n}><div className="school-no">{s.n}</div><div className="school-image"><img src={s.image} alt={`Foto ${s.name}`}/></div><div className="school-info"><span className="eyebrow">{s.level}</span><h2>{s.name}</h2><a href={s.map} target="_blank" rel="noreferrer" className="map-link">Lihat lokasi <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></a></div></article>)}</div>
  </PageShell>;
}

function Social() {
  return <PageShell eyebrow="06 — TERHUBUNG" title={<>Tetap<br/><em>terhubung.</em></>} intro="Temukan saya melalui dua kanal berikut.">
    <div className="social-grid"><a className="social-card" href="https://wa.me/628135078465" target="_blank" rel="noreferrer"><div className="social-icon"><FontAwesomeIcon icon={faWhatsapp}/></div><div><span className="eyebrow">WHATSAPP</span><h2>+62 813-5078-465</h2><p>Mulai percakapan <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></p></div><span className="social-arrow"><FontAwesomeIcon icon={faArrowRight}/></span></a><a className="social-card" href="https://www.instagram.com/1tzzkyy_/" target="_blank" rel="noreferrer"><div className="social-icon"><FontAwesomeIcon icon={faInstagram}/></div><div><span className="eyebrow">INSTAGRAM</span><h2>@1tzzkyy_</h2><p>Kunjungi profil <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></p></div><span className="social-arrow"><FontAwesomeIcon icon={faArrowRight}/></span></a></div>
    <p className="social-footnote">Terima kasih sudah mampir.</p>
  </PageShell>;
}

function Footer() { return <footer className="site-footer"><span>© 2026 MUHAMMAD RIZKY FADILLA</span><span>PERSONAL PORTFOLIO <i>·</i> MADE WITH PURPOSE</span></footer>; }
function AnimatedRoutes() {
  const location = useLocation();
  return <><AnimatePresence mode="wait"><Routes location={location} key={location.pathname}><Route path="/" element={<Home/>}/><Route path="/biodata" element={<Biodata/>}/><Route path="/family" element={<Family/>}/><Route path="/hobi" element={<Hobby/>}/><Route path="/pendidikan" element={<Education/>}/><Route path="/sosial-media" element={<Social/>}/><Route path="*" element={<Home/>}/></Routes></AnimatePresence><Footer/></>;
}
function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('mrf-theme') || 'dark');
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('mrf-theme', theme); }, [theme]);
  return <ThemeContext.Provider value={{theme, setTheme}}><GridCanvas/><div className="app-frame"><Navbar/><AnimatedRoutes/></div></ThemeContext.Provider>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>);
