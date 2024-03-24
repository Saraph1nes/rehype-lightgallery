import { visit } from 'unist-util-visit'

import './index.css'

export default function rehypeLightGallery(options) {

  let imgIdxCount = 0;
  let curDom = null;
  const previewStyle = `width: auto;height: 90vh;top: 50%; left: 50%;transform: translate(-50%, -50%);`

  const onPreview = (node) => {
    getCurDom(node)
    handleMaskShow(node)
  }

  const getCurDom = (node) => {
    const imgIdx = node.properties['img-index'];
    const imgs = document.querySelectorAll('img')
    for (const i of imgs) {
      if (+i.attributes['img-index'].value === +imgIdx) {
        curDom = i
      }
    }
  }

  const hideCurDom = () => {
    curDom.style.visibility = 'hidden'
  }

  const showCurDom = () => {
    curDom.style.visibility = 'visible'
  }

  const getCurDomInitStyle = () => {
    const imgDomWidth = curDom.width;
    const imgDomHeight = curDom.height;
    const imgDom2Left = curDom.getBoundingClientRect().x;
    const imgDom2Top = curDom.getBoundingClientRect().y;
    return `width: ${imgDomWidth}px;height: ${imgDomHeight}px;top: ${imgDom2Top}px; left: ${imgDom2Left}px;`
  }

  const handleMaskShow = (node) => {
    const imgSrc = node.properties.src

    hideCurDom()

    const mask = document.createElement('div')
    const img = document.createElement('img')
    img.style = getCurDomInitStyle()
    img.src = imgSrc

    requestAnimationFrame(() => {
      img.style = previewStyle;
    });

    mask.classList.add('rehype-light-gallery-modal')
    mask.onclick = onMaskClick
    mask.onwheel = onMaskClick
    mask.appendChild(img)
    document.body.appendChild(mask)
    document.body.style.overflow = 'hidden'
  }

  const onMaskClick = () => {
    const mask = document.querySelector('.rehype-light-gallery-modal')
    const img = mask.firstChild;
    if (mask) {
      requestAnimationFrame(() => {
        mask.remove()
        document.body.style.overflow = ''
        showCurDom()
      });
    }
  }

  return function (tree) {
    visit(tree, 'element', function (node) {
      if (node.tagName === 'img') {
        node.properties['img-index'] = imgIdxCount;
        node.properties.style = 'cursor: pointer;text-align: center;display:block;margin: 0 auto;max-height: 50vh'
        node.properties.onclick = () => {
          onPreview(node)
        }
        imgIdxCount++;
      }
    })
  }
}
