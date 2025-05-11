/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {SimpleActorSheet}
 */
export class SimpleActorSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
    /** @override */
    DEFAULT_OPTIONS = {
        position: {
            width: 900,
            height: "auto"
        },
        classes: [
          game.system.id,
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
        var context = await super._prepareContext(options);
        context.editable = this.options.editable;
        context.actor = context.data;
        context.system = context.document.system;

        game.logger.log(context)
        return context;
    }

    /* -------------------------------------------- */

     /** @override */
     _onRender(context, options) {
        super._onRender((context, options));
        const html = $(this.element);

    }
}