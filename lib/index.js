import {visit} from 'unist-util-visit'

import './index.css'

export default function rehypeLightGallery(options) {

  const onPreview = (node) => {
    handleMaskShow(node)
  }

  const handleMaskShow = (node) => {
    const imgSrc = node.properties.src
    const mask = document.createElement('div')
    const img = document.createElement('img')
    img.style = 'max-width: 90vw;max-height: 90vh';
    img.src = imgSrc
    mask.classList.add('rehype-light-gallery-modal')
    mask.onclick = onMaskClick
    mask.onwheel = onMaskClick
    mask.appendChild(img)
    document.body.appendChild(mask)
    // prevent roll penetration
    document.body.style.overflow = 'hidden'
  }

  const onMaskClick = () => {
    const mask = document.querySelector('.rehype-light-gallery-modal')
    if (mask) {
      mask.remove()
    }
    // release roll
    document.body.style.overflow = ''
  }

  return function (tree) {
    visit(tree, 'element', function (node) {

      if (node.tagName === 'img') {
        node.properties.style = 'cursor: pointer;text-align: center;display:block;margin: 0 auto;max-height: 50vh'
        node.properties.onclick = () => {
          onPreview(node)
        }
      }
    })
  }
}
