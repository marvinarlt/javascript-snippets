const SETTINGS = {
  basePath: '/assets/js/',
  domain: true,
  debug: false
};

const MODULES = {
  '*': {
    'callback': function () {
      console.log('loaded');
    }
  }
};

new Loader(MODULES, SETTINGS);

/**
 * Loader
 * 
 * @version 0.6.1
 * 
 * @param {object} modulesAndCallbacks
 * @param {object} settings
 * 
 * @return {object}
 */
function Loader(modulesAndCallbacks, settings)
{
  const _this = this;

  this._defaultSettings = {
    basePath: '/',
    domain: false,
    debug: false
  };
  this._modules = [];
  this._callbacks = [];

  this.construct = function (modulesAndCallbacks, settings)
  {
    this.settings = Object.assign(this._defaultSettings, settings);

    this.setModulesAndCallbacks(modulesAndCallbacks);

    if (this._modules.length > 0) {
      this.load(0);
    }
  }

  this.setModulesAndCallbacks = function (modulesAndCallbacks)
  {
    for (let selector in modulesAndCallbacks) {
      let element = document.querySelector(selector);
      
      if (element === null) {
        if (this.settings.debug) console.info('moduleLoader: Selector "' + selector + '" not found.');
        continue;
      }

      let modules = modulesAndCallbacks[selector].modules;
      let callback = modulesAndCallbacks[selector].callback;

      if (typeof modules !== 'undefined' && modules.length > 0) {
        this._modules.push(...modules);
      }

      if (typeof callback !== 'undefined') {
        callback = typeof callback === 'string' ? window[callback] : callback;

        this._callbacks.push(callback);
      }
    }
  }

  this.load = function (iteration)
  {
    let module = this.settings.basePath + this._modules[iteration];
    let extension = module.indexOf('js') !== -1 ? 'js' : 'css';
    let path = this.settings.domain ? location.origin + module : module;
    let domElement = this.getElement(path, extension);

    if (domElement === null) {
      this.load(iteration + 1);

      return;
    }

    domElement.onload = function ()
    {
      if (_this.settings.debug) console.info('moduleLoader: ' + module + ' loaded');

      if (iteration === _this._modules.length - 1) {
        _this.executeCallbacks();
        return;
      }

      _this.load(iteration + 1);
    }

    domElement.onerror = function ()
    {
      if (_this.settings.debug) console.info('moduleLoader: Could not load module [' + module + ']');

      if (iteration === _this._modules.length) {
        return;
      }
      
      _this.load(iteration + 1);
    }
  }

  this.getElement = function (path, extension)
  {
    let element = null;

    switch (extension) {
      case 'js':
        element = document.createElement('script');
        element.defer = 'defer';
        element.src = path;
        break;
      case 'css':
        element = document.createElement('link');
        element.rel = 'stylesheet';
        element.href = path;
        break;
      default:
        break;
    }

    if (element === null) {
      if (this.settings.debug) console.info('moduleLoader: Unknown extension "' + extension + '"');

      return null;
    }

    document.body.appendChild(element);

    return element;
  }

  this.executeCallbacks = function ()
  {
    let callbacks = this._callbacks;

    for (let index in callbacks) {
      callbacks[index]();

      if (this.settings.debug) console.info('moduleLoader: Callback function(s) executed');
    }
  }

  this.construct(modulesAndCallbacks, settings);
}