/**
 * Module Loader - Load scripts only when needed
 * 
 * @author Marvin Arlt
 * @date 2020-04-10
 * @version 0.1
 */
function moduleLoader(options)
{
    for (let selector in options)
    {
        if (document.querySelector(selector) !== null)
        {
            const scripts = options[selector].scripts;
            let callback = options[selector].function;

            if (scripts.length > 0)
            {
                for (let i = 0; i < scripts.length; i++)
                {
                    const path = location.origin + scripts[i];
                    const script = document.createElement('script');

                    script.defer = true;
                    script.src = path;

                    document.body.appendChild(script);
                }
            }

            if (typeof callback === 'string')
            {
                callback = window[callback];
            }

            if (typeof callback === 'function')
            {
                callback();
            }
        }
    }
}