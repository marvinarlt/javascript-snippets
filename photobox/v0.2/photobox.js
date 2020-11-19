/**
 * Photobox
 * 
 * @version 0.1
 * @since 2020-11-18
 * 
 * @param {object} options
 * @return {object}
 */
function Photobox(options) 
{
  const _this = this;
  const DEFAULT_OPTIONS = {
    selectors: {
      gallery: '.photoboxGallery',
      image: '.photoboxImage'
    },
    classes: {
      container: 'photoboxContainer',
      content: 'photoboxContent',
      contentImage: 'photoboxContentImage',
      contentTitle: 'photoboxContentTitle',
      navigation: 'photoboxNavigation',
      close: 'photoboxClose',
      previous: 'photoboxDirection photoboxPrevious',
      next: 'photoboxDirection photoboxNext',
      visible: 'photoboxVisible'
    },
    buttonContent: {
      close: '',
      previous: '',
      next: ''
    },
    loader: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    keyboardControl: true
  };

  /**
   * @param {object} options
   * 
   * @return {void}
   */
  this.construct = function (options)
  {
    this.params = this.merge(DEFAULT_OPTIONS, options);

    this.params.galleries = [...document.querySelectorAll(this.params.selectors.gallery)];

    this.generateMarkup();
    this.initGalleries();

    if (this.params.keyboardControl) {
      document.addEventListener('keyup', function (event) {
        _this.initKeyboardControl(event.code);
      });
    }
  }

  /**
   * @param {string} keyCode
   * 
   * @return {void}
   */
  this.initKeyboardControl = function (keyCode)
  {
    switch (keyCode) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowRight':
        this.openImage(this.getNext());
        break;
      case 'ArrowLeft':
        this.openImage(this.getPrevious());
        break;
      default:
        break;
    }
  }

  /**
   * @return {void}
   */
  this.initGalleries = function ()
  {
    for (let i = 0; i < this.params.galleries.length; i++) {
      let gallery = this.params.galleries[i];

      gallery.images = [...gallery.querySelectorAll(this.params.selectors.image)];

      this.addImageClickEvent(this.params.galleries[i].images);
    }
  }

  /**
   * @param {array} images
   * 
   * @return {void}
   */
  this.addImageClickEvent = function (images)
  {
    for (let image of images) {
      image.addEventListener('click', function () {
        let activeGallery = image.closest(_this.params.selectors.gallery);

        _this.setActiveGallery(activeGallery, images);
        _this.openImage(image);
      });
    }
  }

  /**
   * @param {node} gallery
   * @param {node} images
   * 
   * @return {void}
   */
  this.setActiveGallery = function (gallery, images)
  {
    this.params.currentGallery = gallery;
    this.params.currentGallery.images = images
  }

  /**
   * @param {node} image
   * 
   * @return {void}
   */
  this.openImage = function (image)
  {
    if (image == null) {
      return;
    }

    let contentImage = this.params.container.content.contentImage;
    let contentTitle = this.params.container.content.contentTitle;

    contentImage.src = image.src;
    contentImage.alt = image.alt;
    contentTitle.innerHTML = image.alt;

    this.params.currentImage = image;

    this.open();
  }

  /**
   * @return {void}
   */
  this.open = function ()
  {
    this.params.container.classList.add(_this.params.classes.visible);
  }

  /**
   * @return {void}
   */
  this.close = function ()
  {
    this.params.container.classList.remove(this.params.classes.visible);
  }

  /**
   * @return {node}
   */
  this.getNext = function ()
  {
    let currentImage = this.params.currentImage;
    let currentGallery = this.params.currentGallery;
    let index = this.getActiveImageIndex(currentGallery, currentImage);

    if (currentGallery.length === index) {
      return;
    }

    return currentGallery.images[index + 1];
  }

  /**
   * @return {node}
   */
  this.getPrevious = function ()
  {
    let currentImage = this.params.currentImage;
    let currentGallery = this.params.currentGallery;
    let index = this.getActiveImageIndex(currentGallery, currentImage);

    if (0 >= index) {
      return;
    }

    return currentGallery.images[index - 1];
  }

  /**
   * @param {node} activeGallery
   * @param {node} currentImage
   * 
   * @return {int}
   */
  this.getActiveImageIndex = function (activeGallery, currentImage)
  {
    return activeGallery.images.indexOf(currentImage);
  }

  /**
   * @return {void}
   */
  this.generateMarkup = function ()
  {
    let container = this.createContainer();

    container.navigation = this.createNavigation();
    container.content = this.createContent();

    container.appendChild(container.navigation);
    container.appendChild(container.content);

    this.params.container = container;

    let body = document.body;
    let firstScript = body.querySelector('script');

    body.insertBefore(container, firstScript);
  }

  /**
   * Creates the container element. Something like this:
   * <div class="photoboxContainer"></div>
   * 
   * @return {node}
   */
  this.createContainer = function ()
  {
    let container = document.createElement('div');

    container.className = this.params.classes.container;

    return container;
  }

  /**
   * Creates the content element. Something like this:
   * <div class="photoboxContent"></div>
   * 
   * @return {node}
   */
  this.createContent = function ()
  {
    let content = document.createElement('div');

    content.classList.add(this.params.classes.content);

    content.contentImage = this.createContentImage();
    content.contentTitle = this.createContentTitle();

    content.appendChild(content.contentImage);
    content.appendChild(content.contentTitle);

    return content;
  }

  /**
   * Creates the content image element. Something like this:
   * <img class="photoboxContentImage" src="/images/loader.svg" alt="Loading ...">
   * 
   * @return {node}
   */
  this.createContentImage = function ()
  {
    let contentImage = document.createElement('img');

    contentImage.className = this.params.classes.contentImage;
    contentImage.src = this.params.loader;
    contentImage.alt = 'Loading ...';

    return contentImage;
  }

  /**
   * Creates the content image element. Something like this:
   * <span class="photoboxContentTitle"></span>
   * 
   * @return {node}
   */
  this.createContentTitle = function ()
  {
    let contentTitle = document.createElement('span');

    contentTitle.className = this.params.classes.contentTitle;

    return contentTitle;
  }

  /**
   * Creates the content image element. Something like this:
   * <div class="photoboxNavigation"></div>
   * 
   * @return {node}
   */
  this.createNavigation = function ()
  {
    let navigation = document.createElement('div');

    navigation.className = this.params.classes.navigation;

    navigation.close = this.createClose();
    navigation.previous = this.createPrevious();
    navigation.next = this.createNext();

    navigation.appendChild(navigation.close);
    navigation.appendChild(navigation.previous);
    navigation.appendChild(navigation.next);

    return navigation;
  }

  /**
   * Creates the close button element. Something like this:
   * <span class="photoboxClose"></span>
   * 
   * @return {node}
   */
  this.createClose = function ()
  {
    let close = document.createElement('span');

    close.className = this.params.classes.close;
    close.innerHTML = this.params.buttonContent.close;

    close.addEventListener('click', function () {
      _this.close();
    }, false);

    return close;
  }

  /**
   * Creates the previous button element. Something like this:
   * <span class="photoboxPrevious"></span>
   * 
   * @return {node}
   */
  this.createPrevious = function ()
  {
    let previous = document.createElement('span');

    previous.className = this.params.classes.previous;
    previous.innerHTML = this.params.buttonContent.previous;

    previous.addEventListener('click', function () {
      _this.openImage(_this.getPrevious());
    });

    return previous;
  }

  /**
   * Creates the next button element. Something like this:
   * <span class="photoboxNext"></span>
   * 
   * @return {node}
   */
  this.createNext = function ()
  {
    let next = document.createElement('span');

    next.className = this.params.classes.next;
    next.innerHTML = this.params.buttonContent.next;

    next.addEventListener('click', function () {
      _this.openImage(_this.getNext());
    });

    return next;
  }

  /**
   * @param {object} target
   * @param {object} source
   * 
   * @return {object}
   */
  this.merge = function (target, source)
  {
    if (source == null) {
      return target;
    }

    for (let key of Object.keys(source)) {
      if (source[key] instanceof Object && target.hasOwnProperty(key)) {
        Object.assign(source[key], this.merge(target[key], source[key]));
      }
    }

    Object.assign(target || {}, source);

    return target;
  }

  this.construct(options);
}