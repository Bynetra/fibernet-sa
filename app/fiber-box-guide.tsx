"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { copy, type Locale } from "./content";
import WhatsAppIcon from "./whatsapp-icon";

const photoSizes = [
  { width: 890, height: 554 },
  { width: 899, height: 1600 },
  { width: 300, height: 400 },
  { width: 638, height: 865 },
  { width: 960, height: 1280 },
];

function GuideIcon({
  name,
}: {
  name: "zoom" | "close" | "arrow";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "zoom" && (
        <>
          <path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6" />
          <path d="M8 12h8m-4-4v8" />
        </>
      )}
      {name === "close" && <path d="m6 6 12 12M18 6 6 18" />}
      {name === "arrow" && <path d="M4 12h15m-6-6 6 6-6 6" />}
    </svg>
  );
}

export default function FiberBoxGuide({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const isOpen = selected !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!isOpen) {
      if (dialog.open) dialog.close();
      openerRef.current?.focus({ preventScroll: true });
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (selected !== null && dialogRef.current) {
      dialogRef.current.scrollTop = 0;
    }
  }, [selected]);

  function changePhoto(step: number) {
    setSelected((index) =>
      index === null
        ? 0
        : (index + step + t.boxPhotos.length) % t.boxPhotos.length,
    );
  }

  const photoMessage = `https://wa.me/966547205593?text=${encodeURIComponent(t.boxesMessage)}`;

  return (
    <section
      className="box-guide-section"
      id="fiber-boxes"
      aria-labelledby="box-guide-title"
    >
      <div className="container box-guide-layout">
        <div className="box-guide-intro">
          <p className="eyebrow">{t.boxesEyebrow}</p>
          <h2 id="box-guide-title" className="preserve-lines">
            {t.boxesTitle}
          </h2>
          <p className="box-guide-description">{t.boxesDescription}</p>
          <ol className="box-photo-steps">
            {t.boxesSteps.map((step, index) => (
              <li key={step.title}>
                <span className="box-step-number" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <a
            className="button button-blue box-photo-cta"
            href={photoMessage}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            {t.boxesButton}
            <GuideIcon name="arrow" />
          </a>
          <p className="box-guide-note">{t.boxesNote}</p>
        </div>
        <div
          className="box-gallery"
          role="group"
          aria-label={t.boxesGalleryLabel}
        >
          <div className="box-photo-grid">
            {t.boxPhotos.map((photo, index) => (
              <figure
                className={`box-photo-card ${index === 0 ? "box-photo-featured" : ""}`}
                key={index}
              >
                <button
                  type="button"
                  className="box-photo-open"
                  onClick={(event) => {
                    openerRef.current = event.currentTarget;
                    setSelected(index);
                  }}
                  aria-label={`${t.viewPhoto}: ${photo.title}`}
                  aria-haspopup="dialog"
                  data-photo-index={index}
                >
                  <img
                    src={`/images/fiber-boxes/box-${index + 1}.jpg`}
                    width={photoSizes[index].width}
                    height={photoSizes[index].height}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="photo-expand">
                    <GuideIcon name="zoom" />
                  </span>
                  <span className="photo-index" aria-hidden="true">
                    0{index + 1}
                  </span>
                </button>
                <figcaption>
                  <strong>{photo.title}</strong>
                  {index === 0 && <span>{photo.text}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="box-gallery-note">{t.boxesGalleryNote}</p>
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className="photo-dialog"
        style={
          {
            "--photo-aspect":
              selected === null
                ? 1
                : photoSizes[selected].width / photoSizes[selected].height,
          } as CSSProperties
        }
        aria-labelledby="photo-dialog-title"
        aria-describedby="photo-dialog-description"
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            setSelected(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setSelected(null);
            return;
          }
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            changePhoto(
              (event.key === "ArrowRight" ? 1 : -1) *
                (locale === "ar" ? -1 : 1),
            );
          }
        }}
      >
        {selected !== null && (
          <>
            <div className="photo-dialog-top">
              <span>
                <bdi>{selected + 1}</bdi> {t.photoOf}{" "}
                <bdi>{t.boxPhotos.length}</bdi>
              </span>
              <div className="photo-dialog-actions">
                <div className="photo-controls">
                  <button
                    type="button"
                    onClick={() => changePhoto(-1)}
                    aria-label={t.previousPhoto}
                    className="photo-prev"
                  >
                    <GuideIcon name="arrow" />
                  </button>
                  <button
                    type="button"
                    onClick={() => changePhoto(1)}
                    aria-label={t.nextPhoto}
                  >
                    <GuideIcon name="arrow" />
                  </button>
                </div>
                <button
                  type="button"
                  className="photo-close"
                  aria-label={t.closePhoto}
                  onClick={() => setSelected(null)}
                  autoFocus
                >
                  <GuideIcon name="close" />
                </button>
              </div>
            </div>
            <div className="photo-dialog-image">
              <img
                src={`/images/fiber-boxes/box-${selected + 1}.jpg`}
                width={photoSizes[selected].width}
                height={photoSizes[selected].height}
                alt={t.boxPhotos[selected].alt}
              />
            </div>
            <div className="photo-dialog-bottom">
              <div>
                <h3 id="photo-dialog-title">{t.boxPhotos[selected].title}</h3>
                <p id="photo-dialog-description">{t.boxPhotos[selected].text}</p>
              </div>
            </div>
            <span className="sr-only" role="status">
              {selected + 1} {t.photoOf} {t.boxPhotos.length}:{" "}
              {t.boxPhotos[selected].title}
            </span>
          </>
        )}
      </dialog>
    </section>
  );
}
