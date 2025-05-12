/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {SimpleActorSheet}
 */
export class SimpleActorSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
    /** @override */
    static DEFAULT_OPTIONS = {
        position: {
            width: 580,
            height: "auto"
        },
        classes: [
          "cosmoboys",
          "sheet",
          "actor"
        ],
        //tag: "form",
        form: {
          submitOnChange: true,
        },
        window: {
          resizable: true,
        }
    };

    /* -------------------------------------------- */

    /** @override */
    static PARTS = {
        config: {
            template: `systems/cosmoboys/templates/sheets/actors/hero-sheet.hbs`
        }
    };

    /* -------------------------------------------- */

    /** @override */
    async _prepareContext(options) {
        
        const context = {
            //fields: this.document.schema.fields,
            //systemFields: this.document.system.schema.fields,
            actor: this.document,
            system: this.document.system,
            source: this.document.toObject(),
            enrichedDescription: await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.document.system.description, { async: true }),
            isEditMode: this.isEditMode,
            isPlayMode: this.isPlayMode,
            isEditable: this.isEditable
        }

        game.logger.log(context);
        return context;
    }

    /* -------------------------------------------- */

     /** @override */
     _onRender(context, options) {
        super._onRender((context, options));
        const html = $(this.element);

    }
}