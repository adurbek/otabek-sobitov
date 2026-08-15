// Bosh sahifadagi ijtimoiy tarmoq bo'limi: har bir tarmoq o'z brend rangida
// profil kartasi ko'rinishida (rasm, ism, tasdiq belgisi, obunachilar, tugma).
// Barcha havolalar Otabek Sobitovning rasmiy akkauntlariga ulanadi. Ma'lumot
// admin paneldagi «Ijtimoiy tarmoqlar» bo'limidan (social_profiles) olinadi.
const NETWORKS = [
  { key: "instagram", title: "Instagram", btnLabel: "Profilni ochish" },
  { key: "facebook", title: "Facebook", btnLabel: "Sahifani ochish" },
  { key: "telegram", title: "Telegram", btnLabel: "Kanalni ochish" },
  { key: "linkedin", title: "LinkedIn", btnLabel: "Profilni ochish" },
];

const ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 8.1a3.9 3.9 0 1 0 0 7.8 3.9 3.9 0 0 0 0-7.8Zm0 6.43a2.53 2.53 0 1 1 0-5.06 2.53 2.53 0 0 1 0 5.06Zm4.97-6.6a.91.91 0 1 1-1.82 0 .91.91 0 0 1 1.82 0ZM19.6 8.96c-.06-1.22-.34-2.3-1.23-3.19-.89-.89-1.97-1.17-3.19-1.23-1.26-.07-5.03-.07-6.29 0-1.21.06-2.29.34-3.19 1.23-.89.89-1.16 1.97-1.23 3.18-.07 1.26-.07 5.04 0 6.3.06 1.21.34 2.29 1.23 3.18.9.89 1.98 1.17 3.19 1.23 1.26.07 5.03.07 6.29 0 1.22-.06 2.3-.34 3.19-1.23.89-.89 1.17-1.97 1.23-3.18.07-1.26.07-5.03 0-6.29Zm-1.62 7.64a2.56 2.56 0 0 1-1.44 1.44c-1 .4-3.36.31-4.46.31-1.1 0-3.47.08-4.46-.31a2.56 2.56 0 0 1-1.44-1.44c-.4-1-.31-3.36-.31-4.46 0-1.1-.08-3.47.31-4.46a2.56 2.56 0 0 1 1.44-1.44c1-.4 3.36-.31 4.46-.31 1.1 0 3.47-.08 4.46.31.67.26 1.18.78 1.44 1.44.4 1 .31 3.36.31 4.46 0 1.1.09 3.46-.31 4.46Z" />
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

const VERIFIED = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.2 14.1 4l2.7-.3 1 2.5 2.5 1-.3 2.7 1.8 2.1-1.8 2.1.3 2.7-2.5 1-1 2.5-2.7-.3L12 21.8 9.9 20l-2.7.3-1-2.5-2.5-1 .3-2.7L2.2 12 4 9.9l-.3-2.7 2.5-1 1-2.5 2.7.3L12 2.2Zm-1.2 12.9 5-5-1.4-1.4-3.6 3.6-1.6-1.6-1.4 1.4 3 3Z" />
  </svg>
);

const PLAY = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7L8 5Z" />
  </svg>
);

// Havola video (reel / video) ekanini taxminlaydi — shunda thumbnail ustida
// "play" belgisi chiqadi (Instagram/Facebook reels ko'rinishidek).
function isVideoLink(url = "") {
  return /reel|\/tv\/|\/video|youtu|\.mp4/i.test(url);
}

function PostTile({ post, icon }) {
  const video = isVideoLink(post.link_url);
  const inner = post.image_url ? (
    <>
      <img src={post.image_url} alt={post.body || ""} loading="lazy" />
      {video && (
        <span className="soc-thumb-play" aria-hidden="true">
          {PLAY}
        </span>
      )}
    </>
  ) : (
    <span className="soc-thumb-text">
      <span className="soc-thumb-brand" aria-hidden="true">
        {icon}
      </span>
      <span className="soc-thumb-body">{post.body}</span>
    </span>
  );

  return post.link_url ? (
    <a
      className={`soc-thumb${post.image_url ? "" : " soc-thumb--text"}`}
      href={post.link_url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {inner}
    </a>
  ) : (
    <div className={`soc-thumb${post.image_url ? "" : " soc-thumb--text"}`}>
      {inner}
    </div>
  );
}

function ProfileCard({ network, profile, posts }) {
  const url = profile?.profile_url || "";
  // Facebook Sahifa (Page) havolasi kiritilgan bo'lsa — rasmiy Facebook Page
  // Plugin orqali jonli lenta ko'rsatiladi (president.uz kabi): postlar avtomatik,
  // obunachilar soni va "Follow" tugmasi plaginning o'zida chiqadi.
  const pageUrl = network.key === "facebook" ? profile?.page_url : "";
  const href = pageUrl || url || "#";
  const name = profile?.display_name || "Otabek Sobitov";
  const handle = profile?.handle || "";
  const followers = profile?.followers || "";
  const icon = ICONS[network.key];
  // Profil to'rida eng ko'pi 6 ta post ko'rsatiladi (2 qator).
  const gridPosts = posts.slice(0, 6);

  if (pageUrl) {
    return (
      <div className={`soc-card brand-${network.key} soc-card--live`}>
        <div className="soc-cover">
          <span className="soc-cover-net">
            {icon}
            {network.title}
          </span>
          <span className="soc-cover-watermark" aria-hidden="true">
            {icon}
          </span>
        </div>
        <div className="soc-embed">
          <iframe
            src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
              pageUrl
            )}&tabs=timeline&width=380&height=520&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
            title={`${name} — Facebook`}
            loading="lazy"
            allow="encrypted-media"
          />
        </div>
        <div className="soc-body soc-body--live">
          <a
            className="soc-btn"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {icon}
            {network.btnLabel}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`soc-card brand-${network.key}`}>
      <div className="soc-cover">
        <span className="soc-cover-net">
          {icon}
          {network.title}
        </span>
        <span className="soc-cover-watermark" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="soc-body">
        {profile?.avatar_url ? (
          <img className="soc-avatar" src={profile.avatar_url} alt={name} />
        ) : (
          <span className="soc-avatar soc-avatar-fallback">{icon}</span>
        )}
        <span className="soc-name">
          <span className="soc-name-text">{name}</span>
          <span className="soc-verified" aria-hidden="true">
            {VERIFIED}
          </span>
        </span>
        {handle && <span className="soc-handle">{handle}</span>}
        {followers && <span className="soc-followers">{followers}</span>}

        {gridPosts.length > 0 && (
          <div className="soc-grid">
            {gridPosts.map((p) => (
              <PostTile key={p.id} post={p} icon={icon} />
            ))}
          </div>
        )}

        <a
          className="soc-btn"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {icon}
          {network.btnLabel}
        </a>
      </div>
    </div>
  );
}

