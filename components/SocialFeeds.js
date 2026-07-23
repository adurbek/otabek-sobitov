// Instagram lentasi rasmiy embed orqali keladi. Facebook, Telegram va LinkedIn
// ochiq embed bermaydi (shaxsiy profil / kanal emas / umuman API yo'q), shuning
// uchun ular admin panelidan kiritilgan postlardan yig'iladi.
const INSTAGRAM_ACCOUNT = "otabek.yuldashevich.sobitov";

const NETWORKS = [
  { key: "facebook", title: "Facebook", linkLabel: "Facebook sahifasini ochish ↗" },
  { key: "telegram", title: "Telegram", linkLabel: "Telegram sahifasini ochish ↗" },
  { key: "linkedin", title: "LinkedIn", linkLabel: "LinkedIn profilini ochish ↗" },
];

const ICONS = {
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

function FeedColumn({ network, profile, posts }) {
  const url = profile?.profile_url || "";
  return (
    <div className="feed-col">
      <h3 className="feed-title">{network.title}</h3>
      <div className="feed-embed">
        <div className={`feed-head brand-${network.key}`}>
          {profile?.avatar_url ? (
            <img className="feed-avatar" src={profile.avatar_url} alt={profile.display_name} />
          ) : (
            <span className="feed-avatar feed-avatar-fallback">{ICONS[network.key]}</span>
          )}
          <span className="feed-head-text">
            <b>{profile?.display_name || "Otabek Sobitov"}</b>
            {profile?.handle && <span className="feed-handle">{profile.handle}</span>}
            {profile?.followers && <span className="feed-count">{profile.followers}</span>}
          </span>
          <span className="feed-head-icon">{ICONS[network.key]}</span>
        </div>

        <div className="feed-scroll">
          {posts.length === 0 && (
            <p className="feed-empty">
              Hozircha post qo&rsquo;shilmagan. Admin panelidagi &laquo;Ijtimoiy
              tarmoqlar&raquo; bo&rsquo;limidan qo&rsquo;shishingiz mumkin.
            </p>
          )}
          {posts.map((p) => {
            const inner = (
              <>
                {p.image_url && <img src={p.image_url} alt="" />}
                {p.body && <p>{p.body}</p>}
                {p.date && <span className="feed-post-date">{p.date}</span>}
              </>
            );
            return p.link_url ? (
              <a
                className="feed-post"
                key={p.id}
                href={p.link_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {inner}
              </a>
            ) : (
              <div className="feed-post" key={p.id}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
      {url && (
        <a className="feed-link" href={url} target="_blank" rel="noopener noreferrer">
          {network.linkLabel}
        </a>
      )}
    </div>
  );
}

export default function SocialFeeds({ profiles = [], posts = [] }) {
  const profileByNetwork = {};
  for (const p of profiles) profileByNetwork[p.network] = p;

  return (
    <section className="container social-feeds">
      <div className="social-feeds-grid">
        <div className="feed-col">
          <h3 className="feed-title">Instagram</h3>
          <div className="feed-frame">
            <iframe
              src={`https://www.instagram.com/${INSTAGRAM_ACCOUNT}/embed`}
              title="Instagram sahifasi"
              loading="lazy"
              allowtransparency="true"
            />
          </div>
          <a
            className="feed-link"
            href={`https://www.instagram.com/${INSTAGRAM_ACCOUNT}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram sahifasini ochish ↗
          </a>
        </div>

        {NETWORKS.map((n) => (
          <FeedColumn
            key={n.key}
            network={n}
            profile={profileByNetwork[n.key]}
            posts={posts.filter((p) => p.network === n.key)}
          />
        ))}
      </div>
    </section>
  );
}
