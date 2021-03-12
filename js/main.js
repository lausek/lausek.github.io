document.addEventListener('DOMContentLoaded', function() {
    const DELAY = 3000;
    const GREETINGS = [
        'Hej, jag heter',
        'привет, меня зовут',
        'Terve, minä olen',
        'Saluton, mi estas',
        'Hoi, ik ben',
        'Moin, ich bin',
        'Hey, I am',
    ];

    let greeting = document.getElementById('greeting');
    let counter = 0;

    greeting.style['opacity'] = 1;

    function fade(step, done) {
        let current = parseFloat(greeting.style['opacity']);
        let next = current + step;

        if(next <= 0 || 1 <= next) {
            done()
        } else {
            greeting.style['opacity'] = next;

            setTimeout(function() { fade(step, done) }, 100)
        }
    }

    function next() {
        // fade out
        fade(-0.1, function() {
            // set new text
            greeting.innerText = GREETINGS[counter];

            // fade in
            fade(0.1, function() {
                counter += 1;

                if(GREETINGS.length <= counter) {
                    counter = 0;
                }

                setTimeout(next, DELAY)
            })
        })
    }

    setTimeout(next, DELAY);
});
