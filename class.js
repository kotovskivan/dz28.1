class Slider {
  constructor(container, config) {
    this.container = document.querySelector(container)
    this.slidesWrapper = document.createElement('div')
    this.slidesWrapper.className = 'slides'
    this.container.appendChild(this.slidesWrapper)
    this.slides = []
    this.current = 0
    this.interval = config.interval || 3000
    this.showIndicators = config.showIndicators !== false
    this.autoPlay = config.autoPlay !== false
    this.timer = null
    this.init(config.slides || [])
  }

  init(slidesData) {
    slidesData.forEach(item => {
      let slide = document.createElement('div')
      slide.className = 'slide'
      slide.style.backgroundImage = `url(${item})`
      this.slidesWrapper.appendChild(slide)
      this.slides.push(slide)
    })
    this.createControls()
    this.goToSlide(0)
    if (this.autoPlay) this.startAuto()
    this.enableHoverPause()
  }

  createControls() {
    let prev = document.createElement('button')
    prev.innerText = '❮'
    prev.className = 'nav-btn prev'
    prev.onclick = () => this.prevSlide()
    this.container.appendChild(prev)

    let next = document.createElement('button')
    next.innerText = '❯'
    next.className = 'nav-btn next'
    next.onclick = () => this.nextSlide()
    this.container.appendChild(next)

    let pause = document.createElement('button')
    pause.innerText = '⏸'
    pause.className = 'pause-btn'
    pause.onclick = () => this.toggleAuto(pause)
    this.container.appendChild(pause)

    if (this.showIndicators) {
      this.indicators = document.createElement('div')
      this.indicators.className = 'indicators'
      this.container.appendChild(this.indicators)
      this.slides.forEach((_, i) => {
        let dot = document.createElement('span')
        dot.onclick = () => this.goToSlide(i)
        this.indicators.appendChild(dot)
      })
    }
  }

  goToSlide(index) {
    this.current = (index + this.slides.length) % this.slides.length
    this.slidesWrapper.style.transform = `translateX(${-this.current * 100}%)`
    this.updateIndicators()
  }

  nextSlide() { this.goToSlide(this.current + 1) }
  prevSlide() { this.goToSlide(this.current - 1) }
  startAuto() { this.timer = setInterval(() => this.nextSlide(), this.interval) }
  stopAuto() { clearInterval(this.timer) }

  toggleAuto(btn) {
    if (this.timer) {
      this.stopAuto()
      this.timer = null
      btn.innerText = '▶'
    } else {
      this.startAuto()
      btn.innerText = '⏸'
    }
  }

  updateIndicators() {
    if (!this.indicators) return
    let dots = this.indicators.querySelectorAll('span')
    dots.forEach((dot, i) => dot.classList.toggle('active', i === this.current))
  }

  enableHoverPause() {
    this.container.addEventListener('mouseenter', () => this.stopAuto())
    this.container.addEventListener('mouseleave', () => this.startAuto())
  }
}

class AdvancedSlider extends Slider {
  constructor(container, config) {
    super(container, config)
    this.enableSwipe()
  }

  enableSwipe() {
    let startX = 0
    this.container.addEventListener('mousedown', e => { startX = e.clientX })
    this.container.addEventListener('mouseup', e => {
      if (e.clientX - startX > 50) this.prevSlide()
      if (e.clientX - startX < -50) this.nextSlide()
    })
    this.container.addEventListener('touchstart', e => { startX = e.touches[0].clientX })
    this.container.addEventListener('touchend', e => {
      let endX = e.changedTouches[0].clientX
      if (endX - startX > 50) this.prevSlide()
      if (endX - startX < -50) this.nextSlide()
    })
  }
}
