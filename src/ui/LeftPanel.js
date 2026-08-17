export class LeftPanel {

    constructor() {

        this.element =
            document.createElement('div');

        this.element.className =
            'left-panel-container';

        document.body.appendChild(
            this.element
        );
    }


    getElement() {

        return this.element;
    }
}