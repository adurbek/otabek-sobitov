// Ijtimoiy tarmoq foydalanuvchi nomlarini shu yerda o'zgartiring.
// Bo'sh qoldirilsa, lenta o'rniga havolali karta ko'rsatiladi.
const ACCOUNTS = {
  instagram: "otabek.yuldashevich.sobitov", // instagram.com/<nom>
  facebook: "", // facebook.com/<sahifa nomi>
  x: "", // x.com/<nom>
  linkedin: "", // LinkedIn profil havolasi to'liq yoziladi
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
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.5 3h3l-6.6 7.6L21.7 21h-6.1l-4.8-6.3L5.3 21h-3l7-8.1L2.5 3h6.2l4.3 5.7L17.5 3Zm-1.1 16.2h1.7L7.8 4.7H6L16.4 19.2Z" />
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
  const x = ACCOUNTS.x;
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
          {fb ? (
            <div className="feed-frame">
              <iframe
                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
                  `https://www.facebook.com/${fb}`
                )}&tabs=timeline&width=360&height=540&small_header=true&adapt_container_width=true&hide_cover=false`}
                title="Facebook sahifasi"
                loading="lazy"
                allow="encrypted-media"
              />
            </div>
          ) : (
            <FeedCard
              brand="facebook"
              text="Facebook sahifasidagi postlar, e'lonlar va yangiliklar bilan shu yerdan tanishishingiz mumkin."
              href="https://www.facebook.com/"
              linkLabel="Facebook sahifasini ochish ↗"
            />
          )}
          {fb && (
            <a
              className="feed-link"
              href={`https://www.facebook.com/${fb}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook sahifasini ochish ↗
            </a>
          )}
        </div>

        <div className="feed-col">
          <h3 className="feed-title">X (Twitter)</h3>
          {x ? (
            <div className="feed-frame">
              <iframe
                src={`https://syndication.twitter.com/srv/timeline-profile/screen-name/${x}`}
                title="X sahifasi"
                loading="lazy"
              />
            </div>
          ) : (
            <FeedCard
              brand="x"
              text="X (Twitter) sahifasidagi fikrlar va postlar bilan shu yerdan tanishishingiz mumkin."
              href="https://x.com/"
              linkLabel="X sahifasini ochish ↗"
            />
          )}
          {x && (
            <a
              className="feed-link"
              href={`https://x.com/${x}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              X sahifasini ochish ↗
            </a>
          )}
        </div>

        <div className="feed-col">
          <h3 className="feed-title">LinkedIn</h3>
          <FeedCard
            brand="linkedin"
            text="LinkedIn sahifasidagi postlar, video va rasmlar bilan shu yerdan tanishishingiz mumkin."
            href={li || "https://www.linkedin.com/"}
            linkLabel="LinkedIn profilini ochish ↗"
          />
        </div>
      </div>
    </section>
  );
}
