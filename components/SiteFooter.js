export default function SiteFooter() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <div className="foot-logo">OTABEK SOBITOV</div>
          <p style={{ fontSize: 13, color: "#a9c2e0", lineHeight: 1.6, maxWidth: 260 }}>
            Oliy Majlis Qonunchilik palatasi huzuridagi Yoshlar parlamenti
            raisining rasmiy veb-sahifasi.
          </p>
        </div>
        <div>
          <h5>Sahifalar</h5>
          <ul>
            <li><a href="/men-haqimda">Men haqimda</a></li>
            <li><a href="/voqealar">Voqealar</a></li>
            <li><a href="/tashabbuslar">Tashabbuslar</a></li>
            <li><a href="/safarlar">Safarlar</a></li>
          </ul>
        </div>
        <div>
          <h5>Bog‘lanish</h5>
          <ul>
            <li>Matbuot xizmati</li>
            <li>Murojaat</li>
          </ul>
        </div>
        <div>
          <h5>Ijtimoiy tarmoqlar</h5>
          <ul className="foot-socials">
            <li>
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/otabek.yuldashevich.sobitov/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com/otabek.sobitov.9"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/otabek-sobitov-136192369/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container copy">
        <span>© 2026 OTABEK SOBITOV. Barcha huquqlar himoyalangan.</span>
        <span className="copy-madeby">
          <a
            href="https://t.me/abdurakhmonov_add"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abdurahmonov
          </a>{" "}
          tomonidan yaratilgan
        </span>
      </div>
    </footer>
  );
}
