/**
 * Animate In - A simple tool to animate elements on scroll in
 * 
 * @author Marvin Arlt
 * @date 2020-02-26
 * @version 1.0.0
 * 
 * Init:
 *  var animateIn = new AnimateIn({
 *      selector: '.animate-in',
 *      activeClass: 'animated-in';
 *      offset: 25,
 *      reanimate: false
 *  });
 * 
 * Html Markup:
 *  <div class="animate-in" data-animate-in-delay="500"></div>
 */
var AnimateIn = function(args)
{
    var _this = this;
    const userArgs = (typeof args !== 'undefined') ? args : {};
    const defaultArgs = {
        selector: '.animate-in',
        activeClass: 'animated-in',
        offset: 25,
        reanimate: false
    };

    _this.config = {};
    
    for (var key in defaultArgs)
    {
        this.config[key] = userArgs.hasOwnProperty(key) ? userArgs[key] : defaultArgs[key];
    }

    var init = function()
    {
        const elements = document.querySelectorAll(_this.config.selector);
        const scrollPosition = window.innerHeight;
        const offsetHeight = (scrollPosition / 100) * _this.config.offset;

        for(var i = 0; i < elements.length; i++)
        {
            const element = elements[i];
            const elementPosition = element.getBoundingClientRect().top + offsetHeight;
            const delay = (typeof element.dataset.animateInDelay !== 'undefined') ? element.dataset.animateInDelay : 0;
            
            setTimeout(function()
            {
                if (elementPosition < scrollPosition)
                {
                    element.classList.add(_this.config.activeClass);
                }
                else if (_this.config.reanimate)
                {
                    element.classList.remove(_this.config.activeClass);
                }
            }, delay);
        }
    }
    init();

    document.addEventListener('scroll', init);
}