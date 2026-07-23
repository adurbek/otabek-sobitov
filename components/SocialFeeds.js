// Ijtimoiy tarmoq foydalanuvchi nomlarini shu yerda o'zgartiring.
// Bo'sh qoldirilsa, lenta o'rniga havolali karta ko'rsatiladi.
const ACCOUNTS = {
  instagram: "otabek.yuldashevich.sobitov", // instagram.com/<nom>
  facebook: "https://facebook.com/otabek.sobitov.9",
  telegram: "https://t.me/otabek_yuldashovich",
  linkedin: "https://www.linkedin.com/in/otabek-sobitov-136192369/",
};

const ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.54-1.5h1.66V3.6c-.29-.04-1.27-.12-2.42-.12-2.4 0-4.03 1.46-4.03 4.15v2.27H7.5V13h2.75v8h3.25Z" />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.04 15.31 8.9 19.2c.4 0 .57-.17.78-.37l1.87-1.79 3.88 2.84c.71.39 1.22.19 1.41-.66l2.56-12.02c.23-1.05-.38-1.46-1.07-1.2L3.62 11.8c-1.03.4-1.02.97-.18 1.23l3.86 1.2 8.95-5.65c.42-.26.8-.12.49.14l-7.7 6.59Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z" />
    </svg>
  ),
};

function FeedCard({ brand, title, text, href, linkLabel }) {
  return (
    <div className="feed-card">
      <span className={`feed-card-icon brand-${brand}`}>{ICONS[brand]}</span>
      <p>{text}</p>
      {href && (
        <a className="feed-btn" href={href} target="_blank" rel="noopener noreferrer">
          {linkLabel}
        </a>
      )}
    </div>
  );
}

export default function SocialFeeds() {
  const ig = ACCOUNTS.instagram;
  const fb = ACCOUNTS.facebook;
  const tg = ACCOUNTS.telegram;
  const li = ACCOUNTS.linkedin;

  return (
    <section className="container social-feeds">
      <div className="social-feeds-grid">
        <div className="feed-col">
          <h3 className="feed-title">Instagram</h3>
          {ig ? (
            <div className="feed-frame">
              <iframe
                src={`https://www.instagram.com/${ig}/embed`}
                title="Instagram sahifasi"
                loading="lazy"
                allowtransparency="true"
              />
            </div>
          ) : (
            <FeedCard
              brand="instagram"
              text="Instagram sahifasidagi postlar bilan shu yerdan tanishishingiz mumkin."
              href="https://www.instagram.com/"
              linkLabel="Instagram sahifasini ochish ↗"
            />
          )}
          {ig && (
            <a
              className="feed-link"
              href={`https://www.instagram.com/${ig}/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram sahifasini ochish ↗
            </a>
          )}
        </div>

        <div className="feed-col">
          <h3 className="feed-title">Facebook</h3>
          <FeedCard
            brand="facebook"
            text="Facebook sahifasidagi postlar, e'lonlar va yangiliklar bilan shu yerdan tanishishingiz mumkin."
            href={fb}
            linkLabel="Facebook sahifasini ochish ↗"
          />
        </div>

        <div className="feed-col">
          <h3 className="feed-title">Telegram</h3>
          <FeedCard
            brand="telegram"
            text="Telegram sahifasidagi e'lonlar va yangiliklar bilan shu yerdan tanishishingiz mumkin."
            href={tg}
            linkLabel="Telegram sahifasini ochish ↗"
          />
        </div>

        <div className="feed-col">
          <h3 className="feed-title">LinkedIn</h3>
          <FeedCard
            brand="linkedin"
            text="LinkedIn sahifasidagi postlar, video va rasmlar bilan shu yerdan tanishishingiz mumkin."
            href={li}
            linkLabel="LinkedIn profilini ochish ↗"
          />
        </div>
      </div>
    </section>
  );
}
