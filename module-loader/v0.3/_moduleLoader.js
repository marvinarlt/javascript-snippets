moduleLoader({
    '*': {
        'scripts': ['/assets/js/navigation.js', '/assets/js/scrollDirectionClass.js'],
        'function': 'always'
    }
});

function always()
{
    new Navigation('#naviRight', '#naviToggler');
    new ScrollDirectionClass();
}

/**
 * Module Loader - Load scripts only when needed
 * 
 * @author Marvin Arlt
 * @date 2020-05-24
 * @version 0.3
 */
function moduleLoader(options)
{
    for (let selector in options) {
        if (document.querySelector(selector) === null) return;

        const scripts = options[selector].scripts;
        let callback = options[selector].function;

        const readyScripts = [];
        const check = function ()
        {
            if (scripts === undefined || readyScripts.length === scripts.length) {
                callback();
                clearInterval(interval);
            }
        }

        if (typeof callback === 'string') {
            callback = window[callback];
        }

        if (scripts !== undefined && scripts.length !== 0) {
            for (let i = 0; i < scripts.length; i++) {
                const path = location.origin + scripts[i];
                const script = document.createElement('script');
                
                script.defer = true;
                script.src = path;
                
                document.body.appendChild(script);
    
                script.onload = function ()
                {
                    readyScripts.push(script);
                }
            }
        }

        if (typeof callback !== 'function') return;        

        const interval = setInterval(check, 10);
    }
}