// Instagram kartasi — Instagram telefon profili ko'rinishida: avatar chapda,
// yonida ustma-ust statistika (posts/followers/following), pastda ism, bio,
// tugma va 3 ustunli post to'ri. Karta telefon eniga o'xshab markazda turadi.
function InstagramCard({ profile, posts }) {
  const name = profile?.display_name || "Otabek Sobitov";
  const url = profile?.profile_url || "https://www.instagram.com/";
  const followers = profile?.followers || "0";
  const following = profile?.following || "0";
  const bio = profile?.bio || "";
  const icon = ICONS.instagram;
  const postsCount = posts.length;
  const gridPosts = posts.slice(0, 9);

  return (
    <div className="ig-card">
      <div className="ig-head">
        <a
          className="ig-avatar-ring"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {profile?.avatar_url ? (
            <img className="ig-avatar" src={profile.avatar_url} alt={name} />
          ) : (
            <span className="ig-avatar ig-avatar-fallback">{icon}</span>
          )}
        </a>
        <div className="ig-stats">
          <div className="ig-stat">
            <b>{postsCount}</b>
            <span>posts</span>
          </div>
          <div className="ig-stat">
            <b>{followers}</b>
            <span>followers</span>
          </div>
          <div className="ig-stat">
            <b>{following}</b>
            <span>following</span>
          </div>
        </div>
      </div>

      <div className="ig-name">
        <span className="ig-name-text">{name}</span>
        <span className="ig-verified" aria-hidden="true">
          {VERIFIED}
        </span>
      </div>
      {bio && <div className="ig-bio">{bio}</div>}

      <a className="ig-btn" href={url} target="_blank" rel="noopener noreferrer">
        {icon}
        Profilni ochish
      </a>

      {gridPosts.length > 0 && (
        <div className="ig-grid">
          {gridPosts.map((p) => (
            <PostTile key={p.id} post={p} icon={icon} />
          ))}
        </div>
      )}
    </div>
  );
}

// LinkedIn kartasi — haqiqiy LinkedIn profil ko'rinishida: qora banner, avatar
// bannerga tushib turadi, ism, headline (lavozim), joylashuv, connections va tugma.
function LinkedInCard({ profile }) {
  const name = profile?.display_name || "Otabek Sobitov";
  const url = profile?.profile_url || "https://www.linkedin.com/";
  const headline = profile?.bio || "";
  const location = profile?.location || "";
  const connections = profile?.followers || "";
  const icon = ICONS.linkedin;

  return (
    <div className="li-card">
      <div className="li-cover">
        <span className="li-cover-watermark" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="li-body">
        <a
          className="li-avatar-wrap"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {profile?.avatar_url ? (
            <img className="li-avatar" src={profile.avatar_url} alt={name} />
          ) : (
            <span className="li-avatar li-avatar-fallback">{icon}</span>
          )}
        </a>
        <div className="li-name">
          <span className="li-name-text">{name}</span>
          <span className="li-verified" aria-hidden="true">
            {VERIFIED}
          </span>
        </div>
        {headline && <div className="li-headline">{headline}</div>}
        {location && <div className="li-location">{location}</div>}
        {connections && (
          <div className="li-connections">{connections} connections</div>
        )}
        <a className="li-btn" href={url} target="_blank" rel="noopener noreferrer">
          {icon}
          Profilni ochish
        </a>
      </div>
    </div>
  );
}

export default function SocialFeeds({ profiles = [], posts = [] }) {
  const profileByNetwork = {};
  for (const p of profiles) profileByNetwork[p.network] = p;
  const others = NETWORKS.filter((n) => n.key !== "instagram");

  return (
    <section className="container social-feeds">
      <h2 className="social-feeds-title">Ijtimoiy tarmoqlarda kuzating</h2>

      <InstagramCard
        profile={profileByNetwork.instagram}
        posts={posts.filter((p) => p.network === "instagram")}
      />

      <div className="social-feeds-grid social-feeds-grid--3">
        {others.map((n) =>
          n.key === "linkedin" ? (
            <LinkedInCard key={n.key} profile={profileByNetwork[n.key]} />
          ) : (
            <ProfileCard
              key={n.key}
              network={n}
              profile={profileByNetwork[n.key]}
              posts={posts.filter((p) => p.network === n.key)}
            />
          )
        )}
      </div>
    </section>
  );
}
