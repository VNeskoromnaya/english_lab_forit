NodeList.prototype.findByClassName = function (className) {
    let result = [];

    this.forEach((el) => {
        if (el.classList && el.classList.contains(className)) {
            result.push(el);
        }
    });

    return result;
};

document.addEventListener('DOMContentLoaded', function() {

    const resetActiveItems = (elemClassName, activeClassName) => {
        document.querySelectorAll(`.${elemClassName}`).forEach((el) => {
            el.classList.remove(activeClassName);
        });
    };

    const addActiveToggleListeners = (elemClassName, activeClassName) => {
        document.querySelectorAll(`.${elemClassName}`).forEach((el) => {
            el.addEventListener('click', (evt) => {
                evt.preventDefault();
                evt.stopPropagation();

                console.log(`${elemClassName} click`);
    
                var isActive = el.classList.contains(activeClassName);
    
                resetActiveItems(elemClassName, activeClassName);
    
                if (!isActive) {
                    el.classList.add(activeClassName);
                }
            });
        });
    };

    addActiveToggleListeners('program__item', 'active');
    addActiveToggleListeners('question__item', 'active');

    document.querySelectorAll('.menu_mobile').forEach((el) => {
        el.addEventListener('click', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();

            if (!el.classList.contains('active')) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    });

    document.querySelectorAll('.menu__wrapper .menu__list a').forEach((el) => {
        el.addEventListener('click', (evt) => {

            document.querySelectorAll('.menu_mobile').forEach((m) => {
                m.classList.remove('active');
            });
        });
    });


    const initSlider = function () {
        const slider = document.querySelectorAll('.feedback')[0];

        const slideWrapper = slider.childNodes.findByClassName('feedback__wrapper')[0];
        const dotsWrapper = slider.childNodes.findByClassName('feedback-slider')[0];

        let slideCount = 0;
        const slidesCollection = [];
        slideWrapper.childNodes.findByClassName('feedback__card').forEach((slide, index) => {
            slide.setAttribute('data-index', index);
            slideCount++;
            var dot = document.createElement('div');
            dot.classList.add('feedback-slider__dot');
            dot.setAttribute('data-slide', index);
            slidesCollection.push(slide);
            if (index == 0) {
                if (!slide.classList.contains('current')) {
                    slide.classList.add('current');
                }
                slideWrapper.setAttribute('data-current', 0);
                dot.classList.add('active');
            } else {
                slide.remove();
            }

            dotsWrapper.appendChild(dot);

        });

        slideWrapper.setAttribute('data-max-slide', slideCount - 1);

        let animationInProgress = false;

        const nextSlide = () => {
            if (animationInProgress) {
                return;
            }

            animationInProgress = true;

            let current = parseInt(slideWrapper.getAttribute('data-current'));
            let max = parseInt(slideWrapper.getAttribute('data-max-slide'));

            let next = current == max ? 0 : current + 1;

            let currentSlide = slidesCollection[current];
            let nextSlide = slidesCollection[next];

            slideWrapper.appendChild(nextSlide);

            currentSlide.classList.add('slide-left');

            let onTransitionEnd = () => {
                console.log('transition end');
                slideWrapper.setAttribute('data-current', next);
                nextSlide.removeEventListener('transitionend', onTransitionEnd);
                nextSlide.removeEventListener('webkitTransitionEnd', onTransitionEnd);
                nextSlide.classList.remove('animate');
                currentSlide.classList.remove('animate');

                currentSlide.classList.remove('slide-left');
                nextSlide.classList.remove('slide-left');
                nextSlide.classList.add('current');

                currentSlide.remove();

                window.setTimeout(() => {
                    animationInProgress = false;
                }, 5);
            };

            nextSlide.addEventListener('transitionend', onTransitionEnd);
            nextSlide.addEventListener('webkitTransitionEnd', onTransitionEnd);

            currentSlide.classList.add('animate');
            nextSlide.classList.add('animate');

            window.setTimeout(() => {
                currentSlide.classList.remove('current');
                nextSlide.classList.add('slide-left');

                resetActiveItems('feedback-slider__dot', 'active');
                document.querySelectorAll(`.feedback-slider__dot[data-slide="${next}"]`)[0].classList.add('active');
            }, 10);

            
        };

        const previousSlide = () => {
            if (animationInProgress) {
                return;
            }

            animationInProgress = true;

            let current = parseInt(slideWrapper.getAttribute('data-current'));
            let max = parseInt(slideWrapper.getAttribute('data-max-slide'));

            let prev = current == 0 ? max : current - 1;

            let currentSlide = slidesCollection[current];
            let prevSlide = slidesCollection[prev];

            slideWrapper.prepend(prevSlide);

            currentSlide.classList.add('slide-left');
            prevSlide.classList.add('slide-left');
            currentSlide.classList.remove('current');

            let onTransitionEnd = () => {
                console.log('transition end');
                slideWrapper.setAttribute('data-current', prev);
                prevSlide.removeEventListener('transitionend', onTransitionEnd);
                prevSlide.removeEventListener('webkitTransitionEnd', onTransitionEnd);
                prevSlide.classList.remove('animate');
                currentSlide.classList.remove('animate');

                prevSlide.classList.remove('slide-left');
                prevSlide.classList.add('current');

                currentSlide.remove();

                window.setTimeout(() => {
                    animationInProgress = false;
                }, 5);
            };

            prevSlide.addEventListener('transitionend', onTransitionEnd);
            prevSlide.addEventListener('webkitTransitionEnd', onTransitionEnd);

            window.setTimeout(() => {
                currentSlide.classList.add('animate');
                prevSlide.classList.add('animate');

                window.setTimeout(() => {
                    currentSlide.classList.remove('slide-left');
                    prevSlide.classList.add('current');

                    resetActiveItems('feedback-slider__dot', 'active');
                    document.querySelectorAll(`.feedback-slider__dot[data-slide="${prev}"]`)[0].classList.add('active');
                }, 10);
            }, 2);
            
        };

        document.querySelectorAll('.feedback-slider__arrow.prev')[0].addEventListener('click', () => {
            previousSlide();
        });

        document.querySelectorAll('.feedback-slider__arrow.next')[0].addEventListener('click', () => {
            nextSlide();
        });


        let pageWidth = window.innerWidth || document.body.clientWidth;
        let treshold = Math.max(1,Math.floor(0.01 * (pageWidth)));
        let touchstartX = 0;
        let touchstartY = 0;
        let touchendX = 0;
        let touchendY = 0;

        const limit = Math.tan(45 * 1.5 / 180 * Math.PI);
        const gestureZone = slideWrapper;

        gestureZone.addEventListener('touchstart', function(event) {
            touchstartX = event.changedTouches[0].screenX;
            touchstartY = event.changedTouches[0].screenY;
        }, false);

        gestureZone.addEventListener('touchend', function(event) {
            touchendX = event.changedTouches[0].screenX;
            touchendY = event.changedTouches[0].screenY;
            handleGesture(event);
        }, false);

        function handleGesture(e) {
            let x = touchendX - touchstartX;
            let y = touchendY - touchstartY;
            let xy = Math.abs(x / y);
            let yx = Math.abs(y / x);
            if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
                if (yx <= limit) { //left or right
                    e.preventDefault();
                    e.stopPropagation();
                    if (x < 0) {
                        console.log('left');
                        nextSlide();
                    } else {
                        console.log('right');
                        previousSlide();
                    }
                }
            }
        }
    };

    initSlider();


    const initContactMe = function () {

        const contactMe = document.querySelector('.contact-me-wrapper');
        const contactMeFloatIcon = document.querySelector('.contact-me-wrapper .float-icon');

        const contactMeMenu = document.querySelector('.contact-me-wrapper .icon-menu');

        contactMeFloatIcon.addEventListener('click', () => {
            if (contactMe.classList.contains('expanded')) {
                contactMe.classList.remove('expanded');
            } else {
                contactMe.classList.add('expanded');
            }
        });
    };
    initContactMe();
  });

