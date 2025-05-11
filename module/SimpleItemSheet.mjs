/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {SimpleItemSheet}
 */
export class SimpleItemSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {
    /** @override */
    DEFAULT_OPTIONS = {
        position: {
            width: 900,
            height: "auto"
        },
        classes: [
          game.system.id,
          "sheet",
          "item"
        ],
        tag: "form",
        form: {
          submitOnChange: true,
        },
        window: {
          resizable: true,
        }
    };

    /* -------------------------------------------- */

    /** @override */
    PARTS = {
        config: {
            template: `${game.template_path}/sheets/items/${this.item.type}-sheet.hbs`
        }
    };

    /* -------------------------------------------- */

    /** @override */
    async _prepareContext(options) {
        var context = await super._prepareContext(options);
        context.editable = this.options.editable;
        context.actor = context.data;
        context.system = context.document.system;
        console.log()
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