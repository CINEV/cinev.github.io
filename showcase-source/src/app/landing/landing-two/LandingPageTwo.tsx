import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Play, X } from 'lucide-react';
import { CineVWordmark } from '../landing-one/CineVWordmark';
import {
  landingTwoContent as koreanContent,
  showcaseItems as koreanShowcaseItems,
  animationExamples as koreanAnimationExamples,
  type ShowcaseItem,
} from './landing-two.data';

import { englishShowcase } from './landing-two.en';
const isEnglish = window.location.pathname.startsWith('/en/');
const landingTwoContent = isEnglish ? englishShowcase.landingTwoContent : koreanContent;
const showcaseItems = (isEnglish ? englishShowcase.showcaseItems : koreanShowcaseItems) as ShowcaseItem[];
const animationExamples = (isEnglish ? englishShowcase.animationExamples : koreanAnimationExamples) as ShowcaseItem[];
const tr = (ko: string, en: string) => isEnglish ? en : ko;

function Lines({ children }: { children: string }) {
  return (
    <>
      {children.split('\n').map((line, index, lines) => (
        <span key={`${line}-${index}`}>
          {line}
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

function Eyebrow({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div
      className={`text-[11px] font-bold uppercase tracking-[0.2em] sm:text-xs ${
        light ? 'text-white/50' : 'text-[#65665e]'
      }`}
    >
      {children}
    </div>
  );
}

function VideoModal({ item, onClose }: { item: ShowcaseItem; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 p-3 backdrop-blur-xl sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} ${tr('영상 플레이어', 'video player')}`}
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative flex h-[calc(100dvh-1.5rem)] w-full max-w-[1280px] flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#080808] shadow-[0_30px_120px_rgba(0,0,0,0.65)] sm:h-[calc(100dvh-4rem)] sm:rounded-[28px]">
        <div className="flex shrink-0 items-start justify-between gap-5 border-b border-white/10 px-4 py-4 text-white sm:px-7 sm:py-5">
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#d9ff43] sm:text-xs">{item.format}</div>
            <h3 className="mt-1.5 text-lg font-semibold tracking-[-0.03em] sm:text-2xl">{item.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition hover:bg-white/16 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9ff43]"
            aria-label={tr('영상 닫기', 'Close video')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 bg-black">
            <video
              src={item.videoSrc}
              poster={item.poster}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
        </div>

        <div className="flex shrink-0 flex-col gap-4 px-4 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
          <p className="max-w-3xl text-sm leading-6 text-white/62 sm:text-base sm:leading-7">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

function WorkCard({ item, onOpen, featured = false }: { item: ShowcaseItem; onOpen: () => void; featured?: boolean }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative overflow-hidden rounded-2xl bg-[#171717] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9ff43] sm:rounded-[28px] ${
        featured ? 'md:col-span-2' : ''
      }`}
      aria-label={`${tr('영상 보기', 'Watch video')}: ${item.title}`}
    >
      <div className={featured ? 'aspect-[16/8.2] min-h-[310px]' : 'aspect-[4/3] min-h-[300px]'}>
        <img
          src={item.poster}
          alt={item.posterAlt}
          loading={featured ? 'eager' : 'lazy'}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_20%,rgba(0,0,0,0.82)_100%)]" />
      <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/28 text-white opacity-90 backdrop-blur-md transition duration-300 group-hover:scale-105 group-hover:bg-[#d9ff43] group-hover:text-black sm:right-6 sm:top-6 sm:h-12 sm:w-12">
        <Play className="ml-0.5 h-4 w-4 fill-current" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
        <div className="text-[10px] font-bold tracking-[0.18em] text-[#d9ff43] sm:text-[11px]">{item.format}</div>
        <h3 className={`mt-2 font-semibold leading-[1.08] tracking-[-0.045em] ${featured ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'}`}>
          {item.title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/68 sm:text-[15px]">{item.description}</p>
      </div>
    </button>
  );
}

function VideoPlaylist({ items, autoStart = false, showNumbers = true }: { items: ShowcaseItem[]; autoStart?: boolean; showNumbers?: boolean }) {
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [requested, setRequested] = useState(autoStart);
  const player = useRef<HTMLVideoElement>(null);
  const item = items[active];

  useEffect(() => {
    if (requested) void player.current?.play().catch(() => {});
  }, [active, requested]);

  return <div className="min-w-0 overflow-hidden rounded-2xl bg-[#111] p-3 text-white sm:rounded-[28px] sm:p-5">
    <video ref={player} key={item.id} src={item.videoSrc} poster={item.poster}
      controls playsInline muted={muted} autoPlay={requested} preload="metadata"
      onVolumeChange={event => setMuted(event.currentTarget.muted)}
      onEnded={() => { setRequested(true); setActive(index => (index + 1) % items.length); }}
      aria-label={item.title}
      className="aspect-video max-h-[75vh] w-full rounded-xl bg-black object-contain" />
    <div className="px-1 py-5" aria-live="polite"><h3 className="text-lg font-semibold sm:text-2xl">{showNumbers && `${String(active + 1).padStart(2, '0')}. `}{item.title}</h3><p className="mt-2 text-sm leading-6 text-white/60">{item.description}</p></div>
    <div className="flex gap-3 overflow-x-auto pb-2" aria-label={tr('영상 선택', 'Select a video')}>
      {items.map((work, index) => <button key={work.id} type="button"
        onClick={() => { setRequested(true); setActive(index); if (index === active && player.current) { player.current.currentTime = 0; void player.current.play().catch(() => {}); } }}
        aria-pressed={active === index} aria-label={`${tr('재생', 'Play')} ${showNumbers ? `${index + 1}. ` : ''}${work.title}`}
        className={`min-w-[150px] flex-1 overflow-hidden rounded-xl border-2 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9ff43] ${active === index ? 'border-[#d9ff43] bg-[#d9ff43]/10' : 'border-transparent bg-white/5 hover:border-white/35'}`}>
        <img src={work.poster} alt="" loading="lazy" className="aspect-video w-full object-cover" />
        <span className="block p-3 text-xs font-semibold leading-5 sm:text-sm">{showNumbers && <span className={active === index ? 'text-[#d9ff43]' : 'text-white/40'}>{String(index + 1).padStart(2, '0')}. </span>}{work.title}</span>
      </button>)}
    </div>
  </div>;
}

export function LandingPageTwo() {
  const content = landingTwoContent;
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);
  const [showTop, setShowTop] = useState(false);
  const heroMedia = content.hero.featuredMedia[1];

  const scrollToSection = (targetId: string) => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const onScroll = () => setShowTop(window.scrollY > 800);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f7f4ec]" style={{ fontFamily: 'var(--font-cjk)' }}>
      <header className="portfolio-header">
        <div className="portfolio-header-inner">
          <a className="portfolio-brand" href={isEnglish ? "/en/archive/" : "/archive/"} aria-label="CINEV Archive Product"><CineVWordmark /><span className="portfolio-archive-badge">Archive</span></a>
          <nav className="portfolio-nav" aria-label={tr('페이지 메뉴', 'Page navigation')}>
            <a href={isEnglish ? "/en/archive/" : "/archive/"}>PRODUCT</a>
            <a href={isEnglish ? "/en/showcase/" : "/showcase/"} aria-current="page">SHOWCASE</a>
          </nav>
          <a className="portfolio-language" href={isEnglish ? '/showcase/' : '/en/showcase/'} hrefLang={isEnglish ? 'ko' : 'en'} lang={isEnglish ? 'ko' : 'en'} aria-label={isEnglish ? '한국어로 보기' : 'Switch to English'} onClick={event => { event.currentTarget.href = (isEnglish ? '/showcase/' : '/en/showcase/') + window.location.hash; }}>{isEnglish ? '한국어' : 'EN'}</a>
        </div>
      </header>

      <main id="top">
        <section className="relative min-h-[760px] overflow-hidden sm:min-h-[820px] lg:min-h-screen">
          <img src={heroMedia.poster} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
          <video
            key={heroMedia.video}
            src={heroMedia.video}
            poster={heroMedia.poster}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,4,4,0.9)_0%,rgba(4,4,4,0.62)_48%,rgba(4,4,4,0.18)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0)_55%,rgba(10,10,10,0.8)_100%)]" />

          <div className="relative mx-auto flex min-h-[760px] max-w-[1560px] flex-col justify-end px-5 pb-12 pt-28 sm:min-h-[820px] sm:px-8 sm:pb-16 lg:min-h-screen lg:justify-center lg:px-12 lg:pb-24 xl:px-16">
            <div className="max-w-[1100px]">
              <Eyebrow light>{content.hero.eyebrow}</Eyebrow>
              <h1 className="mt-5 text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[66px] lg:text-[76px] xl:text-[82px]">
                <span className="sm:hidden">
                  <Lines>{content.hero.mobileHeading}</Lines>
                </span>
                <span className="hidden sm:inline">
                  <Lines>{content.hero.heading}</Lines>
                </span>
              </h1>
              <p className="mt-7 max-w-[750px] text-[16px] font-medium leading-7 text-white/76 sm:text-xl sm:leading-9">
                <Lines>{content.hero.description}</Lines>
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => scrollToSection('selected-work')}
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#d9ff43] px-6 text-[15px] font-bold text-[#0a0a0a] transition hover:bg-white sm:px-7"
                >
                  {content.hero.secondaryCta}
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#0a0a0a] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 xl:px-16">
          <p className="mx-auto max-w-[1260px] text-[24px] font-medium leading-[1.42] tracking-[-0.035em] text-[#f7f4ec] sm:text-[34px] lg:text-[44px]">
            {content.definition}
          </p>
        </section>

        <section id="selected-work" className="scroll-mt-16 bg-[#0a0a0a] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1560px]">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <Eyebrow light>{content.showcase.eyebrow}</Eyebrow>
                <h2 className="mt-5 text-[40px] font-semibold leading-[1.02] tracking-[-0.055em] sm:text-[58px] lg:text-[72px]">
                  <Lines>{content.showcase.heading}</Lines>
                </h2>
              </div>
              <p className="max-w-[650px] text-base leading-7 text-white/55 sm:text-lg sm:leading-8 lg:justify-self-end">
                {content.showcase.description}
              </p>
            </div>

            <div className="mt-10"><VideoPlaylist items={showcaseItems.slice(0, 4)} autoStart /></div>
          </div>
        </section>

        <section id="adaptation" className="scroll-mt-16 bg-[#f1eee5] px-5 py-24 text-[#11110f] sm:px-8 sm:py-32 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1560px]">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <Eyebrow>{content.capabilities.eyebrow}</Eyebrow>
                <h2 className="mt-5 text-[40px] font-semibold leading-[1.02] tracking-[-0.055em] sm:text-[58px] lg:text-[72px]">
                  <Lines>{content.capabilities.heading}</Lines>
                </h2>
              </div>
              <p className="max-w-[620px] text-base leading-7 text-[#67675f] sm:text-lg sm:leading-8">{content.capabilities.description}</p>
            </div>
            <div className="mt-12 sm:mt-16">
              <VideoPlaylist items={showcaseItems.slice(4, 7).reverse()} showNumbers={false} />
            </div>
            <div className="mt-12 grid gap-x-10 gap-y-8 border-t border-black/14 pt-10 md:grid-cols-2">
              {content.capabilities.items.map(item => (
                <article key={item.index} className="grid grid-cols-[36px_1fr] gap-3">
                  <span className="pt-1 text-xs font-bold text-[#85857b]">{item.index}</span>
                  <div><h3 className="text-2xl font-semibold tracking-[-0.04em]">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-[#686860] sm:text-base">{item.description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="create-with-cinev" className="scroll-mt-16 bg-[#0a0a0a] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1560px]">
            <div className="max-w-[1120px]">
              <Eyebrow light>{content.waysToWork.eyebrow}</Eyebrow>
              <h2 className="mt-5 text-[44px] font-semibold leading-[1] tracking-[-0.055em] sm:text-[62px] lg:text-[78px]">
                <Lines>{content.waysToWork.heading}</Lines>
              </h2>
              <p className="mt-7 max-w-[750px] text-base leading-7 text-white/55 sm:text-lg sm:leading-8">{content.waysToWork.description}</p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-[1.18fr_0.82fr]">
              <article className="flex min-h-[540px] flex-col rounded-2xl bg-[#d9ff43] p-7 text-[#0b0b09] sm:rounded-[30px] sm:p-10 lg:p-12">
                <div className="text-xs font-black tracking-[0.2em]">{content.waysToWork.platform.label}</div>
                <h3 className="mt-12 text-[36px] font-semibold leading-[1.05] tracking-[-0.05em] sm:text-[50px]">
                  <Lines>{content.waysToWork.platform.title}</Lines>
                </h3>
                <p className="mt-6 max-w-[670px] text-base leading-7 text-black/65 sm:text-lg sm:leading-8">{content.waysToWork.platform.description}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {content.waysToWork.platform.tags.map(tag => (
                    <span key={tag} className="rounded-full border border-black/18 px-3 py-2 text-xs font-bold sm:px-4">{tag}</span>
                  ))}
                </div>
                <button type="button" disabled aria-disabled="true" className="mt-auto inline-flex h-13 w-fit items-center justify-center rounded-full bg-black/15 px-6 text-[15px] font-bold text-black/50 cursor-not-allowed">{tr('2026년 11월 서비스 종료', 'Service ends in November 2026')}</button>
              </article>

              <article className="flex min-h-[540px] flex-col rounded-2xl border border-white/14 bg-[#161616] p-7 sm:rounded-[30px] sm:p-10 lg:p-12">
                <div className="text-xs font-black tracking-[0.2em] text-white/48">{content.waysToWork.studio.label}</div>
                <h3 className="mt-12 text-[34px] font-semibold leading-[1.05] tracking-[-0.05em] sm:text-[44px]">
                  <Lines>{content.waysToWork.studio.title}</Lines>
                </h3>
                <p className="mt-6 max-w-[610px] text-base leading-7 text-white/55 sm:text-lg sm:leading-8">{content.waysToWork.studio.description}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {content.waysToWork.studio.tags.map(tag => (
                    <span key={tag} className="rounded-full border border-white/16 px-3 py-2 text-xs font-bold text-white/65 sm:px-4">{tag}</span>
                  ))}
                </div>
              </article>
            </div>
            <p className="mt-7 text-center text-sm leading-6 text-white/42 sm:text-base">{content.waysToWork.bridge}</p>
          </div>
        </section>

        <section id="original-animation" className="scroll-mt-16 bg-[#d9ff43] px-5 py-24 text-[#10100e] sm:px-8 sm:py-32 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1560px]">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <Eyebrow>{content.originalAnimation.eyebrow}</Eyebrow>
                <h2 className="mt-5 text-[42px] font-semibold leading-[1.01] tracking-[-0.055em] sm:text-[60px] lg:text-[76px]">
                  <Lines>{content.originalAnimation.heading}</Lines>
                </h2>
              </div>
              <p className="max-w-[650px] text-base leading-7 text-black/60 sm:text-lg sm:leading-8 lg:justify-self-end">
                {content.originalAnimation.description}
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 lg:mt-20">
              {animationExamples.map(item => (
                <WorkCard key={item.id} item={item} onOpen={() => setSelectedItem(item)} />
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-16 bg-[#f1eee5] px-5 py-24 text-[#11110f] sm:px-8 sm:py-32 lg:px-12 xl:px-16">
          <div className="mx-auto grid max-w-[1560px] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <Eyebrow>{content.faq.eyebrow}</Eyebrow>
              <h2 className="mt-5 text-[40px] font-semibold leading-[1.04] tracking-[-0.055em] sm:text-[56px]">
                <Lines>{content.faq.heading}</Lines>
              </h2>
            </div>
            <div className="border-t border-black/16">
              {content.faq.items.map((item, index) => (
                <details key={item.question} className="group border-b border-black/16" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-lg font-semibold tracking-[-0.025em] marker:hidden sm:py-7 sm:text-xl">
                    {item.question}
                    <span className="relative h-6 w-6 shrink-0 rounded-full border border-black/20 after:absolute after:left-1/2 after:top-1/2 after:h-px after:w-2.5 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-black before:absolute before:left-1/2 before:top-1/2 before:h-2.5 before:w-px before:-translate-x-1/2 before:-translate-y-1/2 before:bg-black before:transition group-open:before:rotate-90" />
                  </summary>
                  <p className="max-w-[720px] pb-7 pr-10 text-[15px] leading-7 text-[#67675f] sm:text-base sm:leading-8">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative min-h-[720px] overflow-hidden px-5 py-24 sm:px-8 lg:px-12 xl:px-16">
          <img src={content.closing.background} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
          <div className="absolute inset-0 bg-black/68" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.05),rgba(0,0,0,0.7)_75%)]" />
          <div className="relative mx-auto flex min-h-[530px] max-w-[1200px] flex-col items-center justify-center text-center">
            <Eyebrow light>{content.closing.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-[44px] font-semibold leading-[1] tracking-[-0.06em] sm:text-[66px] lg:text-[86px]">
              <Lines>{content.closing.heading}</Lines>
            </h2>
            <p className="mt-7 text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
              <Lines>{content.closing.description}</Lines>
            </p>
            <div className="mt-10 flex w-full max-w-[430px] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
              <button type="button" disabled aria-disabled="true" className="inline-flex h-13 items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 text-[15px] font-bold text-white/45 cursor-not-allowed">{tr('2026년 11월 서비스 종료', 'Service ends in November 2026')}</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="portfolio-footer">
        <div className="portfolio-footer-inner">
          <div className="portfolio-footer-brand"><CineVWordmark /><span className="portfolio-archive-badge">Archive</span></div>
          <p className="portfolio-footer-note">{tr('CINEV의 제품, 기술 연구 및 제작 사례를 소개합니다.', "An archive of CINEV products, technical research, and production examples.")}</p>
          <div className="portfolio-footer-bottom">
            <span>{content.footer.copyright}</span>

          </div>
        </div>
      </footer>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
          aria-label={tr('맨 위로', 'Back to top')}
          className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#171717]/90 text-white shadow-xl backdrop-blur transition hover:bg-[#d9ff43] hover:text-black"
        >
          <ArrowDown className="h-4 w-4 rotate-180" />
        </button>
      )}

      {selectedItem && <VideoModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}
