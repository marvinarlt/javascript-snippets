moduleLoader({
    "*": {
        "modules": ["/js/myfile.js"],
        "callback": "always"
    }
}, false, {domain: true});

function always()
{
    console.log('always');
}

/**
 * Module Loader - Load scripts only when needed
 * 
 * @author Marvin Arlt
 * @date 2020-07-19
 * @version 0.5
 */
function moduleLoader(options, debug, settings)
{
    let modules = [];
    let callbacks = [];

    const loadModules = function (modules, callbacks, index)
    {
        let module = modules[index];
        let extension = module.indexOf('css') == -1 ? 'js' : 'css';
        let modulePath = (typeof settings != 'undefined' && settings.domain) ? location.origin + module : module;
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

            if (index < modules.length - 1) {
                loadModules(modules, callbacks, index + 1);
            } else {
                for (let callbackIndex in callbacks) {
                    callbacks[callbackIndex]();

                    if (debug) console.info('moduleLoader: Callback function(s) executed');
                }
            }
        }

        moduleElement.onerror = function ()
        {
            if (debug) console.info('moduleLoader: Could not load module [' + module + ']');

            if (index < modules.length - 1) {
                loadModules(modules, callbacks, index + 1);
            }
        }
    }

    for (let selector in options) {
        if (document.querySelector(selector) === null) {
            if (debug) console.info('moduleLoader: Selector "' + selector + '" not found.');
            continue;
        }

        let callback = options[selector].callback;
        let module = options[selector].modules;

        callback = (typeof callback === 'string') ? window[callback] : callback;
        callbacks.push(callback);

        for (let moduleIndex in module) {
            if (modules.indexOf(module[moduleIndex]) == -1) {
                modules.push(module[moduleIndex]);
            }
        }
    }

    loadModules(modules, callbacks, 0);
}