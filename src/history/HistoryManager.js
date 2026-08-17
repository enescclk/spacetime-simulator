export class HistoryManager {

    constructor({
        maxHistory = 100
    } = {}) {

        this.undoStack = [];

        this.redoStack = [];

        this.maxHistory =
            maxHistory;


        this.isRestoring =
            false;
    }


    // =============================================
    // EXECUTION STATE
    // =============================================

    getIsRestoring() {

        return this.isRestoring;
    }


    // =============================================
    // PUSH ACTION
    // =============================================

    push(action) {

        if (
            this.isRestoring ||
            !action ||
            typeof action.undo !== 'function' ||
            typeof action.redo !== 'function'
        ) {
            return;
        }


        this.undoStack.push(
            action
        );


        /*
         * Yeni bir işlem yapıldıysa eski redo
         * zinciri artık geçersizdir.
         */

        this.redoStack.length =
            0;


        if (
            this.undoStack.length >
            this.maxHistory
        ) {

            this.undoStack.shift();

        }
    }


    // =============================================
    // UNDO
    // =============================================

    undo() {

        if (
            this.undoStack.length === 0
        ) {
            return;
        }


        const action =
            this.undoStack.pop();


        this.isRestoring =
            true;


        try {

            action.undo();

        } finally {

            this.isRestoring =
                false;

        }


        this.redoStack.push(
            action
        );
    }


    // =============================================
    // REDO
    // =============================================

    redo() {

        if (
            this.redoStack.length === 0
        ) {
            return;
        }


        const action =
            this.redoStack.pop();


        this.isRestoring =
            true;


        try {

            action.redo();

        } finally {

            this.isRestoring =
                false;

        }


        this.undoStack.push(
            action
        );
    }


    // =============================================
    // CLEAR
    // =============================================

    clear() {

        this.undoStack.length =
            0;


        this.redoStack.length =
            0;
    }


    // =============================================
    // STATE
    // =============================================

    canUndo() {

        return (
            this.undoStack.length > 0
        );
    }


    canRedo() {

        return (
            this.redoStack.length > 0
        );
    }
}