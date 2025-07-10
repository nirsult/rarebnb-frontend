export function SkeletonPreviewCard() {
  return (
    <section className="skeleton stay-preview">
      <div className="preview-img skeleton-box"></div>
      <section className="preivew-details">
        <div className="skeleton-line skeleton-header">
          <div className="skeleton-title"></div>
          <div className="skeleton-rating"></div>
        </div>
        <div className="skeleton-line skeleton-text"></div>
        <div className="skeleton-line skeleton-text shorter"></div>
        <div className="skeleton-line skeleton-price shorter"></div>
      </section>
    </section>
  )
}

export function SkeletonDetailsGallery() {
  return (
    <section className="skeleton stay-details">
      <div className="skeleton-line skeleton-title"></div>
      <section className="stay-details-gallery">
        <div className="gallery-preview-container count-5">
          <div className="skeleton-box"></div>
          <div className="skeleton-box"></div>
          <div className="skeleton-box"></div>
          <div className="skeleton-box"></div>
          <div className="skeleton-box"></div>
        </div>
      </section>
      <section className="scroll-section">
        <div className="main-column">
          <div className="stay-details-summary">
            <section className="skeleton-header">
              <div className="skeleton-line sub-header"></div>
              <div className="skeleton-line details-highlight"></div>
              <div className="skeleton-line reviews-highlight"></div>
            </section>
            <section className="summary-host-info">
              <div className="skeleton-box"></div>
              <div className="skeleton-line host-name"></div>
              <div className="skeleton-line host-details"></div>
              <h4></h4>
              <p></p>
            </section>
          </div>
        </div>
      </section>

    </section>
  )
}