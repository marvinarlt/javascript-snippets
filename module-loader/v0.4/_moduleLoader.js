moduleLoader({
    "*": {
        "modules": ["/js/myfile.js"],
        "callback": "always"
    }
}, false);

function always()
{
    console.log('always');
}

/**
 * Module Loader - Load scripts only when needed
 * 
 * @author Marvin Arlt
 * @date 2020-06-30
 * @version 0.4
 */
function moduleLoader(options, debug)
{
    const load = function (modules, callback)
    {
        if ((typeof modules === 'undefined' || modules.length === 0 || modules[0] === '') && typeof callback === 'function') {
            callback();
            if (debug) console.info('moduleLoader: Callback function executed');
            return;
        }
        
        for (let i = 0; i < modules.length; i++) {
            const module = modules[i];
            const splitedModule = module.split('.');
            const lastKey = splitedModule.length - 1;
            const extension = splitedModule[lastKey];
            const modulePath = location.origin + module;
            let moduleElement = null;
            
            if (extension === 'css') {
                moduleElement = document.createElement('link');
                moduleElement.rel = 'stylesheet';
                moduleElement.href = modulePath;

                document.head.appendChild(moduleElement);
            }

            if (extension === 'js') {
                moduleElement = document.createElement('script');
                moduleElement.defer = 'defer';
                moduleElement.src = modulePath;

                document.body.appendChild(moduleElement);
            }

            moduleElement.onload = function ()
            {
                if (debug) console.info('moduleLoader: ' + module + ' loaded');
    
                if (typeof callback !== 'function') {
                    return;
                }
                
                try {
                    callback();
                } catch (error) {
                    if (debug) console.error(error);
                }

                if (debug) console.info('moduleLoader: Callback function executed [' + module + ']');
            }
        }
    }

    for (let selector in options) {
        if (document.querySelector(selector) === null) continue;

        let modules = options[selector].modules;
        let callback = options[selector].callback

        if (typeof callback === 'string') {
            callback = window[callback];
        }
        
        load(modules, callback);
    }
}