"use client";

import { useState } from "react";

/**
 * Privacyvriendelijke YouTube-speler.
 *
 * Tot iemand op afspelen klikt, toont dit alleen een lokale posterafbeelding: er gaat
 * geen enkel verzoek naar YouTube of Google. Pas na de klik laden we de speler via
 * youtube-nocookie.com (YouTube's modus met uitgebreide privacy). Die host staat in
 * frame-src van de CSP in next.config.ts.
 */
export default function YouTubeEmbed({ id, title, poster }: { id: string; title: string; poster: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure style={{ margin: 0 }}>
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          borderRadius: 18,
          overflow: "hidden",
          background: "#101C29",
          boxShadow: "0 18px 44px rgba(16,28,41,.14)",
        }}
      >
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&hl=nl&cc_lang_pref=nl`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Video afspelen: ${title}`}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", padding: 0, border: 0, cursor: "pointer", background: "transparent" }}
          >
            <img src={poster} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 84,
                height: 84,
                marginLeft: -42,
                marginTop: -42,
                borderRadius: "50%",
                background: "#087B63",
                boxShadow: "0 10px 30px rgba(16,28,41,.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 24 24" width="34" height="34" fill="#fff"><path d="M8 5.5v13l11-6.5z" /></svg>
            </span>
          </button>
        )}
      </div>
      <figcaption style={{ marginTop: 10, fontSize: 14, lineHeight: 1.5, color: "#52606C" }}>
        {title} · Pas bij afspelen laadt YouTube (youtube-nocookie.com).{" "}
        <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer" style={{ color: "#087B63", textDecoration: "underline" }}>
          Bekijk op YouTube
        </a>
      </figcaption>
    </figure>
  );
}
