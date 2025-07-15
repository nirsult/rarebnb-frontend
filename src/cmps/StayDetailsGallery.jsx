import { useEffect, useRef } from "react"
import { DotsGrid, LeftArrow } from "./Icons"


export function StayDetailsGallery({ imgUrls, isGalleryExpanded, setIsGalleryExpanded, setIsNavVisible }) {
  const galleryPreview = imgUrls.slice(0, 5)
  const galleryRef = useRef()

  useEffect(() => {
    if (!galleryRef.current) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsNavVisible(!entry.isIntersecting)
    })

    observer.observe(galleryRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={galleryRef} id="photos" className="stay-details-gallery">

      {!isGalleryExpanded && (
        <div className={`gallery-preview-container count-${galleryPreview.length}`} >
          {galleryPreview.map(imgUrl => (
            <img
              key={imgUrl}
              src={imgUrl}
              onClick={() => setIsGalleryExpanded(true)}
            />))}
          <button className="btn-show-all" onClick={() => setIsGalleryExpanded(true)}>{<DotsGrid />}Show all photos</button>
        </div>
      )}

      {isGalleryExpanded && (
        <>
          <button className="btn-back flex" onClick={() => setIsGalleryExpanded(false)}>{<LeftArrow size="16px" />}</button>
          <div className="gallery-full-container">
            {imgUrls.map(imgUrl => <img key={imgUrl} src={imgUrl}></img>)}
          </div>
        </>
      )}

    </section>
  )
}