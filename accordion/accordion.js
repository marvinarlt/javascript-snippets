/**
 * A simple accordion with some settings
 * 
 * @author Marvin Arlt
 * @date 2020-06-12
 * @version 1.2.0
 * 
 * Settings:
 *  selectors   - Use a standard CSS selector
 *  activeClass - Class for the active elements
 *  animation   - Toggle the animation
 *  openFirst   - Opens the first element on load
 *  forceOne    - Only one element can be open
 * 
 * Initialise example:
 *  var accordion = new Accordion({
 *      selector: '.myClassName',
 *      animation: false
 *  });
 * 
 * HTML Markup:
 *  <div class="accordion-container">
 *      <span class="accordion-title">Your title ...</span>
 *      <div class="accordion-content">
 *          Your content ...
 *      </div>
 *  </div>
 */
function Accordion(options)
{
    const _this = this;
    const defaultOptions = {
        selectors: {
            container: '.accordionContainer',
            title: '.accordionTitle',
            content: '.accordionContent'
        },
        activeClass: 'accordionActive',
        animation: true,
        openFirst: false,
        forceOne: true
    };

    this.init = function ()
    {
        this.config = this.setConfig(options, defaultOptions);

        const containers = document.querySelectorAll(this.config.selectors.container);

        for (let i = 0; i < containers.length; i++) {
            const container = containers[i];
            const title = container.querySelector(this.config.selectors.title);
            const content = container.querySelector(this.config.selectors.content);

            this.setAnimation(content);

            if (i == 0) {
                this.openFirst(container, content);
            }

            title.onclick = function ()
            {
                _this.closeAll(containers, container);
                _this.toggle(container, content);
            }
        }
    }

    this.toggle = function (container, content)
    {
        if (container.classList.contains(this.config.activeClass)) {
            this.close(container, content);
        } else {
            this.open(container, content);
        }
    }

    this.open = function (container, content)
    {
        container.classList.add(this.config.activeClass);
        content.style.height = content.scrollHeight + 'px';
    }

    this.close = function (container, content)
    {
        container.classList.remove(this.config.activeClass);
        content.style.height = null;
    }

    this.closeAll = function (containers, thisContainer)
    {
        if (!this.config.forceOne) {
            return false;
        }

        for (let i = 0; i < containers.length; i++) {
            const container = containers[i];

            if (thisContainer !== container) {
                const content = container.querySelector(this.config.selectors.content);
                this.close(container, content);
            }
        }
    }

    this.setAnimation = function (content)
    {
        if (this.config.animation) {
            content.style.transitionDuration = (content.scrollHeight * 2) + 'ms';
        }
    }

    this.openFirst = function (container, content)
    {
        if (this.config.openFirst) {
            this.open(container, content);
        }
    }

    this.setConfig = function (options, defaultOptions)
    {
        const config = new Object();

        if (typeof options === 'undefined') return defaultOptions;

        for (const optionName in defaultOptions) {
            if (typeof defaultOptions[optionName] === 'object') {
                config[optionName] = this.setConfig(options[optionName], defaultOptions[optionName]);
            } else {
                config[optionName] = options[optionName];
            }

            if (!options.hasOwnProperty(optionName)) {
                config[optionName] = defaultOptions[optionName];
            }
        }

        return config;
    }

    this.init();
}