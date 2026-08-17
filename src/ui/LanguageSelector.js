export class LanguageSelector {

    constructor({
        languageManager
    }) {

        this.languageManager =
            languageManager;

        this.open =
            false;


        this.createUI();


        this.languageManager.subscribe(
            () => this.render()
        );
    }


    createUI() {

        this.panel =
            document.createElement('div');


        this.panel.className =
            'language-selector';


        document.body.appendChild(
            this.panel
        );


        this.render();
    }


    render() {

        const current =
            this.languageManager
                .getLanguage();


        const currentLabel =
            current === 'tr'
                ? 'TR'
                : 'EN';


        const other =
            current === 'tr'
                ? 'en'
                : 'tr';


        const otherLabel =
            other === 'tr'
                ? 'TR'
                : 'EN';


        this.panel.innerHTML = `

            ${
                this.open
                    ? `
                        <button
                            class="language-option"
                            data-language="${other}"
                        >
                            ${otherLabel}
                        </button>
                    `
                    : ''
            }


            <button
                class="language-current"
                id="language-current"
            >
                ${currentLabel}
            </button>

        `;


        const currentButton =
            this.panel.querySelector(
                '#language-current'
            );


        currentButton.addEventListener(
            'click',
            () => {

                this.open =
                    !this.open;


                this.render();
            }
        );


        const option =
            this.panel.querySelector(
                '[data-language]'
            );


        if (option) {

            option.addEventListener(
                'click',
                () => {

                    const language =
                        option.dataset.language;


                    this.open =
                        false;


                    this.languageManager
                        .setLanguage(
                            language
                        );


                    this.render();
                }
            );
        }
    }
}