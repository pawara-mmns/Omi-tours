"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, X } from "lucide-react";
import { album } from "@/data/gallery";
import "./photo-album.css";

export function PhotoAlbum() {
  const [chapter, setChapter] = useState(0);
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const { title, photos } = album[chapter];
  const photo = photos[selected];

  function openPhoto(index: number) {
    setSelected(index);
    dialog.current?.showModal();
  }

  function turnPhoto(direction: number) {
    setSelected((index) => (index + direction + photos.length) % photos.length);
  }

  return (
    <section className="photo-album" id="gallery" aria-labelledby="album-title">
      <div className="wrap">
        <header className="album-heading">
          <div>
            <p className="route-eyebrow">Photo gallery</p>
            <h2 id="album-title">
              Postcards from <em>Sri Lanka</em>
            </h2>
          </div>
          <p>
            Open a print to see the full photograph and find its place in the
            journey.
          </p>
        </header>
        <div
          className="album-chapters"
          role="group"
          aria-label="Gallery chapters"
        >
          {album.map((entry, index) => (
            <button
              type="button"
              key={entry.title}
              aria-pressed={chapter === index}
              aria-controls="album-spread"
              onClick={() => {
                setSelected(0);
                setChapter(index);
              }}
            >
              {entry.title}
            </button>
          ))}
        </div>
        <div
          className="album-spread"
          id="album-spread"
          aria-label={title}
          role="group"
        >
          {photos.map((entry, index) => (
            <button
              type="button"
              className="album-print"
              key={entry.image}
              aria-haspopup="dialog"
              aria-label={`Enlarge photograph: ${entry.caption}, ${entry.place}`}
              onClick={() => openPhoto(index)}
            >
              <span className="print-image">
                <img
                  src={`/images/${entry.image}.webp`}
                  alt={entry.alt}
                  loading="lazy"
                  width="620"
                  height="420"
                />
                <span className="print-expand" aria-hidden="true">
                  <Expand size={15} />
                </span>
              </span>
              <span className="print-caption">{entry.caption}</span>
              <span className="print-location">
                {entry.place} · Day {entry.day}
              </span>
            </button>
          ))}
          <img
            className="album-botanical"
            src="/images/journal/tea-flower.webp"
            alt=""
            loading="lazy"
          />
        </div>
      </div>
      <dialog
        ref={dialog}
        className="album-viewer"
        aria-labelledby="viewer-title"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            turnPhoto(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        <div className="viewer-sheet">
          <div className="viewer-toolbar">
            <span>
              {title} · {selected + 1} / {photos.length}
            </span>
            <button
              type="button"
              aria-label="Close photograph"
              onClick={() => dialog.current?.close()}
            >
              <X size={21} />
            </button>
          </div>
          <img
            className="viewer-image"
            src={`/images/${photo.image}.webp`}
            alt={photo.alt}
            loading="lazy"
          />
          <div className="viewer-details">
            <div aria-live="polite">
              <h3 id="viewer-title">{photo.caption}</h3>
              <Link
                href={`/journey?day=${photo.day}`}
                onClick={() => dialog.current?.close()}
              >
                {photo.place} · View day {photo.day}
                <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="viewer-paging">
              <button
                type="button"
                aria-label="Previous gallery photograph"
                onClick={() => turnPhoto(-1)}
              >
                <ArrowLeft size={19} />
              </button>
              <button
                type="button"
                aria-label="Next gallery photograph"
                onClick={() => turnPhoto(1)}
              >
                <ArrowRight size={19} />
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
}
