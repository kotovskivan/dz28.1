function Slider(container, config) {
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

Slider.prototype.init = function (slidesData) {
  var self = this
  slidesData.forEach(function (item) {
    var slide = document.createElement('div')
    slide.className = 'slide'
    slide.style.backgroundImage = 'url(' + item + ')'
    self.slidesWrapper.appendChild(slide)
    self.slides.push(slide)
  })
  this.createControls()
  this.goToSlide(0)
  if (this.autoPlay) this.startAuto()
}

Slider.prototype.createControls = function () {
  var self = this
  var prev = document.createElement('button')
  prev.innerText = '❮'
  prev.className = 'nav-btn prev'
  prev.onclick = function () { self.prevSlide() }
  this.container.appendChild(prev)
  var next = document.createElement('button')
  next.innerText = '❯'
  next.className = 'nav-btn next'
  next.onclick = function () { self.nextSlide() }
  this.container.appendChild(next)
  var pause = document.createElement('button')
  pause.innerText = '⏸'
  pause.className = 'pause-btn'
  pause.onclick = function () { self.toggleAuto(pause) }
  this.container.appendChild(pause)
  if (this.showIndicators) {
    this.indicators = document.createElement('div')
    this.indicators.className = 'indicators'
    this.container.appendChild(this.indicators)
    this.slides.forEach(function (_, i) {
      var dot = document.createElement('span')
      dot.onclick = function () { self.goToSlide(i) }
      self.indicators.appendChild(dot)
    })
  }
}

Slider.prototype.goToSlide = function (index) {
  this.current = (index + this.slides.length) % this.slides.length
  this.slidesWrapper.style.transform = 'translateX(' + (-this.current * 100) + '%)'
  this.updateIndicators()
}

Slider.prototype.nextSlide = function () { this.goToSlide(this.current + 1) }
Slider.prototype.prevSlide = function () { this.goToSlide(this.current - 1) }
Slider.prototype.startAuto = function () {
  var self = this
  this.timer = setInterval(function () { self.nextSlide() }, this.interval)
}
Slider.prototype.stopAuto = function () { clearInterval(this.timer) }
Slider.prototype.toggleAuto = function (btn) {
  if (this.timer) {
    this.stopAuto()
    this.timer = null
    btn.innerText = '▶'
  } else {
    this.startAuto()
    btn.innerText = '⏸'
  }
}
Slider.prototype.updateIndicators = function () {
  if (!this.indicators) return
  var dots = this.indicators.querySelectorAll('span')
  dots.forEach((dot, i) => dot.classList.toggle('active', i === this.current))
}

function AdvancedSlider(container, config) {
  Slider.call(this, container, config)
  this.enableSwipe()
}
AdvancedSlider.prototype = Object.create(Slider.prototype)
AdvancedSlider.prototype.constructor = AdvancedSlider
AdvancedSlider.prototype.enableSwipe = function () {
  var self = this
  var startX = 0
  this.container.addEventListener('mousedown', function (e) { startX = e.clientX })
  this.container.addEventListener('mouseup', function (e) {
    if (e.clientX - startX > 50) self.prevSlide()
    if (e.clientX - startX < -50) self.nextSlide()
  })
  this.container.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX })
  this.container.addEventListener('touchend', function (e) {
    var endX = e.changedTouches[0].clientX
    if (endX - startX > 50) self.prevSlide()
    if (endX - startX < -50) self.nextSlide()
  })
}
