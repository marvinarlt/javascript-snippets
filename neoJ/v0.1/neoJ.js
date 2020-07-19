/**
 * NeoJ - A small javascript libary
 * 
 * @author Marvin Arlt
 * @version 0.1
 */
function NeoJ()
{
    /**
     * Merge two option objects into one final option object
     * 
     * @param {object} options - User options
     * @param {object} defaultOptions - Default options
     */
    this.mergeConfig = function (options, defaultOptions)
    {
        if (typeof options === 'undefined') return defaultOptions;

        for (let optionName in options) {
            if (defaultOptions.hasOwnProperty(optionName) && typeof options === 'object' && typeof defaultOptions === 'object') {
                defaultOptions[optionName] = this.mergeConfig(options[optionName], defaultOptions[optionName]);
            }

            defaultOptions[optionName] = options[optionName];
        }

        return defaultOptions;
    }

    /**
     * Adds a class with the scroll direction to an element
     * 
     * @param {node} element - Element where the class should be added
     */
    this.scrollDirectionClass = function (element)
    {
        let lastPageY = 0;

        window.addEventListener('scroll', function ()
        {
            const pageY = window.pageYOffset;

            if (pageY > lastPageY) {
                element.classList.remove('scrollUp');
                element.classList.add('scrollDown');
            } else {
                element.classList.remove('scrollDown');
                element.classList.add('scrollUp');
            }

            lastPageY = pageY <= 0 ? 0 : pageY;
        });
    }

    /**
     * Adds useful classes to the body element
     */
    this.bodyClass = function ()
    {
        const bodyClass = [];
        const pathname = window.location.pathname;

        if (pathname == '/') {
            bodyClass.push('index');
        }

        const path = pathname.split('/');

        for (let pathIndex = 0; pathIndex < path.length; pathIndex++) {
            bodyClass.push(this.slugify(path[pathIndex]));
        }

        bodyClass.push(this.slugify(pathname));

        let bodyClassString = bodyClass.join();
        bodyClassString = bodyClassString.replaceAll(',', ' ');
        bodyClassString = bodyClassString.trim();

        const browserName = this.getBrowser().name;
        const browser = this.getBrowser().name + this.getBrowser().version;
        bodyClassString += ' ' + this.slugify(browserName) + ' ' + this.slugify(browser);

        document.body.className += bodyClassString;
        neoJ.scrollDirectionClass(document.body);
    }

    /**
     * Converts a string into a class name
     * 
     * @param {string} string - String to convert into class name
     */
    this.slugify = function (string)
    {
        string = string.trim();
        string = string
            .replaceAll('/', ' ')
            .replaceAll('-', ' ');
        string = string.toCamelCase();

        return string;
    }

    /**
     * Returns browser name and version
     * 
     * @return {object}
     */
    this.getBrowser = function ()
    {
        const userAgent = navigator.userAgent;
        const ieNameRegEx = /trident/i;
        const ieVersionRegEx = /\brv[ :]+(\d+)/g;
        let match = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i);
        let browserName = match[1];
        let browserVersion = match[2];
        let operaVersion = null;

        if (ieNameRegEx.test(browserName)) {
            browserName = 'Internet Explorer';
            browserVersion = ieVersionRegEx.exec(userAgent)[1];
            
            return {
                name: browserName,
                version: browserVersion
            }
        }
        
        if (browserName === 'Chrome') {
            operaVersion = userAgent.match(/\bOPR\/(\d+)/);
        }

        if (operaVersion != null) {
            browserName = 'Opera';
            browserVersion = operaVersion[1];

            return {
                name: browserName,
                version: browserVersion
            }
        }

        match = browserVersion ? [browserName, browserVersion] : [navigator.appName, navigator.appVersion, '-?'];
        browserVersion = userAgent.match(/version\/(\d+)/i);
        
        if (browserVersion != null) {
            match.splice(1, 1, browserVersion[1]);
        }
        
        browserName = match[0];
        browserVersion = match[1];

        return {
            name: browserName,
            version: browserVersion
        }
    }
}



/**
 * Some string prototype functions
 */
String.prototype.toCamelCase = function () {
    let string = this;
    string = string.trim();

    const words = string.split(' ');
    let camelCaseString = words[0].toLowerCase();
    
    if (words.length === 1) {
        camelCaseString = camelCaseString.trim();

        return camelCaseString;
    }

    for (let wordIndex = 1; wordIndex < words.length; wordIndex++) {
        let word = words[wordIndex];

        for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
            let letter = word[letterIndex];
            letter = (letterIndex == 0) ? letter.toUpperCase() : letter.toLowerCase();
            camelCaseString += letter;
        }
    }

    return camelCaseString;
}

String.prototype.replaceAll = function (find, replace)
{
    let string = this;
    const regularExpression = new RegExp(find, 'g');

    return string.replace(regularExpression, replace);
}

/**
 * Initialise this beautiful libary
 */
const neoJ = new NeoJ();