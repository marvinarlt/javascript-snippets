/**
 * Slideshow
 * 
 * @author Marvin Arlt
 * @date 2020-05-19
 * @version 0.2
 */
function Slideshow(options)
{
    const _this = this;
    const defaultOptions = {
        selectors: {
            container: '.slideshowContainer',
            wrapper: '.slideshowWrapper',
            item: '.slideshowItem',
            previous: '.slideshowPrevious',
            next: '.slideshowNext'
        },
        autoplay: {
            active: false,
            speed: 3000
        },
        firstItem: 1,
        transition: {
            duration: 500,
            timingFunction: 'ease-in-out'
        }
    };

    this.init = function ()
    {
        _this.config = _this.setConfiguration(options, defaultOptions);

        const containers = _this.getContainers();

        for (let i = 0; i < containers.length; i++) {
            const container = containers[i];
            const wrapper = _this.getWrapper(container);
            const items = _this.getItems(wrapper);
            
            _this.createDuplicateSlides(wrapper, items);

            const itemCount = items.length + 2;

            _this.updateView(container, wrapper, itemCount);

            window.addEventListener('resize', function ()
            {
                _this.updateView(container, wrapper, itemCount);
            });

            _this.setFirstItem(container, wrapper, items);

            const previousButton = _this.getPreviousButton(container);
            const nextButton = _this.getNextButton(container);

            previousButton.addEventListener('click', function ()
            {
                _this.changeView('previous', container, wrapper, items);
            });

            nextButton.addEventListener('click', function ()
            {
                _this.changeView('next', container, wrapper, items);
            });

            if (_this.config.autoplay.active) {
                _this.autoplay(container, wrapper, items);
            }
        }
    }

    this.changeView = function (direction, container, wrapper, items)
    {
        const currentItem = _this.getCurrentItem(wrapper);
        const currentTransform = _this.getCurrentTransform(wrapper.style.transform);
        const itemWidth = _this.getContainerWidth(container);
        const itemCount = items.length;

        let transformX;
        let nextItem;
        let firstLastItem;

        if (direction === 'previous') {
            nextItem = currentItem.previousElementSibling;
            transformX = parseInt(currentTransform) - itemWidth;
            firstLastItem = items[itemCount - 1];
        } else {
            nextItem = currentItem.nextElementSibling;
            transformX = parseInt(currentTransform) + itemWidth;
            firstLastItem = items[0];
        }

        wrapper.style.transition = _this.config.transition.duration + 'ms ' + _this.config.transition.timingFunction;
        wrapper.style.transform = 'translateX(-' + transformX + 'px)';

        currentItem.classList.remove('slideshowCurrentItem');
        nextItem.classList.add('slideshowCurrentItem');

        if (nextItem.classList.contains('slideshowDuplicate')) {
            if (direction === 'previous') {
                transformX = itemCount * itemWidth;
            } else {
                transformX = itemWidth;
            }

            container.addEventListener('transitionend', function ()
            {
                wrapper.style.transition = 'none';
                wrapper.style.transform = 'translateX(-' + transformX + 'px)';
            }, {once: true});

            nextItem.classList.remove('slideshowCurrentItem');
            firstLastItem.classList.add('slideshowCurrentItem');
        }        
    }

    this.autoplay = function (container, wrapper, items)
    {
        setInterval(function ()
        {
            _this.changeView('next', container, wrapper, items);
        }, _this.config.autoplay.speed);
    }

    this.updateView = function (container, wrapper, itemCount)
    {
        const containerWidth = _this.getContainerWidth(container);
        const wrapperWidth = containerWidth * itemCount;

        wrapper.style.width = wrapperWidth + 'px';
    }

    this.createDuplicateSlides = function (wrapper, items)
    {
        const firstItem = items[0];
        const lastItem = items[items.length - 1];
        const firstItemClone = firstItem.cloneNode(true);
        const lastItemClone = lastItem.cloneNode(true);

        firstItemClone.classList.add('slideshowDuplicate');
        lastItemClone.classList.add('slideshowDuplicate');

        wrapper.appendChild(firstItemClone);
        wrapper.insertBefore(lastItemClone, firstItem);
    }

    this.setFirstItem = function (container, wrapper, items)
    {
        const firstItem = _this.config.firstItem;
        const itemWidth = _this.getContainerWidth(container);
        const transformX = itemWidth * firstItem;
        const currentItem = items[firstItem - 1];

        wrapper.style.transform = 'translateX(-' + transformX + 'px)';
        currentItem.classList.add('slideshowCurrentItem');
    }

    this.setConfiguration = function (options, defaultOptions)
    {
        const configuration = new Object();

        if (typeof options === 'undefined') return defaultOptions;

        for (const optionName in defaultOptions) {
            if (typeof defaultOptions[optionName] === 'object') {
                configuration[optionName] = _this.setConfiguration(options[optionName], defaultOptions[optionName]);
            } else {
                configuration[optionName] = options[optionName];
            }

            if (!options.hasOwnProperty(optionName)) {
                configuration[optionName] = defaultOptions[optionName];
            }
        }

        return configuration;
    }

    this.getContainerWidth = function (container)
    {
        return container.getBoundingClientRect().width;
    }

    this.getContainers = function ()
    {
        return document.querySelectorAll(_this.config.selectors.container);
    }

    this.getWrapper = function (container)
    {
        return container.querySelector(_this.config.selectors.wrapper);
    }

    this.getItems = function (wrapper)
    {
        return wrapper.querySelectorAll(_this.config.selectors.item);
    }

    this.getPreviousButton = function (container)
    {
        return container.querySelector(_this.config.selectors.previous);
    }

    this.getNextButton = function (container)
    {
        return container.querySelector(_this.config.selectors.next);
    }

    this.getCurrentItem = function (wrapper)
    {
        return wrapper.querySelector('.slideshowCurrentItem');
    }

    this.getCurrentTransform = function (string)
    {
        return string.replace(/[^\d.]/g, '');
    }

    this.init();
}